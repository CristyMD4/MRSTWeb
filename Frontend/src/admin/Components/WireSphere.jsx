import React, { useEffect, useMemo, useRef } from "react";

export default function WireSphere({
  size = 80,
  animate = false, // keep false -> NO spinning
  className = "",
}) {
  const ref = useRef(null);

  const data = useMemo(() => {
    const lat = 12;
    const lon = 18;
    const pts = [];
    const edges = [];
    const rings = [];

    for (let i = 0; i <= lat; i++) {
      const v = i / lat;
      const phi = (v - 0.5) * Math.PI;
      const ring = [];
      for (let j = 0; j < lon; j++) {
        const u = j / lon;
        const theta = u * Math.PI * 2;
        const x = Math.cos(phi) * Math.cos(theta);
        const y = Math.sin(phi);
        const z = Math.cos(phi) * Math.sin(theta);
        ring.push(pts.length);
        pts.push([x, y, z]);
      }
      rings.push(ring);
    }

    // around ring
    for (const ring of rings) {
      for (let j = 0; j < ring.length; j++) {
        edges.push([ring[j], ring[(j + 1) % ring.length]]);
      }
    }
    // between rings
    for (let i = 0; i < rings.length - 1; i++) {
      for (let j = 0; j < lon; j++) edges.push([rings[i][j], rings[i + 1][j]]);
    }

    return { pts, edges };
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { pts, edges } = data;

    const rotY = (p, a) => {
      const [x, y, z] = p;
      const ca = Math.cos(a), sa = Math.sin(a);
      return [x * ca + z * sa, y, -x * sa + z * ca];
    };
    const rotX = (p, a) => {
      const [x, y, z] = p;
      const ca = Math.cos(a), sa = Math.sin(a);
      return [x, y * ca - z * sa, y * sa + z * ca];
    };
    const proj = (p) => {
      const [x, y, z] = p;
      const dist = 2.8;
      const s = 1 / (dist - z);
      return [x * s, y * s, s];
    };

    let raf = 0;
    let t = 0;

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.36;

      const ay = animate ? t * 0.01 : 0.55;
      const ax = animate ? 0.55 + Math.sin(t * 0.006) * 0.08 : 0.55;

      const P = pts.map((p) => {
        let q = rotY(p, ay);
        q = rotX(q, ax);
        const [px, py, s] = proj(q);
        return { x: cx + px * r, y: cy + py * r, z: q[2], s };
      });

      const sorted = edges
        .map(([a, b]) => ({ a, b, z: (P[a].z + P[b].z) / 2 }))
        .sort((e1, e2) => e1.z - e2.z);

      ctx.lineWidth = 1;
      ctx.lineCap = "round";

      // lines
      for (const e of sorted) {
        const A = P[e.a];
        const B = P[e.b];
        const depth = (A.s + B.s) / 2;
        const alpha = Math.min(0.95, Math.max(0.10, (depth - 0.22) * 2.2));

        ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      }

      // nodes
      for (const p of P) {
        const alpha = Math.min(0.9, Math.max(0.15, (p.s - 0.22) * 2.5));
        ctx.fillStyle = `rgba(125,211,252,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.15, 0, Math.PI * 2);
        ctx.fill();
      }

      // glow ring
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowColor = "rgba(56,189,248,0.45)";
      ctx.shadowBlur = 18;
      ctx.strokeStyle = "rgba(56,189,248,0.16)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.02, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (animate) {
        t += 1;
        raf = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [size, animate, data]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ display: "block" }}
    />
  );
}