import React, { useRef } from "react";
import {
  Award,
  BookOpen,
  Printer,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { UserProfile, StudentProgress } from "../types";
import { DIGITAL_BADGES } from "../data/learningData";

interface StudentReportProps {
  user: UserProfile | null;
  progress: StudentProgress;
  selectedGrade: string;
  language: "hi" | "en";
}

export const StudentReport: React.FC<StudentReportProps> = ({
  user,
  progress,
  selectedGrade,
  language,
}) => {
  const reportRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  // Progress metrics
  const hindiList = Array.isArray(progress?.hindiLettersLearned) ? progress.hindiLettersLearned : [];
  const englishList = Array.isArray(progress?.englishLettersLearned) ? progress.englishLettersLearned : [];
  const badgesList = Array.isArray(progress?.badgesUnlocked) ? progress.badgesUnlocked : [];
  const hindiPct = Math.min(Math.round((hindiList.length / 52) * 100), 100);
  const englishPct = Math.min(Math.round((englishList.length / 26) * 100), 100);
  const totalQ = progress?.quizTotalQuestions || 0;
  const correctQ = progress?.quizCorrectAnswers || 0;
  const quizAccuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 85;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider block w-fit mb-2">
            प्रमाणित प्रगति रिपोर्ट (Official Progress Report)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            बाल विकास प्रगति पत्र & प्रमाण पत्र
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            विद्यार्थी की विषयवार सीखने की गति, क्विज़ प्राप्तांक और अर्जित डिजिटल बैज का पूर्ण विवरण
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-white text-blue-900 font-extrabold rounded-2xl shadow-md text-xs sm:text-sm flex items-center gap-2 hover:bg-blue-50 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>प्रिंट / PDF सेव करें</span>
        </button>
      </div>

      {/* Official Certificate Style Report Container */}
      <div
        ref={reportRef}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border-4 border-amber-400 dark:border-slate-700 shadow-2xl space-y-8 relative overflow-hidden print:border-none print:shadow-none print:m-0 print:p-4"
      >
        {/* Certificate Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <span className="text-9xl font-black font-serif">IOIS</span>
        </div>

        {/* Header Ribbon */}
        <div className="text-center space-y-2 border-b-2 border-amber-200 dark:border-slate-700 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white mx-auto flex items-center justify-center shadow-lg text-2xl font-black mb-2">
            IOIS
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            बाल विकास प्रगति पत्रक
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            IOIS Educational Platform • Class 1 to 5 Digital Workbook
          </p>
          <div className="inline-block bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-4 py-1 rounded-full text-xs font-bold border border-amber-300 dark:border-amber-800">
            सत्र 2025–2026 • आधिकारिक प्रमाण पत्र
          </div>
        </div>

        {/* Student Credential Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">विद्यार्थी का नाम</span>
            <span className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
              {user?.name || "Rahul Kumar (विद्यार्थी)"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">स्थायी यूनिक आईडी</span>
            <span className="font-mono font-black text-sm sm:text-base text-amber-600 dark:text-amber-400">
              {user?.uniqueId || "IOIS10RK01"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">कक्षा / ग्रेड</span>
            <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
              {user?.classGrade || selectedGrade}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">पंजीकृत प्लान</span>
            <span className="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
              {user?.planName || "₹10 Bal Vikas Plan"}
            </span>
          </div>
        </div>

        {/* Subject Progress Bars */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>विषयवार अध्ययन प्रगति (Subject Proficiency)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hindi */}
            <div className="p-4 bg-amber-50/60 dark:bg-slate-800/40 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-900 dark:text-amber-300">हिंदी वर्णमाला व शब्द रचना</span>
                <span>{hindiPct}% पूर्ण ({hindiList.length}/52 वर्ण)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${Math.max(hindiPct, 20)}%` }}
                />
              </div>
            </div>

            {/* English */}
            <div className="p-4 bg-blue-50/60 dark:bg-slate-800/40 rounded-2xl border border-blue-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-blue-900 dark:text-blue-300">Good English (A to Z Letters)</span>
                <span>{englishPct}% पूर्ण ({englishList.length}/26 अक्षर)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  style={{ width: `${Math.max(englishPct, 25)}%` }}
                />
              </div>
            </div>

            {/* Math */}
            <div className="p-4 bg-purple-50/60 dark:bg-slate-800/40 rounded-2xl border border-purple-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-purple-900 dark:text-purple-300">गणित: गिनती, पहाड़े व संक्रियाएं</span>
                <span>80% दक्ष</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 w-4/5" />
              </div>
            </div>

            {/* Drawing & GK */}
            <div className="p-4 bg-emerald-50/60 dark:bg-slate-800/40 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-900 dark:text-emerald-300">चित्र ज्ञान (GK) व कला दीर्घा</span>
                <span>{progress?.drawingsCount || 0} कलाकृतियां सहेजी गई</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Digital Badges Showcase */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>अर्जित डिजिटल सम्मान व मेडल</span>
          </h3>

          <div className="flex items-center gap-3 overflow-x-auto py-2">
            {DIGITAL_BADGES.map((badge) => {
              const isUnlocked = badgesList.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border min-w-[140px] text-center space-y-1 shrink-0 ${
                    isUnlocked
                      ? "bg-amber-50 dark:bg-slate-800 border-amber-300 dark:border-amber-700 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40 grayscale"
                  }`}
                >
                  <span className="text-3xl block">{badge.icon}</span>
                  <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block truncate">
                    {badge.nameHi}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {isUnlocked ? "अर्जित ⭐" : "प्रतीक्षारत"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="pt-8 border-t-2 border-slate-100 dark:border-slate-700 flex items-end justify-between">
          <div className="text-center">
            <div className="w-28 h-10 border-b-2 border-slate-400 flex items-end justify-center font-serif text-slate-700 dark:text-slate-300 italic text-sm">
              IOIS System
            </div>
            <span className="text-[11px] font-bold text-slate-500 mt-1 block">अधीक्षक हस्ताक्षर</span>
          </div>

          <div className="w-20 h-20 rounded-full border-4 border-amber-500 flex flex-col items-center justify-center text-center p-1 text-[9px] font-bold text-amber-700 dark:text-amber-400 rotate-6">
            <span>IOIS</span>
            <span>VERIFIED</span>
            <span>SEAL 2026</span>
          </div>

          <div className="text-center">
            <div className="w-28 h-10 border-b-2 border-slate-400 flex items-end justify-center font-serif text-slate-700 dark:text-slate-300 italic text-sm">
              Class Teacher
            </div>
            <span className="text-[11px] font-bold text-slate-500 mt-1 block">कक्षा अध्यापक</span>
          </div>
        </div>
      </div>
    </div>
  );
};
