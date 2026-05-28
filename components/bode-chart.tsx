"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type FilterType = "low" | "high" | "band";

const FREQS = Array.from({ length: 80 }, (_, i) => 10 ** (i / 16));

function gain_lp(f: number, fc: number) {
  const ratio = f / fc;
  return -20 * Math.log10(Math.sqrt(1 + ratio * ratio));
}
function phase_lp(f: number, fc: number) {
  return (-Math.atan(f / fc) * 180) / Math.PI;
}
function gain_hp(f: number, fc: number) {
  const ratio = fc / f;
  return -20 * Math.log10(Math.sqrt(1 + ratio * ratio));
}
function phase_hp(f: number, fc: number) {
  return (Math.atan(fc / f) * 180) / Math.PI;
}
function gain_bp(f: number, fc: number, bw: number) {
  const Q = fc / bw;
  const r = f / fc;
  return -20 * Math.log10(Math.abs(1 + Q * (r - 1 / r)));
}
function phase_bp(f: number, fc: number, bw: number) {
  const Q = fc / bw;
  const r = f / fc;
  return (-Math.atan(Q * (r - 1 / r)) * 180) / Math.PI;
}

export function BodeChart() {
  const [filterType, setFilterType] = useState<FilterType>("low");
  const [fc, setFc] = useState(1000);
  const [bw, setBw] = useState(500);

  const gains = FREQS.map((f) => {
    if (filterType === "low") return gain_lp(f, fc);
    if (filterType === "high") return gain_hp(f, fc);
    return gain_bp(f, fc, bw);
  });
  const phases = FREQS.map((f) => {
    if (filterType === "low") return phase_lp(f, fc);
    if (filterType === "high") return phase_hp(f, fc);
    return phase_bp(f, fc, bw);
  });

  const labels = FREQS.map((f) => {
    if (f >= 1e6) return `${(f / 1e6).toFixed(1)}M`;
    if (f >= 1e3) return `${(f / 1e3).toFixed(1)}k`;
    return `${f.toFixed(0)}`;
  });

  const gainData = {
    labels,
    datasets: [
      {
        label: "Gain (dB)",
        data: gains,
        borderColor: "rgb(99,102,241)",
        backgroundColor: "rgba(99,102,241,0.1)",
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const phaseData = {
    labels,
    datasets: [
      {
        label: "Phase (°)",
        data: phases,
        borderColor: "rgb(251,146,60)",
        backgroundColor: "transparent",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: {
          color: "rgba(255,255,255,0.4)",
          maxTicksLimit: 10,
          callback: (_: unknown, i: number) => (i % 8 === 0 ? labels[i] : ""),
        },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "rgba(255,255,255,0.4)" },
      },
    },
    plugins: {
      legend: { labels: { color: "rgba(255,255,255,0.7)" } },
      tooltip: {
        callbacks: {
          title: (items: { dataIndex: number }[]) => `f = ${labels[items[0].dataIndex]} Hz`,
        },
      },
    },
  };

  const filterLabels: Record<FilterType, string> = {
    low: "Passe-bas",
    high: "Passe-haut",
    band: "Passe-bande",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-white/60 text-sm">Type :</span>
        {(["low", "high", "band"] as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
              t === filterType
                ? "bg-violet-600 border-violet-500 text-white"
                : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
            }`}
          >
            {filterLabels[t]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="text-white/60 block mb-1">
            Fréquence de coupure : <strong className="text-violet-400">{fc >= 1000 ? `${fc / 1000}kHz` : `${fc}Hz`}</strong>
          </label>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={fc}
            onChange={(e) => setFc(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>
        {filterType === "band" && (
          <div>
            <label className="text-white/60 block mb-1">
              Bande passante : <strong className="text-orange-400">{bw}Hz</strong>
            </label>
            <input
              type="range"
              min={100}
              max={5000}
              step={100}
              value={bw}
              onChange={(e) => setBw(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Diagramme de gain</p>
          <div className="h-[180px]">
            <Line data={gainData} options={{ ...baseOptions, scales: { ...baseOptions.scales, y: { ...baseOptions.scales.y, title: { display: true, text: "dB", color: "rgba(255,255,255,0.4)" } } } }} />
          </div>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Diagramme de phase</p>
          <div className="h-[140px]">
            <Line data={phaseData} options={{ ...baseOptions, scales: { ...baseOptions.scales, y: { ...baseOptions.scales.y, title: { display: true, text: "°", color: "rgba(255,255,255,0.4)" } } } }} />
          </div>
        </div>
      </div>

      <p className="text-xs text-white/30 text-center">
        fc = {fc}Hz — à −3dB, la fréquence de coupure est là où le signal perd la moitié de sa puissance
      </p>
    </div>
  );
}
