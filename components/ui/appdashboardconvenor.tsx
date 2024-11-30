"use client";

interface Session {
  status: "authenticated" | "unauthenticated" | "loading";
}




export const Appbardashboardconvenor = ({ onClick, children }: any) => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 fixed w-full z-20 top-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://www.srmist.edu.in/department/department-of-computing-technologies/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
             <img
            src="/banner.png"
            className="h-8 rounded-sm"
            alt="CTech Logo"
          />
          <img
            src="/ctechlogo.jpeg"
            className="h-8 rounded-sm"
            alt="CTech Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            SRM Event Connect
          </span>
          <span className="self-center text-2xl font-semibold whitespace-nowrap pl-32 text-white">
            Report Generator
          </span>
        </a>
      </div>
    </nav>
  );
};
