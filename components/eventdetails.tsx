export const Eventdetails = ({eventTitle , convenorName, duration }: { eventTitle: string, convenorName: string, duration: string, }) => {
  return (
    <div className="flex flex-col items-center  border-white border-2 max-w-96 rounded-lg shadow-xl md:flex-row md:max-w-lg bg-black">
      <div className="flex flex-col justify-between p-4 leading-normal bg-black">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{eventTitle}</h5>
        <p className="mb-3 font-normal text-white">Event on: {convenorName}</p>
        <p className="mb-3 font-normal text-white">Type: {duration}</p>
      </div>
    </div>
  );
};
