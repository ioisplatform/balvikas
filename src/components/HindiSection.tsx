import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  Sparkles,
  Search,
  PenTool,
  RotateCcw,
  BookOpen,
  CheckCircle,
  Play,
  Pause,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { HINDI_VARNAMALA, MORAL_STORIES } from "../data/learningData";
import { VarnamalaItem } from "../types";
import { playAudioText, stopAudioText } from "../utils/speech";

interface HindiSectionProps {
  language: "hi" | "en";
  soundEnabled: boolean;
  onLetterLearned?: (letter: string) => void;
}

export const HindiSection: React.FC<HindiSectionProps> = ({
  language,
  soundEnabled,
  onLetterLearned,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"varnamala" | "matra" | "words" | "barakhadi" | "stories">("varnamala");
  const [filterType, setFilterType] = useState<"all" | "swar" | "vyanjan">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<VarnamalaItem | null>(HINDI_VARNAMALA[0]);

  // Tracing Canvas state inside modal/view
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Barakhadi state
  const [selectedBarakhadiConsonant, setSelectedBarakhadiConsonant] = useState("क");

  // Story player
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [isPlayingStory, setIsPlayingStory] = useState(false);

  // Filter letters
  const filteredLetters = HINDI_VARNAMALA.filter((item) => {
    const matchesFilter = filterType === "all" || item.type === filterType;
    const matchesSearch =
      item.letter.includes(searchQuery) ||
      item.example1.word.includes(searchQuery) ||
      item.example1.english.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle letter speech
  const handleSpeak = (text: string) => {
    if (!soundEnabled) return;
    playAudioText(text, "hi-IN");
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#F59E0B"; // Amber drawing stroke
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Redraw guide letter in canvas background when letter changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedLetter) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw dotted watermark letter for kids to trace
    ctx.font = "bold 160px Noto Sans Devanagari, sans-serif";
    ctx.fillStyle = "#E2E8F0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(selectedLetter.letter, canvas.width / 2, canvas.height / 2 + 10);
  }, [selectedLetter, activeSubTab]);

  // Story narration toggle
  const toggleStoryPlay = () => {
    if (isPlayingStory) {
      stopAudioText();
      setIsPlayingStory(false);
    } else {
      setIsPlayingStory(true);
      const story = MORAL_STORIES[activeStoryIdx];
      playAudioText(story.contentHi, "hi-IN");
    }
  };

  // Matras Data (कमल हिंदी & मनोहर पोथी)
  const MATRAS_DATA = [
    { sign: "ा", name: "आ की मात्रा", example: "क + ा = का (कार, आम)", emoji: "🚗" },
    { sign: "ि", name: "इ की मात्रा (छोटी इ)", example: "क + ि = कि (किताब, किसान)", emoji: "📖" },
    { sign: "ी", name: "ई की मात्रा (बड़ी ई)", example: "क + ी = की (कील, चीता)", emoji: "🐆" },
    { sign: "ु", name: "उ की मात्रा (छोटा उ)", example: "क + ु = कु (कुर्ता, गुलाब)", emoji: "🌹" },
    { sign: "ू", name: "ऊ की मात्रा (बड़ा ऊ)", example: "क + ू = कू (कूदना, भालू)", emoji: "🐻" },
    { sign: "ृ", name: "ऋ की मात्रा", example: "क + ृ = कृ (कृषक, वृक्ष)", emoji: "🌳" },
    { sign: "े", name: "ए की मात्रा", example: "क + े = के (केला, सेब)", emoji: "🍌" },
    { sign: "ै", name: "ऐ की मात्रा", example: "क + ै = कै (कैमरा, बैल)", emoji: "📷" },
    { sign: "ो", name: "ओ की मात्रा", example: "क + ो = को (कोयल, तोता)", emoji: "🦜" },
    { sign: "ौ", name: "औ की मात्रा", example: "क + ौ = कौ (कौआ, नौका)", emoji: "🦅" },
    { sign: "ं", name: "अं की बिंदी (अनुस्वार)", example: "क + ं = कं (कंगन, पतंग)", emoji: "🪁" },
    { sign: "ः", name: "अः (विसर्ग)", example: "प्रातः, नमः", emoji: "🌅" },
  ];

  // Manohar Pothi Words by length
  const WORDS_DATA = {
    twoLetters: [
      { word: "घर", meaning: "House", emoji: "🏠" },
      { word: "जल", meaning: "Water", emoji: "💧" },
      { word: "फल", meaning: "Fruit", emoji: "🍎" },
      { word: "नल", meaning: "Tap", emoji: "🚰" },
      { word: "बस", meaning: "Bus", emoji: "🚌" },
      { word: "रथ", meaning: "Chariot", emoji: "🐎" },
      { word: "खत", meaning: "Letter", emoji: "✉️" },
      { word: "गज", meaning: "Elephant", emoji: "🐘" },
    ],
    threeLetters: [
      { word: "कमल", meaning: "Lotus", emoji: "🪷" },
      { word: "मटर", meaning: "Peas", emoji: "🫛" },
      { word: "कलम", meaning: "Pen", emoji: "✒️" },
      { word: "सड़क", meaning: "Road", emoji: "🛣️" },
      { word: "बटन", meaning: "Button", emoji: "🔘" },
      { word: "भवन", meaning: "Building", emoji: "🏛️" },
      { word: "मगर", meaning: "Crocodile", emoji: "🐊" },
      { word: "शहद", meaning: "Honey", emoji: "🍯" },
    ],
    fourLetters: [
      { word: "अचकन", meaning: "Coat", emoji: "🧥" },
      { word: "बरगद", meaning: "Banyan Tree", emoji: "🌳" },
      { word: "कसरत", meaning: "Exercise", emoji: "🤸" },
      { word: "पनघट", meaning: "Water Well", emoji: "🪣" },
      { word: "थरमस", meaning: "Flask", emoji: "🍶" },
      { word: "शरबत", meaning: "Juice", emoji: "🥤" },
      { word: "खटमल", meaning: "Bedbug", emoji: "🪲" },
      { word: "शलजम", meaning: "Turnip", emoji: "🧅" },
    ],
  };

  // Compute Barakhadi for chosen consonant
  const getBarakhadi = (consonant: string) => {
    const matraList = [
      { text: consonant, sound: `${consonant}` },
      { text: `${consonant}ा`, sound: `${consonant}ा` },
      { text: `${consonant}ि`, sound: `${consonant}ि` },
      { text: `${consonant}ी`, sound: `${consonant}ी` },
      { text: `${consonant}ु`, sound: `${consonant}ु` },
      { text: `${consonant}ू`, sound: `${consonant}ू` },
      { text: `${consonant}े`, sound: `${consonant}े` },
      { text: `${consonant}ै`, sound: `${consonant}ै` },
      { text: `${consonant}ो`, sound: `${consonant}ो` },
      { text: `${consonant}ौ`, sound: `${consonant}ौ` },
      { text: `${consonant}ं`, sound: `${consonant}ं` },
      { text: `${consonant}ः`, sound: `${consonant}ः` },
    ];
    return matraList;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              मनोहर पोथी & कमल हिंदी
            </span>
            <span className="bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-full text-xs font-extrabold">
              52+ वर्णमाला पृष्ठ
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            हिंदी सीखें: स्वर, व्यंजन और मनोहर पोथी
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1.5 max-w-xl">
            अ से अनार, क से कमल, बारहखड़ी, दो-तीन अक्षर के शब्द और सचित्र रोचक कहानियाँ!
          </p>
        </div>

        {/* Sub-Nav Pill Buttons */}
        <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
          <button
            onClick={() => setActiveSubTab("varnamala")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === "varnamala" ? "bg-white text-orange-600 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            वर्णमाला (52+)
          </button>
          <button
            onClick={() => setActiveSubTab("matra")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === "matra" ? "bg-white text-orange-600 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            मात्रा ज्ञान
          </button>
          <button
            onClick={() => setActiveSubTab("words")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === "words" ? "bg-white text-orange-600 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            शब्द रचना
          </button>
          <button
            onClick={() => setActiveSubTab("barakhadi")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === "barakhadi" ? "bg-white text-orange-600 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            बारहखड़ी
          </button>
          <button
            onClick={() => setActiveSubTab("stories")}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === "stories" ? "bg-white text-orange-600 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            बाल कहानियाँ
          </button>
        </div>
      </div>

      {/* 1. VARNAMALA TAB (52+ Letters) */}
      {activeSubTab === "varnamala" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Letter Selector & Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterType === "all"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  सभी (52)
                </button>
                <button
                  onClick={() => setFilterType("swar")}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterType === "swar"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  स्वर (13)
                </button>
                <button
                  onClick={() => setFilterType("vyanjan")}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterType === "vyanjan"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  व्यंजन (39)
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="खोजें (क, अनार...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* 52 Letters Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredLetters.map((item) => {
                const isSelected = selectedLetter?.letter === item.letter;
                return (
                  <button
                    key={item.letter}
                    onClick={() => {
                      setSelectedLetter(item);
                      handleSpeak(`${item.letter} से ${item.example1.word}`);
                      onLetterLearned?.(item.letter);
                    }}
                    className={`aspect-square p-2 rounded-2xl border transition-all flex flex-col items-center justify-between text-center relative group ${
                      isSelected
                        ? "bg-gradient-to-b from-amber-500 to-orange-500 text-white border-amber-600 shadow-lg scale-105 z-10"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-md"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl font-extrabold">{item.letter}</span>
                    <span className="text-lg leading-none">{item.example1.emoji}</span>
                    <span
                      className={`text-[10px] font-bold truncate max-w-full ${
                        isSelected ? "text-amber-100" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.example1.word}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Letter Slide & Tracing Canvas (5 cols) */}
          {selectedLetter && (
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-amber-200 dark:border-slate-700 shadow-lg flex flex-col justify-between space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                    {selectedLetter.type === "swar" ? "स्वर वर्ण" : "व्यंजन वर्ण"}
                  </span>
                  <span className="text-xs text-slate-400">उच्चारण: /{selectedLetter.transliteration}/</span>
                </div>
                <button
                  onClick={() => handleSpeak(`${selectedLetter.letter} से ${selectedLetter.example1.word}`)}
                  className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-transform active:scale-95 flex items-center gap-1 text-xs font-bold"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>सुने</span>
                </button>
              </div>

              {/* Tracing Canvas with Watermark */}
              <div className="relative bg-amber-50/50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-amber-300 dark:border-slate-700 overflow-hidden flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={220}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="touch-none cursor-crosshair w-full h-[220px]"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button
                    onClick={clearCanvas}
                    title="Clear Tracing"
                    className="p-1.5 bg-white/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold shadow-sm hover:bg-white flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>मिटाएं</span>
                  </button>
                </div>
                <span className="absolute bottom-2 left-3 text-[10px] text-amber-700 dark:text-amber-400 font-semibold pointer-events-none">
                  ✏️ उंगली या माउस से अक्षर पर चलाएं (Trace the letter)
                </span>
              </div>

              {/* Two Examples (कमल हिंदी स्टाइल) */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => handleSpeak(selectedLetter.example1.word)}
                  className="p-3 bg-amber-50 dark:bg-slate-900/60 rounded-2xl border border-amber-200 dark:border-slate-700 hover:border-amber-400 cursor-pointer transition-all flex items-center gap-3"
                >
                  <span className="text-3xl">{selectedLetter.example1.emoji}</span>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                      {selectedLetter.example1.word}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedLetter.example1.english}
                    </p>
                  </div>
                </div>

                {selectedLetter.example2 && (
                  <div
                    onClick={() => handleSpeak(selectedLetter.example2!.word)}
                    className="p-3 bg-amber-50 dark:bg-slate-900/60 rounded-2xl border border-amber-200 dark:border-slate-700 hover:border-amber-400 cursor-pointer transition-all flex items-center gap-3"
                  >
                    <span className="text-3xl">{selectedLetter.example2.emoji}</span>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                        {selectedLetter.example2.word}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedLetter.example2.english}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mini Quick Practice */}
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>क्या आपने '{selectedLetter.letter}' लिख लिया?</span>
                </div>
                <button
                  onClick={() => {
                    handleSpeak(`शाबाश! आपने ${selectedLetter.letter} सीख लिया है।`);
                    onLetterLearned?.(selectedLetter.letter);
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm text-xs transition-transform active:scale-95"
                >
                  हाँ, सीख लिया ⭐
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. MATRA GYAN TAB (मात्रा ज्ञान) */}
      {activeSubTab === "matra" && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-slate-700">
            <h3 className="font-extrabold text-base text-amber-900 dark:text-amber-300">
              कमल हिंदी: संपूर्ण 12 मात्रा ज्ञान
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              मात्राएं व्यंजनों के साथ मिलकर शब्द बनाती हैं। किसी भी मात्रा पर क्लिक करके उच्चारण सुनें।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MATRAS_DATA.map((m, idx) => (
              <div
                key={idx}
                onClick={() => handleSpeak(`${m.name}, जैसे ${m.example}`)}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black text-2xl flex items-center justify-center shadow-sm">
                    {m.sign}
                  </span>
                  <span className="text-2xl">{m.emoji}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-amber-600">
                    {m.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.example}</p>
                </div>
                <div className="pt-2 flex items-center text-[11px] text-amber-600 dark:text-amber-400 font-bold gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>सुनने के लिए टैप करें</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SHABD RACHNA TAB (मनोहर पोथी 2, 3, 4 अक्षर के शब्द) */}
      {activeSubTab === "words" && (
        <div className="space-y-6">
          {/* Two letter words */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-extrabold text-base text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <span className="w-2 h-5 bg-amber-500 rounded-full"></span>
              <span>दो अक्षर वाले शब्द (Two-Letter Words)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {WORDS_DATA.twoLetters.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSpeak(item.word)}
                  className="p-3 bg-amber-50/70 dark:bg-slate-900/60 rounded-2xl border border-amber-200 dark:border-slate-700 hover:border-amber-400 cursor-pointer text-center transition-all hover:scale-105"
                >
                  <span className="text-2xl block mb-1">{item.emoji}</span>
                  <span className="font-black text-xl text-slate-800 dark:text-slate-100 block">
                    {item.word}
                  </span>
                  <span className="text-[10px] text-slate-500">{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Three letter words */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-extrabold text-base text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <span className="w-2 h-5 bg-rose-500 rounded-full"></span>
              <span>तीन अक्षर वाले शब्द (Three-Letter Words)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {WORDS_DATA.threeLetters.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSpeak(item.word)}
                  className="p-3 bg-rose-50/70 dark:bg-slate-900/60 rounded-2xl border border-rose-200 dark:border-slate-700 hover:border-rose-400 cursor-pointer text-center transition-all hover:scale-105"
                >
                  <span className="text-2xl block mb-1">{item.emoji}</span>
                  <span className="font-black text-xl text-slate-800 dark:text-slate-100 block">
                    {item.word}
                  </span>
                  <span className="text-[10px] text-slate-500">{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Four letter words */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-extrabold text-base text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-5 bg-emerald-500 rounded-full"></span>
              <span>चार अक्षर वाले शब्द (Four-Letter Words)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {WORDS_DATA.fourLetters.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSpeak(item.word)}
                  className="p-3 bg-emerald-50/70 dark:bg-slate-900/60 rounded-2xl border border-emerald-200 dark:border-slate-700 hover:border-emerald-400 cursor-pointer text-center transition-all hover:scale-105"
                >
                  <span className="text-2xl block mb-1">{item.emoji}</span>
                  <span className="font-black text-lg text-slate-800 dark:text-slate-100 block">
                    {item.word}
                  </span>
                  <span className="text-[10px] text-slate-500">{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. BARAKHADI TAB */}
      {activeSubTab === "barakhadi" && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                  हिंदी बारहखड़ी चार्ट (Barakhadi)
                </h3>
                <p className="text-xs text-slate-500">व्यंजन चुनें और उसकी संपूर्ण 12 ध्वनियों का अभ्यास करें।</p>
              </div>

              {/* Quick Consonant Selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {["क", "ख", "ग", "घ", "च", "छ", "ज", "ट", "त", "द", "प", "म", "र", "ल", "स", "ह"].map((char) => (
                  <button
                    key={char}
                    onClick={() => {
                      setSelectedBarakhadiConsonant(char);
                      handleSpeak(char);
                    }}
                    className={`w-8 h-8 rounded-xl font-extrabold text-sm transition-all ${
                      selectedBarakhadiConsonant === char
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Barakhadi Cards for Selected Consonant */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-3">
              {getBarakhadi(selectedBarakhadiConsonant).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSpeak(item.sound)}
                  className="p-4 bg-amber-50/60 dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-slate-700 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all text-center group"
                >
                  <span className="font-black text-3xl text-amber-600 dark:text-amber-400 group-hover:scale-110 block transition-transform">
                    {item.text}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center justify-center gap-1">
                    <Volume2 className="w-3 h-3 text-amber-500" />
                    <span>सुनें</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. BAL KAHANIYAN TAB */}
      {activeSubTab === "stories" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MORAL_STORIES.map((story, idx) => {
              const isActive = activeStoryIdx === idx;
              return (
                <div
                  key={story.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    isActive
                      ? "bg-white dark:bg-slate-800 border-amber-400 shadow-xl"
                      : "bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{story.emoji}</span>
                    <button
                      onClick={() => {
                        setActiveStoryIdx(idx);
                        toggleStoryPlay();
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      {isActive && isPlayingStory ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isActive && isPlayingStory ? "विराम (Pause)" : "कहानी सुनें"}</span>
                    </button>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 mb-2">
                    {story.titleHi}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                    {story.contentHi}
                  </p>

                  <div className="mt-4 p-3 bg-amber-50 dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                      {story.moralHi}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
