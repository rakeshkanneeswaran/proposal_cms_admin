-- CreateTable
CREATE TABLE "CallForProposal" (
    "id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "brandTitle" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "convener" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "totalExpenditure" DOUBLE PRECISION NOT NULL,
    "sponsorshipDetails" TEXT,
    "pastEventsDetails" TEXT,
    "otherDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallForProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailedBudget" (
    "id" TEXT NOT NULL,
    "sno" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "fundFromUniversity" DOUBLE PRECISION NOT NULL,
    "fundFromRegistration" DOUBLE PRECISION NOT NULL,
    "fundFromSponsorship" DOUBLE PRECISION NOT NULL,
    "fundFromOtherSources" DOUBLE PRECISION NOT NULL,
    "callForProposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailedBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsorship" (
    "id" TEXT NOT NULL,
    "sponsorshipDetails" TEXT NOT NULL,
    "associatingAgencies" TEXT,
    "callForProposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsorship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DetailedBudget" ADD CONSTRAINT "DetailedBudget_callForProposalId_fkey" FOREIGN KEY ("callForProposalId") REFERENCES "CallForProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsorship" ADD CONSTRAINT "Sponsorship_callForProposalId_fkey" FOREIGN KEY ("callForProposalId") REFERENCES "CallForProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
