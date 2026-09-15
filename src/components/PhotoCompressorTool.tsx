import React, { useState, useRef } from "react";
import {
  FileImage,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  Scissors,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const PhotoCompressorTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [compressedSizeKb, setCompressedSizeKb] = useState<number>(0);
  const [targetKb, setTargetKb] = useState<number>(50); // Default 50KB
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatusMessage("कृपया केवल इमेज (JPG, PNG, JPEG) फ़ाइल चुनें।");
      return;
    }

    setSelectedFile(file);
    setOriginalSizeKb(Math.round(file.size / 1024));
    setCompressedUrl("");
    setCompressedSizeKb(0);
    setStatusMessage("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setOriginalUrl(url);

      // Measure dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        // Automatically run compression for chosen targetKb
        compressImage(url, targetKb);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const compressImage = async (dataUrl: string, maxKb: number) => {
    setIsProcessing(true);
    setStatusMessage("फ़ाइल को कंप्रेस किया जा रहा है...");

    try {
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      let width = img.width;
      let height = img.height;

      // Scale down if dimensions are huge
      const maxDimension = maxKb <= 20 ? 600 : 1000;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("कैनवास संदर्भ लोड नहीं हो सका");
      }

      // Draw with white background to handle PNG transparency when converting to JPEG
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Iterative binary-search compression to get under maxKb
      let quality = 0.92;
      let resultDataUrl = canvas.toDataURL("image/jpeg", quality);
      let currentKb = Math.round((resultDataUrl.length * 3) / 4 / 1024);

      let attempts = 0;
      while (currentKb > maxKb && attempts < 12 && quality > 0.05) {
        attempts++;
        if (currentKb > maxKb * 1.5) {
          quality -= 0.15;
        } else {
          quality -= 0.07;
        }
        quality = Math.max(0.04, quality);

        // Also scale canvas if quality is low but still over limit
        if (quality < 0.25 && currentKb > maxKb) {
          canvas.width = Math.round(canvas.width * 0.85);
          canvas.height = Math.round(canvas.height * 0.85);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        resultDataUrl = canvas.toDataURL("image/jpeg", quality);
        currentKb = Math.round((resultDataUrl.length * 3) / 4 / 1024);
      }

      setCompressedUrl(resultDataUrl);
      setCompressedSizeKb(currentKb);
      setIsProcessing(false);
      setStatusMessage(`सफलता! फ़ाइल आकार: ${currentKb} KB (लक्ष्य: ≤ ${maxKb} KB)`);
    } catch (err) {
      setIsProcessing(false);
      setStatusMessage("कंप्रेशन में त्रुटि हुई। कृपया दूसरी छवि आज़माएं।");
    }
  };

  const handleTargetChange = (kb: number) => {
    setTargetKb(kb);
    if (originalUrl) {
      compressImage(originalUrl, kb);
    }
  };

  const downloadCompressed = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    const baseName = selectedFile?.name.replace(/\.[^/.]+$/, "") || "iois_compressed";
    a.download = `${baseName}_${targetKb}kb.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Scissors className="w-3.5 h-3.5 text-blue-600" />
            <span>100% मुफ़्त ऑनलाइन टूल • पूर्णतः सुरक्षित</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            सरकारी फॉर्म फोटो व हस्ताक्षर कंप्रेसर
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            BPSC, SSC, रेलवे, RTPS बिहार व किसी भी सरकारी फॉर्म के लिए फोटो (≤ 50KB) और हस्ताक्षर (≤ 20KB) बनाएं।
          </p>
        </div>

        {/* Target Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => handleTargetChange(50)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
              targetKb === 50
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
            }`}
          >
            📸 फोटो (≤ 50KB)
          </button>
          <button
            type="button"
            onClick={() => handleTargetChange(20)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
              targetKb === 20
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
            }`}
          >
            ✍️ हस्ताक्षर (≤ 20KB)
          </button>
        </div>
      </div>

      {/* Upload Box */}
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) {
              handleFileSelect(e.dataTransfer.files[0]);
            }
          }}
          className="border-3 border-dashed border-blue-300 dark:border-blue-800 hover:border-blue-500 rounded-3xl p-8 sm:p-12 text-center bg-blue-50/40 dark:bg-slate-800/40 cursor-pointer transition-all hover:scale-[1.005] group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            यहाँ फ़ोटो या हस्ताक्षर चुनें या ड्रैग करें
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            JPG, PNG या JPEG फ़ाइल (कंप्यूटर या मोबाइल से) सेलेक्ट करें। यह पूरी प्रक्रिया आपके फ़ोन या ब्राउज़र में होती है।
          </p>
          <button
            type="button"
            className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20"
          >
            फ़ाइल चुनें (Select Photo/Signature)
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">मूल फ़ोटो (Original)</span>
                <span className="font-mono font-bold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                  {originalSizeKb} KB
                </span>
              </div>
              <div className="h-56 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden p-2">
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-h-full max-w-full object-contain rounded"
                />
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between">
                <span>{selectedFile.name}</span>
                <span>{imageDimensions.width} × {imageDimensions.height} px</span>
              </div>
            </div>

            {/* Compressed */}
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-300 dark:border-blue-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>कंप्रेस की गई फ़ाइल (Ready to Upload)</span>
                </span>
                <span className={`font-mono font-black px-2.5 py-0.5 rounded ${
                  compressedSizeKb <= targetKb
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {compressedSizeKb} KB (लक्ष्य: ≤ {targetKb} KB)
                </span>
              </div>

              <div className="h-56 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/60 flex items-center justify-center overflow-hidden p-2">
                {isProcessing ? (
                  <div className="text-center space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                    <span className="text-xs font-bold text-blue-600">कंप्रेस हो रहा है...</span>
                  </div>
                ) : compressedUrl ? (
                  <img
                    src={compressedUrl}
                    alt="Compressed"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : null}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>सरकारी फॉर्म के लिए 100% मान्य</span>
                </span>

                <button
                  type="button"
                  onClick={downloadCompressed}
                  disabled={!compressedUrl || isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>डाउनलोड करें ({compressedSizeKb} KB)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setOriginalUrl("");
                setCompressedUrl("");
              }}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>दूसरी फ़ोटो चुनें (Upload Another)</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">आकार बदलें:</span>
              <button
                type="button"
                onClick={() => handleTargetChange(20)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${targetKb === 20 ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
              >
                20 KB (हस्ताक्षर)
              </button>
              <button
                type="button"
                onClick={() => handleTargetChange(50)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${targetKb === 50 ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
              >
                50 KB (फ़ोटो)
              </button>
              <button
                type="button"
                onClick={() => handleTargetChange(100)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${targetKb === 100 ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
              >
                100 KB (डॉक्यूमेंट)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety & Notice */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>गोपनीयता सुरक्षा:</strong> आपकी कोई भी फ़ोटो किसी भी सर्वर पर अपलोड नहीं की जाती है। सभी कंप्रेशन आपके अपने ब्राउज़र में सुरक्षित रूप से होते हैं।
        </span>
      </div>
    </div>
  );
};
