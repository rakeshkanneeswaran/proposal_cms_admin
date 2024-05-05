

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
        return NextResponse.json({ messgae: "you are there" })
    }
    else {
        return NextResponse.json({ messgae: "you are not there" })
    }

}

