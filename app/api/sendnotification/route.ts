import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from 'next/server';
import emailSender from '@/emails';
import prisma from '@/database';
import { addDays, isSameDay, parseISO } from 'date-fns';

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

// Next.js API route handler
export async function GET(request: NextRequest, res: NextResponse) {
    // Get current date
    const currentDate = new Date();

    // Fetch all proposals from the database
    const allProposals = await prisma.proposal.findMany();
    console.log("Printing all proposals");
    console.log(allProposals);

    // Prepare email configuration
    const emailConfig = {
        subject: "Reminder for your upcoming event",
    };

    // Iterate over each proposal
    for (const proposal of allProposals) {
        // Check if startDate is not null or undefined
        console.log("this is the proposal ")
        console.log(proposal)
        if (proposal.startDate && proposal.endDate && proposal.mailId) {
            // Parse the startDate
            const startDate = parseISO(proposal.startDate.replace(/"/g, ''));

            // Check if the event is starting in seven days or tomorrow
            const sevenDaysFromNow = addDays(currentDate, 7);
            const tomorrow = addDays(currentDate, 1);

            const isSevenDaysAway = isSameDay(sevenDaysFromNow, startDate);
            const isTomorrow = isSameDay(tomorrow, startDate);

            if (isSevenDaysAway || isTomorrow) {
                // Prepare email body
                const emailBody = `
                    Dear ${proposal.convenorName},

                    This is a reminder that your event "${proposal.eventTitle}" is scheduled to start on ${proposal.startDate.replace(/"/g, '')}.
                    Please make sure all preparations are in place.

                    Event Details:
                    - Event Title: ${proposal.eventTitle}
                    - Category: ${proposal.category}
                    - Convenor Name: ${proposal.convenorName}
                    - Convenor Designation: ${proposal.convenorDesignation}
                    - Email: ${proposal.mailId}
                    - Mobile Number: ${proposal.mobileNumber}
                    - Proposed Period: ${proposal.proposedPeriod}
                    - Duration: ${proposal.duration} days
                    - Financial Support (Others): ${proposal.financialSupportOthers}
                    - Financial Support (SRMIST): ${proposal.financialSupportSRMIST}
                    - Estimated Budget: ${proposal.estimatedBudget}
                    - Start Date: ${proposal.startDate.replace(/"/g, '')}
                    - End Date: ${proposal.endDate.replace(/"/g, '')}
                `;

                // Send the email
                try {
                    const result = await emailSender({
                        receiverEmail: proposal.mailId,
                        subject: emailConfig.subject,
                        text: emailBody,
                    });

                    if (result.status == 200) {
                        console.log(`Reminder email sent to ${proposal.mailId} for event "${proposal.eventTitle}"`);

                    }
                    else {
                        console.log(`Failed to send reminder email to ${proposal.mailId} for event "${proposal.eventTitle}"`);
                    }
                } catch (error) {
                    console.error(`Error sending email to ${proposal.mailId}:`, error);
                }
            }
        }
    }

    return NextResponse.json({ message: "notifications send to applicant" } , {status : 200});
}
