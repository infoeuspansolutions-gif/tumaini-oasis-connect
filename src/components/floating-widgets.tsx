import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-leaf text-primary-foreground shadow-glow animate-pulse-ring"
        aria-label="Open AI assistant"
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[34rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border bg-card shadow-glow"
          >
            <div className="flex items-center justify-between bg-gradient-leaf p-4 text-primary-foreground">
              <div>
                <p className="font-display text-lg leading-none">Tumaini Assistant</p>
                <p className="text-xs opacity-90">Ask anything about your stay</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1 hover:bg-white/15">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              {messages.length === 0 && (
                <div className="rounded-2xl bg-muted p-3 text-muted-foreground">
                  Hi! 🌿 I'm your Tumaini Gardens concierge. Ask me about cottages, events, the pool, directions, or pricing.
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {m.parts.map((p, i) =>
                      p.type === "text" ? (
                        <div key={i} className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-1">
                          <ReactMarkdown>{p.text}</ReactMarkdown>
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              ))}
              {status === "submitted" && (
                <div className="text-xs text-muted-foreground">Thinking…</div>
              )}
            </div>

            <form onSubmit={submit} className="flex gap-2 border-t bg-background p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cottages, events…"
                className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="submit" className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/254759473510?text=Hello%20Tumaini%20Gardens%2C%20I%27d%20like%20to%20enquire%20about%20a%20booking."
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-glow animate-pulse-ring"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor"><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.834 2.7.834.515 0 1.346-.13 1.733-.358.488-.286.84-.97.97-1.482.072-.215.07-.43.13-.65 0-.43-.07-.5-.43-.713-.358-.215-1.92-.93-2.235-.93zM16 26.852a10.846 10.846 0 0 1-5.495-1.49l-3.84 1.225 1.243-3.726a10.83 10.83 0 0 1-1.62-5.717c0-6.005 4.885-10.89 10.89-10.89s10.89 4.885 10.89 10.89c0 6.005-4.885 10.89-10.89 10.89zM16 3.06C8.86 3.06 3.06 8.86 3.06 16c0 2.44.687 4.83 1.987 6.895L2.59 30l7.275-2.32A12.94 12.94 0 0 0 16 28.94c7.14 0 12.94-5.8 12.94-12.94S23.14 3.06 16 3.06z"/></svg>
    </motion.a>
  );
}
