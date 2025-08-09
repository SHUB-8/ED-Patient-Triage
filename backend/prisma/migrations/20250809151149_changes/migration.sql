-- DropIndex
DROP INDEX "public"."PatientCase_zone_idx";

-- CreateIndex
CREATE INDEX "PatientCase_time_served_idx" ON "public"."PatientCase"("time_served");
