/*
  Warnings:

  - Added the required column `max_wait_time` to the `Disease` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Disease" ADD COLUMN     "max_wait_time" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "PatientCase_patient_id_idx" ON "public"."PatientCase"("patient_id");
