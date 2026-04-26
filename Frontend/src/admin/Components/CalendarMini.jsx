import React, { useMemo, useState } from "react";

function ymd(d) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarMini({ bookings = [], onSelectDate }) {
  const [cursor, setCursor] = useState(() => new Date());

  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);

  const days = useMemo(() => {
    const start = new Date(monthStart);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // monday start
    const end = new Date(monthEnd);
    end.setDate(end.getDate() + (6 - ((end.getDay() + 6) % 7)));

    const out = [];
    const cur = new Date(start);
    while (cur <= end) {
      out.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return out;
  }, [cursor]);

  const counts = useMemo(() => {
    const map = new Map();
    bookings.forEach((b) => {
      if (!b.date) return;
      const key = b.date.slice(0, 10);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [bookings]);

  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <button className="rounded-lg border px-2 py-1 hover:bg-slate-50" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
          ←
        </button>
        <div className="font-semibold">{monthLabel}</div>
        <button className="rounded-lg border px-2 py-1 hover:bg-slate-50" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-slate-500">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((d) => {
          const key = ymd(d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const c = counts.get(key) || 0;

          return (
            <button
              key={key}
              onClick={() => onSelectDate?.(key)}
              className={
                "relative rounded-xl border p-2 text-sm transition hover:bg-slate-50 " +
                (inMonth ? "bg-white" : "bg-slate-50 text-slate-400")
              }
            >
              <div className="text-left">{d.getDate()}</div>
              {c > 0 && (
                <span className="absolute right-2 top-2 rounded-full bg-sky-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {c}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
