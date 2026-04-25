import React from "react";
import networkBg from "../../assets/location-network.png";
import WireSphere from "./WireSphere";

function Node({ x, y, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      aria-label={label}
      title={label}
    >
      <div className="relative">
        {/* 3D wire sphere (NOT image) */}
        <WireSphere
          size={80}
          animate={false} // IMPORTANT: no spin
          className={
            "transition " +
            (active
              ? "drop-shadow-[0_0_30px_rgba(56,189,248,0.55)]"
              : "drop-shadow-[0_0_18px_rgba(56,189,248,0.25)] group-hover:drop-shadow-[0_0_26px_rgba(56,189,248,0.45)]")
          }
        />

        {/* ring overlay */}
        <div
          className={
            "pointer-events-none absolute inset-0 rounded-full ring-2 transition " +
            (active
              ? "ring-sky-300/70"
              : "ring-white/15 group-hover:ring-sky-300/50")
          }
        />
      </div>

      <div className="mt-2 text-center text-xs font-extrabold tracking-wide text-slate-100 drop-shadow">
        {label}
      </div>
    </button>
  );
}

export default function LocationNetworkSelector({ locations, selected, onSelect }) {
  const locs = locations.slice(0, 3);

  // Triangle anchors in % (tuned)
  const anchors = [
    { x: 50, y: 24 }, // top
    { x: 24, y: 76 }, // left
    { x: 76, y: 76 }, // right
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200">
      {/* dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* fancy network background */}
      <img
        src={networkBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-55"
        draggable={false}
      />

      {/* subtle overlay */}
      <div className="absolute inset-0 bg-slate-950/25" />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-white">Locations</div>
            <div className="mt-1 text-xs text-slate-200">
              Click a sphere to switch the dashboard to that location.
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelect("all")}
            className={
              "btn h-9 px-3 " +
              (selected === "all"
                ? "bg-white/15 text-white hover:bg-white/20"
                : "bg-white/10 text-white hover:bg-white/20")
            }
          >
            Analyze all
          </button>
        </div>

        <div className="relative mt-6 aspect-[16/9] w-full">
          {/* triangle lines */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="swLine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="rgba(125,211,252,0.85)" />
                <stop offset="1" stopColor="rgba(34,211,238,0.55)" />
              </linearGradient>
            </defs>
            <polyline
              points="50,24 24,76 76,76 50,24"
              fill="none"
              stroke="url(#swLine)"
              strokeWidth="0.8"
              opacity="0.9"
            />
          </svg>

          {/* nodes */}
          {locs.map((l, idx) => (
            <Node
              key={l.id}
              x={anchors[idx]?.x ?? 50}
              y={anchors[idx]?.y ?? 50}
              label={l.name}
              active={selected === l.id}
              onClick={() => onSelect(l.id)}
            />
          ))}

          {/* caption */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-slate-100">
            Current scope:{" "}
            {selected === "all"
              ? "All Locations"
              : locs.find((l) => l.id === selected)?.name || selected}
          </div>
        </div>
      </div>
    </div>
  );
}