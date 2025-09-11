import { Request, Response, NextFunction } from "express";
import { AuthService, JWTPayload } from "../lib/auth";
import pino from "pino";

const logger = pino({
  redact: ["authorization", "token"], // HIPAA: redact sensitive data
});

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      await AuthService.logAuthEvent("AUTH_FAILED", undefined, {
        reason: "NO_TOKEN",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      
      return res.status(401).json({ 
        error: "Access token required",
        code: "NO_TOKEN" 
      });
    }

    const decoded = AuthService.verifyToken(token);
    
    // Verify user still exists
    const user = await AuthService.getUserById(decoded.userId);
    if (!user) {
      await AuthService.logAuthEvent("AUTH_FAILED", decoded.userId, {
        reason: "USER_NOT_FOUND",
        ip: req.ip,
      });
      
      return res.status(401).json({ 
        error: "Invalid token",
        code: "USER_NOT_FOUND" 
      });
    }

    // Add user to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    // HIPAA audit log
    await AuthService.logAuthEvent("AUTH_SUCCESS", user.id, {
      endpoint: req.path,
      method: req.method,
      ip: req.ip,
    });

    next();
  } catch (error) {
    if (error instanceof Error) {
      await AuthService.logAuthEvent("AUTH_FAILED", undefined, {
        reason: "TOKEN_INVALID",
        error: error.message,
        ip: req.ip,
      });
    }

    return res.status(401).json({ 
      error: "Invalid token",
      code: "TOKEN_INVALID" 
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "AUTH_REQUIRED" 
      });
    }

    if (!roles.includes(req.user.role)) {
      AuthService.logAuthEvent("AUTHORIZATION_FAILED", req.user.userId, {
        requiredRoles: roles,
        userRole: req.user.role,
        endpoint: req.path,
      });

      return res.status(403).json({ 
        error: "Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS" 
      });
    }

    next();
  };
};

// Rate limiting middleware for auth endpoints
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const rateLimitAuth = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();
    const attempts = loginAttempts.get(ip);

    if (attempts) {
      // Reset if window has passed
      if (now - attempts.lastAttempt > windowMs) {
        loginAttempts.delete(ip);
      } else if (attempts.count >= maxAttempts) {
        logger.warn({
          event: "RATE_LIMIT_EXCEEDED",
          ip,
          attempts: attempts.count,
          endpoint: req.path,
        }, "Rate limit exceeded for authentication");

        return res.status(429).json({
          error: "Too many attempts. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: windowMs / 1000,
        });
      }
    }

    // Track this attempt
    loginAttempts.set(ip, {
      count: (attempts?.count || 0) + 1,
      lastAttempt: now,
    });

    next();
  };
};
