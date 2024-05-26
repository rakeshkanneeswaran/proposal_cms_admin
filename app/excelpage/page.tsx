"use client"
import React, { useState } from 'react'
import axios from 'axios';
import * as XLSX from "xlsx"
import { signOut } from 'next-auth/react';

import { Appbarexcel } from '@/components/appexceldashboard';
import { useSession } from 'next-auth/react'
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
            alert("No data to upload . Please upload excel sheet in perscribed format")
            return;
        }

        for (let i = 0; i < userData.length; i++) {
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
                console.log(result.data);

                if (result.data.messgae === "Validation error") {
                    console.error("Validation error:", result.data.message);
                    alert("Validation error: Improper format for excel file validation");
                    return;
                }

            } catch (error) {

                console.log("error identifird")
                console.error("Error uploading data", error);
            }
        }
        alert("all data has been added successfully");

        console.log("All data uploaded");
    }

    return (
        <div>
           <Appbarexcel onClick = {async ()=>{
          await signOut({ callbackUrl: '/signin' })
        }} ></Appbarexcel>
            <div className='py-16'></div>

            <div className='flex flex-col items-center'>
                <h1 className="mb-4 text-lg md:text-lg font-bold  text-cente uppercase  leading-none tracking-tight text-gray-900  lg:text-xl dark:text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-blue-600">
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
