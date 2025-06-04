"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EmployeeLeaveRequestForm from "@/sections/employee/leaves/EmployeeLeaveRequestForm";

export default function LeaveRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError("");
      
      const token = localStorage.getItem("employeeToken");
      if (!token) {
        router.push("/employee/auth/signin");
        return;
      }

      const response = await fetch("http://localhost:5000/api/employee/leaves/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });      if (response.ok) {
        setSubmitSuccess(true);
        // Redirect to leaves page after 2 seconds
        setTimeout(() => {
          router.push("/employee/leaves");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit leave request");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error submitting leave request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-900 mb-2">Request Submitted Successfully!</h1>
            <p className="text-green-700 mb-6">
              Your leave request has been submitted and is pending approval. You will be notified once it's reviewed.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-green-600">Redirecting to leave management page...</p>
              <Link
                href="/employee/leaves"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Go to Leave Management
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/employee/leaves"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Leave Management
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Request Leave</h1>
          <p className="text-gray-600 mt-2">
            Submit a new leave request for approval
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Leave Request Form */}
        <EmployeeLeaveRequestForm 
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Leave requests must be submitted at least 3 days in advance for casual leave</p>
            <p>• Sick leave can be applied retrospectively with proper documentation</p>
            <p>• Supporting documents are required for leaves longer than 3 consecutive days</p>
            <p>• Contact HR at hr@company.com for urgent leave requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}
