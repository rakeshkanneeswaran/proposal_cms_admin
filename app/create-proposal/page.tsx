"use client";

import { useState, ChangeEvent } from "react";
import axios from "axios";

// Define TypeScript interfaces
interface DetailedBudget {
  sno: number;
  description: string;
  quantity: number;
  costPerUnit: number;
  totalAmount: number;
}

interface Sponsorship {
  sponsorshipDetails: string;
  associatingAgencies: string;
}

interface ProposalFormData {
  department: string;
  brandTitle: string;
  duration: string;
  eventDate: string;
  convener: string;
  designation: string;
  totalExpenditure: number;
  sponsorshipDetails: string;
  pastEventsDetails: string;
  otherDetails: string;
  yourName: string;
  yourEmail: string;
  fundFromUniversity: number;
  fundFromRegistration: number;
  fundFromSponsorship: number;
  fundFromOtherSources: number;
  detailedBudgets: DetailedBudget[];
  sponsorships: Sponsorship[];
}

export default function CreateProposal() {
  const [formData, setFormData] = useState<ProposalFormData>({
    department: "",
    brandTitle: "",
    duration: "",
    eventDate: "",
    convener: "",
    designation: "",
    totalExpenditure: 0,
    sponsorshipDetails: "",
    pastEventsDetails: "",
    otherDetails: "",
    yourName: "",
    yourEmail: "",
    fundFromUniversity: 0,
    fundFromRegistration: 0,
    fundFromSponsorship: 0,
    fundFromOtherSources: 0,
    detailedBudgets: [{ sno: 1, description: "", quantity: 1, costPerUnit: 0, totalAmount: 0 }],
    sponsorships: [{ sponsorshipDetails: "", associatingAgencies: "" }],
  });

  // Handle input change for basic fields
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle budget table row change
  const handleBudgetChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedBudgets = [...formData.detailedBudgets];
    updatedBudgets[index] = { ...updatedBudgets[index], [name]: value };
    setFormData({ ...formData, detailedBudgets: updatedBudgets });
  };

  // Handle sponsorship table row change
  const handleSponsorshipChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedSponsorships = [...formData.sponsorships];
    updatedSponsorships[index] = { ...updatedSponsorships[index], [name]: value };
    setFormData({ ...formData, sponsorships: updatedSponsorships });
  };

  // Add new row to budget table
  const addBudgetRow = () => {
    setFormData({
      ...formData,
      detailedBudgets: [...formData.detailedBudgets, { sno: formData.detailedBudgets.length + 1, description: "", quantity: 1, costPerUnit: 0, totalAmount: 0}]
    });
  };

  // Add new row to sponsorship table
  const addSponsorshipRow = () => {
    setFormData({
      ...formData,
      sponsorships: [...formData.sponsorships, { sponsorshipDetails: "", associatingAgencies: "" }]
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    //disable buttons
    document.querySelectorAll("button").forEach(button => button.disabled = true);
    document.querySelectorAll("button").forEach(button => button.classList.add("disabled"));

    e.preventDefault();
    try {
      await axios.post("/api/proposals", formData);
      alert("Proposal submitted successfully!");
    } catch (error) {
      alert("Error submitting proposal");
    }

    //enable buttons
    document.querySelectorAll("button").forEach(button => button.disabled = false);
    document.querySelectorAll("button").forEach(button => button.classList.remove("disabled"));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Submit Proposal</h2>
        <form onSubmit={handleSubmit}>

          {/* Basic Details */}
          <div className="grid grid-cols-2 gap-4">
            <label>
              Organizing Department:
              <input className="border p-2 mt-1" name="department" placeholder="Organizing Department" onChange={handleChange} required />
            </label>
            <label>
              Event Title:
              <input className="border p-2 mt-1" name="brandTitle" placeholder="Event Title" onChange={handleChange} required />
            </label>
            <label>
              Duration of Event:
              <input className="border p-2 mt-1" name="duration" placeholder="Duration of Event" onChange={handleChange} required />
            </label>
            <label>
              Event Date:
              <input type="date" className="border p-2 mt-1" name="eventDate" onChange={handleChange} required />
            </label>
            <label>
              Convener Name:
              <input className="border p-2 mt-1" name="convener" placeholder="Convener Name" onChange={handleChange} required />
            </label>
            <label>
              Designation:
              <input className="border p-2 mt-1" name="designation" placeholder="Designation" onChange={handleChange} required />
            </label>
            <label>
              Total Estimated Budget (₹):
              <input type="number" className="border p-2 mt-1" name="totalExpenditure" placeholder="Total Estimated Budget (₹)" onChange={handleChange} required />
            </label>
            <label>
              Sponsorship Details:
              <input className="border p-2 mt-1" name="sponsorshipDetails" placeholder="Sponsorship Details" onChange={handleChange} required />
            </label>
            <label>
              Past Events (2021-2024):
              <input className="border p-2 mt-1" name="pastEventsDetails" placeholder="Past Events (2021-2024)" onChange={handleChange} required />
            </label>
            <label>
              Any Other Relevant Details:
              <input className="border p-2 mt-1" name="otherDetails" placeholder="Any Other Relevant Details" onChange={handleChange} required />
            </label>
            <label>
              Your Name:
              <input className="border p-2 mt-1" name="yourName" placeholder="Your Name" onChange={handleChange} required />
            </label>
            <label>
              Your Email:
              <input type="email" className="border p-2 mt-1" name="yourEmail" placeholder="Your Email" onChange={handleChange} required />
            </label>
            <label>
              Fund from University (₹):
              <input type="number" className="border p-2 mt-1" name="fundFromUniversity" placeholder="Fund from University (₹)" onChange={handleChange} required />
            </label>
            <label>
              Fund from Registration (₹):
              <input type="number" className="border p-2 mt-1" name="fundFromRegistration" placeholder="Fund from Registration (₹)" onChange={handleChange} required />
            </label>
            <label>
              Fund from Sponsorship (₹):
              <input type="number" className="border p-2 mt-1" name="fundFromSponsorship" placeholder="Fund from Sponsorship (₹)" onChange={handleChange} required />
            </label>
            <label>
              Fund from Other Sources (₹):
              <input type="number" className="border p-2 mt-1" name="fundFromOtherSources" placeholder="Fund from Other Sources (₹)" onChange={handleChange} required />
            </label>
          </div>

          {/* Budget Table */}
          <h3 className="text-lg font-bold mt-4">Detailed Budget</h3>
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-200">
            <th className="border p-2">S.No</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Cost/Unit (₹)</th>
            <th className="border p-2">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {formData.detailedBudgets.map((row, index) => (
            <tr key={index}>
              <td className="border p-2">{row.sno}</td>
              <td className="border p-2"><input type="text" name="description" className="w-full mt-1" onChange={(e) => handleBudgetChange(index, e)} required /></td>
              <td className="border p-2"><input type="number" name="quantity" className="w-full mt-1" onChange={(e) => handleBudgetChange(index, e)} required /></td>
              <td className="border p-2"><input type="number" name="costPerUnit" className="w-full mt-1" onChange={(e) => handleBudgetChange(index, e)} required /></td>
              <td className="border p-2"><input type="number" name="totalAmount" className="w-full mt-1" onChange={(e) => handleBudgetChange(index, e)} required /></td>
            </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="bg-green-500 text-white p-2 rounded mt-2" onClick={addBudgetRow}>+ Add Row</button>

          {/* Sponsorship Table */}
          <h3 className="text-lg font-bold mt-4">Sponsorship Details</h3>
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-200">
            <th className="border p-2">Sponsorship Details</th>
            <th className="border p-2">Associating Agencies</th>
              </tr>
            </thead>
            <tbody>
              {formData.sponsorships.map((row, index) => (
            <tr key={index}>
              <td className="border p-2"><input type="text" name="sponsorshipDetails" className="w-full mt-1" onChange={(e) => handleSponsorshipChange(index, e)} required /></td>
              <td className="border p-2"><input type="text" name="associatingAgencies" className="w-full mt-1" onChange={(e) => handleSponsorshipChange(index, e)} required /></td>
            </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="bg-green-500 text-white p-2 rounded mt-2" onClick={addSponsorshipRow}>+ Add Row</button>

          <button type="submit" className="bg-blue-500 text-white p-2 w-full mt-4 rounded">Submit Proposal</button>
        </form>
      </div>
    </div>
  );
}
