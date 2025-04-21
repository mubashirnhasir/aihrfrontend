"use client";
import React, { useState } from "react";
import InvoiceHeader from "./InvoiceHeader";

export default function InvoiceCreatePage() {
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
            <div>
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
          </div>

          <button
            type="button"
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 self-start cursor-pointer"
          >
            Create Invoice
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
                <div>
                  <div>
                    Invoice #{form.inoviceNumber}
                  </div>
                </div>
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
