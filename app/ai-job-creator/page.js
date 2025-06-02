/**
 * AI Creator Suite Page
 * Main page for creating professional job descriptions and emails using AI
 */
"use client";

import { useState } from "react";
import JobCreatorForm from "../../sections/ai-job-creator/jobCreatorForm";
import JobDescriptionOutput from "../../sections/ai-job-creator/jobDescriptionOutput";
import SharePanel from "../../sections/ai-job-creator/sharePanel";
import EmailGeneratorForm from "../../sections/ai-job-creator/emailGeneratorForm";
import EmailOutput from "../../sections/ai-job-creator/emailOutput";

export default function AIJobCreatorPage() {
  const [activeTab, setActiveTab] = useState("job-creator");
  const [jobDescription, setJobDescription] = useState(null);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  // Job Description Generation
  const handleGenerateJobDescription = async (data) => {
    setIsGenerating(true);
    setFormData(data);
    setError(null);

    try {
      const response = await fetch("/api/ai-job-creator/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate job description");
      }

      const result = await response.json();
      setJobDescription(result.data);
    } catch (error) {
      console.error("Error generating job description:", error);
      setError("Failed to generate job description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Email Generation
  const handleGenerateEmail = async (emailData) => {
    setIsGeneratingEmail(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-job-creator/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate email");
      }

      setGeneratedEmail(result.data);
    } catch (err) {
      console.error("Email generation error:", err);
      setError(err.message || "An error occurred while generating the email");
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleReset = () => {
    if (activeTab === "job-creator") {
      setJobDescription(null);
      setFormData(null);
    } else {
      setGeneratedEmail(null);
    }
    setError(null);
  };

  // Email sharing functionality
  const handleShareEmail = (platform) => {
    if (!generatedEmail) return;

    const emailText = generatedEmail.rawText;
    const subject = generatedEmail.subject;
    const recipient = generatedEmail.recipient;

    switch (platform) {
      case "outlook":
        const outlookUrl = `mailto:${recipient}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(emailText)}`;
        window.open(outlookUrl, "_blank");
        break;

      case "gmail":
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(emailText)}`;
        window.open(gmailUrl, "_blank");
        break;

      case "teams":
        navigator.clipboard.writeText(emailText);
        alert(
          "Email copied to clipboard! You can paste it in Microsoft Teams."
        );
        break;

      case "copy":
        navigator.clipboard.writeText(emailText);
        alert("Email copied to clipboard!");
        break;

      default:
        console.log("Unknown platform:", platform);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedEmail) {
      navigator.clipboard.writeText(generatedEmail.rawText);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 AI Creator Suite
          </h1>
          <p className="text-gray-600">
            Create professional job descriptions and formal emails using AI
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("job-creator")}
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "job-creator"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  📄 Job Description Generator
                </span>
              </button>
              <button
                onClick={() => setActiveTab("email-generator")}
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "email-generator"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  ✉️ Email Generator
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <h4 className="text-red-800 font-medium">Generation Error</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "job-creator" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <JobCreatorForm
                onGenerate={handleGenerateJobDescription}
                isGenerating={isGenerating}
                onReset={handleReset}
                hasJobDescription={!!jobDescription}
              />
            </div>

            {/* Right Column - Output and Share */}
            <div className="space-y-6">
              {jobDescription ? (
                <>
                  <JobDescriptionOutput
                    jobDescription={jobDescription}
                    formData={formData}
                  />
                  <SharePanel
                    jobDescription={jobDescription}
                    formData={formData}
                  />
                </>
              ) : (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Job Description Preview
                  </h3>
                  <p className="text-gray-500">
                    Fill out the form to generate a professional job description
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Email Generator Tab */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Form */}
            <div>
              <EmailGeneratorForm
                onGenerate={handleGenerateEmail}
                isLoading={isGeneratingEmail}
              />
            </div>

            {/* Right Side - Output */}
            <div>
              <EmailOutput
                emailData={generatedEmail}
                onCopy={handleCopyToClipboard}
                onShare={handleShareEmail}
              />
            </div>
          </div>
        )}

        {/* Usage Tips */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <span>💡</span>
            {activeTab === "job-creator"
              ? "Job Description Tips"
              : "Email Writing Tips"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            {activeTab === "job-creator" ? (
              <>
                <div>
                  <h4 className="font-medium mb-2">📝 Content Quality</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Be specific about role requirements</li>
                    <li>Include relevant skills and technologies</li>
                    <li>Mention company culture and benefits</li>
                    <li>Specify experience level clearly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🎯 Platform Optimization</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Different platforms have different audiences</li>
                    <li>LinkedIn allows for more professional tone</li>
                    <li>Twitter requires concise, engaging content</li>
                    <li>Company website can be more detailed</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4 className="font-medium mb-2">📝 Writing Context</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Be specific about your request or purpose</li>
                    <li>Include relevant background information</li>
                    <li>Mention any deadlines or time constraints</li>
                    <li>Specify the desired outcome or action</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🎯 Email Purpose</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Choose the right purpose for better results</li>
                    <li>Select appropriate tone for your audience</li>
                    <li>Consider urgency level carefully</li>
                    <li>Include recipient's role for personalization</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
