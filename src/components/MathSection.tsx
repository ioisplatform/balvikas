import React, { useState } from "react";
import {
  Volume2,
  Calculator,
  Grid,
  Plus,
  Minus,
  X as MultiplyIcon,
  Divide,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Clock,
  Award,
} from "lucide-react";
import { COUNTING_DATA, getMultiplicationTable } from "../data/learningData";
import { playAudioText } from "../utils/speech";

interface MathSectionProps {
  language: "hi" | "en";
  soundEnabled: boolean;
  selectedGrade: string;
}

export const MathSection: React.FC<MathSectionProps> = ({
  language,
  soundEnabled,
  selectedGrade,
}) => {
  const [activeTab, setActiveTab] = useState<"counting" | "tables" | "practice" | "tools">("counting");

  // Counting page
  const [countingPage, setCountingPage] = useState<number>(0); // 0 = 1-25, 1 = 26-50, etc.

  // Tables
  const [selectedTableNum, setSelectedTableNum] = useState<number>(2);

  // Practice operation state
  const [practiceType, setPracticeType] = useState<"add" | "sub" | "mul" | "div">("add");
  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(3);
  const [userAnswer, setUserAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  // Student Tools State (Page 42 of PDF)
  const [toolTab, setToolTab] = useState<"percentage" | "age" | "grade" | "average">("percentage");

  // Percentage tool
  const [obtainedMarks, setObtainedMarks] = useState("450");
  const [totalMarks, setTotalMarks] = useState("500");

  // Age calculator
  const [birthDate, setBirthDate] = useState("2018-05-15");

  // Marks Grade
  const [subjectScores, setSubjectScores] = useState<number[]>([85, 92, 78, 88, 95]);

  const handleSpeak = (text: string) => {
    if (!soundEnabled) return;
    playAudioText(text, "hi-IN");
  };

  // Generate new practice question
  const generateNewQuestion = (type: "add" | "sub" | "mul" | "div") => {
    setUserAnswer("");
    setPracticeFeedback(null);
    if (type === "add") {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setNum1(a);
      setNum2(b);
    } else if (type === "sub") {
      const a = Math.floor(Math.random() * 15) + 5;
      const b = Math.floor(Math.random() * a) + 1;
      setNum1(a);
      setNum2(b);
    } else if (type === "mul") {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      setNum1(a);
      setNum2(b);
    } else {
      const b = Math.floor(Math.random() * 8) + 2;
      const ans = Math.floor(Math.random() * 8) + 1;
      setNum1(b * ans);
      setNum2(b);
    }
  };

  // Check Practice Answer
  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(userAnswer, 10);
    let expected = 0;
    if (practiceType === "add") expected = num1 + num2;
    if (practiceType === "sub") expected = num1 - num2;
    if (practiceType === "mul") expected = num1 * num2;
    if (practiceType === "div") expected = num1 / num2;

    if (val === expected) {
      setPracticeFeedback({
        correct: true,
        message: "शाबाश! आपका उत्तर बिल्कुल सही है! 🎉",
      });
      handleSpeak("शाबाश! सही उत्तर!");
    } else {
      setPracticeFeedback({
        correct: false,
        message: `अरे नहीं! सही उत्तर था ${expected}। पुनः प्रयास करें।`,
      });
      handleSpeak(`सही उत्तर है ${expected}`);
    }
  };

  // Calculate Age
  const calculateAge = () => {
    if (!birthDate) return { years: 0, months: 0, days: 0 };
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) {
      months -= 1;
      days += 30;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return { years, months, days };
  };

  // 1 to 100 slicing
  const countingSubset = COUNTING_DATA.slice(countingPage * 25, (countingPage + 1) * 25);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              गणित शिक्षण (Mathematics)
            </span>
            <span className="bg-purple-300 text-purple-950 px-2 py-0.5 rounded-full text-xs font-extrabold">
              {selectedGrade} Syllabus • 1–100 गिनती & पहाड़े
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            खेल-खेल में गणित: गिनती, पहाड़े व गणना
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm mt-1.5 max-w-xl">
            देवनागरी व अंग्रेजी में 1 से 100 गिनती, 1 से 20 पहाड़े, सचित्र जोड़-घटाव और छात्र गणना उपकरण!
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
          <button
            onClick={() => setActiveTab("counting")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "counting" ? "bg-white text-purple-700 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            1–100 गिनती
          </button>
          <button
            onClick={() => setActiveTab("tables")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "tables" ? "bg-white text-purple-700 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            पहाड़े (Tables)
          </button>
          <button
            onClick={() => setActiveTab("practice")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "practice" ? "bg-white text-purple-700 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            सचित्र जोड़-घटाव
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "tools" ? "bg-white text-purple-700 shadow-md" : "text-white hover:bg-white/10"
            }`}
          >
            गणित टूल्स (Page 42)
          </button>
        </div>
      </div>

      {/* 1. COUNTING 1 TO 100 */}
      {activeTab === "counting" && (
        <div className="space-y-4">
          {/* Page Range Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
              {language === "hi" ? "संख्या रेंज चुनें:" : "Select Number Range:"}
            </span>
            <div className="flex items-center gap-2">
              {[
                { label: "1 से 25", page: 0 },
                { label: "26 से 50", page: 1 },
                { label: "51 से 75", page: 2 },
                { label: "76 से 100", page: 3 },
              ].map((btn) => (
                <button
                  key={btn.page}
                  onClick={() => setCountingPage(btn.page)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    countingPage === btn.page
                      ? "bg-purple-600 text-white shadow"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Counting Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {countingSubset.map((item) => (
              <div
                key={item.number}
                onClick={() => handleSpeak(`${item.wordHi}, ${item.number}`)}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:shadow-lg cursor-pointer transition-all flex flex-col items-center justify-between text-center group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                    {item.number}
                  </span>
                  <span className="text-xl font-bold text-slate-400">
                    ({item.devanagari})
                  </span>
                </div>
                <div className="mt-2">
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    {item.wordHi}
                  </h4>
                  <p className="text-xs text-slate-500 capitalize">{item.wordEn}</p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 font-bold opacity-80">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>उच्चारण</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MULTIPLICATION TABLES (1 TO 20) */}
      {activeTab === "tables" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                  पहाड़े सीखें (Multiplication Tables 1–20)
                </h3>
                <p className="text-xs text-slate-500">
                  संख्या चुनें और उसका पूरा पहाड़ा देवनागरी व गुणन रूप में देखें।
                </p>
              </div>

              {/* Number buttons 1 to 20 */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setSelectedTableNum(n);
                      handleSpeak(`${n} का पहाड़ा`);
                    }}
                    className={`w-8 h-8 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
                      selectedTableNum === n
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Render chosen table */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {getMultiplicationTable(selectedTableNum).map((row) => (
                <div
                  key={row.multiplier}
                  onClick={() =>
                    handleSpeak(
                      `${selectedTableNum} धाम ${row.result}, ${selectedTableNum} गुना ${row.multiplier} बराबर ${row.result}`
                    )
                  }
                  className="p-3 bg-purple-50/60 dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-slate-700 hover:border-purple-400 hover:shadow cursor-pointer transition-all text-center group"
                >
                  <span className="font-mono text-xs font-semibold text-slate-500 block">
                    {selectedTableNum} × {row.multiplier}
                  </span>
                  <span className="font-black text-2xl text-purple-700 dark:text-purple-300 block group-hover:scale-105 transition-transform my-1">
                    {row.result}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    {row.textHi}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. VISUAL PRACTICE (जोड़-घटाव-गुणा) */}
      {activeTab === "practice" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
          {/* Operation selector */}
          <div className="flex items-center justify-center gap-2">
            {[
              { id: "add", label: "जोड़ (+)", icon: <Plus className="w-4 h-4" /> },
              { id: "sub", label: "घटाव (-)", icon: <Minus className="w-4 h-4" /> },
              { id: "mul", label: "गुणा (×)", icon: <MultiplyIcon className="w-4 h-4" /> },
              { id: "div", label: "भाग (÷)", icon: <Divide className="w-4 h-4" /> },
            ].map((op) => (
              <button
                key={op.id}
                onClick={() => {
                  setPracticeType(op.id as any);
                  generateNewQuestion(op.id as any);
                }}
                className={`px-4 py-2 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                  practiceType === op.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {op.icon}
                <span>{op.label}</span>
              </button>
            ))}
          </div>

          {/* Question Display Card */}
          <div className="max-w-md mx-auto p-6 bg-purple-50/70 dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-slate-700 text-center space-y-4">
            {/* Visual counters with apples/stars */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex flex-wrap justify-center gap-1 max-w-[120px]">
                {Array.from({ length: Math.min(num1, 15) }).map((_, i) => (
                  <span key={i} className="text-xl animate-in zoom-in">
                    🍎
                  </span>
                ))}
              </div>

              <span className="font-black text-3xl text-purple-600">
                {practiceType === "add" ? "+" : practiceType === "sub" ? "-" : practiceType === "mul" ? "×" : "÷"}
              </span>

              <div className="flex flex-wrap justify-center gap-1 max-w-[120px]">
                {Array.from({ length: Math.min(num2, 15) }).map((_, i) => (
                  <span key={i} className="text-xl animate-in zoom-in">
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            <div className="font-mono text-4xl sm:text-5xl font-black text-slate-800 dark:text-slate-100">
              {num1}{" "}
              {practiceType === "add" ? "+" : practiceType === "sub" ? "-" : practiceType === "mul" ? "×" : "÷"}{" "}
              {num2} = ?
            </div>

            {/* Answer Input Form */}
            <form onSubmit={checkAnswer} className="space-y-3">
              <input
                type="number"
                required
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="उत्तर लिखें"
                className="w-48 mx-auto px-4 py-2.5 text-2xl font-black text-center rounded-2xl border-2 border-purple-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-purple-600"
              />

              <div className="flex items-center justify-center gap-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold rounded-xl shadow-md text-sm hover:from-purple-700 hover:to-indigo-700 transition-transform active:scale-95"
                >
                  जांचें (Check)
                </button>
                <button
                  type="button"
                  onClick={() => generateNewQuestion(practiceType)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-300"
                >
                  नया सवाल
                </button>
              </div>
            </form>

            {practiceFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  practiceFeedback.correct
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                }`}
              >
                {practiceFeedback.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. STUDENT TOOLS (Page 42 of PDF) */}
      {activeTab === "tools" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                विद्यार्थी गणना उपकरण (Student Calculators - PDF Page 42)
              </h3>
              <p className="text-xs text-slate-500">
                प्रतिशत, वास्तविक आयु, परीक्षा ग्रेड और औसत निकालने के त्वरित टूल्स
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
              <button
                onClick={() => setToolTab("percentage")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  toolTab === "percentage" ? "bg-white dark:bg-slate-800 text-purple-600 shadow-sm" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                प्रतिशत कैलकुलेटर
              </button>
              <button
                onClick={() => setToolTab("age")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  toolTab === "age" ? "bg-white dark:bg-slate-800 text-purple-600 shadow-sm" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                आयु कैलकुलेटर
              </button>
              <button
                onClick={() => setToolTab("grade")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  toolTab === "grade" ? "bg-white dark:bg-slate-800 text-purple-600 shadow-sm" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                ग्रेड व औसत
              </button>
            </div>
          </div>

          {/* Percentage Tool */}
          {toolTab === "percentage" && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    प्राप्तांक (Obtained Marks)
                  </label>
                  <input
                    type="number"
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    कुल अंक (Total Marks)
                  </label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-slate-700 text-center">
                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold block">
                  परीक्षा में प्रतिशत:
                </span>
                <span className="text-4xl font-black text-purple-700 dark:text-purple-300 font-mono">
                  {totalMarks && parseFloat(totalMarks) > 0
                    ? ((parseFloat(obtainedMarks) / parseFloat(totalMarks)) * 100).toFixed(2)
                    : "0.00"}
                  %
                </span>
              </div>
            </div>
          )}

          {/* Age Calculator Tool */}
          {toolTab === "age" && (
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  जन्म तिथि चुनें (Date of Birth)
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                />
              </div>

              {(() => {
                const age = calculateAge();
                return (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-purple-50 dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-slate-700">
                      <span className="text-3xl font-black text-purple-700 dark:text-purple-300 block">
                        {age.years}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">वर्ष (Years)</span>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-slate-700">
                      <span className="text-3xl font-black text-purple-700 dark:text-purple-300 block">
                        {age.months}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">महीने (Months)</span>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-slate-700">
                      <span className="text-3xl font-black text-purple-700 dark:text-purple-300 block">
                        {age.days}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">दिन (Days)</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Grade and Average Tool */}
          {toolTab === "grade" && (
            <div className="max-w-md mx-auto space-y-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                5 विषयों के अंक (Marks out of 100):
              </span>
              <div className="grid grid-cols-5 gap-2">
                {subjectScores.map((score, i) => (
                  <input
                    key={i}
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => {
                      const updated = [...subjectScores];
                      updated[i] = parseInt(e.target.value, 10) || 0;
                      setSubjectScores(updated);
                    }}
                    className="p-2 text-center font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                ))}
              </div>

              {(() => {
                const total = subjectScores.reduce((a, b) => a + b, 0);
                const avg = total / subjectScores.length;
                let grade = "A+";
                if (avg < 50) grade = "C";
                else if (avg < 60) grade = "B";
                else if (avg < 75) grade = "B+";
                else if (avg < 90) grade = "A";

                return (
                  <div className="p-4 bg-purple-50 dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-slate-700 flex items-center justify-around">
                    <div>
                      <span className="text-xs text-slate-500 block">कुल अंक:</span>
                      <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {total} / 500
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">औसत:</span>
                      <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {avg.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">ग्रेड:</span>
                      <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                        {grade}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
