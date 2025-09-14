import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";
import { 
  userProfileSchema, 
  updateProfileSchema,
  childInfoOnboardingSchema,
  locationOnboardingSchema,
  medicationOnboardingSchema,
  notificationOnboardingSchema,
  completeOnboardingSchema
} from "../lib/validation";
import { logger } from "../lib/logger";
import { ZodError } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all profile routes
router.use(authenticateToken);

/**
 * GET /api/profile
 * Get current user's complete profile
 */
router.get("/", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        childFirstName: true,
        childLastName: true,
        childDateOfBirth: true,
        childSex: true,
        zipCode: true,
        medicationRemindersEnabled: true,
        dailyMedicationDoses: true,
        preferredMedicationTime: true,
        dailyLogRemindersEnabled: true,
        preferredDailyLogTime: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: "/profile",
      userId: req.user?.userId,
    }, "Failed to get user profile");

    res.status(500).json({
      error: "Failed to get user profile",
      code: "INTERNAL_ERROR",
    });
  }
});

/**
 * PATCH /api/profile
 * Update user profile
 */
router.patch("/", async (req, res) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    
    // Filter out undefined values for strict TypeScript
    const updateData: any = {};
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = key === 'childDateOfBirth' && value ? new Date(value as string) : value;
      }
    });

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        childFirstName: true,
        childLastName: true,
        childDateOfBirth: true,
        childSex: true,
        zipCode: true,
        medicationRemindersEnabled: true,
        dailyMedicationDoses: true,
        preferredMedicationTime: true,
        dailyLogRemindersEnabled: true,
        preferredDailyLogTime: true,
        onboardingCompleted: true,
        updatedAt: true,
      },
    });

    logger.info({ 
      userId: req.user!.userId,
      updatedFields: Object.keys(validatedData),
    }, "User profile updated");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: "/profile PATCH",
      userId: req.user?.userId,
    }, "Failed to update user profile");

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.issues,
      });
    }

    res.status(500).json({
      error: "Failed to update profile",
      code: "INTERNAL_ERROR",
    });
  }
});





/**
 * POST /api/profile/onboarding/complete
 * Complete entire onboarding in one request
 */
router.post("/onboarding/complete", async (req, res) => {
  try {
    const validatedData = completeOnboardingSchema.parse(req.body);
    
    const updateData: any = {
      childFirstName: validatedData.childFirstName,
      childLastName: validatedData.childLastName,
      childDateOfBirth: new Date(validatedData.childDateOfBirth),
      childSex: validatedData.childSex,
      zipCode: validatedData.zipCode,
      medicationRemindersEnabled: validatedData.medicationRemindersEnabled,
      dailyLogRemindersEnabled: validatedData.dailyLogRemindersEnabled,
      onboardingCompleted: true,
    };
    if (validatedData.dailyMedicationDoses !== undefined) {
      updateData.dailyMedicationDoses = validatedData.dailyMedicationDoses;
    }
    if (validatedData.preferredMedicationTime !== undefined) {
      updateData.preferredMedicationTime = validatedData.preferredMedicationTime;
    }
    if (validatedData.preferredDailyLogTime !== undefined) {
      updateData.preferredDailyLogTime = validatedData.preferredDailyLogTime;
    }

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: updateData,
    });

    logger.info({ 
      userId: req.user!.userId,
    }, "Complete onboarding finished");

    res.json({
      success: true,
      message: "Onboarding completed successfully",
      onboardingCompleted: true,
    });
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: "/profile/onboarding/complete",
      userId: req.user?.userId,
    }, "Failed to complete onboarding");

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.issues,
      });
    }

    res.status(500).json({
      error: "Failed to complete onboarding",
      code: "INTERNAL_ERROR",
    });
  }
});

/**
 * GET /api/profile/onboarding/status
 * Get current onboarding status
 */
router.get("/onboarding/status", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        onboardingCompleted: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      onboardingCompleted: user.onboardingCompleted,
    });
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint: "/profile/onboarding/status",
      userId: req.user?.userId,
    }, "Failed to get onboarding status");

    res.status(500).json({
      error: "Failed to get onboarding status",
      code: "INTERNAL_ERROR",
    });
  }
});

export default router;
