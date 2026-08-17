import React, { useState, useRef, useEffect } from "react";
import api from "../api/axios";

const QUICK_ACTION_CARDS = [
  { icon: "🚉", label: "Critical Stations", prompt: "Which stations are critical right now?" },
  { icon: "📈", label: "Demand Forecast", prompt: "Predict crowd demand for Rajiv Chowk at 6 PM" },
  { icon: "🚨", label: "Crowd Alerts", prompt: "Show stations at critical congestion levels" },
  { icon: "🚆", label: "Dispatch Frequency", prompt: "Suggest frequency adjustments for Yellow Line" },
  { icon: "📢", label: "Draft Broadcast", prompt: "Draft a bilingual announcement for Kashmere Gate" },
  { icon: "📊", label: "Network Summary", prompt: "Summarize today's network traffic and busiest lines" },
];

export default function AICopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'announcement' | 'handover'
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 **Good evening, Operator.** I'm your **MetroFlow AI Copilot**.\n\nI can analyze station congestion, predict passenger demand, suggest train dispatch headways, or generate bilingual emergency public announcements.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Announcement Generator state
  const [station, setStation] = useState("Rajiv Chowk");
  const [line, setLine] = useState("Blue line");
  const [incidentType, setIncidentType] = useState("Platform Overcrowding");
  const [delayMinutes, setDelayMinutes] = useState(5);
  const [announcementResult, setAnnouncementResult] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Shift Handover state
  const [handoverReport, setHandoverReport] = useState(null);
  const [handoverLoading, setHandoverLoading] = useState(false);
  const [handoverCopied, setHandoverCopied] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryToSend) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || loading) return;

    const userMsg = {
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInputQuery("");
    setLoading(true);

    try {
      const res = await api.post("/copilot/chat", { query: text });

      const aiMsg = {
        sender: "ai",
        text: res.data.response || "No response received.",
        source: res.data.source || "Station Telemetry & AI Model",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Copilot error:", err);
      const errMsg = err.response?.data?.detail || "⚠️ Failed to connect to MetroFlow AI backend. Please verify authentication or log in again.";
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnnouncement = async (e) => {
    e.preventDefault();
    setGenLoading(true);
    setCopied(false);

    try {
      const res = await api.post("/copilot/generate-announcement", {
        station,
        line,
        incident_type: incidentType,
        delay_minutes: Number(delayMinutes)
      });
      setAnnouncementResult(res.data.announcement_text);
    } catch (err) {
      console.error("Announcement Generation error:", err);
      setAnnouncementResult(err.response?.data?.detail || "⚠️ Error generating announcement. Please check backend connection.");
    } finally {
      setGenLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (announcementResult) {
      navigator.clipboard.writeText(announcementResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateHandover = async () => {
    setHandoverLoading(true);
    setHandoverCopied(false);
    try {
      const res = await api.post("/copilot/shift-handover");
      setHandoverReport(res.data.report_markdown);
    } catch (err) {
      console.error("Handover report error:", err);
      setHandoverReport("⚠️ Failed to generate Shift Handover Report. Please check backend connection.");
    } finally {
      setHandoverLoading(false);
    }
  };

  const copyHandoverToClipboard = () => {
    if (handoverReport) {
      navigator.clipboard.writeText(handoverReport);
      setHandoverCopied(true);
      setTimeout(() => setHandoverCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border border-cyan-400/40 text-white font-medium px-4 py-3 rounded-full shadow-2xl shadow-blue-600/30 backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 group"
      >
        <span className="text-xl group-hover:rotate-12 transition-transform">🤖</span>
        <span className="hidden sm:inline font-bold text-sm tracking-wide">AI Copilot</span>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
      </button>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Drawer Container */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-slate-950 text-slate-100 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-l border-slate-800 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Copilot Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg">
                🤖
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base tracking-tight">
                  MetroFlow <span className="text-cyan-400 font-semibold">AI Copilot</span>
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400">Delhi Metro Operations Intelligence</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Segmented Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/70 p-1.5 gap-1 text-xs">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab("announcement")}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              activeTab === "announcement"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            📢 Broadcasts
          </button>
          <button
            onClick={() => setActiveTab("handover")}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              activeTab === "handover"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            📋 Shift Log
          </button>
        </div>

        {/* AI Operations Status Strip */}
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Telemetry Data Connected</span>
          </div>
          <div className="flex items-center gap-3">
            <span>6 Stations</span>
            <span className="text-cyan-400">AI Model Active</span>
          </div>
        </div>

        {/* TAB 1: OPERATIONAL CHAT */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
              
              {/* Network Snapshot Welcome Box (Rendered at top) */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">👋 Good evening, Operator</span>
                  <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                    Control Assistant
                  </span>
                </div>
                <p className="text-slate-300 text-xs">
                  I can analyze station telemetry, predict passenger demand, adjust dispatch headways, or generate public emergency broadcasts.
                </p>

                {/* Network Snapshot Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Network Status</span>
                    <strong className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Operational
                    </strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Highest Demand Hub</span>
                    <strong className="text-cyan-400">Rajiv Chowk</strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Average Crowd</span>
                    <strong className="text-white">220 pax / station</strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Active Risk Alerts</span>
                    <strong className="text-emerald-400">0 Critical</strong>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-4 shadow-xl ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-none"
                        : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none space-y-2"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                        <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1.5">
                          <span>🤖</span> MetroFlow AI
                        </span>
                        {msg.source && (
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {msg.source}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="whitespace-pre-line leading-relaxed font-sans text-xs sm:text-sm">
                      {msg.text}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                    {msg.sender === "user" ? "Operator" : "MetroFlow AI"} • {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Thinking Indicator */}
              {loading && (
                <div className="flex items-center gap-2.5 text-xs text-cyan-400 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 w-max animate-pulse font-mono">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Analyzing station telemetry & neural models...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Cards Grid (Fixed 2-column responsive layout, NO horizontal overflow!) */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block px-1">
                Suggested Operational Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTION_CARDS.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(card.prompt)}
                    disabled={loading}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group disabled:opacity-50 flex items-center gap-2"
                  >
                    <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{card.icon}</span>
                    <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate">
                      {card.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-1.5">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask MetroFlow AI (e.g. 'Predict demand for Rajiv Chowk')..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !inputQuery.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-xs shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 px-1 font-mono">
                Press Enter to send • AI Assisted Operations
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: PUBLIC ANNOUNCEMENT GENERATOR */}
        {activeTab === "announcement" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                <span>📢</span> Public Announcement Generator
              </h4>
              <p className="text-slate-400 text-xs">
                Auto-generate bilingual (English & Hindi) passenger broadcasts tailored for Delhi Metro PA systems.
              </p>
            </div>

            <form onSubmit={handleGenerateAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">Target Station</label>
                <input
                  type="text"
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">Metro Line</label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Blue line">Blue Line</option>
                  <option value="Yellow line">Yellow Line</option>
                  <option value="Red line">Red Line</option>
                  <option value="Magenta line">Magenta Line</option>
                  <option value="Violet line">Violet Line</option>
                  <option value="Orange line">Orange Line (Airport Express)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">Incident / Event Type</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Platform Overcrowding">Platform Overcrowding</option>
                  <option value="Technical Delay">Technical Regulation / Delay</option>
                  <option value="Door Interlock Regulation">Door Interlock Delay</option>
                  <option value="Track Maintenance">Track Maintenance</option>
                  <option value="Extreme Weather Surge">Heavy Rain / Weather Surge</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">Expected Delay (Minutes)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={genLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-bold py-3 rounded-xl text-white shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 text-xs"
              >
                {genLoading ? "Generating Announcement..." : "✨ Generate AI Announcement"}
              </button>
            </form>

            {/* Output */}
            {announcementResult && (
              <div className="bg-slate-900 p-4 rounded-2xl border border-indigo-500/40 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-indigo-400 text-xs">Generated Broadcast Script</span>
                  <button
                    onClick={copyToClipboard}
                    className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {copied ? "✓ Copied!" : "📋 Copy Text"}
                  </button>
                </div>
                <div className="whitespace-pre-line text-slate-200 leading-relaxed font-sans text-xs pt-1">
                  {announcementResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SHIFT HANDOVER LOG */}
        {activeTab === "handover" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                <span>📋</span> Shift Handover & Operations Log
              </h4>
              <p className="text-slate-400 text-xs">
                Auto-generate an executive handover summary for incoming control room managers based on real-time shift telemetry.
              </p>
            </div>

            <button
              onClick={handleGenerateHandover}
              disabled={handoverLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold py-3 rounded-xl text-white shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 text-xs"
            >
              {handoverLoading ? "Generating Shift Log..." : "✨ Generate Shift Handover Report"}
            </button>

            {handoverReport && (
              <div className="bg-slate-900 p-4 rounded-2xl border border-emerald-500/40 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-emerald-400 text-xs">Shift Handover Summary</span>
                  <button
                    onClick={copyHandoverToClipboard}
                    className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {handoverCopied ? "✓ Copied!" : "📋 Copy Report"}
                  </button>
                </div>
                <div className="whitespace-pre-line text-slate-200 leading-relaxed font-mono text-xs overflow-x-auto pt-1">
                  {handoverReport}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

