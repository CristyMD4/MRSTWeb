import React, { useEffect, useState } from "react";
import { cancelBooking, getMyBookings } from "../lib/bookingsApi";

function StatusBadge({ status }) {
  const palette = {
    new: "bg-amber-100 text-amber-700",
    pending: "bg-violet-100 text-violet-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    completed: "bg-sky-100 text-sky-700",
    canceled: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${palette[status] || "bg-slate-100 text-slate-700"}`}>
      {status || "new"}
    </span>
  );
}

export default function MyBookings() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  function refresh() {
    setLoading(true);
    getMyBookings()
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        setErr(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading bookings...</div>;
  if (err) return <div className="p-6 text-red-400">{err}</div>;

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="container-page">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="badge border-sky-400/20 bg-sky-400/10 text-sky-200">Client Area</div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight">My Bookings</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Review upcoming appointments, check service details, and cancel a booking if your plans change.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center text-slate-300">
              No bookings found for your account yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Booking ID</div>
                      <div className="mt-2 text-lg font-extrabold text-white">{item.id}</div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Service</div>
                      <div className="mt-2 text-sm text-slate-200">{item.service || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Vehicle</div>
                      <div className="mt-2 text-sm text-slate-200">{item.vehicle || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Date</div>
                      <div className="mt-2 text-sm text-slate-200">{item.date || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Time</div>
                      <div className="mt-2 text-sm text-slate-200">{item.time || "-"}</div>
                    </div>
                  </div>

                  {item.notes ? (
                    <div className="mt-5 rounded-2xl border border-white/8 bg-black/10 p-4 text-sm text-slate-300">
                      <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Notes</div>
                      {item.notes}
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={item.status === "completed" || item.status === "canceled"}
                      onClick={async () => {
                        await cancelBooking(item.id);
                        refresh();
                      }}
                      className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
