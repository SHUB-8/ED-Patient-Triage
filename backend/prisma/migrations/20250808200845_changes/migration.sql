/*
  Warnings:

  - Made the column `resource_score` on table `PatientCase` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."PatientCase" ALTER COLUMN "resource_score" SET NOT NULL;
