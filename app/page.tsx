"use client"
import { signIn } from 'next-auth/react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cloudflareStatus, setCloudflareStatus] = useState(false);
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
    if (!cloudflareStatus) {
      alert("You are not a real user. Bot detected or DDOS attack detected.");
      return;
    }

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false, // We handle redirection manually
      });

      if (res?.status === 401) {
        alert("Invalid username or password. Please try again.");
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
    <div className="bg-white h-screen">
      <section className="text-gray-600 bg-white body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-400">
                Department of Computing Technologies
              </span>{' '}
              In-House Proposal Management
            </h1>

            <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
              SRMEventConnect empowers SRM University clubs to showcase hackathons, workshops, tech talks, sports tournaments, and cultural festivals effortlessly.
              <br /><br />
              It centralizes events like tech challenges, guest lectures, and sports competitions for student discovery and engagement.
              <br /><br />
              We prioritize student involvement to enhance the SRM community experience, fostering vibrant campus activities and meaningful connections.
            </p>
          </div>

          <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign in as Club or Organisation</h2>

            <div className="relative mb-4">
              <label htmlFor="username" className="leading-7 text-sm text-gray-600">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
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
              className="text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg"
              onClick={handleLogin}
            >
              Sign In
            </button>

            <div className='pt-3'>
              <Turnstile
                siteKey='0x4AAAAAAAYBk_QWakffj74d'
                onSuccess={async (token) => {
                  try {
                    const result = await axios.post("/api/ddoscloudflare", {
                      cloudflaretoken: token
                    });
                    console.log("Cloudflare token function called");
                    console.log(result);
                    setCloudflareStatus(result.data.status);
                  } catch (error) {
                    console.error("Error fetching Cloudflare status:", error);
                  }
                }}
              />
            </div>

            <p className="text-xs text-gray-500 mt-3">
              If unable to sign in or want to create an account, contact the maintainers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
