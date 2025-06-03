import React, { useState } from "react";
import { X } from "lucide-react";

const AddEmployeeModal = ({ isOpen, setIsOpen, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    role: "",
    status: "Active",
    profilePicture: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setIsOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      joiningDate: "",
      role: "",
      status: "Active",
      profilePicture: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Employee</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            "name",
            "email",
            "phone",
            "department",
            "designation",
            "joiningDate",
            "role",
            "status",
            "profilePicture",
          ].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={field === "joiningDate" ? "date" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field}
                className="border border-gray-200 rounded focus:outline-gray-200 px-3 py-2 mt-1"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
