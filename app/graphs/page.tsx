'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Appbargraphs } from '@/components/appbargraphs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement // Register PointElement here
);

interface Proposal {
    id: number;
    startDate: string;
    financialSupportOthers: string;
    financialSupportSRMIST: string;
    category: 'hackathon' | 'workshop' | 'event' | 'ideathon'; // Define category type
}

export default function GraphsPage() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [eventChartData, setEventChartData] = useState<any>(null);
    const [budgetChartData, setBudgetChartData] = useState<any>(null);
    const [eventLineChartData, setEventLineChartData] = useState<any>(null);
    const [categoryChartData, setCategoryChartData] = useState<any>(null);

    useEffect(() => {
        async function getProposals() {
            try {
                const result = await axios.get<{ proposal: Proposal[] }>("/api/proposal");
                setProposals(result.data.proposal);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            }
        }

        getProposals();
    }, []);

    useEffect(() => {
        if (proposals.length > 0) {
            // Event Proposals by Month (Bar Chart)
            const monthlyCounts = proposals.reduce((acc: { [key: string]: number }, proposal) => {
                const month = new Date(proposal.startDate).toLocaleString('default', { month: 'long' });
                if (!acc[month]) {
                    acc[month] = 0;
                }
                acc[month]++;
                return acc;
            }, {});

            const eventData = {
                labels: Object.keys(monthlyCounts),
                datasets: [
                    {
                        label: 'Number of Events',
                        data: Object.values(monthlyCounts),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            };

            setEventChartData(eventData);

            // Total Budget Distribution (Pie Chart)
            const totalFinancialSupportOthers = proposals.reduce((acc, proposal) => acc + parseFloat(proposal.financialSupportOthers || '0'), 0);
            const totalFinancialSupportSRMIST = proposals.reduce((acc, proposal) => acc + parseFloat(proposal.financialSupportSRMIST || '0'), 0);

            const budgetData = {
                labels: ['Financial Support (Others)', 'Financial Support (SRMIST)'],
                datasets: [
                    {
                        label: 'Total Budget',
                        data: [totalFinancialSupportOthers, totalFinancialSupportSRMIST],
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                        borderWidth: 1,
                    },
                ],
            };

            setBudgetChartData(budgetData);

            // Number of Events Over Time (Line Chart)
            const eventLineData = {
                labels: Object.keys(monthlyCounts),
                datasets: [
                    {
                        label: 'Number of Events',
                        data: Object.values(monthlyCounts),
                        fill: false,
                        borderColor: 'rgba(255, 206, 86, 1)',
                        tension: 0.1,
                    },
                ],
            };

            setEventLineChartData(eventLineData);

            // Category Distribution (Pie Chart)
            const categoryCounts = {
                hackathon: 0,
                workshop: 0,
                event: 0,
                ideathon: 0,
            };

            proposals.forEach(proposal => {
                categoryCounts[proposal.category]++;
            });

            const categoryData = {
                labels: Object.keys(categoryCounts),
                datasets: [
                    {
                        label: 'Category Distribution',
                        data: Object.values(categoryCounts),
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                        borderWidth: 1,
                    },
                ],
            };

            setCategoryChartData(categoryData);
        }
    }, [proposals]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-100 pt-28">
            <div>
                <Appbargraphs></Appbargraphs>
            </div>
            <div className="container mx-auto p-4 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-3xl mb-6 font-semibold text-blue-600">Event Proposals by Month</h2>
                    {eventChartData && (
                        <div className="bg-white shadow-md rounded-lg p-4 mb-8">
                            <Bar data={eventChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-3xl mb-6 font-semibold text-blue-600">Number of Events Over Time</h2>
                    {eventLineChartData && (
                        <div className="bg-white shadow-md rounded-lg p-4 mb-8">
                            <Line data={eventLineChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-3xl mb-6 font-semibold text-blue-600">Total Budget Distribution</h2>
                    {budgetChartData && (
                        <div className="bg-white shadow-md rounded-lg p-4 mb-8">
                            <Pie data={budgetChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
}
