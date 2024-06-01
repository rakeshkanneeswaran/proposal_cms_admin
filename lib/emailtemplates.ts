
interface EventDetails {
    eventTitle: string;
    category: string;
    convenorName: string;
    convenorDesignation: string;
    mailId: string;
    mobileNumber: string;
    proposedPeriod: string;
    duration: string;
    financialSupportOthers: string;
    financialSupportSRMIST: string;
    estimatedBudget: string;
}

export const confirmationBody = ({ eventTitle, category, convenorName, convenorDesignation, mailId, mobileNumber, proposedPeriod, duration, financialSupportOthers, financialSupportSRMIST, estimatedBudget }: EventDetails): string => {


    const emailbody = `
This is to confirm that your proposal has been approved with the following details:
- Event Title: ${eventTitle}
- Category: ${category}
- Convenor Name: ${convenorName}
- Convenor Designation: ${convenorDesignation}
- Email: ${mailId}
- Mobile Number: ${mobileNumber}
- Proposed Period: ${proposedPeriod}
- Duration: ${duration} days
- Financial Support (Others): ${financialSupportOthers}
- Financial Support (SRMIST): ${financialSupportSRMIST}
- Estimated Budget: ${estimatedBudget}
`
    return emailbody;

}