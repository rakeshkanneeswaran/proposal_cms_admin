-- AlterTable
ALTER TABLE "Proposal" ALTER COLUMN "convenorName" DROP NOT NULL,
ALTER COLUMN "convenorDesignation" DROP NOT NULL,
ALTER COLUMN "mailId" DROP NOT NULL,
ALTER COLUMN "mobileNumber" DROP NOT NULL,
ALTER COLUMN "proposedPeriod" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "financialSupportOthers" DROP NOT NULL,
ALTER COLUMN "financialSupportSRMIST" DROP NOT NULL,
ALTER COLUMN "estimatedBudget" DROP NOT NULL;
