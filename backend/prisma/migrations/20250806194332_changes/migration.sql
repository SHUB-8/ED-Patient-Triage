/*
  Warnings:

  - You are about to drop the column `remaining_time` on the `PatientCase` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `PatientCase` table. All the data in the column will be lost.
  - You are about to drop the column `treatment_time` on the `PatientCase` table. All the data in the column will be lost.
  - You are about to drop the `TreatmentTimes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PatientCase" DROP CONSTRAINT "PatientCase_disease_code_fkey";

-- DropIndex
DROP INDEX "public"."PatientCase_id_key";

-- AlterTable
ALTER TABLE "public"."PatientCase" DROP COLUMN "remaining_time",
DROP COLUMN "severity",
DROP COLUMN "treatment_time",
ALTER COLUMN "resource_score" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."TreatmentTimes";

-- CreateTable
CREATE TABLE "public"."Disease" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "treatment_time" INTEGER NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("code")
);
