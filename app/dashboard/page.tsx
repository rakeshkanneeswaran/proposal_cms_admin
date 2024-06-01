"use client";
import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function EventForm() {
  const { data: session, status } = useSession();
  const username = session?.user?.name;
  const router = useRouter();

  // State management as in the initial form
  const [eventTitle, setEventTitle] = useState('');
  const [category, setCategory] = useState('');
  const [fromData, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [convenorName, setConvenorName] = useState('');
  const [convenorDesignation, setConvenorDesignation] = useState('');
  const [mailId, setMailId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [duration, setDuration] = useState('');
  const [financialSupportOthers, setFinancialSupportOthers] = useState("");
  const [financialSupportSRMIST, setFinancialSupportSRMIST] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (status === "unauthenticated") {
      alert("Please sign in first");
      return;
    }

    try {
      const result = await axios.post('/api/proposal', {
        eventTitle,
        category,
        convenorName,
        convenorDesignation,
        mailId,
        mobileNumber,
        proposedPeriod: `${fromData} - ${toDate}`,
        duration,
        financialSupportOthers,
        financialSupportSRMIST,
        estimatedBudget,
        username
      });

      console.log("status code sent by server is " + result.status);
      if (result.status == 200 && result.data.email == true) {
        alert("Event added successfully and email sent successfully to applicant with email " + mailId)
      }
      else if (result.status == 200 && result.data.email == false) {
        alert("Event added successfully, but email not sent to applicant.")
      }

      // Reset form fields after successful submission
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
    } catch (error: any) {
      console.error("Error creating event:", error.response?.data || error.message);
      alert("Failed to create event. Please try again later.");
    }
  };

  return (
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
              <label htmlFor="mail_id" className="font-medium">Email</label>
              <input
                type="email"
                id="mail_id"
                className="border p-2 rounded"
                placeholder="Email"
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
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>

            {/* From Date */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="from_date" className="font-medium">From Date</label>
              <input
                type="date"
                id="from_date"
                className="border p-2 rounded"
                value={fromData}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="to_date" className="font-medium">To Date</label>
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
                type="number"
                id="duration"
                className="border p-2 rounded"
                placeholder="Enter Number of Days"
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
                placeholder="Enter other Financial Support"
                value={financialSupportOthers}
                onChange={(e) => setFinancialSupportOthers(e.target.value)}
                required
              />
            </div>

            {/* Financial Support (SRMIST) */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="financial_support_srmist" className="font-medium">Financial Support (SRMIST)</label>
              <input
                type="number"
                id="financial_support_srmist"
                className="border p-2 rounded"
                placeholder="Enter SRMIST Financial Support"
                value={financialSupportSRMIST}
                onChange={(e) => setFinancialSupportSRMIST(e.target.value)}
                required
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
                required
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
      </div>
    </div>
  );
}
