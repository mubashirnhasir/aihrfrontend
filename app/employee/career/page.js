"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeCareerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [careerData, setCareerData] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchCareerData();
    }, []);

    const fetchCareerData = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('employeeToken');
            
            if (!token) {
                router.push('/employee/auth/signin');
                return;
            }

            const response = await fetch('/api/employee/career', {
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
                throw new Error('Failed to fetch career data');
            }

            const data = await response.json();
            setCareerData(data);
        } catch (err) {
            console.error('Error fetching career data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '🎯' },
        { id: 'skills', label: 'Skills', icon: '🛠️' },
        { id: 'goals', label: 'Goals', icon: '🎯' },
        { id: 'training', label: 'Training', icon: '📚' },
        { id: 'performance', label: 'Performance', icon: '📊' }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 text-lg mb-4">Error loading career data</div>
                    <button 
                        onClick={fetchCareerData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Career Development</h1>
                <p className="text-gray-600">Track your professional growth and development</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'overview' && <CareerOverview data={careerData} />}
                {activeTab === 'skills' && <SkillsAssessment data={careerData?.skills} />}
                {activeTab === 'goals' && <CareerGoals data={careerData?.goals} />}
                {activeTab === 'training' && <TrainingPrograms data={careerData?.training} />}
                {activeTab === 'performance' && <PerformanceReviews data={careerData?.performance} />}
            </div>
        </div>
    );
}

function CareerOverview({ data }) {
    return (
        <div className="space-y-6">
            {/* Career Path */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Path</h3>
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                    <div className="space-y-6">
                        {data?.careerPath?.map((position, index) => (
                            <div key={index} className="relative flex items-center">
                                <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                                    position.current ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                                }`}></div>
                                <div className="ml-10">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-gray-900">{position.title}</h4>
                                        {position.current && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm">{position.department}</p>
                                    <p className="text-gray-500 text-sm">{position.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-2xl font-bold text-blue-600">{data?.overview?.yearsWithCompany || 0}</div>
                    <div className="text-gray-600 text-sm">Years with Company</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-2xl font-bold text-green-600">{data?.overview?.promotions || 0}</div>
                    <div className="text-gray-600 text-sm">Promotions</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-2xl font-bold text-purple-600">{data?.overview?.trainingsCompleted || 0}</div>
                    <div className="text-gray-600 text-sm">Trainings Completed</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-2xl font-bold text-orange-600">{data?.overview?.lastReviewRating || 'N/A'}</div>
                    <div className="text-gray-600 text-sm">Last Review Rating</div>
                </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                {data?.achievements?.length > 0 ? (
                    <div className="space-y-4">
                        {data.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl">🏆</div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                                    <p className="text-gray-600 text-sm">{achievement.description}</p>
                                    <p className="text-gray-500 text-xs mt-1">{achievement.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">🏆</span>
                        <p>No achievements recorded yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function SkillsAssessment({ data }) {
    return (
        <div className="space-y-6">
            {/* Skills Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h3>
                    {data?.technical?.length > 0 ? (
                        <div className="space-y-4">
                            {data.technical.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                                        <span className="text-sm text-gray-500">{skill.level}/5</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(skill.level / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl mb-4 block">🛠️</span>
                            <p>No technical skills assessed yet</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Soft Skills</h3>
                    {data?.soft?.length > 0 ? (
                        <div className="space-y-4">
                            {data.soft.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                                        <span className="text-sm text-gray-500">{skill.level}/5</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(skill.level / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl mb-4 block">🤝</span>
                            <p>No soft skills assessed yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Skill Development Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Development Recommendations</h3>
                {data?.recommendations?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.recommendations.map((rec, index) => (
                            <div key={index} className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-900">{rec.skill}</h4>
                                <p className="text-blue-700 text-sm mt-1">{rec.reason}</p>
                                <div className="mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Priority: {rec.priority}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">💡</span>
                        <p>No skill recommendations available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function CareerGoals({ data }) {
    return (
        <div className="space-y-6">
            {/* Active Goals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add New Goal
                    </button>
                </div>
                
                {data?.active?.length > 0 ? (
                    <div className="space-y-4">
                        {data.active.map((goal, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {goal.priority} priority
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                                
                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">Progress</span>
                                        <span className="text-sm text-gray-500">{goal.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${goal.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Target: {goal.targetDate}</span>
                                    <span>Created: {goal.createdDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">🎯</span>
                        <p>No active goals set</p>
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Set Your First Goal
                        </button>
                    </div>
                )}
            </div>

            {/* Completed Goals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Goals</h3>
                {data?.completed?.length > 0 ? (
                    <div className="space-y-4">
                        {data.completed.map((goal, index) => (
                            <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-green-600">✅</span>
                                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
                                <div className="text-sm text-gray-500">
                                    Completed on {goal.completedDate}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">🏁</span>
                        <p>No completed goals yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TrainingPrograms({ data }) {
    return (
        <div className="space-y-6">
            {/* Available Trainings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Training Programs</h3>
                {data?.available?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.available.map((training, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                <h4 className="font-semibold text-gray-900 mb-2">{training.title}</h4>
                                <p className="text-gray-600 text-sm mb-3">{training.description}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                    <span>📅 {training.duration}</span>
                                    <span>👥 {training.instructor}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        training.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                        training.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {training.level}
                                    </span>
                                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                                        Enroll
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">📚</span>
                        <p>No training programs available</p>
                    </div>
                )}
            </div>

            {/* Completed Trainings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Training Programs</h3>
                {data?.completed?.length > 0 ? (
                    <div className="space-y-4">
                        {data.completed.map((training, index) => (
                            <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-green-600">✅</span>
                                            <h4 className="font-semibold text-gray-900">{training.title}</h4>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{training.description}</p>
                                        <div className="text-sm text-gray-500">
                                            Completed on {training.completedDate} • Score: {training.score}%
                                        </div>
                                    </div>
                                    {training.certificate && (
                                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                                            View Certificate
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">🎓</span>
                        <p>No completed trainings yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function PerformanceReviews({ data }) {
    return (
        <div className="space-y-6">
            {/* Latest Review */}
            {data?.latest && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Performance Review</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-3xl font-bold text-blue-600">{data.latest.overallRating}</div>
                                <div>
                                    <div className="font-semibold text-gray-900">Overall Rating</div>
                                    <div className="text-gray-600 text-sm">{data.latest.reviewPeriod}</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {data.latest.categories?.map((category, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                            <span className="text-sm text-gray-500">{category.rating}/5</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(category.rating / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Highlights</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {data.latest.highlights?.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">•</span>
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                            
                            {data.latest.improvementAreas && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Areas for Improvement</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        {data.latest.improvementAreas.map((area, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-orange-600 mt-0.5">•</span>
                                                {area}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Review History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review History</h3>
                {data?.history?.length > 0 ? (
                    <div className="space-y-4">
                        {data.history.map((review, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-900">{review.reviewPeriod}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-blue-600">{review.overallRating}</span>
                                        <span className="text-gray-500">/5</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{review.summary}</p>
                                <div className="text-sm text-gray-500">
                                    Reviewed by {review.reviewer} on {review.reviewDate}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">📊</span>
                        <p>No performance reviews available yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
