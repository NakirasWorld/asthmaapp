-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('PATIENT', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'PATIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AsthmaEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "symptoms" TEXT[],
    "peakFlow" INTEGER,
    "spo2" INTEGER,
    "rescuePuffs" INTEGER,
    "notes" TEXT,

    CONSTRAINT "AsthmaEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "AsthmaEntry_userId_timestamp_idx" ON "public"."AsthmaEntry"("userId", "timestamp" DESC);

-- AddForeignKey
ALTER TABLE "public"."AsthmaEntry" ADD CONSTRAINT "AsthmaEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
