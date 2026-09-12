import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Sparkles,
  Volume2,
  CheckCircle2,
  Eye,
  FileText,
  Layers,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Book,
  VolumeX,
  UserCheck,
} from "lucide-react";
import { UserProfile } from "../types";
import { playAudioText, stopAudioText } from "../utils/speech";
import { PDF_PAGES_META, PdfPageMeta } from "../data/pdfPagesData";
import { IOISRunningHeader } from "./IOISRunningHeader";

interface PdfViewerSectionProps {
  user: UserProfile | null;
  onOpenAuth: (mode?: "login" | "register") => void;
  language: "hi" | "en";
  soundEnabled: boolean;
}

export const PdfViewerSection: React.FC<PdfViewerSectionProps> = ({
  user,
  onOpenAuth,
  language,
  soundEnabled,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isReading, setIsReading] = useState<boolean>(false);
  const [viewSpread, setViewSpread] = useState<boolean>(false); // Single vs 2-page spread
  const printableRef = useRef<HTMLDivElement>(null);

  const totalPages = 48;
  const isUserAuthenticated = Boolean(user && user.paymentStatus !== "pending");
  const isLocked = !isUserAuthenticated;

  // Sync keyboard navigation for realistic book reader
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing in search or inputs
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        setCurrentPage((p) => Math.min(totalPages, p + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setCurrentPage((p) => Math.max(1, p - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const playSpeech = (text: string, lang: "hi-IN" | "en-US" = "hi-IN") => {
    if (!soundEnabled) return;
    if (!isUserAuthenticated) {
      onOpenAuth("login");
      return;
    }
    setIsReading(true);
    playAudioText(text, lang);
    setTimeout(() => setIsReading(false), 4000);
  };

  const handleStopSpeech = () => {
    stopAudioText();
    setIsReading(false);
  };

  const handlePrint = () => {
    if (!isUserAuthenticated) {
      onOpenAuth("login");
      return;
    }
    window.print();
  };

  const handleDownload = () => {
    if (!isUserAuthenticated) {
      onOpenAuth("register");
      return;
    }
    // Generate clean printable document
    window.print();
  };

  const currentPageMeta: PdfPageMeta =
    PDF_PAGES_META.find((m) => m.page === currentPage) || PDF_PAGES_META[0];

  // Helper to read current whole page aloud
  const handleReadCurrentPageAloud = () => {
    if (currentPage === 1) {
      playSpeech(
        "आई ओ आई एस बाल विकास डिजिटल अध्ययन किट, कक्षा 1 से 5 हेतु संपूर्ण प्राथमिक पाठ्यक्रम। भारत हमारा देश है, हम सब भारतवासी भाई-बहन हैं।"
      );
    } else if (currentPage === 2) {
      playSpeech("स्वर वर्णमाला। अ से अनार, आ से आम, इ से इमली, ई से ईख।");
    } else if (currentPage === 3) {
      playSpeech("उ से उल्लू, ऊ से ऊन, ऋ से ऋषि, ए से एड़ी, ऐ से ऐनक, ओ से ओखली, औ से औरत, अं से अंगूर, अः खाली।");
    } else if (currentPage === 4) {
      playSpeech("व्यंजन वर्णमाला। क से कबूतर, ख से खरगोश, ग से गमला, घ से घड़ी, ङ खाली। च से चम्मच, छ से छाता, ज से जहाज, झ से झंडा, ञ खाली।");
    } else if (currentPage === 5) {
      playSpeech("Good English Alphabet. A for Apple, B for Ball, C for Cat, D for Dog, E for Elephant.");
    } else {
      playSpeech(`पृष्ठ संख्या ${currentPage}, ${currentPageMeta.titleHi}`);
    }
  };

  // Filtered thumbnails based on search
  const filteredThumbnails = PDF_PAGES_META.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.page.toString().includes(q) ||
      item.titleHi.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.sectionTitleHi.toLowerCase().includes(q)
    );
  });

  // Render individual page content styled precisely like the authentic printed PDF book
  const renderBookPage = (pageNumber: number) => {
    const meta = PDF_PAGES_META.find((m) => m.page === pageNumber) || PDF_PAGES_META[0];
    const pageIsProtected = !isUserAuthenticated;

    return (
      <div
        className="relative bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-300 mx-auto transition-transform duration-200"
        style={{
          width: "100%",
          maxWidth: `${Math.round(760 * (zoomLevel / 100))}px`,
          minHeight: `${Math.round(1020 * (zoomLevel / 100))}px`,
        }}
      >
        {/* Left Spine Gutter binding effect */}
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-amber-950/20 via-amber-900/10 to-transparent pointer-events-none z-10" />

        {/* Paper Corner fold simulation */}
        <div className="absolute top-0 right-0 border-t-[18px] border-r-[18px] border-t-amber-100 border-r-slate-300 pointer-events-none z-10" />

        {/* Outer Schoolbook Double Border */}
        <div className="p-4 sm:p-7 m-3 sm:m-4 border-2 border-amber-900/50 rounded-md bg-amber-50/15 flex flex-col justify-between min-h-[980px]">
          {/* Top Page Header (Indian Primary Schoolbook Style with IOIS Logo & Running Ticker) */}
          <div className="pb-3 border-b-2 border-amber-900/30 text-center space-y-2">
            {/* Running Heading Message Ticker on EVERY Page */}
            <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-800 text-white rounded-lg px-2.5 py-1 flex items-center gap-2 overflow-hidden shadow-sm border border-amber-400">
              <div className="flex items-center gap-1 bg-red-950/90 px-1.5 py-0.5 rounded text-[10px] font-black text-amber-300 shrink-0">
                <BookOpen className="w-3 h-3 text-amber-400" />
                <span>IOIS</span>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <div className="whitespace-nowrap animate-marquee text-[10px] font-bold text-amber-100 flex items-center gap-6">
                  <span className="text-yellow-200">
                    📢 जिसने ज्वाइन नहीं किया वह तुरंत ₹10 से नया रजिस्ट्रेशन करें और अपनी डिजिटल आईडी व संपूर्ण 48 पृष्ठ अध्ययन सामग्री प्राप्त करें!
                  </span>
                  <span>•</span>
                  <span>IOIS बाल विकास मंच • कक्षा 1 से 5 NCERT आधारित संपूर्ण पाठ्यक्रम • 24x7 हेल्पलाइन: +91 8877490845 • www.ioisplatform.github.io</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider pb-1">
              <span className="flex items-center gap-1.5 text-red-700 font-extrabold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block animate-pulse" />
                <span>IOIS बाल विकास के लिए अध्ययन सामग्री</span>
              </span>
              <span className="hidden sm:inline-block text-slate-600 font-semibold">
                NCERT आधारित प्राथमिक शिक्षा (कक्षा 1 से 5)
              </span>
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black">
                पृष्ठ {pageNumber} / {totalPages}
              </span>
            </div>
            <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600 my-1 rounded" />
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 mt-1 font-serif">
              {meta.titleHi}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium">{meta.titleEn}</p>
          </div>

          {/* Main Book Page Body - Clear for members, frosted & protected for unauthenticated / demo visitors */}
          <div
            className={`flex-1 py-4 sm:py-6 relative transition-all ${
              pageIsProtected ? "filter blur-md select-none pointer-events-none opacity-20" : ""
            }`}
          >
            {pageNumber === 1 && renderPage1Cover()}
            {pageNumber === 2 && renderPage2Swar1()}
            {pageNumber === 3 && renderPage3Swar2()}
            {pageNumber === 4 && renderPage4Vyanjan1()}
            {pageNumber === 5 && renderPage5English1()}
            {pageNumber >= 6 && pageNumber <= 10 && renderPageVyanjanSeries(pageNumber)}
            {pageNumber >= 11 && pageNumber <= 13 && renderPageWordsSeries(pageNumber)}
            {pageNumber >= 14 && pageNumber <= 20 && renderPageMatraSeries(pageNumber)}
            {pageNumber >= 21 && pageNumber <= 27 && renderPageEnglishSeries(pageNumber)}
            {pageNumber >= 28 && pageNumber <= 41 && renderPageGkSeries(pageNumber)}
            {pageNumber >= 42 && pageNumber <= 45 && renderPageMathSeries(pageNumber)}
            {pageNumber >= 46 && pageNumber <= 48 && renderPagePlansSeries(pageNumber)}
          </div>

          {/* Bottom Page Footer (Schoolbook Publishing Style) */}
          <div className="pt-3 border-t-2 border-amber-900/30 text-center text-[10px] sm:text-[11px] text-slate-600 flex items-center justify-between font-serif">
            <span>© IOIS बाल विकास मंच (प्रकाशक)</span>
            <span className="font-bold text-amber-900">
              — पृष्ठ {pageNumber} —
            </span>
            <span>www.ioisplatform.github.io</span>
          </div>
        </div>

        {/* Protected Member Overlay on EVERY Page when unauthenticated / demo preview */}
        {pageIsProtected && (
          <div className="absolute inset-x-2 sm:inset-x-5 top-28 bottom-14 z-20 flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border-2 border-amber-500 shadow-2xl p-5 sm:p-7 text-center space-y-4">
              {/* Official IOIS Header Badge */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                    IOIS बाल विकास मंच
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold block">
                    प्राथमिक शिक्षा (NCERT कक्षा 1 से 5)
                  </span>
                </div>
              </div>

              {/* Warm Welcome Message */}
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800 p-2.5 rounded-xl border border-amber-200 dark:border-slate-700">
                <p className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                  🌟 <strong>स्वागतम! IOIS बाल विकास मंच पर आपका हार्दिक स्वागत है</strong>
                </p>
              </div>

              {/* Exact Core User Intent Notice */}
              <div className="space-y-2 text-left bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 leading-snug">
                      🔒 जब तक आप लॉगिन नहीं कीजिएगा, तब तक आपको पूरा स्ट्रक्चर व संपूर्ण सामग्री स्पष्ट नहीं दिखेगी।
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      <strong>पूरा प्लेटफार्म बेस्ट है!</strong> प्राथमिक शिक्षा (कक्षा 1 से 5) के सभी 48 पृष्ठों के साफ-साफ स्पष्ट अक्षर, सचित्र ज्ञान, मनोहर पोथी, गुड इंग्लिश, शुद्ध ऑडियो उच्चारण, लाइव ड्रॉइंग बोर्ड, अभ्यास टेस्ट और डिजिटल स्टूडेंट आईडी कार्ड जैसी <strong>सभी सुविधाओं का पूर्ण एक्सेस पाने के लिए कृपया जल्द से जल्द मात्र ₹10 में रजिस्ट्रेशन करके लॉगिन करें।</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Clear Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                <button
                  onClick={() => onOpenAuth("register")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                  <span>✨ नया रजिस्ट्रेशन करें (मात्र ₹10)</span>
                </button>

                <button
                  onClick={() => onOpenAuth("login")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs sm:text-sm border border-amber-400/40 shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>🔑 सदस्य लॉगिन करें</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2 px-1">
                <span>📌 वर्तमान पृष्ठ: {pageNumber} ({meta.titleHi})</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">लॉगिन के बाद 100% साफ व स्पष्ट</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // PAGE 1: Grand Official Cover & Preface
  const renderPage1Cover = () => (
    <div className="space-y-4 sm:space-y-5 text-center">
      <div className="inline-block p-2 px-4 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-widest border border-amber-300">
        प्राथमिक बाल विकास एवं स्वावलंबन प्रवेशिका
      </div>

      <div className="border-4 border-double border-amber-800/40 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-50/50 to-white shadow-inner">
        <h1 className="text-2xl sm:text-4xl font-black text-amber-900 tracking-wide font-serif">
          IOIS बाल विकास डिजिटल अध्ययन किट
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          कक्षा 1 से 5 के लिए सचित्र मनोहर पोथी, गुड इंग्लिश व प्राथमिक गणित
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-amber-800 font-bold mt-2 flex-wrap">
          <span className="bg-amber-200/70 px-2 py-0.5 rounded">48 पृष्ठ संपूर्ण पाठ्यक्रम</span>
          <span className="bg-amber-200/70 px-2 py-0.5 rounded">NCERT आधारित</span>
          <span className="bg-amber-200/70 px-2 py-0.5 rounded">ऑडियो गाइड युक्त</span>
        </div>
      </div>

      {/* National Pledge (प्रतिज्ञा) framed in primer style */}
      <div className="p-3 sm:p-4 rounded-xl border-2 border-red-800/30 bg-red-50/40 text-left space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-red-900 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            भारत की राष्ट्रीय प्रतिज्ञा (National Pledge)
          </span>
          <button
            onClick={() =>
              playSpeech(
                "भारत हमारा देश है। हम सब भारतवासी भाई-बहन हैं। हमें अपने देश से प्रेम है। इसकी समृद्ध और विविध संस्कृति पर हमें गर्व है। हम सदा इसके सुयोग्य अधिकारी बनने का प्रयत्न करते रहेंगे।"
              )
            }
            className="text-[11px] font-bold text-red-700 hover:text-red-900 flex items-center gap-1"
          >
            <Volume2 className="w-3 h-3" />
            <span>सुनें</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic bg-white p-3 rounded-lg border border-red-200">
          "भारत हमारा देश है। हम सब भारतवासी भाई-बहन हैं। हमें अपने देश से प्रेम है। इसकी समृद्ध और विविध संस्कृति पर हमें गर्व है। हम सदा इसके सुयोग्य अधिकारी बनने का प्रयत्न करते रहेंगे। हम अपने माता-पिता, शिक्षकों और गुरुजनों का आदर करेंगे और सबके साथ शिष्टता का व्यवहार करेंगे।"
        </p>
      </div>

      {/* National Symbols Primer Box */}
      <div className="p-3 sm:p-4 rounded-xl border-2 border-sky-800/30 bg-sky-50/40 text-left space-y-2">
        <span className="text-xs font-black text-sky-900 uppercase tracking-wider block">
          हमारे राष्ट्रीय प्रतीक (Our National Symbols)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { icon: "🇮🇳", title: "राष्ट्रीय ध्वज", name: "तिरंगा (Tricolor)" },
            { icon: "🪷", title: "राष्ट्रीय पुष्प", name: "कमल (Lotus)" },
            { icon: "🐅", title: "राष्ट्रीय पशु", name: "बाघ (Tiger)" },
            { icon: "🦚", title: "राष्ट्रीय पक्षी", name: "मोर (Peacock)" },
            { icon: "🥭", title: "राष्ट्रीय फल", name: "आम (Mango)" },
            { icon: "🌳", title: "राष्ट्रीय वृक्ष", name: "बरगद (Banyan)" },
            { icon: "🪙", title: "राष्ट्रीय चिह्न", name: "अशोक स्तम्भ" },
            { icon: "🎶", title: "राष्ट्रगान", name: "जन-गण-मन" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-2 bg-white rounded-lg border border-sky-200 flex items-center gap-2"
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <span className="font-bold block text-slate-900 text-[11px]">{item.title}</span>
                <span className="text-[10px] text-slate-600">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // PAGE 2: Swar Part 1 (अ, आ, इ, ई)
  const renderPage2Swar1 = () => (
    <div className="space-y-4">
      <div className="text-center bg-amber-100/60 p-2 rounded-lg border border-amber-200 text-xs font-bold text-amber-900">
        स्वर वर्णमाला (भाग 1) — वर्ण को देखें, बोलें व सचित्र तुकबंदी याद करें
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {[
          {
            letter: "अ",
            word: "अनार",
            en: "Pomegranate",
            emoji: "🍎",
            rhyme: "अ से अनार, लाल-लाल दानेदार, खाने में मीठा और सेहतदार।",
            matra: "कोई मात्रा नहीं",
          },
          {
            letter: "आ",
            word: "आम",
            en: "Mango",
            emoji: "🥭",
            rhyme: "आ से आम, फलों का राजा, मीठा-रसदार खाओ ताजा।",
            matra: "मात्रा: ा (जैसे: क + ा = का)",
          },
          {
            letter: "इ",
            word: "इमली",
            en: "Tamarind",
            emoji: "🍃",
            rhyme: "इ से इमली, खट्टी-मीठी, खाने पर चटपटी लागे।",
            matra: "मात्रा: ि (जैसे: क + ि = कि)",
          },
          {
            letter: "ई",
            word: "ईख",
            en: "Sugarcane",
            emoji: "🎋",
            rhyme: "ई से ईख, गन्ने का रस, पीकर मन हो जाए मस्त।",
            matra: "मात्रा: ी (जैसे: क + ी = की)",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => playSpeech(`${item.letter} से ${item.word}. ${item.rhyme}`)}
            className="p-3.5 bg-white rounded-xl border-2 border-red-300 hover:border-red-500 shadow-sm cursor-pointer transition-all hover:shadow text-center flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl sm:text-5xl font-black text-red-600 font-serif">
                {item.letter}
              </span>
              <span className="text-3xl sm:text-4xl">{item.emoji}</span>
            </div>
            <div className="my-2">
              <span className="text-lg font-extrabold text-slate-900 block font-serif">
                {item.word}
              </span>
              <span className="text-xs text-slate-500 font-medium">({item.en})</span>
            </div>
            <div className="p-2 bg-amber-50 rounded text-[11px] text-amber-900 font-medium italic border border-amber-200">
              "{item.rhyme}"
            </div>
            <span className="text-[10px] text-slate-600 font-mono mt-2 block bg-slate-100 py-0.5 rounded">
              {item.matra}
            </span>
          </div>
        ))}
      </div>

      <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs space-y-1">
        <span className="font-bold text-red-900 block">लेखन अभ्यास निर्देश:</span>
        <p className="text-slate-700 leading-relaxed">
          विद्यार्थी देवनागरी की शिरोरेखा (ऊपर की क्षैतिज रेखा) को सीधा खींचें और बाईं ओर से दाईं ओर गोलाकार वक्र बनाते हुए अक्षर लिखें।
        </p>
      </div>
    </div>
  );

  // PAGE 3: Swar Part 2 (उ से अः)
  const renderPage3Swar2 = () => (
    <div className="space-y-4">
      <div className="text-center bg-teal-100/60 p-2 rounded-lg border border-teal-200 text-xs font-bold text-teal-900">
        स्वर वर्णमाला (भाग 2) — उ, ऊ, ऋ, ए, ऐ, ओ, औ, अं, अः व संपूर्ण मात्रा ज्ञान
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
        {[
          { l: "उ", w: "उल्लू", emoji: "🦉", en: "Owl", m: "ु (छोटा उ)" },
          { l: "ऊ", w: "ऊन", emoji: "🧶", en: "Wool", m: "ू (बड़ा ऊ)" },
          { l: "ऋ", w: "ऋषि", emoji: "🧘", en: "Sage", m: "ृ (ऋ)" },
          { l: "ए", w: "एड़ी", emoji: "🦶", en: "Heel", m: "े (ए)" },
          { l: "ऐ", w: "ऐनक", emoji: "👓", en: "Spectacles", m: "ै (ऐ)" },
          { l: "ओ", w: "ओखली", emoji: "🥣", en: "Mortar", m: "ो (ओ)" },
          { l: "औ", w: "औरत", emoji: "👩", en: "Woman", m: "ौ (औ)" },
          { l: "अं", w: "अंगूर", emoji: "🍇", en: "Grapes", m: "ं (अनुस्वार)" },
          { l: "अः", w: "खाली", emoji: "✨", en: "Aha", m: "ः (विसर्ग)" },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => playSpeech(`${item.l} से ${item.w}`)}
            className="p-2.5 bg-white rounded-xl border-2 border-teal-200 hover:border-teal-400 text-center cursor-pointer shadow-sm"
          >
            <span className="text-2xl sm:text-3xl font-black text-teal-700 block font-serif">
              {item.l}
            </span>
            <span className="text-2xl my-1 block">{item.emoji}</span>
            <span className="font-extrabold text-xs text-slate-900 block font-serif">
              {item.w}
            </span>
            <span className="text-[10px] text-teal-800 font-mono block mt-1 bg-teal-50 py-0.5 rounded">
              {item.m}
            </span>
          </div>
        ))}
      </div>

      {/* Matra Reference Bar */}
      <div className="p-3 bg-white border-2 border-slate-300 rounded-xl space-y-1.5">
        <span className="text-xs font-black text-slate-900 block">
          हिंदी की 12 मात्राओं का सारणी चार्ट (Matra Summary):
        </span>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 text-center text-xs">
          {["अ", "ा", "ि", "ी", "ु", "ू", "ृ", "े", "ै", "ो", "ौ", "ं"].map((m, i) => (
            <div key={i} className="p-1 bg-amber-50 rounded border border-amber-200 font-bold">
              <span className="block text-red-600 font-serif">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // PAGE 4: Vyanjan Part 1 (क वर्ग व च वर्ग)
  const renderPage4Vyanjan1 = () => (
    <div className="space-y-4">
      <div className="text-center bg-indigo-100/60 p-2 rounded-lg border border-indigo-200 text-xs font-bold text-indigo-900">
        व्यंजन वर्णमाला (कंठ्य व तालव्य वर्ग) — क, ख, ग, घ, ङ • च, छ, ज, झ, ञ
      </div>

      <div className="space-y-3">
        <div className="border border-indigo-200 rounded-xl p-3 bg-indigo-50/30">
          <span className="text-xs font-black text-indigo-900 uppercase block mb-2">
            क वर्ग (कंठ्य ध्वनियां)
          </span>
          <div className="grid grid-cols-5 gap-2">
            {[
              { l: "क", w: "कबूतर", em: "🕊️", en: "Pigeon" },
              { l: "ख", w: "खरगोश", em: "🐇", en: "Rabbit" },
              { l: "ग", w: "गमला", em: "🪴", en: "Pot" },
              { l: "घ", w: "घड़ी", em: "⏰", en: "Clock" },
              { l: "ङ", w: "खाली", em: "⚪", en: "Blank" },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => playSpeech(`${item.l} से ${item.w}`)}
                className="p-2 bg-white rounded-lg border border-indigo-200 text-center cursor-pointer hover:border-indigo-400 shadow-sm"
              >
                <span className="text-2xl font-black text-indigo-700 block font-serif">{item.l}</span>
                <span className="text-xl my-0.5 block">{item.em}</span>
                <span className="text-[11px] font-bold text-slate-800 block">{item.w}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-purple-200 rounded-xl p-3 bg-purple-50/30">
          <span className="text-xs font-black text-purple-900 uppercase block mb-2">
            च वर्ग (तालव्य ध्वनियां)
          </span>
          <div className="grid grid-cols-5 gap-2">
            {[
              { l: "च", w: "चम्मच", em: "🥄", en: "Spoon" },
              { l: "छ", w: "छाता", em: "☂️", en: "Umbrella" },
              { l: "ज", w: "जहाज", em: "🚢", en: "Ship" },
              { l: "झ", w: "झंडा", em: "🚩", en: "Flag" },
              { l: "ञ", w: "खाली", em: "⚪", en: "Blank" },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => playSpeech(`${item.l} से ${item.w}`)}
                className="p-2 bg-white rounded-lg border border-purple-200 text-center cursor-pointer hover:border-purple-400 shadow-sm"
              >
                <span className="text-2xl font-black text-purple-700 block font-serif">{item.l}</span>
                <span className="text-xl my-0.5 block">{item.em}</span>
                <span className="text-[11px] font-bold text-slate-800 block">{item.w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // PAGE 5: Good English Primer (A to E) with 4-line handwriting ruling simulation
  const renderPage5English1 = () => (
    <div className="space-y-4">
      <div className="text-center bg-blue-100/60 p-2 rounded-lg border border-blue-200 text-xs font-bold text-blue-900">
        Good English Primer — 4-Line Copybook Practice & Phonics Sounds (Aa to Ee)
      </div>

      <div className="space-y-3">
        {[
          { upper: "A", lower: "a", word: "Apple", emoji: "🍎", phonics: "ऐ (æ)", meaning: "सेब" },
          { upper: "B", lower: "b", word: "Ball", emoji: "⚽", phonics: "ब (b)", meaning: "गेंद" },
          { upper: "C", lower: "c", word: "Cat", emoji: "🐱", phonics: "क (k)", meaning: "बिल्ली" },
          { upper: "D", lower: "d", word: "Dog", emoji: "🐶", phonics: "ड (d)", meaning: "कुत्ता" },
          { upper: "E", lower: "e", word: "Elephant", emoji: "🐘", phonics: "ए (e)", meaning: "हाथी" },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => playSpeech(`${item.upper} for ${item.word}`, "en-US")}
            className="p-2.5 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-400 shadow-sm flex items-center justify-between gap-3 cursor-pointer"
          >
            {/* 4-Line Notebook Ruling simulation */}
            <div className="flex-1 bg-amber-50/20 p-2 rounded border border-slate-200 relative overflow-hidden">
              <div className="border-b border-red-400 h-3" />
              <div className="border-b border-blue-400 h-3 flex items-center">
                <span className="text-xl sm:text-2xl font-black font-mono text-blue-800 tracking-wider">
                  {item.upper} {item.lower}
                </span>
              </div>
              <div className="border-b border-blue-400 h-3" />
              <div className="border-b border-red-400 h-3" />
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl block">{item.emoji}</span>
              <span className="font-extrabold text-xs text-slate-900 block">{item.word}</span>
              <span className="text-[10px] text-blue-700 font-bold block">
                Phonics: {item.phonics} • {item.meaning}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950">
        <span className="font-bold block mb-1">इंग्लिश 4-लाइन कॉपी का नियम:</span>
        <p>
          कैपिटल लेटर्स हमेशा ऊपर की तीन लाइनों (रेड से नीचे की ब्लू लाइन तक) में लिखे जाते हैं।
        </p>
      </div>
    </div>
  );

  // PAGES 6 to 10: Vyanjan Remaining (Ta, Tha, Da, Dha, Na, Pa, Sanyukt, etc.)
  const renderPageVyanjanSeries = (page: number) => {
    let groupTitle = "व्यंजन ट वर्ग व त वर्ग";
    let items = [
      { l: "ट", w: "टमाटर", em: "🍅", en: "Tomato" },
      { l: "ठ", w: "ठठेरा", em: "🔨", en: "Coppersmith" },
      { l: "ड", w: "डमरू", em: "🪘", en: "Small drum" },
      { l: "ढ", w: "ढक्कन", em: "🥫", en: "Lid" },
      { l: "ण", w: "बाण", em: "🏹", en: "Arrow" },
      { l: "त", w: "तरबूज", em: "🍉", en: "Watermelon" },
      { l: "थ", w: "थर्मस", em: "🍶", en: "Thermos" },
      { l: "द", w: "दवात", em: "🖋️", en: "Inkpot" },
      { l: "ध", w: "धनुष", em: "🏹", en: "Bow" },
      { l: "न", w: "नल", em: "🚰", en: "Tap" },
    ];

    if (page === 8) {
      groupTitle = "व्यंजन प वर्ग (प, फ, ब, भ, म)";
      items = [
        { l: "प", w: "पतंग", em: "🪁", en: "Kite" },
        { l: "फ", w: "फल", em: "🍎", en: "Fruits" },
        { l: "ब", w: "बकरी", em: "🐐", en: "Goat" },
        { l: "भ", w: "भालू", em: "🐻", en: "Bear" },
        { l: "म", w: "मछली", em: "🐟", en: "Fish" },
      ];
    } else if (page === 9) {
      groupTitle = "अन्तःस्थ व ऊष्म व्यंजन (य, र, ल, व • श, ष, स, ह)";
      items = [
        { l: "य", w: "यज्ञ", em: "🔥", en: "Sacrifice" },
        { l: "र", w: "रथ", em: "🛞", en: "Chariot" },
        { l: "ल", w: "लट्टू", em: "🪀", en: "Spinning top" },
        { l: "व", w: "वक", em: "🪿", en: "Crane" },
        { l: "श", w: "शलगम", em: "🥬", en: "Turnip" },
        { l: "ष", w: "षट्कोण", em: "🔷", en: "Hexagon" },
        { l: "स", w: "सपेरा", em: "🐍", en: "Snake charmer" },
        { l: "ह", w: "हाथी", em: "🐘", en: "Elephant" },
      ];
    } else if (page === 10) {
      groupTitle = "संयुक्त व्यंजन (क्ष, त्र, ज्ञ, श्र) एवं अतिरिक्त वर्ण";
      items = [
        { l: "क्ष", w: "क्षत्रिय", em: "⚔️", en: "Warrior" },
        { l: "त्र", w: "त्रिशूल", em: "🔱", en: "Trident" },
        { l: "ज्ञ", w: "ज्ञानी", em: "📚", en: "Scholar" },
        { l: "श्र", w: "श्रमिक", em: "👷", en: "Worker" },
        { l: "ड़", w: "सड़क", em: "🛣️", en: "Road" },
        { l: "ढ़", w: "पढ़ना", em: "📖", en: "Reading" },
      ];
    }

    return (
      <div className="space-y-4">
        <div className="text-center bg-amber-100/60 p-2 rounded-lg border border-amber-200 text-xs font-bold text-amber-900">
          {groupTitle} — सचित्र अभ्यास एवं उच्चारण
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {items.map((it, idx) => (
            <div
              key={idx}
              onClick={() => playSpeech(`${it.l} से ${it.w}`)}
              className="p-3 bg-white rounded-xl border border-amber-200 text-center cursor-pointer hover:border-amber-500 shadow-sm"
            >
              <span className="text-3xl font-black text-amber-800 block font-serif">{it.l}</span>
              <span className="text-2xl my-1 block">{it.em}</span>
              <span className="font-extrabold text-xs text-slate-800 block font-serif">{it.w}</span>
              <span className="text-[10px] text-slate-500">{it.en}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // PAGES 11 to 13: 2, 3, 4 Letter Words
  const renderPageWordsSeries = (page: number) => {
    let wordList = [
      { hi: "नल", en: "Tap", ex: "न + ल = नल" },
      { hi: "घर", en: "Home", ex: "घ + र = घर" },
      { hi: "जल", en: "Water", ex: "ज + ल = जल" },
      { hi: "फल", en: "Fruit", ex: "फ + ल = फल" },
      { hi: "बस", en: "Bus", ex: "ब + स = बस" },
      { hi: "रथ", en: "Chariot", ex: "र + थ = रथ" },
      { hi: "खत", en: "Letter", ex: "ख + त = खत" },
      { hi: "जग", en: "Jug", ex: "ज + ग = जग" },
    ];
    if (page === 12) {
      wordList = [
        { hi: "कमल", en: "Lotus", ex: "क + म + ल = कमल" },
        { hi: "मटर", en: "Peas", ex: "म + ट + र = मटर" },
        { hi: "कलश", en: "Pot", ex: "क + ल + श = कलश" },
        { hi: "कलम", en: "Pen", ex: "क + ल + म = कलम" },
        { hi: "सड़क", en: "Road", ex: "स + ड़ + क = सड़क" },
        { hi: "भवन", en: "Building", ex: "भ + व + न = भवन" },
      ];
    } else if (page === 13) {
      wordList = [
        { hi: "अचकन", en: "Coat", ex: "अ + च + क + न = अचकन" },
        { hi: "बरगद", en: "Banyan", ex: "ब + र + ग + द = बरगद" },
        { hi: "कसरत", en: "Exercise", ex: "क + स + र + त = कसरत" },
        { hi: "उपवन", en: "Garden", ex: "उ + प + व + न = उपवन" },
        { hi: "शलजम", en: "Turnip", ex: "श + ल + ज + म = शलजम" },
        { hi: "थर्मस", en: "Flask", ex: "थ + र + म + स = थर्मस" },
      ];
    }

    return (
      <div className="space-y-4">
        <div className="text-center bg-emerald-100/60 p-2 rounded-lg border border-emerald-200 text-xs font-bold text-emerald-900">
          अमात्रिक शब्द रचना अभ्यास — वर्णों को जोड़कर शब्द पढ़ें
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {wordList.map((w, idx) => (
            <div
              key={idx}
              onClick={() => playSpeech(w.hi)}
              className="p-3 bg-white rounded-xl border-2 border-emerald-200 text-center cursor-pointer hover:border-emerald-500 shadow-sm"
            >
              <span className="text-2xl font-black text-emerald-800 block font-serif">{w.hi}</span>
              <span className="text-xs font-bold text-slate-700 block mt-1">{w.ex}</span>
              <span className="text-[10px] text-slate-400">({w.en})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // PAGES 14 to 20: Matra Series
  const renderPageMatraSeries = (page: number) => {
    return (
      <div className="space-y-4">
        <div className="text-center bg-violet-100/60 p-2 rounded-lg border border-violet-200 text-xs font-bold text-violet-900">
          मात्रा अभ्यास एवं वाक्य पठन (NCERT Primary Hindi Grade 1-2)
        </div>
        <div className="p-4 bg-white rounded-2xl border border-violet-200 space-y-3">
          <h4 className="font-extrabold text-sm text-violet-950 font-serif">
            {currentPageMeta.titleHi}
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            विद्यार्थी मात्राओं के सही उच्चारण एवं स्थान का ध्यान रखें। मात्रा हमेशा वर्ण के साथ मिलकर नया ध्वनि रूप बनाती है।
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {["राधा आम खा", "तारा चमक रहा", "राजा बाजा बजा", "माला पहन कर आ"].map((s, idx) => (
              <div
                key={idx}
                onClick={() => playSpeech(s)}
                className="p-2 bg-violet-50 rounded-lg text-xs font-bold text-violet-900 text-center cursor-pointer border border-violet-100"
              >
                "{s}"
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // PAGES 21 to 27: Good English Series (F to Z & Rhymes)
  const renderPageEnglishSeries = (page: number) => {
    return (
      <div className="space-y-4">
        <div className="text-center bg-sky-100/60 p-2 rounded-lg border border-sky-200 text-xs font-bold text-sky-900">
          Good English Phonics, Vocabulary & 3-Letter Rhyming Words
        </div>
        <div className="p-4 bg-white rounded-2xl border border-sky-200 space-y-3">
          <h4 className="font-extrabold text-sm text-sky-950">{currentPageMeta.titleHi}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { en: "Cat / Bat / Mat", rh: "-at family", em: "🐱 🦇" },
              { en: "Pen / Hen / Ten", rh: "-en family", em: "🖊️ 🐔" },
              { en: "Pin / Tin / Win", rh: "-in family", em: "📍 🥫" },
              { en: "Dog / Fog / Log", rh: "-og family", em: "🐶 🪵" },
              { en: "Sun / Run / Bun", rh: "-un family", em: "☀️ 🏃" },
              { en: "Cup / Pup / Up", rh: "-up family", em: "☕ 🐶" },
            ].map((r, i) => (
              <div
                key={i}
                onClick={() => playSpeech(r.en, "en-US")}
                className="p-3 bg-sky-50/50 rounded-xl border border-sky-200 text-center cursor-pointer hover:border-sky-400"
              >
                <span className="text-lg block mb-1">{r.em}</span>
                <span className="font-extrabold text-xs text-slate-900 block">{r.en}</span>
                <span className="text-[10px] text-sky-700 font-bold">{r.rh}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // PAGES 28 to 41: GK Series with specific curriculum matching uploaded booklet
  const renderPageGkSeries = (page: number) => {
    // Dynamic mapping for every GK page
    let gkItems: { nameHi: string; nameEn: string; em: string }[] = [];
    let sectionSubtitle = "";

    if (page === 28) {
      sectionSubtitle = "सचित्र फल (Fruits) — मीठे और रसीले फल";
      gkItems = [
        { nameHi: "आम", nameEn: "Mango", em: "🥭" },
        { nameHi: "सेब", nameEn: "Apple", em: "🍎" },
        { nameHi: "केला", nameEn: "Banana", em: "🍌" },
        { nameHi: "अंगूर", nameEn: "Grapes", em: "🍇" },
        { nameHi: "संतरा", nameEn: "Orange", em: "🍊" },
        { nameHi: "अनानास", nameEn: "Pineapple", em: "🍍" },
        { nameHi: "पपीता", nameEn: "Papaya", em: "🍈" },
        { nameHi: "तरबूज", nameEn: "Watermelon", em: "🍉" },
      ];
    } else if (page === 29) {
      sectionSubtitle = "सचित्र सब्जियां (Vegetables) — पौष्टिक हरी सब्जियां";
      gkItems = [
        { nameHi: "आलू", nameEn: "Potato", em: "🥔" },
        { nameHi: "टमाटर", nameEn: "Tomato", em: "🍅" },
        { nameHi: "मटर", nameEn: "Peas", em: "🫛" },
        { nameHi: "प्याज", nameEn: "Onion", em: "🧅" },
        { nameHi: "गाजर", nameEn: "Carrot", em: "🥕" },
        { nameHi: "बैंगन", nameEn: "Brinjal", em: "🍆" },
        { nameHi: "गोभी", nameEn: "Cauliflower", em: "🥦" },
        { nameHi: "पालक", nameEn: "Spinach", em: "🥬" },
      ];
    } else if (page === 30) {
      sectionSubtitle = "सचित्र फूल (Flowers) — सुंदर और सुगंधित फूल";
      gkItems = [
        { nameHi: "कमल", nameEn: "Lotus", em: "🪷" },
        { nameHi: "गुलाब", nameEn: "Rose", em: "🌹" },
        { nameHi: "गेंदा", nameEn: "Marigold", em: "🌼" },
        { nameHi: "सूरजमुखी", nameEn: "Sunflower", em: "🌻" },
        { nameHi: "गुड़हल", nameEn: "Hibiscus", em: "🌺" },
        { nameHi: "चमेली", nameEn: "Jasmine", em: "🌸" },
      ];
    } else if (page === 31) {
      sectionSubtitle = "पालतू पशु (Domestic Animals) — हमारे उपयोगी मित्र";
      gkItems = [
        { nameHi: "गाय", nameEn: "Cow", em: "🐄" },
        { nameHi: "भैंस", nameEn: "Buffalo", em: "🐃" },
        { nameHi: "बकरी", nameEn: "Goat", em: "🐐" },
        { nameHi: "घोड़ा", nameEn: "Horse", em: "🐎" },
        { nameHi: "कुत्ता", nameEn: "Dog", em: "🐕" },
        { nameHi: "बिल्ली", nameEn: "Cat", em: "🐈" },
        { nameHi: "भेड़", nameEn: "Sheep", em: "🐑" },
        { nameHi: "ऊंट", nameEn: "Camel", em: "🐪" },
      ];
    } else if (page === 32) {
      sectionSubtitle = "जंगली जानवर (Wild Animals) — वन के जीव";
      gkItems = [
        { nameHi: "शेर", nameEn: "Lion", em: "🦁" },
        { nameHi: "बाघ", nameEn: "Tiger", em: "🐅" },
        { nameHi: "हाथी", nameEn: "Elephant", em: "🐘" },
        { nameHi: "भालू", nameEn: "Bear", em: "🐻" },
        { nameHi: "चीता", nameEn: "Cheetah", em: "🐆" },
        { nameHi: "हिरण", nameEn: "Deer", em: "🦌" },
        { nameHi: "लोमड़ी", nameEn: "Fox", em: "🦊" },
        { nameHi: "बंदर", nameEn: "Monkey", em: "🐒" },
      ];
    } else if (page === 33) {
      sectionSubtitle = "सचित्र पक्षी (Birds) — गगन के पंछी";
      gkItems = [
        { nameHi: "मोर (राष्ट्रीय पक्षी)", nameEn: "Peacock", em: "🦚" },
        { nameHi: "तोता", nameEn: "Parrot", em: "🦜" },
        { nameHi: "कबूतर", nameEn: "Pigeon", em: "🕊️" },
        { nameHi: "कौआ", nameEn: "Crow", em: "🐦‍⬛" },
        { nameHi: "चिड़िया", nameEn: "Sparrow", em: "🐦" },
        { nameHi: "बत्तख", nameEn: "Duck", em: "🦆" },
        { nameHi: "चील", nameEn: "Eagle", em: "🦅" },
        { nameHi: "उल्लू", nameEn: "Owl", em: "🦉" },
      ];
    } else if (page === 34) {
      sectionSubtitle = "जलचर व कीट (Water Animals & Insects)";
      gkItems = [
        { nameHi: "मछली", nameEn: "Fish", em: "🐟" },
        { nameHi: "मेंढक", nameEn: "Frog", em: "🐸" },
        { nameHi: "कछुआ", nameEn: "Tortoise", em: "🐢" },
        { nameHi: "केकड़ा", nameEn: "Crab", em: "🦀" },
        { nameHi: "तितली", nameEn: "Butterfly", em: "🦋" },
        { nameHi: "मधुमक्खी", nameEn: "Honeybee", em: "🐝" },
        { nameHi: "चींटी", nameEn: "Ant", em: "🐜" },
        { nameHi: "मच्छर", nameEn: "Mosquito", em: "🦟" },
      ];
    } else if (page === 35) {
      sectionSubtitle = "यातायात के साधन (Vehicles) — परिवहन व्यवस्था";
      gkItems = [
        { nameHi: "कार", nameEn: "Car", em: "🚗" },
        { nameHi: "बस", nameEn: "Bus", em: "🚌" },
        { nameHi: "रेलगाड़ी", nameEn: "Train", em: "🚆" },
        { nameHi: "हवाई जहाज", nameEn: "Aeroplane", em: "✈️" },
        { nameHi: "साइकिल", nameEn: "Bicycle", em: "🚲" },
        { nameHi: "मोटरसाइकिल", nameEn: "Motorcycle", em: "🏍️" },
        { nameHi: "नाव / जहाज", nameEn: "Boat/Ship", em: "🚢" },
        { nameHi: "ट्रैक्टर", nameEn: "Tractor", em: "🚜" },
      ];
    } else if (page === 36) {
      sectionSubtitle = "शरीर के प्रमुख अंग (Parts of Body)";
      gkItems = [
        { nameHi: "आंख (देखना)", nameEn: "Eyes", em: "👁️" },
        { nameHi: "कान (सुनना)", nameEn: "Ears", em: "👂" },
        { nameHi: "नाक (सूंघना)", nameEn: "Nose", em: "👃" },
        { nameHi: "मुंह (बोलना)", nameEn: "Mouth", em: "👄" },
        { nameHi: "दांत (चबाना)", nameEn: "Teeth", em: "🦷" },
        { nameHi: "हाथ (कार्य)", nameEn: "Hands", em: "✋" },
        { nameHi: "पैर (चलना)", nameEn: "Legs", em: "🦶" },
        { nameHi: "सिर", nameEn: "Head", em: "🧠" },
      ];
    } else if (page === 37) {
      sectionSubtitle = "रंग एवं आकृतियां (Colors & Shapes)";
      gkItems = [
        { nameHi: "लाल रंग", nameEn: "Red", em: "🔴" },
        { nameHi: "नीला रंग", nameEn: "Blue", em: "🔵" },
        { nameHi: "पीला रंग", nameEn: "Yellow", em: "🟡" },
        { nameHi: "हरा रंग", nameEn: "Green", em: "🟢" },
        { nameHi: "गोला (Circle)", nameEn: "Circle", em: "⭕" },
        { nameHi: "वर्ग (Square)", nameEn: "Square", em: "⬛" },
        { nameHi: "त्रिकोण (Triangle)", nameEn: "Triangle", em: "🔺" },
        { nameHi: "तारा (Star)", nameEn: "Star", em: "⭐" },
      ];
    } else if (page === 38) {
      sectionSubtitle = "ऋतुएं एवं मौसम (Seasons & Weather)";
      gkItems = [
        { nameHi: "ग्रीष्म (गर्मी)", nameEn: "Summer", em: "☀️" },
        { nameHi: "शीत (सर्दी)", nameEn: "Winter", em: "❄️" },
        { nameHi: "वर्षा (बरसात)", nameEn: "Monsoon", em: "🌧️" },
        { nameHi: "वसंत (बसंत)", nameEn: "Spring", em: "🌸" },
        { nameHi: "पतझड़", nameEn: "Autumn", em: "🍂" },
        { nameHi: "इंद्रधनुष", nameEn: "Rainbow", em: "🌈" },
      ];
    } else if (page === 39) {
      sectionSubtitle = "सप्ताह के 7 दिन (Days of the Week)";
      gkItems = [
        { nameHi: "सोमवार", nameEn: "Monday", em: "🌅" },
        { nameHi: "मंगलवार", nameEn: "Tuesday", em: "🚀" },
        { nameHi: "बुधवार", nameEn: "Wednesday", em: "🌿" },
        { nameHi: "गुरुवार (बृहस्पति)", nameEn: "Thursday", em: "📚" },
        { nameHi: "शुक्रवार", nameEn: "Friday", em: "🌟" },
        { nameHi: "शनिवार", nameEn: "Saturday", em: "🎮" },
        { nameHi: "रविवार (छुट्टी)", nameEn: "Sunday", em: "☀️" },
      ];
    } else if (page === 40) {
      sectionSubtitle = "वर्ष के 12 महीने (12 Months of the Year)";
      gkItems = [
        { nameHi: "जनवरी / फरवरी", nameEn: "Jan / Feb", em: "📅" },
        { nameHi: "मार्च / अप्रैल", nameEn: "Mar / Apr", em: "🌱" },
        { nameHi: "मई / जून", nameEn: "May / Jun", em: "☀️" },
        { nameHi: "जुलाई / अगस्त", nameEn: "Jul / Aug", em: "🌧️" },
        { nameHi: "सितंबर / अक्टूबर", nameEn: "Sep / Oct", em: "🍂" },
        { nameHi: "नवंबर / दिसंबर", nameEn: "Nov / Dec", em: "❄️" },
      ];
    } else {
      sectionSubtitle = "हमारे मददगार (Our Community Helpers)";
      gkItems = [
        { nameHi: "शिक्षक (Teacher)", nameEn: "Teacher", em: "🧑‍🏫" },
        { nameHi: "डॉक्टर (Doctor)", nameEn: "Doctor", em: "👨‍⚕️" },
        { nameHi: "पुलिस (Police)", nameEn: "Police", em: "👮" },
        { nameHi: "किसान (Farmer)", nameEn: "Farmer", em: "🧑‍🌾" },
        { nameHi: "सैनिक (Soldier)", nameEn: "Soldier", em: "🪖" },
        { nameHi: "डाकिया (Postman)", nameEn: "Postman", em: "📮" },
        { nameHi: "बढ़ई (Carpenter)", nameEn: "Carpenter", em: "🪵" },
        { nameHi: "दमकलकर्मी (Firefighter)", nameEn: "Firefighter", em: "🧑‍🚒" },
      ];
    }

    return (
      <div className="space-y-4">
        <div className="text-center bg-amber-100/70 p-2.5 rounded-xl border border-amber-300 text-xs font-black text-amber-900">
          {sectionSubtitle}
        </div>
        <div className="p-4 bg-white rounded-2xl border-2 border-amber-200/80 shadow-sm space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {gkItems.map((g, i) => (
              <div
                key={i}
                onClick={() => playSpeech(`${g.nameHi}, ${g.nameEn}`)}
                className="p-3 bg-gradient-to-b from-amber-50/50 to-orange-50/40 rounded-xl border-2 border-amber-200 text-center cursor-pointer hover:border-amber-500 hover:shadow-md transition-all active:scale-95"
              >
                <span className="text-3xl block mb-1 drop-shadow-sm">{g.em}</span>
                <span className="text-xs font-black text-slate-900 block font-serif">
                  {g.nameHi}
                </span>
                <span className="text-[10px] font-bold text-slate-500 block">
                  {g.nameEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // PAGES 42 to 45: Math Series with authentic counting & tables
  const renderPageMathSeries = (page: number) => {
    if (page === 42) {
      // 1 to 100 Counting Chart
      return (
        <div className="space-y-3">
          <div className="text-center bg-orange-100/70 p-2 rounded-xl border border-orange-300 text-xs font-black text-orange-950">
            1 से 100 तक गिनती चार्ट (1 to 100 Numbers & Counting)
          </div>
          <div className="p-3 bg-white rounded-2xl border-2 border-orange-200 overflow-x-auto">
            <div className="grid grid-cols-10 gap-1 sm:gap-1.5 text-center text-[11px] font-mono font-bold">
              {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                <div
                  key={num}
                  onClick={() => playSpeech(num.toString(), "hi-IN")}
                  className={`p-1.5 rounded-lg border cursor-pointer hover:scale-105 transition-transform ${
                    num % 10 === 0
                      ? "bg-orange-500 text-white font-black border-orange-600"
                      : "bg-orange-50/60 hover:bg-orange-100 text-slate-800 border-orange-200"
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (page === 43) {
      // 1 to 10 Multiplication Tables
      return (
        <div className="space-y-3">
          <div className="text-center bg-orange-100/70 p-2 rounded-xl border border-orange-300 text-xs font-black text-orange-950">
            1 से 10 तक पहाड़े (Multiplication Tables 1 to 10)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {[2, 3, 4, 5, 6].map((tableNum) => (
              <div key={tableNum} className="p-2.5 bg-white rounded-xl border-2 border-orange-200 shadow-sm text-center">
                <span className="font-black text-xs text-orange-800 block pb-1 border-b border-orange-100">
                  {tableNum} का पहाड़ा
                </span>
                <div className="space-y-0.5 pt-1 font-mono text-[11px]">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((multi) => (
                    <div
                      key={multi}
                      onClick={() => playSpeech(`${tableNum} times ${multi} is ${tableNum * multi}`, "en-US")}
                      className="hover:text-orange-600 cursor-pointer"
                    >
                      {tableNum} × {multi} = {tableNum * multi}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (page === 44) {
      // 11 to 20 Multiplication Tables
      return (
        <div className="space-y-3">
          <div className="text-center bg-orange-100/70 p-2 rounded-xl border border-orange-300 text-xs font-black text-orange-950">
            11 से 20 तक पहाड़े (Multiplication Tables 11 to 20)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {[11, 12, 13, 14, 15].map((tableNum) => (
              <div key={tableNum} className="p-2.5 bg-white rounded-xl border-2 border-orange-200 shadow-sm text-center">
                <span className="font-black text-xs text-orange-800 block pb-1 border-b border-orange-100">
                  {tableNum} का पहाड़ा
                </span>
                <div className="space-y-0.5 pt-1 font-mono text-[11px]">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((multi) => (
                    <div
                      key={multi}
                      onClick={() => playSpeech(`${tableNum} times ${multi} is ${tableNum * multi}`, "en-US")}
                      className="hover:text-orange-600 cursor-pointer"
                    >
                      {tableNum} × {multi} = {tableNum * multi}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Page 45: Basic Addition, Subtraction & Clock Time
    return (
      <div className="space-y-3">
        <div className="text-center bg-orange-100/70 p-2 rounded-xl border border-orange-300 text-xs font-black text-orange-950">
          सचित्र जोड़ (+), घटाव (-) एवं घड़ी का समय पठन
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border-2 border-orange-200 space-y-2">
            <span className="font-black text-xs text-orange-900 block border-b pb-1">
              ➕ सचित्र जोड़ अभ्यास (Addition)
            </span>
            <div className="space-y-1.5 font-mono text-sm">
              <div onClick={() => playSpeech("5 plus 3 equals 8")} className="p-1.5 bg-orange-50 rounded cursor-pointer">
                🍎🍎🍎🍎🍎 + 🍎🍎🍎 = <strong>8</strong> (5 + 3 = 8)
              </div>
              <div onClick={() => playSpeech("4 plus 4 equals 8")} className="p-1.5 bg-orange-50 rounded cursor-pointer">
                ⭐⭐⭐⭐ + ⭐⭐⭐⭐ = <strong>8</strong> (4 + 4 = 8)
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border-2 border-orange-200 space-y-2">
            <span className="font-black text-xs text-orange-900 block border-b pb-1">
              ⏰ घड़ी का समय पठन (Time Reading)
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              <div onClick={() => playSpeech("छोटी सुई 3 पर और बड़ी सुई 12 पर यानी 3 बजे")} className="p-2 bg-orange-50 rounded cursor-pointer">
                🕒 <strong>3:00 बजे</strong> — छोटी सुई 3 पर, बड़ी सुई 12 पर
              </div>
              <div onClick={() => playSpeech("छोटी सुई 6 पर और बड़ी सुई 12 पर यानी 6 बजे")} className="p-2 bg-orange-50 rounded cursor-pointer">
                🕕 <strong>6:00 बजे</strong> — छोटी सुई 6 पर, बड़ी सुई 12 पर
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // PAGES 46 to 48: Plans & Mission
  const renderPagePlansSeries = (page: number) => {
    return (
      <div className="space-y-4">
        <div className="text-center bg-red-100/60 p-2 rounded-lg border border-red-200 text-xs font-bold text-red-900">
          IOIS 7 सदस्यता प्लान्स, स्वावलंबन मिशन व कमीशन पेआउट चार्ट
        </div>
        <div className="p-4 bg-white rounded-2xl border border-red-200 space-y-3 text-left">
          <h4 className="font-extrabold text-sm text-red-950">{currentPageMeta.titleHi}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th className="p-2 border-b">प्लान का नाम</th>
                  <th className="p-2 border-b">शुल्क</th>
                  <th className="p-2 border-b">कमीशन</th>
                  <th className="p-2 border-b">डायरेक्ट पेआउट</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-bold">1st: Bal Vikas (Class 1-5)</td>
                  <td className="p-2 text-amber-700 font-bold">₹10</td>
                  <td className="p-2 font-bold text-emerald-600">70%</td>
                  <td className="p-2 font-bold">₹7 प्रति रेफर</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">2nd: Youth Skill Access</td>
                  <td className="p-2 text-blue-700 font-bold">₹49</td>
                  <td className="p-2 font-bold text-emerald-600">70%</td>
                  <td className="p-2 font-bold">₹34 प्रति रेफर</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">3rd: Career & Job Access</td>
                  <td className="p-2 text-emerald-700 font-bold">₹99</td>
                  <td className="p-2 font-bold text-emerald-600">65%</td>
                  <td className="p-2 font-bold">₹64 प्रति रेफर</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">4th: Family VIP Access</td>
                  <td className="p-2 text-indigo-700 font-bold">₹199</td>
                  <td className="p-2 font-bold text-emerald-600">60%</td>
                  <td className="p-2 font-bold">₹119 प्रति रेफर</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">5th: Student Exam Access</td>
                  <td className="p-2 text-violet-700 font-bold">₹299</td>
                  <td className="p-2 font-bold text-emerald-600">60%</td>
                  <td className="p-2 font-bold">₹179 प्रति रेफर</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">6th: Business & Skill Master</td>
                  <td className="p-2 text-pink-700 font-bold">₹499</td>
                  <td className="p-2 font-bold text-emerald-600">55%</td>
                  <td className="p-2 font-bold">₹274 प्रति रेफर</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">7th: All-in-One Lifetime Master</td>
                  <td className="p-2 text-amber-700 font-bold">₹999</td>
                  <td className="p-2 font-bold text-emerald-600">50%</td>
                  <td className="p-2 font-bold">₹499 प्रति रेफर</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-xs text-red-950 font-medium">
            हेल्पलाइन व समर्थन: +91 8877490845 • आधिकारिक पोर्टल: www.ioisplatform.github.io
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Official Top Running Header with IOIS Logo */}
      <IOISRunningHeader onJoinClick={() => onOpenAuth?.("register")} showJoinBtn={!user} />

      {/* 1. PDF Reader Application Bar (Adobe Acrobat / Chrome PDF style) */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20 backdrop-blur">
        {/* Left: Document Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-sm shadow-md">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-slate-100 tracking-wide">
                बाल विकास के लिए अध्ययन सामग्री (48 पृष्ठ संपूर्ण किट)
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                48 Pages Complete
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block truncate max-w-[240px] sm:max-w-md">
              {currentPageMeta.sectionTitleHi} • {currentPageMeta.titleHi}
            </span>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            title="पिछला पृष्ठ (Previous Page)"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-slate-800 px-2 sm:px-3 py-1 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">Page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1 && val <= totalPages) setCurrentPage(val);
              }}
              className="w-10 bg-slate-900 text-center font-bold text-amber-400 rounded px-1 py-0.5 border border-slate-600 focus:outline-none"
            />
            <span className="text-slate-400 font-bold">/ {totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            title="अगला पृष्ठ (Next Page)"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Tools (Zoom, Audio, Spread, Print, Thumbnails) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Audio Speech button */}
          <button
            onClick={isReading ? handleStopSpeech : handleReadCurrentPageAloud}
            title="पेज का ऑडियो सुनें"
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              isReading
                ? "bg-red-500 text-white animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-amber-300"
            }`}
          >
            {isReading ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isReading ? "रोकें" : "ऑडियो"}</span>
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-1.5 py-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              title="Zoom Out"
              className="p-1 text-slate-300 hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-amber-300 px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              title="Zoom In"
              className="p-1 text-slate-300 hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Thumbnails Sidebar Toggle */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            title="पेज सूची / थंबनेल"
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
              showThumbnails
                ? "bg-amber-500 text-slate-950"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden lg:inline">पेज ग्रिड</span>
          </button>

          {/* Print / Download Buttons */}
          <button
            onClick={handlePrint}
            title="प्रिंट करें (Print PDF Page)"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            title="PDF डाउनलोड / सेव"
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">डाउनलोड</span>
          </button>
        </div>
      </div>

      {/* 2. Main Reader Area with Thumbnails Drawer + Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Thumbnails Drawer (Can be toggled) */}
        {showThumbnails && (
          <aside
            aria-label="PDF Page Thumbnails"
            className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-md max-h-[850px] overflow-y-auto space-y-3 sticky top-36"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Book className="w-3.5 h-3.5 text-amber-600" />
                संपूर्ण 48 पृष्ठ सूची
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isUserAuthenticated ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {isUserAuthenticated ? "सभी 48 खुले" : "संरचना प्रिव्यू"}
              </span>
            </div>

            {/* Search within PDF */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="पेज या विषय खोजें..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Thumbnails List */}
            <div className="space-y-1.5">
              {filteredThumbnails.map((m) => {
                const isSelected = currentPage === m.page;
                const isPageLocked = !isUserAuthenticated;

                return (
                  <button
                    key={m.page}
                    onClick={() => setCurrentPage(m.page)}
                    className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-amber-500 text-white font-extrabold shadow-md scale-[1.02]"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-black shrink-0 ${
                          isSelected
                            ? "bg-white text-amber-900"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {m.page}
                      </span>
                      <div className="truncate">
                        <span className="block truncate text-[11px] font-bold">
                          {m.sectionTitleHi}
                        </span>
                        <span
                          className={`block text-[10px] truncate ${
                            isSelected ? "text-amber-100" : "text-slate-400"
                          }`}
                        >
                          {m.titleHi}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isPageLocked ? (
                        <Lock
                          className={`w-3.5 h-3.5 ${
                            isSelected ? "text-white" : "text-amber-600 dark:text-amber-400"
                          }`}
                        />
                      ) : (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            isSelected ? "text-emerald-200" : "text-emerald-500"
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Right Canvas: The Authentic Printed Book Page Sheet */}
        <section
          aria-label="PDF Document Page Viewer"
          className={`${
            showThumbnails ? "lg:col-span-9" : "lg:col-span-12"
          } bg-slate-950/90 rounded-3xl p-4 sm:p-8 shadow-2xl border border-slate-800 overflow-x-auto min-h-[900px] flex flex-col items-center justify-start`}
        >
          {/* Printable Page Container */}
          <div ref={printableRef} id="printable-pdf-page" className="w-full">
            {renderBookPage(currentPage)}
          </div>

          {/* Quick Page Jump Slider / Scrubber */}
          <div className="w-full max-w-2xl mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 font-bold hover:text-amber-400 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>पिछला पृष्ठ (Page {Math.max(1, currentPage - 1)})</span>
            </button>

            <span className="font-mono text-amber-300 font-bold">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 font-bold hover:text-amber-400 disabled:opacity-30"
            >
              <span>अगला पृष्ठ (Page {Math.min(totalPages, currentPage + 1)})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
