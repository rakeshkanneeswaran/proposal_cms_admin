

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.NDOEMAILER_USERNAME,
        pass: process.env.NDOEMAILER_PASSWORD
    },
    secure: true,
    tls: { rejectUnauthorized: false }
});

export default async function emailSender({ receiverEmail, subject, text }: { receiverEmail: string, subject: string, text: string }) {
    const mailOptions = {
        from: "ctecheventconnect@gmail.com",
        to: receiverEmail,
        subject: subject,
        text: text,
        html: `<p>${text}</p>`
    };

    try {
        await transporter.verify();
        console.log("Server is ready to take our messages"); // Debug line
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info); // Debug line
        return {
            status: "Success!",
            info: info
        };
    } catch (error) {
        console.error("Email sending error:", error); // Detailed error logging
        throw new Error("Failed to send email");
    }
}
