/*
  Warnings:

  - The values [BLUE] on the enum `Zone` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Zone_new" AS ENUM ('RED', 'ORANGE', 'YELLOW', 'GREEN');
ALTER TABLE "public"."PatientCase" ALTER COLUMN "zone" TYPE "public"."Zone_new" USING ("zone"::text::"public"."Zone_new");
ALTER TABLE "public"."Beds" ALTER COLUMN "zone" TYPE "public"."Zone_new" USING ("zone"::text::"public"."Zone_new");
ALTER TABLE "public"."WeightConfigs" ALTER COLUMN "zone" TYPE "public"."Zone_new" USING ("zone"::text::"public"."Zone_new");
ALTER TYPE "public"."Zone" RENAME TO "Zone_old";
ALTER TYPE "public"."Zone_new" RENAME TO "Zone";
DROP TYPE "public"."Zone_old";
COMMIT;
