import { NextRequest, NextResponse } from 'next/server';
import emailsender from '@/emails';


export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        emailsender({ subject: body.subject, text: body.text, receiverEmail: body.receiverEmail })
        console.log("sending email to the receiver: " + body.receiverEmail)
        return NextResponse.json({ messgae: "conformation email sent to the applicant" })

    } catch (error) {
        console.log(error)
    }
    return NextResponse.json({ messgae: "error while sending email to the applicant" })
}


