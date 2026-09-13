import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  Eraser,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  CheckCircle2,
  Bookmark,
  List,
  Maximize2,
  Minimize2,
  Award,
  Palette,
  Edit3,
  HelpCircle,
  Share2,
  Eye,
  PenTool,
} from "lucide-react";
import {
  BOOK_PARTS,
  BOOK_CHAPTERS,
  TOTAL_PAGES,
  getBalVikasPageData,
  BalVikasPage,
  BookChapter,
} from "../data/balVikasBookData";
import { playAudioText } from "../utils/speech";
import { UserProfile } from "../types";

interface BalVikasPustikaSectionProps {
  user: UserProfile | null;
  onOpenAuth: (mode?: "login" | "register") => void;
  language: "hi" | "en";
  soundEnabled: boolean;
  initialPage?: number;
}

export const BalVikasPustikaSection: React.FC<BalVikasPustikaSectionProps> = ({
  user,
  onOpenAuth,
  language,
  soundEnabled,
  initialPage = 1,
}) => {
  const [currentPageNum, setCurrentPageNum] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("iois_bal_vikas_last_page");
      if (saved) {
        const num = parseInt(saved, 10);
        if (num >= 1 && num <= TOTAL_PAGES) return num;
      }
    } catch {
      // ignore
    }
    return initialPage;
  });

  const [inputPage, setInputPage] = useState<string>(String(currentPageNum));
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  // Drawing Tools State
  const [brushColor, setBrushColor] = useState<string>("#DC2626"); // Red default
  const [brushSize, setBrushSize] = useState<number>(5);
  const [toolMode, setToolMode] = useState<"brush" | "pencil" | "highlighter" | "eraser">("pencil");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawnOnPage, setHasDrawnOnPage] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);

  // Star Evaluation / Reward State
  const [rewardStars, setRewardStars] = useState<number | null>(null);
  const [rewardMessage, setRewardMessage] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const pageData: BalVikasPage = getBalVikasPageData(currentPageNum);

  // Sync current page to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("iois_bal_vikas_last_page", String(currentPageNum));
    } catch {
      // ignore
    }
    setInputPage(String(currentPageNum));
    setRewardStars(null);
    setRewardMessage("");
  }, [currentPageNum]);

  // Load saved drawing for current page
  const loadSavedDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUndoStack([]);
    setHasDrawnOnPage(false);

    try {
      const storageKey = `iois_bv_drawing_p${currentPageNum}_${user?.uniqueId || "guest"}`;
      const savedDataUrl = localStorage.getItem(storageKey);
      if (savedDataUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setHasDrawnOnPage(true);
        };
        img.src = savedDataUrl;
      }
    } catch {
      // ignore
    }
  }, [currentPageNum, user?.uniqueId]);

  // Handle Canvas Resize & Re-render
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height || 680);

      // Save current content if any
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx && canvas.width > 0 && canvas.height > 0) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = width;
      canvas.height = height;

      // Restore
      const ctx = canvas.getContext("2d");
      if (ctx && tempCanvas.width > 0 && tempCanvas.height > 0) {
        ctx.drawImage(tempCanvas, 0, 0, width, height);
      } else {
        loadSavedDrawing();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loadSavedDrawing, currentPageNum]);

  // Reload drawing whenever page changes
  useEffect(() => {
    loadSavedDrawing();
  }, [loadSavedDrawing, currentPageNum]);

  // Speech Narration
  const speakCurrentPage = () => {
    if (!soundEnabled) return;
    setAudioPlaying(true);
    playAudioText(pageData.audioText, "hi-IN");
    setTimeout(() => setAudioPlaying(false), 2500);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        goToPreviousPage();
      } else if (e.key === "ArrowRight") {
        goToNextPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPageNum]);

  // Navigation handlers
  const goToNextPage = () => {
    if (currentPageNum < TOTAL_PAGES) {
      saveCurrentDrawing();
      setCurrentPageNum((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageNum > 1) {
      saveCurrentDrawing();
      setCurrentPageNum((prev) => prev - 1);
    }
  };

  const jumpToPage = (num: number) => {
    const target = Math.max(1, Math.min(TOTAL_PAGES, num));
    saveCurrentDrawing();
    setCurrentPageNum(target);
    setIsTocOpen(false);
  };

  // Save current drawing to localStorage
  const saveCurrentDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const storageKey = `iois_bv_drawing_p${currentPageNum}_${user?.uniqueId || "guest"}`;
      const dataUrl = canvas.toDataURL("image/png");
      localStorage.setItem(storageKey, dataUrl);
    } catch {
      // ignore
    }
  };

  // Canvas Drawing Handlers (Touch + Mouse support)
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Save undo frame
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack((prev) => [...prev.slice(-10), snap]);
    } catch {
      // ignore
    }

    const { x, y } = getCanvasCoords(e);
    setIsDrawing(true);
    setHasDrawnOnPage(true);

    ctx.beginPath();
    ctx.moveTo(x, y);

    // Apply tools
    if (toolMode === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushSize * 4;
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (toolMode === "pencil") {
        ctx.lineWidth = Math.max(2, brushSize);
        ctx.globalAlpha = 1.0;
      } else if (toolMode === "brush") {
        ctx.lineWidth = brushSize * 2.5;
        ctx.globalAlpha = 0.9;
      } else if (toolMode === "highlighter") {
        ctx.lineWidth = brushSize * 4;
        ctx.globalAlpha = 0.4;
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.closePath();
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over";
    }
    saveCurrentDrawing();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Save undo frame
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack((prev) => [...prev.slice(-10), snap]);
    } catch {
      // ignore
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnOnPage(false);
    setRewardStars(null);
    setRewardMessage("");
    saveCurrentDrawing();
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || undoStack.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lastSnap = undoStack[undoStack.length - 1];
    ctx.putImageData(lastSnap, 0, 0);
    setUndoStack((prev) => prev.slice(0, -1));
    saveCurrentDrawing();
  };

  // Evaluate Homework & Award Stars
  const handleCheckHomework = () => {
    if (!hasDrawnOnPage) {
      alert("कृपया पहले अपनी उंगली या पेन से स्क्रीन पर अभ्यास कार्य या ट्रेसिंग करें!");
      return;
    }

    setRewardStars(5);
    setRewardMessage("शाबाश! बहुत ही सुंदर लिखावट और गृहकार्य! आपको 5 स्टार्स मिले हैं! ⭐⭐⭐⭐⭐");

    if (soundEnabled) {
      playAudioText("शाबाश! बहुत सुंदर काम किया! आपको पांच स्टार्स मिले हैं!", "hi-IN");
    }
  };

  // Download page with student homework as PNG
  const handleDownloadHomework = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    try {
      // Export current canvas
      const link = document.createElement("a");
      link.download = `Bal-Vikas-Page-${currentPageNum}-${user?.name || "Student"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("चित्र डाउनलोड करने में समस्या आई।");
    }
  };

  // Print current page
  const handlePrintPage = () => {
    window.print();
  };

  // Find Current Chapter
  const currentChapter =
    BOOK_CHAPTERS.find(
      (ch) => currentPageNum >= ch.startPage && currentPageNum <= ch.endPage
    ) || BOOK_CHAPTERS[0];

  const colors = [
    { label: "लाल (Red)", hex: "#DC2626" },
    { label: "नीला (Blue)", hex: "#2563EB" },
    { label: "हरा (Green)", hex: "#059669" },
    { label: "पीला (Yellow)", hex: "#D97706" },
    { label: "संतरी (Orange)", hex: "#EA580C" },
    { label: "बैंगनी (Purple)", hex: "#7C3AED" },
    { label: "गुलाबी (Pink)", hex: "#DB2777" },
    { label: "काला (Black)", hex: "#18181B" },
  ];

  return (
    <div
      className={`relative w-full min-h-screen ${
        isFullscreen ? "fixed inset-0 z-50 bg-slate-900 overflow-y-auto p-2 sm:p-4" : "space-y-6"
      }`}
    >
      {/* Top Interactive Workbook Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200/80 dark:border-slate-800 shadow-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Title & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  IOIS PLATFORM • 720 पृष्ठ डिजिटल वर्कबुक
                </span>
                <span className="hidden sm:inline-flex text-xs font-bold text-emerald-600 dark:text-emerald-400 items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>पढ़े, लिखे व होमवर्क करे</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-amber-400 mt-1 flex items-center gap-2">
                <span>बाल विकास: संपूर्ण अध्ययन पुस्तिका</span>
                <span className="text-xs sm:text-sm font-normal text-slate-400 dark:text-slate-500">
                  (0 से 5 वर्ष के बच्चों के लिए)
                </span>
              </h2>
            </div>
          </div>

          {/* Quick Page Jump & Navigation Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            {/* Table of Contents Button */}
            <button
              type="button"
              onClick={() => setIsTocOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="संपूर्ण 720 पृष्ठों की विषय सूची खोलें"
            >
              <List className="w-4 h-4 text-amber-600" />
              <span>विषय सूची (Index)</span>
            </button>

            {/* Audio Pronunciation Button */}
            <button
              type="button"
              onClick={speakCurrentPage}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                audioPlaying
                  ? "bg-emerald-600 text-white animate-pulse"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
              }`}
              title="पेज का ऑडियो उच्चारण सुनें"
            >
              <Volume2 className="w-4 h-4 text-amber-500" />
              <span>{audioPlaying ? "बोल रहा है..." : "उच्चारण सुनें"}</span>
            </button>

            {/* Page Jump Input */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={currentPageNum <= 1}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200"
                title="पिछला पृष्ठ (Previous Page)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-bold text-slate-500 px-1">पृष्ठ</span>
              <input
                type="number"
                min={1}
                max={TOTAL_PAGES}
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const n = parseInt(inputPage, 10);
                    if (!isNaN(n)) jumpToPage(n);
                  }
                }}
                className="w-14 px-1.5 py-0.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-center text-xs"
              />
              <span className="text-[11px] font-bold text-slate-500 px-1">/ {TOTAL_PAGES}</span>

              <button
                type="button"
                onClick={() => {
                  const n = parseInt(inputPage, 10);
                  if (!isNaN(n)) jumpToPage(n);
                }}
                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px]"
              >
                जाएं
              </button>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPageNum >= TOTAL_PAGES}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200"
                title="अगला पृष्ठ (Next Page)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Print & Fullscreen */}
            <button
              type="button"
              onClick={handlePrintPage}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              title="प्रिंट करें (Print Page)"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              title={isFullscreen ? "सामान्य स्क्रीन" : "फुलस्क्रीन"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Current Part & Chapter Info Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${currentChapter.color}`}>
              {currentChapter.chapterTitle}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
              • {pageData.partTitle} ({currentChapter.startPage}-{currentChapter.endPage})
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              पृष्ठ {currentPageNum} of {TOTAL_PAGES}
            </span>
            <span>•</span>
            <span className="text-[11px] text-slate-400">
              {user ? `विद्यार्थी: ${user.name} (${user.uniqueId})` : "अतिथि विद्यार्थी (Guest Mode)"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Book Canvas & Stage Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: The Digital Workbook Page (A4 Aspect Ratio Paper Look) */}
        <div className="lg:col-span-9 space-y-4">
          {/* The Page Container Card */}
          <div
            ref={containerRef}
            className="relative bg-[#FFFDF5] dark:bg-slate-900 rounded-3xl border-4 border-amber-200 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[720px] select-none"
            style={{
              backgroundImage:
                "radial-gradient(#FDE68A 1px, transparent 1px), radial-gradient(#FDE68A 1px, #FFFDF5 1px)",
              backgroundSize: "28px 28px",
              backgroundPosition: "0 0, 14px 14px",
            }}
          >
            {/* Top Page Running Header with Branding */}
            <div className="p-4 sm:p-5 border-b-2 border-amber-200/80 dark:border-slate-800 flex items-center justify-between gap-2 bg-amber-100/60 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-orange-600 text-white font-black text-xs flex items-center justify-center shadow">
                  IOIS
                </span>
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                  बाल विकास: डिजिटल अध्ययन पुस्तिका
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-xs text-orange-700 dark:text-amber-400 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-full border border-amber-300">
                  Page {currentPageNum}
                </span>
              </div>
            </div>

            {/* PAGE CONTENT RENDERING ENGINE */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* 1. COVER PAGE (Page 1) */}
              {pageData.type === "cover" && (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-4">
                  <div className="relative max-w-md w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 dark:border-amber-700">
                    <img
                      src="/src/assets/images/bal_vikas_cover_1789232263344.jpg"
                      alt="Bal Vikas Cover"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  <div className="space-y-2 max-w-lg">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-amber-400">
                      बाल विकास: सम्पूर्ण डिजिटल अध्ययन पुस्तिका
                    </h1>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      0 से 5 साल के बच्चों के लिए A to Z, वर्णमाला, गिनती 1-100, पहाड़ा 2-40, कहानियां, कविताएं व डिजिटल होमवर्क
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => jumpToPage(2)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-sm shadow-xl shadow-orange-500/30 flex items-center gap-2 transform active:scale-95 transition-all"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>पुस्तिका शुरू करें (Start Reading)</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsTocOpen(true)}
                      className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-amber-300 font-bold text-sm shadow-md flex items-center gap-2"
                    >
                      <List className="w-4 h-4 text-amber-500" />
                      <span>विषय सूची देखें (Table of Contents)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. TABLE OF CONTENTS (Pages 2 - 5) */}
              {pageData.type === "index" && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-amber-400 flex items-center justify-center gap-2">
                      <List className="w-6 h-6 text-orange-600" />
                      <span>सम्पूर्ण विषय सूची (Table of Contents - 720 पृष्ठ)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      किसी भी अध्याय पर क्लिक करके सीधे उस पृष्ठ पर अध्ययन व होमवर्क शुरू करें।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BOOK_CHAPTERS.filter((ch) => ch.chapterNumber > 0).map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => jumpToPage(ch.startPage)}
                        className="p-3.5 bg-white dark:bg-slate-800/80 hover:bg-amber-50/60 dark:hover:bg-slate-800 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-sm cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black text-base flex items-center justify-center shadow-sm shrink-0">
                            {ch.icon}
                          </span>
                          <div>
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-amber-600">
                              {ch.chapterTitle}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {ch.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[11px] font-mono">
                            पृष्ठ {ch.startPage}-{ch.endPage}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. ALPHABET INTRO (A to Z - e.g. A for Apple) */}
              {pageData.type === "alphabet_intro" && (
                <div className="space-y-6">
                  {/* Hero Character & Big Display */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white/90 dark:bg-slate-800/90 p-6 rounded-3xl border-2 border-amber-200 dark:border-slate-700 shadow-lg">
                    {/* Left: Huge Letter & Generated Art */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-amber-200">
                      {pageData.heroImage ? (
                        <div className="w-full max-w-[260px] rounded-2xl overflow-hidden shadow-xl border-2 border-amber-300 mb-3">
                          <img
                            src={pageData.heroImage}
                            alt="A for Apple Illustration"
                            referrerPolicy="no-referrer"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 flex items-center justify-center text-white text-8xl font-black shadow-xl shadow-orange-500/20 mb-2">
                          {pageData.heroCharacter}
                        </div>
                      )}
                      <div className="text-4xl font-black text-red-600 dark:text-red-400">
                        {pageData.heroCharacter} {pageData.heroCharacter?.toLowerCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-500 mt-1">
                        Capital & Small Letter
                      </span>
                    </div>

                    {/* Right: Word Phonics & Pronunciation */}
                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                          {pageData.heroCharacter} FOR {pageData.heroWord?.toUpperCase()}
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
                          {pageData.heroCharacter} FOR {pageData.heroWord}
                        </h3>
                        <h4 className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                          {pageData.heroCharacter} FOR {pageData.heroWordHi}
                        </h4>
                      </div>

                      <div className="p-3 bg-amber-50 dark:bg-slate-900/60 rounded-xl border border-amber-200 text-xs space-y-1">
                        <strong className="text-amber-900 dark:text-amber-300 block">
                          🗣️ फोनिक्स उच्चारण (Phonics):
                        </strong>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          {pageData.audioText}
                        </p>
                      </div>

                      {/* Additional 4 Words */}
                      {pageData.examples && (
                        <div>
                          <span className="text-xs font-bold text-slate-500 mb-2 block">
                            अक्षर '{pageData.heroCharacter}' से अन्य शब्द (More Words):
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {pageData.examples.map((ex, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-sm"
                              >
                                <span className="text-2xl">{ex.icon}</span>
                                <div>
                                  <div className="font-black text-xs text-slate-800 dark:text-slate-100">
                                    {ex.text}
                                  </div>
                                  <div className="text-[10px] text-slate-500">{ex.sub}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tracing Area Banner */}
                  <div className="p-4 bg-amber-100/70 dark:bg-slate-800/80 rounded-2xl border border-amber-300 dark:border-slate-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                      <Edit3 className="w-4 h-4 text-orange-600" />
                      <span>{pageData.homeworkTask}</span>
                    </div>
                    <button
                      type="button"
                      onClick={goToNextPage}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <span>ट्रेसिंग पेज पर जाएं</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* 4. ALPHABET / SWAR / VYANJAN TRACING SHEET (Step-by-step Tracing) */}
              {(pageData.type === "alphabet_trace" ||
                pageData.type === "swar_trace" ||
                pageData.type === "vyanjan_trace") && (
                <div className="space-y-6">
                  {/* Tracing Instructions Header */}
                  <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border-2 border-amber-300 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-amber-400">
                        {pageData.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{pageData.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <PenTool className="w-3.5 h-3.5" />
                        <span>उंगली / पेन से लिखें</span>
                      </span>
                    </div>
                  </div>

                  {/* Step-by-Step Tracing Guidelines */}
                  {pageData.lines && (
                    <div className="p-3 bg-amber-50 dark:bg-slate-900/70 rounded-xl border border-amber-200 text-xs">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-1">
                        ✏️ सही रेखा और दिशा निर्देश (Stroke Order Guidelines):
                      </strong>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 font-medium">
                        {pageData.lines.map((l, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            <span>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual Trace Boxes Grid (Dotted letters + Empty Boxes) */}
                  <div className="space-y-4">
                    <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400">
                      👇 अभ्यास पंक्ति 1: बिंदुओं को जोड़ें (Trace on Dotted Letter):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((box) => (
                        <div
                          key={box}
                          className="h-28 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-dashed border-amber-400 dark:border-amber-600 flex flex-col items-center justify-center shadow-sm relative overflow-hidden"
                        >
                          <span className="text-5xl font-black text-slate-300 dark:text-slate-700 select-none tracking-widest">
                            {pageData.heroCharacter}
                          </span>
                          <span className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400">
                            {box <= 3 ? "बिंदु" : "खाली"}
                          </span>
                        </div>
                      ))}
                    </div>

                    <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400 block pt-2">
                      👇 अभ्यास पंक्ति 2: खुद से लिखें (Self Practice Line):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((box) => (
                        <div
                          key={box}
                          className="h-28 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center shadow-sm relative"
                        >
                          <div className="w-full border-b border-slate-200 dark:border-slate-700 absolute top-1/2" />
                          <span className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400">
                            अभ्यास
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. HINDI SWAR INTRO & VYANJAN INTRO */}
              {(pageData.type === "swar_intro" || pageData.type === "vyanjan_intro") && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white/95 dark:bg-slate-800 p-6 rounded-3xl border-2 border-amber-300 dark:border-slate-700 shadow-lg">
                    <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-amber-200">
                      <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center text-white text-8xl font-black shadow-xl shadow-amber-500/20 mb-2">
                        {pageData.heroCharacter}
                      </div>
                      <span className="text-lg font-black text-amber-700 dark:text-amber-300">
                        {pageData.heroCharacter} से {pageData.heroWord}
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          हिंदी वर्णमाला
                        </span>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2">
                          {pageData.heroCharacter} से {pageData.heroWord}
                        </h3>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
                          {pageData.subtitle}
                        </p>
                      </div>

                      {pageData.lines && (
                        <div className="p-4 bg-amber-50 dark:bg-slate-900/70 rounded-2xl border border-amber-200 text-sm font-bold text-amber-950 dark:text-amber-200">
                          {pageData.lines[0]}
                        </div>
                      )}

                      {pageData.examples && (
                        <div className="grid grid-cols-2 gap-3">
                          {pageData.examples.map((ex, i) => (
                            <div
                              key={i}
                              className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2"
                            >
                              <span className="text-2xl">{ex.icon}</span>
                              <div>
                                <div className="font-black text-xs">{ex.text}</div>
                                <div className="text-[10px] text-slate-500">{ex.sub}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. BARAKHADI TABLE (Page 156 to 185) */}
              {pageData.type === "barakhadi" && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-3xl font-black text-slate-800 dark:text-amber-400">
                      '{pageData.heroCharacter}' की सम्पूर्ण बारहखड़ी (12 Matras)
                    </h3>
                    <p className="text-xs text-slate-500">
                      स्वर मात्राओं के मेल से बने 12 रूपों का सस्वर उच्चारण व लेखन अभ्यास
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {pageData.traceItems?.map((matra, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border-2 border-amber-300 dark:border-slate-700 text-center shadow-sm space-y-1 hover:border-orange-500 transition-colors"
                      >
                        <div className="text-4xl font-black text-orange-600 dark:text-amber-400">
                          {matra}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">
                          मात्रा रूप {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  {pageData.lines && (
                    <div className="p-4 bg-amber-50 dark:bg-slate-900 rounded-2xl border border-amber-200 text-xs space-y-1.5">
                      <strong className="text-amber-900 dark:text-amber-300 block mb-1">
                        मात्रा तालिका:
                      </strong>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        {pageData.lines.map((l, i) => (
                          <div key={i}>• {l}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 7. WORD FORMATION (Pages 186 to 225) */}
              {pageData.type === "words" && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <div className="text-5xl mb-2">{pageData.heroCharacter}</div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-amber-400">
                      {pageData.title}
                    </h3>
                    <p className="text-xs text-slate-500">{pageData.subtitle}</p>
                  </div>

                  {pageData.examples && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {pageData.examples.map((w, i) => (
                        <div
                          key={i}
                          className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-amber-200 dark:border-slate-700 text-center shadow-sm"
                        >
                          <span className="text-2xl mb-1 block">✏️</span>
                          <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                            {w.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 8. POEM (Pages 226 to 260) */}
              {pageData.type === "poem" && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="text-6xl animate-bounce">{pageData.heroCharacter}</div>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-amber-400">
                      {pageData.title}
                    </h3>
                    <p className="text-xs text-slate-500">{pageData.subtitle}</p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl border-2 border-amber-300 dark:border-slate-700 text-center space-y-3 shadow-inner">
                    {pageData.lines?.map((line, i) => (
                      <p
                        key={i}
                        className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* 9. MORAL STORY (Pages 261 to 295) */}
              {pageData.type === "story" && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="text-6xl">{pageData.heroCharacter}</div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-amber-400">
                      {pageData.title}
                    </h3>
                    <p className="text-xs text-slate-500">{pageData.subtitle}</p>
                  </div>

                  <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border-2 border-amber-200 dark:border-slate-700 space-y-3 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
                    {pageData.lines?.map((para, i) => (
                      <p
                        key={i}
                        className={
                          para.startsWith("सीख")
                            ? "p-3 bg-amber-100 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 rounded-xl font-bold mt-3 border border-amber-300"
                            : ""
                        }
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* 10. COUNTING 1 TO 50 (Pages 296 to 345) */}
              {pageData.type === "counting_item" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-amber-300 dark:border-slate-700 shadow-lg">
                    <div className="md:col-span-4 text-center p-6 bg-amber-50 dark:bg-slate-900 rounded-2xl border border-amber-200">
                      <div className="text-8xl font-black text-orange-600 dark:text-amber-400">
                        {pageData.heroCharacter}
                      </div>
                      <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-2">
                        {pageData.heroWordHi} ({pageData.heroWord})
                      </div>
                    </div>

                    <div className="md:col-span-8 space-y-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                          संख्या {pageData.heroCharacter} की सचित्र गणना (Counting)
                        </h3>
                        <p className="text-xs text-slate-500">{pageData.subtitle}</p>
                      </div>

                      {/* Visual Objects to Count */}
                      <div className="p-4 bg-amber-50/60 dark:bg-slate-900/60 rounded-2xl border border-amber-200 flex flex-wrap gap-3 items-center justify-center max-h-48 overflow-y-auto">
                        {Array.from({ length: Math.min(50, parseInt(pageData.heroCharacter || "1", 10)) }).map(
                          (_, i) => (
                            <span key={i} className="text-3xl sm:text-4xl animate-pulse">
                              {["🎈", "🍎", "⭐", "⚽", "🍓"][i % 5]}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 11. TABLES (Pages 396 to 435) */}
              {pageData.type === "table" && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-3xl font-black text-slate-800 dark:text-amber-400">
                      {pageData.title}
                    </h3>
                    <p className="text-xs text-slate-500">{pageData.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {pageData.lines?.map((line, i) => (
                      <div
                        key={i}
                        className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-indigo-200 dark:border-slate-700 text-center shadow-sm hover:border-indigo-500 transition-colors"
                      >
                        <span className="font-mono text-base sm:text-lg font-black text-indigo-700 dark:text-indigo-300">
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 12. ADDITION / SUBTRACTION / MULTIPLICATION / DIVISION */}
              {(pageData.type === "addition" ||
                pageData.type === "subtraction" ||
                pageData.type === "multiplication" ||
                pageData.type === "division") && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-3xl font-black text-slate-800 dark:text-amber-400">
                      {pageData.title}
                    </h3>
                    <p className="text-xs text-slate-500">{pageData.subtitle}</p>
                  </div>

                  {pageData.mathProblem && (
                    <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border-4 border-emerald-300 dark:border-slate-700 max-w-md mx-auto text-center shadow-xl space-y-6">
                      <div className="flex items-center justify-center gap-4 text-5xl font-black font-mono">
                        <span className="text-slate-800 dark:text-slate-100">
                          {pageData.mathProblem.num1}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {pageData.mathProblem.operator}
                        </span>
                        <span className="text-slate-800 dark:text-slate-100">
                          {pageData.mathProblem.num2}
                        </span>
                        <span>=</span>
                        <span className="w-16 h-16 rounded-2xl border-4 border-dashed border-emerald-500 flex items-center justify-center text-4xl text-slate-400">
                          ?
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-500">
                        उत्तर: {pageData.mathProblem.answer}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 13. CERTIFICATE (Page 720) */}
              {pageData.type === "certificate" && (
                <div className="p-8 bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl border-8 border-amber-400 dark:border-amber-600 shadow-2xl text-center space-y-6 relative overflow-hidden">
                  <div className="w-20 h-20 mx-auto rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/40">
                    <Award className="w-12 h-12" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-300">
                      IOIS PLATFORM • आधिकारिक प्रमाण-पत्र
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
                      बाल विकास सफलता प्रमाण-पत्र
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Certificate of Excellence & Completion
                    </p>
                  </div>

                  <div className="p-4 bg-white/90 dark:bg-slate-800/90 rounded-2xl border border-amber-300 max-w-lg mx-auto space-y-2">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      यह प्रमाणित किया जाता है कि विद्यार्थी
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-amber-400">
                      {user?.name || "प्रिय नन्हे विद्यार्थी"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      यूनिक सदस्य ID: <span className="font-mono font-bold">{user?.uniqueId || "IOIS-MEMBER"}</span>
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 pt-2 font-medium">
                      ने "बाल विकास: सम्पूर्ण डिजिटल अध्ययन पुस्तिका" के सभी 720 पृष्ठों का अध्ययन, सुलेख, पहाड़ा, कविताएं व गृहकार्य सफलतापूर्वक पूर्ण किया है।
                    </p>
                  </div>

                  <div className="flex items-center justify-between max-w-md mx-auto pt-6 text-xs text-slate-500 border-t border-amber-200 dark:border-slate-700">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">जारी दिनांक</div>
                      <div>{new Date().toLocaleDateString("hi-IN")}</div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-2 border-amber-500 flex items-center justify-center font-bold text-[10px] text-amber-800">
                      IOIS SEAL
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">प्राधिकृत हस्ताक्षर</div>
                      <div>Vikas Kumar (IOIS)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* THE TRANSPARENT INTERACTIVE CANVAS OVERLAY FOR DRAWING/WRITING */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 z-20 cursor-crosshair touch-none"
            />
          </div>

          {/* Star Reward Banner Pop-in */}
          {rewardStars && (
            <div className="p-4 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-slate-950 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-950">
                  {Array.from({ length: rewardStars }).map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current text-yellow-100" />
                  ))}
                </div>
                <div className="font-black text-sm">{rewardMessage}</div>
              </div>
              <button
                type="button"
                onClick={() => setRewardStars(null)}
                className="px-3 py-1 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                धन्यवाद!
              </button>
            </div>
          )}
        </div>

        {/* Right: Floating Toolbox (Colors, Pen, Brush, Eraser, Check & Save) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-slate-800 shadow-xl p-4 sm:p-5 space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-black text-sm text-slate-800 dark:text-amber-400 flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-500" />
                <span>ड्राइंग & होमवर्क टूल्स</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                सक्रिय
              </span>
            </div>

            {/* Tool Selection */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 mb-2">
                टूल्स चुनें (Tool Mode):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setToolMode("pencil")}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                    toolMode === "pencil"
                      ? "bg-amber-500 text-slate-950 border-amber-600 shadow"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>पेंसिल (Pencil)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setToolMode("brush")}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                    toolMode === "brush"
                      ? "bg-amber-500 text-slate-950 border-amber-600 shadow"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>ब्रश (Brush)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setToolMode("eraser")}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                    toolMode === "eraser"
                      ? "bg-amber-500 text-slate-950 border-amber-600 shadow"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>इरेज़र (Eraser)</span>
                </button>

                <button
                  type="button"
                  onClick={clearCanvas}
                  className="p-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                  title="पूरा पन्ना साफ करें"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>साफ़ करें</span>
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-500 mb-2">
                स्याही / रंग चुनें (Color Palette):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      setBrushColor(c.hex);
                      if (toolMode === "eraser") setToolMode("pencil");
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform ${
                      brushColor === c.hex && toolMode !== "eraser"
                        ? "scale-110 ring-2 ring-offset-2 ring-amber-500 shadow-md"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  >
                    {brushColor === c.hex && toolMode !== "eraser" && (
                      <span className="w-2 h-2 rounded-full bg-white shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Brush Size Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 mb-1">
                <span>ब्रश मोटाई (Thickness):</span>
                <span>{brushSize}px</span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Undo Button */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>पिछला कदम वापस लें (Undo)</span>
            </button>

            {/* Check Homework & Reward Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={handleCheckHomework}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5 text-yellow-200" />
                <span>⭐ होमवर्क चेक करें (Get Stars)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadHomework}
                className="w-full py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs flex items-center justify-center gap-1.5"
                title="बच्चे के लिखे हुए पेज को फोटो के रूप में सेव करें"
              >
                <Download className="w-3.5 h-3.5" />
                <span>होमवर्क डाउनलोड करें (Save PNG)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents Modal Drawer */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-3xl w-full max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-200 dark:border-slate-800 flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-black">
                  सम्पूर्ण विषय सूची (Table of Contents - 720 पृष्ठ)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTocOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {BOOK_PARTS.map((part) => (
                <div key={part.partNumber} className="space-y-3">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-r ${part.color} text-white font-black text-sm flex items-center justify-between shadow-md`}
                  >
                    <span>{part.titleHi}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {part.range}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                    {BOOK_CHAPTERS.filter((ch) => ch.partNumber === part.partNumber).map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => jumpToPage(ch.startPage)}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-100/70 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-between gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span>{ch.icon}</span>
                          <span className="line-clamp-1">{ch.chapterTitle}</span>
                        </div>
                        <span className="font-mono text-[10px] text-amber-700 dark:text-amber-300 shrink-0">
                          पृष्ठ {ch.startPage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 text-right shrink-0 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsTocOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
