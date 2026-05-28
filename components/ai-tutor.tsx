"use client";

import { useChat } from "@ai-sdk/react";
import { Bot, Send, X, Minimize2, Maximize2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CourseModule } from "@/types";

interface AITutorProps {
  module?: CourseModule;
  initialQuestion?: string;
  onClose?: () => void;
  inline?: boolean;
}

export function AITutor({ module: mod, initialQuestion, onClose, inline = false }: AITutorProps) {
  const [minimized, setMinimized] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const courseContext = mod
    ? {
        title: mod.title,
        subject: mod.subject ?? "électronique",
        summary: mod.summary,
        formulas: mod.formulaDetails?.map((f) => `${f.expr} (${f.use})`) ?? mod.formulas,
        notions: mod.notions,
      }
    : undefined;

  const { messages, input, handleInputChange, handleSubmit, status, error, setInput } = useChat({
    api: "/api/chat",
    body: { courseContext },
    id: mod?.id ?? "general",
    initialMessages: [],
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (initialQuestion && messages.length === 0) {
      setInput(initialQuestion);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [initialQuestion, messages.length, setInput]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (error && (error.message?.includes("API_KEY") || error.message?.includes("API key"))) {
      setHasApiKey(false);
    }
  }, [error]);

  const containerClass = inline
    ? "flex flex-col h-[520px] rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f1a]/95 backdrop-blur-sm shadow-2xl"
    : `fixed bottom-6 right-6 z-50 w-[380px] rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f1a]/95 backdrop-blur-sm shadow-2xl transition-all duration-300 ${minimized ? "h-[60px]" : "h-[520px]"} flex flex-col`;

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-900/60 to-blue-900/60 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm">
            🤖
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">Professeur IA</p>
            {mod && <p className="text-white/50 text-xs mt-0.5 truncate max-w-[200px]">{mod.title}</p>}
          </div>
          {isLoading && (
            <span className="flex gap-1 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {!inline && (
            <button
              onClick={() => setMinimized((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {!minimized && (
        <>
          {/* No API key warning */}
          {!hasApiKey && (
            <div className="mx-3 mt-3 p-3 rounded-xl bg-amber-900/30 border border-amber-500/30 text-amber-300 text-xs">
              ⚠️ Clé Groq non configurée. Ajoute <code className="bg-black/30 px-1 rounded">GROQ_API_KEY</code> dans <code className="bg-black/30 px-1 rounded">.env.local</code> — gratuit sur <strong>console.groq.com</strong>.
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-6">
                <div className="text-4xl">🧑‍🏫</div>
                <p className="text-white/50 text-sm max-w-[260px]">
                  {mod
                    ? `Pose-moi n'importe quelle question sur "${mod.title}"`
                    : "Je suis ton Professeur IA. Pose-moi une question sur l'électronique ou les maths !"}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {(mod
                    ? ["Explique-moi le cours", "Donne-moi un exemple", "C'est quoi la formule ?"]
                    : ["Loi d'Ohm ?", "Qu'est-ce qu'un condensateur ?", "Dérivée de sin ?"]
                  ).map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-violet-900/40 text-violet-300 hover:bg-violet-800/50 border border-violet-700/40 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs mr-2 mt-1 shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-violet-600 text-white rounded-br-sm"
                      : "bg-white/8 text-white/90 rounded-bl-sm border border-white/10"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs mr-2 mt-1">
                  🤖
                </div>
                <div className="px-3 py-2 rounded-2xl bg-white/8 border border-white/10">
                  <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Pose ta question…"
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

/* Floating trigger button */
export function AITutorButton({
  module: mod,
  initialQuestion,
}: {
  module?: CourseModule;
  initialQuestion?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (initialQuestion) setOpen(true);
  }, [initialQuestion]);

  return (
    <>
      {open && (
        <AITutor
          module={mod}
          initialQuestion={initialQuestion}
          onClose={() => setOpen(false)}
        />
      )}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-medium shadow-lg shadow-violet-900/40 hover:shadow-violet-700/50 transition-all hover:scale-105 active:scale-95"
        >
          <Bot size={18} />
          Professeur IA
        </button>
      )}
    </>
  );
}
