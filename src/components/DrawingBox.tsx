import React, { useRef, useState, useEffect } from "react";
import {
  PenTool,
  Eraser,
  RotateCcw,
  RotateCw,
  Download,
  Save,
  Sparkles,
  Palette,
  Stamp,
  Trash2,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { DrawingItem } from "../types";

interface DrawingBoxProps {
  language: "hi" | "en";
  savedDrawings: DrawingItem[];
  onSaveDrawing: (drawing: DrawingItem) => void;
  onDeleteDrawing: (id: string) => void;
}

export const DrawingBox: React.FC<DrawingBoxProps> = ({
  language,
  savedDrawings,
  onSaveDrawing,
  onDeleteDrawing,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"brush" | "eraser" | "stamp" | "rainbow">("brush");
  const [color, setColor] = useState("#EF4444"); // Red default
  const [brushSize, setBrushSize] = useState(8);
  const [selectedStamp, setSelectedStamp] = useState("⭐");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [rainbowHue, setRainbowHue] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  // Cheerful Kid Palette
  const COLOR_PALETTE = [
    "#EF4444", // Red
    "#F97316", // Orange
    "#F59E0B", // Amber
    "#EAB308", // Yellow
    "#84CC16", // Lime
    "#10B981", // Emerald
    "#06B6D4", // Cyan
    "#3B82F6", // Blue
    "#6366F1", // Indigo
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#F43F5E", // Rose
    "#78350F", // Brown
    "#000000", // Black
    "#64748B", // Slate
    "#FFFFFF", // White
  ];

  const STAMPS = ["⭐", "❤️", "😊", "☀️", "🍎", "🐘", "🐱", "🏆", "🌸", "🚗", "🚀", "🍦"];

  const TEMPLATES = [
    { name: "Apple", emoji: "🍎", path: "apple" },
    { name: "Flower", emoji: "🌸", path: "flower" },
    { name: "Fish", emoji: "🐟", path: "fish" },
    { name: "House", emoji: "🏠", path: "house" },
    { name: "Car", emoji: "🚗", path: "car" },
  ];

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, []);

  // Save history state for undo/redo
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imgData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const newStep = historyStep - 1;
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const newStep = historyStep + 1;
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  // Drawing Event Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (tool === "stamp") {
      ctx.font = `${brushSize * 4 + 20}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(selectedStamp, x, y);
      saveState();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === "stamp") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.strokeStyle = "#FFFFFF";
    } else if (tool === "rainbow") {
      ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 50%)`;
      setRainbowHue((prev) => (prev + 5) % 360);
    } else {
      ctx.strokeStyle = color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  // Load an Outline Template onto Canvas for coloring
  const loadTemplate = (templateName: string) => {
    clearCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    if (templateName === "Apple") {
      // Apple shape outline
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 35, canvas.height / 2 + 10, 60, 0, Math.PI * 2);
      ctx.arc(canvas.width / 2 + 35, canvas.height / 2 + 10, 60, 0, Math.PI * 2);
      ctx.stroke();
      // Stem & Leaf
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2 - 50);
      ctx.quadraticCurveTo(canvas.width / 2 + 20, canvas.height / 2 - 90, canvas.width / 2, canvas.height / 2 - 100);
      ctx.stroke();
    } else if (templateName === "Flower") {
      // Center circle
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, Math.PI * 2);
      ctx.stroke();
      // Petals
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = canvas.width / 2 + Math.cos(angle) * 75;
        const y = canvas.height / 2 + Math.sin(angle) * 75;
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (templateName === "Fish") {
      // Fish body
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, 100, 60, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Tail
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 + 90, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 + 140, canvas.height / 2 - 50);
      ctx.lineTo(canvas.width / 2 + 140, canvas.height / 2 + 50);
      ctx.closePath();
      ctx.stroke();
      // Eye
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 50, canvas.height / 2 - 15, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (templateName === "House") {
      // House body
      ctx.strokeRect(canvas.width / 2 - 80, canvas.height / 2 - 40, 160, 120);
      // Roof
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 100, canvas.height / 2 - 40);
      ctx.lineTo(canvas.width / 2, canvas.height / 2 - 120);
      ctx.lineTo(canvas.width / 2 + 100, canvas.height / 2 - 40);
      ctx.closePath();
      ctx.stroke();
      // Door & Window
      ctx.strokeRect(canvas.width / 2 - 20, canvas.height / 2 + 20, 40, 60);
      ctx.strokeRect(canvas.width / 2 + 35, canvas.height / 2 - 15, 30, 30);
    } else if (templateName === "Car") {
      // Car body
      ctx.strokeRect(canvas.width / 2 - 110, canvas.height / 2, 220, 50);
      // Car cabin
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 70, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 - 40, canvas.height / 2 - 40);
      ctx.lineTo(canvas.width / 2 + 50, canvas.height / 2 - 40);
      ctx.lineTo(canvas.width / 2 + 80, canvas.height / 2);
      ctx.stroke();
      // Wheels
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 60, canvas.height / 2 + 50, 20, 0, Math.PI * 2);
      ctx.arc(canvas.width / 2 + 60, canvas.height / 2 + 50, 20, 0, Math.PI * 2);
      ctx.stroke();
    }
    saveState();
  };

  // Download artwork as PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `IOIS-Bal-Vikas-Drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("ड्रॉइंग सफलतापूर्वक डाउनलोड हो गई! 🎨");
  };

  // Save to Gallery
  const handleSaveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const newDrawing: DrawingItem = {
      id: "draw_" + Date.now(),
      title: `Art #${savedDrawings.length + 1}`,
      dataUrl,
      createdAt: new Date().toISOString(),
    };
    onSaveDrawing(newDrawing);
    showToast("कला दीर्घा (Gallery) में सहेजा गया! ⭐");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              बाल कला दीर्घा (Kids Drawing Studio)
            </span>
            <span className="bg-yellow-300 text-yellow-950 px-2 py-0.5 rounded-full text-xs font-extrabold">
              ड्रॉइंग & कलरिंग बॉक्स
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            बच्चों का ड्रॉइंग और कलरिंग बॉक्स
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm mt-1.5 max-w-xl">
            मनपसंद रंगों, जादुई ब्रश, स्टैम्प और आउटलाइन चित्रों के साथ अपनी कल्पना को आकार दें!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToGallery}
            className="px-4 py-2 bg-white text-rose-600 font-extrabold rounded-2xl shadow-md text-xs sm:text-sm flex items-center gap-2 hover:bg-rose-50 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{language === "hi" ? "गैलरी में सहेजें" : "Save Art"}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-rose-900/40 hover:bg-rose-900/60 border border-white/20 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{language === "hi" ? "डाउनलोड करें" : "Download PNG"}</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-500 text-white rounded-2xl text-center font-bold text-xs sm:text-sm shadow-md animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Main Drawing Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Toolbar (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tools Box */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-xs uppercase text-slate-400 tracking-wider">
              टूल्स चुनें (Tools)
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTool("brush")}
                className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  tool === "brush"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>ब्रश</span>
              </button>

              <button
                onClick={() => setTool("eraser")}
                className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  tool === "eraser"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                <Eraser className="w-4 h-4" />
                <span>इरेज़र</span>
              </button>

              <button
                onClick={() => setTool("rainbow")}
                className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  tool === "rainbow"
                    ? "bg-gradient-to-r from-pink-500 via-amber-500 to-cyan-500 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>जादुई रेनबो</span>
              </button>

              <button
                onClick={() => setTool("stamp")}
                className={`p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  tool === "stamp"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                <Stamp className="w-4 h-4" />
                <span>स्टैम्प</span>
              </button>
            </div>

            {/* Brush Size */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>ब्रश मोटाई:</span>
                <span>{brushSize}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                className="w-full accent-rose-500"
              />
            </div>

            {/* Kid Stamps Palette */}
            {tool === "stamp" && (
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  पसंदीदा स्टैम्प चुनें:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {STAMPS.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStamp(st)}
                      className={`p-2 rounded-xl text-2xl transition-all ${
                        selectedStamp === st
                          ? "bg-rose-100 dark:bg-rose-950 border-2 border-rose-500 scale-110"
                          : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Palette (16 Colors) */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                रंग पैलेट (Color Palette):
              </span>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      if (tool === "eraser") setTool("brush");
                    }}
                    style={{ backgroundColor: c }}
                    className={`h-9 rounded-xl border border-slate-300 dark:border-slate-600 transition-transform flex items-center justify-center ${
                      color === c && tool === "brush" ? "scale-110 ring-2 ring-rose-500" : ""
                    }`}
                  >
                    {color === c && tool === "brush" && (
                      <Check className={`w-4 h-4 ${c === "#FFFFFF" || c === "#EAB308" ? "text-black" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Coloring Templates */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                आउटलाइन चित्र (रंग भरने हेतु):
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.name}
                    onClick={() => loadTemplate(tmpl.name)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex flex-col items-center gap-1"
                  >
                    <span className="text-xl">{tmpl.emoji}</span>
                    <span>{tmpl.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Drawing Canvas (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-3">
            {/* Action Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={undo}
                  disabled={historyStep <= 0}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-200 flex items-center gap-1 text-xs font-bold"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Undo</span>
                </button>
                <button
                  onClick={redo}
                  disabled={historyStep >= history.length - 1}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-200 flex items-center gap-1 text-xs font-bold"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Redo</span>
                </button>
              </div>

              <button
                onClick={clearCanvas}
                className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-200 flex items-center gap-1 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>साफ करें (Clear)</span>
              </button>
            </div>

            {/* The Canvas */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center bg-slate-50">
              <canvas
                ref={canvasRef}
                width={800}
                height={520}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="touch-none cursor-crosshair w-full max-w-full h-[520px] bg-white object-contain"
              />
            </div>
          </div>

          {/* Student's Saved Art Gallery */}
          {savedDrawings.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-500" />
                <span>मेरी कला दीर्घा (My Saved Artworks)</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {savedDrawings.map((art) => (
                  <div
                    key={art.id}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-1"
                  >
                    <img
                      src={art.dataUrl}
                      alt={art.title}
                      className="w-full aspect-video object-contain rounded-xl bg-white"
                    />
                    <div className="p-1.5 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300 truncate">
                        {art.title}
                      </span>
                      <button
                        onClick={() => onDeleteDrawing(art.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
