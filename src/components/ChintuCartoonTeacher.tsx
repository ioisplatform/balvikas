import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  HelpCircle,
  Play,
  Award,
  BookOpen,
  Eye,
  PenTool,
  X,
} from "lucide-react";
import { playAudioText } from "../utils/speech";

interface ChintuCartoonTeacherProps {
  currentTab: string;
  currentPageNum?: number;
  studentName?: string;
  soundEnabled: boolean;
  onNavigate?: (tab: string) => void;
}

export const ChintuCartoonTeacher: React.FC<ChintuCartoonTeacherProps> = ({
  currentTab,
  currentPageNum = 1,
  studentName = "दोस्त",
  soundEnabled,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechText, setSpeechText] = useState<string>("");
  const [teacherMood, setTeacherMood] = useState<"happy" | "teaching" | "waving" | "excited">("happy");
  const [hasWelcomed, setHasWelcomed] = useState<boolean>(false);

  // Dynamic Teaching Dialogues based on active tab and page
  useEffect(() => {
    let message = "";
    let mood: "happy" | "teaching" | "waving" | "excited" = "teaching";

    switch (currentTab) {
      case "dashboard":
        message = `नमस्ते ${studentName}! मैं तुम्हारा AI लाइव टीचर चिंटू हूँ! आज हम क्या पढ़ना चाहते हैं? 700+ पृष्ठों की बाल विकास पुस्तक, A to Z पेंसिल वीडियो, या 3D शरीर के अंग?`;
        mood = "waving";
        break;
      case "bal_vikas_pustika":
        message = `शाबाश! यह है बाल विकास की 700+ पृष्ठों की सम्पूर्ण पुस्तक! पृष्ठ ${currentPageNum} को ध्यान से पढ़ो और 🔊 बटन दबाकर शुद्ध उच्चारण सुनो! लिखने के लिए 'डिजिटल स्लेट' बटन दबाना!`;
        mood = "teaching";
        break;
      case "pencil_tracing":
        message = `अरे वाह! यहाँ असली पेंसिल खुद लिखकर सिखाती है! 'प्ले वीडियो कहानी' दबाओ और देखो सेब के अंदर चींटी कैसे घुसती है और पेंसिल कैसे चलती है!`;
        mood = "excited";
        break;
      case "body_parts_3d":
        message = `चलो मानव शरीर के अंगों की 3D दुनिया देखें! किसी भी अंग जैसे आँख, कान, दिल या मस्तिष्क पर क्लिक करो और जानो वह क्या काम करता है!`;
        mood = "teaching";
        break;
      case "alphabet26":
        message = `Good English! A से लेकर Z तक हर अक्षर के 4-4 उदाहरण, कविताएं और चित्र यहाँ हैं। चलो मेरे साथ बोलो!`;
        mood = "happy";
        break;
      case "hindi":
        message = `अ से अनार, आ से आम! हिंदी हमारी मातृभाषा है। हर अक्षर पर क्लिक करो और सुंदर चित्र व आवाज़ सुनो!`;
        mood = "happy";
        break;
      case "math":
        message = `गणित का जादू! 1 से 100 तक गिनती, 2 से 20 तक पहाड़े और जोड़-घटाव खेल-खेल में सीखो!`;
        mood = "excited";
        break;
      case "drawing":
        message = `यह तुम्हारी डिजिटल स्लेट है! मनपसंद रंग चुनो, पेंसिल या ब्रश से जो चाहो बनाओ और डाउनलोड करो!`;
        mood = "happy";
        break;
      case "quiz":
        message = `क्विज का समय! सवालों के सही जवाब दो और 5 स्टार्स व गोल्डन मेडल जीतो!`;
        mood = "excited";
        break;
      default:
        message = `नमस्ते ${studentName}! मैं हर कदम पर तुम्हारी मदद के लिए यहाँ हूँ। कुछ भी पूछना हो तो मुझे बताओ!`;
        mood = "happy";
    }

    setSpeechText(message);
    setTeacherMood(mood);

    // Speak welcome on first landing if sound is enabled
    if (soundEnabled && !hasWelcomed) {
      setHasWelcomed(true);
      speakTeacherVoice(message);
    }
  }, [currentTab, currentPageNum, studentName]);

  // Cheerful High-Pitched Cartoon Kid/Teacher Voice
  const speakTeacherVoice = (text: string) => {
    setIsSpeaking(true);
    setTeacherMood("teaching");

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.rate = 0.95;
      utterance.pitch = 1.35; // friendly cheerful kid tone
      utterance.onend = () => {
        setIsSpeaking(false);
        setTeacherMood("happy");
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setTeacherMood("happy");
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const handleAskHelp = (action: string) => {
    let reply = "";
    switch (action) {
      case "how_to_study":
        reply = "पढ़ाई का सबसे अच्छा तरीका: पहले चित्र देखो, फिर आवाज़ सुनो, और फिर डिजिटल स्लेट पर 3 बार लिखकर अभ्यास करो!";
        break;
      case "learn_a_to_z":
        reply = "चलो! 'A to Z पेंसिल ट्रेसिंग' पर चलते हैं जहाँ चींटी और पेंसिल आपको अक्षर लिखना सिखाएंगे!";
        if (onNavigate) onNavigate("pencil_tracing");
        break;
      case "learn_body_parts":
        reply = "वाह! 3D शरीर के अंगों में आँख, कान, दिल और मस्तिष्क के 3D मॉडल व आवाज़ उपलब्ध हैं!";
        if (onNavigate) onNavigate("body_parts_3d");
        break;
      case "praise_me":
        reply = `शाबाश ${studentName}! तुम बहुत होनहार और मेहनती विद्यार्थी हो! मुझे तुम पर गर्व है! 🌟⭐⭐⭐⭐⭐`;
        break;
      default:
        reply = "आप बहुत अच्छा सीख रहे हैं! आगे बढ़ते रहिए!";
    }
    setSpeechText(reply);
    speakTeacherVoice(reply);
  };

  return (
    <aside aria-label="AI Cartoon Teacher Chintu" className="fixed bottom-4 right-4 z-40 max-w-sm sm:max-w-md select-none">
      {/* Minimized Floating Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            speakTeacherVoice(speechText);
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full shadow-2xl border-2 border-white transition-all transform hover:scale-105 active:scale-95 group"
        >
          {/* Animated Avatar Icon */}
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg animate-bounce">
            👦
          </div>
          <div className="text-left">
            <span className="block text-xs font-black leading-tight">AI टीचर चिंटू</span>
            <span className="text-[10px] text-amber-100 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>सिखाने के लिए तैयार</span>
            </span>
          </div>
        </button>
      )}

      {/* Expanded Interactive Cartoon Teacher Box */}
      {isOpen && (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border-4 border-amber-300 dark:border-amber-700/80 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-sm shadow">
                🎓
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide flex items-center gap-1">
                  <span>चिंटू • AI लाइव कार्टून शिक्षक</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black">
                    LIVE
                  </span>
                </h4>
                <span className="text-[10px] text-amber-100 block">
                  आपका डिजिटल पढ़ाई साथी
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => speakTeacherVoice(speechText)}
                className={`p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors ${
                  isSpeaking ? "bg-emerald-600 animate-pulse" : ""
                }`}
                title="आवाज़ सुनें"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors"
                title="छोटा करें"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Teacher Cartoon Avatar & Dialogue Speech Bubble */}
          <div className="p-3.5 sm:p-4 space-y-3">
            <div className="flex items-start gap-3">
              {/* Animated Cartoon Kid Avatar (SVG) */}
              <div className="relative shrink-0">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-slate-800 dark:to-slate-750 border-2 border-amber-300 dark:border-amber-600 flex items-center justify-center shadow-md overflow-hidden relative ${
                    isSpeaking ? "ring-4 ring-amber-400/50 animate-pulse" : ""
                  }`}
                >
                  {/* Cartoon Kid Graphic with animated mouth & eyes */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Hair */}
                    <path
                      d="M20 40 C 20 18, 80 18, 80 40 C 85 30, 75 10, 50 10 C 25 10, 15 30, 20 40 Z"
                      fill="#261b14"
                    />
                    {/* Student Cap */}
                    <path
                      d="M25 22 L50 8 L75 22 L50 30 Z"
                      fill="#ea580c"
                      stroke="#9a3412"
                      strokeWidth="2"
                    />
                    <circle cx="50" cy="8" r="3" fill="#facc15" />
                    <path d="M50 8 Q65 18 68 28" stroke="#facc15" strokeWidth="2" fill="none" />

                    {/* Face */}
                    <circle cx="50" cy="50" r="28" fill="#fed7aa" />

                    {/* Ears */}
                    <ellipse cx="22" cy="50" rx="4" ry="7" fill="#fed7aa" />
                    <ellipse cx="78" cy="50" rx="4" ry="7" fill="#fed7aa" />

                    {/* Glasses */}
                    <rect
                      x="32"
                      y="42"
                      width="14"
                      height="12"
                      rx="3"
                      fill="rgba(255,255,255,0.4)"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                    />
                    <rect
                      x="54"
                      y="42"
                      width="14"
                      height="12"
                      rx="3"
                      fill="rgba(255,255,255,0.4)"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                    />
                    <line x1="46" y1="48" x2="54" y2="48" stroke="#0284c7" strokeWidth="2.5" />

                    {/* Animated Eyes (Blink) */}
                    <circle cx="39" cy="48" r="3.5" fill="#1e293b" />
                    <circle cx="40.5" cy="46.5" r="1.2" fill="#ffffff" />
                    <circle cx="61" cy="48" r="3.5" fill="#1e293b" />
                    <circle cx="62.5" cy="46.5" r="1.2" fill="#ffffff" />

                    {/* Nose */}
                    <path
                      d="M50 51 Q52 55 48 56"
                      stroke="#ea580c"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    {/* Animated Mouth */}
                    {isSpeaking ? (
                      <ellipse
                        cx="50"
                        cy="64"
                        rx="6"
                        ry="4.5"
                        fill="#991b1b"
                        className="animate-bounce"
                      />
                    ) : (
                      <path
                        d="M44 62 Q50 68 56 62"
                        stroke="#991b1b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    )}

                    {/* Rosy Cheeks */}
                    <circle cx="32" cy="56" r="4" fill="#fca5a5" opacity="0.6" />
                    <circle cx="68" cy="56" r="4" fill="#fca5a5" opacity="0.6" />

                    {/* Uniform Collar */}
                    <path
                      d="M30 78 Q50 88 70 78 L65 100 L35 100 Z"
                      fill="#0284c7"
                    />
                    <path d="M42 78 L50 88 L58 78" fill="#ffffff" />
                    {/* Red Tie */}
                    <polygon points="48,88 52,88 53,98 47,98" fill="#dc2626" />
                  </svg>
                </div>

                {/* Pointer Stick Hand Badge */}
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-md"
                  title="चिंटू का जादुई पॉइंटर"
                >
                  ✨
                </div>
              </div>

              {/* Speech Bubble */}
              <div className="flex-1 bg-amber-50 dark:bg-slate-800 p-3 rounded-2xl border border-amber-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 relative">
                {/* Speech Bubble Arrow */}
                <div className="absolute top-4 -left-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-amber-200 dark:border-r-slate-700 border-b-8 border-b-transparent" />
                <p className="text-xs sm:text-[13px] leading-relaxed font-semibold">
                  {speechText}
                </p>
                {isSpeaking && (
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>चिंटू बोल रहा है...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Interactive Prompts for the Child */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                चिंटू से पूछें (Ask Chintu):
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  onClick={() => handleAskHelp("how_to_study")}
                  className="p-1.5 text-left bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <span>💡</span>
                  <span className="truncate">कैसे पढ़ना है?</span>
                </button>

                <button
                  onClick={() => handleAskHelp("learn_a_to_z")}
                  className="p-1.5 text-left bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <span>✏️</span>
                  <span className="truncate">पेंसिल चलाना सीखें</span>
                </button>

                <button
                  onClick={() => handleAskHelp("learn_body_parts")}
                  className="p-1.5 text-left bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <span>🫀</span>
                  <span className="truncate">3D शरीर के अंग</span>
                </button>

                <button
                  onClick={() => handleAskHelp("praise_me")}
                  className="p-1.5 text-left bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <span>⭐</span>
                  <span className="truncate">मुझे शाबाशी दो!</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
