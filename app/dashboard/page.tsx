"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EventForm from '@/components/eventform';
import { Appbar } from '@/components/appbar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Eventdetails } from '@/components/eventdetails';

export default function Dashboard() {

    const router = useRouter();
    const session = useSession();
    const [proposal, setproposal] = useState([]);

    useEffect(() => {
        // Fetch events data when component mounts

        console.log(session.data?.user?.name)
        axios.get('/api/proposal')
        
            .then(response => {
                setproposal(response.data.proposal);
                console.log(response.data.proposal)
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });

        // Redirect based on session status
        if (session.status === "unauthenticated") {
            router.push("/");
        } else {
            router.push("/dashboard");
        }
    }, [session, router]);

    return (
        <div className='flex flex-col bg-white h-screen'>
            <Appbar />
            <h1 className='pt-20 text-black text-lg font-medium leading-tight pl-4'>Please complete the form below to add your event. Once submitted, event details cannot be modified. For any changes or inquiries, please contact our team.</h1>
            <div className='flex md:flex-row flex-col h-4/5 gap-20 justify-between pt-20 pl-32'>
                <div className='flex flex-col flex-grow p-3 overflow-scroll shadow-2xl rounded-xl'>
                    <h1 className='text-black text-2xl font-medium leading-tight flex justify-start'>Fill the form </h1>
                    <EventForm />
                </div>
                {/* <div className='flex flex-col flex-grow overflow-scroll '>
                    <h1 className='text-black text-2xl font-medium leading-tight flex justify-start'>Recently added events</h1>
                    {proposal.slice().reverse().map((event: {
                        convenorName: string;
                        eventTitle: string;
                        type: string;
                        imageBase64: string;
                        eventName: string;
                        date: string; id: string
                    }) => (
                        <div key={event.id} className='mb-4'>
                            <Eventdetails eventTitle= {event.eventTitle} convenorName={event.convenorName}   />
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    );



}