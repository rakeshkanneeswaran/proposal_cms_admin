/*
  Warnings:

  - You are about to drop the column `total` on the `DetailedBudget` table. All the data in the column will be lost.
  - Added the required column `costPerUnit` to the `DetailedBudget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `DetailedBudget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallForProposal" ALTER COLUMN "active" SET DEFAULT false;

-- AlterTable
ALTER TABLE "DetailedBudget" DROP COLUMN "total",
ADD COLUMN     "costPerUnit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;
