"use client";

import { setPseudo } from "@/lib/user";
import { Zap } from "lucide-react";
import { FormEvent, useState } from "react";

type Props = {
  onDone: (pseudo: string) => void;
};

export function OnboardingModal({ onDone }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setError(true);
      return;
    }
    setPseudo(trimmed);
    onDone(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="animate-fade-up w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Bienvenue sur ElectroLab</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Entre ton pseudo pour suivre ta progression et apparaître dans le classement.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <input
              autoFocus
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              placeholder="Ton pseudo (ex : ElectroBoss)"
              maxLength={24}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-500 dark:bg-slate-800 ${
                error
                  ? "border-red-400 animate-shake"
                  : "border-slate-300 dark:border-slate-600"
              }`}
            />
            {error && (
              <p className="mt-1 text-xs text-red-500">
                Minimum 2 caractères requis.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 active:scale-95"
          >
            Commencer l'aventure →
          </button>
        </form>
      </div>
    </div>
  );
}
