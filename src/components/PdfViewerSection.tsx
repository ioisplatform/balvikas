import React, { useState } from "react";
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
} from "lucide-react";
import { UserProfile } from "../types";
import { playAudioText } from "../utils/speech";

interface PdfViewerSectionProps {
  user: UserProfile | null;
  onOpenAuth: (mode?: "login" | "register") => void;
  language: "hi" | "en";
  soundEnabled: boolean;
}

interface PdfPageContent {
  pageNumber: number;
  titleHi: string;
  titleEn: string;
  category: "intro" | "hindi" | "english" | "gk" | "math" | "plans";
  descriptionHi: string;
  descriptionEn: string;
  previewContent: React.ReactNode;
}

export const PdfViewerSection: React.FC<PdfViewerSectionProps> = ({
  user,
  onOpenAuth,
  language,
  soundEnabled,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 48;
  const freePagesLimit = 5;

  const isLocked = !user && currentPage > freePagesLimit;

  const playSpeech = (text: string, lang: "hi-IN" | "en-US" = "hi-IN") => {
    if (soundEnabled) {
      playAudioText(text, lang);
    }
  };

  // 48 Pages Curriculum Representation matching user's uploaded Bal Vikas PDF
  const renderPageContent = (page: number) => {
    switch (page) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-amber-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                पृष्ठ 1 / 48 • प्राथमिक परिचय
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mt-3">
                IOIS बाल विकास डिजिटल अध्ययन किट
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
                कक्षा 1 से 5 के लिए NCERT पर आधारित संपूर्ण बुनियादी शिक्षण सामग्री • मनोहर पोथी, गुड इंग्लिश व प्रारंभिक गणित
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-amber-50/70 dark:bg-slate-800/80 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>भारत की राष्ट्रीय प्रतिज्ञा (National Pledge)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-100 dark:border-slate-800">
                  "भारत हमारा देश है। हम सब भारतवासी भाई-बहन हैं। हमें अपने देश से प्रेम है। इसकी समृद्ध और विविध संस्कृति पर हमें गर्व है। हम सदा इसके सुयोग्य अधिकारी बनने का प्रयत्न करते रहेंगे।"
                </p>
                <button
                  onClick={() =>
                    playSpeech("भारत हमारा देश है। हम सब भारतवासी भाई-बहन हैं। हमें अपने देश से प्रेम है।")
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>प्रतिज्ञा सुनें</span>
                </button>
              </div>

              <div className="p-5 bg-sky-50/70 dark:bg-slate-800/80 rounded-2xl border border-sky-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>हमारे राष्ट्रीय प्रतीक (National Symbols)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-slate-800 flex items-center gap-2">
                    <span className="text-xl">🪷</span>
                    <div>
                      <span className="font-bold block">राष्ट्रीय फूल</span>
                      <span className="text-[11px] text-slate-500">कमल (Lotus)</span>
                    </div>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-slate-800 flex items-center gap-2">
                    <span className="text-xl">🐅</span>
                    <div>
                      <span className="font-bold block">राष्ट्रीय पशु</span>
                      <span className="text-[11px] text-slate-500">बाघ (Tiger)</span>
                    </div>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-slate-800 flex items-center gap-2">
                    <span className="text-xl">🦚</span>
                    <div>
                      <span className="font-bold block">राष्ट्रीय पक्षी</span>
                      <span className="text-[11px] text-slate-500">मोर (Peacock)</span>
                    </div>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-sky-100 dark:border-slate-800 flex items-center gap-2">
                    <span className="text-xl">🥭</span>
                    <div>
                      <span className="font-bold block">राष्ट्रीय फल</span>
                      <span className="text-[11px] text-slate-500">आम (Mango)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center pb-3 border-b border-amber-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                पृष्ठ 2 / 48 • हिंदी स्वर ज्ञान (अ, आ, इ, ई)
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">
                स्वर वर्णमाला भाग 1 (Swar Vowels)
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { letter: "अ", word: "अनार", en: "Pomegranate", emoji: "🍎", note: "अ से अनार, लाल-लाल दानेदार" },
                { letter: "आ", word: "आम", en: "Mango", emoji: "🥭", note: "आ से आम, फलों का राजा" },
                { letter: "इ", word: "इमली", en: "Tamarind", emoji: "🍃", note: "इ से इमली, खट्टी-मीठी" },
                { letter: "ई", word: "ईख", en: "Sugarcane", emoji: "🎋", note: "ई से ईख, मीठा रसदार" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => playSpeech(`${item.letter} से ${item.word}`)}
                  className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-emerald-100 dark:border-slate-700 text-center hover:border-emerald-400 cursor-pointer shadow-sm hover:shadow transition-all"
                >
                  <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 block mb-1">
                    {item.letter}
                  </span>
                  <span className="text-3xl block my-1">{item.emoji}</span>
                  <span className="font-extrabold text-sm block text-slate-800 dark:text-slate-200">
                    {item.word}
                  </span>
                  <span className="text-[11px] text-slate-400 block">{item.en}</span>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-2 bg-emerald-50 dark:bg-slate-900 p-1.5 rounded-lg">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center pb-3 border-b border-amber-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-widest text-teal-600 bg-teal-100 dark:bg-teal-950/60 px-3 py-1 rounded-full">
                पृष्ठ 3 / 48 • हिंदी स्वर ज्ञान (उ से अः)
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">
                स्वर वर्णमाला भाग 2 (उ, ऊ, ऋ, ए, ऐ, ओ, औ, अं, अः)
              </h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {[
                { letter: "उ", word: "उल्लू", emoji: "🦉", en: "Owl" },
                { letter: "ऊ", word: "ऊन", emoji: "🧶", en: "Wool" },
                { letter: "ऋ", word: "ऋषि", emoji: "🧘", en: "Sage" },
                { letter: "ए", word: "एड़ी", emoji: "🦶", en: "Heel" },
                { letter: "ऐ", word: "ऐनक", emoji: "👓", en: "Spectacles" },
                { letter: "ओ", word: "ओखली", emoji: "🥣", en: "Mortar" },
                { letter: "औ", word: "औरत", emoji: "👩", en: "Woman" },
                { letter: "अं", word: "अंगूर", emoji: "🍇", en: "Grapes" },
                { letter: "अः", word: "खाली", emoji: "✨", en: "Aha" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => playSpeech(`${item.letter} से ${item.word}`)}
                  className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-teal-100 dark:border-slate-700 text-center hover:border-teal-400 cursor-pointer shadow-sm"
                >
                  <span className="text-2xl font-black text-teal-600 dark:text-teal-400 block">
                    {item.letter}
                  </span>
                  <span className="text-2xl my-0.5 block">{item.emoji}</span>
                  <span className="font-bold text-xs block text-slate-700 dark:text-slate-300">
                    {item.word}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.en}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center pb-3 border-b border-amber-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                पृष्ठ 4 / 48 • Good English Part 1 (A to E)
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">
                English Alphabet & Phonics Introduction
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { letter: "A", ex1: "Apple", ex2: "Ant", emoji1: "🍎", emoji2: "🐜", sound: "ऐ (æ)" },
                { letter: "B", ex1: "Ball", ex2: "Bat", emoji1: "⚽", emoji2: "🏏", sound: "ब (b)" },
                { letter: "C", ex1: "Cat", ex2: "Car", emoji1: "🐱", emoji2: "🚗", sound: "क (k)" },
                { letter: "D", ex1: "Dog", ex2: "Duck", emoji1: "🐶", emoji2: "🦆", sound: "ड (d)" },
                { letter: "E", ex1: "Elephant", ex2: "Egg", emoji1: "🐘", emoji2: "🥚", sound: "ए (e)" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => playSpeech(`${item.letter} for ${item.ex1} and ${item.ex2}`, "en-US")}
                  className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-indigo-100 dark:border-slate-700 text-center hover:border-indigo-400 cursor-pointer shadow-sm"
                >
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 block mb-1">
                    {item.letter}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-900 px-2 py-0.5 rounded-full inline-block mb-2">
                    Phonics: {item.sound}
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                      <span>{item.emoji1}</span>
                      <span>{item.ex1}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-slate-500">
                      <span>{item.emoji2}</span>
                      <span>{item.ex2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center pb-3 border-b border-amber-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                पृष्ठ 5 / 48 • बुनियादी गणित (1 से 10 तक गिनती)
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">
                Math Counting (1 to 10 with Visual Objects)
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { num: 1, hi: "एक", en: "One", emoji: "☀️", count: "1 सूरज" },
                { num: 2, hi: "दो", en: "Two", emoji: "👀", count: "2 आँखें" },
                { num: 3, hi: "तीन", en: "Three", emoji: "🚗", count: "3 पहिये (ऑटो)" },
                { num: 4, hi: "चार", en: "Four", emoji: "🪑", count: "4 पाये (कुर्सी)" },
                { num: 5, hi: "पाँच", en: "Five", emoji: "🖐️", count: "5 उंगलियां" },
                { num: 6, hi: "छह", en: "Six", emoji: "🎲", count: "6 फलक (पासा)" },
                { num: 7, hi: "सात", en: "Seven", emoji: "🌈", count: "7 रंग (इंद्रधनुष)" },
                { num: 8, hi: "आठ", en: "Eight", emoji: "🐙", count: "8 भुजाएं (ऑक्टोपस)" },
                { num: 9, hi: "नौ", en: "Nine", emoji: "💎", count: "9 रत्न" },
                { num: 10, hi: "दस", en: "Ten", emoji: "🙌", count: "10 उंगलियां" },
              ].map((item) => (
                <div
                  key={item.num}
                  onClick={() => playSpeech(`${item.num} यानी ${item.hi}`)}
                  className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-slate-700 text-center hover:border-amber-400 cursor-pointer shadow-sm"
                >
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">
                    {item.num}
                  </span>
                  <span className="text-2xl my-0.5 block">{item.emoji}</span>
                  <span className="font-extrabold text-xs block text-slate-800 dark:text-slate-200">
                    {item.hi} ({item.en})
                  </span>
                  <span className="text-[10px] text-slate-500">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // Pages 6 to 48 (Locked for guests, unlocked for logged in members)
      default:
        return (
          <div className="space-y-6">
            <div className="text-center pb-3 border-b border-amber-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-widest text-purple-600 bg-purple-100 dark:bg-purple-950/60 px-3 py-1 rounded-full">
                पृष्ठ {page} / 48 • {getPageTopic(page)}
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">
                {getPageTitle(page)}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{getPageSubtitle(page)}</p>
            </div>

            {/* Unlocked Page Detailed Content */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50/60 dark:bg-slate-900 rounded-2xl border border-purple-100 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-sm text-purple-900 dark:text-purple-300">
                    अध्याय का मुख्य शिक्षण लक्ष्य:
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>कक्षा 1 से 5 स्तर के अनुसार सचित्र अभ्यास व उदाहरण</li>
                    <li>ध्वनि उच्चारण एवं फोनिक्स गाइड (Audio Pronunciation)</li>
                    <li>इंटरैक्टिव वर्कशीट एवं बाल विकास अभ्यास प्रश्न</li>
                    <li>डिजिटल बैज एवं प्रोग्रेस ट्रैकिंग में स्वतः सिंक</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/60 dark:bg-slate-900 rounded-2xl border border-amber-100 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300">
                    अतिरिक्त टूल्स व सुविधाएं:
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>ड्रॉइंग बॉक्स में अक्षर व चित्रों का रेखांकन अभ्यास</li>
                    <li>बाल गुरु AI शिक्षक से तुरंत शंका समाधान</li>
                    <li>प्रगति पत्र (Report Card) एवं क्विज़ रैंकिंग</li>
                    <li>ऑफ़लाइन अध्ययन हेतु प्रिंट एवं PDF डाउनलोड विकल्प</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    आप इस पृष्ठ का संपूर्ण अध्ययन कर रहे हैं (Verified Member Access)
                  </span>
                </div>
                <button
                  onClick={() => playSpeech(`यह है पृष्ठ संख्या ${page}, ${getPageTitle(page)}`)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>पृष्ठ का ऑडियो सुनें</span>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  function getPageTopic(page: number): string {
    if (page >= 6 && page <= 10) return "हिंदी व्यंजन (क से ञ)";
    if (page >= 11 && page <= 15) return "हिंदी व्यंजन (ट से न)";
    if (page >= 16 && page <= 20) return "हिंदी व्यंजन (प से ज्ञ) व शब्द ज्ञान";
    if (page >= 21 && page <= 27) return "Good English (F to Z Phonics Course)";
    if (page >= 28 && page <= 34) return "सचित्र सामान्य ज्ञान (Flashcards GK Part 1)";
    if (page >= 35 && page <= 41) return "सचित्र सामान्य ज्ञान (Flashcards GK Part 2)";
    if (page >= 42 && page <= 45) return "गणित पहाड़े व छात्र कैलकुलेटर (Math Tools)";
    return "IOIS 7 प्लान्स व अर्निंग मॉडल";
  }

  function getPageTitle(page: number): string {
    if (page >= 6 && page <= 10) return "व्यंजन ज्ञान भाग 1: क, ख, ग, घ, ङ, च, छ, ज, झ, ञ";
    if (page >= 11 && page <= 15) return "व्यंजन ज्ञान भाग 2: ट, ठ, ड, ढ, ण, त, थ, द, ध, न";
    if (page >= 16 && page <= 20) return "व्यंजन ज्ञान भाग 3: प, फ, ब, भ, म, य, र, ल, व, श, ष, स, ह, क्ष, त्र, ज्ञ";
    if (page >= 21 && page <= 27) return `Good English Alphabet Part ${page - 20}: Phonics & Word Formation`;
    if (page >= 28 && page <= 34) return `Flashcards GK Category ${page - 27}: सब्जियां, फल, पक्षी व जानवर`;
    if (page >= 35 && page <= 41) return `Flashcards GK Category ${page - 34}: वाहन, शरीर के अंग, रंग व आकृतियां`;
    if (page >= 42 && page <= 45) return "विद्यार्थी गणना उपकरण, 1-20 पहाड़े एवं समय सारणी";
    return "IOIS आधिकारिक 7 प्लान्स, UTR वेरिफिकेशन व रेफरल कमीशन";
  }

  function getPageSubtitle(page: number): string {
    return "IOIS बाल विकास डिजिटल अध्ययन किट • NCERT आधारित पूर्ण पाठ्यक्रम";
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Official IOIS PDF Study Material
            </span>
            <span className="bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full text-xs font-black">
              48 Pages Complete Course
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            IOIS बाल विकास PDF संपूर्ण अध्ययन गाइड
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
            अ से ज्ञ, A to Z, 1 से 20 पहाड़े, 14 सचित्र फ्लैशकार्ड्स एवं छात्र कैलकुलेटर।
            {!user && (
              <span className="block mt-1 font-semibold text-yellow-200">
                (अतिथि पाठकों के लिए शुरुआती 5 पृष्ठ खुले हैं • आगे के पृष्ठों हेतु लॉगिन आवश्यक है)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-amber-200 uppercase font-bold block">
                सदस्य स्थिति
              </span>
              <span className="text-sm font-extrabold text-white flex items-center gap-1">
                <Unlock className="w-4 h-4 text-emerald-300" />
                <span>सभी 48 पृष्ठ अनलॉक</span>
              </span>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-amber-200 uppercase font-bold block">
                निःशुल्क प्रिव्यू
              </span>
              <span className="text-sm font-extrabold text-white flex items-center gap-1">
                <Eye className="w-4 h-4 text-amber-300" />
                <span>पृष्ठ 1 से 5 खुला</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Page Navigation Controls */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-slate-600 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 px-2">
            पृष्ठ {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-slate-600 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Page Scrubber Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-bold">पृष्ठ पर जाएं:</span>
          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <option key={p} value={p}>
                पृष्ठ {p}: {getPageTopic(p)} {!user && p > freePagesLimit ? "🔒 (Locked)" : "✅"}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Jump Buttons for First 5 Pages */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[1, 2, 3, 4, 5].map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                currentPage === p
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-100"
              }`}
            >
              {p}
            </button>
          ))}
          <span className="text-xs text-slate-400 font-mono">...</span>
          {[6, 12, 24, 42, 48].map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-2 h-7 rounded-lg text-xs font-bold transition-colors flex items-center gap-0.5 ${
                currentPage === p
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-100"
              }`}
            >
              {!user && <Lock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />}
              <span>{p}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Page Viewer Card */}
      <div className="relative min-h-[460px] bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* If Locked for guest: Blurred background preview with login barrier */}
        {isLocked ? (
          <div className="relative">
            {/* Blurred background teaser */}
            <div className="filter blur-md opacity-30 pointer-events-none select-none">
              {renderPageContent(currentPage)}
            </div>

            {/* Lock Gate Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 dark:bg-amber-950/60 border-2 border-amber-500 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 shadow-lg animate-bounce">
                <Lock className="w-8 h-8" />
              </div>

              <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                🔒 पृष्ठ {currentPage} लॉक है (Login Required)
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 max-w-md">
                आगे की संपूर्ण 48 पृष्ठों की अध्ययन सामग्री हेतु लॉगिन करें
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg leading-relaxed">
                बिना लॉगिन के आप केवल शुरुआती 5 पृष्ठ (स्वर अ से ई, अंग्रेजी A to E व 1 से 10 गिनती) देख सकते हैं। व्यंजन (क से ज्ञ), अंग्रेजी F to Z, 1 से 20 पहाड़े, 14 सचित्र फ्लैशकार्ड्स व ड्रॉइंग अनलॉक करने के लिए तुरंत लॉगिन या पंजीकरण करें।
              </p>

              <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
                <button
                  onClick={() => onOpenAuth("login")}
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>सदस्य लॉगिन करें (Login Now)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenAuth("register")}
                  className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-sm border border-amber-400/40 shadow-md transition-all active:scale-95"
                >
                  <span>नया रजिस्ट्रेशन करें (₹10 से शुरू)</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 mt-4 block">
                ✨ रजिस्ट्रेशन के बाद डिजिटल ID कार्ड और पूरा किट तुरंत सक्रिय हो जाता है।
              </span>
            </div>
          </div>
        ) : (
          <div>{renderPageContent(currentPage)}</div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="hover:text-amber-600 font-bold flex items-center gap-1 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>पिछला पृष्ठ</span>
        </button>

        <span className="font-semibold text-slate-600 dark:text-slate-400">
          IOIS प्लेटफार्म • आधिकारिक बाल विकास अध्ययन सामग्री (Class 1-5)
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="hover:text-amber-600 font-bold flex items-center gap-1 disabled:opacity-30"
        >
          <span>अगला पृष्ठ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
