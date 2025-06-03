import { Briefcase, Clock, Hash, Mail } from "lucide-react";

const EmployeeCard = ({ employee }) => {
  const {
    name,
    designation,
    _id,
    department,
    status,
    email,
    joiningDate,
    profilePicture,
  } = employee;

  const empId = _id?.slice(-6).toUpperCase(); // e.g., last 6 chars
  const type = status?.charAt(0).toUpperCase() + status?.slice(1); // Capitalize "active" → "Active"
  const joined = joiningDate
    ? new Date(joiningDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const image = profilePicture
    ? `http://localhost:5000/${profilePicture}`
    : "/images/avatar.jpg";

  return (
    <div className="border border-gray-200 rounded-xl p-4 shadow-sm w-[280px] flex flex-col gap-2 bg-white">
      <div className="text-green-600 font-medium text-sm flex items-center gap-4">
        <div className="h-[10px] rounded-full w-[10px] bg-green-500" />
        IN
      </div>

      <div className="flex flex-col items-center gap-1">
        <img
          src={image}
          alt={name}
          className="h-16 w-16 rounded-lg object-cover shadow-lg"
        />
        <div className="text-lg font-semibold">{name}</div>
        <div className="text-sm text-gray-500">{designation}</div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg flex flex-col gap-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-gray-400" />
          <span>{empId}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-gray-400" />
          <span>{department}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{type}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="bg-gray-100 px-2 py-1 rounded-full">{email}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
        <span>Joined at {joined}</span>
        <button className="text-blue-600 font-medium hover:underline">
          View Details
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
