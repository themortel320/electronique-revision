"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type FnDef = {
  label: string;
  f: (x: number) => number;
  df: (x: number) => number;
  fStr: string;
  dfStr: string;
};

const presets: FnDef[] = [
  {
    label: "f(x) = x² − 2x",
    fStr: "x² − 2x",
    dfStr: "2x − 2",
    f: (x) => x * x - 2 * x,
    df: (x) => 2 * x - 2,
  },
  {
    label: "f(x) = x³ − 3x",
    fStr: "x³ − 3x",
    dfStr: "3x² − 3",
    f: (x) => x * x * x - 3 * x,
    df: (x) => 3 * x * x - 3,
  },
  {
    label: "f(x) = sin(x)",
    fStr: "sin(x)",
    dfStr: "cos(x)",
    f: (x) => Math.sin(x),
    df: (x) => Math.cos(x),
  },
  {
    label: "f(x) = x² + x − 2",
    fStr: "x² + x − 2",
    dfStr: "2x + 1",
    f: (x) => x * x + x - 2,
    df: (x) => 2 * x + 1,
  },
];

export function DerivativeGraph() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [x0, setX0] = useState(0);

  const preset = presets[presetIdx];
  const STEPS = 120;
  const XMIN = -4;
  const XMAX = 4;

  const xs = useMemo(
    () => Array.from({ length: STEPS + 1 }, (_, i) => XMIN + (i * (XMAX - XMIN)) / STEPS),
    []
  );

  const fValues = useMemo(() => xs.map((x) => preset.f(x)), [xs, preset]);
  const dfValues = useMemo(() => xs.map((x) => preset.df(x)), [xs, preset]);

  const slope = preset.df(x0);
  const y0 = preset.f(x0);
  const tangentValues = useMemo(
    () => xs.map((x) => y0 + slope * (x - x0)),
    [xs, x0, y0, slope]
  );

  const labels = xs.map((x) => x.toFixed(2));

  const data = {
    labels,
    datasets: [
      {
        label: `f(x) = ${preset.fStr}`,
        data: fValues,
        borderColor: "rgb(99,102,241)",
        backgroundColor: "rgba(99,102,241,0.1)",
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
      },
      {
        label: `f′(x) = ${preset.dfStr}`,
        data: dfValues,
        borderColor: "rgb(34,211,238)",
        backgroundColor: "transparent",
        borderWidth: 2,
        pointRadius: 0,
        borderDash: [6, 4],
        tension: 0.4,
        fill: false,
      },
      {
        label: `Tangente en x₀=${x0.toFixed(1)}`,
        data: tangentValues,
        borderColor: "rgb(251,146,60)",
        backgroundColor: "transparent",
        borderWidth: 1.5,
        pointRadius: 0,
        borderDash: [3, 3],
        fill: false,
      },
      {
        label: "Point x₀",
        data: xs.map((x) => (Math.abs(x - x0) < (XMAX - XMIN) / STEPS + 0.01 ? y0 : null)),
        borderColor: "rgb(251,146,60)",
        backgroundColor: "rgb(251,146,60)",
        borderWidth: 0,
        pointRadius: (ctx: { dataIndex: number }) => {
          const x = xs[ctx.dataIndex];
          return Math.abs(x - x0) < (XMAX - XMIN) / STEPS + 0.01 ? 8 : 0;
        },
        pointHoverRadius: 10,
        showLine: false,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.07)" },
        ticks: {
          color: "rgba(255,255,255,0.4)",
          maxTicksLimit: 9,
          callback: (_: unknown, i: number) =>
            i % 15 === 0 ? xs[i]?.toFixed(1) : "",
        },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.07)" },
        ticks: { color: "rgba(255,255,255,0.4)" },
        min: -8,
        max: 8,
      },
    },
    plugins: {
      legend: {
        labels: { color: "rgba(255,255,255,0.7)", boxWidth: 20, padding: 12 },
      },
      tooltip: { enabled: false },
    },
    interaction: { mode: "index" as const, intersect: false },
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-white/60 text-sm">Fonction :</span>
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setPresetIdx(i);
              setX0(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
              i === presetIdx
                ? "bg-violet-600 border-violet-500 text-white"
                : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
            }`}
          >
            {p.fStr}
          </button>
        ))}
      </div>

      <div className="h-[280px]">
        <Line data={data} options={options} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Point de tangente x₀ =</span>
          <span className="text-orange-400 font-mono font-bold">{x0.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={XMIN}
          max={XMAX}
          step={0.05}
          value={x0}
          onChange={(e) => setX0(parseFloat(e.target.value))}
          className="w-full accent-orange-500"
        />
        <div className="flex gap-4 text-sm text-white/50 mt-1">
          <span>f(x₀) = <strong className="text-white/80">{y0.toFixed(3)}</strong></span>
          <span>f′(x₀) = <strong className="text-cyan-400">{slope.toFixed(3)}</strong></span>
          <span className="text-orange-400/80">
            {slope > 0.01 ? "📈 croissante" : slope < -0.01 ? "📉 décroissante" : "⚡ extremum"}
          </span>
        </div>
      </div>
    </div>
  );
}
