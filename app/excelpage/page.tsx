"use client"

import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from "xlsx";
import { signOut } from 'next-auth/react';
import { Appbarexcel } from '@/components/appexceldashboard';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

const confirmationSubject = "Confirmation for your proposal submitted at ctech";

interface Session {
    status: 'authenticated' | 'unauthenticated' | 'loading';
}

interface User {
    eventTitle: string;
    category: string;
    convenorName: string;
    convenorDesignation: string;
    mailId: string;
    mobileNumber: string;
    proposedPeriod: string;
    duration: string;
    financialSupportOthers: string;
    financialSupportSRMIST: string;
    estimatedBudget: string;
    toDate: number; // Change toDate and fromDate to number type for Excel serial date numbers
    fromDate: number;
}

type UserArray = User[];

export default function Excelpage() {
    const [filename, setFileName] = useState("Your file name will appear here");
    const [userData, setUserData] = useState<UserArray | null>(null);
    const [progress, setProgress] = useState(0);
    const [processing, setProcessing] = useState(false);
    const { data: session, status } = useSession();
    const username = session?.user?.name;

    const excelSerialToDate = (serial: number) => {
        const MS_PER_DAY = 86400000; // milliseconds per day
        const epoch = new Date(1899, 11, 30); // Excel epoch (December 30, 1899)

        const daysSinceEpoch = Math.floor(serial);
        const msForFractionalDay = Math.round((serial % 1) * MS_PER_DAY);
        const totalMsSinceEpoch = daysSinceEpoch * MS_PER_DAY + msForFractionalDay;

        const date = new Date(epoch.getTime() + totalMsSinceEpoch);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);

            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData: UserArray = XLSX.utils.sheet_to_json(worksheet);
            if (!jsonData) {
                console.log("data not available");
            } else {
                setUserData(jsonData);
                console.log(jsonData);
            }
        } else {
            console.error("No file selected");
        }
    };

    const handleUpload = async () => {
        if (!userData) {
            console.error("No data to upload");
            alert("No data to upload. Please upload an excel sheet in the prescribed format.");
            return;
        }

        setProcessing(true);
        setProgress(0);

        for (let i = 0; i < userData.length; i++) {
            const fromDate = excelSerialToDate(userData[i].fromDate);
            const toDate = excelSerialToDate(userData[i].toDate);

            const confirmationBody = `
                This is to confirm that your proposal has been approved with the following details:
                - Event Title: ${userData[i].eventTitle}
                - Category: ${userData[i].category}
                - Convenor Name: ${userData[i].convenorName}
                - Convenor Designation: ${userData[i].convenorDesignation}
                - Email: ${userData[i].mailId}
                - Mobile Number: ${userData[i].mobileNumber}
                - Proposed Period: ${userData[i].proposedPeriod}
                - Duration: ${JSON.stringify(userData[i].duration)} days
                - Financial Support (Others): ${JSON.stringify(userData[i].financialSupportOthers)}
                - Financial Support (SRMIST): ${JSON.stringify(userData[i].financialSupportSRMIST)}
                - Estimated Budget: ${JSON.stringify(userData[i].estimatedBudget)}
                - Start Date: ${fromDate}
                - End Date: ${toDate}
            `;

            try {
                const result = await axios.post('/api/proposal', {
                    eventTitle: userData[i].eventTitle,
                    category: userData[i].category,
                    convenorName: userData[i].convenorName,
                    convenorDesignation: userData[i].convenorDesignation,
                    mailId: userData[i].mailId,
                    mobileNumber: userData[i].mobileNumber,
                    proposedPeriod: userData[i].proposedPeriod,
                    duration: JSON.stringify(userData[i].duration),
                    financialSupportOthers: JSON.stringify(userData[i].financialSupportOthers),
                    financialSupportSRMIST: JSON.stringify(userData[i].financialSupportSRMIST),
                    estimatedBudget: JSON.stringify(userData[i].estimatedBudget),
                    fromDate,
                    toDate,
                    username
                });

                if (result.status === 200) {
                    const sendingEmailResult = await axios.post('/api/emailerapi', {
                        subject: confirmationSubject,
                        text: confirmationBody,
                        receiverEmail: userData[i].mailId
                    });

                    if (sendingEmailResult.status === 200) {
                        console.log("Email sent to applicant with email: " + userData[i].mailId);
                        toast.success("Email sent to applicant with email: " + userData[i].mailId)

                    } else {
                        console.log("Email not sent to applicant with email: " + userData[i].mailId);
                        toast.error("Email not sent to applicant with email: " + userData[i].mailId)

                    }
                } else {
                    console.error("Error: Status code sent by server for accessing database is " + result.status);
                    alert("Event not added. Email not sent to applicant.");
                }
            } catch (error) {
                console.error("Error uploading data", error);
                toast.error("Failed to create event. Please try again later.")
            }
            setProgress((prevProgress) => ((i + 1) / userData.length) * 100);
        }

        setProcessing(false);
        alert("All data has been added successfully.");
        console.log("All data uploaded");
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex flex-col items-center pt-28">
            <Appbarexcel onClick={async () => {
                await signOut({ callbackUrl: '/signin' });
            }} />
            <div className="container mx-auto p-8 mt-10 bg-white shadow-lg rounded-lg">
                <div className="text-center">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 uppercase tracking-wide">
                        Upload Your Excel File
                    </h1>
                    <p className="mb-8 text-gray-700">
                        By choosing your excel file, you can directly add the details. Please make sure that the excel file is in the prescribed format.
                    </p>
                </div>

                <div className="mb-8 text-lg font-semibold text-center text-gray-900">
                    Selected File: <span className="text-blue-600">{filename}</span>
                </div>

                <div className="flex justify-center mb-4">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFile}
                        className="px-4 py-2 border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="flex justify-center mb-8">
                    <button
                        type="button"
                        onClick={handleUpload}
                        className="px-6 py-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Upload Data
                    </button>
                </div>

                {userData && (
                    <>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div
                                className="bg-blue-600 h-4 rounded-full transition-width duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="text-lg font-medium text-center text-gray-700">
                            {processing ? "Processing..." : "Done"}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
