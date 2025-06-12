"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductLogo from "@/public/icons/productLogo";
import OnboardingSuccess from "@/components/employee/OnboardingSuccess";

export default function EmployeeOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [formData, setFormData] = useState({
    // Step 1: Welcome & Profile Picture
    profileInfo: {
      profilePicture: "",
    },
    // Step 2: Personal Information
    personalInfo: {
      firstName: "",
      lastName: "",
      empId: "",
      department: "",
      designation: "",
      dateOfJoining: "",
      location: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
    },
    // Step 3: Address
    address: {
      presentAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    // Step 4: Previous Employment
    previousEmployment: [
      {
        companyName: "",
        designation: "",
        fromDate: "",
        toDate: "",
        companyAddress: "",
      },
    ],
    // Step 5: Accounts & Statutory (Bank Details)
    bankDetails: {
      country: "India",
      bankAccountNumber: "",
      confirmBankAccountNumber: "",
      bankCode: "",
      nameAsPerBankAccount: "",
      accountType: "Savings",
    },
    // Step 6: Family Details
    familyDetails: [
      {
        name: "",
        relationship: "",
        gender: "",
        bloodGroup: "",
        nationality: "",
        isMinor: false,
      },
    ],
    // Step 7: Attachments
    attachments: {
      presentAddress: null,
    },
  });
  useEffect(() => {
    const token = localStorage.getItem("employeeToken");
    if (!token) {
      console.log("❌ No authentication token found, redirecting to signin");
      router.push("/employee/auth/signin");
      return;
    } // Populate employee info from stored data
    const employeeData = JSON.parse(
      localStorage.getItem("employeeData") || "{}"
    );
    if (employeeData) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          empId: employeeData.employeeId || "",
          // Remove email prefilling - email: employeeData.email || "",
          department: employeeData.department || "",
          designation: employeeData.designation || "",
          dateOfJoining: employeeData.joiningDate || "",
        },
      }));
    }
  }, [router]);

  const handleChange = (section, field, value, index = null) => {
    if (section === "previousEmployment" && index !== null) {
      setFormData((prev) => ({
        ...prev,
        previousEmployment: prev.previousEmployment.map((emp, i) =>
          i === index ? { ...emp, [field]: value } : emp
        ),
      }));
    } else if (section === "familyDetails" && index !== null) {
      setFormData((prev) => ({
        ...prev,
        familyDetails: prev.familyDetails.map((member, i) =>
          i === index ? { ...member, [field]: value } : member
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const addPreviousEmployment = () => {
    setFormData((prev) => ({
      ...prev,
      previousEmployment: [
        ...prev.previousEmployment,
        {
          companyName: "",
          designation: "",
          fromDate: "",
          toDate: "",
          companyAddress: "",
        },
      ],
    }));
  };

  const addFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      familyDetails: [
        ...prev.familyDetails,
        {
          name: "",
          relationship: "",
          gender: "",
          bloodGroup: "",
          nationality: "",
          isMinor: false,
        },
      ],
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setAttachments((prev) => [...prev, { type, file, name: file.name }]);
    }
  };
  const handleNext = () => {
    // Validate current step before moving to next
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const validateCurrentStep = () => {
    setError("");
    const validationErrors = [];

    switch (currentStep) {
      case 2: // Personal Information
        if (!formData.personalInfo.firstName.trim()) {
          validationErrors.push("First Name is required");
        }
        if (!formData.personalInfo.lastName.trim()) {
          validationErrors.push("Last Name is required");
        }
        if (!formData.personalInfo.email.trim()) {
          validationErrors.push("Email is required");
        }
        if (!formData.personalInfo.phone.trim()) {
          validationErrors.push("Phone number is required");
        }
        if (!formData.personalInfo.dateOfBirth.trim()) {
          validationErrors.push("Date of Birth is required");
        }
        if (!formData.personalInfo.gender.trim()) {
          validationErrors.push("Gender is required");
        }
        if (!formData.personalInfo.nationality.trim()) {
          validationErrors.push("Nationality is required");
        }
        break;

      case 3: // Address
        if (!formData.address.presentAddress.trim()) {
          validationErrors.push("Present address is required");
        }
        if (!formData.address.city.trim()) {
          validationErrors.push("City is required");
        }
        if (!formData.address.state.trim()) {
          validationErrors.push("State is required");
        }
        if (!formData.address.postalCode.trim()) {
          validationErrors.push("Postal Code is required");
        }
        if (!formData.address.country.trim()) {
          validationErrors.push("Country is required");
        }
        break;

      // Add validation for other steps as needed
      default:
        break;
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return false;
    }
    return true;
  };

  const hasRequiredFields = (step) => {
    // Steps that have mandatory fields should not show "Skip for now"
    return [2, 3].includes(step); // Personal and Address steps have required fields
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // Validate required fields
    const validationErrors = [];

    // Validate personal information
    if (!formData.personalInfo.firstName.trim()) {
      validationErrors.push("First Name is required");
    }
    if (!formData.personalInfo.lastName.trim()) {
      validationErrors.push("Last Name is required");
    }
    if (!formData.personalInfo.email.trim()) {
      validationErrors.push("Email is required");
    }
    if (!formData.personalInfo.phone.trim()) {
      validationErrors.push("Phone number is required");
    }

    // Validate address
    if (!formData.address.presentAddress.trim()) {
      validationErrors.push("Present address is required");
    }
    if (!formData.address.city.trim()) {
      validationErrors.push("City is required");
    }
    if (!formData.address.state.trim()) {
      validationErrors.push("State is required");
    }
    if (!formData.address.country.trim()) {
      validationErrors.push("Country is required");
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("employeeToken");

      if (!token) {
        setError("Authentication required. Please sign in again.");
        router.push("/employee/auth/signin");
        return;
      }

      // Prepare comprehensive onboarding data for submission
      const submissionData = {
        personalInfo: formData.personalInfo,
        address: formData.address,
        previousEmployment: formData.previousEmployment,
        bankDetails: formData.bankDetails,
        familyDetails: formData.familyDetails,
        attachments: attachments.map((att) => ({
          type: att.type,
          name: att.name,
        })),
      };

      console.log("🚀 Submitting onboarding data:", submissionData);

      const response = await fetch("/api/employee/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        const employeeData = JSON.parse(
          localStorage.getItem("employeeData") || "{}"
        );
        employeeData.isFirstLogin = false;
        employeeData.onboardingCompleted = true;
        localStorage.setItem("employeeData", JSON.stringify(employeeData));

        // Show success screen instead of directly redirecting
        setIsCompleted(true);
      } else {
        setError(data.message || "Failed to complete onboarding");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Great to see you here{" "}
                {formData.personalInfo.empId
                  ? formData.personalInfo.empId.split("@")[0]
                  : "Waqas"}
                !
              </h3>
              <p className="text-gray-600 mb-6">
                How about uploading a picture of you?
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Tell us a bit more about your basic, academic & professional
                details
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-purple-200 bg-purple-100 flex items-center justify-center overflow-hidden">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  )}
                </div>
                <button
                  className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg"
                  onClick={() =>
                    document.getElementById("profile-upload").click()
                  }
                >
                  <span className="text-sm">📷</span>
                </button>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>

              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="text-purple-600 underline text-sm"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.personalInfo.empId
                    ? `${formData.personalInfo.empId} - ${formData.personalInfo.designation}`
                    : "Waqas Faraz"}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Emp ID: {formData.personalInfo.empId || "123123"} |
                    Department:{" "}
                    {formData.personalInfo.department || "Development"} |
                    Designation:{" "}
                    {formData.personalInfo.designation || "Frontend Developer"}{" "}
                    | Date of Joining:{" "}
                    {formData.personalInfo.dateOfJoining || "21-Nov-2024"}
                  </p>
                  <p>
                    Location: {formData.personalInfo.location || "Hyderabad"}
                  </p>
                </div>
              </div>
            </div>{" "}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">
                Personal
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={formData.personalInfo.firstName}
                    onChange={(e) =>
                      handleChange("personalInfo", "firstName", e.target.value)
                    }
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={formData.personalInfo.lastName}
                    onChange={(e) =>
                      handleChange("personalInfo", "lastName", e.target.value)
                    }
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={formData.personalInfo.email}
                    onChange={(e) =>
                      handleChange("personalInfo", "email", e.target.value)
                    }
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={formData.personalInfo.phone}
                    onChange={(e) =>
                      handleChange("personalInfo", "phone", e.target.value)
                    }
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) =>
                      handleChange(
                        "personalInfo",
                        "dateOfBirth",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={formData.personalInfo.gender}
                    onChange={(e) =>
                      handleChange("personalInfo", "gender", e.target.value)
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={formData.personalInfo.nationality}
                    onChange={(e) =>
                      handleChange(
                        "personalInfo",
                        "nationality",
                        e.target.value
                      )
                    }
                    placeholder="Enter your nationality"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.personalInfo.firstName || "John"}{" "}
                  {formData.personalInfo.lastName || "Doe"}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Emp ID: {formData.personalInfo.empId || "123123"} |
                    Department:{" "}
                    {formData.personalInfo.department || "Development"} |
                    Designation:{" "}
                    {formData.personalInfo.designation || "Frontend Developer"}{" "}
                    | Date of Joining:{" "}
                    {formData.personalInfo.dateOfJoining || "21-Nov-2024"}
                  </p>
                  <p>
                    Location: {formData.personalInfo.location || "Hyderabad"}
                  </p>
                </div>
              </div>
            </div>{" "}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">
                Address
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Present Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows="3"
                    value={formData.address.presentAddress}
                    onChange={(e) =>
                      handleChange("address", "presentAddress", e.target.value)
                    }
                    placeholder="Enter your present address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={formData.address.city}
                      onChange={(e) =>
                        handleChange("address", "city", e.target.value)
                      }
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={formData.address.state}
                      onChange={(e) =>
                        handleChange("address", "state", e.target.value)
                      }
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={formData.address.postalCode}
                      onChange={(e) =>
                        handleChange("address", "postalCode", e.target.value)
                      }
                      placeholder="Enter postal code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={formData.address.country}
                      onChange={(e) =>
                        handleChange("address", "country", e.target.value)
                      }
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.personalInfo.firstName || "Waqas"}{" "}
                  {formData.personalInfo.lastName || "Faraz"}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Emp ID: {formData.personalInfo.empId || "123123"} |
                    Department:{" "}
                    {formData.personalInfo.department || "Development"} |
                    Designation:{" "}
                    {formData.personalInfo.designation || "Frontend Developer"}{" "}
                    | Date of Joining:{" "}
                    {formData.personalInfo.dateOfJoining || "21-Nov-2024"}
                  </p>
                  <p>
                    Location: {formData.personalInfo.location || "Hyderabad"}
                  </p>
                </div>
              </div>
            </div>{" "}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">
                Previous Job
              </h4>
              {formData.previousEmployment.map((employment, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Employment-{index + 1}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={employment.companyName}
                        onChange={(e) =>
                          handleChange(
                            "previousEmployment",
                            "companyName",
                            e.target.value,
                            index
                          )
                        }
                      >
                        <option value="">Select</option>
                        <option value="TCS">TCS</option>
                        <option value="Infosys">Infosys</option>
                        <option value="Wipro">Wipro</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={employment.designation}
                        onChange={(e) =>
                          handleChange(
                            "previousEmployment",
                            "designation",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Enter designation"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={employment.fromDate}
                        onChange={(e) =>
                          handleChange(
                            "previousEmployment",
                            "fromDate",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={employment.toDate}
                        onChange={(e) =>
                          handleChange(
                            "previousEmployment",
                            "toDate",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Address
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      rows="2"
                      value={employment.companyAddress}
                      onChange={(e) =>
                        handleChange(
                          "previousEmployment",
                          "companyAddress",
                          e.target.value,
                          index
                        )
                      }
                      placeholder="Enter company address"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPreviousEmployment}
                className="text-purple-600 text-sm font-medium hover:underline flex items-center"
              >
                <span className="mr-1">➕</span> Add Another Employment
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.personalInfo.firstName || "Waqas"}{" "}
                  {formData.personalInfo.lastName || "Faraz"}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Emp ID: {formData.personalInfo.empId || "123123"} |
                    Department:{" "}
                    {formData.personalInfo.department || "Development"} |
                    Designation:{" "}
                    {formData.personalInfo.designation || "Frontend Developer"}{" "}
                    | Date of Joining:{" "}
                    {formData.personalInfo.dateOfJoining || "21-Nov-2024"}
                  </p>
                  <p>
                    Location: {formData.personalInfo.location || "Hyderabad"}
                  </p>
                </div>
              </div>
            </div>{" "}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">
                Banking
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Bank Account Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={formData.bankDetails.country}
                        onChange={(e) =>
                          handleChange("bankDetails", "country", e.target.value)
                        }
                      >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={formData.bankDetails.bankAccountNumber}
                        onChange={(e) =>
                          handleChange(
                            "bankDetails",
                            "bankAccountNumber",
                            e.target.value
                          )
                        }
                        placeholder="Enter account number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Bank Account Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={formData.bankDetails.confirmBankAccountNumber}
                        onChange={(e) =>
                          handleChange(
                            "bankDetails",
                            "confirmBankAccountNumber",
                            e.target.value
                          )
                        }
                        placeholder="Confirm account number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={formData.bankDetails.bankCode}
                        onChange={(e) =>
                          handleChange(
                            "bankDetails",
                            "bankCode",
                            e.target.value
                          )
                        }
                        placeholder="IFSC/Sort Code"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name as per Bank Account
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={formData.bankDetails.nameAsPerBankAccount}
                        onChange={(e) =>
                          handleChange(
                            "bankDetails",
                            "nameAsPerBankAccount",
                            e.target.value
                          )
                        }
                        placeholder="Full name as per bank account"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={formData.bankDetails.accountType}
                        onChange={(e) =>
                          handleChange(
                            "bankDetails",
                            "accountType",
                            e.target.value
                          )
                        }
                      >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                        <option value="Salary">Salary</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Other Details
                  </h5>
                  <div className="text-sm text-gray-600">
                    Additional statutory and tax information will be collected
                    during payroll setup.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.personalInfo.firstName || "Waqas"}{" "}
                  {formData.personalInfo.lastName || "Faraz"}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Emp ID: {formData.personalInfo.empId || "123123"} |
                    Department:{" "}
                    {formData.personalInfo.department || "Development"} |
                    Designation:{" "}
                    {formData.personalInfo.designation || "Frontend Developer"}{" "}
                    | Date of Joining:{" "}
                    {formData.personalInfo.dateOfJoining || "21-Nov-2024"}
                  </p>
                  <p>
                    Location: {formData.personalInfo.location || "Hyderabad"}
                  </p>
                </div>
              </div>
            </div>{" "}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">Family</h4>
              {formData.familyDetails.map((member, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Member-{index + 1}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={member.name}
                        onChange={(e) =>
                          handleChange(
                            "familyDetails",
                            "name",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Enter family member name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={member.relationship}
                        onChange={(e) =>
                          handleChange(
                            "familyDetails",
                            "relationship",
                            e.target.value,
                            index
                          )
                        }
                      >
                        <option value="">Select Relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={member.gender}
                        onChange={(e) =>
                          handleChange(
                            "familyDetails",
                            "gender",
                            e.target.value,
                            index
                          )
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Group
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={member.bloodGroup}
                        onChange={(e) =>
                          handleChange(
                            "familyDetails",
                            "bloodGroup",
                            e.target.value,
                            index
                          )
                        }
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={member.nationality}
                        onChange={(e) =>
                          handleChange(
                            "familyDetails",
                            "nationality",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Enter nationality"
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <input
                        type="checkbox"
                        id={`minor-${index}`}
                        checked={member.isMinor}
                        onChange={(e) =>
                          handleChange(
                            "familyDetails",
                            "isMinor",
                            e.target.checked,
                            index
                          )
                        }
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`minor-${index}`}
                        className="text-sm text-gray-700"
                      >
                        Minor (Under 18)
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addFamilyMember}
                className="text-purple-600 text-sm font-medium hover:underline flex items-center"
              >
                <span className="mr-1">➕</span> Add Another Member
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.personalInfo.firstName || "Waqas"}{" "}
                  {formData.personalInfo.lastName || "Faraz"}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Emp ID: {formData.personalInfo.empId || "123123"} |
                    Department:{" "}
                    {formData.personalInfo.department || "Development"} |
                    Designation:{" "}
                    {formData.personalInfo.designation || "Frontend Developer"}{" "}
                    | Date of Joining:{" "}
                    {formData.personalInfo.dateOfJoining || "21-Nov-2024"}
                  </p>
                  <p>
                    Location: {formData.personalInfo.location || "Hyderabad"}
                  </p>
                </div>
              </div>
            </div>{" "}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                Documents 📎
              </h4>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Document Upload
                  </h5>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-2">
                      <div className="text-gray-400">
                        <span className="text-2xl">📤</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Drag and drop files here, or
                        <br />
                        Upload from{" "}
                        <span className="text-purple-600 cursor-pointer">
                          Desktop
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        JPEG, PNG, PDF, and MP4 formats, up to 50MB
                      </div>
                      <button
                        className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() =>
                          document.getElementById("document-upload").click()
                        }
                      >
                        Browse File
                      </button>
                      <input
                        id="document-upload"
                        type="file"
                        onChange={(e) => handleFileUpload(e, "document")}
                        className="hidden"
                        multiple
                        accept=".jpeg,.jpg,.png,.pdf,.mp4"
                      />
                    </div>
                  </div>
                  {attachments
                    .filter((att) => att.type === "document")
                    .map((att, index) => (
                      <div
                        key={index}
                        className="mt-2 text-sm text-gray-600 flex items-center"
                      >
                        <span className="mr-2">📎</span>
                        <span>{att.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {isCompleted ? (
        <OnboardingSuccess
          employeeName={`${formData.personalInfo.firstName || "Waqas"} ${
            formData.personalInfo.lastName || "Faraz"
          }`}
        />
      ) : (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto pr-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mr-8">
              {/* Header */}{" "}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center gap-3 mb-4">
                  <ProductLogo />
                  <div className="text-xl font-bold text-gray-800">
                    SynaptHR
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Employee Onboarding
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Help us know you better. Provide all your employment
                  information
                </p>
              </div>
              {/* Progress Indicator */}
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  {" "}
                  {/* Step Navigation */}
                  <div className="flex items-center w-full">
                    {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
                      <React.Fragment key={step}>
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                            step <= currentStep
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {step <= currentStep
                            ? step < currentStep
                              ? "✓"
                              : step
                            : step}
                        </div>
                        {index < 6 && (
                          <div
                            className={`flex-1 h-1 mx-2 transition-all ${
                              step < currentStep
                                ? "bg-purple-600"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>{" "}
                {/* Step Labels */}
                <div className="flex items-center w-full mt-3 text-xs text-gray-500 px-2">
                  {[
                    { step: 1, label: "Welcome" },
                    { step: 2, label: "Personal" },
                    { step: 3, label: "Address" },
                    { step: 4, label: "Previous Job" },
                    { step: 5, label: "Banking" },
                    { step: 6, label: "Family" },
                    { step: 7, label: "Documents" },
                  ].map((item, index) => (
                    <React.Fragment key={item.step}>
                      <div className="w-10 text-center flex-shrink-0">
                        {item.label}
                      </div>
                      {index < 6 && <div className="flex-1 mx-2" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {/* Form Content */}
              <div className="px-6 py-6">
                {error && (
                  <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {renderStep()}
              </div>{" "}
              {/* Navigation Buttons */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between bg-gray-50">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    ← Back
                  </button>
                  {!hasRequiredFields(currentStep) && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                      Skip for now
                    </button>
                  )}
                </div>

                <div className="flex space-x-2">
                  {currentStep < 7 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 flex items-center"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-8 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Completing...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">🎉</span>
                          Finish Onboarding
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
