import React from "react";

export default function BookingFilters({ q, setQ, status, setStatus, service, setService, dateFrom, setDateFrom, dateTo, setDateTo }) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name / email / phone..."
        className="md:col-span-2 rounded-xl border px-3 py-2"
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border px-3 py-2">
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="canceled">Canceled</option>
      </select>

      <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service (optional)" className="rounded-xl border px-3 py-2" />

      <div className="grid grid-cols-2 gap-2">
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-xl border px-3 py-2" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-xl border px-3 py-2" />
      </div>
    </div>
  );
}
