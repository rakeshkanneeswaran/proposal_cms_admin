// components/EventForm.js

import { useState } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react';


const EventForm = () => {
  const [eventName, setEventName] = useState('');
  const [base64Image, setBase64Image] = useState<any>('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [venue, setVenue] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [duration, setDuration] = useState('');
  const [modeOfConduct, setModeOfConduct] = useState('');

  const eventTypeOptions = [
    'Hackathon',
    'Ideathon',
    'Hackathon Cum Ideathon',
    "coding/competitive programming competition",
    'Seminar',
    'Workshop',
    'Cultural Event',
    'Mode United Nations',
    'Dance competition',
    'Singing Competition',
    'Debate',
    'Gaminig contest / competition'
  ]

  const modeOfConductOptions = ['Online', 'Offline', 'Online and Offline'];



  const { data: session, status } = useSession();
  const username = session?.user?.name;


  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result; // Base64 string of the image
      setBase64Image(base64String);
    };

    if (file) {
      reader.readAsDataURL(file); // Read file as base64
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (status === "unauthenticated") {
      alert("Please sign in first");
      return;
    }

    try {
      const result = await axios.post('/api/events', {
        eventName: eventName,
        base64Image: base64Image,
        eventDate: eventDate,
        eventType: eventType,
        venue: venue,
        registrationLink: registrationLink,
        duration: duration,
        modeOfConduct: modeOfConduct,
        username: username
      });

      console.log("Event created successfully:", result.data);
      alert("Event submitted successfully!");

      // Reset form fields after successful submission
      setEventName('');
      setBase64Image('');
      setEventDate('');
      setEventType('');
      setVenue('');
      setRegistrationLink('');
      setDuration('');
      setModeOfConduct('');

    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again later.");
    }
  };

  return (
    <form className="h-screen  bg-white" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="event_name" className="block mb-2 text-sm font-medium text-gray-900">
          Event name
        </label>
        <input
          type="text"
          id="event_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Event Name .This will be displayed in the the website"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="image_name" className="block mb-2 text-sm font-medium text-gray-900">
          Select poster
        </label>
        <input
          type="file"
          id="image_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={handleImageUpload}
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900">
          Event date
        </label>
        <input
          type="date"
          id="date"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">
          Type
        </label>
        <select
          id="type"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Event Type
          </option>
          {eventTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">
          Venue
        </label>
        <input
          type="text"
          id="type"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="eg: TP-403,BEL,T.P.Ganesan"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">
          Registration Link
        </label>
        <input
          type="text"
          id="type"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="www.googleform.com"
          value={registrationLink}
          onChange={(e) => setRegistrationLink(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">
          Duration
        </label>
        <input
          type="text"
          id="type"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="24 hours , 48 hours , 72 hours"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="mode_of_conduct" className="block mb-2 text-sm font-medium text-gray-900">
          Mode of Conduct
        </label>
        <select
          id="mode_of_conduct"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={modeOfConduct}
          onChange={(e) => setModeOfConduct(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Mode of Conduct
          </option>
          {modeOfConductOptions.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>

      {/* Other input fields for event details */}
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Submit
      </button>
    </form>
  );
};

export default EventForm;
