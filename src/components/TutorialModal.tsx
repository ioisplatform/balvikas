import React, { useState } from "react";
import { X, ChevronRight, ChevronLeft, BookOpen, PenTool, Award, ShieldCheck, Check } from "lucide-react";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: "hi" | "en";
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const STEPS = [
    {
      title: "IOIS बाल विकास मंच में आपका स्वागत है!",
      desc: "यह एप्लिकेशन कक्षा 1 से 5 तक के बच्चों के लिए हिंदी, अंग्रेजी, गणित और सामान्य ज्ञान को खेल-खेल में सिखाने के लिए बनाया गया है।",
      icon: "🎉",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "हिंदी वर्णमाला & मनोहर पोथी (52+ अक्षर)",
      desc: "स्वर और व्यंजनों के उच्चारण सुनें, उंगली या माउस से अक्षरों पर ट्रेसिंग का अभ्यास करें और बारहखड़ी सीखें।",
      icon: "अ",
      color: "from-orange-500 to-rose-500",
    },
    {
      title: "Good English ABCD & Phonics",
      desc: "A से Z तक सचित्र उदाहरण, फोनिक्स ध्वनि, कैपिटल व स्मॉल अक्षरों का अभ्यास और साइट वर्ड्स सीखें।",
      icon: "Aa",
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "गणित: 1 से 100 गिनती & पहाड़े",
      desc: "देवनागरी व अंग्रेजी में संख्याएं, 1 से 20 पहाड़े, सेब व तारों के साथ सचित्र जोड़-घटाव और प्रतिशत कैलकुलेटर।",
      icon: "🔢",
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "बच्चों का ड्रॉइंग & कलरिंग बॉक्स",
      desc: "16 रंगों, रेनबो ब्रश, स्टैम्प और आउटलाइन चित्रों में रंग भरें, अपनी कलाकृति सहेजें और डाउनलोड करें।",
      icon: "🎨",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "यूनिक ID और 4-डिवाइस क्लाउड सुरक्षा",
      desc: "आपकी नॉन-एडिटेबल यूनिक आईडी (जैसे IOIS10RK01) से आप 4 अलग-अलग उपकरणों में लॉगिन कर सकते हैं और आपका डेटा कभी डिलीट नहीं होगा।",
      icon: "🛡️",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const currentStepData = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-6 animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4 pt-4">
          <div
            className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${currentStepData.color} text-white mx-auto flex items-center justify-center text-4xl shadow-xl`}
          >
            {currentStepData.icon}
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400">
              कदम {step + 1} / {STEPS.length}
            </span>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {currentStepData.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {currentStepData.desc}
            </p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-1.5 py-2">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                step === idx ? "w-6 bg-amber-500" : "w-2 bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
            disabled={step === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>पीछे</span>
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((prev) => prev + 1)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-md text-xs flex items-center gap-1 transition-transform active:scale-95"
            >
              <span>आगे बढ़ें</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md text-xs flex items-center gap-1 transition-transform active:scale-95"
            >
              <span>समझ गया, शुरू करें!</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
