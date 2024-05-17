'use client'
//dashboard
import EventTable from '@/components/Table'
import EventForm from '@/components/eventform'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'
import { Appbardashboard } from '@/components/appbardashboard';
import { signOut} from 'next-auth/react';
interface Session {
  status: 'authenticated' | 'unauthenticated' | 'loading';
}

export default function Dashboard() {
  const router = useRouter();
  const session: Session = useSession();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/signin");
    } else {
      router.push("/dashboard");
    }
  }, [session.status, router,session , session]);
  

  return (
    <div>
      <div className='pb-40'>
        <Appbardashboard onClick={async ()=>{
          await signOut()
          router.push("/signin")
        }}/>
      </div>
      <div className="flex justify-center w-full p-4 md:p-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-emerald-600 to-sky-400 md:mt-0">
          Dashboard
        </h1>
      </div>

      <div className='m-0'>
      <div className="flex m-3 p-3">
        <div className="flex flex-col md:flex-row w-full h-screen">
          {/* Left Section */}
          <div className="flex-1 p-4 md:w-1/3 lg:w-1/4 flex flex-col justify-center">
            <EventForm />
          </div>

          {/* Right Section */}
          <div className="flex-1 p-4 md:w-2/3 lg:w-3/4 flex flex-col justify-center">
            <EventTable />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}