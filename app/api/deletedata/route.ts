import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/database';
import { getServerSession } from "next-auth"

export async function DELETE() {
    const session = await getServerSession();
    if (session?.user?.name) {
        try {
            const existingUser = await prisma.admin.findFirst({
                where: {
                    username: session?.user?.name
                }
            });
            if (existingUser) {
                const result = await prisma.proposal.deleteMany()
                console.log(result)
                return NextResponse.json({ message: "Delete all event successfully" }, { status: 200 })
            }
        } catch (error) {
            console.log(error)
            return NextResponse.json({ message: "not able to delete the event" }, { status: 500 })
        }
    }
}