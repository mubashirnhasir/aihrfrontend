"use client";
import { useState } from "react";

const EmployeeLeaveRequestForm = ({
  onSubmit,
  isSubmitting = false,
  className = "",
}) => {  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    isHalfDay: false,
    halfDayType: "morning", // morning or afternoon
    reason: "",
    emergencyContact: "",
    attachments: null,
  });

  const [errors, setErrors] = useState({});

  const leaveTypes = [
    { value: "casual", label: "Casual Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "earned", label: "Earned Leave" },
    { value: "unpaid", label: "Unpaid Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "paternity", label: "Paternity Leave" },
  ];  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, attachments: file }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.leaveType) {
      newErrors.leaveType = "Leave type is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    if (formData.reason.trim().length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const submissionData = {
      type: formData.leaveType, // Map leaveType to type for backend
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      halfDay: formData.isHalfDay,
      halfDayType: formData.halfDayType,
      emergencyContact: formData.emergencyContact,
      duration: calculateLeaveDuration(),
    };

    if (onSubmit) {
      onSubmit(submissionData);
    }
  };

  const calculateLeaveDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    return formData.isHalfDay ? 0.5 : daysDiff;
  };

  const handleReset = () => {
    setFormData({
      leaveType: "",
      startDate: "",
      endDate: "",
      isHalfDay: false,
      halfDayType: "morning",
      reason: "",
      emergencyContact: "",
      attachments: null,
    });
    setErrors({});
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Leave Request Form
        </h3>        <p className="text-sm text-gray-600">
          Fill out the form below to submit your leave request
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Leave Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leave Type *
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.leaveType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.leaveType && (
            <p className="mt-1 text-sm text-red-600">{errors.leaveType}</p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate || new Date().toISOString().split("T")[0]}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Half Day Option */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isHalfDay"
              checked={formData.isHalfDay}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Half Day Leave
            </label>
          </div>

          {formData.isHalfDay && (
            <div className="ml-6">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="halfDayType"
                    value="morning"
                    checked={formData.halfDayType === "morning"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Morning</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="halfDayType"
                    value="afternoon"
                    checked={formData.halfDayType === "afternoon"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Afternoon</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Duration Display */}
        {formData.startDate && formData.endDate && (
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Duration:</span>{" "}
              {calculateLeaveDuration()} day(s)
            </p>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason *
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows={4}
            placeholder="Please provide a detailed reason for your leave request..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.reason ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.reason && (
            <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.reason.length}/500 characters
          </p>
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact (Optional)
          </label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            placeholder="Name and phone number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* File Attachment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supporting Documents (Optional)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 font-medium"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeLeaveRequestForm;
