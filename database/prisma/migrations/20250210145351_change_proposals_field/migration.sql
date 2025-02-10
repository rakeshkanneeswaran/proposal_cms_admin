/*
  Warnings:

  - You are about to drop the column `convener` on the `CallForProposal` table. All the data in the column will be lost.
  - You are about to drop the column `yourEmail` on the `CallForProposal` table. All the data in the column will be lost.
  - You are about to drop the column `yourName` on the `CallForProposal` table. All the data in the column will be lost.
  - Added the required column `category` to the `CallForProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `convenerEmail` to the `CallForProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `convenerName` to the `CallForProposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallForProposal" DROP COLUMN "convener",
DROP COLUMN "yourEmail",
DROP COLUMN "yourName",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "convenerEmail" TEXT NOT NULL,
ADD COLUMN     "convenerName" TEXT NOT NULL;
