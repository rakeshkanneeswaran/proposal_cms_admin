import { NextRequest, NextResponse } from 'next/server';
import emailsender from '@/emails';
import prisma from '@/database';
import { addDays, isSameDay, parseISO } from 'date-fns';


export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const value = await emailsender({ subject: body.subject, text: body.text, receiverEmail: body.receiverEmail })
        console.log("sending email to the receiver: " + body.receiverEmail)
        console.log("the value of info return is " + JSON.stringify(value));

        return NextResponse.json({ messgae: "conformation email sent to the applicant", info: JSON.stringify(value) }, { status: 200 })

    } catch (error) {
        console.log(error)
    }
    return NextResponse.json({ messgae: "error while sending email to the applicant" }, { status: 400 })
}
export async function GET(req: NextRequest) {

    const currentDate = new Date();
    const allProposals = await prisma.proposal.findMany();
    console.log("Printing all proposals");
    console.log(allProposals);

    try {
        for (const proposal of allProposals) {

            console.log(proposal)

            if (proposal.startDate && proposal.endDate && proposal.mailId) {
                console.log("got something from the proposal")
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
                        const result = await emailsender({ subject: "Reminder for your upcoming event", text: emailBody, receiverEmail: proposal.mailId })
                         console.log(result.status)
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
        return NextResponse.json({ messgae: "conformation email sent to the applicant" }, { status: 200 })
    } catch (error) {
        console.log(error)
    }
    return NextResponse.json({ messgae: "error while sending email to the applicant" }, { status: 400 })
}


