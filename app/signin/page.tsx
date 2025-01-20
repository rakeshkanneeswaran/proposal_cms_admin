"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { Appbar } from "@/components/appbar";
import { requestCredentials } from "./action";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const [forgotLoading, setForgotLoading] = useState(false);
  const session = useSession();

  const onForgotPassword = async () => {
    setForgotLoading(true); // Disable the button
    try {
      const result = await requestCredentials();
      if (result) {
        toast.success("Credentials sent to your email");
      } else {
        toast.error("Unable to send credentials");
      }
    } catch (error) {
      toast.error("Some server error occurred while sending credentials.");
    } finally {
      setForgotLoading(false); // Re-enable the button
    }
  };

  // Redirect user based on session status
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/signin");
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
    setLoading(true); // Set loading to true
    try {
      console.log("login function ran");
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false, // Set redirect to false
        callbackUrl: "/dashboard",
      });

      if (res?.status === 401) {
        toast.error(
          "Incorrect username or password. Please verify your credentials."
        );
      } else if (res?.ok) {
        console.log(res);
        router.push("/dashboard"); // Manually redirect if sign-in was successful
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div
      className="h-screen"
      style={{
        backgroundImage: `url(/tech_park.jpeg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pb-32">
        <Appbar></Appbar>
      </div>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight bg-gray-100 p-4 rounded-lg text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-400">
                Department of Computing Technologies
              </span>{" "}
              <span> In-House Proposal Management</span>
              <p className="text-xl font-normal pt-3">
                A powerful tool for proposal management created by the
                Department of Computing Technologies (CTech). This Event Connect
                platform simplifies and enhances the proposal management process
                which streamlines proposal creation, submission, and review.
              </p>
            </h1>
          </div>

          <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
              Sign in as Computing Technologies Administrator
            </h2>

            <div className="relative mb-4">
              <label
                htmlFor="username"
                className="leading-7 text-sm text-gray-600"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="w-full rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div className="relative mb-4">
              <label
                htmlFor="password"
                className="leading-7 text-sm text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <button
              onClick={onForgotPassword}
              className={`transition-all w-full px-5 py-2 text-lg text-black  rounded-lg hover:bg-indigo-600 focus:outline-none ${
                forgotLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={forgotLoading}
            >
              {forgotLoading ? "Sending Credentials..." : "Forgot Credentials?"}
            </button>

            <button
              type="button"
              className="bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg"
              onClick={handleLogin}
              disabled={loading} // Disable button when loading
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {loading && (
              <button
                disabled
                type="button"
                className="text-black focus:ring-4 bg-gray-200 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 me-3 text-black animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Validating Username and Password ......
              </button>
            )}

            <p className="text-xs text-gray-500 mt-3">
              If unable to sign in, contact the maintainers.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      {/* Updated Content Section */}
      {/* Updated Content Section */}
      <div className="bg-gray-900 text-white p-6 rounded-lg">
        {/* Horizontal Layout */}
        <div className="flex flex-col gap-6">
          {/* Under the Guidance Of */}
          <div className="text-center mb-6">
            <p className="text-2xl font-bold">Guided By</p>
          </div>

          <div className="flex justify-center gap-10">
            {/* Name 1 */}
            <div className="text-center">
              <p className="font-bold text-xl">Dr. Pushpalatha M</p>
              <p className="text-lg text-gray-300">
                Professor & Associate Chairperson
              </p>
              <p className="text-lg text-gray-300">School of Computing</p>
            </div>

            {/* Name 2 */}
            <div className="text-center">
              <p className="font-bold text-xl">Dr. Niranjana G</p>
              <p className="text-lg text-gray-300">
                Professor and Head of the Department
              </p>
              <p className="text-lg text-gray-300">
                Department of Computing Technologies
              </p>
            </div>
          </div>

          {/* Supported By */}
          <div className="text-center mt-8 mb-4">
            <p className="text-2xl font-bold">Supported By</p>
          </div>

          <div className="flex justify-center gap-10">
            {/* Name 3 */}
            <div className="text-center">
              <p className="font-bold text-lg">Dr. Thamizhamuthu</p>
              <p className="text-md text-gray-300">Assistant Professor</p>
            </div>

            {/* Name 4 */}
            <div className="text-center">
              <p className="font-bold text-lg">Dr. N.A.S Vinoth</p>
              <p className="text-md text-gray-300">Assistant Professor</p>
            </div>

            {/* Name 5 */}
            <div className="text-center">
              <p className="font-bold text-lg">Dr. G. Usha</p>
              <p className="text-md text-gray-300">Professor</p>
            </div>

            {/* Name 6 */}
            <div className="text-center">
              <p className="font-bold text-lg">Dr. A. Anbasari</p>
              <p className="text-md text-gray-300">Assistant Professor</p>
            </div>
          </div>

          {/* Guided By */}
          <div className="text-center mt-8 mb-4">
            <p className="text-2xl font-bold">Developed By</p>
          </div>

          <div className="flex justify-center gap-10">
            {/* Developer 1 */}
            <div className="text-center">
              <p className="font-bold text-lg">Rakesh Maravar</p>
              <p className="text-md text-gray-300">(RA2211003010573)</p>
            </div>

            {/* Developer 2 */}
            <div className="text-center">
              <p className="font-bold text-lg">Krish Makkijani</p>
              <p className="text-md text-gray-300">(RA2211003010573)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
