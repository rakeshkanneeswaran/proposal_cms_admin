"use client";

import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import axios from "axios";
import { Appbardashboard } from "@/components/appbardashboard";
import EventTable from "@/components/Table";
const confirmationSubject = "Confirmation for your proposal submitted at ctech";

export default function EventForm() {
    const { data: session, status } = useSession();
    const username = session?.user?.name;
    const router = useRouter();

    const [eventTitle, setEventTitle] = useState('');
    const [category, setCategory] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [convenorName, setConvenorName] = useState('');
    const [convenorDesignation, setConvenorDesignation] = useState('');
    const [mailId, setMailId] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [duration, setDuration] = useState('');
    const [financialSupportOthers, setFinancialSupportOthers] = useState("");
    const [financialSupportSRMIST, setFinancialSupportSRMIST] = useState('');
    const [estimatedBudget, setEstimatedBudget] = useState('');


    let confirmationBody = `
    This is to confirm that your proposal has been approved with the following details:
    - Event Title: ${eventTitle}
    - Category: ${category}
    - Convenor Name: ${convenorName}
    - Convenor Designation: ${convenorDesignation}
    - Email: ${mailId}
    - Mobile Number: ${mobileNumber}
    - Proposed Period: ${fromDate} - ${toDate}
    - Duration: ${JSON.stringify(duration)} days
    - Financial Support (Others): ${JSON.stringify(financialSupportOthers)}
    - Financial Support (SRMIST): ${JSON.stringify(financialSupportSRMIST)}
    - Estimated Budget: ${JSON.stringify(estimatedBudget)}
    - start Date : ${JSON.stringify(toDate)}
    - end Date : ${JSON.stringify(fromDate)}
`;

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (status === "unauthenticated") {
            alert("Please sign in first");
            return;
        }

        try {
            const response = await axios.post('/api/proposal', {
                eventTitle,
                category,
                convenorName,
                convenorDesignation,
                mailId,
                mobileNumber,
                proposedPeriod: `${fromDate} - ${toDate}`,
                duration,
                financialSupportOthers,
                financialSupportSRMIST,
                estimatedBudget,
                username,
                fromDate,
                toDate
            });

            if (response.status == 200) {

                const sendingEmailResult = await axios.post('/api/emailerapi', {
                    subject: confirmationSubject,
                    text: confirmationBody,
                    receiverEmail: mailId
                });

                if (sendingEmailResult.status == 200) {
                    console.log(sendingEmailResult.data)
                    alert("Event and email processed successfully.");
                    // Reset form fields
                    setEventTitle('');
                    setCategory('');
                    setConvenorName('');
                    setConvenorDesignation('');
                    setMailId('');
                    setMobileNumber('');
                    setFromDate('');
                    setToDate('');
                    setDuration('');
                    setFinancialSupportOthers('');
                    setFinancialSupportSRMIST('');
                    setEstimatedBudget('');
                }



            }
        } catch (error) {
            console.error("Error submitting form", error);
            alert("Failed to create event. Please try again later.");
        }
    };

    return (

        <div className="bg-gradient-to-r from-purple-50 to-blue-300 ">
            <Appbardashboard onClick= {signOut} ></Appbardashboard>


            <div className="flex md:flex-row md:justify-between  flex-col px-5 py-36">

                <div className="flex justify-center items-center min-h-screen p-4">
                    <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Create Event</h2>
                        <p className="mb-4">Deploy your new event in one-click.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Event Title */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="event_title" className="font-medium">Event Title</label>
                                    <input
                                        type="text"
                                        id="event_title"
                                        className="border p-2 rounded"
                                        placeholder="Name of your Event"
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="event_category" className="font-medium">Category</label>
                                    <select
                                        id="event_category"
                                        className="border p-2 rounded"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="hackathon">Hackathon</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="event">Tech Event</option>
                                        <option value="ideathon">Ideathon</option>
                                    </select>
                                </div>

                                {/* Convenor Name */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="convenor_name" className="font-medium">Convenor Name</label>
                                    <input
                                        type="text"
                                        id="convenor_name"
                                        className="border p-2 rounded"
                                        placeholder="Name of Convenor"
                                        value={convenorName}
                                        onChange={(e) => setConvenorName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Convenor Designation */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="convenor_designation" className="font-medium">Convenor Designation</label>
                                    <input
                                        type="text"
                                        id="convenor_designation"
                                        className="border p-2 rounded"
                                        placeholder="Designation of Convenor"
                                        value={convenorDesignation}
                                        onChange={(e) => setConvenorDesignation(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="email" className="font-medium">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="border p-2 rounded"
                                        placeholder="Convenor Email ID"
                                        value={mailId}
                                        onChange={(e) => setMailId(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Mobile Number */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="mobile_number" className="font-medium">Mobile Number</label>
                                    <input
                                        type="tel"
                                        id="mobile_number"
                                        className="border p-2 rounded"
                                        placeholder="Convenor Mobile Number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Proposed Period */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="from_date" className="font-medium">Proposed Period (From)</label>
                                    <input
                                        type="date"
                                        id="from_date"
                                        className="border p-2 rounded"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="to_date" className="font-medium">Proposed Period (To)</label>
                                    <input
                                        type="date"
                                        id="to_date"
                                        className="border p-2 rounded"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Duration */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="duration" className="font-medium">Duration</label>
                                    <input
                                        type="text"
                                        id="duration"
                                        className="border p-2 rounded"
                                        placeholder="Duration"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Financial Support (Others) */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="financial_support_others" className="font-medium">Financial Support (Others)</label>
                                    <input
                                        type="number"
                                        id="financial_support_others"
                                        className="border p-2 rounded"
                                        placeholder="Enter Amount"
                                        value={financialSupportOthers}
                                        onChange={(e) => setFinancialSupportOthers(e.target.value)}
                                    />
                                </div>

                                {/* Financial Support (SRMIST) */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="financial_support_srmist" className="font-medium">Financial Support (SRMIST)</label>
                                    <input
                                        type="number"
                                        id="financial_support_srmist"
                                        className="border p-2 rounded"
                                        placeholder="Enter Amount"
                                        value={financialSupportSRMIST}
                                        onChange={(e) => setFinancialSupportSRMIST(e.target.value)}
                                    />
                                </div>

                                {/* Estimated Budget */}
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="estimated_budget" className="font-medium">Estimated Budget</label>
                                    <input
                                        type="number"
                                        id="estimated_budget"
                                        className="border p-2 rounded"
                                        placeholder="Enter Estimated Budget"
                                        value={estimatedBudget}
                                        onChange={(e) => setEstimatedBudget(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6">
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div >
                    <EventTable></EventTable>
                </div>
            </div>
        </div>
    );
}
