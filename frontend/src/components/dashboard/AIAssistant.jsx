import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  X,
  User,
  Copy,
  RefreshCw,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github.css";

import { chatWithAI } from "../../services/aiService";

const quickPrompts = [
  {
    icon: "🚉",
    text: "Which station is busiest today?",
  },
  {
    icon: "📈",
    text: "Predict congestion",
  },
  {
    icon: "💰",
    text: "Revenue summary",
  },
  {
    icon: "⚙️",
    text: "Operational recommendations",
  },
];

// Helper: normalize whatever chatWithAI returns into plain text
const extractReplyText = (response) => {
  if (typeof response === "string") return response;
  return (
    response?.response ??
    response?.reply ??
    response?.message ??
    "No response received from Gemini."
  );
};

export default function AIAssistant({
  open,
  onClose,
  dashboardContext = {},
}) {
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      role: "assistant",
      text:
        "👋 Hello! I'm the MetroVision AI Assistant.\n\nAsk me anything about passenger flow, congestion, schedules, revenue, operations, or metro analytics.",
      time: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const hasConversation = messages.some(
    (msg) => msg.role === "user"
  );

  /* ============================================
     Auto Scroll
  ============================================ */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* ============================================
     Auto Focus
  ============================================ */

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [open]);

  /* ============================================
     Time Formatter
  ============================================ */

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ============================================
     Copy Message
  ============================================ */

  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error(err);
    }
  };

  /* ============================================
     Regenerate Response
  ============================================ */

  const regenerateResponse = async () => {
    const lastUser = [...messages]
      .reverse()
      .find((m) => m.role === "user");

    if (!lastUser || loading) return;

    setLoading(true);

    try {
      const response = await chatWithAI(
        lastUser.text,
        dashboardContext
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: extractReplyText(response),
          time: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: "❌ Unable to regenerate response.",
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ============================================
     Send Message
  ============================================ */

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const prompt = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: prompt,
        time: new Date(),
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await chatWithAI(
        prompt,
        dashboardContext
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: extractReplyText(response),
          time: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "❌ Unable to connect to MetroVision AI.",
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}

          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
            }}
            className="
              fixed
              right-0
              top-0
              z-50
              flex
              h-screen
              w-full
              max-w-md
              flex-col
              overflow-hidden
              bg-white
              shadow-2xl
            "
          >

            {/* Header */}

            <div className="border-b bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">

                    <Bot size={24} />

                  </div>

                  <div>

                    <h2 className="text-lg font-bold">
                      MetroVision AI
                    </h2>

                    <div className="mt-1 flex items-center gap-2">

                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />

                      <span className="text-xs text-indigo-100">
                        Online • Gemini 3.5 Flash
                      </span>

                    </div>

                  </div>

                </div>

                <button
                  onClick={onClose}
                  className="
                    rounded-lg
                    p-2
                    transition
                    hover:bg-white/20
                  "
                >
                  <X size={20} />
                </button>

              </div>

            </div>

            {/* Chat */}

            <div className="flex-1 overflow-y-auto bg-slate-50 px-5 py-6">

              <div className="space-y-6">

                {!hasConversation ? (

                  <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100">

                      <Bot
                        size={50}
                        className="text-indigo-600"
                      />

                    </div>

                    <h2 className="text-3xl font-bold text-slate-800">
                      Welcome to MetroVision AI
                    </h2>

                    <p className="mt-4 max-w-sm leading-7 text-slate-500">

                      Ask questions about

                      <br />

                      congestion,
                      schedules,
                      revenue,
                      forecasting,
                      passenger trends,
                      or operational analytics.

                    </p>

                    <div className="mt-10 grid w-full max-w-md gap-3">

                      {quickPrompts.map((item) => (

                        <button
                          key={item.text}
                          onClick={() => setInput(item.text)}
                          className="
                            rounded-xl
                            border
                            bg-white
                            px-5
                            py-3
                            text-left
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
                          "
                        >
                          <span className="mr-2">{item.icon}</span>
                          {item.text}
                        </button>

                      ))}

                    </div>

                  </div>

                ) : (

                  <>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`w-full flex flex-col ${
                        msg.role === "user"
                          ? "items-end"
                          : "items-start"
                      }`}
                    >

                      {/* Header */}

                      <div className="mb-2 flex items-center gap-2">

                        {msg.role === "assistant" ? (
                          <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                              <Bot size={15} />
                            </div>

                            <span className="text-sm font-semibold text-slate-700">
                              MetroVision AI
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white">
                              <User size={15} />
                            </div>

                            <span className="text-sm font-semibold text-slate-700">
                              You
                            </span>
                          </>
                        )}

                        <span className="text-xs text-slate-400">
                          {formatTime(msg.time)}
                        </span>

                      </div>

                      {/* Bubble */}

                      <div
                        className={`
                          leading-7
                          rounded-2xl
                          px-5
                          py-4
                          shadow-sm
                          transition-all
                          ${
                            msg.role === "assistant"
                              ? "w-[95%] border border-slate-200 bg-white"
                              : "max-w-[80%] whitespace-pre-wrap bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                          }
                        `}
                      >
                        {msg.role === "assistant" ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              h1: ({ children }) => (
                                <h1 className="mb-3 text-2xl font-bold">
                                  {children}
                                </h1>
                              ),

                              h2: ({ children }) => (
                                <h2 className="mb-3 mt-5 text-xl font-semibold">
                                  {children}
                                </h2>
                              ),

                              h3: ({ children }) => (
                                <h3 className="mb-2 mt-4 text-lg font-semibold">
                                  {children}
                                </h3>
                              ),

                              p: ({ children }) => (
                                <p className="mb-3 leading-7">
                                  {children}
                                </p>
                              ),

                              ul: ({ children }) => (
                                <ul className="mb-3 list-disc space-y-1 pl-5">
                                  {children}
                                </ul>
                              ),

                              ol: ({ children }) => (
                                <ol className="mb-3 list-decimal space-y-1 pl-5">
                                  {children}
                                </ol>
                              ),

                              li: ({ children }) => (
                                <li>{children}</li>
                              ),

                              strong: ({ children }) => (
                                <strong className="font-semibold">
                                  {children}
                                </strong>
                              ),

                              blockquote: ({ children }) => (
                                <blockquote className="my-4 border-l-4 border-indigo-500 bg-indigo-50 px-4 py-2 italic">
                                  {children}
                                </blockquote>
                              ),

                              code({ inline, children, className }) {
                                if (inline) {
                                  return (
                                    <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">
                                      {children}
                                    </code>
                                  );
                                }

                                return (
                                  <pre className="my-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-white">
                                    <code className={className}>
                                      {children}
                                    </code>
                                  </pre>
                                );
                              },

                              table: ({ children }) => (
                                <div className="my-4 overflow-x-auto">
                                  <table className="min-w-full border border-slate-200">
                                    {children}
                                  </table>
                                </div>
                              ),

                              thead: ({ children }) => (
                                <thead className="bg-slate-100">
                                  {children}
                                </thead>
                              ),

                              th: ({ children }) => (
                                <th className="border px-4 py-2 text-left">
                                  {children}
                                </th>
                              ),

                              td: ({ children }) => (
                                <td className="border px-4 py-2">
                                  {children}
                                </td>
                              ),
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        ) : (
                          msg.text
                        )}

                        {/* Actions */}

                        {msg.role === "assistant" && (
                          <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">

                            <button
                              onClick={() => copyMessage(msg.text)}
                              className="
                                rounded-lg
                                p-2
                                text-slate-500
                                transition
                                hover:bg-slate-100
                                hover:text-indigo-600
                              "
                              title="Copy"
                            >
                              <Copy size={16} />
                            </button>

                            <button
                              onClick={regenerateResponse}
                              className="
                                rounded-lg
                                p-2
                                text-slate-500
                                transition
                                hover:bg-slate-100
                                hover:text-indigo-600
                              "
                              title="Regenerate"
                            >
                              <RefreshCw size={16} />
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                ))}

                {/* Animated Typing */}

                {loading && (

                  <div className="flex justify-start">

                    <div className="max-w-xs rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

                      <div className="mb-3 flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                          <Bot size={15} />
                        </div>

                        <span className="font-semibold text-slate-700">
                          MetroVision AI
                        </span>

                      </div>

                      <div className="flex gap-2">

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                          style={{ animationDelay: "0ms" }}
                        />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                          style={{ animationDelay: "200ms" }}
                        />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                          style={{ animationDelay: "400ms" }}
                        />

                      </div>

                      <p className="mt-3 text-sm text-slate-500">
                        Analyzing metro operations...
                      </p>

                    </div>

                  </div>

                )}

                <div ref={messagesEndRef} />

                  </>

                )}

              </div>

            </div>

            {/* Suggestions */}

            <div className="border-t bg-white px-5 py-3">

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Quick Prompts
              </p>

              <div className="flex flex-wrap gap-2">

                {quickPrompts.map((item) => (
                  <button
                    key={item.text}
                    disabled={loading}
                    onClick={() => setInput(item.text)}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-indigo-100
                      bg-indigo-50
                      px-3
                      py-2
                      text-sm
                      text-indigo-700
                      transition
                      hover:bg-indigo-100
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                ))}

              </div>

            </div>

            {/* Input */}

            <div className="border-t bg-white p-4">

              <div className="flex items-end gap-3">

                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  disabled={loading}
                  placeholder="Ask MetroVision AI about congestion, revenue, scheduling..."
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="
                    max-h-40
                    min-h-[52px]
                    flex-1
                    resize-none
                    rounded-2xl
                    border
                    border-slate-300
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-indigo-200
                    disabled:cursor-not-allowed
                    disabled:bg-slate-100
                  "
                />

                <motion.button
                  whileHover={{
                    scale: loading ? 1 : 1.05,
                  }}
                  whileTap={{
                    scale: loading ? 1 : 0.95,
                  }}
                  disabled={loading || !input.trim()}
                  onClick={handleSend}
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-600
                    to-violet-600
                    text-white
                    shadow-lg
                    transition
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  {loading ? (
                    <RefreshCw
                      size={20}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={20} />
                  )}

                </motion.button>

              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">

                <span>
                  Press <strong>Enter</strong> to send •{" "}
                  <strong>Shift + Enter</strong> for a new line
                </span>

                <span>
                  Powered by Gemini
                </span>

              </div>

            </div>

          </motion.div>

        </>

      )}

    </AnimatePresence>
  );
}