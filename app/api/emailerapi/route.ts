import { NextRequest, NextResponse } from 'next/server';
import emailsender from '@/emails';


export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
       const value = await emailsender({ subject: body.subject, text: body.text, receiverEmail: body.receiverEmail })
        console.log("sending email to the receiver: " + body.receiverEmail)
        console.log("the value of info return is " + JSON.stringify(value));

        return NextResponse.json({ messgae: "conformation email sent to the applicant"  , info : JSON.stringify(value)}, { status: 200 })

    } catch (error) {
        console.log(error)
    }
    return NextResponse.json({ messgae: "error while sending email to the applicant" }, { status: 400 })
}


