"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { Appbar } from '@/components/appbar';
import * as XLSX from "xlsx" // Ensure proper import

import { Appbarexcelpage } from '@/components/appexceldashboard';
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
    const [filename, setFileName] = useState("Your file name will appear here")
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
                console.log("data not avalabel")
            }

            else {

                console.log(jsonData);
                for (let i = 0; i < jsonData.length; i++) {
                    console.log(jsonData[i].eventTitle);
                    console.log(jsonData[i].category);
                    console.log(jsonData[i].convenorName);
                    console.log(jsonData[i].convenorDesignation);
                    console.log(jsonData[i].mailId);
                    console.log(jsonData[i].mobileNumber);
                    console.log(jsonData[i].proposedPeriod);
                    console.log(jsonData[i].financialSupportOthers);
                    console.log(jsonData[i].financialSupportSRMIST);
                    console.log(jsonData[i].estimatedBudget);
                    const result = await axios.post('/api/proposal', {
                        eventTitle: jsonData[i].eventTitle,
                        category: jsonData[i].category,
                        convenorName: jsonData[i].convenorName,
                        convenorDesignation: jsonData[i].convenorDesignation,
                        mailId: jsonData[i].mailId,
                        mobileNumber: jsonData[i].mobileNumber,
                        proposedPeriod: jsonData[i].proposedPeriod,
                        duration: JSON.stringify(jsonData[i].duration),
                        financialSupportOthers: JSON.stringify(jsonData[i].financialSupportOthers),
                        financialSupportSRMIST: JSON.stringify(jsonData[i].financialSupportSRMIST),
                        estimatedBudget: JSON.stringify(jsonData[i].estimatedBudget),
                        username
                    });



                }

                console.log(session)
            }



        } else {
            console.error("No file selected");
        }
    }

    return (
        <div>
            <Appbarexcelpage></Appbarexcelpage>
            <div className='py-16'></div>
            <div>This is the Excel page</div>
            <div>{filename}</div>
            <div>
                <input type="file" accept=".xlsx, .xls" onChange={handleFile} />

            </div>
        </div>
    )
}
