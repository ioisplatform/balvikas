import React, { useState } from "react";
import {
  Search,
  Volume2,
  Sparkles,
  Eye,
  EyeOff,
  Filter,
  Grid,
} from "lucide-react";
import { FLASHCARD_CATEGORIES } from "../data/learningData";
import { FlashcardItem } from "../types";
import { playAudioText } from "../utils/speech";

interface FlashcardsSectionProps {
  language: "hi" | "en";
  soundEnabled: boolean;
}

const CATEGORY_META = [
  { id: "all", titleHi: "सभी चित्र कार्ड (All)", titleEn: "All Flashcards", icon: "📚" },
  { id: "vegetables", titleHi: "सब्जियाँ (Vegetables)", titleEn: "Vegetables", icon: "🥦" },
  { id: "fruits", titleHi: "फल (Fruits)", titleEn: "Fruits", icon: "🍎" },
  { id: "birds", titleHi: "पक्षी (Birds)", titleEn: "Birds", icon: "🦜" },
  { id: "flowers", titleHi: "फूल (Flowers)", titleEn: "Flowers", icon: "🌸" },
  { id: "domestic_animals", titleHi: "पालतू पशु", titleEn: "Domestic Animals", icon: "🐕" },
  { id: "wild_animals", titleHi: "जंगली जानवर", titleEn: "Wild Animals", icon: "🦁" },
  { id: "water_animals", titleHi: "जलचर जीव", titleEn: "Water Animals", icon: "🐬" },
  { id: "vehicles", titleHi: "यातायात के साधन", titleEn: "Vehicles", icon: "🚗" },
  { id: "body_parts", titleHi: "शरीर के अंग", titleEn: "Body Parts", icon: "👃" },
  { id: "colours", titleHi: "रंग (Colours)", titleEn: "Colours", icon: "🎨" },
  { id: "shapes", titleHi: "आकार (Shapes)", titleEn: "Shapes", icon: "🔺" },
  { id: "opposites", titleHi: "विलोम (Opposites)", titleEn: "Opposites", icon: "⚖️" },
  { id: "actions", titleHi: "क्रियाएं (Actions)", titleEn: "Actions", icon: "🏃" },
  { id: "games", titleHi: "खेलकूद (Games)", titleEn: "Games", icon: "⚽" },
];

export const FlashcardsSection: React.FC<FlashcardsSectionProps> = ({
  language,
  soundEnabled,
}) => {
  const [selectedCatId, setSelectedCatId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideEnglish, setHideEnglish] = useState(false);
  const [hideHindi, setHideHindi] = useState(false);

  // Active Category Meta
  const activeCategory =
    CATEGORY_META.find((c) => c.id === selectedCatId) || CATEGORY_META[0];

  // Filter items in category
  const filteredItems = FLASHCARD_CATEGORIES.filter((item: FlashcardItem) => {
    const matchesCategory =
      selectedCatId === "all" || item.category === selectedCatId;
    const matchesSearch =
      item.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hindiName.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (english: string, hindi: string) => {
    if (!soundEnabled) return;
    if (language === "hi") {
      playAudioText(`${hindi}. ${english}`, "hi-IN");
    } else {
      playAudioText(`${english}. ${hindi}`, "en-US");
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              बाल विकास चित्र ज्ञान (Flashcards)
            </span>
            <span className="bg-emerald-300 text-emerald-950 px-2 py-0.5 rounded-full text-xs font-extrabold">
              PDF Pages 28–41
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            14 ज्ञानवर्धक श्रेणियाँ एवं सचित्र कार्ड
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 max-w-xl">
            सब्जियाँ, फल, पशु, पक्षी, वाहन, शरीर के अंग, रंग, आकार और विलोम शब्द — चित्र देखें और हिंदी-अंग्रेजी उच्चारण सीखें!
          </p>
        </div>

        {/* Quick Mode Toggles */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-xs">
          <button
            onClick={() => setHideHindi((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              hideHindi ? "bg-amber-400 text-slate-900 shadow" : "text-white hover:bg-white/10"
            }`}
          >
            {hideHindi ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>हिंदी {hideHindi ? "छिपी" : "दिखे"}</span>
          </button>

          <button
            onClick={() => setHideEnglish((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              hideEnglish ? "bg-amber-400 text-slate-900 shadow" : "text-white hover:bg-white/10"
            }`}
          >
            {hideEnglish ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>English {hideEnglish ? "छिपी" : "दिखे"}</span>
          </button>
        </div>
      </div>

      {/* Category selector chips */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORY_META.map((cat) => {
            const isSelected = selectedCatId === cat.id;
            const count =
              cat.id === "all"
                ? FLASHCARD_CATEGORIES.length
                : FLASHCARD_CATEGORIES.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCatId(cat.id);
                  setSearchQuery("");
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-102"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{language === "hi" ? cat.titleHi : cat.titleEn}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Stats header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{activeCategory.icon}</span>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
              {language === "hi" ? activeCategory.titleHi : activeCategory.titleEn}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filteredItems.length} {language === "hi" ? "चित्र कार्ड उपलब्ध हैं" : "Cards Available"}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "hi" ? "कार्ड खोजें (उदा: सेब, Lion)..." : "Search cards..."
            }
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Flashcards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSpeak(item.englishName, item.hindiName)}
            className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 shadow-sm hover:shadow-lg transition-all cursor-pointer text-center group flex flex-col justify-between"
          >
            <div className="relative">
              {item.colorCode ? (
                <div
                  className="w-16 h-16 rounded-full mx-auto shadow-inner flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: item.colorCode }}
                >
                  <span className="drop-shadow">{item.emoji}</span>
                </div>
              ) : (
                <div className="text-5xl sm:text-6xl py-2 group-hover:scale-115 transition-transform duration-200 select-none">
                  {item.emoji}
                </div>
              )}
            </div>

            <div className="space-y-1 pt-2">
              {!hideHindi && (
                <h4 className="font-black text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-snug">
                  {item.hindiName}
                </h4>
              )}
              {!hideEnglish && (
                <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {item.englishName}
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-emerald-500 transition-colors">
              <Volume2 className="w-3.5 h-3.5" />
              <span>उच्चारण</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
