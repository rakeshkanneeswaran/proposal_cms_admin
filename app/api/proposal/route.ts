import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/database';
import { getServerSession } from "next-auth"
export async function GET(request: NextRequest) {
    const session = await getServerSession();
    if (session?.user?.name) {
        try {
            const existingUser = await prisma.admin.findFirst({
                where: {
                    username: session?.user?.name
                }
            });
            if (existingUser) {
                const searchParams = request.nextUrl.searchParams;
                const proposalId = searchParams.get('id');
                if (proposalId) {
                    // Fetch a specific proposal by ID
                    const proposal = await prisma.proposal.findUnique({
                        where: { id: parseInt(proposalId) }
                    });
                    if (proposal) {
                        return NextResponse.json({ proposal });
                    } else {
                        return NextResponse.json({ "message": "Proposal not found" });
                    }
                } else {
                    // Fetch all proposals
                    const allproposal = await prisma.proposal.findMany();
                    console.log("printing all proposals");
                    console.log(allproposal);
                    return NextResponse.json({ proposal: allproposal });
                }
            }
        } catch (error) {
            console.log(error);
            return NextResponse.json({ "message": "Something went wrong while fetching the proposal(s)" });
        }
    }
    return NextResponse.json({ "message": "Unauthorized" });
}

//--------------------------------------------------------------------------------------------------------------------------------

// ADD Proposal
// Endpoint URL: /api/proposal
// Method: POST
// Description: Adds a new proposal if the authenticated user matches the request body's username.
// Request Body: JSON object containing proposal details.
// Response: Returns a success message if the proposal is added successfully or a validation error.

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log(body)
    const session = await getServerSession();
    if (session?.user?.name == body.username) {
        try {
            const existingUser = await prisma.admin.findFirst({
                where: {
                    username: body.username
                }
            });
            if (existingUser) {
                const eventExists = await prisma.proposal.findFirst({
                    where: {
                        mailId: body.mailId,
                        eventTitle: body.eventTitle
                    }
                })
                if (eventExists) {
                    return NextResponse.json({ message: "Event already exists" }, { status: 203 })
                }
                await prisma.proposal.create({
                    data: {
                        category: body.category,
                        eventTitle: body.eventTitle,
                        convenorName: body.convenorName,
                        convenorDesignation: body.convenorDesignation,
                        mailId: body.mailId,
                        mobileNumber: JSON.stringify(body.mobileNumber),
                        proposedPeriod: body.proposedPeriod,
                        duration: body.duration,
                        financialSupportOthers: body.financialSupportOthers,
                        financialSupportSRMIST: body.financialSupportSRMIST,
                        estimatedBudget: body.estimatedBudget,
                        startDate: body.fromDate,
                        endDate: body.toDate,
                        status: false
                    }
                })
                return NextResponse.json({ message: "processing the request" }, { status: 200 })

            }
        } catch (error) {
            console.error("this is the error", error)
            return NextResponse.json({ message: "Event could not be added , please error while acessing database " }, { status: 400 })

        }
    }
    return NextResponse.json({ message: "Validation error" })
}

//--------------------------------------------------------------------------------------------------------------------------------

// Delete Proposal
// Endpoint URL: /api/proposal?id={proposalId}
// Method: DELETE
// Description: Deletes a proposal by ID if the authenticated user is authorized as an admin.
// Query Parameter: id (ID of the proposal to delete)
// Response: Returns a success message if the proposal is deleted successfully or an error message.

export async function DELETE(request: NextRequest) {
    const session = await getServerSession();
    if (session?.user?.name) {
        try {
            const searchParams = request.nextUrl.searchParams;
            const id = searchParams.get('id');
            if (id == null) {
                return NextResponse.json({ "message": "could not find the proposal" })
            }
            const existingUser = await prisma.admin.findFirst({
                where: {
                    username: session?.user?.name
                }
            });
            if (existingUser) {
                const result = await prisma.proposal.delete({
                    where: { id: parseInt(id) }
                })
                console.log(result)
                return NextResponse.json({ message: "Delete event successfully" }, { status: 200 })
            }
        } catch (error) {
            console.log(error)
            return NextResponse.json({ message: "not able to delete the event" }, { status: 500 })
        }
    }
}

//--------------------------------------------------------------------------------------------------------------------------------

// Update Proposal
// Endpoint URL: /api/proposal?id={proposalId}
// Method: PUT
// Description: Updates a proposal by ID if the authenticated user is authorized as an admin.
// Request Body: JSON object containing updated proposal details.
// Query Parameter: id (ID of the proposal to update)
// Response: Returns a success message if the proposal is updated successfully or an error message.
export async function PUT(request: NextRequest) {

    const body = await request.json();
    const session = await getServerSession();
    if (session?.user?.name) {
        try {
            const searchParams = request.nextUrl.searchParams;
            const id = searchParams.get('id');
            if (id == null) {
                return NextResponse.json({ "message": "could not find the proposal" })
            }
            const existingUser = await prisma.admin.findFirst({
                where: {
                    username: session?.user?.name
                }
            });
            if (existingUser) {
                const result = await prisma.proposal.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        category: body.category,
                        eventTitle: body.eventTitle,
                        convenorName: body.convenorName,
                        convenorDesignation: body.convenorDesignation,
                        mailId: body.mailId,
                        mobileNumber: body.mobileNumber,
                        proposedPeriod: body.proposedPeriod,
                        duration: body.duration,
                        financialSupportOthers: body.financialSupportOthers,
                        financialSupportSRMIST: body.financialSupportSRMIST,
                        estimatedBudget: body.estimatedBudget,
                        startDate: body.fromDate,
                        endDate: body.toDate,

                    }
                })
                console.log(result)
                return NextResponse.json({ message: "Update event successfully" }, { status: 200 })
            }
        } catch (error) {
            console.log(error)
            return NextResponse.json({ message: "Your are not authentication" })

        }
    }

}

