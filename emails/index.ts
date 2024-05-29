
import nodemailer from "nodemailer"

const auth = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: process.env.NDOEMAILER_USERNAME,
        pass: process.env.NDOEMAILER_PASSWORD

    }
});


export default function emailsender({receiverEmail , subject , text}  : {receiverEmail: string , subject: string , text: string}) {


    const receiver = {
        from: "ctecheventconnect@gmail.com",
        to: receiverEmail,
        subject:subject,
        text: text
    };

    console.log("sending email")

    auth.sendMail(receiver, (error: any, emailResponse: any) => {
        if (error)
            throw error;
        console.log("success!");

    });
}








