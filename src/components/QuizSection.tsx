import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Star,
  Trophy,
  ArrowRight,
  Flame,
} from "lucide-react";
import { QUIZ_QUESTIONS, DIGITAL_BADGES } from "../data/learningData";
import { QuizQuestion, BadgeItem } from "../types";
import { playAudioText } from "../utils/speech";

interface QuizSectionProps {
  language: "hi" | "en";
  soundEnabled: boolean;
  unlockedBadgeIds: string[];
  onUnlockBadge: (badgeId: string) => void;
  onRecordQuizScore: (score: number, total: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  language,
  soundEnabled,
  unlockedBadgeIds,
  onUnlockBadge,
  onRecordQuizScore,
}) => {
  const [activeTab, setActiveTab] = useState<"quiz" | "badges">("quiz");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Filter questions by subject
  const currentQuestions: QuizQuestion[] =
    selectedSubject === "all"
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter((q) => q.subject === selectedSubject);

  const activeQ = currentQuestions[currentIdx] || currentQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === activeQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      if (soundEnabled) playAudioText("शाबाश! सही उत्तर!", "hi-IN");
    } else {
      if (soundEnabled) playAudioText("गलत उत्तर, सही उत्तर है " + activeQ.options[activeQ.correctIndex], "hi-IN");
    }
  };

  const handleNext = () => {
    if (currentIdx < currentQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Finished!
      setQuizFinished(true);
      const total = currentQuestions.length;
      const finalScore = score + (selectedOption === activeQ.correctIndex ? 0 : 0);
      onRecordQuizScore(finalScore, total);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // fallback
      }

      // Check badge unlock
      if (finalScore >= 3) {
        onUnlockBadge("badge_quiz_master");
      }
      if (finalScore === total) {
        onUnlockBadge("badge_iois_achiever");
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              बाल प्रतिभा पुरस्कार एवं क्विज़
            </span>
            <span className="bg-yellow-300 text-yellow-950 px-2 py-0.5 rounded-full text-xs font-extrabold">
              डिजिटल बैज रिवॉर्ड्स
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            इंटरैक्टिव क्विज़ और डिजिटल बैज
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1.5 max-w-xl">
            प्रश्नों के सही उत्तर दें, अंक अर्जित करें और शानदार डिजिटल मेडल व बैज अपनी प्रोफ़ाइल में अनलॉक करें!
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "quiz" ? "bg-white text-orange-600 shadow" : "text-white hover:bg-white/10"
            }`}
          >
            लाइव क्विज़
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "badges" ? "bg-white text-orange-600 shadow" : "text-white hover:bg-white/10"
            }`}
          >
            मेरे बैज ({unlockedBadgeIds.length} / {DIGITAL_BADGES.length})
          </button>
        </div>
      </div>

      {/* 1. QUIZ TAB */}
      {activeTab === "quiz" && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Subject Filter Bar */}
          {!quizFinished && (
            <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500">विषय चुनें:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: "all", label: "सभी विषय" },
                  { id: "hindi", label: "हिंदी" },
                  { id: "english", label: "English" },
                  { id: "math", label: "गणित" },
                  { id: "gk", label: "GK" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSubject(s.id);
                      handleRestartQuiz();
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedSubject === s.id
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Question Card */}
          {!quizFinished ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
              {/* Progress and Question No */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Flame className="w-4 h-4" />
                  <span>
                    प्रश्न {currentIdx + 1} / {currentQuestions.length}
                  </span>
                </span>
                <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full font-mono">
                  स्कोर: {score} अंक
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                  style={{
                    width: `${((currentIdx + 1) / currentQuestions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <div className="text-center py-2 space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 leading-snug">
                  {language === "hi" ? activeQ.questionHi : activeQ.questionEn}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === activeQ.correctIndex;

                  let optClasses =
                    "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-400";

                  if (isSubmitted) {
                    if (isCorrect) {
                      optClasses = "bg-emerald-500 text-white border-emerald-600 shadow-md";
                    } else if (isSelected && !isCorrect) {
                      optClasses = "bg-rose-500 text-white border-rose-600";
                    }
                  } else if (isSelected) {
                    optClasses = "bg-amber-100 dark:bg-amber-950 border-amber-500 ring-2 ring-amber-500";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base text-left transition-all flex items-center justify-between ${optClasses}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {isSubmitted && (
                <div className="p-3.5 bg-amber-50 dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
                    💡 व्याख्या:
                  </span>
                  {activeQ.explanation}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-98 text-sm"
                  >
                    उत्तर सबमिट करें
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full py-3 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-extrabold rounded-2xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-2"
                  >
                    <span>{currentIdx < currentQuestions.length - 1 ? "अगला प्रश्न" : "परिणाम देखें"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Results Card */
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 text-white mx-auto flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30">
                🏆
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold text-amber-600 dark:text-amber-400 tracking-wider">
                  क्विज़ संपन्न हुआ!
                </span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
                  शानदार प्रयास! 🌟
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  आपने {currentQuestions.length} में से {score} प्रश्नों के सही उत्तर दिए हैं।
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-slate-700 max-w-xs mx-auto">
                <span className="text-xs text-slate-500 block">सटीकता प्रतिशत:</span>
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                  {Math.round((score / currentQuestions.length) * 100)}%
                </span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold rounded-xl shadow-md hover:from-amber-600 flex items-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>पुनः क्विज़ खेलें</span>
                </button>
                <button
                  onClick={() => setActiveTab("badges")}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 text-sm"
                >
                  मेरे बैज देखें
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. BADGES REWARDS TAB */}
      {activeTab === "badges" && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                विद्यार्थी डिजिटल बैज संग्रह
              </h3>
              <p className="text-xs text-slate-500">
                अध्ययन और क्विज़ पूरा करके सभी 8 डिजिटल बैज अनलॉक करें।
              </p>
            </div>
            <div className="text-right font-mono text-sm font-extrabold text-amber-600 dark:text-amber-400">
              {unlockedBadgeIds.length} / {DIGITAL_BADGES.length} अनलॉक
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {DIGITAL_BADGES.map((badge) => {
              const isUnlocked = unlockedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-3xl border transition-all text-center space-y-3 relative group ${
                    isUnlocked
                      ? "bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-600/50 shadow-md hover:shadow-lg"
                      : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-sm ${
                      isUnlocked
                        ? "bg-gradient-to-tr from-amber-400 to-orange-500 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale"
                    }`}
                  >
                    {badge.icon}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                      {badge.nameHi}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {badge.description}
                    </p>
                  </div>

                  <div className="pt-1">
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>अनलॉक हो चुका ⭐</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                        🔒 अध्ययन करके अनलॉक करें
                      </span>
                    )}
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
