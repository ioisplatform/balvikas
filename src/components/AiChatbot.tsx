import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  User,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { ChatMessage } from "../types";
import { playAudioText, stopAudioText } from "../utils/speech";

interface AiChatbotProps {
  language: "hi" | "en";
  soundEnabled: boolean;
  selectedGrade: string;
  studentName?: string;
}

// Strip unwanted markdown asterisks, stars, and decorative star symbols
const cleanChatText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\*{2,3}/g, "") // remove ** or ***
    .replace(/^\s*\*\s+/gm, "• ") // replace list asterisk with clean bullet
    .replace(/\*/g, "") // remove any remaining single asterisks
    .replace(/\n{3,}/g, "\n\n") // clean excess newlines
    .trim();
};

export const AiChatbot: React.FC<AiChatbotProps> = ({
  language,
  soundEnabled,
  selectedGrade,
  studentName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text:
        language === "hi"
          ? "नमस्ते प्रिय विद्यार्थी! 🙏 मैं आपका 'बाल गुरु AI' शिक्षक हूँ। आप मुझसे हिंदी वर्णमाला, मनोहर पोथी, अंग्रेजी वर्णमाला, गणित के पहाड़े या कोई भी मजेदार कहानी और पहेली पूछ सकते हैं!"
          : "Hello young learner! 🌟 I am your Bal Guru AI Study Buddy. Ask me anything about Hindi, English, Math, or fun moral stories!",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const SUGGESTED_PROMPTS = [
    "मुझे 7 का पहाड़ा सिखाओ",
    "क से कमल के बारे में एक सुंदर कविता सुनाओ",
    "Class 2 गणित का एक मजेदार सवाल पूछो",
    "The Thirsty Crow की कहानी संक्षेप में बताओ",
    "5 फलों और उनके रंगों के नाम बताओ",
    "एक मजेदार बाल पहेली पूछो",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: "user_" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          studentName,
          classGrade: selectedGrade,
          gradeLevel: selectedGrade,
          language,
        }),
      });

      const data = await res.json();
      const rawReply = data.reply || (language === "hi" 
        ? "शाबाश! आपने बहुत अच्छा सवाल पूछा। क्या आप कोई अन्य विषय सीखना चाहते हैं?" 
        : "Great question! Would you like to learn more topics?");
      const botReply = cleanChatText(rawReply);

      const botMsg: ChatMessage = {
        id: "bot_" + Date.now(),
        role: "model",
        text: botReply,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (soundEnabled) {
        playAudioText(botReply, language === "hi" ? "hi-IN" : "en-US");
      }
    } catch (err: unknown) {
      const errorText =
        err instanceof Error
          ? err.message
          : language === "hi"
          ? "उत्तर प्राप्त करने में असमर्थ। कृपया पुनः प्रयास करें।"
          : "Unable to receive answer. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          role: "model",
          text: `बाल गुरु: ${cleanChatText(errorText)} कृपया एक बार फिर से पूछें!`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    playAudioText(cleanChatText(text), language === "hi" ? "hi-IN" : "en-US");
  };

  const handleClear = () => {
    stopAudioText();
    setMessages([
      {
        id: "welcome_fresh",
        role: "model",
        text: "नमस्ते! नया संवाद शुरू हुआ है। आप क्या पूछना चाहते हैं?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shadow-inner">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">बाल गुरु AI - स्मार्ट शिक्षक</h2>
              <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {selectedGrade}
              </span>
            </div>
            <p className="text-amber-100 text-xs mt-0.5">
              Powered by Gemini 3.8 Flash • प्रश्न पूछें, कहानी सुनें या गणित सीखें!
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="बातचीत साफ करें"
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col h-[520px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === "model";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-sm shadow shrink-0">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm space-y-1.5 shadow-sm leading-relaxed ${
                    isBot
                      ? "bg-slate-100 dark:bg-slate-700/70 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-600"
                      : "bg-amber-500 text-white rounded-tr-none font-medium"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-between gap-3 pt-1 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="flex items-center gap-1 hover:underline font-bold"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>सुने</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs animate-bounce">
                🤖
              </div>
              <span className="font-semibold">बाल गुरु सोच रहे हैं...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700/60 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              <span>सुझाव:</span>
            </span>
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={
              language === "hi"
                ? "बाल गुरु से कुछ भी पूछें (जैसे: '15 का पहाड़ा बताओ')..."
                : "Ask Bal Guru anything..."
            }
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || loading}
            className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white shadow-md transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
