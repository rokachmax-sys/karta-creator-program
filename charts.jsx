/* Karta Creator Program — data-viz. Dark, hairline grid, acid accent line charts.
   Exports LineChart + the three program charts to window. */
const { useRef: cuRef, useEffect: cuEffect, useState: cuState } = React;

/* shared palette for series (acid hero + neutral ramp) */
const SERIES_COLORS = ["#ccff00", "#8fa6c4", "#5e6470", "#3f4146"];

/* in-view hook — adds draw-in once */
function useInView(threshold) {
  const ref = cuRef(null);
  const [seen, setSeen] = cuState(false);
  cuEffect(() => {
    if (!ref.current) return;
    if (!("IntersectionObserver" in window)) { setSeen(true); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, { threshold: threshold || 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

/* ---------------------------------------------------------------------------
   LineChart
   props:
     series   [{ name, data:[numbers], color, fill?:bool, dashed?:bool }]
     xLabels  [string]
     yMax     number          (axis top)
     yStep    number          (gridline interval)
     yUnit    'pct' | 'usd'    (tick + dot label formatting)
     height   svg viewBox height (default 460)
   --------------------------------------------------------------------------- */
function LineChart({ series, xLabels, yMax, yStep, yUnit, height }) {
  const [ref, seen] = useInView(0.2);
  const isMobile = useIsMobile();
  const W = 1000, H = height || 460;
  const padL = 64, padR = 26, padT = 26, padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const nx = xLabels.length;
  const X = (i) => padL + (nx === 1 ? 0 : (i / (nx - 1)) * plotW);
  const Y = (v) => padT + (1 - v / yMax) * plotH;

  const yTicks = [];
  for (let v = 0; v <= yMax + 0.0001; v += yStep) yTicks.push(v);
  const fmt = (v) => (yUnit === "usd" ? "$" + (v >= 1000 ? (v / 1000) + "k" : v) : v + "%");

  const linePath = (data) => data.map((v, i) => (i === 0 ? "M" : "L") + X(i) + " " + Y(v)).join(" ");
  const areaPath = (data) =>
    linePath(data) + " L" + X(data.length - 1) + " " + Y(0) + " L" + X(0) + " " + Y(0) + " Z";

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}
        fontFamily="var(--pp-font-display)">
        <defs>
          {series.map((s, si) => s.fill && (
            <linearGradient key={si} id={`area-${si}-${s.color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={si === 0 ? 0.26 : 0.12} />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* y gridlines + labels */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={padL} y1={Y(v)} x2={W - padR} y2={Y(v)} stroke="#1a1a1a" strokeWidth="1" />
            <text x={padL - 14} y={Y(v) + 5} textAnchor="end" fontSize="20" fontWeight="500" fill="#5e5e5e">{fmt(v)}</text>
          </g>
        ))}

        {/* x labels */}
        {xLabels.map((lab, i) => (
          <text key={i} x={X(i)} y={H - padB + 30} textAnchor="middle" fontSize="20" fontWeight="500" fill="#919191">{lab}</text>
        ))}

        {/* areas (behind) */}
        {series.map((s, si) => s.fill && (
          <path key={"a" + si} d={areaPath(s.data)} fill={`url(#area-${si}-${s.color.replace("#", "")})`} />
        ))}

        {/* lines */}
        {series.map((s, si) => (
          <path key={"l" + si} d={linePath(s.data)} fill="none" stroke={s.color}
            strokeWidth={s.dashed ? 2 : (si === 0 ? 3.4 : 2.6)} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={s.dashed ? "2 9" : "none"} />
        ))}

        {/* dots */}
        {series.map((s, si) => !s.dashed && s.data.map((v, i) => (
          <circle key={"d" + si + "-" + i} cx={X(i)} cy={Y(v)} r={si === 0 ? 5 : 4}
            fill="#040404" stroke={s.color} strokeWidth={si === 0 ? 3 : 2.4} />
        )))}
      </svg>

      {/* legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? "12px 20px" : "14px 32px", marginTop: 22, paddingLeft: 4 }}>
        {series.map((s, si) => (
          <div key={si} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 22, height: 0, borderTop: `${s.dashed ? "2px dashed" : "3px solid"} ${s.color}`, display: "inline-block" }} />
            <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 15, color: si === 0 ? "#fafafa" : "var(--pp-fg-2)", letterSpacing: "-.01em" }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- the three program charts ---- */

function RetentionChart() {
  return (
    <LineChart
      yUnit="pct" yMax={100} yStep={25}
      xLabels={["M0", "M1", "M2", "M3", "M4", "M5", "M6"]}
      series={[
        { name: "Aug '25 cohort", color: "#ccff00", data: [100, 70, 62, 56, 51, 52, 49] },
        { name: "Oct '25 cohort", color: "#8fa6c4", data: [100, 68, 55, 51, 44, 45, 43] },
        { name: "Dec '25 cohort", color: "#6f7682", data: [100, 68, 55, 50, 47, 42] },
        { name: "Jan '26 cohort", color: "#4d525c", data: [100, 67, 58, 51, 44] },
      ]}
    />
  );
}

function IncomeChart() {
  return (
    <LineChart
      yUnit="usd" yMax={3000} yStep={1000}
      xLabels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"]}
      series={[
        { name: "200 users", color: "#ccff00", fill: true, data: [254, 733, 1113, 1553, 1849, 2110, 2434, 2713] },
        { name: "100 users", color: "#8fa6c4", fill: true, data: [206, 483, 664, 819, 1074, 1172, 1286, 1377] },
        { name: "50 users", color: "#5e6470", fill: true, data: [81, 180, 372, 486, 566, 642, 694, 732] },
      ]}
    />
  );
}

function RoiChart() {
  return (
    <LineChart
      yUnit="usd" yMax={5000} yStep={1000}
      xLabels={["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"]}
      series={[
        { name: "Optimistic · 300 users", color: "#ccff00", fill: true, data: [391, 1086, 1719, 2413, 3087, 3531, 4053, 4457] },
        { name: "Base · 150 users", color: "#8fa6c4", fill: true, data: [196, 543, 860, 1206, 1543, 1766, 2026, 2229] },
        { name: "Conservative · 50 users", color: "#5e6470", fill: true, data: [65, 181, 287, 402, 514, 589, 675, 743] },
        { name: "Freelance rate · one-off", color: "#e0563f", dashed: true, data: [500, 500, 500, 500, 500, 500, 500, 500] },
      ]}
    />
  );
}

Object.assign(window, { LineChart, RetentionChart, IncomeChart, RoiChart });
