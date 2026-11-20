import React, { useState, useRef, useEffect } from "react";
import {
  PenTool,
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  Eraser,
  Volume2,
  CheckCircle2,
  Star,
  Award,
  Download,
  Eye,
} from "lucide-react";
import { playAudioText } from "../utils/speech";

interface FourLineEnglishTracingProps {
  char?: string;
  smallChar?: string;
  word?: string;
  hindiWord?: string;
  strokes?: string[];
  soundEnabled?: boolean;
}

export const FourLineEnglishTracing: React.FC<FourLineEnglishTracingProps> = ({
  char = "A",
  smallChar = "a",
  word = "Apple",
  hindiWord = "सेब",
  strokes = [
    "1. ऊपर की लाल रेखा (Line 1) से नीचे की नीली रेखा (Line 3) तक तिरछी रेखा (Left Slant)",
    "2. ऊपर की लाल रेखा (Line 1) से नीचे की नीली रेखा (Line 3) तक दूसरी तिरछी रेखा (Right Slant)",
    "3. मध्य की नीली रेखा (Line 2) पर दोनों को जोड़ती सोई रेखा (Sleeping Line)",
  ],
  soundEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pencilColor, setPencilColor] = useState<string>("#1e293b"); // default graphite pencil
  const [pencilWidth, setPencilWidth] = useState<number>(4);
  const [isErasing, setIsErasing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [sparkleCount, setSparkleCount] = useState(0);

  // Live Animated Writing Simulation State
  const [isAnimating, setIsAnimating] = useState(false);
  const [animProgress, setAnimProgress] = useState(0); // 0 to 100
  const animFrameRef = useRef<number | null>(null);

  const displayChar = char.toUpperCase();
  const displaySmall = smallChar ? smallChar.toLowerCase() : displayChar.toLowerCase();

  // Set up canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, []);

  // Live Animated Pencil Tracing Effect
  useEffect(() => {
    if (!isAnimating) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let start: number | null = null;
    const duration = 4000; // 4 seconds full write loop

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setAnimProgress(progress);

      if (progress < 100) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsAnimating(false);
        setSparkleCount((c) => c + 1);
        if (soundEnabled) {
          playAudioText(`बहुत खूब! आपने अक्षर ${displayChar} को 4-लाइन में लिखना देख लिया!`, "hi-IN");
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAnimating, displayChar, soundEnabled]);

  // Touch / Mouse Drawing Handlers on the 4-Line Canvas
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isErasing ? "#ffffff" : pencilColor;
    ctx.lineWidth = isErasing ? 18 : pencilWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const startLiveAnimation = () => {
    setIsAnimating(true);
    setAnimProgress(0);
    if (soundEnabled) {
      playAudioText(
        `${displayChar} for ${word}! लाल और नीली चार लाइनों में पेंसिल कैसे चलती है, ध्यान से देखिए!`,
        "hi-IN"
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Real 4-Line Copybook Title & Interactive Tools */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-4 rounded-3xl shadow-md border-2 border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-black text-2xl shadow-inner border border-white/30">
            {displayChar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                4-Line English Copybook
              </span>
              <span className="text-xs text-amber-200 font-bold">
                अक्षर {displayChar} {displaySmall} • सुलेख अभ्यास
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black leading-tight">
              असली 4-लाइन वाली अंग्रेजी नोटबुक (Four-Line Ruled Slate)
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={startLiveAnimation}
            className={`px-3.5 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all transform active:scale-95 ${
              isAnimating
                ? "bg-emerald-400 text-slate-950 animate-pulse"
                : "bg-white text-slate-900 hover:bg-yellow-100"
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current text-amber-600" />
            <span>{isAnimating ? "पेंसिल चल रही है..." : "लाइव पेंसिल एनिमेशन"}</span>
          </button>

          <button
            type="button"
            onClick={clearCanvas}
            className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1 border border-white/20 transition-colors"
            title="स्लेट साफ़ करें"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>साफ़ करें</span>
          </button>
        </div>
      </div>

      {/* 4-Line Notebook Rules Guide Legend */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 gap-2">
        <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100 font-black">
          📐 4 लाइनों के नियम:
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-red-500 inline-block" />
          <span className="text-red-600 dark:text-red-400">लाइन 1 (ऊपरी लाल - Top Line)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 border-t border-dashed border-sky-500 inline-block" />
          <span className="text-sky-600 dark:text-sky-400">लाइन 2 (मध्य नीली - Waist Line)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-sky-500 inline-block" />
          <span className="text-sky-600 dark:text-sky-400">लाइन 3 (आधार नीली - Base Line)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-red-500 inline-block" />
          <span className="text-red-600 dark:text-red-400">लाइन 4 (निचली लाल - Bottom Line)</span>
        </span>
      </div>

      {/* THE AUTHENTIC 4-LINE NOTEBOOK PAPER CONTAINER */}
      <div className="relative rounded-3xl bg-[#fdfbf7] dark:bg-[#1a1c23] border-4 border-amber-300 dark:border-slate-700 shadow-xl overflow-hidden min-h-[460px] select-none">
        {/* Left Pinkish-Red Notebook Vertical Margin Line */}
        <div className="absolute top-0 bottom-0 left-12 sm:left-16 w-0.5 bg-red-400/80 z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-[51px] sm:left-[67px] w-0.5 bg-red-300/40 z-10 pointer-events-none" />

        {/* Notebook Top Header Header Strip */}
        <div className="border-b-2 border-red-300/60 bg-amber-50/60 dark:bg-slate-800/40 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-4">
            <span>
              <b>Subject:</b> English Tracing ({displayChar} {displaySmall})
            </span>
            <span className="hidden sm:inline-block">
              <b>Topic:</b> {word} ({hindiWord})
            </span>
          </div>
          <div className="flex items-center gap-4 font-bold">
            <span>
              <b>Date:</b> ___/___/202_
            </span>
            <span className="text-red-600 font-bold">
              <b>Page:</b> 4-Line Notebook
            </span>
          </div>
        </div>

        {/* 4-Line Ruled Handwriting Rows Area */}
        <div className="p-4 sm:p-6 space-y-7 relative">
          {/* ROW 1: Large Demonstrator Letter in 4 Lines with Animated Guide */}
          <div className="relative pl-10 sm:pl-12">
            <div className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-1.5">
              <span>🌟 पंक्ति 1: मानक प्रारूप (Standard 4-Line Letter Height)</span>
              {sparkleCount > 0 && (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                  उत्कृष्ट लिखावट!
                </span>
              )}
            </div>

            {/* The 4 lines visual track */}
            <div className="relative w-full h-[120px] bg-white/70 dark:bg-slate-900/50 rounded-xl border border-slate-200/80 shadow-inner overflow-hidden">
              {/* Line 1: Top Red Line */}
              <div className="absolute top-[15px] left-0 right-0 border-t-2 border-red-500" />
              {/* Line 2: Waist Blue Dotted Line */}
              <div className="absolute top-[50px] left-0 right-0 border-t-2 border-dashed border-sky-500" />
              {/* Line 3: Base Blue Solid Line */}
              <div className="absolute top-[85px] left-0 right-0 border-t-2 border-sky-600" />
              {/* Line 4: Bottom Red Solid Line */}
              <div className="absolute top-[115px] left-0 right-0 border-t-2 border-red-500" />

              {/* Letters Positioned on 4 lines */}
              <div className="absolute inset-0 flex items-center justify-around px-4 pointer-events-none">
                {/* 1. Model Capital Letter */}
                <div className="relative flex flex-col items-center">
                  <span
                    className="font-serif font-black text-[96px] leading-[88px] text-slate-800 dark:text-slate-100 select-none"
                    style={{
                      transform: "translateY(-6px)",
                    }}
                  >
                    {displayChar}
                  </span>
                  <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 px-1.5 rounded -mt-2">
                    कैपिटल (Top 3 lines)
                  </span>
                </div>

                {/* 2. Model Small Letter */}
                <div className="relative flex flex-col items-center">
                  <span
                    className="font-serif font-black text-[60px] leading-[54px] text-slate-700 dark:text-slate-200 select-none"
                    style={{
                      transform: "translateY(12px)",
                    }}
                  >
                    {displaySmall}
                  </span>
                  <span className="text-[9px] font-black text-sky-700 dark:text-sky-400 bg-sky-100 px-1.5 rounded mt-3">
                    स्मॉल (Mid 2 lines)
                  </span>
                </div>

                {/* 3. Dotted Tracing Pattern for Kid */}
                <div className="relative flex flex-col items-center">
                  <span
                    className="font-serif font-black text-[96px] leading-[88px] text-slate-400/60 dark:text-slate-600 select-none tracking-widest border-b-2 border-dashed border-slate-300"
                    style={{
                      transform: "translateY(-6px)",
                    }}
                  >
                    {displayChar}
                  </span>
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 px-1.5 rounded -mt-2">
                    बिंदु ट्रेसिंग
                  </span>
                </div>

                {/* 4. Complete Word Example */}
                <div className="hidden sm:flex flex-col items-center justify-center">
                  <span
                    className="font-serif font-black text-3xl text-slate-700 dark:text-slate-300"
                    style={{ transform: "translateY(8px)" }}
                  >
                    {word}
                  </span>
                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mt-4">
                    {hindiWord}
                  </span>
                </div>
              </div>

              {/* Live Pencil Animation Wand Floating on Canvas */}
              {isAnimating && (
                <div
                  className="absolute pointer-events-none transition-all duration-75 z-30"
                  style={{
                    left: `${20 + (animProgress * 0.6)}%`,
                    top: `${15 + Math.sin(animProgress / 5) * 25}px`,
                  }}
                >
                  <div className="relative flex items-center">
                    <span className="text-3xl filter drop-shadow-md animate-pulse">✏️</span>
                    <span className="absolute -top-3 -right-2 text-xs text-amber-400 animate-spin">
                      ✨
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ROW 2: Interactive Handwriting Practice Track on 4-Line Grid */}
          <div className="relative pl-10 sm:pl-12">
            <div className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 mb-1 flex items-center justify-between">
              <span>✍️ पंक्ति 2: आपका हस्तलेखन अभ्यास (Your Practice Line - उंगली या माउस से लिखें)</span>
              <span className="text-slate-500 font-normal">
                {hasDrawn ? "✨ बहुत सुंदर!" : "👆 नीचे चार लाइनों पर लिखना शुरू करें"}
              </span>
            </div>

            <div className="relative w-full h-[120px] bg-white/90 dark:bg-slate-900/80 rounded-xl border-2 border-amber-300 dark:border-slate-600 shadow-md overflow-hidden cursor-crosshair">
              {/* Line 1: Top Red Line */}
              <div className="absolute top-[15px] left-0 right-0 border-t-2 border-red-500 pointer-events-none" />
              {/* Line 2: Waist Blue Dotted Line */}
              <div className="absolute top-[50px] left-0 right-0 border-t-2 border-dashed border-sky-500 pointer-events-none" />
              {/* Line 3: Base Blue Solid Line */}
              <div className="absolute top-[85px] left-0 right-0 border-t-2 border-sky-600 pointer-events-none" />
              {/* Line 4: Bottom Red Solid Line */}
              <div className="absolute top-[115px] left-0 right-0 border-t-2 border-red-500 pointer-events-none" />

              {/* Repeated Dotted Letters as Tracing Targets */}
              <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none opacity-40">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <span
                    key={idx}
                    className="font-serif font-black text-[96px] leading-[88px] text-slate-400 select-none"
                    style={{ transform: "translateY(-6px)" }}
                  >
                    {idx % 2 === 1 ? displayChar : displaySmall}
                  </span>
                ))}
              </div>

              {/* Real-time HTML5 Interactive Drawing Canvas Layer */}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="absolute inset-0 w-full h-full z-20 touch-none"
              />
            </div>
          </div>

          {/* ROW 3: Self-writing line with fewer hints */}
          <div className="relative pl-10 sm:pl-12">
            <div className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 mb-1">
              📝 पंक्ति 3: स्वतंत्र लेखन (Self-Practice Without Hints)
            </div>

            <div className="relative w-full h-[110px] bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden">
              <div className="absolute top-[12px] left-0 right-0 border-t-2 border-red-500" />
              <div className="absolute top-[45px] left-0 right-0 border-t-2 border-dashed border-sky-500" />
              <div className="absolute top-[78px] left-0 right-0 border-t-2 border-sky-600" />
              <div className="absolute top-[105px] left-0 right-0 border-t-2 border-red-500" />

              <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none opacity-20">
                <span className="font-serif text-6xl text-slate-400" style={{ transform: "translateY(-4px)" }}>
                  {displayChar}
                </span>
                <span className="font-serif text-4xl text-slate-400" style={{ transform: "translateY(8px)" }}>
                  {displaySmall}
                </span>
                <span className="font-serif text-6xl text-slate-400" style={{ transform: "translateY(-4px)" }}>
                  {displayChar}
                </span>
                <span className="font-serif text-4xl text-slate-400" style={{ transform: "translateY(8px)" }}>
                  {displaySmall}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notebook Pencil Box & Color Palette Toolbar */}
        <div className="bg-amber-100/70 dark:bg-slate-800/90 border-t-2 border-amber-300 dark:border-slate-700 p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>पेंसिल रंग चुनें:</span>
            </span>

            <div className="flex items-center gap-1.5">
              {[
                { color: "#1e293b", label: "पेंसिल ग्रेफाइट (Graphite)", bg: "bg-slate-800" },
                { color: "#2563eb", label: "रॉयल ब्लू पेन (Blue Pen)", bg: "bg-blue-600" },
                { color: "#dc2626", label: "रूबी रेड पेंसिल (Ruby Red)", bg: "bg-red-600" },
                { color: "#16a34a", label: "एमराल्ड ग्रीन (Green)", bg: "bg-emerald-600" },
                { color: "#d97706", label: "गोल्डन स्टार (Gold)", bg: "bg-amber-500" },
              ].map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onClick={() => {
                    setPencilColor(item.color);
                    setIsErasing(false);
                  }}
                  className={`w-6 h-6 rounded-full ${item.bg} border-2 transition-transform ${
                    pencilColor === item.color && !isErasing
                      ? "scale-125 border-slate-900 dark:border-white shadow-md"
                      : "border-white dark:border-slate-600 hover:scale-110"
                  }`}
                  title={item.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsErasing(!isErasing)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isErasing
                  ? "bg-rose-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>रबर (Eraser)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const link = document.createElement("a");
                link.download = `BalVikas_4Line_${displayChar}_Practice.png`;
                link.href = canvas.toDataURL();
                link.click();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>डाउनलोड अभ्यास</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step-by-Step Writing Stroke Instructions */}
      {strokes && strokes.length > 0 && (
        <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border-2 border-amber-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>अक्षर '{displayChar}' को 4-लाइन में लिखने के सही चरण (Step-by-Step Stroke Order):</span>
            </span>
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) {
                  playAudioText(strokes.join(". "), "hi-IN");
                }
              }}
              className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>निर्देश सुनें</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            {strokes.map((stroke, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-slate-900/60 border border-amber-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-start gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-snug">{stroke}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
