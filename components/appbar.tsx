import Image from "next/image";


export const Appbar = () => {

  
  
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 fixed w-full z-20 top-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://www.srmist.edu.in/department/department-of-computing-technologies/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/ctechlogo.jpeg" width={80} height={10} className="h-8 rounded-sm" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">SRM Event Connect</span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        </div>
      </div>
    </nav>
  );
};
