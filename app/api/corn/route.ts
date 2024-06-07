import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/database';

import emailSender from '@/emails';

export async function GET(request: NextRequest) {

    await emailSender({ receiverEmail: "rakikanneeswaran", subject: "this is corn job ", text: " this is corn job text " })
    return NextResponse.json({ "message": "message send successfully" });
}
