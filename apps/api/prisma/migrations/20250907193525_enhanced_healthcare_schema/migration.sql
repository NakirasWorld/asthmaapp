-- CreateEnum
CREATE TYPE "public"."Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "public"."MedicationFrequency" AS ENUM ('DAILY', 'WEEKLY', 'AS_NEEDED', 'TWICE_DAILY', 'THREE_TIMES_DAILY');

-- DropForeignKey
ALTER TABLE "public"."AsthmaEntry" DROP CONSTRAINT "AsthmaEntry_userId_fkey";

-- AlterTable
ALTER TABLE "public"."AsthmaEntry" ADD COLUMN     "location" TEXT,
ADD COLUMN     "severity" INTEGER,
ADD COLUMN     "triggers" TEXT[];

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "dailyMedicationDoses" INTEGER,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "medicationRemindersEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferredAlertTime" TEXT,
ADD COLUMN     "sex" "public"."Sex",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "zipCode" TEXT;

-- CreateTable
CREATE TABLE "public"."MedicationReminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT,
    "time" TEXT NOT NULL,
    "frequency" "public"."MedicationFrequency" NOT NULL DEFAULT 'DAILY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OnboardingStep" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnboardingStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SymptomLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "symptom" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SymptomLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedicationReminder_userId_isActive_idx" ON "public"."MedicationReminder"("userId", "isActive");

-- CreateIndex
CREATE INDEX "OnboardingStep_userId_completed_idx" ON "public"."OnboardingStep"("userId", "completed");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingStep_userId_stepName_key" ON "public"."OnboardingStep"("userId", "stepName");

-- CreateIndex
CREATE INDEX "SymptomLog_userId_timestamp_idx" ON "public"."SymptomLog"("userId", "timestamp");

-- AddForeignKey
ALTER TABLE "public"."AsthmaEntry" ADD CONSTRAINT "AsthmaEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicationReminder" ADD CONSTRAINT "MedicationReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OnboardingStep" ADD CONSTRAINT "OnboardingStep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SymptomLog" ADD CONSTRAINT "SymptomLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SymptomLog" ADD CONSTRAINT "SymptomLog_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "public"."AsthmaEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
