import React, { useState, useEffect } from "react";
import { Eye, Download, Trash2, Calendar, DollarSign } from "lucide-react";

export default function InvoiceSection() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/invoices");
      const data = await response.json();

      if (data.success) {
        setInvoices(data.data);
      } else {
        setError(data.message || "Failed to fetch invoices");
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoiceId, invoiceNumber) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/download`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Failed to download invoice");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Error downloading invoice: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <section className="p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading invoices...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6">
        <div className="text-center py-8">
          <div className="text-red-500">Error: {error}</div>
          <button
            onClick={fetchInvoices}
            className="mt-2 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6">
      {invoices.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">
            No invoices found. Create your first invoice!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Status Badge */}
              <span
                className={`absolute top-4 right-4 text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                  invoice.status
                )}`}
              >
                {invoice.status.charAt(0).toUpperCase() +
                  invoice.status.slice(1)}
              </span>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Invoice #{invoice.invoiceNumber}
                  </h3>
                  <p className="text-sm text-gray-600">{invoice.clientName}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {formatDate(invoice.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {formatCurrency(invoice.total, invoice.currency)}
                    </span>
                  </div>
                </div>

                {invoice.notes && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {invoice.notes}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
                  title="View Invoice"
                >
                  <Eye className="h-4 w-4 text-gray-500" />
                </button>

                <button
                  onClick={() =>
                    handleDownload(invoice._id, invoice.invoiceNumber)
                  }
                  className="flex-1 inline-flex items-center justify-center bg-white border border-blue-600 text-blue-600 font-medium rounded-lg px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
