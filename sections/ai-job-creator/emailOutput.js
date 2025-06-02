"use client";
import { useState } from "react";

/**
 * Email Output Component
 * Displays the generated email with formatting options and sharing capabilities
 */
export default function EmailOutput({ emailData, onCopy, onShare }) {
  const [viewMode, setViewMode] = useState("formatted");
  const [copyStatus, setCopyStatus] = useState("");

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailData?.rawText || "");
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
      if (onCopy) onCopy();
    } catch (err) {
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  if (!emailData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📧</span>
          <h3 className="text-lg font-semibold text-gray-900">
            Generated Email
          </h3>
        </div>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">✉️</div>
          <p className="text-lg mb-2">No email generated yet</p>
          <p className="text-sm">
            Fill out the form and click "Generate Professional Email" to create
            your email
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📧</span>
          <h3 className="text-lg font-semibold text-gray-900">
            Generated Email
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-sm">📋</span>
            {copyStatus || "Copy Full Text"}
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setViewMode("formatted")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            viewMode === "formatted"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📊 Structured View
        </button>
        <button
          onClick={() => setViewMode("raw")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            viewMode === "raw"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📝 Raw Text
        </button>
      </div>

      {/* Email Content */}
      <div className="space-y-6">
        {viewMode === "formatted" ? (
          <div className="space-y-6">
            {/* Email Header Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    📧 Subject:
                  </span>
                  <span className="text-sm text-gray-900 font-medium">
                    {emailData.subject}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    👤 To:
                  </span>
                  <span className="text-sm text-gray-900">
                    {emailData.recipient}
                  </span>
                </div>
                {emailData.urgency && emailData.urgency !== "normal" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      ⚡ Priority:
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        emailData.urgency === "urgent"
                          ? "bg-red-100 text-red-700"
                          : emailData.urgency === "high"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {emailData.urgency.charAt(0).toUpperCase() +
                        emailData.urgency.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Email Body Sections */}
            {emailData.sections && emailData.sections.length > 0 ? (
              <div className="space-y-6">
                {emailData.sections.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{section.icon}</span>
                      <h4 className="font-medium text-gray-800">
                        {section.title}
                      </h4>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <div
                        className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: section.content.replace(/\n/g, "<br>"),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback if no sections */
              <div className="border rounded-lg p-6">
                <div className="prose prose-sm max-w-none">
                  <div
                    className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: emailData.content?.replace(/\n/g, "<br>"),
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email Metadata */}
            {(emailData.tone || emailData.purpose || emailData.attachments) && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">
                  📋 Email Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {emailData.purpose && (
                    <div>
                      <span className="font-medium text-gray-600">
                        Purpose:
                      </span>
                      <span className="ml-2 text-gray-900 capitalize">
                        {emailData.purpose}
                      </span>
                    </div>
                  )}
                  {emailData.tone && (
                    <div>
                      <span className="font-medium text-gray-600">Tone:</span>
                      <span className="ml-2 text-gray-900 capitalize">
                        {emailData.tone}
                      </span>
                    </div>
                  )}
                  {emailData.attachments && (
                    <div>
                      <span className="font-medium text-gray-600">
                        Attachments:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {emailData.attachments}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Raw Text View */
          <div className="bg-gray-50 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
              {emailData.rawText}
            </pre>
          </div>
        )}
      </div>

      {/* Share Panel */}
      {onShare && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800">Share Email</h4>
            <div className="flex gap-2">
              <button
                onClick={() => onShare("outlook")}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                📧 Outlook
              </button>
              <button
                onClick={() => onShare("gmail")}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                ✉️ Gmail
              </button>
              <button
                onClick={() => onShare("teams")}
                className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                💬 Teams
              </button>
              <button
                onClick={() => onShare("copy")}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
