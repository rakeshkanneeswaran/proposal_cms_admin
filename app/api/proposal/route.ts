

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/database';
import { getServerSession } from "next-auth"

export async function POST(req: NextRequest) {
    const body = await req.json();
    const exestinguser = await prisma.admin.findFirst({
        where: {
            username: body.username
        }
    })
    if (exestinguser) {
        const proposaladded = await prisma.proposal.create({
            data: {
                category: body.category,
                eventTitle: body.eventTitle
            }
        })
        return NextResponse.json({
            messgae: "proposal added",
            proposaladded: JSON.stringify(proposaladded)
        })
    }
    else {
        return NextResponse.json({ messgae: "something went wrong" })
    }



}

