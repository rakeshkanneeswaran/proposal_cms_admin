/*
  Warnings:

  - Added the required column `yourEmail` to the `CallForProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yourName` to the `CallForProposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallForProposal" ADD COLUMN     "yourEmail" TEXT NOT NULL,
ADD COLUMN     "yourName" TEXT NOT NULL;
