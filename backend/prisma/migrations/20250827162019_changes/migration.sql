-- CreateEnum
CREATE TYPE "public"."CaseStatus" AS ENUM ('WAITING', 'IN_TREATMENT', 'DISCHARGED', 'TRANSFERRED');

-- AlterTable
ALTER TABLE "public"."PatientCase" ADD COLUMN     "status" "public"."CaseStatus" NOT NULL DEFAULT 'WAITING';
