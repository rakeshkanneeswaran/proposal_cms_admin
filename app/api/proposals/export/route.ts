import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { parse } from "json2csv";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const proposals = await prisma.callForProposal.findMany({
            where: {
            rejected: false,
            active: true
            },
            include: { detailedBudgets: true, sponsorships: true }
        });

        if (!proposals.length) {
            return res.status(404).json({ error: "No proposals found" });
        }

        // Flatten and format data for CSV
        const formattedProposals = proposals.map(proposal => ({
            id: proposal.id,
            department: proposal.department,
            brandTitle: proposal.brandTitle,
            duration: proposal.duration,
            eventDate: proposal.eventDate.toISOString(),
            convener: proposal.convener,
            designation: proposal.designation,
            totalExpenditure: proposal.totalExpenditure,
            fundFromUniversity: proposal.fundFromUniversity,
            fundFromRegistration: proposal.fundFromRegistration,
            fundFromSponsorship: proposal.fundFromSponsorship,
            fundFromOtherSources: proposal.fundFromOtherSources,
            yourName: proposal.yourName,
            yourEmail: proposal.yourEmail,
            sponsorshipDetails: proposal.sponsorshipDetails,
            pastEventsDetails: proposal.pastEventsDetails,
            otherDetails: proposal.otherDetails,
            detailedBudgets: proposal.detailedBudgets.map((budget, index) => `Budget ${index + 1}: ${budget.description}, Qty: ${budget.quantity}, Cost: ${budget.costPerUnit}, Total: ${budget.totalAmount}`).join(" | "),
            sponsorships: proposal.sponsorships.map((sponsorship, index) => `Sponsorship ${index + 1}: ${sponsorship.sponsorshipDetails}, Agency: ${sponsorship.associatingAgencies}`).join(" | ")
        }));

        const csv = parse(formattedProposals);

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="proposals.csv"'
            }
        });
    } catch (error) {
        console.error("Error exporting proposals:", error);
        res.status(500).json({ error: "Failed to export proposals" });
    }
}