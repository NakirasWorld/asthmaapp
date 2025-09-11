import express from "express";
import { AuthService } from "../lib/auth";
import { registerSchema, loginSchema } from "../lib/validation";
import { authenticateToken, rateLimitAuth } from "../middleware/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { logger } from "../lib/logger";

const router = express.Router();

// Apply rate limiting to all auth routes (relaxed for development)
router.use(rateLimitAuth(50, 5 * 60 * 1000)); // 50 attempts per 5 minutes

/**
 * POST /api/auth/register
 * Register a new user with HIPAA-compliant validation
 */
router.post("/register", async (req, res) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    
    // Create user
    const user = await AuthService.createUser({
      email: validatedData.email,
      password: validatedData.password,
      role: validatedData.role,
    });

    // Generate tokens
    const { accessToken, refreshToken } = AuthService.generateTokens(user);

    // HIPAA audit log
    await AuthService.logAuthEvent("USER_REGISTERED", user.id, {
      userRole: user.role,
      ip: req.ip || "unknown",
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        currentOnboardingStep: user.currentOnboardingStep,
        createdAt: user.createdAt,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: "15m",
      },
    });

  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: "/register",
      ip: req.ip,
    }, "Registration failed");

    // Handle duplicate email - check both Prisma error types
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({
        error: "Email already registered",
        code: "EMAIL_EXISTS",
      });
    }
    
    // Alternative check for Prisma unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return res.status(409).json({
        error: "Email already registered",
        code: "EMAIL_EXISTS",
      });
    }

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: JSON.parse(error.message),
      });
    }

    res.status(500).json({
      error: "Registration failed",
      code: "INTERNAL_ERROR",
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT tokens
 */
router.post("/login", async (req, res) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    
    // Find user
    const user = await AuthService.getUserByEmail(validatedData.email);
    if (!user) {
      await AuthService.logAuthEvent("LOGIN_FAILED", undefined, {
        reason: "USER_NOT_FOUND",
        email: validatedData.email,
        ip: req.ip || "unknown",
      });

      return res.status(401).json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Verify password
    const isValidPassword = await AuthService.comparePassword(
      validatedData.password,
      user.password
    );

    if (!isValidPassword) {
      await AuthService.logAuthEvent("LOGIN_FAILED", user.id, {
        reason: "INVALID_PASSWORD",
        ip: req.ip || "unknown",
      });

      return res.status(401).json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = AuthService.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // HIPAA audit log
    await AuthService.logAuthEvent("LOGIN_SUCCESS", user.id, {
      ip: req.ip || "unknown",
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        currentOnboardingStep: user.currentOnboardingStep,
        createdAt: user.createdAt,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: "15m",
      },
    });

  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: "/login",
      ip: req.ip,
    }, "Login failed");

    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: JSON.parse(error.message),
      });
    }

    res.status(500).json({
      error: "Login failed",
      code: "INTERNAL_ERROR",
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token required",
        code: "NO_REFRESH_TOKEN",
      });
    }

    // Verify refresh token
    const decoded = AuthService.verifyToken(refreshToken);
    
    // Verify user still exists
    const user = await AuthService.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: "Invalid refresh token",
        code: "USER_NOT_FOUND",
      });
    }

    // Generate new tokens
    const newTokens = AuthService.generateTokens(user);

    await AuthService.logAuthEvent("TOKEN_REFRESHED", user.id, {
      ip: req.ip || "unknown",
    });

    res.json({
      success: true,
      tokens: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        expiresIn: "15m",
      },
    });

  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: "/refresh",
    }, "Token refresh failed");

    res.status(401).json({
      error: "Invalid refresh token",
      code: "INVALID_REFRESH_TOKEN",
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (client should discard tokens)
 */
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    await AuthService.logAuthEvent("LOGOUT", req.user?.userId, {
      ip: req.ip || "unknown",
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: "/logout",
    }, "Logout failed");

    res.status(500).json({
      error: "Logout failed",
      code: "INTERNAL_ERROR",
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await AuthService.getUserById(req.user!.userId);
    
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        currentOnboardingStep: user.currentOnboardingStep,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: "/me",
      userId: req.user?.userId,
    }, "Failed to get user profile");

    res.status(500).json({
      error: "Failed to get user profile",
      code: "INTERNAL_ERROR",
    });
  }
});

export default router;
