-- CreateTable
CREATE TABLE "Admin" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "convenorName" TEXT NOT NULL,
    "convenorDesignation" TEXT NOT NULL,
    "mailId" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "proposedPeriod" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "financialSupportOthers" DOUBLE PRECISION NOT NULL,
    "financialSupportSRMIST" DOUBLE PRECISION NOT NULL,
    "estimatedBudget" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
