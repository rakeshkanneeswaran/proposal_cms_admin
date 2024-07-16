import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/database';
import { getServerSession } from "next-auth"



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
                        
                        status : body.status
                  
                    }
                })
                console.log(result)
                return NextResponse.json({ messgae: "Update event successfully" },{status : 200})
            }
        } catch (error) {
            console.log(error)
            return NextResponse.json({ messgae: "Your are not authentication" })

        }
    }

    else {

    }
}

