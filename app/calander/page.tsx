'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { Appbarcalander } from '@/components/appbarcalander';

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
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    useEffect(() => {
        async function getProposals() {
            try {
                const result = await axios.get<{ proposal: Proposal[] }>("/api/proposal");
                console.log(result.data);
                setProposals(result.data.proposal);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            }
        }

        getProposals();
    }, []);

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const proposalsByDate = proposals.reduce((acc: { [key: string]: Proposal[] }, proposal) => {
        const startDate = format(new Date(proposal.startDate), 'yyyy-MM-dd');
        if (!acc[startDate]) {
            acc[startDate] = [];
        }
        acc[startDate].push(proposal);
        return acc;
    }, {});

    const renderCalendar = () => {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
                {daysInMonth.map((day, index) => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    return (
                        <div key={index} className="border p-2 bg-white shadow rounded">
                            <div className="font-bold text-blue-600">{format(day, 'd')}</div>
                            {proposalsByDate[dayKey]?.map(proposal => (
                                <div key={proposal.id} className="bg-green-200 text-sm p-1 mt-1 rounded">
                                    {proposal.eventTitle}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    const previousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

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
            <div key={title} className="mb-12 h-96 overflow-y-scroll">
                <h2 className="text-3xl mb-6 font-semibold text-blue-600">{title}</h2>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="p-3 border border-gray-300">ID</th>
                                <th className="p-3 border border-gray-300">Category</th>
                                <th className="p-3 border border-gray-300">Event Title</th>
                                <th className="p-3 border border-gray-300">Convenor Name</th>
                                <th className="p-3 border border-gray-300">Convenor Designation</th>
                                <th className="p-3 border border-gray-300">Mail ID</th>
                                <th className="p-3 border border-gray-300">Mobile Number</th>
                                <th className="p-3 border border-gray-300">Proposed Period</th>
                                <th className="p-3 border border-gray-300">Duration</th>
                                <th className="p-3 border border-gray-300">Financial Support (Others)</th>
                                <th className="p-3 border border-gray-300">Financial Support (SRMIST)</th>
                                <th className="p-3 border border-gray-300">Estimated Budget</th>
                                <th className="p-3 border border-gray-300">Start Date</th>
                                <th className="p-3 border border-gray-300">End Date</th>
                                <th className="p-3 border border-gray-300">Created At</th>
                            </tr>
                        </thead>
                        <tbody className={isScrollable ? 'max-h-64 overflow-y-auto' : ''}>
                            {proposals.map(proposal => (
                                <tr key={proposal.id} className="even:bg-blue-50">
                                    <td className="p-3 border border-gray-300">{proposal.id}</td>
                                    <td className="p-3 border border-gray-300">{proposal.category}</td>
                                    <td className="p-3 border border-gray-300">{proposal.eventTitle}</td>
                                    <td className="p-3 border border-gray-300">{proposal.convenorName}</td>
                                    <td className="p-3 border border-gray-300">{proposal.convenorDesignation}</td>
                                    <td className="p-3 border border-gray-300">{proposal.mailId}</td>
                                    <td className="p-3 border border-gray-300">{proposal.mobileNumber}</td>
                                    <td className="p-3 border border-gray-300">{proposal.proposedPeriod}</td>
                                    <td className="p-3 border border-gray-300">{proposal.duration}</td>
                                    <td className="p-3 border border-gray-300">{proposal.financialSupportOthers}</td>
                                    <td className="p-3 border border-gray-300">{proposal.financialSupportSRMIST}</td>
                                    <td className="p-3 border border-gray-300">{proposal.estimatedBudget}</td>
                                    <td className="p-3 border border-gray-300">{proposal.startDate}</td>
                                    <td className="p-3 border border-gray-300">{proposal.endDate}</td>
                                    <td className="p-3 border border-gray-300">{proposal.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-100 pt-28">
            <Appbarcalander />
            <div className="container mx-auto p-4 md:p-20">
                <div className="flex justify-between mb-4">
                    <button onClick={previousMonth} className="p-2 bg-blue-500 text-white rounded">Previous</button>
                    <h2 className="text-2xl font-semibold text-blue-600">{format(currentMonth, 'MMMM yyyy')}</h2>
                    <button onClick={nextMonth} className="p-2 bg-blue-500 text-white rounded">Next</button>
                </div>
                {renderCalendar()}
                <div className="mt-8"></div> {/* Add space after the calendar */}
                {renderTable('Proposals (July to June)', proposalsJulyToJune)}
                {renderTable('Proposals (January to December)', proposalsJanuaryToDecember)}
                {Object.entries(monthlyProposals).map(([month, proposals]) => (
                    <div key={month}>
                        {renderTable(`Proposals (${month})`, proposals)}
                    </div>
                ))}
            </div>
        </div>
    );
    
}
