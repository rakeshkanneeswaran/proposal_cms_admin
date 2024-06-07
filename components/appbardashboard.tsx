
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';

interface Session {
  status: 'authenticated' | 'unauthenticated' | 'loading';
}
export const Appbardashboard = ({ onClick, children }: any) => {

  const router = useRouter();
  const session: Session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/signin");
    } else {
      router.push("/dashboard");
    }
  }, [session.status, router, session, session]);


  return (
    <nav className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 fixed w-full z-20 top-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://www.srmist.edu.in/department/department-of-computing-technologies/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/ctechlogo.jpeg" className="h-8 rounded-sm" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">SRM Event Connect</span>
        </a>
        <span className="self-center text-2xl text-white font-semibold whitespace-nowrap">Efficient. Streamlined. Intuitive.</span>
        <div className="flex-row md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className='pl-3'>
            <button
              type="button"
              className="text-white bg-blue-700 h-14  hover:bg-red-600   border border-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              onClick={onClick}
            >
              Logout
            </button>

            <button
              type="button"
              className="text-white bg-blue-700 h-14  hover:bg-red-600   border border-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              onClick={() => {
                router.push("/excelpage");
              }}
            >
              Upload Excel sheet
            </button>
            <button
              type="button"
              className="text-white bg-blue-700 h-14  hover:bg-red-600   border border-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              onClick={async () => {
                const response = await axios.get('/api/emailerapi')
                console.log(response.data)
              }}
            >
              Send notificatons
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
