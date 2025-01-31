import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { EmailService } from "@/services";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request, res: NextApiResponse) {

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

export async function GET(req: Request, res: NextApiResponse) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const session = await getServerSession();
    if (!session?.user?.name) {
        //return res.status(401).json({ error: "You are not authenticated" });
        return NextResponse.json({ error: "You are not authenticated" });
    }

    try {
        const proposal = await prisma.callForProposal.findUnique({
            where: { id: id as string },
            include: { detailedBudgets: true, sponsorships: true }
        });

        if (!proposal) {
            return res.status(404).json({ error: "Proposal not found" });
        }

        //res.status(200).json(proposal);
        return NextResponse.json(proposal);
    } catch (error) {
        console.error("Error fetching proposal:", error);
        //res.status(500).json({ error: "Failed to fetch proposal" });
        return NextResponse.json({ error: "Failed to fetch proposal" });
    }
}

