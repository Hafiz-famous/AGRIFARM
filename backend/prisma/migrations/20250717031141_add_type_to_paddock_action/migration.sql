/*
  Warnings:

  - You are about to drop the column `action` on the `PaddockAction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PaddockAction` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `PaddockAction` table. All the data in the column will be lost.
  - Added the required column `type` to the `PaddockAction` table without a default value. This is not possible if the table is not empty.
  - Made the column `date` on table `PaddockAction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaddockAction" DROP COLUMN "action",
DROP COLUMN "createdAt",
DROP COLUMN "notes",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
