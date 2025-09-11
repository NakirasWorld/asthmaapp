import { z } from "zod";

// Relaxed password requirements for better UX
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
    "Password must contain uppercase, lowercase, and number");

export const emailSchema = z
  .string()
  .email("Invalid email format")
  .max(255, "Email too long")
  .transform(val => val.toLowerCase());

// Registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(["PATIENT", "ADMIN"]).default("PATIENT"),
  termsAccepted: z.boolean().refine(val => val === true, "Must accept terms"),
  hipaaNoticeAcknowledged: z.boolean().refine(val => val === true, "Must acknowledge HIPAA notice"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password required"),
});

// Enhanced User Profile Schema
export const userProfileSchema = z.object({
  // Parent/Guardian Information
  firstName: z.string().min(1, "First name required").max(50, "First name too long").optional(),
  lastName: z.string().min(1, "Last name required").max(50, "Last name too long").optional(),
  
  // Child Information (Primary focus)
  childFirstName: z.string().min(1, "Child's first name required").max(50, "Child's first name too long").optional(),
  childLastName: z.string().min(1, "Child's last name required").max(50, "Child's last name too long").optional(),
  childDateOfBirth: z.string().datetime().optional().or(z.date().optional()),
  childSex: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  
  // Location Information
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format").optional(),
  
  // Medication Reminder Settings
  medicationRemindersEnabled: z.boolean().default(false),
  dailyMedicationDoses: z.number().min(0).max(10).optional(),
  preferredMedicationTime: z.string().regex(/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/, "Invalid time format").optional(),
  
  // Daily Log Reminder Settings
  dailyLogRemindersEnabled: z.boolean().default(false),
  preferredDailyLogTime: z.string().regex(/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/, "Invalid time format").optional(),
});

// Medication Reminder Schema
export const medicationReminderSchema = z.object({
  name: z.string().min(1, "Medication name required").max(100, "Name too long"),
  dosage: z.string().max(50, "Dosage description too long").optional(),
  time: z.string().regex(/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/, "Invalid time format"),
  frequency: z.enum(["DAILY", "WEEKLY", "AS_NEEDED", "TWICE_DAILY", "THREE_TIMES_DAILY"]).default("DAILY"),
  isActive: z.boolean().default(true),
});

// Enhanced Asthma Entry Schema
export const asthmaEntrySchema = z.object({
  symptoms: z.array(z.string()).min(1, "At least one symptom required"),
  peakFlow: z.number().min(50).max(800).optional(), // Typical range for peak flow
  spo2: z.number().min(70).max(100).optional(), // SpO2 percentage range
  rescuePuffs: z.number().min(0).max(20).optional(), // Reasonable range for rescue inhaler
  notes: z.string().max(500, "Notes too long").optional(),
  location: z.string().max(100, "Location too long").optional(),
  triggers: z.array(z.string()).optional(),
  severity: z.number().min(1).max(10).optional(), // 1-10 severity scale
});

// Onboarding Step Schema
export const onboardingStepSchema = z.object({
  stepName: z.string().min(1, "Step name required"),
  completed: z.boolean().default(false),
  data: z.record(z.string(), z.any()).optional(), // Flexible JSON data
});

// Specific Onboarding Schemas
export const childInfoOnboardingSchema = z.object({
  childFirstName: z.string().min(1, "Child's first name is required").max(50, "First name too long"),
  childLastName: z.string().min(1, "Child's last name is required").max(50, "Last name too long"),
  childDateOfBirth: z.string().datetime().or(z.date()),
  childSex: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
});

export const locationOnboardingSchema = z.object({
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
});

export const medicationOnboardingSchema = z.object({
  medicationRemindersEnabled: z.boolean(),
  dailyMedicationDoses: z.number().min(0).max(10).optional(),
  preferredMedicationTime: z.string().regex(/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/, "Invalid time format").optional(),
});

export const notificationOnboardingSchema = z.object({
  dailyLogRemindersEnabled: z.boolean(),
  preferredDailyLogTime: z.string().regex(/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/, "Invalid time format").optional(),
});

export const completeOnboardingSchema = childInfoOnboardingSchema
  .merge(locationOnboardingSchema)
  .merge(medicationOnboardingSchema)
  .merge(notificationOnboardingSchema);

// Symptom Log Schema
export const symptomLogSchema = z.object({
  entryId: z.string().cuid("Invalid entry ID"),
  symptom: z.string().min(1, "Symptom required").max(100, "Symptom description too long"),
  severity: z.number().min(1).max(10), // 1-10 severity scale
});

// Update Profile Schema (for PATCH requests)
export const updateProfileSchema = userProfileSchema.partial();

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type MedicationReminderInput = z.infer<typeof medicationReminderSchema>;
export type AsthmaEntryInput = z.infer<typeof asthmaEntrySchema>;
export type OnboardingStepInput = z.infer<typeof onboardingStepSchema>;
export type SymptomLogInput = z.infer<typeof symptomLogSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Onboarding Types
export type ChildInfoOnboardingInput = z.infer<typeof childInfoOnboardingSchema>;
export type LocationOnboardingInput = z.infer<typeof locationOnboardingSchema>;
export type MedicationOnboardingInput = z.infer<typeof medicationOnboardingSchema>;
export type NotificationOnboardingInput = z.infer<typeof notificationOnboardingSchema>;
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;
