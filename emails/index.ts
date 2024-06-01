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

export default async function emailSender({ receiverEmail , subject, text } : {receiverEmail : string, subject : string, text : string}) {
    const mailOptions = {
        from: "ctecheventconnect@gmail.com",
        to: receiverEmail,
        subject: subject,
        text: text,
        html: `<p>${text}</p>`
    };

    // Verify the connection configuration
    await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    // Send the email
    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });

    return "Success!";
}


