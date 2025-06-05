"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('personal');
    const [validationErrors, setValidationErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('employeeToken');
            
            if (!token) {
                router.push('/employee/auth/signin');
                return;
            }

            const response = await fetch('/api/employee/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('employeeToken');
                router.push('/employee/auth/signin');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const data = await response.json();
            setProfileData(data);
        } catch (err) {
            console.error('Error fetching profile:', err);
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
            
            const token = localStorage.getItem('employeeToken');
            
            if (!token) {
                router.push('/employee/auth/signin');
                return;
            }

            const updateData = {
                [section]: sectionData
            };

            const response = await fetch('/api/employee/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (response.status === 401) {
                localStorage.removeItem('employeeToken');
                router.push('/employee/auth/signin');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const updatedData = await response.json();
            setProfileData(prev => ({
                ...prev,
                [section]: sectionData
            }));
            
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const validateField = (field, value, rules = {}) => {
        const errors = [];
        
        if (rules.required && (!value || value.trim() === '')) {
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
        { id: 'personal', label: 'Personal Info', icon: '👤' },
        { id: 'contact', label: 'Contact Details', icon: '📞' },
        { id: 'emergency', label: 'Emergency Contact', icon: '🆘' },
        { id: 'bank', label: 'Bank Details', icon: '🏦' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
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
            <div className="max-w-6xl mx-auto">                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your personal information and preferences</p>
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
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                        {activeTab === 'personal' && (
                            <PersonalInfoTab 
                                data={profileData?.personalInfo || {}}
                                onUpdate={(data) => updateProfile('personalInfo', data)}
                                isSaving={isSaving}
                                validationErrors={validationErrors}
                                validateField={validateField}
                            />
                        )}
                        
                        {activeTab === 'contact' && (
                            <ContactDetailsTab 
                                data={profileData?.contactInfo || {}}
                                onUpdate={(data) => updateProfile('contactInfo', data)}
                                isSaving={isSaving}
                                validationErrors={validationErrors}
                                validateField={validateField}
                            />
                        )}
                        
                        {activeTab === 'emergency' && (
                            <EmergencyContactTab 
                                data={profileData?.emergencyContact || {}}
                                onUpdate={(data) => updateProfile('emergencyContact', data)}
                                isSaving={isSaving}
                                validationErrors={validationErrors}
                                validateField={validateField}
                            />
                        )}
                        
                        {activeTab === 'bank' && (
                            <BankDetailsTab 
                                data={profileData?.bankDetails || {}}
                                onUpdate={(data) => updateProfile('bankDetails', data)}
                                isSaving={isSaving}
                                validationErrors={validationErrors}
                                validateField={validateField}
                            />
                        )}
                        
                        {activeTab === 'preferences' && (
                            <PreferencesTab 
                                data={profileData?.preferences || {}}
                                onUpdate={(data) => updateProfile('preferences', data)}
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
function PersonalInfoTab({ data, onUpdate, isSaving, validationErrors, validateField }) {
    const [formData, setFormData] = useState({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || '',
        maritalStatus: data.maritalStatus || '',
        nationality: data.nationality || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        country: data.country || ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || '',
            maritalStatus: data.maritalStatus || '',
            nationality: data.nationality || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
            country: data.country || ''
        });
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        
        // Validate required fields
        const firstNameErrors = validateField('First Name', formData.firstName, { required: true, minLength: 2 });
        const lastNameErrors = validateField('Last Name', formData.lastName, { required: true, minLength: 2 });
        
        if (firstNameErrors.length > 0) newErrors.firstName = firstNameErrors;
        if (lastNameErrors.length > 0) newErrors.lastName = lastNameErrors;
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            onUpdate(formData);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear field error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
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
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                    </label>
                    <select
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
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
                        Marital Status
                    </label>
                    <select
                        value={formData.maritalStatus}
                        onChange={(e) => handleChange('maritalStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality
                    </label>
                    <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => handleChange('nationality', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your nationality"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                    </label>
                    <textarea
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your street address"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="City"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province
                        </label>
                        <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="State"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP/Postal Code
                        </label>
                        <input
                            type="text"
                            value={formData.zipCode}
                            onChange={(e) => handleChange('zipCode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ZIP Code"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                    </label>
                    <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your country"
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
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>
        </form>
    );
}

// Contact Details Tab Component
function ContactDetailsTab({ data, onUpdate, isSaving, validationErrors, validateField }) {
    const [formData, setFormData] = useState({
        email: data.email || '',
        phone: data.phone || '',
        alternativePhone: data.alternativePhone || '',
        workEmail: data.workEmail || '',
        linkedinProfile: data.linkedinProfile || '',
        skypeId: data.skypeId || ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            email: data.email || '',
            phone: data.phone || '',
            alternativePhone: data.alternativePhone || '',
            workEmail: data.workEmail || '',
            linkedinProfile: data.linkedinProfile || '',
            skypeId: data.skypeId || ''
        });
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        
        // Validate required fields
        const emailErrors = validateField('Email', formData.email, { required: true, email: true });
        const phoneErrors = validateField('Phone', formData.phone, { required: true, phone: true });
        
        if (emailErrors.length > 0) newErrors.email = emailErrors;
        if (phoneErrors.length > 0) newErrors.phone = phoneErrors;
        
        // Validate optional email fields
        if (formData.workEmail) {
            const workEmailErrors = validateField('Work Email', formData.workEmail, { email: true });
            if (workEmailErrors.length > 0) newErrors.workEmail = workEmailErrors;
        }
        
        if (formData.alternativePhone) {
            const altPhoneErrors = validateField('Alternative Phone', formData.alternativePhone, { phone: true });
            if (altPhoneErrors.length > 0) newErrors.alternativePhone = altPhoneErrors;
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            onUpdate(formData);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
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
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
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
                        onChange={(e) => handleChange('workEmail', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.workEmail ? 'border-red-500' : 'border-gray-300'
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
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
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
                        onChange={(e) => handleChange('alternativePhone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.alternativePhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+1 (555) 987-6543"
                    />
                    {errors.alternativePhone && (
                        <p className="mt-1 text-sm text-red-600">{errors.alternativePhone[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile
                    </label>
                    <input
                        type="url"
                        value={formData.linkedinProfile}
                        onChange={(e) => handleChange('linkedinProfile', e.target.value)}
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
                        onChange={(e) => handleChange('skypeId', e.target.value)}
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
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>
        </form>
    );
}

// Emergency Contact Tab Component
function EmergencyContactTab({ data, onUpdate, isSaving, validationErrors, validateField }) {
    const [formData, setFormData] = useState({
        name: data.name || '',
        relationship: data.relationship || '',
        phone: data.phone || '',
        alternativePhone: data.alternativePhone || '',
        email: data.email || '',
        address: data.address || ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            name: data.name || '',
            relationship: data.relationship || '',
            phone: data.phone || '',
            alternativePhone: data.alternativePhone || '',
            email: data.email || '',
            address: data.address || ''
        });
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        
        // Validate required fields
        const nameErrors = validateField('Emergency Contact Name', formData.name, { required: true, minLength: 2 });
        const relationshipErrors = validateField('Relationship', formData.relationship, { required: true });
        const phoneErrors = validateField('Emergency Contact Phone', formData.phone, { required: true, phone: true });
        
        if (nameErrors.length > 0) newErrors.name = nameErrors;
        if (relationshipErrors.length > 0) newErrors.relationship = relationshipErrors;
        if (phoneErrors.length > 0) newErrors.phone = phoneErrors;
        
        // Validate optional fields
        if (formData.email) {
            const emailErrors = validateField('Emergency Contact Email', formData.email, { email: true });
            if (emailErrors.length > 0) newErrors.email = emailErrors;
        }
        
        if (formData.alternativePhone) {
            const altPhoneErrors = validateField('Alternative Phone', formData.alternativePhone, { phone: true });
            if (altPhoneErrors.length > 0) newErrors.alternativePhone = altPhoneErrors;
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            onUpdate(formData);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
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
                            This information will be used to contact someone on your behalf in case of an emergency.
                            Please ensure the details are accurate and up-to-date.
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
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
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
                        onChange={(e) => handleChange('relationship', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.relationship ? 'border-red-500' : 'border-gray-300'
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
                        <p className="mt-1 text-sm text-red-600">{errors.relationship[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
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
                        onChange={(e) => handleChange('alternativePhone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.alternativePhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+1 (555) 987-6543"
                    />
                    {errors.alternativePhone && (
                        <p className="mt-1 text-sm text-red-600">{errors.alternativePhone[0]}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
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
                        onChange={(e) => handleChange('address', e.target.value)}
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
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>
        </form>
    );
}

// Bank Details Tab Component
function BankDetailsTab({ data, onUpdate, isSaving, validationErrors, validateField }) {
    const [formData, setFormData] = useState({
        bankName: data.bankName || '',
        accountNumber: data.accountNumber || '',
        routingNumber: data.routingNumber || '',
        accountType: data.accountType || '',
        accountHolderName: data.accountHolderName || '',
        swiftCode: data.swiftCode || '',
        iban: data.iban || ''
    });

    const [errors, setErrors] = useState({});
    const [showSensitive, setShowSensitive] = useState(false);

    useEffect(() => {
        setFormData({
            bankName: data.bankName || '',
            accountNumber: data.accountNumber || '',
            routingNumber: data.routingNumber || '',
            accountType: data.accountType || '',
            accountHolderName: data.accountHolderName || '',
            swiftCode: data.swiftCode || '',
            iban: data.iban || ''
        });
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        
        // Validate required fields if any bank info is provided
        const hasAnyBankInfo = Object.values(formData).some(value => value.trim() !== '');
        
        if (hasAnyBankInfo) {
            const bankNameErrors = validateField('Bank Name', formData.bankName, { required: true });
            const accountNumberErrors = validateField('Account Number', formData.accountNumber, { required: true });
            const accountHolderErrors = validateField('Account Holder Name', formData.accountHolderName, { required: true });
            
            if (bankNameErrors.length > 0) newErrors.bankName = bankNameErrors;
            if (accountNumberErrors.length > 0) newErrors.accountNumber = accountNumberErrors;
            if (accountHolderErrors.length > 0) newErrors.accountHolderName = accountHolderErrors;
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            onUpdate(formData);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const maskSensitiveData = (value, showLength = 4) => {
        if (!value || showSensitive) return value;
        return '*'.repeat(Math.max(0, value.length - showLength)) + value.slice(-showLength);
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
                            Your banking information is encrypted and securely stored. This information is used for salary payments and reimbursements.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowSensitive(!showSensitive)}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-500 underline"
                        >
                            {showSensitive ? 'Hide' : 'Show'} sensitive information
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.bankName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter bank name"
                    />
                    {errors.bankName && (
                        <p className="mt-1 text-sm text-red-600">{errors.bankName[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.accountHolderName}
                        onChange={(e) => handleChange('accountHolderName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter account holder name"
                    />
                    {errors.accountHolderName && (
                        <p className="mt-1 text-sm text-red-600">{errors.accountHolderName[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={showSensitive ? formData.accountNumber : maskSensitiveData(formData.accountNumber)}
                        onChange={(e) => handleChange('accountNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter account number"
                    />
                    {errors.accountNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.accountNumber[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                    </label>
                    <select
                        value={formData.accountType}
                        onChange={(e) => handleChange('accountType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Account Type</option>
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                        <option value="business">Business</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Routing Number
                    </label>
                    <input
                        type="text"
                        value={showSensitive ? formData.routingNumber : maskSensitiveData(formData.routingNumber)}
                        onChange={(e) => handleChange('routingNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter routing number"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        SWIFT Code
                    </label>
                    <input
                        type="text"
                        value={formData.swiftCode}
                        onChange={(e) => handleChange('swiftCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter SWIFT code (for international transfers)"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        IBAN (International Bank Account Number)
                    </label>
                    <input
                        type="text"
                        value={showSensitive ? formData.iban : maskSensitiveData(formData.iban)}
                        onChange={(e) => handleChange('iban', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter IBAN (for international accounts)"
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
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>
        </form>
    );
}

// Preferences Tab Component
function PreferencesTab({ data, onUpdate, isSaving, validationErrors, validateField }) {
    const [formData, setFormData] = useState({
        language: data.language || 'en',
        timezone: data.timezone || '',
        theme: data.theme || 'light',
        dateFormat: data.dateFormat || 'MM/dd/yyyy',
        timeFormat: data.timeFormat || '12h',
        notifications: {
            email: data.notifications?.email ?? true,
            sms: data.notifications?.sms ?? false,
            push: data.notifications?.push ?? true,
            leaveRequests: data.notifications?.leaveRequests ?? true,
            attendance: data.notifications?.attendance ?? true,
            payroll: data.notifications?.payroll ?? true,
            announcements: data.notifications?.announcements ?? true
        }
    });

    useEffect(() => {
        setFormData({
            language: data.language || 'en',
            timezone: data.timezone || '',
            theme: data.theme || 'light',
            dateFormat: data.dateFormat || 'MM/dd/yyyy',
            timeFormat: data.timeFormat || '12h',
            notifications: {
                email: data.notifications?.email ?? true,
                sms: data.notifications?.sms ?? false,
                push: data.notifications?.push ?? true,
                leaveRequests: data.notifications?.leaveRequests ?? true,
                attendance: data.notifications?.attendance ?? true,
                payroll: data.notifications?.payroll ?? true,
                announcements: data.notifications?.announcements ?? true
            }
        });
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNotificationChange = (notificationType, value) => {
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [notificationType]: value
            }
        }));
    };

    const timezones = [
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Australia/Sydney'
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Display & Language Preferences */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Display & Language</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                        </label>
                        <select
                            value={formData.language}
                            onChange={(e) => handleChange('language', e.target.value)}
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
                            onChange={(e) => handleChange('timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Timezone</option>
                            {timezones.map(tz => (
                                <option key={tz} value={tz}>{tz}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                        </label>
                        <select
                            value={formData.theme}
                            onChange={(e) => handleChange('theme', e.target.value)}
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
                            onChange={(e) => handleChange('dateFormat', e.target.value)}
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
                            onChange={(e) => handleChange('timeFormat', e.target.value)}
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
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                
                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3">Delivery Methods</h4>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.email}
                                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                            </label>
                            
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.sms}
                                    onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                            </label>
                            
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.push}
                                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3">Notification Types</h4>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.leaveRequests}
                                    onChange={(e) => handleNotificationChange('leaveRequests', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700">Leave request updates</span>
                            </label>
                            
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.attendance}
                                    onChange={(e) => handleNotificationChange('attendance', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700">Attendance reminders</span>
                            </label>
                            
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.payroll}
                                    onChange={(e) => handleNotificationChange('payroll', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700">Payroll notifications</span>
                            </label>
                            
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.announcements}
                                    onChange={(e) => handleNotificationChange('announcements', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700">Company announcements</span>
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
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>
        </form>
    );
}