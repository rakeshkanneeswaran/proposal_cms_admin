'use client'

import EventTable from '@/components/Table'
import { ModeToggle } from '@/components/ModeToggle'
import EventForm from '@/components/eventform'


export default function Dashboard() {
  return (
    <div>
      <div className="absolute top-0 right-0 p-4 md:p-6 lg:p-8 ">
        <ModeToggle />
      </div>
      <div className="flex justify-center w-full p-4 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 dark:from-neutral-200 dark:to-neutral-600 md:mt-0">
          Dashboard
        </h1>
      </div>

      <div className="flex m-5 p-5">
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
  )
}
