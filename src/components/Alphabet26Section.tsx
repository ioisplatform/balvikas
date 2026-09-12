import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Layers,
  Award,
  PenTool,
  Eraser,
  Palette,
  Eye,
  ListFilter,
  CheckCircle2,
} from "lucide-react";
import { ALPHABET_26_DATA, Alphabet26Item } from "../data/alphabet26Data";

interface Alphabet26SectionProps {
  onBackToDashboard?: () => void;
  language?: "hi" | "en";
}

export const Alphabet26Section: React.FC<Alphabet26SectionProps> = ({
  onBackToDashboard,
  language = "hi",
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"book" | "grid">("book");
  const [selectedGroup, setSelectedGroup] = useState<0 | 1 | 2 | 3>(0); // 0 = all
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [learnedLetters, setLearnedLetters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("iois_learned_alphabet26");
      return saved ? JSON.parse(saved) : ["A", "B"];
    } catch {
      return ["A", "B"];
    }
  });

  // Tracing Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState<string>("#e11d48"); // default red pencil
  const [brushSize, setBrushSize] = useState<number>(6);
  const [isEraser, setIsEraser] = useState(false);

  const currentItem: Alphabet26Item = ALPHABET_26_DATA[currentPageIndex] || ALPHABET_26_DATA[0];

  // Save learned letters
  const toggleLearned = (letter: string) => {
    setLearnedLetters((prev) => {
      const next = prev.includes(letter)
        ? prev.filter((l) => l !== letter)
        : [...prev, letter];
      localStorage.setItem("iois_learned_alphabet26", JSON.stringify(next));
      return next;
    });
  };

  // Keyboard Navigation for flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "book") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        goToNextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        goToPrevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPageIndex, viewMode]);

  const goToNextPage = () => {
    if (currentPageIndex < ALPHABET_26_DATA.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      clearCanvas();
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      clearCanvas();
    }
  };

  const jumpToLetter = (index: number) => {
    setCurrentPageIndex(index);
    setViewMode("book");
    clearCanvas();
  };

  // Canvas Drawing & Notebook Setup
  useEffect(() => {
    if (viewMode === "book") {
      drawNotebookLines();
    }
  }, [currentPageIndex, viewMode]);

  const drawNotebookLines = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, rect.width, rect.height);

    // 4-Line English copybook ruling
    const h = rect.height;
    const w = rect.width;
    const topMargin = h * 0.22;
    const spacing = h * 0.18;

    // Line 1 (Red line)
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(12, topMargin);
    ctx.lineTo(w - 12, topMargin);
    ctx.stroke();

    // Line 2 (Blue line)
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(12, topMargin + spacing);
    ctx.lineTo(w - 12, topMargin + spacing);
    ctx.stroke();

    // Line 3 (Blue line)
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(12, topMargin + spacing * 2);
    ctx.lineTo(w - 12, topMargin + spacing * 2);
    ctx.stroke();

    // Line 4 (Red line)
    ctx.strokeStyle = "#f87171";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(12, topMargin + spacing * 3);
    ctx.lineTo(w - 12, topMargin + spacing * 3);
    ctx.stroke();

    // Draw faint guide letter in the background
    ctx.font = `bold ${h * 0.52}px 'Comic Sans MS', 'Chalkboard SE', sans-serif`;
    ctx.fillStyle = "rgba(148, 163, 184, 0.22)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${currentItem.letter} ${currentItem.lowercase}`, w / 2, h / 2 + 5);
  };

  const clearCanvas = () => {
    drawNotebookLines();
  };

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = isEraser ? "#ffffff" : brushColor;
    ctx.lineWidth = isEraser ? 18 : brushSize;
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

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Speech Synthesis - Rhyme and Word Recitation
  const speakRhyme = () => {
    if (!("speechSynthesis" in window)) {
      alert("आपके ब्राउज़र में वॉइस सपोर्ट उपलब्ध नहीं है।");
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const textToSpeak = `${currentItem.letter} for ${currentItem.word}. ${currentItem.hindiMeaning}. ${currentItem.rhyme}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;

    // Try Hindi voice first, fallback to default
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find((v) => v.lang.includes("hi") || v.lang.includes("IN"));
    if (hiVoice) {
      utterance.voice = hiVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Copy AI Prompt
  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(currentItem.aiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Filtered by Group for Grid
  const displayedItems =
    selectedGroup === 0
      ? ALPHABET_26_DATA
      : ALPHABET_26_DATA.filter((item) => item.group === selectedGroup);

  const isLearned = learnedLetters.includes(currentItem.letter);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
            🔤
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-yellow-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-yellow-200" />
              <span>NCERT प्राथमिक अंग्रेजी सचित्र किट</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black">
              A से Z 26 सचित्र अक्षर (26 Pages)
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-medium">
              प्रत्येक अक्षर का अलग पृष्ठ, मनोरंजक कविताएं (Rhymes) व AI 3D इलस्ट्रेशन
            </p>
          </div>
        </div>

        {/* View Switcher & Progress Summary */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="px-3 py-1.5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/20 text-xs font-bold flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-300" />
            <span>सीखे गए: {learnedLetters.length} / 26 अक्षर</span>
          </div>

          <div className="flex items-center p-1 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/20">
            <button
              onClick={() => setViewMode("book")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "book"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>किताब पृष्ठ (Book Mode)</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>सभी 26 अक्षर ग्रिड</span>
            </button>
          </div>
        </div>
      </div>

      {/* Group Switcher Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedGroup(0)}
            className={`px-3.5 py-2 rounded-2xl font-black transition-all flex items-center gap-1.5 shrink-0 ${
              selectedGroup === 0
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>सभी 26 अक्षर (A-Z)</span>
          </button>
          <button
            onClick={() => setSelectedGroup(1)}
            className={`px-3.5 py-2 rounded-2xl font-black transition-all flex items-center gap-1.5 shrink-0 ${
              selectedGroup === 1
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            <span>🎒 ग्रुप 1: शुरुआती अक्षर (A से I)</span>
          </button>
          <button
            onClick={() => setSelectedGroup(2)}
            className={`px-3.5 py-2 rounded-2xl font-black transition-all flex items-center gap-1.5 shrink-0 ${
              selectedGroup === 2
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            <span>🚀 ग्रुप 2: मध्य अक्षर (J से R)</span>
          </button>
          <button
            onClick={() => setSelectedGroup(3)}
            className={`px-3.5 py-2 rounded-2xl font-black transition-all flex items-center gap-1.5 shrink-0 ${
              selectedGroup === 3
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            <span>🎨 ग्रुप 3: अंतिम अक्षर (S से Z)</span>
          </button>
        </div>

        {/* Page selector dropdown in book mode */}
        {viewMode === "book" && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-500 font-bold hidden sm:inline">पृष्ठ चुनें:</span>
            <select
              value={currentPageIndex}
              onChange={(e) => jumpToLetter(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-100 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {ALPHABET_26_DATA.map((item, idx) => (
                <option key={item.letter} value={idx}>
                  Page {item.page}: {item.letter} ({item.word})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 26 Letter Quick Navigation Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-thin">
        {ALPHABET_26_DATA.map((item, idx) => {
          const isSelected = currentPageIndex === idx && viewMode === "book";
          const isDone = learnedLetters.includes(item.letter);
          return (
            <button
              key={item.letter}
              onClick={() => jumpToLetter(idx)}
              className={`w-9 h-9 shrink-0 rounded-xl font-black text-sm flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? "bg-amber-500 text-white ring-2 ring-amber-400 ring-offset-2 scale-105 shadow-md"
                  : isDone
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:scale-105"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
              title={`Page ${item.page}: ${item.letter} for ${item.word}`}
            >
              <span>{item.letter}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: DEDICATED BOOK PAGE MODE (Each letter has its own full educational page) */}
      {viewMode === "book" && (
        <div className="space-y-4">
          {/* Main Book Page Container */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative">
            {/* Top Sheet Margin / Header Banner */}
            <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-sm">
                  पृष्ठ संख्या (Page) : {currentItem.page} / 26
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {currentItem.groupNameHi}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLearned(currentItem.letter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    isLearned
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isLearned ? "सीख लिया (Completed)" : "सीख लिया चिन्हित करें"}</span>
                </button>
              </div>
            </div>

            {/* Book Body: 2 Columns */}
            <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (5 Cols): Big Letter, 3D Character Art & Rhyme */}
              <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
                {/* Big Letter Display Card */}
                <div
                  className={`p-6 rounded-3xl bg-gradient-to-br ${currentItem.theme.bgGradient} border-2 ${currentItem.theme.border} text-center relative overflow-hidden shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60 font-black text-xs text-slate-700 dark:text-slate-300">
                      Page {currentItem.page}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      ध्वनि: {currentItem.phonics}
                    </span>
                  </div>

                  {/* Gigantic Letter Display */}
                  <div className="flex items-baseline justify-center gap-4 my-2">
                    <span className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm font-serif">
                      {currentItem.letter}
                    </span>
                    <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-amber-500 dark:text-amber-400 font-serif">
                      {currentItem.lowercase}
                    </span>
                  </div>

                  {/* Word & Hindi Meaning */}
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-wide">
                      {currentItem.word}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                      ({currentItem.hindiMeaning})
                    </div>
                  </div>

                  {/* Decorative 3D Emoji Badge */}
                  <div className="my-4 flex items-center justify-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-6xl sm:text-7xl hover:scale-110 transition-transform cursor-pointer">
                      {currentItem.emoji}
                    </div>
                  </div>
                </div>

                {/* The Exact Rhyme Provided by User */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-yellow-950/40 border-2 border-amber-300 dark:border-amber-800 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>बाल कविता (Kids Rhyme)</span>
                    </div>

                    <button
                      onClick={isSpeaking ? stopSpeech : speakRhyme}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow ${
                        isSpeaking
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-amber-500 hover:bg-amber-600 text-slate-950"
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isSpeaking ? "रोकें (Stop)" : "कविता सुनें (Play Rhyme)"}</span>
                    </button>
                  </div>

                  <p className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-amber-100 leading-relaxed py-1">
                    {currentItem.rhyme}
                  </p>
                </div>
              </div>

              {/* Right Column (6 Cols): AI Image Prompt + Tracing Pad + Vocabulary */}
              <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
                {/* AI Image Prompt Display Card */}
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-black text-xs">
                        AI
                      </div>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        AI Image Prompt (3D इलस्ट्रेशन प्रॉम्प्ट):
                      </span>
                    </div>

                    <button
                      onClick={copyPromptToClipboard}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">कॉपी हुआ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>प्रॉम्प्ट कॉपी करें</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed shadow-inner">
                    "{currentItem.aiPrompt}"
                  </div>
                </div>

                {/* 4-Line Notebook Tracing Pad */}
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        4-लाइन कॉपीबुक ट्रेसिंग पैड (Letter Writing Practice):
                      </span>
                    </div>

                    {/* Canvas Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setIsEraser(false);
                          setBrushColor("#e11d48");
                        }}
                        className={`w-6 h-6 rounded-full bg-rose-600 ring-2 ${
                          !isEraser && brushColor === "#e11d48" ? "ring-rose-400 ring-offset-2" : "ring-transparent"
                        }`}
                        title="लाल पेंसिल"
                      />
                      <button
                        onClick={() => {
                          setIsEraser(false);
                          setBrushColor("#2563eb");
                        }}
                        className={`w-6 h-6 rounded-full bg-blue-600 ring-2 ${
                          !isEraser && brushColor === "#2563eb" ? "ring-blue-400 ring-offset-2" : "ring-transparent"
                        }`}
                        title="नीली पेंसिल"
                      />
                      <button
                        onClick={() => {
                          setIsEraser(false);
                          setBrushColor("#16a34a");
                        }}
                        className={`w-6 h-6 rounded-full bg-emerald-600 ring-2 ${
                          !isEraser && brushColor === "#16a34a" ? "ring-emerald-400 ring-offset-2" : "ring-transparent"
                        }`}
                        title="हरी पेंसिल"
                      />
                      <button
                        onClick={() => setIsEraser(!isEraser)}
                        className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                          isEraser
                            ? "bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-800"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600"
                        }`}
                        title="रबर (Eraser)"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={clearCanvas}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                        title="साफ करें"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Drawing Canvas */}
                  <div className="w-full h-40 sm:h-48 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner cursor-crosshair relative touch-none">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-1 right-2 text-[10px] text-slate-400 pointer-events-none">
                      उंगली या माउस से अक्षर लिखें (Trace with finger)
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Handwriting Strokes & Extra Vocabulary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">
                      अक्षर बनावट (Strokes):
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                      {currentItem.strokeSteps.map((step, sIdx) => (
                        <li key={sIdx} className="leading-snug">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">
                      अन्य शब्द (More Words):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentItem.vocabulary.map((vocab, vIdx) => (
                        <span
                          key={vIdx}
                          className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium text-slate-700 dark:text-slate-300"
                        >
                          {vocab}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Page Navigation Buttons */}
            <div className="bg-slate-50 dark:bg-slate-800/90 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={goToPrevPage}
                disabled={currentPageIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 disabled:opacity-30 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला पृष्ठ ({currentPageIndex > 0 ? ALPHABET_26_DATA[currentPageIndex - 1].letter : "प्रारंभ"})</span>
              </button>

              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:block">
                कीबोर्ड पर ← / → दबाकर भी पन्ने पलट सकते हैं
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPageIndex === ALPHABET_26_DATA.length - 1}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
              >
                <span>अगला पृष्ठ ({currentPageIndex < ALPHABET_26_DATA.length - 1 ? ALPHABET_26_DATA[currentPageIndex + 1].letter : "समाप्त"})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 26-LETTER GRID OVERVIEW MODE */}
      {viewMode === "grid" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {displayedItems.map((item) => {
              const isDone = learnedLetters.includes(item.letter);
              return (
                <div
                  key={item.letter}
                  onClick={() => jumpToLetter(item.page - 1)}
                  className={`p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 ${
                    isDone
                      ? "border-emerald-300 dark:border-emerald-800"
                      : "border-slate-200 dark:border-slate-800"
                  } hover:border-amber-400 dark:hover:border-amber-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between text-center relative overflow-hidden`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400">P.{item.page}</span>
                    {isDone && (
                      <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Character Emoji */}
                  <div className="text-4xl sm:text-5xl my-2 group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </div>

                  {/* Letters */}
                  <div className="my-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
                      {item.letter} <span className="text-amber-500 font-sans">{item.lowercase}</span>
                    </div>
                    <div className="text-xs font-black text-slate-700 dark:text-slate-200 truncate mt-0.5">
                      {item.word}
                    </div>
                    <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      ({item.hindiMeaning})
                    </div>
                  </div>

                  {/* Click to open page button */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 group-hover:underline">
                      पृष्ठ खोलें →
                    </span>
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
