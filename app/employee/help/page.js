"use client";

import { useState } from 'react';

export default function EmployeeHelpPage() {
    const [activeCategory, setActiveCategory] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: 'general',
        priority: 'medium',
        description: ''
    });

    const helpCategories = [
        {
            id: 'general',
            title: 'General Help',
            icon: '❓',
            description: 'Common questions and general assistance'
        },
        {
            id: 'attendance',
            title: 'Attendance',
            icon: '⏰',
            description: 'Clock in/out, attendance tracking, time corrections'
        },
        {
            id: 'leaves',
            title: 'Leave Management',
            icon: '🏖️',
            description: 'Leave requests, balance, approval process'
        },
        {
            id: 'payroll',
            title: 'Payroll & Benefits',
            icon: '💰',
            description: 'Salary, benefits, tax information'
        },
        {
            id: 'documents',
            title: 'Documents',
            icon: '📄',
            description: 'Document upload, access, and management'
        },
        {
            id: 'technical',
            title: 'Technical Support',
            icon: '💻',
            description: 'Login issues, system errors, troubleshooting'
        }
    ];

    const faqData = {
        general: [
            {
                question: 'How do I update my personal information?',
                answer: 'Go to My Profile section and click on Edit Profile. You can update your contact information, emergency contacts, and other personal details.'
            },
            {
                question: 'How do I change my password?',
                answer: 'In your profile settings, click on "Change Password" and follow the prompts to set a new secure password.'
            },
            {
                question: 'Who do I contact for HR-related questions?',
                answer: 'You can contact the HR department at hr@company.com or extension 1234. For urgent matters, you can also submit a support ticket below.'
            }
        ],
        attendance: [
            {
                question: 'How do I clock in and out?',
                answer: 'Visit the Attendance page and use the large clock in/out button. Make sure to clock out before leaving work each day.'
            },
            {
                question: 'What if I forgot to clock in or out?',
                answer: 'Submit a time correction request through the Attendance page or contact your supervisor. Include the date and times that need to be corrected.'
            },
            {
                question: 'How are break times tracked?',
                answer: 'Break times are automatically calculated based on your clock in/out times. Extended breaks may require manual entry.'
            }
        ],
        leaves: [
            {
                question: 'How do I request time off?',
                answer: 'Go to Leave Requests section, click "Request Leave", fill out the form with dates and reason, then submit for approval.'
            },
            {
                question: 'How can I check my leave balance?',
                answer: 'Your current leave balance is displayed on your dashboard and in the Leave Requests section.'
            },
            {
                question: 'What is the approval process for leave requests?',
                answer: 'Leave requests are first reviewed by your direct supervisor, then by HR if required. You\'ll receive email notifications for status updates.'
            }
        ],
        payroll: [
            {
                question: 'When do I receive my payslip?',
                answer: 'Payslips are available in the Documents section on the last working day of each month.'
            },
            {
                question: 'How do I update my bank details?',
                answer: 'Contact HR directly to update banking information for security reasons. This cannot be changed through the self-service portal.'
            },
            {
                question: 'Where can I find my tax documents?',
                answer: 'Annual tax documents like W-2s are available in the Documents section at the beginning of each tax year.'
            }
        ],
        documents: [
            {
                question: 'What file types can I upload?',
                answer: 'You can upload PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, JPEG, PNG, and GIF files up to 10MB each.'
            },
            {
                question: 'How do I organize my documents?',
                answer: 'Documents are automatically categorized, but you can use the filter options to view specific categories or search for specific files.'
            },
            {
                question: 'Are my documents secure?',
                answer: 'Yes, all documents are encrypted and only accessible by you and authorized HR personnel as needed.'
            }
        ],
        technical: [
            {
                question: 'I can\'t log in to my account',
                answer: 'Try resetting your password using the "Forgot Password" link. If the issue persists, contact IT support at it@company.com.'
            },
            {
                question: 'The page is loading slowly or not at all',
                answer: 'Try refreshing the page, clearing your browser cache, or trying a different browser. Check your internet connection.'
            },
            {
                question: 'I\'m getting error messages',
                answer: 'Take a screenshot of the error message and submit a support ticket with details about what you were doing when the error occurred.'
            }
        ]
    };

    const filteredFAQs = faqData[activeCategory]?.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            alert('Support ticket submitted successfully! You will receive a confirmation email shortly.');
            setTicketForm({
                subject: '',
                category: 'general',
                priority: 'medium',
                description: ''
            });
        } catch (error) {
            alert('Failed to submit ticket. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
                <p className="text-gray-600">Find answers to common questions or get personalized support</p>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                        <div className="text-2xl mb-2">📞</div>
                        <div className="font-semibold">HR Department</div>
                        <div className="text-blue-100">ext. 1234</div>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">✉️</div>
                        <div className="font-semibold">Email Support</div>
                        <div className="text-blue-100">hr@company.com</div>
                    </div>
                    <div>
                        <div className="text-2xl mb-2">💻</div>
                        <div className="font-semibold">IT Support</div>
                        <div className="text-blue-100">it@company.com</div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search help articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Categories */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help Categories</h3>
                        <div className="space-y-2">
                            {helpCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                                        activeCategory === category.id
                                            ? 'bg-blue-50 border-blue-200 border text-blue-700'
                                            : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{category.icon}</span>
                                        <div>
                                            <div className="font-medium">{category.title}</div>
                                            <div className="text-sm text-gray-600">{category.description}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Frequently Asked Questions - {helpCategories.find(c => c.id === activeCategory)?.title}
                        </h3>
                        
                        {filteredFAQs.length > 0 ? (
                            <div className="space-y-4">
                                {filteredFAQs.map((faq, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg">
                                        <details className="group">
                                            <summary className="p-4 cursor-pointer hover:bg-gray-50 rounded-lg flex justify-between items-center">
                                                <span className="font-medium text-gray-900">{faq.question}</span>
                                                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </summary>
                                            <div className="px-4 pb-4 text-gray-600">
                                                {faq.answer}
                                            </div>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <span className="text-4xl mb-4 block">🔍</span>
                                <p>No help articles found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Ticket */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit a Support Ticket</h3>
                <p className="text-gray-600 mb-6">Can't find what you're looking for? Submit a support ticket and our team will help you.</p>
                
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input
                                type="text"
                                required
                                value={ticketForm.subject}
                                onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Brief description of your issue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={ticketForm.category}
                                onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {helpCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select
                            value={ticketForm.priority}
                            onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="low">Low - General inquiry</option>
                            <option value="medium">Medium - Non-urgent issue</option>
                            <option value="high">High - Urgent issue</option>
                            <option value="critical">Critical - System down/blocking work</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            required
                            rows={5}
                            value={ticketForm.description}
                            onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Please provide detailed information about your issue, including any error messages and steps to reproduce the problem..."
                        />
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Submit Ticket
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Knowledge Base */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <a href="#" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="text-2xl mb-2">📖</div>
                        <div className="font-semibold text-gray-900">Employee Handbook</div>
                        <div className="text-sm text-gray-600">Company policies and procedures</div>
                    </a>
                    <a href="#" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="text-2xl mb-2">🎥</div>
                        <div className="font-semibold text-gray-900">Video Tutorials</div>
                        <div className="text-sm text-gray-600">Step-by-step video guides</div>
                    </a>
                    <a href="#" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="text-2xl mb-2">💬</div>
                        <div className="font-semibold text-gray-900">Employee Forum</div>
                        <div className="text-sm text-gray-600">Ask questions to colleagues</div>
                    </a>
                </div>
            </div>
        </div>
    );
}
