import React, { useState, useEffect } from "react";
import {
  Tv,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
  Image as ImageIcon,
  Award,
  Users,
  Building,
} from "lucide-react";

interface SmartTvGalleryModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SmartTvGalleryModal: React.FC<SmartTvGalleryModalProps> = ({ onClose }) => {
  const [tvMode, setTvMode] = useState<"slideshow" | "gallery">("slideshow");
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Smart TV educational slides
  const TV_SLIDES = [
    {
      title: "वर्णमाला: अ से अनार",
      subtitle: "मीठा-मीठा लाल अनार, खाकर हम बनते होशियार!",
      icon: "🍎",
      color: "from-rose-500 to-red-600",
      speech: "अ से अनार, मीठा लाल अनार",
      funFact: "अनार में भरपूर विटामिन सी और आयरन होता है जो हमें ताकत देता है।",
    },
    {
      title: "Alphabet: A for Apple",
      subtitle: "An Apple a day keeps the doctor away!",
      icon: "🍏",
      color: "from-emerald-500 to-teal-600",
      speech: "A for Apple, sweet and crunchy fruit",
      funFact: "There are over 7,500 varieties of apples grown worldwide.",
    },
    {
      title: "गणित की दुनिया: 1 से 10 तक गिनती",
      subtitle: "1 सूरज, 2 आंखें, 3 पहिए, 4 दिशाएं!",
      icon: "🔢",
      color: "from-amber-500 to-orange-600",
      speech: "एक दो तीन चार, आओ मिलकर गिनें यार",
      funFact: "शून्य (Zero) का आविष्कार भारत के महान गणितज्ञ आर्यभट्ट ने किया था।",
    },
    {
      title: "हमारा प्यारा भारत (India)",
      subtitle: "तिरंगा हमारा राष्ट्रीय ध्वज है • सत्यमेव जयते",
      icon: "🇮🇳",
      color: "from-blue-600 to-indigo-700",
      speech: "सारे जहाँ से अच्छा, हिन्दोस्ताँ हमारा",
      funFact: "भारत का राष्ट्रीय पशु बाघ (Tiger) और राष्ट्रीय पक्षी मोर (Peacock) है।",
    },
    {
      title: "स्वास्थ्य एवं स्वच्छता (Good Habits)",
      subtitle: "प्रतिदिन दो बार ब्रश करें और हाथ साबुन से धोएं!",
      icon: "🪥",
      color: "from-sky-500 to-cyan-600",
      speech: "साफ-सफाई रखो सदा, रोग नहीं आएगा कभी",
      funFact: "हाथ 20 सेकंड तक अच्छी तरह धोने से कीटाणु नष्ट हो जाते हैं।",
    },
  ];

  // Official Gallery Photos / Events
  const GALLERY_PHOTOS = [
    {
      title: "IOIS डिजिटल बाल विकास किट विमोचन",
      category: "अध्ययन किट",
      caption: "700+ पृष्ठों की मनोहर पोथी व डिजिटल वर्कबुक का शुभारंभ",
      icon: "📖",
    },
    {
      title: "ग्रामीण डिजिटल साक्षरता कार्यशाला",
      category: "वर्कशॉप",
      caption: "बिहार व उत्तर प्रदेश के 10,000+ विद्यार्थियों को मुफ्त कंप्यूटर गाइडेंस",
      icon: "💻",
    },
    {
      title: "प्रतिभा सम्मान व मेधावी छात्रवृत्ति",
      category: "सम्मान",
      caption: "उत्कृष्ट प्रदर्शन करने वाले सदस्यों को राष्ट्रीय सम्मान व पदक",
      icon: "🏅",
    },
    {
      title: "महिला स्वावलंबन व स्वरोजगार केंद्र",
      category: "सशक्तिकरण",
      caption: "माताओं और बहनों को घर बैठे डिजिटल आय व सेवा केंद्र प्रशिक्षण",
      icon: "👩‍💼",
    },
  ];

  // Auto-play timer for Smart TV
  useEffect(() => {
    if (!isPlaying || tvMode !== "slideshow") return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % TV_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, tvMode]);

  // Text-to-speech for Smart TV narration
  const speakCurrentSlide = (text: string) => {
    if (isAudioMuted || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const handleNextSlide = () => {
    const nextIdx = (currentSlideIndex + 1) % TV_SLIDES.length;
    setCurrentSlideIndex(nextIdx);
    speakCurrentSlide(TV_SLIDES[nextIdx].speech);
  };

  const handlePrevSlide = () => {
    const prevIdx = (currentSlideIndex - 1 + TV_SLIDES.length) % TV_SLIDES.length;
    setCurrentSlideIndex(prevIdx);
    speakCurrentSlide(TV_SLIDES[prevIdx].speech);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Tv className="w-6 h-6 text-amber-500" />
            <span>स्मार्ट टीवी व्यू & फोटो एल्बम</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            बड़ी स्क्रीन (स्मार्ट टीवी / टैबलेट) के लिए ऑटोमैटिक शैक्षणिक स्लाइड शो एवं IOIS ईवेंट एल्बम
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTvMode("slideshow")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              tvMode === "slideshow"
                ? "bg-amber-500 text-slate-950 shadow"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            📺 स्मार्ट टीवी स्लाइड शो
          </button>
          <button
            type="button"
            onClick={() => setTvMode("gallery")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              tvMode === "gallery"
                ? "bg-amber-500 text-slate-950 shadow"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            🖼️ फोटो गैलरी व एल्बम
          </button>
        </div>
      </div>

      {/* VIEW 1: SMART TV SLIDESHOW */}
      {tvMode === "slideshow" && (
        <div className="space-y-4">
          {/* 16:9 TV Screen Frame */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 dark:border-slate-700 bg-slate-950 flex flex-col justify-between p-6 sm:p-10 text-white select-none">
            {/* Ambient Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${TV_SLIDES[currentSlideIndex].color} opacity-90 transition-all duration-700`}
            />

            {/* TV Brand Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/40 text-xs font-mono font-bold tracking-wider">
                  IOIS SMART TV • HD 1080p
                </span>
                <span className="text-xs text-white/80 font-bold hidden sm:inline">
                  {currentSlideIndex + 1} / {TV_SLIDES.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white transition-colors"
                  title="ध्वनि चालू/बंद"
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white transition-colors"
                  title={isPlaying ? "रोकें" : "चलाएं"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Slide Core Content */}
            <div className="relative z-10 text-center my-auto space-y-4">
              <span className="text-6xl sm:text-8xl md:text-9xl block drop-shadow-2xl animate-bounce">
                {TV_SLIDES[currentSlideIndex].icon}
              </span>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black drop-shadow-lg tracking-tight">
                {TV_SLIDES[currentSlideIndex].title}
              </h3>
              <p className="text-sm sm:text-xl font-bold text-white/95 max-w-2xl mx-auto drop-shadow">
                {TV_SLIDES[currentSlideIndex].subtitle}
              </p>
              <div className="inline-block px-4 py-1.5 rounded-2xl bg-black/30 backdrop-blur-sm text-xs text-white/90">
                💡 {TV_SLIDES[currentSlideIndex].funFact}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="relative z-10 flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="px-4 py-2 rounded-2xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला</span>
              </button>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {TV_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentSlideIndex(i);
                      speakCurrentSlide(TV_SLIDES[i].speech);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      currentSlideIndex === i ? "w-8 bg-white" : "w-2 bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextSlide}
                className="px-4 py-2 rounded-2xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs flex items-center gap-1"
              >
                <span>अगला</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PHOTO GALLERY */}
      {tvMode === "gallery" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GALLERY_PHOTOS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-4 hover:border-amber-400 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl shrink-0">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
            प्रत्येक जिले में आयोजित होने वाले प्रतिभा सम्मान समारोह एवं बाल विकास शिविरों की विस्तृत तस्वीरें सदस्य डैशबोर्ड में उपलब्ध हैं।
          </div>
        </div>
      )}
    </div>
  );
};
