
import nodemailer from "nodemailer"

const auth = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: process.env.NDOEMAILER_USERNAME,
        pass: process.env.NDOEMAILER_PASSWORD

    },
    tls: { rejectUnauthorized: false },
});


export default async function emailsender({ receiverEmail, subject, text }: { receiverEmail: string, subject: string, text: string }) {

    const receiver = {
        from: "ctecheventconnect@gmail.com",
        to: receiverEmail,
        subject: subject,
        text: text
    };

    console.log("sending email to the receiver: " + receiver)

    auth.sendMail(receiver, (error: any, emailResponse: any) => {
        if (error) {
            throw error;
        }
        console.log("success!");
        console.log("email sent to " + receiver)

    });

    return "success!";




}








