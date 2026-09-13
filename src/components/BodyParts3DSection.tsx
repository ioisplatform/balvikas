import React, { useState } from "react";
import {
  Heart,
  Eye,
  Activity,
  Sparkles,
  Volume2,
  ArrowLeft,
  Award,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Zap,
  Smile,
} from "lucide-react";
import { playAudioText } from "../utils/speech";

interface BodyParts3DSectionProps {
  onBackToDashboard?: () => void;
  language?: "hi" | "en";
  soundEnabled?: boolean;
}

interface BodyPartItem {
  id: string;
  nameHi: string;
  nameEn: string;
  phonetics: string;
  category: "head" | "torso" | "limbs" | "internal" | "senses";
  icon: string;
  gradient: string;
  functionHi: string;
  careTipHi: string;
  funFactHi: string;
  hotspot: { x: number; y: number }; // percentage on body silhouette
  svgModel: "brain" | "eye" | "ear" | "nose" | "mouth" | "heart" | "lungs" | "stomach" | "hand" | "leg" | "skeleton";
}

const BODY_PARTS_DATA: BodyPartItem[] = [
  {
    id: "brain",
    nameHi: "सिर व मस्तिष्क",
    nameEn: "Head & Brain",
    phonetics: "हेड एंड ब्रेन",
    category: "head",
    icon: "🧠",
    gradient: "from-purple-500 to-indigo-600",
    functionHi: "सोचने, विचार करने, याद रखने और पूरे शरीर को नियंत्रित करने का मुख्य केंद्र।",
    careTipHi: "रोज 8 घंटे की अच्छी नींद लें और ताजे फल-सब्जियां खाएं।",
    funFactHi: "हमारे दिमाग में लगभग 86 अरब (86 Billion) न्यूरॉन्स होते हैं!",
    hotspot: { x: 50, y: 8 },
    svgModel: "brain",
  },
  {
    id: "eyes",
    nameHi: "आँखें",
    nameEn: "Eyes",
    phonetics: "आइज",
    category: "senses",
    icon: "👀",
    gradient: "from-blue-500 to-cyan-600",
    functionHi: "सुंदर व रंग-बिरंगी दुनिया को देखने और पढ़ने-लिखने का अद्भुत ज्ञानेंद्रिय अंग।",
    careTipHi: "हरी पत्तेदार सब्जियां खाएं और स्क्रीन से उचित दूरी बनाए रखें।",
    funFactHi: "हमारी आंखें एक करोड़ से भी ज्यादा अलग-अलग रंगों में अंतर पहचान सकती हैं!",
    hotspot: { x: 45, y: 13 },
    svgModel: "eye",
  },
  {
    id: "ears",
    nameHi: "कान",
    nameEn: "Ears",
    phonetics: "इयर्स",
    category: "senses",
    icon: "👂",
    gradient: "from-amber-500 to-orange-600",
    functionHi: "मीठी आवाज़ें, संगीत, ज्ञान की बातें सुनने और शरीर का संतुलन बनाए रखने का अंग।",
    careTipHi: "कान में कभी तीली या नुकीली चीज न डालें और तेज आवाज़ से बचें।",
    funFactHi: "मानव शरीर की सबसे छोटी हड्डी (Stapes) हमारे कान के अंदर होती है!",
    hotspot: { x: 38, y: 14 },
    svgModel: "ear",
  },
  {
    id: "nose",
    nameHi: "नाक",
    nameEn: "Nose",
    phonetics: "नोज़",
    category: "senses",
    icon: "👃",
    gradient: "from-rose-500 to-pink-600",
    functionHi: "खुशबू व गंध सूंघने और हवा को छानकर सांस लेने का आवश्यक अंग।",
    careTipHi: "नाक को हमेशा स्वच्छ रखें और धूल-मिट्टी में रुमाल का इस्तेमाल करें।",
    funFactHi: "हमारी नाक लगभग 1 खरब (1 Trillion) प्रकार की अलग-अलग गंध पहचान सकती है!",
    hotspot: { x: 50, y: 16 },
    svgModel: "nose",
  },
  {
    id: "mouth",
    nameHi: "मुँह, जीभ व दाँत",
    nameEn: "Mouth, Tongue & Teeth",
    phonetics: "माउथ, टंग एंड टीथ",
    category: "senses",
    icon: "👄",
    gradient: "from-red-500 to-rose-600",
    functionHi: "भोजन को चबाना, अलग-अलग स्वादों की पहचान करना और स्पष्ट बोलना।",
    careTipHi: "दिन में दो बार (सुबह और रात सोने से पहले) ब्रश अवश्य करें।",
    funFactHi: "जीभ पर लगभग 10,000 स्वाद कलिकाएं (Taste Buds) होती हैं!",
    hotspot: { x: 50, y: 19 },
    svgModel: "mouth",
  },
  {
    id: "heart",
    nameHi: "हृदय / दिल",
    nameEn: "Heart",
    phonetics: "हार्ट",
    category: "internal",
    icon: "❤️",
    gradient: "from-red-600 to-crimson-700",
    functionHi: "दिन-रात 24 घंटे धड़क कर पूरे शरीर में शुद्ध रक्त और ऑक्सीजन की आपूर्ति करना।",
    careTipHi: "रोज व्यायाम करें, खेलकूद करें और जंक फूड खाने से बचें।",
    funFactHi: "एक दिन में हमारा दिल लगभग 1,00,000 बार धड़कता है!",
    hotspot: { x: 53, y: 34 },
    svgModel: "heart",
  },
  {
    id: "lungs",
    nameHi: "फेफड़े",
    nameEn: "Lungs",
    phonetics: "लंग्स",
    category: "internal",
    icon: "🫁",
    gradient: "from-teal-500 to-emerald-600",
    functionHi: "हवा से प्राणवायु (ऑक्सीजन) लेना और हानिकारक कार्बन डाइऑक्साइड को बाहर निकालना।",
    careTipHi: "सुबह की ताजी हवा में प्राणायाम व गहरी सांस लेने का अभ्यास करें।",
    funFactHi: "फेफड़े मानव शरीर का एकमात्र अंग हैं जो पानी पर तैर सकते हैं!",
    hotspot: { x: 47, y: 33 },
    svgModel: "lungs",
  },
  {
    id: "stomach",
    nameHi: "पेट व पाचन तंत्र",
    nameEn: "Stomach",
    phonetics: "स्टमक",
    category: "internal",
    icon: "🥣",
    gradient: "from-amber-600 to-yellow-600",
    functionHi: "खाए हुए भोजन को पचाना और शरीर को दिनभर चुस्त रखने के लिए ऊर्जा बनाना।",
    careTipHi: "खाना खूब चबा-चबा कर खाएं और दिनभर में 8-10 गिलास पानी पिएं।",
    funFactHi: "पेट में भोजन पचाने के लिए शक्तिशाली पाचक रस और एसिड बनते हैं!",
    hotspot: { x: 50, y: 44 },
    svgModel: "stomach",
  },
  {
    id: "hands",
    nameHi: "हाथ व 10 उंगलियां",
    nameEn: "Hands & Fingers",
    phonetics: "हैंड्स एंड फिंगर्स",
    category: "limbs",
    icon: "✋",
    gradient: "from-orange-500 to-amber-600",
    functionHi: "सुंदर लिखना, चित्र बनाना, खिलौने पकड़ना, खाना खाना और ताली बजाना।",
    careTipHi: "खाना खाने से पहले और बाहर से आने के बाद साबुन से हाथ अच्छी तरह धोएं।",
    funFactHi: "हमारी उंगलियों के फिंगरप्रिंट पूरी दुनिया में किसी और से नहीं मिलते!",
    hotspot: { x: 26, y: 48 },
    svgModel: "hand",
  },
  {
    id: "legs",
    nameHi: "घुटने व टांगें",
    nameEn: "Knees & Legs",
    phonetics: "नीज एंड लेग्स",
    category: "limbs",
    icon: "🦵",
    gradient: "from-emerald-500 to-teal-600",
    functionHi: "दौड़ना, चलना, कूदना, नाचना और सीधे खड़े होकर शरीर को सहारा देना।",
    careTipHi: "दूध पिएं जिससे हड्डियां और मांसपेशियां मजबूत रहें।",
    funFactHi: "जांघ की हड्डी (Femur) मानव शरीर की सबसे लंबी और सबसे मजबूत हड्डी होती है!",
    hotspot: { x: 45, y: 72 },
    svgModel: "leg",
  },
];

export const BodyParts3DSection: React.FC<BodyParts3DSectionProps> = ({
  onBackToDashboard,
  language = "hi",
  soundEnabled = true,
}) => {
  const [selectedPart, setSelectedPart] = useState<BodyPartItem>(BODY_PARTS_DATA[0]);
  const [activeTab, setActiveTab] = useState<"explorer" | "quiz">("explorer");

  // Quiz Mode State
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const speakPart = (part: BodyPartItem) => {
    if (soundEnabled) {
      playAudioText(
        `${part.nameHi}! अंग्रेजी में इसे ${part.nameEn} कहते हैं। ${part.functionHi}`,
        "hi-IN"
      );
    }
  };

  const handleQuizAnswer = (answeredPartId: string) => {
    const currentQuestion = BODY_PARTS_DATA[quizIndex % BODY_PARTS_DATA.length];
    if (answeredPartId === currentQuestion.id) {
      setQuizScore((prev) => prev + 1);
      setQuizFeedback("सही उत्तर! बहुत खूब! ⭐⭐⭐⭐⭐");
      if (soundEnabled) {
        playAudioText("शाबाश! बिल्कुल सही जवाब!", "hi-IN");
      }
      setTimeout(() => {
        setQuizFeedback(null);
        setQuizIndex((prev) => prev + 1);
      }, 1500);
    } else {
      setQuizFeedback(`पुनः प्रयास करें! यह ${currentQuestion.nameHi} नहीं है।`);
      if (soundEnabled) {
        playAudioText("गलत जवाब, फिर से कोशिश करो!", "hi-IN");
      }
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="डैशबोर्ड पर वापस जाएं"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                3D ANATOMY LAB
              </span>
              <span className="text-xs text-teal-100 font-bold">मानव शरीर के अद्भुत अंग</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              🫀 3D मानव शरीर रचना व अंग परिचय (Human Anatomy & Body Parts)
            </h1>
            <p className="text-xs text-teal-100 max-w-2xl mt-0.5">
              सिर से लेकर पैर तक: 3D मॉडल देखें, शुद्ध उच्चारण सुनें, कार्य समझें और अंग पहचानो क्विज खेलें!
            </p>
          </div>
        </div>

        {/* Explorer vs Quiz Mode Switch */}
        <div className="flex items-center gap-1.5 bg-white/15 p-1 rounded-2xl border border-white/20">
          <button
            onClick={() => setActiveTab("explorer")}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
              activeTab === "explorer"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-white hover:bg-white/10"
            }`}
          >
            🔍 3D अंग अन्वेषण (Explore)
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
              activeTab === "quiz"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-white hover:bg-white/10"
            }`}
          >
            ❓ अंग पहचानो क्विज (Quiz)
          </button>
        </div>
      </div>

      {/* Mode 1: 3D Body Explorer */}
      {activeTab === "explorer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive 3D Human Silhouette with Hotspot Pins (Col 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-3xl border-2 border-teal-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                मानव शरीर (Tap any body hotspot):
              </span>
              <span className="text-[10px] bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold px-2 py-0.5 rounded-full">
                10 मुख्य अंग
              </span>
            </div>

            {/* Silhouette Canvas Container */}
            <div className="relative w-full h-[450px] bg-gradient-to-b from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-850 rounded-2xl flex items-center justify-center overflow-hidden border border-teal-100 dark:border-slate-700">
              {/* Stylized Human Body SVG Silhouette */}
              <svg
                viewBox="0 0 200 400"
                className="w-48 h-full drop-shadow-md"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Head */}
                <ellipse cx="100" cy="45" rx="22" ry="28" fill="#94a3b8" />
                {/* Neck */}
                <rect x="94" y="70" width="12" height="15" rx="3" fill="#64748b" />
                {/* Torso */}
                <path
                  d="M60 85 Q100 80 140 85 L132 195 Q100 200 68 195 Z"
                  fill="#64748b"
                />
                {/* Left Arm */}
                <path
                  d="M60 85 L35 150 L25 210 L35 215 L48 155 L65 95 Z"
                  fill="#94a3b8"
                />
                {/* Right Arm */}
                <path
                  d="M140 85 L165 150 L175 210 L165 215 L152 155 L135 95 Z"
                  fill="#94a3b8"
                />
                {/* Left Leg */}
                <path
                  d="M72 195 L68 285 L65 375 L80 375 L86 285 L96 195 Z"
                  fill="#475569"
                />
                {/* Right Leg */}
                <path
                  d="M128 195 L132 285 L135 375 L120 375 L114 285 L104 195 Z"
                  fill="#475569"
                />
              </svg>

              {/* Clickable Hotspot Pins */}
              {BODY_PARTS_DATA.map((part) => {
                const isSelected = selectedPart.id === part.id;
                return (
                  <button
                    key={part.id}
                    onClick={() => {
                      setSelectedPart(part);
                      speakPart(part);
                    }}
                    style={{
                      left: `${part.hotspot.x}%`,
                      top: `${part.hotspot.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all ${
                      isSelected ? "scale-125 z-20" : "hover:scale-110 z-10"
                    }`}
                    title={part.nameHi}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-lg transition-transform ${
                        isSelected
                          ? "bg-amber-400 ring-4 ring-amber-300 text-slate-950 font-black animate-pulse"
                          : "bg-white text-slate-800 border-2 border-teal-500 hover:bg-teal-50"
                      }`}
                    >
                      {part.icon}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-center font-bold text-slate-500 dark:text-slate-400">
              💡 शरीर पर बने किसी भी आइकन पर क्लिक करें और उस अंग की जानकारी जानें!
            </p>
          </div>

          {/* Right: Detailed 3D Anatomy Display Card & Audio (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Selected Part Hero 3D Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-teal-200 dark:border-slate-800 shadow-xl overflow-hidden">
              {/* Header Gradient */}
              <div
                className={`p-6 bg-gradient-to-r ${selectedPart.gradient} text-white flex items-center justify-between gap-4`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shadow-inner animate-bounce">
                    {selectedPart.icon}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/25">
                      {selectedPart.nameEn}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black mt-1">
                      {selectedPart.nameHi}
                    </h2>
                    <span className="text-xs text-teal-100 font-bold">
                      उच्चारण: {selectedPart.phonetics}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => speakPart(selectedPart)}
                  className="p-3 bg-white text-slate-900 hover:bg-teal-50 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 font-black text-xs"
                >
                  <Volume2 className="w-5 h-5 text-teal-600" />
                  <span className="hidden sm:inline">आवाज़ सुनें</span>
                </button>
              </div>

              {/* Body Details */}
              <div className="p-6 space-y-5">
                {/* 1. Main Function */}
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>मुख्य कार्य (Main Function):</span>
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                    {selectedPart.functionHi}
                  </p>
                </div>

                {/* 2. Health & Care Tip */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5" />
                    <span>स्वस्थ रहने के नियम (Care Tip):</span>
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                    {selectedPart.careTipHi}
                  </p>
                </div>

                {/* 3. Fun Fact */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>रोचक तथ्य (Did you know?):</span>
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                    {selectedPart.funFactHi}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Grid of All Parts */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="block text-xs font-black text-slate-500 mb-2.5">
                सभी अंगों की सूची (Select any organ):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {BODY_PARTS_DATA.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => {
                      setSelectedPart(part);
                      speakPart(part);
                    }}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      selectedPart.id === part.id
                        ? "bg-teal-500 text-white border-teal-600 shadow font-black scale-105"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 hover:bg-teal-50"
                    }`}
                  >
                    <div className="text-xl mb-0.5">{part.icon}</div>
                    <div className="text-xs truncate">{part.nameHi}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Anatomy Quiz */}
      {activeTab === "quiz" && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-teal-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              प्रश्न #{((quizIndex % BODY_PARTS_DATA.length) + 1)} / {BODY_PARTS_DATA.length}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mt-2">
              अंग पहचानो क्विज! 🌟
            </h2>
            <p className="text-xs text-slate-500">
              स्कोर: {quizScore} सही जवाब
            </p>
          </div>

          {/* Question Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-850 border-2 border-teal-300 dark:border-slate-700 space-y-3">
            <div className="text-4xl">🤔</div>
            <h3 className="text-lg sm:text-xl font-black text-teal-900 dark:text-teal-200">
              &quot;{BODY_PARTS_DATA[quizIndex % BODY_PARTS_DATA.length].functionHi}&quot;
            </h3>
            <p className="text-xs font-bold text-slate-500">
              बताओ, यह किस अंग का काम है?
            </p>
          </div>

          {/* Feedback message */}
          {quizFeedback && (
            <div
              className={`p-3 rounded-2xl font-black text-sm ${
                quizFeedback.includes("सही")
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300 animate-bounce"
                  : "bg-red-100 text-red-900 border border-red-300"
              }`}
            >
              {quizFeedback}
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BODY_PARTS_DATA.slice(0, 6).map((part) => (
              <button
                key={part.id}
                onClick={() => handleQuizAnswer(part.id)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-750 border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-500 transition-all text-center group"
              >
                <div className="text-3xl mb-1 group-hover:scale-125 transition-transform">
                  {part.icon}
                </div>
                <div className="font-black text-sm text-slate-800 dark:text-slate-100">
                  {part.nameHi}
                </div>
                <div className="text-[10px] text-slate-400">{part.nameEn}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
