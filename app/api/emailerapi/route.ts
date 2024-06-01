import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/database';
import { getServerSession } from "next-auth"

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
                return NextResponse.json({ "messgae": "could not find the proposal" })
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
                return NextResponse.json({ messgae: "Delete event successfully" })
            }
        } catch (error) {
            console.log(error)
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
                return NextResponse.json({ "messgae": "could not find the proposal" })
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
                    }
                })
                console.log(result)
                return NextResponse.json({ messgae: "Delete event successfully" })
            }
        } catch (error) {
            console.log(error)
            return NextResponse.json({ messgae: "Your are not authentication" })

        }
    }

    else {

    }
}

