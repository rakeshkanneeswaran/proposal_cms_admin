"use client";

import { useState, useEffect, ChangeEvent } from "react";
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
    category: string;
    designation: string;
    totalExpenditure: number;
    sponsorshipDetails: string;
    pastEventsDetails: string;
    otherDetails: string;
    convenerName: string;
    convenerEmail: string;
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
        category: "",
        designation: "",
        totalExpenditure: 0,
        sponsorshipDetails: "",
        pastEventsDetails: "",
        otherDetails: "",
        convenerName: "",
        convenerEmail: "",
        fundFromUniversity: 0,
        fundFromRegistration: 0,
        fundFromSponsorship: 0,
        fundFromOtherSources: 0,
        detailedBudgets: [{ sno: 1, description: "", quantity: 1, costPerUnit: 0, totalAmount: 0 }],
        sponsorships: [{ sponsorshipDetails: "", associatingAgencies: "" }],
    });

    const [otherFundingResources, setOtherFundingResources] = useState(0);
    const [totalEstimatedBudget, setTotalEstimatedBudget] = useState(0);
    const [loading, setLoading] = useState(true); // Add loading state



    useEffect(() => {
        const otherFunding = 
            parseInt(formData.fundFromRegistration.toString()) + 
            parseInt(formData.fundFromSponsorship.toString())
        setOtherFundingResources(otherFunding);
    }, [formData.fundFromRegistration, formData.fundFromSponsorship]);

    useEffect(() => {
        const totalBudget = parseInt(formData.fundFromUniversity.toString()) + otherFundingResources;
        setTotalEstimatedBudget(totalBudget);
    }, [formData.fundFromUniversity, otherFundingResources]);

    useEffect(() => {
        const totalBudgetFromDetailedBudgets = formData.detailedBudgets.reduce((acc, budget) => acc + Math.round(budget.totalAmount), 0);
        setFormData(prevFormData => ({ ...prevFormData, totalExpenditure: totalBudgetFromDetailedBudgets }));
    }, [formData.detailedBudgets]);

    // Handle input change for basic fields
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle budget table row change
    const handleBudgetChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedBudgets = [...formData.detailedBudgets];
        if (name === "quantity" || name === "costPerUnit") {
            updatedBudgets[index] = { ...updatedBudgets[index], [name]: parseFloat(value) };
        } else {
            updatedBudgets[index] = { ...updatedBudgets[index], [name]: value };
        }
        updatedBudgets[index].totalAmount = updatedBudgets[index].quantity * updatedBudgets[index].costPerUnit;
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
            detailedBudgets: [...formData.detailedBudgets, { sno: formData.detailedBudgets.length + 1, description: "", quantity: 1, costPerUnit: 0, totalAmount: 0 }]
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
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get("edit");

        const totalBudgetFromDetailedBudgets = formData.detailedBudgets.reduce((acc, budget) => acc + budget.totalAmount, 0);
        if (totalBudgetFromDetailedBudgets !== totalEstimatedBudget) {
            alert("Total budget from detailed budgets must match the total estimated budget.");
            return;
        }

        //disable buttons
        document.querySelectorAll("button").forEach(button => button.disabled = true);
        document.querySelectorAll("button").forEach(button => button.classList.add("disabled"));

        try {
            const newData = formData;
            newData.fundFromOtherSources = otherFundingResources;
            //for each rows in detailed budget, add description of the respective dom
            const detailedBudgets = document.querySelectorAll("input[name='description']");
            for (let i = 0; i < detailedBudgets.length; i++) {
                newData.detailedBudgets[i].description = (detailedBudgets[i] as HTMLInputElement).value;
            }
            if (editId) {
                await axios.post(`/api/proposals?id=${editId}`, newData);
            } else {
                await axios.post("/api/proposals", newData);
            }
            alert("Proposal submitted successfully!");
        } catch (error) {
            alert("Error submitting proposal");
        }

        //enable buttons
        document.querySelectorAll("button").forEach(button => button.disabled = false);
        document.querySelectorAll("button").forEach(button => button.classList.remove("disabled"));
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get("edit");

        if (editId) {
            axios.get(`/api/proposals?id=${editId}`)
                .then(response => {
                    const proposalData = response.data;
                    setFormData(proposalData);
                    setLoading(false); // Set loading to false after data is fetched
                })
                .catch(error => {
                    console.error("Error fetching proposal data:", error);
                    setLoading(false); // Set loading to false even if there's an error
                });
        } else {
            setLoading(false); // Set loading to false if there's no edit ID
        }
    }, []);

    if (loading) {
        return <div className="bg-gray-100 min-h-screen flex justify-center items-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-4">Submit Proposal</h2>
                <form onSubmit={handleSubmit}>

                    {/* Basic Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <label>
                            Organizing Department:
                            <input className="border p-2 mt-1" name="department" placeholder="Organizing Department" value={formData.department} onChange={handleChange} required />
                        </label>
                        <label>
                            Event Title:
                            <input className="border p-2 mt-1" name="brandTitle" placeholder="Event Title" value={formData.brandTitle} onChange={handleChange} required />
                        </label>
                        <label>
                            Duration of Event:
                            <input className="border p-2 mt-1" name="duration" placeholder="Duration of Event" value={formData.duration} onChange={handleChange} required />
                        </label>
                        <label>
                            Event Date:
                            <input type="date" className="border p-2 mt-1" name="eventDate" value={formData.eventDate.split('T')[0]} onChange={handleChange} required />
                        </label>
                        <label>
                            Category:
                            <select className="border p-2 mt-1" name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                <option value="Faculty Development Program (FDP)">Faculty Development Program (FDP)</option>
                                <option value="Short Term Training Program (STTP)">Short Term Training Program (STTP)</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Conference">Conference</option>
                                <option value="Conclave">Conclave</option>
                                <option value="Summit">Summit</option>
                                <option value="Expo">Expo</option>
                                <option value="Hackathon">Hackathon</option>
                                <option value="Others">Others</option>
                            </select>
                        </label>
                        <label>
                            Designation:
                            <input className="border p-2 mt-1" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} required />
                        </label>
                        <label>
                            Total Estimated Budget (₹):
                            <input type="number" className="border p-2 mt-1" name="totalExpenditure" value={totalEstimatedBudget} readOnly />
                        </label>
                        <label>
                            Sponsorship Details:
                            <input className="border p-2 mt-1" name="sponsorshipDetails" placeholder="Sponsorship Details" value={formData.sponsorshipDetails} onChange={handleChange} required />
                        </label>
                        <label>
                            Past Events (2021-2024):
                            <input className="border p-2 mt-1" name="pastEventsDetails" placeholder="Past Events (2021-2024)" value={formData.pastEventsDetails} onChange={handleChange} required />
                        </label>
                        <label>
                            Any Other Relevant Details:
                            <input className="border p-2 mt-1" name="otherDetails" placeholder="Any Other Relevant Details" value={formData.otherDetails} onChange={handleChange} required />
                        </label>
                        <label>
                            Convener Name:
                            <input className="border p-2 mt-1" name="convenerName" placeholder="Your Name" value={formData.convenerName} onChange={handleChange} required />
                        </label>
                        <label>
                            Convener Email:
                            <input type="email" className="border p-2 mt-1" name="convenerEmail" placeholder="Your Email" value={formData.convenerEmail} onChange={handleChange} required />
                        </label>
                        <label>
                            Fund from University (₹):
                            <input type="number" className="border p-2 mt-1" name="fundFromUniversity" placeholder="Fund from University (₹)" value={formData.fundFromUniversity} onChange={handleChange} required />
                        </label>
                        <label>
                            Fund from Registration (₹):
                            <input type="number" className="border p-2 mt-1" name="fundFromRegistration" placeholder="Fund from Registration (₹)" value={formData.fundFromRegistration} onChange={handleChange} required />
                        </label>
                        <label>
                            Fund from Sponsorship (₹):
                            <input type="number" className="border p-2 mt-1" name="fundFromSponsorship" placeholder="Fund from Sponsorship (₹)" value={formData.fundFromSponsorship} onChange={handleChange} required />
                        </label>
                        <label>
                            Fund from Other Sources (₹):
                            <input type="number" className="border p-2 mt-1" name="fundFromOtherSources" placeholder="Fund from Other Sources (₹)" value={otherFundingResources} readOnly />
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
                                    <td className="border p-2"><input type="text" name="description" className="w-full mt-1" value={row.description} onChange={(e) => handleBudgetChange(index, e)} required /></td>
                                    <td className="border p-2"><input type="number" name="quantity" className="w-full mt-1" value={row.quantity} onChange={(e) => handleBudgetChange(index, e)} required /></td>
                                    <td className="border p-2"><input type="number" name="costPerUnit" className="w-full mt-1" value={row.costPerUnit} onChange={(e) => handleBudgetChange(index, e)} required /></td>
                                    <td className="border p-2"><input type="number" name="totalAmount" className="w-full mt-1" value={row.totalAmount} readOnly /></td>
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
                                    <td className="border p-2"><input type="text" name="sponsorshipDetails" className="w-full mt-1" value={row.sponsorshipDetails} onChange={(e) => handleSponsorshipChange(index, e)} required /></td>
                                    <td className="border p-2"><input type="text" name="associatingAgencies" className="w-full mt-1" value={row.associatingAgencies} onChange={(e) => handleSponsorshipChange(index, e)} required /></td>
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