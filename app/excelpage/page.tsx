"use client"

import React, { useState } from 'react'
import axios from 'axios';
import * as XLSX from "xlsx"
import { signOut } from 'next-auth/react';

import { Appbarexcel } from '@/components/appexceldashboard';
import { useSession } from 'next-auth/react'
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
    proposedPeriod: string;  // Assuming `${fromDate} - ${toDate}` will be a string
    duration: string;
    financialSupportOthers: string;
    financialSupportSRMIST: string;
    estimatedBudget: string;
}
type UserArray = User[];

export default function Excelpage() {
    const [filename, setFileName] = useState("Your file name will appear here");
    const [userData, setUserData] = useState<UserArray | null>(null);
    const { data: session, status } = useSession();
    const username = session?.user?.name;

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
    }

    const handleUpload = async () => {
        if (!userData) {
            console.error("No data to upload");
            alert("No data to upload. Please upload an excel sheet in the prescribed format.");
            return;
        }

        for (let i = 0; i < userData.length; i++) {
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
                    } else {
                        console.log("Email not sent to applicant with email: " + userData[i].mailId);
                        alert("Event submitted successfully, but email not sent to applicant.");
                    }
                } else {
                    console.error("Error: Status code sent by server for accessing database is " + result.status);
                    alert("Event not added. Email not sent to applicant.");
                }
            } catch (error) {
                console.error("Error uploading data", error);
                alert("Failed to create event. Please try again later.");
            }
        }
        alert("All data has been added successfully.");
        console.log("All data uploaded");
    }

    return (
        <div>
            <div className='py-6'>

            </div>
            <Appbarexcel onClick={async () => {
                await signOut({ callbackUrl: '/signin' })
            }} ></Appbarexcel>
            <div className='py-16'></div>

            <div className='flex flex-col items-center'>
                <h1 className="mb-4 text-lg md:text-lg font-bold  text-cente uppercase  leading-none tracking-tight text-gray-900  lg:text-xl dark:text-white">
                    <span className="text-red-600">
                        By Choosing  your excel file your can directly add the details. please make sure that excel file is present in the prescribed format
                    </span>{' '}
                </h1>


                <div className="mb-4 text-lg md:text-lg font-bold  text-cente uppercase  leading-none tracking-tight text-gray-900  lg:text-xl dark:text-white">SELECTED FILE: {filename} </div>
                <div>
                    <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
                </div>
                <div>
                    <button type="button" onClick={handleUpload} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Upload Data</button>
                </div>
            </div>

        </div>
    )
}
