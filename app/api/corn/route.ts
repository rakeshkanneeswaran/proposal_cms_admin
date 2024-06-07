import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';




// Next.js API route handler
export async function GET(request: NextRequest) {
    // Configuration for nodemailer
const sendingEmailResult = await axios.post('/api/emailerapi', {
    subject: "this is corn job subject",
    text: "this is corn job text",
    receiverEmail: "rakikanneeswaran@gmail.com",
});

}



