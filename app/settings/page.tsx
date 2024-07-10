"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Appbarpassword } from '@/components/appbarchangepassword';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

interface Session {
  status: 'authenticated' | 'unauthenticated' | 'loading';
}

const ChangePasswordPage = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const session: Session = useSession();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [session.status, router]);

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

  const handleDeleteProposals = async () => {
    setIsDeleting(true);

    try {
      const response = await axios.delete('/api/deletedata');

      if (response.status === 200) {
        toast.success('All proposals deleted successfully');
      } else {
        toast.error('Failed to delete proposals');
      }
    } catch (error) {
      console.error('Error deleting proposals:', error);
      toast.error('An error occurred while deleting proposals');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteProposals = () => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete all proposals? This action cannot be undone.',
      buttons: [
        {
          label: 'Yes',
          onClick: handleDeleteProposals,
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Appbarpassword />
     <div className='pt-20'>

     </div>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-md p-6 mt-10 mb-6">
        <h1 className="text-3xl font-semibold text-center mb-8">Settings</h1>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </section>
      </div>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-md p-6 mb-6">
        <div className="flex flex-col justify-center items-center mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Danger Zone</h2>
          <h3 className="text-lg font-semibold mb-2">Delete Proposal Data</h3>
          <p className="text-sm text-gray-700 text-center">This action cannot be undone. This will permanently delete all proposal data.</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={confirmDeleteProposals}
            className={`inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              isDeleting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete All Proposals'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
