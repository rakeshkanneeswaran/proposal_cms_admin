"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Appbar } from '@/components/appbar';


export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const session = useSession();


  // Redirect user based on session status

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    } else if (session.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [router, session]);

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {

    try {
      console.log("login function ran")
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (res?.status === 401) {
        alert("Incorrect username or password. Please verify your credentials.");
      } else {
        console.log(res);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again later.");
    }
  };

  return (
    <div className=" h-screen">
      <div className='pb-32'>
        <Appbar></Appbar>
      </div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-400">
                Department of Computing Technologies
              </span>{' '}
              <span > In-House Proposal Management</span>
              <h1 className='text-sm font-normal pt-3 '>Discover a powerful tool for proposal management created by the Department of Computing Technologies (CTech) in collaboration with talented students from the School of Computing at SRM University. This innovative platform, known as SRM Event Connect, simplifies and enhances the proposal management process with its intuitive design and advanced features. Ideal for organizing events, projects, and initiatives, SRM Event Connect streamlines proposal creation, submission, and review.</h1>

            </h1>


          </div>

          <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign as Computing technologies Adimistrator</h2>

            <div className="relative mb-4">
              <label htmlFor="username" className="leading-7 text-sm text-gray-600">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="w-full  rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div className="relative mb-4">
              <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <button
              type='button'
              className=" bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg"
              onClick={handleLogin}
            >
              Sign In
            </button>



            <p className="text-xs text-gray-500 mt-3">
              If unable to sign in , contact the maintainers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
