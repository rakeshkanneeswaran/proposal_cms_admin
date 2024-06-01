import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/database';
import { getServerSession } from "next-auth"
import { confirmationBody } from '@/lib/emailtemplates';

import emailsender from '@/emails';


// GET All Proposals
// Endpoint URL: /api/proposal
// Method: GET
// Description: Fetches all proposals if the authenticated user is authorized as an admin.
// Response: Returns a JSON object containing all proposals or an error message if not authorized.


// export async function GET() {
//     const session = await getServerSession();
//     if (session?.user?.name) {
//         console.log(session?.user?.name)
//         try {
//             const existingUser = await prisma.admin.findFirst({
//                 where: {
//                     username: session?.user?.name
//                 }
//             });
//             if (existingUser) {
//                 const allproposal = await prisma.proposal.findMany()
//                 console.log("printing all proposals")
//                 console.log(allproposal)
//                 return NextResponse.json({ proposal: allproposal })

//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     else {
//         return NextResponse.json({ proposal: "something went wrong while fetching" })
//     }
//     console.log(session?.user?.name)
//     return NextResponse.json({ proposal: "something went wrong while fetching" })
// }


//--------------------------------------------------------------------------------------------------------------------------------

// GET All Proposals or Proposal by ID
// Endpoint URL: /api/proposal or /api/proposal?id={proposalId}
// Method: GET
// Description: Fetches all proposals or a specific proposal by ID if the authenticated user is authorized as an admin.
// Query Parameter: id (optional) - ID of the proposal to retrieve
// Response: Returns a JSON object containing all proposals or a specific proposal data, or an error message if not authorized or proposal not found.

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
    const session = await getServerSession();
    if (session?.user?.name == body.username) {
        try {
            const existingUser = await prisma.admin.findFirst({
                where: {
                    username: body.username
                }
            });
            if (existingUser) {
                const eventadded = await prisma.proposal.create({
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

                const text = confirmationBody({
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
                    estimatedBudget: body.estimatedBudget
                })

                if (eventadded) {
                      emailsender({ receiverEmail: body.mailId, subject: "Confirmation for your proposal submitted at ctech", text: text });
                    
                        return NextResponse.json({
                            messgae: "Added event successfully",
                            event: true,
                            email: true
                        }, { status: 200 })
                }

                else {
                    console.log("added data as follows")
                    console.log(eventadded)
                    return NextResponse.json({ messgae: "Something went wrong in processing the request" }, { status: 200 })

                }
            }
        } catch (error) {
            return NextResponse.json({ message: "Event could not be added , please error while acessing database " }, { status: 400 })
            console.log(error)
        }
    }
    return NextResponse.json({ messgae: "Validation error" })
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

