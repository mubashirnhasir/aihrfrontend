import { X } from "lucide-react";
import { useState } from "react";

const AddAssetModal = ({ isOpen, setIsOpen, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    assetId: "",
    category: "",
    assignedTo: "",
    createdAt: "",
    department: "",
    status: "Available",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    setIsOpen(false);
    setForm({
      name: "",
      assetId: "",
      category: "",
      assignedTo: "",
      createdAt: "",
      department: "",
      status: "Available",
      image: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg border-gray-200 border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Asset</h2>
          <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            "name",
            "assetId",
            "category",
            "assignedTo",
            "createdAt",
            "department",
            "status",
            "image",
          ].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={field === "createdAt" ? "date" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="border border-gray-200 rounded px-3 py-2 mt-1"
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

export default AddAssetModal;
