"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLoader from '@/components/PageLoader'
import { pageLoadingMessages } from '@/hooks/usePageLoading'

export default function EmployeeProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("employeeToken");

      if (!token) {
        router.push("/employee/auth/signin");
        return;
      }

      const response = await fetch("/api/employee/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("employeeToken");
        router.push("/employee/auth/signin");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (section, sectionData) => {
    try {
      setIsSaving(true);
      setError(null);
      setValidationErrors({});

      const token = localStorage.getItem("employeeToken");

      if (!token) {
        router.push("/employee/auth/signin");
        return;
      }

      const updateData = {
        [section]: sectionData,
      };

      const response = await fetch("/api/employee/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.status === 401) {
        localStorage.removeItem("employeeToken");
        router.push("/employee/auth/signin");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedData = await response.json();
      setProfileData((prev) => ({
        ...prev,
        [section]: sectionData,
      }));

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const validateField = (field, value, rules = {}) => {
    const errors = [];

    if (rules.required && (!value || value.trim() === "")) {
      errors.push(`${field} is required`);
    }

    if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
      errors.push(`${field} must be a valid email`);
    }

    if (rules.phone && value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
      errors.push(`${field} must be a valid phone number`);
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`);
    }

    return errors;
  };
  const tabs = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "contact", label: "Contact Details", icon: "📞" },
    { id: "address", label: "Address", icon: "🏠" },
    { id: "employment", label: "Previous Employment", icon: "💼" },
    { id: "bank", label: "Bank Details", icon: "🏦" },
    { id: "family", label: "Family Details", icon: "👨‍👩‍👧‍👦" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "emergency", label: "Emergency Contact", icon: "🆘" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
  ];
  if (isLoading) {
    return (
      <PageLoader 
        message={pageLoadingMessages.employeeProfile.message}
        subMessage={pageLoadingMessages.employeeProfile.subMessage}
      />
    );
  }

  if (error && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProfileData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {" "}
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✅ {successMessage}
          </div>
        )}
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            ⚠️ {error}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "personal" && (
              <PersonalInfoTab
                data={profileData?.personalInfo || {}}
                onUpdate={(data) => updateProfile("personalInfo", data)}
                isSaving={isSaving}
                validationErrors={validationErrors}
                validateField={validateField}
              />
            )}
            {activeTab === "contact" && (
              <ContactDetailsTab
                data={profileData?.contactInfo || {}}
                onUpdate={(data) => updateProfile("contactInfo", data)}
                isSaving={isSaving}
                validationErrors={validationErrors}
                validateField={validateField}
              />
            )}

            {activeTab === "address" && (
              <AddressTab
                data={profileData?.address || {}}
                onUpdate={(data) => updateProfile("address", data)}
                isSaving={isSaving}
                validationErrors={validationErrors}
                validateField={validateField}
              />
            )}

            {activeTab === "employment" && (
              <PreviousEmploymentTab
                data={profileData?.previousEmployment || []}
                onUpdate={(data) => updateProfile("previousEmployment", data)}
                isSaving={isSaving}
                validationErrors={validationErrors}
                validateField={validateField}
              />
            )}

            {activeTab === "bank" && (
              <BankDetailsTab
                data={profileData?.bankDetails || {}}
                onUpdate={(data) => updateProfile("bankDetails", data)}
                isSaving={isSaving}
                validationErrors={validationErrors}
                validateField={validateField}
              />
            )}

            {activeTab === "family" && (
              <FamilyDetailsTab
                data={profileData?.familyDetails || []}
                onUpdate={(data) => updateProfile("familyDetails", data)}
                isSaving={isSaving}
                validationErrors={validationErrors}
                validateField={validateField}
              />
            )}

            {activeTab === "documents" && (
              <DocumentsTab
                data={profileData?.documents || {}}
                onUpdate={(data) => updateProfile("documents", data)}
                isSaving={isSaving}
                validationErrors={validationErrors}
                validateField={validateField}
              />
            )}

            {activeTab === "emergency" && (
              <EmergencyContactTab
                data={profileData?.emergencyContact || {}}
                onUpdate={(data) => updateProfile("emergencyContact", data)}
                isSaving={isSaving}
                validationErrors={validationErrors}
                validateField={validateField}
              />
            )}

            {activeTab === "bank" && (
              <BankDetailsTab
                data={profileData?.bankDetails || {}}
                onUpdate={(data) => updateProfile("bankDetails", data)}
                isSaving={isSaving}
                validationErrors={validationErrors}
                validateField={validateField}
              />
            )}

            {activeTab === "preferences" && (
              <PreferencesTab
                data={profileData?.preferences || {}}
                onUpdate={(data) => updateProfile("preferences", data)}
                isSaving={isSaving}
                validationErrors={validationErrors}
                validateField={validateField}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Personal Information Tab Component
function PersonalInfoTab({
  data,
  onUpdate,
  isSaving,
  validationErrors,
  validateField,
}) {
  const [formData, setFormData] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    empId: data.empId || "",
    department: data.department || "",
    designation: data.designation || "",
    dateOfJoining: data.dateOfJoining || "",
    location: data.location || "",
    email: data.email || "",
    phone: data.phone || "",
    dateOfBirth: data.dateOfBirth || "",
    gender: data.gender || "",
    nationality: data.nationality || "",
    maritalStatus: data.maritalStatus || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      empId: data.empId || "",
      department: data.department || "",
      designation: data.designation || "",
      dateOfJoining: data.dateOfJoining || "",
      location: data.location || "",
      email: data.email || "",
      phone: data.phone || "",
      dateOfBirth: data.dateOfBirth || "",
      gender: data.gender || "",
      nationality: data.nationality || "",
      maritalStatus: data.maritalStatus || "",
    });
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate required fields
    const firstNameErrors = validateField("First Name", formData.firstName, {
      required: true,
      minLength: 2,
    });
    const lastNameErrors = validateField("Last Name", formData.lastName, {
      required: true,
      minLength: 2,
    });
    const emailErrors = validateField("Email", formData.email, {
      required: true,
      email: true,
    });
    const phoneErrors = validateField("Phone", formData.phone, {
      required: true,
      phone: true,
    });

    if (firstNameErrors.length > 0) newErrors.firstName = firstNameErrors;
    if (lastNameErrors.length > 0) newErrors.lastName = lastNameErrors;
    if (emailErrors.length > 0) newErrors.email = emailErrors;
    if (phoneErrors.length > 0) newErrors.phone = phoneErrors;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onUpdate(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              value={formData.empId}
              onChange={(e) => handleChange("empId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Employee ID"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Department"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Designation"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Joining
            </label>
            <input
              type="date"
              value={formData.dateOfJoining}
              onChange={(e) => handleChange("dateOfJoining", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Work location"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => handleChange("nationality", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your nationality"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marital Status
            </label>
            <select
              value={formData.maritalStatus}
              onChange={(e) => handleChange("maritalStatus", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}

// Contact Details Tab Component
function ContactDetailsTab({
  data,
  onUpdate,
  isSaving,
  validationErrors,
  validateField,
}) {
  const [formData, setFormData] = useState({
    email: data.email || "",
    phone: data.phone || "",
    alternativePhone: data.alternativePhone || "",
    workEmail: data.workEmail || "",
    linkedinProfile: data.linkedinProfile || "",
    skypeId: data.skypeId || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      email: data.email || "",
      phone: data.phone || "",
      alternativePhone: data.alternativePhone || "",
      workEmail: data.workEmail || "",
      linkedinProfile: data.linkedinProfile || "",
      skypeId: data.skypeId || "",
    });
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate required fields
    const emailErrors = validateField("Email", formData.email, {
      required: true,
      email: true,
    });
    const phoneErrors = validateField("Phone", formData.phone, {
      required: true,
      phone: true,
    });

    if (emailErrors.length > 0) newErrors.email = emailErrors;
    if (phoneErrors.length > 0) newErrors.phone = phoneErrors;

    // Validate optional email fields
    if (formData.workEmail) {
      const workEmailErrors = validateField("Work Email", formData.workEmail, {
        email: true,
      });
      if (workEmailErrors.length > 0) newErrors.workEmail = workEmailErrors;
    }

    if (formData.alternativePhone) {
      const altPhoneErrors = validateField(
        "Alternative Phone",
        formData.alternativePhone,
        { phone: true }
      );
      if (altPhoneErrors.length > 0)
        newErrors.alternativePhone = altPhoneErrors;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onUpdate(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Email
          </label>
          <input
            type="email"
            value={formData.workEmail}
            onChange={(e) => handleChange("workEmail", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.workEmail ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="work.email@company.com"
          />
          {errors.workEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.workEmail[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alternative Phone
          </label>
          <input
            type="tel"
            value={formData.alternativePhone}
            onChange={(e) => handleChange("alternativePhone", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.alternativePhone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="+1 (555) 987-6543"
          />
          {errors.alternativePhone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.alternativePhone[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedinProfile}
            onChange={(e) => handleChange("linkedinProfile", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skype ID
          </label>
          <input
            type="text"
            value={formData.skypeId}
            onChange={(e) => handleChange("skypeId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your.skype.id"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}

// Emergency Contact Tab Component
function EmergencyContactTab({
  data,
  onUpdate,
  isSaving,
  validationErrors,
  validateField,
}) {
  const [formData, setFormData] = useState({
    name: data.name || "",
    relationship: data.relationship || "",
    phone: data.phone || "",
    alternativePhone: data.alternativePhone || "",
    email: data.email || "",
    address: data.address || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      name: data.name || "",
      relationship: data.relationship || "",
      phone: data.phone || "",
      alternativePhone: data.alternativePhone || "",
      email: data.email || "",
      address: data.address || "",
    });
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate required fields
    const nameErrors = validateField("Emergency Contact Name", formData.name, {
      required: true,
      minLength: 2,
    });
    const relationshipErrors = validateField(
      "Relationship",
      formData.relationship,
      { required: true }
    );
    const phoneErrors = validateField(
      "Emergency Contact Phone",
      formData.phone,
      { required: true, phone: true }
    );

    if (nameErrors.length > 0) newErrors.name = nameErrors;
    if (relationshipErrors.length > 0)
      newErrors.relationship = relationshipErrors;
    if (phoneErrors.length > 0) newErrors.phone = phoneErrors;

    // Validate optional fields
    if (formData.email) {
      const emailErrors = validateField(
        "Emergency Contact Email",
        formData.email,
        { email: true }
      );
      if (emailErrors.length > 0) newErrors.email = emailErrors;
    }

    if (formData.alternativePhone) {
      const altPhoneErrors = validateField(
        "Alternative Phone",
        formData.alternativePhone,
        { phone: true }
      );
      if (altPhoneErrors.length > 0)
        newErrors.alternativePhone = altPhoneErrors;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onUpdate(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-yellow-400 text-lg">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Emergency Contact Information
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              This information will be used to contact someone on your behalf in
              case of an emergency. Please ensure the details are accurate and
              up-to-date.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter emergency contact name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.relationship}
            onChange={(e) => handleChange("relationship", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.relationship ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Relationship</option>
            <option value="spouse">Spouse</option>
            <option value="parent">Parent</option>
            <option value="child">Child</option>
            <option value="sibling">Sibling</option>
            <option value="friend">Friend</option>
            <option value="other">Other</option>
          </select>
          {errors.relationship && (
            <p className="mt-1 text-sm text-red-600">
              {errors.relationship[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alternative Phone
          </label>
          <input
            type="tel"
            value={formData.alternativePhone}
            onChange={(e) => handleChange("alternativePhone", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.alternativePhone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="+1 (555) 987-6543"
          />
          {errors.alternativePhone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.alternativePhone[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="emergency.contact@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter emergency contact address"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}

// Bank Details Tab Component
function BankDetailsTab({
  data,
  onUpdate,
  isSaving,
  validationErrors,
  validateField,
}) {
  const [formData, setFormData] = useState({
    country: data.country || "India",
    bankAccountNumber: data.bankAccountNumber || "",
    confirmBankAccountNumber: data.confirmBankAccountNumber || "",
    bankCode: data.bankCode || "",
    nameAsPerBankAccount: data.nameAsPerBankAccount || "",
    accountType: data.accountType || "Savings",
  });

  const [errors, setErrors] = useState({});
  const [showSensitive, setShowSensitive] = useState(false);

  useEffect(() => {
    setFormData({
      country: data.country || "India",
      bankAccountNumber: data.bankAccountNumber || "",
      confirmBankAccountNumber: data.confirmBankAccountNumber || "",
      bankCode: data.bankCode || "",
      nameAsPerBankAccount: data.nameAsPerBankAccount || "",
      accountType: data.accountType || "Savings",
    });
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate required fields if any bank info is provided
    const hasAnyBankInfo = Object.values(formData).some(
      (value) => value.trim() !== ""
    );

    if (hasAnyBankInfo) {
      const accountNumberErrors = validateField(
        "Bank Account Number",
        formData.bankAccountNumber,
        { required: true }
      );
      const confirmAccountErrors = validateField(
        "Confirm Bank Account Number",
        formData.confirmBankAccountNumber,
        { required: true }
      );
      const bankCodeErrors = validateField("Bank Code", formData.bankCode, {
        required: true,
      });
      const nameErrors = validateField(
        "Name as per Bank Account",
        formData.nameAsPerBankAccount,
        { required: true }
      );

      // Check if account numbers match
      if (formData.bankAccountNumber !== formData.confirmBankAccountNumber) {
        confirmAccountErrors.push("Account numbers do not match");
      }

      if (accountNumberErrors.length > 0)
        newErrors.bankAccountNumber = accountNumberErrors;
      if (confirmAccountErrors.length > 0)
        newErrors.confirmBankAccountNumber = confirmAccountErrors;
      if (bankCodeErrors.length > 0) newErrors.bankCode = bankCodeErrors;
      if (nameErrors.length > 0) newErrors.nameAsPerBankAccount = nameErrors;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onUpdate(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const maskSensitiveData = (value, showLength = 4) => {
    if (!value || showSensitive) return value;
    return (
      "*".repeat(Math.max(0, value.length - showLength)) +
      value.slice(-showLength)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-blue-400 text-lg">🔒</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Secure Banking Information
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Your banking information is encrypted and securely stored. This
              information is used for salary payments and reimbursements.
            </p>
            <button
              type="button"
              onClick={() => setShowSensitive(!showSensitive)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-500 underline"
            >
              {showSensitive ? "Hide" : "Show"} sensitive information
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="India">India</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="Australia">Australia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.accountType}
            onChange={(e) => handleChange("accountType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
            <option value="Checking">Checking</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={
              showSensitive
                ? formData.bankAccountNumber
                : maskSensitiveData(formData.bankAccountNumber)
            }
            onChange={(e) => handleChange("bankAccountNumber", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bankAccountNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter bank account number"
          />
          {errors.bankAccountNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bankAccountNumber[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Bank Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={
              showSensitive
                ? formData.confirmBankAccountNumber
                : maskSensitiveData(formData.confirmBankAccountNumber)
            }
            onChange={(e) =>
              handleChange("confirmBankAccountNumber", e.target.value)
            }
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmBankAccountNumber
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Re-enter bank account number"
          />
          {errors.confirmBankAccountNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmBankAccountNumber[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Code (IFSC/Routing/Sort Code){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.bankCode}
            onChange={(e) => handleChange("bankCode", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bankCode ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter bank code"
          />
          {errors.bankCode && (
            <p className="mt-1 text-sm text-red-600">{errors.bankCode[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name as per Bank Account <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nameAsPerBankAccount}
            onChange={(e) =>
              handleChange("nameAsPerBankAccount", e.target.value)
            }
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nameAsPerBankAccount ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter name as per bank account"
          />
          {errors.nameAsPerBankAccount && (
            <p className="mt-1 text-sm text-red-600">
              {errors.nameAsPerBankAccount[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}

// Preferences Tab Component
function PreferencesTab({
  data,
  onUpdate,
  isSaving,
  validationErrors,
  validateField,
}) {
  const [formData, setFormData] = useState({
    language: data.language || "en",
    timezone: data.timezone || "",
    theme: data.theme || "light",
    dateFormat: data.dateFormat || "MM/dd/yyyy",
    timeFormat: data.timeFormat || "12h",
    notifications: {
      email: data.notifications?.email ?? true,
      sms: data.notifications?.sms ?? false,
      push: data.notifications?.push ?? true,
      leaveRequests: data.notifications?.leaveRequests ?? true,
      attendance: data.notifications?.attendance ?? true,
      payroll: data.notifications?.payroll ?? true,
      announcements: data.notifications?.announcements ?? true,
    },
  });

  useEffect(() => {
    setFormData({
      language: data.language || "en",
      timezone: data.timezone || "",
      theme: data.theme || "light",
      dateFormat: data.dateFormat || "MM/dd/yyyy",
      timeFormat: data.timeFormat || "12h",
      notifications: {
        email: data.notifications?.email ?? true,
        sms: data.notifications?.sms ?? false,
        push: data.notifications?.push ?? true,
        leaveRequests: data.notifications?.leaveRequests ?? true,
        attendance: data.notifications?.attendance ?? true,
        payroll: data.notifications?.payroll ?? true,
        announcements: data.notifications?.announcements ?? true,
      },
    });
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (notificationType, value) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [notificationType]: value,
      },
    }));
  };

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Display & Language Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Display & Language
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Timezone</option>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={formData.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (Follow System)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={formData.dateFormat}
              onChange={(e) => handleChange("dateFormat", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MM/dd/yyyy">MM/dd/yyyy (12/31/2023)</option>
              <option value="dd/MM/yyyy">dd/MM/yyyy (31/12/2023)</option>
              <option value="yyyy-MM-dd">yyyy-MM-dd (2023-12-31)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Format
            </label>
            <select
              value={formData.timeFormat}
              onChange={(e) => handleChange("timeFormat", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="12h">12 Hour (2:30 PM)</option>
              <option value="24h">24 Hour (14:30)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-800 mb-3">
              Delivery Methods
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={(e) =>
                    handleNotificationChange("email", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Email notifications
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.sms}
                  onChange={(e) =>
                    handleNotificationChange("sms", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">
                  SMS notifications
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.push}
                  onChange={(e) =>
                    handleNotificationChange("push", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Push notifications
                </span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-800 mb-3">
              Notification Types
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.leaveRequests}
                  onChange={(e) =>
                    handleNotificationChange("leaveRequests", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Leave request updates
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.attendance}
                  onChange={(e) =>
                    handleNotificationChange("attendance", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Attendance reminders
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.payroll}
                  onChange={(e) =>
                    handleNotificationChange("payroll", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Payroll notifications
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications.announcements}
                  onChange={(e) =>
                    handleNotificationChange("announcements", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Company announcements
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}

// Address Tab Component
function AddressTab({
  data,
  onUpdate,
  isSaving,
  validationErrors,
  validateField,
}) {
  const [formData, setFormData] = useState({
    presentAddress: data.presentAddress || "",
    city: data.city || "",
    state: data.state || "",
    postalCode: data.postalCode || "",
    country: data.country || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      presentAddress: data.presentAddress || "",
      city: data.city || "",
      state: data.state || "",
      postalCode: data.postalCode || "",
      country: data.country || "",
    });
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate required fields
    const addressErrors = validateField(
      "Present Address",
      formData.presentAddress,
      {
        required: true,
      }
    );
    const cityErrors = validateField("City", formData.city, {
      required: true,
    });
    const stateErrors = validateField("State", formData.state, {
      required: true,
    });
    const postalCodeErrors = validateField("Postal Code", formData.postalCode, {
      required: true,
    });
    const countryErrors = validateField("Country", formData.country, {
      required: true,
    });

    if (addressErrors.length > 0) newErrors.presentAddress = addressErrors;
    if (cityErrors.length > 0) newErrors.city = cityErrors;
    if (stateErrors.length > 0) newErrors.state = stateErrors;
    if (postalCodeErrors.length > 0) newErrors.postalCode = postalCodeErrors;
    if (countryErrors.length > 0) newErrors.country = countryErrors;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onUpdate(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-blue-400 text-lg">🏠</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Address Information
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Please provide your current residential address details. This
              information is used for official correspondence and verification
              purposes.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Present Address <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.presentAddress}
            onChange={(e) => handleChange("presentAddress", e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.presentAddress ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your complete street address"
          />
          {errors.presentAddress && (
            <p className="mt-1 text-sm text-red-600">
              {errors.presentAddress[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State/Province <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter state or province"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.postalCode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter postal code"
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.postalCode[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.country ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter country"
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country[0]}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}

// Previous Employment Tab Component
function PreviousEmploymentTab({
  data,
  onUpdate,
  isSaving,
  validationErrors,
  validateField,
}) {
  const [formData, setFormData] = useState(data || []);

  useEffect(() => {
    setFormData(data || []);
  }, [data]);

  const addEmployment = () => {
    const newEmployment = {
      companyName: "",
      designation: "",
      fromDate: "",
      toDate: "",
      companyAddress: "",
    };
    setFormData([...formData, newEmployment]);
  };

  const removeEmployment = (index) => {
    const updated = formData.filter((_, i) => i !== index);
    setFormData(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = formData.map((employment, i) =>
      i === index ? { ...employment, [field]: value } : employment
    );
    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-blue-400 text-lg">💼</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Previous Employment History
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Add details about your previous work experience. This information
              helps us understand your professional background and skills.
            </p>
          </div>
        </div>
      </div>

      {formData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No previous employment records added yet.</p>
          <button
            type="button"
            onClick={addEmployment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Employment Record
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {formData.map((employment, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Employment Record {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeEmployment(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={employment.companyName}
                    onChange={(e) =>
                      handleChange(index, "companyName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={employment.designation}
                    onChange={(e) =>
                      handleChange(index, "designation", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your designation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={employment.fromDate}
                    onChange={(e) =>
                      handleChange(index, "fromDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={employment.toDate}
                    onChange={(e) =>
                      handleChange(index, "toDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address
                  </label>
                  <textarea
                    value={employment.companyAddress}
                    onChange={(e) =>
                      handleChange(index, "companyAddress", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter company address"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEmployment}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600"
          >
            + Add Another Employment Record
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}

// Family Details Tab Component
function FamilyDetailsTab({
  data,
  onUpdate,
  isSaving,
  validationErrors,
  validateField,
}) {
  const [formData, setFormData] = useState(data || []);

  useEffect(() => {
    setFormData(data || []);
  }, [data]);

  const addFamilyMember = () => {
    const newMember = {
      name: "",
      relationship: "",
      gender: "",
      bloodGroup: "",
      nationality: "",
      isMinor: false,
    };
    setFormData([...formData, newMember]);
  };

  const removeFamilyMember = (index) => {
    const updated = formData.filter((_, i) => i !== index);
    setFormData(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = formData.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-blue-400 text-lg">👨‍👩‍👧‍👦</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Family Details
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Add information about your family members. This information may be
              used for emergency contacts, insurance, and other benefits.
            </p>
          </div>
        </div>
      </div>

      {formData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No family members added yet.</p>
          <button
            type="button"
            onClick={addFamilyMember}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Family Member
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {formData.map((member, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Family Member {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeFamilyMember(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <select
                    value={member.relationship}
                    onChange={(e) =>
                      handleChange(index, "relationship", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="child">Child</option>
                    <option value="sibling">Sibling</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={member.gender}
                    onChange={(e) =>
                      handleChange(index, "gender", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    value={member.bloodGroup}
                    onChange={(e) =>
                      handleChange(index, "bloodGroup", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={member.nationality}
                    onChange={(e) =>
                      handleChange(index, "nationality", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter nationality"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={member.isMinor}
                      onChange={(e) =>
                        handleChange(index, "isMinor", e.target.checked)
                      }
                      className="mr-2 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    Is Minor (under 18)
                  </label>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFamilyMember}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600"
          >
            + Add Another Family Member
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}

// Documents Tab Component
function DocumentsTab({
  data,
  onUpdate,
  isSaving,
  validationErrors,
  validateField,
}) {
  const [formData, setFormData] = useState({
    profilePicture: data.profilePicture || null,
    addressProof: data.addressProof || null,
    identityProof: data.identityProof || null,
    educationCertificates: data.educationCertificates || [],
    experienceLetters: data.experienceLetters || [],
    otherDocuments: data.otherDocuments || [],
  });

  const [uploading, setUploading] = useState({});

  useEffect(() => {
    setFormData({
      profilePicture: data.profilePicture || null,
      addressProof: data.addressProof || null,
      identityProof: data.identityProof || null,
      educationCertificates: data.educationCertificates || [],
      experienceLetters: data.experienceLetters || [],
      otherDocuments: data.otherDocuments || [],
    });
  }, [data]);

  const handleFileUpload = async (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [documentType]: true }));

    try {
      // In a real application, you would upload to a server here
      // For now, we'll simulate the upload and store file info
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(file), // Temporary URL for preview
      };

      if (
        documentType === "profilePicture" ||
        documentType === "addressProof" ||
        documentType === "identityProof"
      ) {
        setFormData((prev) => ({
          ...prev,
          [documentType]: fileInfo,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [documentType]: [...prev[documentType], fileInfo],
        }));
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [documentType]: false }));
    }
  };

  const removeDocument = (documentType, index = null) => {
    if (index !== null) {
      setFormData((prev) => ({
        ...prev,
        [documentType]: prev[documentType].filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [documentType]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const DocumentUploadSection = ({
    title,
    documentType,
    multiple = false,
    accept = "*/*",
  }) => {
    const documents = multiple
      ? formData[documentType]
      : [formData[documentType]].filter(Boolean);

    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">{title}</h4>

        {documents.length > 0 && (
          <div className="mb-4 space-y-2">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">📄</span>
                  <span className="text-sm text-gray-900">{doc.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    removeDocument(documentType, multiple ? index : null)
                  }
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading[documentType] ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept={accept}
              multiple={multiple}
              onChange={(e) => handleFileUpload(e, documentType)}
              disabled={uploading[documentType]}
            />
          </label>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-blue-400 text-lg">📄</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Document Management
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Upload and manage your important documents. All documents are
              securely stored and encrypted.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <DocumentUploadSection
          title="Profile Picture"
          documentType="profilePicture"
          accept="image/*"
        />

        <DocumentUploadSection
          title="Address Proof"
          documentType="addressProof"
          accept=".pdf,.doc,.docx,.jpg,.png"
        />

        <DocumentUploadSection
          title="Identity Proof"
          documentType="identityProof"
          accept=".pdf,.doc,.docx,.jpg,.png"
        />

        <DocumentUploadSection
          title="Education Certificates"
          documentType="educationCertificates"
          multiple={true}
          accept=".pdf,.doc,.docx,.jpg,.png"
        />

        <DocumentUploadSection
          title="Experience Letters"
          documentType="experienceLetters"
          multiple={true}
          accept=".pdf,.doc,.docx,.jpg,.png"
        />

        <DocumentUploadSection
          title="Other Documents"
          documentType="otherDocuments"
          multiple={true}
          accept=".pdf,.doc,.docx,.jpg,.png"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}
