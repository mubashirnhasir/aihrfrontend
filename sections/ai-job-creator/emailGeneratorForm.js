"use client";
import { useState } from "react";

/**
 * Email Generator Form Component
 * Allows users to input email details for AI-powered formal email generation
 */
export default function EmailGeneratorForm({ onGenerate, isLoading }) {
  const [formData, setFormData] = useState({
    recipient: "",
    recipientRole: "",
    subject: "",
    context: "",
    purpose: "general",
    tone: "professional",
    urgency: "normal",
    includeAttachments: false,
    attachmentDescription: "",
    followUpRequired: false,
    followUpDate: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});

  const purposes = [
    { value: "general", label: "General Communication" },
    { value: "meeting", label: "Meeting Request" },
    { value: "follow-up", label: "Follow-up" },
    { value: "announcement", label: "Announcement" },
    { value: "inquiry", label: "Inquiry/Request" },
    { value: "feedback", label: "Feedback/Review" },
    { value: "collaboration", label: "Collaboration" },
    { value: "update", label: "Status Update" },
    { value: "apology", label: "Apology/Clarification" },
    { value: "invitation", label: "Invitation" },
  ];

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly Professional" },
    { value: "formal", label: "Formal" },
    { value: "urgent", label: "Urgent" },
    { value: "diplomatic", label: "Diplomatic" },
    { value: "casual", label: "Casual Professional" },
  ];

  const urgencyLevels = [
    { value: "low", label: "Low Priority" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recipient.trim()) {
      newErrors.recipient = "Recipient name is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Email subject is required";
    }

    if (!formData.context.trim()) {
      newErrors.context = "Email context is required";
    }

    if (formData.includeAttachments && !formData.attachmentDescription.trim()) {
      newErrors.attachmentDescription = "Please describe the attachments";
    }

    if (formData.followUpRequired && !formData.followUpDate) {
      newErrors.followUpDate = "Please specify follow-up date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerate(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      recipient: "",
      recipientRole: "",
      subject: "",
      context: "",
      purpose: "general",
      tone: "professional",
      urgency: "normal",
      includeAttachments: false,
      attachmentDescription: "",
      followUpRequired: false,
      followUpDate: "",
      additionalNotes: "",
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✉️</span>
          <h3 className="text-lg font-semibold text-gray-900">
            Email Details Form
          </h3>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset & Create New
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Name *
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => handleInputChange("recipient", e.target.value)}
                placeholder="e.g., John Smith"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.recipient ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.recipient && (
                <p className="text-red-500 text-xs mt-1">{errors.recipient}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Role/Title
              </label>
              <input
                type="text"
                value={formData.recipientRole}
                onChange={(e) =>
                  handleInputChange("recipientRole", e.target.value)
                }
                placeholder="e.g., Manager, CEO, Team Lead"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="e.g., Meeting Request for Project Discussion"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>
          </div>
        </div>

        {/* Email Purpose & Tone */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Email Purpose & Tone
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose *
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {purposes.map((purpose) => (
                  <option key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone *
              </label>
              <select
                value={formData.tone}
                onChange={(e) => handleInputChange("tone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {tones.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => handleInputChange("urgency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {urgencyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Email Content
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context & Details *
            </label>
            <textarea
              value={formData.context}
              onChange={(e) => handleInputChange("context", e.target.value)}
              placeholder="Provide the main context, background information, and key points you want to include in the email..."
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                errors.context ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.context && (
              <p className="text-red-500 text-xs mt-1">{errors.context}</p>
            )}
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Additional Options
          </h4>

          {/* Attachments */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeAttachments"
                checked={formData.includeAttachments}
                onChange={(e) =>
                  handleInputChange("includeAttachments", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="includeAttachments"
                className="ml-2 block text-sm text-gray-700"
              >
                Include attachments reference
              </label>
            </div>

            {formData.includeAttachments && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachment Description
                </label>
                <input
                  type="text"
                  value={formData.attachmentDescription}
                  onChange={(e) =>
                    handleInputChange("attachmentDescription", e.target.value)
                  }
                  placeholder="e.g., Project proposal document, Meeting agenda"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.attachmentDescription
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.attachmentDescription && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.attachmentDescription}
                  </p>
                )}
              </div>
            )}

            {/* Follow-up */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="followUpRequired"
                checked={formData.followUpRequired}
                onChange={(e) =>
                  handleInputChange("followUpRequired", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="followUpRequired"
                className="ml-2 block text-sm text-gray-700"
              >
                Mention follow-up timeline
              </label>
            </div>

            {formData.followUpRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date/Timeline
                </label>
                <input
                  type="text"
                  value={formData.followUpDate}
                  onChange={(e) =>
                    handleInputChange("followUpDate", e.target.value)
                  }
                  placeholder="e.g., by end of week, next Monday, in 3 days"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.followUpDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.followUpDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.followUpDate}
                  </p>
                )}
              </div>
            )}

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes or Special Instructions
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                placeholder="Any specific requirements, company policies to mention, or special formatting needs..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Email...
              </div>
            ) : (
              "✨ Generate Professional Email"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
