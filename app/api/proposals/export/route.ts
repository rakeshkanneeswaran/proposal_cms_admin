import { PrismaClient } from "@prisma/client";
import { parse } from "json2csv";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit-table";
import { Readable } from "stream";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const proposalId = url.searchParams.get("id");

        if (proposalId) {
            // Fetch a single proposal
            const proposal = await prisma.callForProposal.findUnique({
                where: { id: proposalId },
                include: { detailedBudgets: true, sponsorships: true }
            });

            if (!proposal) {
                return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
            }

            // Generate PDF
            const doc = new PDFDocument({
                font: 'Helvetica'
            });

            // Create a stream to collect PDF data
            const buffers: Buffer[] = [];
            doc.on("data", (chunk) => buffers.push(chunk));

            // Wait for the PDF generation to complete
            await new Promise<void>((resolve) => {
                doc.on("end", () => resolve());
                generatePDFContent(doc, proposal);
                doc.end();
            });

            // Create a Readable stream from the PDF data
            const pdfStream = new Readable();
            pdfStream.push(Buffer.concat(buffers));
            pdfStream.push(null); // Signal end of stream

            // Return the PDF as a response
            const pdfBuffer = Buffer.concat(buffers);
            return new NextResponse(pdfBuffer, {
                status: 200,
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="proposal_${proposal.id}.pdf"`
                }
            });
        } else {
            // Fetch all proposals for CSV
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
                convenerEmail: proposal.convenerEmail,
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
                    "Content-Type": "text/csv",
                    "Content-Disposition": "attachment; filename=proposals.csv"
                }
            });
        }
    } catch (error) {
        console.error("Error exporting proposals:", error);
        return NextResponse.json({ error: "Failed to export proposals" }, { status: 500 });
    }
}

// Helper function to generate PDF content
function generatePDFContent(doc: any, proposal: any) {
    // Set default font to Times New Roman
    doc.font('Times-Roman');

    // Page 1: Proposal Details
    doc.fontSize(14).text("PROPOSAL FOR AARUUSH / MILAN / STTP / WORKSHOP / CONFERENCE / CME / ANY OTHER RELATED EVENTS DURING 2025 - 2026 - SRM INSTITUTE OF SCIENCE AND TECHNOLOGY KATTANKULATHUR - 603203", { align: "center" });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Proposal Details
    doc.fontSize(13);
    doc.text(`1. Organizing Department: ${proposal.department}`, { lineGap: 4.0 });
    doc.text(`2. Brand Title of the Event: ${proposal.brandTitle}`, { lineGap: 4.0 });
    doc.text(`3. Duration of the Event: ${proposal.duration}`, { lineGap: 4.0 });
    doc.text(`4. Date of the Proposed Event Tentative: ${proposal.eventDate.toISOString().split("T")[0]}`, { lineGap: 4.0 });
    doc.fontSize(11).text("(Final Date will be given in the Events Calendar 2025 — 2026)", { align: "left", lineGap: 4.0 });
    doc.fontSize(13);
    doc.text(`5. Convener Name and Designation (only one name): ${proposal.convenerName}, ${proposal.convenerDesignation}`, { lineGap: 4.0 });
    doc.text(`6. Estimated Total Expenditure (Budget to be enclosed): Rs. ${proposal.totalExpenditure}`, { lineGap: 4.0 });
    doc.text(`7. Details of Sponsorship: ${proposal.sponsorshipDetails || "Separate Sheet attached"}`, { lineGap: 4.0 });
    doc.fontSize(11).text("(Maximum 50% of overall budget will be contributed by SRM IST. Remaining 50% of overall budget shall be mobilized through government and corporate funding / sponsorship)", { align: "left", lineGap: 4.0 });
    doc.fontSize(13);
    doc.text(`8. Details of Associating Agencies: ${proposal.sponsorships.map((s: any) => s.associatingAgencies).join(", ") || "Separate Sheet attached"}`, { lineGap: 4.0 });
    doc.fontSize(11).text("(All the events planned should be associated with at least one Professional Society / Government Agency related to their field)", { align: "center", lineGap: 4.0 });
    doc.fontSize(13);
    doc.text(`9. Details of the Department Conference / Symposium / any other related events conducted earlier: ${proposal.pastEventsDetails || "N/A"}`, { lineGap: 4.0 });
    doc.text(`10. Any other relevant details: ${proposal.otherDetails || "N/A"}`, { lineGap: 4.0 });
    doc.moveDown(2);

    // Signatures
    doc.fontSize(14);
    doc.text("Signature of the Convener", { align: "left", lineGap: 4.0 });
    doc.text("Signature of the Dean / HOD", { align: "right", lineGap: 4.0 });

    // Page 2: Detailed Budget and Sponsorship Details
    doc.addPage();
    doc.fontSize(14).text("SRM Institute of Science and Technology", { align: "center", lineGap: 4.0 });
    doc.moveDown();
    doc.text("College of Engineering and Technology", { align: "center", lineGap: 4.0 });
    doc.text("Department of Computing Technologies", { align: "center", lineGap: 4.0 });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Event Title and Date
    doc.fontSize(13);
    doc.text(`Title of the Event: ${proposal.brandTitle}`, { align: "left", lineGap: 4.0 });
    doc.text(`Date: ${proposal.eventDate.toISOString().split("T")[0]}`, { align: "left", lineGap: 4.0 });
    doc.moveDown();

    // Detailed Budget Table
    doc.fontSize(13).text("Detailed Budget", { align: "center", underline: true, lineGap: 4.0 });
    doc.moveDown();

    const budgetTable = {
        headers: ["S.No", "Description", "Quantity and Cost/Unit", "Purpose", "Total Amount"],
        rows: proposal.detailedBudgets.map((budget: any, index: number) => [
            index + 1,
            budget.description,
            `Qty: ${budget.quantity}, Cost: ${budget.costPerUnit}`,
            budget.purpose,
            `Rs. ${budget.totalAmount}`
        ])
    };

    doc.fontSize(11);
    doc.table(budgetTable, {
        prepareHeader: () => doc.font("Times-Bold"),
        prepareRow: (row: any, i: number) => doc.font("Times-Roman")
    });

    // Fund Distribution
    doc.fontSize(11).text("Fund Distribution:", { bold: true, lineGap: 4.0 });
    doc.text(`1. Fund Expected from University: Rs. ${proposal.fundFromUniversity}`, { lineGap: 4.0 });
    doc.text(`2. Fund Expected from Registration (No’s * Rs. ${proposal.registrationFee}): Rs. ${proposal.fundFromRegistration}`, { lineGap: 4.0 });
    doc.text(`3. Fund Expected from Sponsorship and other sources: Rs. ${proposal.fundFromSponsorship}`, { lineGap: 4.0 });
    doc.text(`Total: Rs. ${proposal.totalExpenditure}`, { lineGap: 4.0 });
    doc.moveDown();

    // Sponsorship and Associating Agencies
    doc.fontSize(12).text("Details of Sponsorship:", { bold: true, lineGap: 4.0 });
    doc.text(proposal.sponsorshipDetails || "N/A", { lineGap: 4.0 });
    doc.moveDown();

    doc.fontSize(12).text("Details of Associating Agencies:", { bold: true, lineGap: 4.0 });
    doc.text(proposal.sponsorships.map((s: any) => s.associatingAgencies).join(", ") || "N/A", { lineGap: 4.0 });
    doc.moveDown(2);

    // Convener Signature and Date
    doc.fontSize(11);
    doc.text("Name and Signature of Convener", { align: "left", lineGap: 4.0 });
    doc.text(`Date: ${new Date().toISOString().split("T")[0]}`, { align: "right", lineGap: 4.0 });
}