import React from "react";
import { Eye, Download } from "lucide-react";

export default function InvoiceSection({ invoices }) {
  // creating 4 dummy invoices incas there is no data for invoice(temporary)-can be removed when connected with DB
  const items =
    invoices ||
    Array(4).fill({
      title: "Payment Invoice",
      description:
        "Learn how to configure your organization settings and create your first workspace",
      pages: "1 Page",
    });

  return (
    <section className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((inv, idx) => (
          <div
            key={idx}
            className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between"
          >
            <span className="absolute top-4 right-4 text-sm font-medium text-gray-600">
              {inv.pages}
            </span>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {inv.title}
              </h3>
              <p className="text-base text-gray-600">{inv.description}</p>
            </div>

            <div className="mt-6 flex items-center">
              <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer">
                <Eye className="h-6 w-6 text-gray-500" />
              </button>

              <button className="ml-auto inline-flex items-center justify-center bg-white border border-blue-600 text-blue-600 font-medium rounded-lg px-6 py-3 text-lg hover:bg-blue-50 cursor-pointer">
                Download
                <Download className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
