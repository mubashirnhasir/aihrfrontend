/**
 * Interview Setup Component
 * Handles job description and resume upload with sample data
 */
"use client";

import { useState } from 'react';

export default function InterviewSetup({ onComplete, data }) {
  const [formData, setFormData] = useState({
    role: data.role || '',
    experience: data.experience || '',
    jobDescription: data.jobDescription || '',
    candidateResume: data.candidateResume || '',
    useSampleData: false
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Sample DevOps Engineer Job Description
  const sampleJobDescription = `DevOps Engineer - 4+ Years Experience

We are seeking an experienced DevOps Engineer to join our dynamic team. The ideal candidate will have 4+ years of hands-on experience in DevOps practices, cloud technologies, and automation.

Key Responsibilities:
• Design, implement, and maintain CI/CD pipelines using tools like Jenkins, GitLab CI, or Azure DevOps
• Manage cloud infrastructure on AWS, Azure, or GCP with Infrastructure as Code (Terraform, CloudFormation)
• Implement containerization strategies using Docker and orchestration with Kubernetes
• Monitor system performance and implement logging solutions (ELK stack, Prometheus, Grafana)
• Automate deployment processes and infrastructure provisioning
• Collaborate with development teams to optimize application performance
• Ensure security best practices in all deployments
• Troubleshoot production issues and implement solutions

Required Skills:
• 4+ years of DevOps/SRE experience
• Strong experience with cloud platforms (AWS/Azure/GCP)
• Proficiency in containerization (Docker, Kubernetes)
• CI/CD pipeline implementation and management
• Infrastructure as Code (Terraform, Ansible, CloudFormation)
• Scripting languages (Python, Bash, PowerShell)
• Monitoring and logging tools
• Version control systems (Git)
• Linux/Unix system administration
• Understanding of security practices

Preferred Qualifications:
• Kubernetes certification (CKA/CKAD)
• Cloud certifications (AWS Solutions Architect, Azure DevOps Engineer)
• Experience with microservices architecture
• Knowledge of agile development methodologies`;

  // Sample Candidate Resume
  const sampleResume = `John Smith - Senior DevOps Engineer

Contact: john.smith@email.com | LinkedIn: linkedin.com/in/johnsmith | Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced DevOps Engineer with 5+ years of expertise in cloud infrastructure, automation, and CI/CD pipeline development. Proven track record of implementing scalable solutions that improve deployment efficiency by 70% and reduce system downtime by 85%.

TECHNICAL SKILLS
• Cloud Platforms: AWS (EC2, S3, RDS, Lambda, EKS), Azure (AKS, Functions, Storage)
• Containers & Orchestration: Docker, Kubernetes, Docker Swarm, Helm
• CI/CD Tools: Jenkins, GitLab CI, Azure DevOps, GitHub Actions
• Infrastructure as Code: Terraform, Ansible, CloudFormation, ARM Templates
• Monitoring & Logging: Prometheus, Grafana, ELK Stack, CloudWatch, Azure Monitor
• Scripting: Python, Bash, PowerShell, YAML, JSON
• Version Control: Git, GitHub, GitLab, Bitbucket
• Databases: PostgreSQL, MySQL, MongoDB, Redis
• Security: SSL/TLS, OAuth, RBAC, Security Scanning Tools

PROFESSIONAL EXPERIENCE

Senior DevOps Engineer | TechCorp Solutions | 2021 - Present
• Designed and implemented CI/CD pipelines reducing deployment time from 4 hours to 15 minutes
• Migrated monolithic applications to microservices architecture using Kubernetes
• Automated infrastructure provisioning using Terraform, managing 200+ cloud resources
• Implemented comprehensive monitoring solutions increasing system visibility by 90%
• Led security hardening initiatives reducing vulnerabilities by 60%

DevOps Engineer | CloudTech Inc. | 2019 - 2021
• Built and maintained CI/CD pipelines for 20+ applications using Jenkins and GitLab CI
• Implemented Docker containerization strategy reducing environment inconsistencies by 95%
• Automated backup and disaster recovery processes ensuring 99.9% uptime
• Collaborated with development teams to optimize application performance
• Managed AWS infrastructure serving 1M+ daily active users

Junior DevOps Engineer | StartupXYZ | 2018 - 2019
• Assisted in cloud migration from on-premises to AWS
• Developed automation scripts reducing manual tasks by 80%
• Implemented monitoring solutions using Prometheus and Grafana
• Supported production deployments and troubleshooting

CERTIFICATIONS
• AWS Certified Solutions Architect - Associate (2022)
• Certified Kubernetes Administrator (CKA) (2021)
• Azure DevOps Engineer Expert (2020)

EDUCATION
Bachelor of Science in Computer Science | State University | 2018

ACHIEVEMENTS
• Reduced infrastructure costs by 40% through optimization and automation
• Achieved 99.99% system uptime through robust monitoring and alerting
• Led migration of 50+ applications to cloud-native architecture
• Mentored 3 junior engineers in DevOps best practices`;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUseSampleData = () => {
    setFormData(prev => ({
      ...prev,
      role: 'DevOps Engineer',
      experience: '4+ years',
      jobDescription: sampleJobDescription,
      candidateResume: sampleResume,
      useSampleData: true
    }));
  };

  const handleGenerateQuestions = async () => {
    if (!formData.role || !formData.experience || !formData.jobDescription || !formData.candidateResume) {
      setError('Please fill in all required fields or use sample data');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-screening/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: formData.role,
          experience: formData.experience,
          jobDescription: formData.jobDescription,
          candidateResume: formData.candidateResume
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate questions');
      }

      // Pass the generated data to the parent component
      onComplete({
        ...formData,
        questions: result.questions
      });

    } catch (err) {
      console.error('Question generation error:', err);
      setError(err.message || 'An error occurred while generating questions');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Interview Setup</h2>
        <p className="text-gray-600">
          Configure your screening interview by providing job requirements and candidate information
        </p>
      </div>

      {/* Sample Data Option */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🚀 Quick Start with Sample Data
            </h3>
            <p className="text-blue-700">
              Use our pre-configured DevOps Engineer role with sample job description and candidate resume
            </p>
          </div>
          <button
            onClick={handleUseSampleData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Use Sample Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Job Information */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role/Position *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., DevOps Engineer, Software Developer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select experience level</option>
                  <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                  <option value="Mid Level (2-4 years)">Mid Level (2-4 years)</option>
                  <option value="Senior Level (4-7 years)">Senior Level (4-7 years)</option>
                  <option value="Lead Level (7+ years)">Lead Level (7+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  placeholder="Paste the complete job description here..."
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Candidate Information */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Candidate Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Resume *
              </label>
              <textarea
                name="candidateResume"
                value={formData.candidateResume}
                onChange={handleInputChange}
                placeholder="Paste the candidate's resume here..."
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div className="text-red-700">{error}</div>
          </div>
        </div>
      )}

      {/* Generate Questions Button */}
      <div className="text-center pt-6">
        <button
          onClick={handleGenerateQuestions}
          disabled={isGenerating}
          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
            isGenerating
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Generating Questions...
            </div>
          ) : (
            '🤖 Generate Interview Questions'
          )}
        </button>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="font-semibold text-yellow-900 mb-3">💡 Setup Tips</h4>
        <ul className="space-y-2 text-yellow-800">
          <li>• Provide detailed job descriptions for better question relevance</li>
          <li>• Include specific technical requirements and skills needed</li>
          <li>• Complete resumes help generate personalized questions</li>
          <li>• The AI will create 8-10 targeted questions for a 10-minute interview</li>
        </ul>
      </div>
    </div>
  );
}
