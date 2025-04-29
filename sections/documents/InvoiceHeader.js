import Link from "next/link";
import React from "react";
export default function InvoiceHeader({ showCreate = true, onCreate }) {
  return (
    <header className="px-6 py-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none">
          Invoices
        </button>
        {showCreate && (
          <div className="">
            <Link href={'/dashboard/documents/createInvoice'}>
              <button
                onClick={onCreate}
                className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                + Create Invoice
              </button>
            </Link>
          </div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">All Invoices</h1>
        <p className="text-sm text-gray-500">All Invoices</p>
      </div>
    </header>
  );
}
