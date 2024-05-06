import { useState } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react';

const EventForm = () => {
  const [eventTitle, setEventTitle] = useState('example');
  const [category, setCategory] = useState('example');
  const [convenorName, setConvenorName] = useState('example');
  const [convenorDesignation, setConvenorDesignation] = useState('example');
  const [mailId, setMailId] = useState('example');
  const [mobileNumber, setMobileNumber] = useState('example');
  const [proposedPeriod, setProposedPeriod] = useState('example');
  const [duration, setDuration] = useState('example');
  const [financialSupportOthers, setFinancialSupportOthers] = useState("");
  const [financialSupportSRMIST, setFinancialSupportSRMIST] = useState('example');
  const [estimatedBudget, setEstimatedBudget] = useState('example');

  const { data: session, status } = useSession();
  const username = session?.user?.name;

  const handleSubmit = async (e:any) => {
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
        proposedPeriod,
        duration,
        financialSupportOthers,
        financialSupportSRMIST,
        estimatedBudget,
        username
      });

      console.log("Event created successfully:", result.data);
      alert("Event submitted successfully!");

      // Reset form fields after successful submission
      setEventTitle('');
      setConvenorName('');
      setConvenorDesignation('');
      setMailId('');
      setMobileNumber('');
      setProposedPeriod('');
      setDuration('');
      setFinancialSupportOthers('');
      setFinancialSupportSRMIST('');
      setEstimatedBudget('');

    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again later.");
    }
  };

  return (
    <form className="h-screen bg-white" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="event_title" className="block mb-2 text-sm font-medium text-gray-900">
          Event Title
        </label>
        <input
          type="text"
          id="event_title"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="event_title" className="block mb-2 text-sm font-medium text-gray-900">
          Category
        </label>
        <input
          type="text"
          id="event_category"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Event Title"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="convenor_name" className="block mb-2 text-sm font-medium text-gray-900">
          Convenor Name
        </label>
        <input
          type="text"
          id="convenor_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Convenor Name"
          value={convenorName}
          onChange={(e) => setConvenorName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="convenor_designation" className="block mb-2 text-sm font-medium text-gray-900">
          Convenor Designation
        </label>
        <input
          type="text"
          id="convenor_designation"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Convenor Designation"
          value={convenorDesignation}
          onChange={(e) => setConvenorDesignation(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="mail_id" className="block mb-2 text-sm font-medium text-gray-900">
          Email
        </label>
        <input
          type="email"
          id="mail_id"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Email"
          value={mailId}
          onChange={(e) => setMailId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="mobile_number" className="block mb-2 text-sm font-medium text-gray-900">
          Mobile Number
        </label>
        <input
          type="tel"
          id="mobile_number"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="proposed_period" className="block mb-2 text-sm font-medium text-gray-900">
          Proposed Period
        </label>
        <input
          type="text"
          id="proposed_period"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Proposed Period"
          value={proposedPeriod}
          onChange={(e) => setProposedPeriod(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-900">
          Duration
        </label>
        <input
          type="text"
          id="duration"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="financial_support_others" className="block mb-2 text-sm font-medium text-gray-900">
          Financial Support (Others)
        </label>
        <input
          type="number"
          id="financial_support_others"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Financial Support (Others)"
          value={financialSupportOthers}
          onChange={(e) => setFinancialSupportOthers(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="financial_support_srmist" className="block mb-2 text-sm font-medium text-gray-900">
          Financial Support (SRMIST)
        </label>
        <input
          type="number"
          id="financial_support_srmist"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Financial Support (SRMIST)"
          value={financialSupportSRMIST}
          onChange={(e) => setFinancialSupportSRMIST(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="estimated_budget" className="block mb-2 text-sm font-medium text-gray-900">
          Estimated Budget
        </label>
        <input
          type="number"
          id="estimated_budget"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Estimated Budget"
          value={estimatedBudget}
          onChange={(e) => setEstimatedBudget(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Submit
      </button>
    </form>
  );
};

export default EventForm;
