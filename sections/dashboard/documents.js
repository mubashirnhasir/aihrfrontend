"use client";
import DocumentFile from '@/public/icons/documentFile';
import React, { useState } from 'react';

const Documents = () => {
  const [data, setData] = useState([
    {
      document: "HR Document 2024",
      status: "Unread",
      fileUrl: "/files/hr-document-2024.pdf",
    },
    {
      document: "Project Proposal Q1 2024",
      status: "Unread",
      fileUrl: "/files/project-proposal-q1-2024.pdf",
    },
    {
      document: "Marketing Strategy Overview",
      status: "Unread",
      fileUrl: "/files/marketing-strategy-overview.pdf",
    },
    {
      document: "Sales Report July 2024",
      status: "Unread",
      fileUrl: "/files/sales-report-july-2024.pdf",
    },
    {
      document: "Budget Allocation for 2024",
      status: "Unread",
      fileUrl: "/files/budget-allocation-2024.pdf",
    },
  ]);

  const handleOpen = (index) => {
    const updated = [...data];
    updated[index].status = "Read";
    setData(updated);

    // Trigger file download
    const link = document.createElement("a");
    link.href = updated[index].fileUrl;
    link.download = updated[index].document + ".pdf"; // default name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="border rounded-lg border-main p-2 h-[400px] overflow-hidden gap-1 flex flex-col">
        <div className="headings flex flex-col gap-1 p-2">
          <div className="text-xl font-semibold">Documents</div>
          <div className="bg-gray-200 w-full h-[1px] rounded-full shadow-xl"></div>
        </div>

        <div className="mids flex gap-4 items-start">
          <div className="bg-yellow-100 rounded-lg w-fit px-4 py-6">
            <div><DocumentFile /></div>
            <div className="font-semibold text-lg text-yellow-600">Unread Files</div>
            <div className="font-medium text-gray-600">
              {data.filter(d => d.status === "Unread").length} Documents
            </div>
          </div>
          <div className="bg-green-100 rounded-lg w-fit px-4 py-6">
            <div><DocumentFile /></div>
            <div className="font-semibold text-lg text-green-600">Read Files</div>
            <div className="font-medium text-gray-600">
              {data.filter(d => d.status === "Read").length} Documents
            </div>
          </div>
        </div>

        <div className="h-full overflow-y-scroll custom-scrollbar py-2">
          <div className="flex flex-col gap-2 px-2">
            <div className="font-medium text-gray-700">Latest Documents</div>
            <div className="flex flex-col gap-2">
              {data.map((doc, index) => (
                <div
                  onClick={() => handleOpen(index)}
                  key={doc.document}
                  className="w-full flex cursor-pointer justify-between px-2 border border-main rounded-lg py-2"
                >
                  <div className="left flex items-center justify-between gap-2">
                    <div><DocumentFile /></div>
                    <div className="font-medium text-md text-gray-600 tracking-wide">
                      {doc.document}
                    </div>
                  </div>
                  <div className="text-gray-500 font-medium">
                    {doc.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
