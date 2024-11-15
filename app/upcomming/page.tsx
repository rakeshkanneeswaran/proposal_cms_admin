"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, differenceInCalendarDays } from 'date-fns';
import { Appbarupcomming } from '@/components/appbarupcomming';

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

    const renderEvents = () => {
        return (
            <div className='flex flex-col items-center'>
                <Appbarupcomming />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {proposals.map(proposal => {
                        const daysToGo = differenceInCalendarDays(new Date(proposal.startDate), new Date());
                        return (
                            <div key={proposal.id} className="border p-4 bg-white shadow rounded text-center">
                                <div className="font-bold text-blue-600">{proposal.eventTitle}</div>
                                <div className="text-sm text-gray-600">Category: {proposal.category}</div>
                                <div className="text-sm text-gray-600">Convenor: {proposal.convenorName}</div>
                                <div className="text-sm text-gray-600">Convenor Designation: {proposal.convenorDesignation}</div>
                                <div className="text-sm text-gray-600">Email: {proposal.mailId}</div>
                                <div className="text-sm text-gray-600">Mobile: {proposal.mobileNumber}</div>
                                <div className="text-sm text-gray-600">Proposed Period: {proposal.proposedPeriod}</div>
                                <div className="text-sm text-gray-600">Duration: {proposal.duration}</div>
                                <div className="text-sm text-gray-600">Financial Support (Others): {proposal.financialSupportOthers}</div>
                                <div className="text-sm text-gray-600">Financial Support (SRMIST): {proposal.financialSupportSRMIST}</div>
                                <div className="text-sm text-gray-600">Estimated Budget: {proposal.estimatedBudget}</div>
                                <div className="text-sm text-gray-600">Start Date: {format(new Date(proposal.startDate), 'dd MMM yyyy')}</div>
                                <div className="text-sm text-gray-600">End Date: {format(new Date(proposal.endDate), 'dd MMM yyyy')}</div>
                                <div className="text-sm font-bold text-red-500">Days to Go: {daysToGo}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-100 pt-28 flex flex-col items-center">
            <div className="container mx-auto p-4 md:p-20">
                <h2 className="text-3xl mb-6 font-semibold text-blue-600 text-center">All Events</h2>
                {renderEvents()}
            </div>
        </div>
    );
}
