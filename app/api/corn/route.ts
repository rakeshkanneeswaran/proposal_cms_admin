import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configuration for nodemailer
const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.NDOEMAILER_USERNAME,
        pass: process.env.NDOEMAILER_PASSWORD,
    },
    secure: true,
    tls: { rejectUnauthorized: false },
});

// Email sending function
async function sendEmail({ receiverEmail, subject, text }: { receiverEmail: string; subject: string; text: string }) {
    const mailOptions = {
        from: 'ctecheventconnect@gmail.com',
        to: receiverEmail,
        subject: subject,
        text: text,
        html: `<p>${text}</p>`,
    };

    try {
        await transporter.verify();
        console.log('Server is ready to take our messages');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info);
        return {
            status: 'Success!',
            info: info,
        };
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send email');
    }
}

// Next.js API route handler
export async function GET(request: NextRequest) {
    try {
        await sendEmail({ receiverEmail: 'rakikanneeswaran', subject: 'This is corn job', text: 'This is corn job text' });
        return NextResponse.json({ message: 'Message sent successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to send message'}, { status: 500 });
    }
}



