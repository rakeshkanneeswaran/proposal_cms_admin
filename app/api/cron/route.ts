import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import emailSender from '@/emails';




// Next.js API route handler
export async function GET(request: NextRequest, res: NextResponse) {
    // Configuration for nodemailer

    await emailSender({ receiverEmail: "rakikanneeswaran@gmail.com", subject: " this is corn subject", text: "this is cron subject" })

    return NextResponse.json({ "message": "email cron working" });



}



