-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "PaddockAction" ALTER COLUMN "date" DROP NOT NULL;
