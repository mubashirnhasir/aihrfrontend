"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeDocumentsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('employeeToken');
            
            if (!token) {
                router.push('/employee/auth/signin');
                return;
            }

            const response = await fetch('/api/employee/documents', {
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
                throw new Error('Failed to fetch documents');
            }

            const data = await response.json();
            setDocuments(data.documents || []);
            setCategories(data.categories || []);
        } catch (err) {
            console.error('Error fetching documents:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            setUploadError('File size must be less than 10MB');
            return;
        }

        try {
            setIsUploading(true);
            setUploadError(null);
            
            const formData = new FormData();
            formData.append('document', file);
            formData.append('category', selectedCategory !== 'all' ? selectedCategory : 'general');

            const token = localStorage.getItem('employeeToken');
            const response = await fetch('/api/employee/documents/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            await fetchDocuments(); // Refresh the list
            event.target.value = ''; // Clear the input
        } catch (err) {
            console.error('Error uploading document:', err);
            setUploadError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = async (documentId, filename) => {
        try {
            const token = localStorage.getItem('employeeToken');
            const response = await fetch(`/api/employee/documents/${documentId}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading document:', err);
            alert('Failed to download document');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('word') || fileType.includes('document')) return '📝';
        if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📊';
        return '📎';
    };

    const getCategoryColor = (category) => {
        const colors = {
            'personal': 'bg-blue-100 text-blue-800',
            'certificates': 'bg-green-100 text-green-800',
            'contracts': 'bg-purple-100 text-purple-800',
            'payroll': 'bg-yellow-100 text-yellow-800',
            'training': 'bg-orange-100 text-orange-800',
            'general': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors['general'];
    };

    // Filter documents
    const filteredDocuments = documents.filter(doc => {
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
        const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                    <div className="text-red-600 text-lg mb-4">Error loading documents</div>
                    <button 
                        onClick={fetchDocuments}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
                    <p className="text-gray-600">Manage your personal and work-related documents</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <label className="relative cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                            disabled={isUploading}
                        />
                        <div className={`
                            px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2
                            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}>
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3-3 3M12 18V12" />
                                    </svg>
                                    Upload Document
                                </>
                            )}
                        </div>
                    </label>
                </div>
            </div>

            {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {uploadError}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Documents Grid */}
            {filteredDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((document) => (
                        <div key={document._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">
                                        {getFileIcon(document.fileType)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 truncate" title={document.filename}>
                                            {document.filename}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(document.category)}`}>
                                                {document.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDownload(document._id, document.filename)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {document.description && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {document.description}
                                </p>
                            )}

                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex justify-between">
                                    <span>Size:</span>
                                    <span>{formatFileSize(document.fileSize)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Uploaded:</span>
                                    <span>{formatDate(document.uploadedAt)}</span>
                                </div>
                                {document.expiryDate && (
                                    <div className="flex justify-between">
                                        <span>Expires:</span>
                                        <span className={new Date(document.expiryDate) < new Date() ? 'text-red-600' : ''}>
                                            {formatDate(document.expiryDate)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {document.status && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            document.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            document.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {document.status}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="text-gray-400 text-6xl mb-4">📁</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm || selectedCategory !== 'all' 
                            ? 'Try adjusting your search or filter criteria'
                            : 'Upload your first document to get started'
                        }
                    </p>
                    {(searchTerm || selectedCategory !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                            className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Storage Usage */}
            {documents.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
                            <div className="text-gray-600 text-sm">Total Files</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {formatFileSize(documents.reduce((total, doc) => total + doc.fileSize, 0))}
                            </div>
                            <div className="text-gray-600 text-sm">Total Size</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {categories.length}
                            </div>
                            <div className="text-gray-600 text-sm">Categories</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
