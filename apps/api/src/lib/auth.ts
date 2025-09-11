import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import pino from "pino";

const prisma = new PrismaClient();
const logger = pino({
  redact: ["email", "password", "token"], // HIPAA: redact sensitive data
});

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12; // High security for healthcare
  private static readonly JWT_EXPIRY = "15m"; // Short expiry for HIPAA compliance
  private static readonly REFRESH_TOKEN_EXPIRY = "7d";

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateTokens(user: { id: string; email: string; role: string }) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET not configured");
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, jwtSecret, { 
      expiresIn: this.JWT_EXPIRY,
      issuer: "asthma-api",
      audience: "asthma-app"
    });

    const refreshToken = jwt.sign(payload, jwtSecret, { 
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      issuer: "asthma-api",
      audience: "asthma-app"
    });

    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): JWTPayload {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET not configured");
    }

    return jwt.verify(token, jwtSecret, {
      issuer: "asthma-api",
      audience: "asthma-app"
    }) as JWTPayload;
  }

  static async createUser(userData: {
    email: string;
    password: string;
    role?: "PATIENT" | "ADMIN";
  }) {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "PATIENT",
      },
      select: {
        id: true,
        email: true,
        role: true,
        onboardingCompleted: true,
        currentOnboardingStep: true,
        createdAt: true,
        // Never select password
      },
    });

    // HIPAA audit log
    logger.info({
      event: "USER_CREATED",
      userId: user.id,
      userRole: user.role,
      timestamp: new Date().toISOString(),
    }, "New user registered");

    return user;
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true, // Only for authentication
        role: true,
        onboardingCompleted: true,
        currentOnboardingStep: true,
        createdAt: true,
      },
    });
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        onboardingCompleted: true,
        currentOnboardingStep: true,
        createdAt: true,
        // Never select password
      },
    });
  }

  static async logAuthEvent(event: string, userId?: string, metadata?: any) {
    logger.info({
      event,
      userId,
      timestamp: new Date().toISOString(),
      ...metadata,
    }, `Authentication event: ${event}`);
  }
}
