

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/database';
import { getServerSession } from "next-auth"


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
                console.log("added data as follows")
                console.log(eventadded)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return NextResponse.json({ messgae: "Added event successfully" })
}


export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (session?.user?.name) {
        console.log(session?.user?.name)
        try {
            const existingUser = await prisma.admin.findFirst({
                where: {
                    username: session?.user?.name
                }
            });
            if (existingUser) {
                const allproposal = await prisma.proposal.findMany()
                console.log("printing all proposals")
                console.log(allproposal)
                return NextResponse.json({ proposal: allproposal })

            }
        } catch (error) {
            console.log(error)
        }
    }
    console.log(session?.user?.name)
}
