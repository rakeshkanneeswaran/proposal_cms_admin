export const Eventdetails = ({ eventname, eventdata, imageBase64, type }: { eventname: string, eventdata: string, imageBase64: string, type: string }) => {
  return (
    <div className="flex flex-col items-center border border-white border-2 max-w-96 rounded-lg shadow-xl md:flex-row md:max-w-lg bg-black">
      <img className="object-cover rounded-t-lg h-40 w-48 md:rounded-none md:rounded-l-lg" src={imageBase64} alt={eventname} />
      <div className="flex flex-col justify-between p-4 leading-normal bg-black">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{eventname}</h5>
        <p className="mb-3 font-normal text-white">Event on: {eventdata}</p>
        <p className="mb-3 font-normal text-white">Type: {type}</p>
      </div>
    </div>
  );
};
