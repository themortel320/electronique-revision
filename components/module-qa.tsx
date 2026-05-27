"use client";

import { QAItem } from "@/types";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

type Message = { from: "user" | "bot"; text: string };

function findAnswer(input: string, qa: QAItem[]): string {
  const normalized = input.toLowerCase().trim();
  let best: QAItem | null = null;
  let bestScore = 0;

  for (const item of qa) {
    const score = item.keywords.reduce(
      (acc, kw) => acc + (normalized.includes(kw.toLowerCase()) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (best && bestScore > 0) return best.answer;

  return "Je n'ai pas trouvé de réponse précise à ta question dans ce module. Essaie de reformuler avec des mots-clés comme le nom d'une formule, d'un composant ou d'un concept (ex : « tau », « série », « beta »...).";
}

const SUGGESTIONS = [
  "À quoi sert cette formule ?",
  "Comment calculer ça ?",
  "Explique-moi le principe",
  "C'est quoi le seuil de la diode ?",
];

type Props = {
  qa: QAItem[];
  moduleId: string;
};

export function ModuleQA({ qa, moduleId }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Bonjour ! Pose-moi une question sur ce module — je répondrai sur les formules, les concepts ou les calculs. 💬",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { from: "user", text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const answer = findAnswer(text, qa);
      setMessages((m) => [...m, { from: "bot", text: answer }]);
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 400);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-brand-500" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Assistant de cours
        </p>
      </div>

      {/* Messages */}
      <div
        className="flex max-h-52 flex-col gap-2.5 overflow-y-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"
        key={moduleId}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.from === "bot" ? (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs dark:bg-brand-900">
                <Sparkles className="h-3 w-3 text-brand-600 dark:text-brand-400" />
              </span>
            ) : (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs dark:bg-slate-700">
                👤
              </span>
            )}
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                msg.from === "bot"
                  ? "bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200"
                  : "bg-brand-600 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
              <Sparkles className="h-3 w-3 text-brand-600 dark:text-brand-400" />
            </span>
            <div className="flex gap-1 rounded-xl bg-white px-3 py-2.5 shadow-sm dark:bg-slate-900">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions rapides */}
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.slice(0, 3).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose une question sur ce module…"
          className="w-full rounded-xl border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-500 disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
