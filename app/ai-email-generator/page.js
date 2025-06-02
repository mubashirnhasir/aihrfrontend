"use client";
import { useState } from "react";
import EmailGeneratorForm from "../../sections/ai-job-creator/emailGeneratorForm";
import EmailOutput from "../../sections/ai-job-creator/emailOutput";

/**
 * AI Email Generator Page
 * Professional email creation using AI
 */
export default function EmailGeneratorPage() {
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle email generation
   */
  const handleGenerateEmail = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-job-creator/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
      setIsLoading(false);
    }
  };

  /**
   * Handle email sharing
   */
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
        // For Teams, we'll copy the text and show instructions
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

  /**
   * Handle copy to clipboard
   */
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
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🤖</span>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Email Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Create professional formal emails for any business purpose using AI
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <h4 className="text-red-800 font-medium">
                  Email Generation Error
                </h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div>
            <EmailGeneratorForm
              onGenerate={handleGenerateEmail}
              isLoading={isLoading}
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

        {/* Usage Tips */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <span>💡</span>
            Tips for Better Email Generation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
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
            <div>
              <h4 className="font-medium mb-2">📧 Professional Tips</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Always review and customize generated content</li>
                <li>Add company-specific information as needed</li>
                <li>Check tone matches your relationship with recipient</li>
                <li>Proofread before sending</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔗 Sharing Options</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Direct integration with Outlook and Gmail</li>
                <li>Copy to clipboard for other email clients</li>
                <li>Share via Microsoft Teams</li>
                <li>Raw text mode for easy copying</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
