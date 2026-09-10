import React from "react";
import {
  BookOpen,
  Sparkles,
  PenTool,
  Trophy,
  Brain,
  Bot,
  Flame,
  Award,
  ShieldCheck,
  Play,
  ArrowRight,
  Laptop,
  CheckCircle,
} from "lucide-react";
import { UserProfile, StudentProgress } from "../types";
import { MORAL_STORIES, DIGITAL_BADGES } from "../data/learningData";
import { playAudioText } from "../utils/speech";

interface DashboardProps {
  user: UserProfile | null;
  progress: StudentProgress;
  selectedGrade: string;
  language: "hi" | "en";
  soundEnabled: boolean;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenDevices: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  progress,
  selectedGrade,
  language,
  soundEnabled,
  onNavigate,
  onOpenAuth,
  onOpenDevices,
}) => {
  // Moral story of the day
  const dailyStory = MORAL_STORIES[0];

  const handleListenStory = () => {
    if (!soundEnabled) return;
    playAudioText(dailyStory.contentHi, "hi-IN");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>IOIS बाल विकास • {selectedGrade} डिजिटल वर्कबुक</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {language === "hi"
              ? `नमस्ते ${user ? user.name : "प्यारे बच्चे"}! 🌟`
              : `Welcome, ${user ? user.name : "Little Champion"}! 🌟`}
          </h1>

          <p className="text-amber-100 text-xs sm:text-base leading-relaxed">
            {language === "hi"
              ? "आज क्या सीखना चाहेंगे? हिंदी वर्णमाला, Good English, गणित के पहाड़े या सुंदर रंग-बिरंगी ड्रॉइंग!"
              : "What would you like to explore today? Hindi Varnamala, English Phonics, Math, or Creative Drawing!"}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate("hindi")}
              className="px-5 py-2.5 bg-white text-orange-600 font-black rounded-2xl shadow-lg hover:bg-orange-50 active:scale-95 transition-all text-xs sm:text-sm flex items-center gap-2"
            >
              <span>अ से अनार शुरू करें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("drawing")}
              className="px-5 py-2.5 bg-rose-950/40 hover:bg-rose-950/60 border border-white/30 text-white font-bold rounded-2xl active:scale-95 transition-all text-xs sm:text-sm flex items-center gap-2"
            >
              <PenTool className="w-4 h-4" />
              <span>ड्रॉइंग बॉक्स खोलें</span>
            </button>
          </div>
        </div>

        {/* Decorative Watermark / Emojis */}
        <div className="absolute -bottom-6 -right-6 text-9xl opacity-20 pointer-events-none select-none">
          🎨
        </div>
      </div>

      {/* Persistence & Security Status Banner */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                {user ? `यूजर ID: ${user.uniqueId}` : "अतिथि सत्र (Guest Session)"}
              </span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                मल्टी-डिवाइस 4 लॉगिन समर्थित
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user
                ? "आपका सभी डेटा (सीखे गए अक्षर, ड्रॉइंग्स, क्विज़ स्कोर) क्लाउड में सुरक्षित है और कभी डिलीट नहीं होगा।"
                : "कृपया अपनी स्थायी यूनिक आईडी प्राप्त करने के लिए लॉगिन या पंजीकरण करें।"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={onOpenDevices}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>सक्रिय उपकरण ({user.devices?.length || 1} / 4)</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow transition-transform active:scale-95"
            >
              आईडी बनाएं (Register)
            </button>
          )}
        </div>
      </div>

      {/* Student Progress Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate("hindi")}
          className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">अ</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
              52 वर्णमाला
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-mono block">
            {(progress?.hindiLettersLearned || []).length}
          </span>
          <span className="text-xs text-slate-500 font-semibold block">सीखे गए हिंदी अक्षर</span>
        </div>

        <div
          onClick={() => onNavigate("english")}
          className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-serif">Aa</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
              26 Letters
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-mono block">
            {(progress?.englishLettersLearned || []).length}
          </span>
          <span className="text-xs text-slate-500 font-semibold block">Good English Alphabets</span>
        </div>

        <div
          onClick={() => onNavigate("drawing")}
          className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🎨</span>
            <span className="text-xs font-bold text-pink-600 bg-pink-50 dark:bg-pink-950 px-2 py-0.5 rounded-full">
              गैलरी
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-mono block">
            {progress?.drawingsCount || 0}
          </span>
          <span className="text-xs text-slate-500 font-semibold block">सहेजी गई कलाकृतियाँ</span>
        </div>

        <div
          onClick={() => onNavigate("quiz")}
          className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-yellow-400 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🏆</span>
            <span className="text-xs font-bold text-yellow-700 bg-yellow-50 dark:bg-yellow-950 px-2 py-0.5 rounded-full">
              बैज
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-mono block">
            {(progress?.badgesUnlocked || []).length} / {DIGITAL_BADGES.length}
          </span>
          <span className="text-xs text-slate-500 font-semibold block">अर्जित डिजिटल मेडल</span>
        </div>
      </div>

      {/* Feature Exploration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Hindi & Manohar Pothi */}
        <div
          onClick={() => onNavigate("hindi")}
          className="group p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl border border-amber-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-xl cursor-pointer transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl font-black shadow-md group-hover:scale-110 transition-transform">
            अ
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
            हिंदी (मनोहर पोथी & कमल)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            स्वर, व्यंजन, मात्रा ज्ञान, बारहखड़ी एवं दो-तीन अक्षर के सरल शब्दों का सचित्र अभ्यास।
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>वर्णमाला सीखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Card 2: Good English */}
        <div
          onClick={() => onNavigate("english")}
          className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl border border-blue-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-xl cursor-pointer transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-md group-hover:scale-110 transition-transform font-serif">
            Aa
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
            Good English (A to Z)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            PDF पृष्ठ 1 से 27 का संपूर्ण कोर्स: फोनिक्स ध्वनि, ट्रेसिंग एवं दो सचित्र उदाहरण प्रति अक्षर।
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
            <span>A to Z पढ़ें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Card 3: Mathematics 1-100 */}
        <div
          onClick={() => onNavigate("math")}
          className="group p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl border border-purple-200 dark:border-slate-700 hover:border-purple-400 hover:shadow-xl cursor-pointer transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl font-black shadow-md group-hover:scale-110 transition-transform">
            123
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
            गणित: 1 से 100 गिनती & पहाड़े
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            1 से 20 तक पहाड़े, सचित्र जोड़-घटाव, उम्र व प्रतिशत कैलकुलेटर (PDF पेज 42)।
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
            <span>गिनती व पहाड़े देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Special Highlights: PDF Kit & Services Portal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PDF Kit 48 Pages Card */}
        <div
          onClick={() => onNavigate("pdf_viewer")}
          className="group p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl border border-emerald-200 dark:border-slate-700 hover:border-emerald-400 hover:shadow-xl cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-md group-hover:scale-110 transition-transform">
              📑
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
              48 पृष्ठ संपूर्ण किट
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
            बाल विकास 48-पृष्ठ डिजिटल किट (NCERT)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            मनोहर पोथी, गुड इंग्लिश, भारत की प्रतिज्ञा एवं अभ्यास पृष्ठ (पृष्ठ 1-5 फ्री, 6-48 सदस्य अनलॉक)।
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>PDF किट खोलें व पढ़ें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* IOIS Services Portal Card */}
        <div
          onClick={() => onNavigate("services")}
          className="group p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl border border-amber-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-xl cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl font-black shadow-md group-hover:scale-110 transition-transform">
              🌐
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[11px]">
              लाइव सेवाएं
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
            IOIS डिजिटल सेवा पोर्टल (Services)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            RTPS बिहार, दाखिल खारिज, मौसम, समाचार टीवी एवं जनोपयोगी सेवाएं • एडमिन द्वारा नियंत्रित।
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>सेवा पोर्टल देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Story of the Day & AI Chatbot Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Story of the Day (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full">
              आज की रोचक कहानी
            </span>
            <button
              onClick={handleListenStory}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <Play className="w-3.5 h-3.5" />
              <span>कहानी सुनें</span>
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{dailyStory.emoji}</span>
              <span>{dailyStory.titleHi}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
              {dailyStory.contentHi}
            </p>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
              💡 {dailyStory.moralHi}
            </span>
            <button
              onClick={() => onNavigate("stories")}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              सभी कहानियाँ →
            </button>
          </div>
        </div>

        {/* Bal Guru AI Shortcut (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-amber-950 p-6 rounded-3xl text-white shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-2xl flex items-center justify-center">
                🤖
              </span>
              <div>
                <h3 className="text-lg font-black text-amber-400">बाल गुरु AI शिक्षक</h3>
                <p className="text-xs text-slate-300">24x7 आपका पर्सनल AI स्टडी बडी</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              "7 का पहाड़ा सुनाओ", "अनार पर कविता बताओ", या कोई भी पहेली पूछें — बाल गुरु बोलकर समझाएंगे!
            </p>
          </div>

          <button
            onClick={() => onNavigate("chatbot")}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>बाल गुरु से बात करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
