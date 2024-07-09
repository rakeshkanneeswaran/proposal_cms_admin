"use client"

import { useState , useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Appbarpassword } from '@/components/appbarchangepassword';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
interface Session {
  status: 'authenticated' | 'unauthenticated' | 'loading';
}

const ChangePasswordPage = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const session: Session = useSession();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/signin');
    } else {
      router.push('/changepassword');
    }
  })

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/changepassword', {
        username: 'ctech', 
        password: newPassword,
      });

      console.log(response)
      console.log(newPassword)

      // Handle response
      if (response.status === 200) {
        toast.success('Password changed successfully');
        router.push('/dashboard'); 
      } else {
        toast.error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('An error occurred while changing password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Appbarpassword></Appbarpassword>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Change Password</h1>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
