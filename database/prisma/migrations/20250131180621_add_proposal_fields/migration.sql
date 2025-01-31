/*
  Warnings:

  - You are about to drop the column `fundFromOtherSources` on the `DetailedBudget` table. All the data in the column will be lost.
  - You are about to drop the column `fundFromRegistration` on the `DetailedBudget` table. All the data in the column will be lost.
  - You are about to drop the column `fundFromSponsorship` on the `DetailedBudget` table. All the data in the column will be lost.
  - You are about to drop the column `fundFromUniversity` on the `DetailedBudget` table. All the data in the column will be lost.
  - Added the required column `fundFromOtherSources` to the `CallForProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundFromRegistration` to the `CallForProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundFromSponsorship` to the `CallForProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundFromUniversity` to the `CallForProposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallForProposal" ADD COLUMN     "fundFromOtherSources" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fundFromRegistration" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fundFromSponsorship" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fundFromUniversity" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "DetailedBudget" DROP COLUMN "fundFromOtherSources",
DROP COLUMN "fundFromRegistration",
DROP COLUMN "fundFromSponsorship",
DROP COLUMN "fundFromUniversity";
