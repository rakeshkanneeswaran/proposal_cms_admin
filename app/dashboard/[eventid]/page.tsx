"use client";

import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";

import { Appbarupdatepage } from "@/components/appbarupdatepage";
import axios from "axios";



export default function Page({ params }: {
    params: {
        eventid: string
    }
}) {

    const { data: session, status } = useSession();
    const username = session?.user?.name;
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
    const router  = useRouter()
    async function getEventData() {
        const result = await axios.get(`/api/proposal?id=${params.eventid}`);
        console.log(result.data);
        const proposal = result.data.proposal;
        setEventTitle(proposal.eventTitle);
        console.log(proposal.eventTitle);
        setCategory(proposal.category);
        setFromDate(proposal.fromDate);
        setToDate(proposal.toDate);
        setConvenorName(proposal.convenorName);
        setConvenorDesignation(proposal.convenorDesignation);
        setMailId(proposal.mailId);
        setMobileNumber(proposal.mobileNumber);
        setDuration(proposal.duration);
        setFinancialSupportOthers(proposal.financialSupportOthers);
        setFinancialSupportSRMIST(proposal.financialSupportSRMIST);
        setEstimatedBudget(proposal.estimatedBudget);
    }

    useEffect(() => {
        getEventData();
    }, []);

    useEffect(() => {
        console.log(eventTitle);
    }, [eventTitle]);


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (status === "unauthenticated") {
            alert("Please sign in first");
            return;
        }

        try {
            const response = await axios.put(`/api/proposal?id=${params.eventid}`, {
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
                alert("Event Updated Successfully")
                router.push("/dashboard")

            }
            else {
                alert("Failed to update event. Please try again later.");
            }



        } catch (error) {
            console.error("Error submitting form", error);
            alert("Failed to create event. Please try again later.");
        }
    };

    return (
        <div>
            <div>
                <Appbarupdatepage onClick={signOut}></Appbarupdatepage>
            </div>
            <div className='py-16'></div>
            <div className="flex justify-center items-center min-h-screen p-4 ">
                <div className="w-full max-w-2xl bg-white p-8 rounded-lg  shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Update Your Event</h2>
                    <p className="mb-4">Update your event by clicking update button .</p>
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
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update Event</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}
