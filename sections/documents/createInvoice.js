"use client";
import React, { useState } from "react";
import InvoiceHeader from "./InvoiceHeader";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";

export default function InvoiceCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    inoviceNumber: "",
    clientName: "",
    clientEmail: "",
    invoiceDate: "",
    dueDate: "",
    qty: 1,
    currency: "USD",
    amount: 0,
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // format amount with currency
  const formatCurrency = (val) => {
    const num = parseFloat(val) || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: form.currency,
    }).format(num);
  };

  const generateAndSavePDF = async () => {
    if (
      !form.inoviceNumber ||
      !form.clientName ||
      !form.clientEmail ||
      !form.invoiceDate ||
      !form.dueDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const doc = new jsPDF();

      // Set font size for title
      doc.setFontSize(18);
      doc.text("Invoice", 20, 30);

      // Invoice Details
      doc.setFontSize(12);
      doc.text(`Invoice No: #${form.inoviceNumber}`, 20, 40);
      doc.text(`Date: ${form.invoiceDate}`, 20, 50);
      doc.text(`Due Date: ${form.dueDate}`, 20, 60);
      doc.text(`Client: ${form.clientName}`, 20, 70);
      doc.text(`Email: ${form.clientEmail}`, 20, 80);

      // Draw line
      doc.setLineWidth(0.5);
      doc.line(20, 85, 190, 85);

      // Product Table
      doc.setFontSize(12);
      const startX = 20;
      let startY = 100;

      // Header for the table
      doc.text("Description", startX, startY);
      doc.text("Qty", startX + 100, startY);
      doc.text("Amount", startX + 140, startY);

      startY += 10; // Move to the next row

      // Table Data
      doc.text(form.notes || "Item", startX, startY);
      doc.text(form.qty.toString(), startX + 100, startY);
      doc.text(formatCurrency(form.amount), startX + 140, startY);

      // Line after table
      startY += 10;
      doc.line(20, startY, 190, startY);

      // Sub Total and Total
      const subTotal = form.qty * form.amount;

      startY += 20;
      doc.text("Sub Total", startX + 100, startY);
      doc.text(formatCurrency(subTotal), startX + 140, startY);

      startY += 10;
      doc.text("Total", startX + 100, startY);
      doc.text(formatCurrency(subTotal), startX + 140, startY);

      // Get PDF as base64 string
      const pdfData = doc.output("datauristring").split(",")[1]; // Remove data:application/pdf;base64, prefix

      // Prepare invoice data for API
      const invoiceData = {
        invoiceNumber: form.inoviceNumber,
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        invoiceDate: form.invoiceDate,
        dueDate: form.dueDate,
        items: [
          {
            description: form.notes || "Item",
            quantity: form.qty,
            amount: form.amount,
          },
        ],
        currency: form.currency,
        notes: form.notes,
        pdfData: pdfData,
      };

      // Save to database
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Invoice created and saved successfully!");
        // Reset form
        setForm({
          inoviceNumber: "",
          clientName: "",
          clientEmail: "",
          invoiceDate: "",
          dueDate: "",
          qty: 1,
          currency: "USD",
          amount: 0,
          notes: "",
        });
        // Redirect to invoices list
        router.push("/dashboard/documents");
      } else {
        throw new Error(result.message || "Failed to create invoice");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Error creating invoice: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <InvoiceHeader showCreate={false} />
      <main className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* left panel */}
        <section className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4">Create Invoice</h2>
          <div className="grid grid-cols-2 w-full gap-4 flex-grow">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Number
              </label>
              <input
                type="text"
                name="inoviceNumber"
                value={form.inoviceNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={form.clientEmail}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Date
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={form.invoiceDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Qty
              </label>
              <input
                type="number"
                name="qty"
                min="1"
                value={form.qty}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description or Notes
              </label>
              <textarea
                name="notes"
                rows={5}
                value={form.notes}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-full"
              />
            </div>
          </div>{" "}
          <button
            onClick={generateAndSavePDF}
            type="button"
            disabled={isLoading}
            className={`mt-10 px-4 py-2 rounded-lg self-start cursor-pointer ${
              isLoading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Creating Invoice..." : "Create Invoice"}
          </button>
        </section>

        {/* Right panel */}
        <section className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>

          <div className="border border-gray-200 rounded-lg p-4 flex-grow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-2xl font-bold">Product</span>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>Invoice #{form.inoviceNumber}</div>
                <div>Due Date: {form.dueDate || "—"}</div>
              </div>
            </div>
            <div className="mb-6">
              <div className="text-sm text-gray-600">To</div>
              <div className="font-medium">{form.clientName || "Name"}</div>
              <div className="text-sm text-gray-600">
                {form.clientEmail || "email@example.com"}
              </div>
            </div>

            <table className="w-full text-left mb-6">
              <thead>
                <tr className="text-gray-600">
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td>{form.notes || "Item"}</td>
                  <td>{form.qty}</td>
                  <td>{formatCurrency(form.amount)}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end space-x-6 text-gray-600">
              <div>Sub Total</div>
              <div>{formatCurrency(form.qty * form.amount)}</div>
            </div>
            <div className="flex justify-end space-x-6 mt-1 font-semibold text-gray-900">
              <div>Total</div>
              <div>{formatCurrency(form.qty * form.amount)}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
