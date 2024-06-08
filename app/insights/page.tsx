'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Proposal {
    id: number;
    category: string;
    eventTitle: string;
    convenorName: string;
    convenorDesignation: string;
    mailId: string;
    mobileNumber: string;
    proposedPeriod: string;
    duration: string;
    financialSupportOthers: string;
    financialSupportSRMIST: string;
    estimatedBudget: string;
    startDate: string;
    endDate: string;
    createdAt: string;
}

export default function Page() {
    const [proposals, setProposals] = useState<Proposal[]>([]);

    async function getProposals() {
        try {
            const result = await axios.get<{ proposal: Proposal[] }>("/api/proposal");
            console.log(result.data);
            setProposals(result.data.proposal);
        } catch (error) {
            console.error("Error fetching proposals:", error);
        }
    }

    useEffect(() => {
        getProposals();
    }, []); // Empty dependency array to run once on mount

    const segregateByPeriod = (proposals: Proposal[], startMonth: number, endMonth: number): Proposal[] => {
        return proposals.filter(proposal => {
            const startDate = new Date(proposal.startDate);
            const month = startDate.getMonth() + 1;
            return (startMonth <= endMonth)
                ? (month >= startMonth && month <= endMonth)
                : (month >= startMonth || month <= endMonth);
        });
    };

    const proposalsJulyToJune = segregateByPeriod(proposals, 7, 6);
    const proposalsJanuaryToDecember = segregateByPeriod(proposals, 1, 12);

    const segregateMonthly = (proposals: Proposal[]): { [key: string]: Proposal[] } => {
        const monthlyProposals: { [key: string]: Proposal[] } = {};
        proposals.forEach(proposal => {
            const startDate = new Date(proposal.startDate);
            const month = startDate.toLocaleString('default', { month: 'long' });
            if (!monthlyProposals[month]) {
                monthlyProposals[month] = [];
            }
            monthlyProposals[month].push(proposal);
        });
        return monthlyProposals;
    };

    const monthlyProposals = segregateMonthly(proposals);

    const renderTable = (title: string, proposals: Proposal[]) => {
        const isScrollable = proposals.length > 5;
        return (
            <div key={title} className="mb-8">
                <h2 className="text-2xl mb-4">{title}</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border border-gray-200">ID</th>
                                <th className="p-2 border border-gray-200">Category</th>
                                <th className="p-2 border border-gray-200">Event Title</th>
                                <th className="p-2 border border-gray-200">Convenor Name</th>
                                <th className="p-2 border border-gray-200">Convenor Designation</th>
                                <th className="p-2 border border-gray-200">Mail ID</th>
                                <th className="p-2 border border-gray-200">Mobile Number</th>
                                <th className="p-2 border border-gray-200">Proposed Period</th>
                                <th className="p-2 border border-gray-200">Duration</th>
                                <th className="p-2 border border-gray-200">Financial Support Others</th>
                                <th className="p-2 border border-gray-200">Financial Support SRMIST</th>
                                <th className="p-2 border border-gray-200">Estimated Budget</th>
                                <th className="p-2 border border-gray-200">Start Date</th>
                                <th className="p-2 border border-gray-200">End Date</th>
                                <th className="p-2 border border-gray-200">Created At</th>
                            </tr>
                        </thead>
                        <tbody className={isScrollable ? 'max-h-64 overflow-y-auto' : ''}>
                            {proposals.map(proposal => (
                                <tr key={proposal.id}>
                                    <td className="p-2 border border-gray-200">{proposal.id}</td>
                                    <td className="p-2 border border-gray-200">{proposal.category}</td>
                                    <td className="p-2 border border-gray-200">{proposal.eventTitle}</td>
                                    <td className="p-2 border border-gray-200">{proposal.convenorName}</td>
                                    <td className="p-2 border border-gray-200">{proposal.convenorDesignation}</td>
                                    <td className="p-2 border border-gray-200">{proposal.mailId}</td>
                                    <td className="p-2 border border-gray-200">{proposal.mobileNumber}</td>
                                    <td className="p-2 border border-gray-200">{proposal.proposedPeriod}</td>
                                    <td className="p-2 border border-gray-200">{proposal.duration}</td>
                                    <td className="p-2 border border-gray-200">{proposal.financialSupportOthers}</td>
                                    <td className="p-2 border border-gray-200">{proposal.financialSupportSRMIST}</td>
                                    <td className="p-2 border border-gray-200">{proposal.estimatedBudget}</td>
                                    <td className="p-2 border border-gray-200">{proposal.startDate}</td>
                                    <td className="p-2 border border-gray-200">{proposal.endDate}</td>
                                    <td className="p-2 border border-gray-200">{proposal.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            {renderTable('Proposals (July to June)', proposalsJulyToJune)}
            {renderTable('Proposals (January to December)', proposalsJanuaryToDecember)}
            {Object.entries(monthlyProposals).map(([month, proposals]) => (
                <div key={month}>
                    {renderTable(`Proposals (${month})`, proposals)}
                </div>
            ))}
        </div>
    );
}
