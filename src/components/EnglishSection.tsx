import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  PenTool,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { ENGLISH_ALPHABET } from "../data/learningData";
import { EnglishAlphabetItem } from "../types";
import { playAudioText } from "../utils/speech";

interface EnglishSectionProps {
  language: "hi" | "en";
  soundEnabled: boolean;
  onLetterLearned?: (letter: string) => void;
  onNavigateToAlphabet26?: () => void;
}

export const EnglishSection: React.FC<EnglishSectionProps> = ({
  language,
  soundEnabled,
  onLetterLearned,
  onNavigateToAlphabet26,
}) => {
  const [activeTab, setActiveTab] = useState<"letters" | "sightWords" | "rhymes">("letters");
  const [selectedLetter, setSelectedLetter] = useState<EnglishAlphabetItem>(ENGLISH_ALPHABET[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tracingMode, setTracingMode] = useState<"upper" | "lower">("upper");

  // Tracing Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Filter letters
  const filteredLetters = ENGLISH_ALPHABET.filter(
    (item) =>
      item.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lowercase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.example1.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpeak = (text: string) => {
    if (!soundEnabled) return;
    playAudioText(text, "en-US");
  };

  // Canvas Drawing
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
    ctx.strokeStyle = "#3B82F6"; // Blue tracing stroke
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

  // Redraw watermark
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedLetter) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 150px sans-serif";
    ctx.fillStyle = "#E2E8F0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const charToDraw = tracingMode === "upper" ? (selectedLetter.upper || selectedLetter.letter) : (selectedLetter.lower || selectedLetter.lowercase);
    ctx.fillText(charToDraw, canvas.width / 2, canvas.height / 2 + 10);
  }, [selectedLetter, tracingMode, activeTab]);

  // Primary Sight words data for Class 1-3
  const SIGHT_WORDS = [
    { word: "the", hindi: "वह", example: "The sun is bright", emoji: "☀️" },
    { word: "and", hindi: "और", example: "Cat and dog", emoji: "🐱" },
    { word: "you", hindi: "आप / तुम", example: "You are smart", emoji: "⭐" },
    { word: "that", hindi: "वह", example: "That is a bird", emoji: "🐦" },
    { word: "with", hindi: "साथ", example: "Play with me", emoji: "🤝" },
    { word: "have", hindi: "पास होना", example: "I have a ball", emoji: "⚽" },
    { word: "this", hindi: "यह", example: "This is an apple", emoji: "🍎" },
    { word: "from", hindi: "से", example: "From India", emoji: "🇮🇳" },
    { word: "good", hindi: "अच्छा", example: "Good morning!", emoji: "🌅" },
    { word: "look", hindi: "देखो", example: "Look at the stars", emoji: "✨" },
    { word: "come", hindi: "आओ", example: "Come here", emoji: "👋" },
    { word: "like", hindi: "पसंद", example: "I like milk", emoji: "🥛" },
  ];

  // Rhyming Words for primary students
  const RHYMING_GROUPS = [
    { family: "-at words", words: ["Cat 🐱", "Bat 🏏", "Rat 🐀", "Hat 🎩", "Mat 🧺"] },
    { family: "-en words", words: ["Pen ✒️", "Hen 🐔", "Ten 🔟", "Men 👥", "Den 🦁"] },
    { family: "-in words", words: ["Pin 📌", "Bin 🗑️", "Tin 🥫", "Win 🏆", "Fin 🦈"] },
    { family: "-og words", words: ["Dog 🐕", "Frog 🐸", "Log 🪵", "Fog 🌫️", "Jog 🏃"] },
    { family: "-un words", words: ["Sun ☀️", "Bun 🍞", "Fun 🎉", "Run 🏃‍♂️", "Gun 🔫"] },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Good English Workbook
            </span>
            <span className="bg-sky-400 text-sky-950 px-2 py-0.5 rounded-full text-xs font-extrabold">
              PDF Pages 1–27 Complete
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Good English: Alphabet A to Z
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1.5 max-w-xl">
            A for Apple, B for Balloon! Phonics sound, audio pronunciation, tracing exercises, and sight words for kids.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
          {onNavigateToAlphabet26 && (
            <button
              onClick={onNavigateToAlphabet26}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-amber-400 text-slate-950 hover:bg-yellow-300 shadow-md transition-all flex items-center gap-1.5"
            >
              <span>🔤 26 सचित्र पृष्ठ (A-Z Full Book)</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("letters")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "letters" ? "bg-white text-blue-700 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            A–Z Alphabet
          </button>
          <button
            onClick={() => setActiveTab("sightWords")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "sightWords" ? "bg-white text-blue-700 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            Sight Words
          </button>
          <button
            onClick={() => setActiveTab("rhymes")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "rhymes" ? "bg-white text-blue-700 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            Rhyming Fun
          </button>
        </div>
      </div>

      {/* 1. LETTERS TAB */}
      {activeTab === "letters" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Alphabet Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search Bar */}
            <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === "hi" ? "26 अंग्रेजी वर्ण (A से Z)" : "26 English Letters (A to Z)"}
              </span>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search letter / word..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Letter Cards Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredLetters.map((item) => {
                const isSelected = selectedLetter?.letter === item.letter;
                return (
                  <button
                    key={item.letter}
                    onClick={() => {
                      setSelectedLetter(item);
                      handleSpeak(`${item.letter} for ${item.example1.word}`);
                      onLetterLearned?.(item.letter);
                    }}
                    className={`aspect-square p-2 rounded-2xl border transition-all flex flex-col items-center justify-between text-center relative group ${
                      isSelected
                        ? "bg-gradient-to-b from-blue-600 to-indigo-600 text-white border-blue-700 shadow-lg scale-105 z-10"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-black">{item.letter}</span>
                      <span className="text-lg font-bold opacity-80">{item.lowercase}</span>
                    </div>
                    <span className="text-xl leading-none">{item.example1.emoji}</span>
                    <span
                      className={`text-[10px] font-bold truncate max-w-full ${
                        isSelected ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.example1.word}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Details & Tracing Canvas (5 cols) */}
          {selectedLetter && (
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-blue-200 dark:border-slate-700 shadow-lg flex flex-col justify-between space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTracingMode("upper")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        tracingMode === "upper"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      Capital {selectedLetter.upper || selectedLetter.letter}
                    </button>
                    <button
                      onClick={() => setTracingMode("lower")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        tracingMode === "lower"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      Small {selectedLetter.lower || selectedLetter.lowercase}
                    </button>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Phonics: /{selectedLetter.phonics}/
                  </span>
                </div>
                <button
                  onClick={() => handleSpeak(`${selectedLetter.upper || selectedLetter.letter} for ${selectedLetter.example1.word}`)}
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-1 text-xs font-bold"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </button>
              </div>

              {/* Tracing Canvas */}
              <div className="relative bg-blue-50/40 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-blue-300 dark:border-slate-700 overflow-hidden flex items-center justify-center">
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
                <div className="absolute top-2 right-2">
                  <button
                    onClick={clearCanvas}
                    className="p-1.5 bg-white/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
                <span className="absolute bottom-2 left-3 text-[10px] text-blue-700 dark:text-blue-400 font-semibold pointer-events-none">
                  ✏️ Trace over the letter with your finger or mouse
                </span>
              </div>

              {/* Two Examples (Matching PDF) */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => handleSpeak(selectedLetter.example1.word)}
                  className="p-3 bg-blue-50 dark:bg-slate-900/60 rounded-2xl border border-blue-200 dark:border-slate-700 hover:border-blue-400 cursor-pointer transition-all flex items-center gap-3"
                >
                  <span className="text-3xl">{selectedLetter.example1.emoji}</span>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                      {selectedLetter.example1.word}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedLetter.example1.hindi}
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => handleSpeak(selectedLetter.example2.word)}
                  className="p-3 bg-blue-50 dark:bg-slate-900/60 rounded-2xl border border-blue-200 dark:border-slate-700 hover:border-blue-400 cursor-pointer transition-all flex items-center gap-3"
                >
                  <span className="text-3xl">{selectedLetter.example2.emoji}</span>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                      {selectedLetter.example2.word}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedLetter.example2.hindi}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recognition Confirmation */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-semibold">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>Finished practicing letter '{selectedLetter.upper || selectedLetter.letter}'?</span>
                </div>
                <button
                  onClick={() => {
                    const char = selectedLetter.upper || selectedLetter.letter;
                    handleSpeak(`Great job! You mastered letter ${char}.`);
                    onLetterLearned?.(char);
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm text-xs transition-transform active:scale-95"
                >
                  Done ⭐
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. SIGHT WORDS TAB */}
      {activeTab === "sightWords" && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-slate-800 rounded-2xl border border-blue-200 dark:border-slate-700">
            <h3 className="font-extrabold text-base text-blue-900 dark:text-blue-300">
              High-Frequency Sight Words (कक्षा 1 से 3)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              These words appear most frequently in English stories. Tap on any word to hear pronunciation and see sentence examples.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {SIGHT_WORDS.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSpeak(`${item.word}. ${item.example}`)}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all space-y-1 group text-center"
              >
                <span className="text-2xl block">{item.emoji}</span>
                <span className="font-black text-xl text-blue-600 dark:text-blue-400 block group-hover:scale-110 transition-transform">
                  {item.word}
                </span>
                <span className="text-xs text-slate-500 block font-medium">{item.hindi}</span>
                <span className="text-[10px] text-slate-400 italic block truncate">"{item.example}"</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RHYMING FUN TAB */}
      {activeTab === "rhymes" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RHYMING_GROUPS.map((grp, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <h3 className="font-extrabold text-base text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                <span>{grp.family}</span>
                <span className="text-xs font-semibold text-slate-400">Rhyme Family</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {grp.words.map((w, wIdx) => (
                  <button
                    key={wIdx}
                    onClick={() => handleSpeak(w.replace(/[^a-zA-Z]/g, ""))}
                    className="p-2.5 bg-indigo-50/60 dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    <span>{w}</span>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
