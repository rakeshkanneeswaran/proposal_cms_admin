// EventForm.tsx
"use client"
import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import emailsender from "@/emails";
const confirmationSubject = "Confirmation for your proposal submitted at ctech";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { DatePickerWithRange } from "./DateRange";
import { text } from "stream/consumers";
import { AlertTriangle } from "lucide-react";

export default function EventForm() {
  const { data: session, status } = useSession();
  const username = session?.user?.name;
  const router = useRouter();

  // State management as in the initial form
  const [eventTitle, setEventTitle] = useState('');
  const [category, setCategory] = useState('');
  const [fromData, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [convenorName, setConvenorName] = useState('');
  const [convenorDesignation, setConvenorDesignation] = useState('');
  const [mailId, setMailId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [proposedPeriod, setProposedPeriod] = useState('');
  const [duration, setDuration] = useState('');
  const [financialSupportOthers, setFinancialSupportOthers] = useState("");
  const [financialSupportSRMIST, setFinancialSupportSRMIST] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const confirmationBody = `
        This is to confirm that your proposal has been approved with the following details:
        - Event Title: ${eventTitle}
        - Category: ${category}
        - Convenor Name: ${convenorName}
        - Convenor Designation: ${convenorDesignation}
        - Email: ${mailId}
        - Mobile Number: ${mobileNumber}
        - Proposed Period: ${proposedPeriod}
        - Duration: ${duration} days
        - Financial Support (Others): ${financialSupportOthers}
        - Financial Support (SRMIST): ${financialSupportSRMIST}
        - Estimated Budget: ${estimatedBudget}
      `;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (status === "unauthenticated") {
      alert("Please sign in first");
      return;
    }

    try {
      const result = await axios.post('/api/proposal', {
        eventTitle,
        category,
        convenorName,
        convenorDesignation,
        mailId,
        mobileNumber,
        proposedPeriod: `${fromData} - ${toDate}`,
        duration,
        financialSupportOthers,
        financialSupportSRMIST,
        estimatedBudget,
        username
      });

      console.log("status code sent by server is " + result.status);
      if (result.status == 200 && result.data.email == true) {
        alert("Event added successfully and email sent successfully to applicant with email " + mailId)

      }
      else if (result.status == 200 && result.data.email == false) {
        alert("Event added successfully, but email not sent to applicant.")
      }



      // Reset form fields after successful submission
      setEventTitle('');
      setCategory('');
      setConvenorName('');
      setConvenorDesignation('');
      setMailId('');
      setMobileNumber('');
      setProposedPeriod('');
      setDuration('');
      setFinancialSupportOthers('');
      setFinancialSupportSRMIST('');
      setEstimatedBudget('');
    } catch (error: any) {
      console.error("Error creating event:", error.response?.data || error.message);
      alert("Failed to create event. Please try again later.");
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen p-4 ">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl overflow-auto">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>Deploy your new event in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Title */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="event_title">Event Title</Label>
                <Input
                  type="text"
                  id="event_title"
                  placeholder="Name of your Event"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="event_category">Category</Label>
                <Select
                  onValueChange={(value) => setCategory(value)}
                >
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="event">Tech Event</SelectItem>
                    <SelectItem value="ideathon">Ideathon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Convenor Name */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="convenor_name">Convenor Name</Label>
                <Input
                  type="text"
                  id="convenor_name"
                  placeholder="Name of Convenor"
                  value={convenorName}
                  onChange={(e) => setConvenorName(e.target.value)}
                  required
                />
              </div>

              {/* Convenor Designation */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="convenor_designation">Convenor Designation</Label>
                <Input
                  type="text"
                  id="convenor_designation"
                  placeholder="Designation of Convenor"
                  value={convenorDesignation}
                  onChange={(e) => setConvenorDesignation(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="mail_id">Email</Label>
                <Input
                  type="email"
                  id="mail_id"
                  placeholder="Email"
                  value={mailId}
                  onChange={(e) => setMailId(e.target.value)}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input
                  type="tel"
                  id="mobile_number"
                  placeholder="Enter Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>

              {/* Proposed Period */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="mobile_number">From Date</Label>
                <Input
                  type="date"
                  id="Start"
                  placeholder="Start"
                  value={fromData}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="mobile_number">To Date</Label>
                <Input
                  type="date"
                  id="End"
                  placeholder="End"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              {/* Duration */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  type="number"
                  id="duration"
                  placeholder="Enter Number of Days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>

              {/* Financial Support (Others) */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="financial_support_others">Financial Support (Others)</Label>
                <Input
                  type="number"
                  id="financial_support_others"
                  placeholder="Enter other Financial Support"
                  value={financialSupportOthers}
                  onChange={(e) => setFinancialSupportOthers(e.target.value)}
                  required
                />
              </div>

              {/* Financial Support (SRMIST) */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="financial_support_srmist">Financial Support (SRMIST)</Label>
                <Input
                  type="number"
                  id="financial_support_srmist"
                  placeholder="Enter SRMIST Financial Support"
                  value={financialSupportSRMIST}
                  onChange={(e) => setFinancialSupportSRMIST(e.target.value)}
                  required
                />
              </div>

              {/* Estimated Budget */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="estimated_budget">Estimated Budget</Label>
                <Input
                  type="number"
                  id="estimated_budget"
                  placeholder="Enter Estimated Budget"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="mt-4">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}