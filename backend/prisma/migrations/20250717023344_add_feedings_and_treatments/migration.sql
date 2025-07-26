/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Feeding` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `dosage` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Treatment` table. All the data in the column will be lost.
  - Added the required column `type` to the `Treatment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feeding" DROP COLUMN "createdAt",
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Treatment" DROP COLUMN "createdAt",
DROP COLUMN "dosage",
DROP COLUMN "name",
DROP COLUMN "notes",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "veterinarian" TEXT,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
