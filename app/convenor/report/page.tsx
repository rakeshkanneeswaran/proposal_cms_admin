"use client";
import { useState, ChangeEvent } from "react";
import useGeneratePDF from "../report/useGeneratePDF";
import { Appbardashboardconvenor } from "@/components/ui/appdashboardconvenor";
export default function ReportPage() {
  const generatePDF = useGeneratePDF();
  const [formData, setFormData] = useState({
    eventName: "",
    convenorName: "",
    convenorDepartment: "",
    associateConvenorName: "",
    associateConvenorDepartment: "",
    organizingTeamName: "",
    organizingTeamDepartment: "",
    conductingDepartment: "",
    date: "",
    duration: "",
    typeOfEvent: "",
    modeOfConduct: "",
    registeredTeams: "",
    participatedTeams: "",
    internalParticipation: "",
    externalParticipation: "",
    targetedAudience: "",
    technicalSessions: "",
    chiefGuestName: "",
    chiefGuestAlumni: "",
    chiefGuestDesignation: "",
    chiefGuestOnlineProfileLink: "",
    financeSupportOther: "",
    financeSupportSRMIST: "",
    estimatedBudget: "",
  });

  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDescription = () => setDescriptions([...descriptions, ""]);
  const handleDescriptionChange = (index: number, value: string) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = value;
    setDescriptions(updatedDescriptions);
  };
  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages([...images, ...Array.from(e.target.files)]);
  };
  const handleGeneratePDF = () => generatePDF(formData, descriptions, images);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-300 min-h-screen">
      <Appbardashboardconvenor></Appbardashboardconvenor>
      <div className="flex md:flex-row flex-col justify-between px-5 py-36">
        <div className="w-full md:w-1/2 flex justify-center items-start">
          <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md border-blue-500 border-4">
            <h2 className="text-2xl font-bold mb-4">Event Report Form</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input fields */}
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Event Name</label>
                  <input
                    type="text"
                    name="eventName"
                    className="border p-2 rounded"
                    value={formData.eventName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Event Convener Name</label>
                  <input
                    type="text"
                    name="convenorName"
                    className="border p-2 rounded"
                    value={formData.convenorName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Event Convener Department
                  </label>
                  <input
                    type="text"
                    name="convenorDepartment"
                    className="border p-2 rounded"
                    value={formData.convenorDepartment}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Association Convener Name
                  </label>
                  <input
                    type="text"
                    name="associateConvenorName"
                    className="border p-2 rounded"
                    value={formData.associateConvenorName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Association Convener Department
                  </label>
                  <input
                    type="text"
                    name="associateConvenorDepartment"
                    className="border p-2 rounded"
                    value={formData.associateConvenorDepartment}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Organizing Team Name</label>
                  <input
                    type="text"
                    name="organizingTeamName"
                    className="border p-2 rounded"
                    value={formData.organizingTeamName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Organizing Team Department
                  </label>
                  <input
                    type="text"
                    name="organizingTeamDepartment"
                    className="border p-2 rounded"
                    value={formData.organizingTeamDepartment}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Conducting Department</label>
                  <input
                    type="text"
                    name="conductingDepartment"
                    className="border p-2 rounded"
                    value={formData.conductingDepartment}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="border p-2 rounded"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    className="border p-2 rounded"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Type of Event</label>
                  <input
                    type="text"
                    name="typeOfEvent"
                    className="border p-2 rounded"
                    value={formData.typeOfEvent}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Mode of Conduct</label>
                  <input
                    type="text"
                    name="modeOfConduct"
                    className="border p-2 rounded"
                    value={formData.modeOfConduct}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Number of Registered Teams
                  </label>
                  <input
                    type="number"
                    name="registeredTeams"
                    className="border p-2 rounded"
                    value={formData.registeredTeams}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Number of Registered Participants
                  </label>
                  <input
                    type="number"
                    name="participatedTeams"
                    className="border p-2 rounded"
                    value={formData.participatedTeams}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Number of Internal Participants
                  </label>
                  <input
                    type="number"
                    name="internalParticipation"
                    className="border p-2 rounded"
                    value={formData.internalParticipation}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Number of External Participants
                  </label>
                  <input
                    type="number"
                    name="externalParticipation"
                    className="border p-2 rounded"
                    value={formData.externalParticipation}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Targeted Audience</label>
                  <input
                    type="text"
                    name="targetedAudience"
                    className="border p-2 rounded"
                    value={formData.targetedAudience}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Number of Technical Sessions
                  </label>
                  <input
                    type="number"
                    name="technicalSessions"
                    className="border p-2 rounded"
                    value={formData.technicalSessions}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Chief Guest Name</label>
                  <input
                    type="text"
                    name="chiefGuestName"
                    className="border p-2 rounded"
                    value={formData.chiefGuestName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Chief Guest Alumni (Yes/No)
                  </label>
                  <input
                    type="text"
                    name="chiefGuestAlumni"
                    className="border p-2 rounded"
                    value={formData.chiefGuestAlumni}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Chief Guest Designation</label>
                  <input
                    type="text"
                    name="chiefGuestDesignation"
                    className="border p-2 rounded"
                    value={formData.chiefGuestDesignation}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Chief Guest Online Profile Link
                  </label>
                  <input
                    type="text"
                    name="chiefGuestOnlineProfileLink"
                    className="border p-2 rounded"
                    value={formData.chiefGuestOnlineProfileLink}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Financial Support (Other)
                  </label>
                  <input
                    type="text"
                    name="financeSupportOther"
                    className="border p-2 rounded"
                    value={formData.financeSupportOther}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">
                    Financial Support (SRMIST)
                  </label>
                  <input
                    type="text"
                    name="financeSupportSRMIST"
                    className="border p-2 rounded"
                    value={formData.financeSupportSRMIST}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Estimated Budget</label>
                  <input
                    type="text"
                    name="estimatedBudget"
                    className="border p-2 rounded"
                    value={formData.estimatedBudget}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Event Description</label>
                  {descriptions.map((desc, index) => (
                    <textarea
                      key={index}
                      name={`description-${index}`}
                      className="border p-2 rounded mb-2"
                      value={desc}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                    />
                  ))}
                  <button
                    type="button"
                    className="text-blue-500"
                    onClick={handleAddDescription}
                  >
                    + Add Another Description
                  </button>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="font-medium">Upload Image</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    multiple
                    onChange={handleAddImage}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleGeneratePDF}
                className="bg-blue-500 text-white p-2 rounded mt-4"
              >
                Generate Report
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
