import React from "react";
import Link from "next/link";
import DocumentFile from "@/public/icons/documentFile";

const EmployeeRecentDocuments = ({ documentsData }) => {
  if (!documentsData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Documents</h3>
        <div className="text-center text-gray-500">Loading documents...</div>
      </div>
    );
  }

  const { recent, total } = documentsData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <DocumentFile color="red" />;
      case 'doc':
      case 'docx':
        return <DocumentFile color="blue" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <DocumentFile color="green" />;
      default:
        return <DocumentFile color="gray" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Documents</h3>
        <Link href="/employee/documents" className="text-sm text-blue-600 hover:text-blue-800">
          View All ({total})
        </Link>
      </div>
      
      <div className="space-y-3">
        {recent && recent.length > 0 ? (
          recent.map((doc, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {getFileIcon(doc.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.name}
                  </p>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {doc.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {doc.type.toUpperCase()} • {formatDate(doc.uploadDate)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No documents found
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200 mt-4">
        <Link 
          href="/employee/documents/upload"
          className="w-full block text-center py-2 px-4 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Upload New Document
        </Link>
      </div>
    </div>
  );
};

export default EmployeeRecentDocuments;
