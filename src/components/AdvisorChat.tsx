import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Bot, User, Sparkles, AlertCircle, HelpCircle, ArrowRight,
  Globe, CheckCircle2, Bookmark, Flame, ShieldAlert, FileText, Search
} from "lucide-react";
import { formatIndianCurrency } from "../utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ title: string; uri: string }>;
}

export default function AdvisorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Namaste! I am **LIC Mithra**, your Senior Financial & Policy Advisor. 📜✨\n\nI can help you analyze, compare, and optimize all flagship LIC plans like **Jeevan Labh (Plan 736)**, **Jeevan Umang (Plan 945)**, **New Jeevan Anand (Plan 915)**, and child protection plans.\n\nTell me about your age, budget, or family milestones (for example: **'Suggest a plan for Rs 5000 per month'** or **'Tell me which plan has the highest cash maturity'**), and I will calculate the absolute mathematically optimal split for you!"
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const presetQuestions = [
    { label: "Optimal plan for ₹5k/mo", q: "I can save ₹5000 per month. I am 32 years old. Can you suggest the absolute best combination of LIC plans for maximum returns and high life cover?" },
    { label: "Labh vs Umang vs Anand", q: "Compare LIC Jeevan Labh, Jeevan Umang, and New Jeevan Anand. What are the key differences in premium terms and payback structures?" },
    { label: "What is Section 37 Sovereign?", q: "What is Section 37 of the LIC Act 1956? Explain how it provides a 100% government guarantee on sums and bonuses." },
    { label: "Child Education Planner", q: "I have a 3-year-old daughter. I want to save ₹3000 monthly for her future education. Which LIC child plan guarantees safety if something happens to me?" }
  ];

  const handleSendMessage = async (rawQuestion: string) => {
    if (!rawQuestion.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: rawQuestion
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setErrorText(null);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: chatHistory })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to communicate with your AI advisor");
      }

      // Parse grounding sources if they exist
      let extractedSources: Array<{ title: string; uri: string }> = [];
      if (data.searchMetadata?.groundingChunks) {
        extractedSources = data.searchMetadata.groundingChunks
          .map((chunk: any) => ({
            title: chunk.web?.title || "LIC Source Link",
            uri: chunk.web?.uri || ""
          }))
          .filter((chunk: any) => chunk.uri !== "");
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.text,
        sources: extractedSources.length > 0 ? extractedSources : undefined
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Safe simple parser to support basic bold **text** and bullet point lists cleanly
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Check if it's a bullet point
      const isBullet = line.trim().startsWith("•") || line.trim().startsWith("*");
      let cleanLine = isBullet ? line.trim().substring(1).trim() : line;

      // Handle bold text conversion
      const parts = cleanLine.split(/\*\*([\s\S]*?)\*\*/g);
      const parsedElements = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="text-[#003087] font-extrabold">{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={i} className="ml-5 list-disc mt-1.5 text-xs text-slate-700 leading-relaxed font-medium">
            {parsedElements}
          </li>
        );
      }

      if (line.trim() === "") {
        return <div key={i} className="h-2.5" />;
      }

      return (
        <p key={i} className="text-xs text-slate-700 leading-relaxed font-semibold mt-1">
          {parsedElements}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[580px]" id="advisor-interactive-chat">
      
      {/* Advisor Top info bar */}
      <div className="bg-[#003087] p-4 flex items-center justify-between border-b border-[#ffd700] text-white">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#ffd700] p-1.5 rounded text-[#003087] shadow-sm animate-pulse">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-display font-black text-white tracking-wide">
                MITHRA AI ASSISTANT
              </h3>
              <span className="bg-emerald-600 font-sans text-[8.5px] px-1.5 py-0.5 rounded font-extrabold uppercase shadow-sm">
                Active Fact-Check
              </span>
            </div>
            <p className="text-[10px] text-blue-100 font-medium">
              LIC Licensed Senior Wealth Planner with Google Search Grounding
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-sans font-bold bg-[#002466] border border-[#ffd700]/25 px-2.5 py-1 rounded">
          <Search className="w-3.5 h-3.5 text-[#ffd700]" />
          <span className="text-[#ffd700]">Grounding Web Results Active</span>
        </div>
      </div>

      {/* Chat logs scroll area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        
        {messages.map((msg) => {
          const isAI = msg.role === "assistant";
          return (
            <div key={msg.id} className={`flex gap-3 max-w-4xl ${isAI ? "mr-4" : "ml-auto flex-row-reverse mr-0"}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 shadow-sm ${
                isAI ? "bg-[#003087] text-[#ffd700] border border-[#ffd700]/20" : "bg-emerald-600 text-white"
              }`}>
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Bubble Body */}
              <div className="space-y-2">
                <div className={`p-4 rounded border text-xs shadow-3xs ${
                  isAI 
                    ? "bg-white border-slate-200 text-slate-800 rounded-tl-none" 
                    : "bg-[#ffd700]/15 border-yellow-300 text-slate-900 rounded-tr-none"
                }`}>
                  <div className="space-y-1">
                    {renderMessageContent(msg.content)}
                  </div>
                </div>

                {/* Grounding Source cards if present */}
                {isAI && msg.sources && msg.sources.length > 0 && (
                  <div className="p-3 bg-blue-50/50 border border-blue-100/70 rounded-md text-[10.5px] font-sans space-y-1.5 shadow-5xs max-w-lg">
                    <div className="flex items-center gap-1.5 text-[#003087] font-bold">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Google Search Citations (Certified Fact Check):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {msg.sources.slice(0, 3).map((source, idx) => (
                        <a 
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200 p-1 rounded font-semibold text-[#003087] transition-all"
                        >
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[140px]">{source.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 max-w-sm mr-4">
            <div className="w-8 h-8 rounded bg-[#003087] text-[#ffd700] flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-md text-xs shadow-3xs flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.4s]" />
              </span>
              <span className="text-slate-500 font-bold tracking-tight font-mono">Mithra is executing actuarial checks...</span>
            </div>
          </div>
        )}

        {/* Error Handle overlay */}
        {errorText && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-start gap-2.5 max-w-xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-bold">Advisor connection unavailable</p>
              <p className="font-medium text-[11px] mt-0.5 text-rose-700">
                {errorText === "GEMINI_API_KEY environment variable is not defined. Please add it in your Settings > Secrets."
                  ? "Your GEMINI_API_KEY secret is missing. Please click 'Settings' in the top-right menu of your AI Studio, open 'Secrets', and declare GEMINI_API_KEY to test the live chat."
                  : "We could not reach the server-side API. Please verify the Gemini API credentials are properly configured or try again."
                }
              </p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Preset fast prompt selection list */}
      {messages.length === 1 && (
        <div className="p-4 bg-slate-50 border-t border-slate-150">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold mb-2.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#003087]" />
            <span>Select a fast Scenario Prompt:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presetQuestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.q)}
                className="text-left bg-white hover:bg-blue-50/50 p-2.5 rounded border border-slate-200 shadow-5xs group transition-all text-xs font-semibold cursor-pointer"
              >
                <div className="flex items-center justify-between text-slate-800">
                  <span className="text-[11px] text-[#003087] font-extrabold font-sans leading-tight">
                    {item.label}
                  </span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-1">
                  {item.q}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message input panel */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Mithra about ₹2500, ₹3500, ₹5k, ₹10k, ₹12k options..."
          className="flex-1 bg-slate-100 hover:bg-slate-50/80 focus:bg-white text-slate-800 text-xs font-semibold font-sans rounded px-3 py-2.5 border border-slate-200 focus:outline-[#003087]"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-[#003087] text-[#ffd700] p-2.5 rounded hover:bg-blue-900 border border-[#ffd700]/25 shadow-sm shrink-0 flex items-center justify-center transition-colors cursor-pointer"
          disabled={loading || !input.trim()}
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </form>

    </div>
  );
}
