/*
  Warnings:

  - You are about to drop the column `location` on the `Animal` table. All the data in the column will be lost.
  - Made the column `species` on table `Animal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "location",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "breed" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "health" TEXT,
ADD COLUMN     "paddockId" INTEGER,
ALTER COLUMN "species" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_paddockId_fkey" FOREIGN KEY ("paddockId") REFERENCES "Paddock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
