"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Session {
  status: 'authenticated' | 'unauthenticated' | 'loading';
}

export const Appbardashboard = ({ onClick, children }: any) => {
  const router = useRouter();
  const session: Session = useSession();
  const [isSendingAlerts, setIsSendingAlerts] = useState(false);

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/signin');
    } else {
      router.push('/dashboard');
    }
  }, [session.status, router, session]);

  const handleSendAlerts = async () => {
    setIsSendingAlerts(true);
    toast.info("Please wait while sending Alerts. Process will take some time");
    try {
      const response = await axios.get('/api/emailerapi');
      console.log(response.data);
      if (response.status == 200) {
        toast.success("Alert email sent successfully");
      } else if (response.status == 500) {
        toast.error("Alert email failed to send");
      }
    } catch (error) {
      toast.error("An error occurred while sending alerts");
    } finally {
      setIsSendingAlerts(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 fixed w-full z-20 top-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://www.srmist.edu.in/department/department-of-computing-technologies/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/ctechlogo.jpeg" className="h-8 rounded-sm" alt="CTech Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">SRM Event Connect</span>
        </a>
        <span className="self-center text-2xl text-white font-semibold whitespace-nowrap">Efficient. Streamlined. Intuitive.</span>
        <div className="flex space-x-4">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={() => {
              router.push('/excelpage');
            }}
          >
            Upload Excel Sheet
          </button>
          <button
            type="button"
            className={`text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${isSendingAlerts ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSendAlerts}
            disabled={isSendingAlerts}
          >
            {isSendingAlerts ? 'Processing...' : 'Send Alerts'}
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={() => {
              router.push('/calander');
            }}
          >
            Calendar
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={() => {
              signOut({ callbackUrl: "/signin" });
            }}
          >
            Logout
          </button>
          
        </div>
      </div>
    </nav>
  );
};
