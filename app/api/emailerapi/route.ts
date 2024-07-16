import { NextRequest, NextResponse } from 'next/server';
import emailsender from '@/emails';
import prisma from '@/database';
import { addDays, isSameDay, parseISO } from 'date-fns';

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const value = await emailsender({ subject: body.subject, text: body.text, receiverEmail: body.receiverEmail });
        console.log("Sending email to the receiver: " + body.receiverEmail);
        console.log("The value of info returned is " + JSON.stringify(value));

        return NextResponse.json({ message: "Confirmation email sent to the applicant", info: JSON.stringify(value) }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error while sending email to the applicant" }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    const sentEmails = [];
    const currentDate = new Date();
    const allProposals = await prisma.proposal.findMany();
    console.log("Printing all proposals");
    console.log(allProposals);

    try {
        for (const proposal of allProposals) {
            if (proposal.startDate && proposal.endDate && proposal.mailId) {
                const startDate = parseISO(proposal.startDate.replace(/"/g, ''));
                const sevenDaysFromNow = addDays(currentDate, 7);
                const isWithinSevenDays = startDate <= sevenDaysFromNow && startDate >= currentDate;

                if (isWithinSevenDays) {
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

                    try {
                        const result = await emailsender({ subject: "Reminder for your upcoming event", text: emailBody, receiverEmail: proposal.mailId });
                        if (result.status == 200) {
                            console.log(`Reminder email sent to ${proposal.mailId} for event "${proposal.eventTitle}"`);
                            sentEmails.push(proposal.mailId);
                        } else {
                            console.log(`Failed to send reminder email to ${proposal.mailId} for event "${proposal.eventTitle}"`);
                        }
                    } catch (error) {
                        console.error(`Error sending email to ${proposal.mailId}:`, error);
                    }
                }
            }
        }
        console.log("Sent emails: " + sentEmails);
        return NextResponse.json({ message: "Emails sent successfully", sentEmails }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error while sending emails" }, { status: 400 });
    }
}
