import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const pairs = [
  {
    before:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
    after:
      "https://images.unsplash.com/photo-1517524206127-48bbd363f3a7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    before:
      "https://images.unsplash.com/photo-1515923161875-1aee33d6f0f0?auto=format&fit=crop&w=1200&q=80",
    after:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80"
  },
  {
    before:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
    after:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
  }
];

function Arrow({ dir = "left", onClick }) {
  const left = dir === "left";
  return (
    <button
      onClick={onClick}
      className={
        "absolute top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center " +
        (left ? "left-4" : "right-4")
      }
      aria-label={left ? "Previous" : "Next"}
    >
      <span className="text-lg font-black">{left ? "‹" : "›"}</span>
    </button>
  );
}

export default function BeforeAfterCarousel() {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const item = pairs[idx];

  const dots = useMemo(
    () =>
      pairs.map((_, i) => (
        <button
          key={i}
          onClick={() => setIdx(i)}
          className={
            "h-2.5 rounded-full transition " +
            (i === idx ? "w-8 bg-[var(--sw-blue)]" : "w-2.5 bg-slate-300 hover:bg-slate-400")
          }
          aria-label={`Go to slide ${i + 1}`}
        />
      )),
    [idx]
  );

  return (
    <div className="relative card overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="relative">
          <img src={item.before} alt="before" className="h-72 md:h-96 w-full object-cover" />
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-800">
            {t("gallery.before")}
          </div>
        </div>
        <div className="relative">
          <img src={item.after} alt="after" className="h-72 md:h-96 w-full object-cover" />
          <div className="absolute left-4 top-4 rounded-full bg-[var(--sw-blue)] px-3 py-1 text-xs font-extrabold text-white">
            {t("gallery.after")}
          </div>
        </div>
      </div>

      <Arrow dir="left" onClick={() => setIdx((p) => (p - 1 + pairs.length) % pairs.length)} />
      <Arrow dir="right" onClick={() => setIdx((p) => (p + 1) % pairs.length)} />

      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
        {dots}
      </div>
    </div>
  );
}
