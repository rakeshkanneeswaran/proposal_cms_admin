import { PrismaClient } from "@prisma/client";
import { parse } from "json2csv";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const proposals = await prisma.callForProposal.findMany({
            where: {
            rejected: false,
            active: true
            },
            include: { detailedBudgets: true, sponsorships: true }
        });

        if (!proposals.length) {
            return NextResponse.json({ error: "No proposals found" }, { status: 404 });
        }

        // Flatten and format data for CSV
        const formattedProposals = proposals.map(proposal => ({
            id: proposal.id,
            department: proposal.department,
            brandTitle: proposal.brandTitle,
            duration: proposal.duration,
            eventDate: proposal.eventDate.toISOString(),
            category: proposal.category,
            designation: proposal.designation,
            totalExpenditure: proposal.totalExpenditure,
            fundFromUniversity: proposal.fundFromUniversity,
            fundFromRegistration: proposal.fundFromRegistration,
            fundFromSponsorship: proposal.fundFromSponsorship,
            fundFromOtherSources: proposal.fundFromOtherSources,
            convenerName: proposal.convenerEmail,
            conevenerEmail: proposal.convenerEmail,
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
        return NextResponse.json({ error: "Failed to export proposals" }, { status: 500 });
    }
}