/*
  Warnings:

  - The primary key for the `Disease` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Disease` table. All the data in the column will be lost.
  - The required column `id` was added to the `Disease` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."Disease" DROP CONSTRAINT "Disease_pkey",
DROP COLUMN "code",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Disease_pkey" PRIMARY KEY ("id");
