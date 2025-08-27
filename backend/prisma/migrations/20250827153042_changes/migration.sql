/*
  Warnings:

  - The values [DOCTOR] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[staff_id]` on the table `PatientCase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `severity` to the `Disease` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserType_new" AS ENUM ('ADMIN', 'NURSE', 'RECEPTIONIST');
ALTER TABLE "public"."User" ALTER COLUMN "type" TYPE "public"."UserType_new" USING ("type"::text::"public"."UserType_new");
ALTER TYPE "public"."UserType" RENAME TO "UserType_old";
ALTER TYPE "public"."UserType_new" RENAME TO "UserType";
DROP TYPE "public"."UserType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Disease" ADD COLUMN     "severity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."PatientCase" ADD COLUMN     "staff_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PatientCase_staff_id_key" ON "public"."PatientCase"("staff_id");

-- AddForeignKey
ALTER TABLE "public"."PatientCase" ADD CONSTRAINT "PatientCase_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
