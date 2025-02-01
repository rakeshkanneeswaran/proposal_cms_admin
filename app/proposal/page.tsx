"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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

interface Proposal {
    id: string;
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
    active: boolean;
    rejected: boolean;
    detailedBudgets: DetailedBudget[];
    sponsorships: Sponsorship[];
}

export default function ProposalsPage() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProposals() {
            try {
                const response = await axios.get("/api/proposals");
                setProposals(response.data);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProposals();
    }, []);

    const handleView = (proposal: Proposal) => {
        setSelectedProposal(proposal);
        setModalOpen(true);
    };

    const handleApprove = async (id: string, email: string) => {
        //disable other buttons
        document.querySelectorAll("button").forEach(button => button.disabled = true);
        document.querySelectorAll("button").forEach(button => button.classList.add("disabled"));

        try {
            await axios.put(`/api/proposals?id=${id}`);
            alert("Proposal approved!");
            setModalOpen(false);
            setProposals(proposals.map((p) => (p.id === id ? { ...p, active: true, rejected: false } : p)));

        } catch (error) {
            console.error("Error approving proposal:", error);
            alert("Error approving proposal!");
        }
        document.querySelectorAll("button").forEach(button => button.disabled = false);
        document.querySelectorAll("button").forEach(button => button.classList.remove("disabled"));
    };

    const handleReject = async (id: string, email: string) => {

        //disable other buttons
        document.querySelectorAll("button").forEach(button => button.disabled = true);
        document.querySelectorAll("button").forEach(button => button.classList.add("disabled"));

        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        try {
            await axios.delete(`/api/proposals?id=${id}&reason=${reason}`);
            alert("Proposal rejected!");
            setModalOpen(false);
            setProposals(proposals.map((p) => (p.id === id ? { ...p, active: false, rejected: true } : p)));
        } catch (error) {
            console.error("Error rejecting proposal:", error);
        }

        //enable other buttons
        document.querySelectorAll("button").forEach(button => button.disabled = false);
        document.querySelectorAll("button").forEach(button => button.classList.remove("disabled"));
    };

    const router = useRouter();

    return (
        <>

            <div className="flex justify-end p-3">
                <button
                    type="button"
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
                    onClick={() => {
                        router.push('/dashboard');
                    }}
                >
                    Back to dashboard
                </button>
            </div>

            <div className="p-3">
                <h1 className="text-2xl font-bold mb-4">Proposals</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Event Name</th>
                                <th className="border p-2">Convener</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposals.map((proposal) => (
                                <tr key={proposal.id} className="text-center">
                                    <td className="border p-2">{proposal.brandTitle}</td>
                                    <td className="border p-2">{proposal.convener}</td>
                                    <td className="border p-2">{!proposal.active && !proposal.rejected ? "Pending" : proposal.active ? "Approved" : "Rejected"}</td>
                                    <td className="border p-2">
                                        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={() => handleView(proposal)}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {modalOpen && selectedProposal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
                            <h2 className="text-xl font-bold mb-4">Proposal Details</h2>
                            <p><strong>Department:</strong> {selectedProposal.department}</p>
                            <p><strong>Event Title:</strong> {selectedProposal.brandTitle}</p>
                            <p><strong>Duration:</strong> {selectedProposal.duration}</p>
                            <p><strong>Event Date:</strong> {new Date(selectedProposal.eventDate).toLocaleDateString()}</p>
                            <p><strong>Convener:</strong> {selectedProposal.convener} ({selectedProposal.designation})</p>
                            <p><strong>Total Expenditure:</strong> ₹{selectedProposal.totalExpenditure}</p>
                            <p><strong>Sponsorship Details:</strong> {selectedProposal.sponsorshipDetails}</p>
                            <p><strong>Past Events:</strong> {selectedProposal.pastEventsDetails}</p>
                            <p><strong>Other Details:</strong> {selectedProposal.otherDetails}</p>

                            <h3 className="text-lg font-bold mt-4">Detailed Budget</h3>
                            <table className="w-full border-collapse border mt-2">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">S.No</th>
                                        <th className="border p-2">Description</th>
                                        <th className="border p-2">Quantity</th>
                                        <th className="border p-2">Cost/Unit</th>
                                        <th className="border p-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProposal.detailedBudgets.map((budget, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">{budget.sno}</td>
                                            <td className="border p-2">{budget.description}</td>
                                            <td className="border p-2">{budget.quantity}</td>
                                            <td className="border p-2">₹{budget.costPerUnit}</td>
                                            <td className="border p-2">₹{budget.totalAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h3 className="text-lg font-bold mt-4">Sponsorships</h3>
                            <table className="w-full border-collapse border mt-2">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Sponsorship Details</th>
                                        <th className="border p-2">Associating Agencies</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProposal.sponsorships.map((sponsorship, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">{sponsorship.sponsorshipDetails}</td>
                                            <td className="border p-2">{sponsorship.associatingAgencies}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-4 flex justify-between">
                                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleApprove(selectedProposal.id, selectedProposal.yourEmail)}>
                                    Approve
                                </button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleReject(selectedProposal.id, selectedProposal.yourEmail)}>
                                    Reject
                                </button>
                                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setModalOpen(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
