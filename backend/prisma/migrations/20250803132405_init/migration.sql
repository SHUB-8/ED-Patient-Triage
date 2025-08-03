-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST');

-- CreateEnum
CREATE TYPE "public"."Action" AS ENUM ('ASSIGN_BED', 'RELEASE_BED', 'EXTEND_BED', 'OVERRIDE_PRIORITY');

-- CreateEnum
CREATE TYPE "public"."Zone" AS ENUM ('RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "type" "public"."UserType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hospital" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TreatmentTimes" (
    "id" TEXT NOT NULL,
    "disease_code" TEXT NOT NULL,
    "base_mins" INTEGER NOT NULL,

    CONSTRAINT "TreatmentTimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PatientCase" (
    "id" TEXT NOT NULL,
    "zone" "public"."Zone" NOT NULL,
    "si" INTEGER NOT NULL,
    "news2" INTEGER NOT NULL,
    "severity" DOUBLE PRECISION NOT NULL,
    "resource_score" DOUBLE PRECISION NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "last_eval_time" TIMESTAMP(3) NOT NULL,
    "time_served" TIMESTAMP(3),
    "treatment_time" DOUBLE PRECISION NOT NULL,
    "remaining_time" DOUBLE PRECISION NOT NULL,
    "priority" DOUBLE PRECISION NOT NULL,
    "age_flag" BOOLEAN NOT NULL DEFAULT false,
    "disease_code" TEXT,
    "patient_id" TEXT,

    CONSTRAINT "PatientCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Beds" (
    "id" TEXT NOT NULL,
    "bed_number" TEXT NOT NULL,
    "zone" "public"."Zone" NOT NULL,
    "case_id" TEXT,

    CONSTRAINT "Beds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeightConfigs" (
    "zone" "public"."Zone" NOT NULL,
    "a" DOUBLE PRECISION NOT NULL,
    "b" DOUBLE PRECISION NOT NULL,
    "c" DOUBLE PRECISION NOT NULL,
    "d" DOUBLE PRECISION NOT NULL,
    "e" DOUBLE PRECISION NOT NULL,
    "wait_cap" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WeightConfigs_pkey" PRIMARY KEY ("zone")
);

-- CreateTable
CREATE TABLE "public"."Logs" (
    "id" TEXT NOT NULL,
    "action" "public"."Action" NOT NULL,
    "who" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentTimes_disease_code_key" ON "public"."TreatmentTimes"("disease_code");

-- CreateIndex
CREATE UNIQUE INDEX "PatientCase_id_key" ON "public"."PatientCase"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PatientCase_patient_id_key" ON "public"."PatientCase"("patient_id");

-- CreateIndex
CREATE INDEX "PatientCase_zone_idx" ON "public"."PatientCase"("zone");

-- CreateIndex
CREATE UNIQUE INDEX "Beds_bed_number_key" ON "public"."Beds"("bed_number");

-- CreateIndex
CREATE UNIQUE INDEX "Beds_case_id_key" ON "public"."Beds"("case_id");

-- CreateIndex
CREATE INDEX "Logs_timestamp_idx" ON "public"."Logs"("timestamp");

-- AddForeignKey
ALTER TABLE "public"."PatientCase" ADD CONSTRAINT "PatientCase_disease_code_fkey" FOREIGN KEY ("disease_code") REFERENCES "public"."TreatmentTimes"("disease_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Beds" ADD CONSTRAINT "Beds_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."PatientCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
