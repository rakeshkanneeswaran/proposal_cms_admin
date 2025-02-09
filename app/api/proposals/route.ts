import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { EmailService } from "@/services";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {

    try {
        const body = await req.json();
        const {
            department, brandTitle, duration, eventDate, convener, designation,
            sponsorshipDetails, pastEventsDetails, otherDetails, yourName, yourEmail,
            detailedBudgets, sponsorships
        } = body;
        
        const totalExpenditure = parseFloat(body.totalExpenditure) || 0;
        const fundFromUniversity = parseFloat(body.fundFromUniversity) || 0;
        const fundFromRegistration = parseFloat(body.fundFromRegistration) || 0;
        const fundFromSponsorship = parseFloat(body.fundFromSponsorship) || 0;
        const fundFromOtherSources = parseFloat(body.fundFromOtherSources) || 0;

        // const detailedBudgetsParsed = detailedBudgets.map((budget: any) => ({
        //     ...budget,
        //     quantity: parseInt(budget.quantity, 10) || 0
        // }));
        for (let i = 0; i < detailedBudgets.length; i++) {
            detailedBudgets[i].quantity = parseInt(detailedBudgets[i].quantity, 10) || 0;
            detailedBudgets[i].costPerUnit = parseFloat(detailedBudgets[i].costPerUnit) || 0;
            detailedBudgets[i].totalAmount = parseFloat(detailedBudgets[i].totalAmount) || 0;
        }

        const newProposal = await prisma.callForProposal.create({
            data: {
                department,
                brandTitle,
                duration,
                eventDate: new Date(eventDate),
                convener,
                designation,
                totalExpenditure,
                sponsorshipDetails,
                pastEventsDetails,
                otherDetails,
                yourName,
                yourEmail,
                fundFromUniversity,
                fundFromRegistration,
                fundFromSponsorship,
                fundFromOtherSources,
                detailedBudgets: { create: detailedBudgets },
                sponsorships: { create: sponsorships }
            },
            include: { detailedBudgets: true, sponsorships: true }
        });

        //send email to the user saying that the proposal has been created
        EmailService.emailSender({
            receiverEmail: yourEmail,
            subject: "Proposal Created",
            text: `Your proposal has been created successfully. Proposal ID: ${newProposal.id}`
        });


        return NextResponse.json({message: "Proposal created successfully"});
    } catch (error) {
        console.error("Error creating proposal:", error);
        //res.status(500).json({ error: "Failed to create proposal" });
        return NextResponse.json({ error: "Failed to create proposal" });
    }
}

export async function GET(req: Request, res: Response) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const session = await getServerSession();
    if (!session?.user?.name) {
        return NextResponse.json({ error: "You are not authenticated" });
    }

    try {
        if (id) {
            const proposal = await prisma.callForProposal.findUnique({
                where: { id: id as string },
                include: { detailedBudgets: true, sponsorships: true }
            });

            if (!proposal) {
                return NextResponse.json({ error: "Proposal not found" });
            }

            return NextResponse.json(proposal);
        } else {
            const proposals = await prisma.callForProposal.findMany({
                include: { detailedBudgets: true, sponsorships: true }
            });

            return NextResponse.json(proposals);
        }
    } catch (error) {
        console.error("Error fetching proposal(s):", error);
        return NextResponse.json({ error: "Failed to fetch proposal(s)" });
    }
}

//put request to approve proposal and mail the user that the proposal has been approved. make sure a user is logged in
export async function PUT(req: Request, res: Response) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const session = await getServerSession();
    if (!session?.user?.name) {
        return NextResponse.json({ error: "You are not authenticated" });
    }

    try {
        const proposal = await prisma.callForProposal.update({
            where: { id: id as string },
            data: { active: true, rejected: false },
            include: { detailedBudgets: true, sponsorships: true }
        });

        //send email to the user saying that the proposal has been approved
        EmailService.emailSender({
            receiverEmail: proposal.yourEmail,
            subject: "Proposal Approved",
            text: `Your proposal has been approved. Proposal ID: ${proposal.id}`
        });

        return NextResponse.json({ message: "Proposal approved successfully" });
    } catch (error) {
        console.error("Error approving proposal:", error);
        return NextResponse.json({ error: "Failed to approve proposal" });
    }
}

//delete request to reject a proposal and mail the user that the proposal has been rejected. include a reason for rejection get from url
export async function DELETE(req: Request, res: Response) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const reason = searchParams.get('reason');

    const session = await getServerSession();
    if (!session?.user?.name) {
        return NextResponse.json({ error: "You are not authenticated" });
    }

    try {
        const proposal = await prisma.callForProposal.update({
            where: { id: id as string },
            data: { active: false, rejected: true },
            include: { detailedBudgets: true, sponsorships: true }
        });

        //send email to the user saying that the proposal has been rejected
        EmailService.emailSender({
            receiverEmail: proposal.yourEmail,
            subject: "Proposal Rejected",
            text: `Your proposal has been rejected. Reason: ${reason}`
        });

        return NextResponse.json({ message: "Proposal rejected successfully" });
    } catch (error) {
        console.error("Error rejecting proposal:", error);
        return NextResponse.json({ error: "Failed to reject proposal" });
    }
}

