import React from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  PhoneCall,
  Mail,
  UserCheck,
  Bot,
  Layers,
  Award,
  Palette,
  Calculator,
  Smile,
  GraduationCap,
} from "lucide-react";

interface IOISPublicHomeProps {
  onNavigateToTab: (tabId: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: (planId?: string) => void;
  onOpenAdmin: () => void;
}

export const IOISPublicHome: React.FC<IOISPublicHomeProps> = ({
  onNavigateToTab,
  onOpenLogin,
  onOpenRegister,
  onOpenAdmin,
}) => {
  return (
    <div className="w-full space-y-8 font-sans">
      {/* HERO SECTION: BAL VIKAS & LEARNING FOCUSED */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/70 to-slate-900 text-white p-6 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>IOIS • डिजिटल बाल विकास व प्रारंभिक शिक्षा मंच</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            सम्पूर्ण डिजिटल बाल विकास व शिक्षा पोर्टल
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            बच्चों के सर्वांगीण मानसिक व बौद्धिक विकास के लिए समर्पित आधुनिक डिजिटल प्लेटफॉर्म। 
            यहाँ बच्चे सचित्र डिजिटल बाल विकास पुस्तक (वर्णमाला व चित्रावली), चिंटू कार्टून AI शिक्षक, 
            3D मानव शरीर अंग, पेंसिल ट्रेसिंग व ड्रॉइंग कैनवास, गणित (1 से 100 तक गिनती व जोड़-घटाव), 
            अंग्रेजी Alphabet व फ़ोनिक्स और आकर्षक क्विज़ व रिपोर्ट कार्ड के माध्यम से आनंदपूर्वक सीखते हैं।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenRegister()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              <span>नया सदस्य पंजीकरण (Register Now)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenLogin}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl backdrop-blur border border-white/10 flex items-center gap-2 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>सदस्य लॉगिन (Member Login)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToTab("bal_guru")}
              className="px-4 py-3 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 font-bold text-xs rounded-2xl border border-blue-500/40 flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>चिंटू AI शिक्षक से बात करें</span>
            </button>
          </div>

          {/* 3 Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>7 मुख्य बाल विकास स्तम्भ</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>चिंटू कार्टून AI एनिमेटेड गाइड</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% सुरक्षित बाल शिक्षा माहौल</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7 CORE PILLARS OF CHILD DEVELOPMENT (बाल विकास के 7 मुख्य स्तम्भ) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
            सर्वोत्तम प्रारंभिक शिक्षा किट
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            बाल विकास के 7 मुख्य स्तम्भ (Core 7 Pillars)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            बच्चों की रचनात्मकता, एकाग्रता और बौद्धिक क्षमता को निखारने वाले विशेष शैक्षणिक मॉड्यूल:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            {
              title: "1. डिजिटल बाल विकास पुस्तक",
              desc: "पृष्ठ-दर-पृष्ठ हिंदी वर्णमाला (स्वर, व्यंजन, बारहखड़ी) व रंग-बिरंगी सचित्र चित्रावली।",
              icon: <BookOpen className="w-6 h-6 text-amber-500" />,
              color: "bg-amber-500/10 border-amber-500/30",
              badge: "वर्णमाला व चित्रावली",
            },
            {
              title: "2. चिंटू AI शिक्षक",
              desc: "बोलने व समझाने वाला कार्टून शिक्षक जो हर कदम पर बच्चों को प्रेरित करता है।",
              icon: <Bot className="w-6 h-6 text-blue-500" />,
              color: "bg-blue-500/10 border-blue-500/30",
              badge: "आवाज़ व मार्गदर्शन",
            },
            {
              title: "3. 3D मानव शरीर अंग",
              desc: "शरीर के सभी अंगों की इंटरैक्टिव 3D पहचान, नाम, कार्य व स्वास्थ्य आदतें।",
              icon: <Smile className="w-6 h-6 text-emerald-500" />,
              color: "bg-emerald-500/10 border-emerald-500/30",
              badge: "Interactive Anatomy",
            },
            {
              title: "4. पेंसिल ट्रेसिंग व ड्रॉइंग",
              desc: "अक्षर, अंक व सुंदर चित्र बनाने के लिए इंटरैक्टिव कैनवास व ब्रश टूल्स।",
              icon: <Palette className="w-6 h-6 text-rose-500" />,
              color: "bg-rose-500/10 border-rose-500/30",
              badge: "Drawing Canvas",
            },
            {
              title: "5. गणित ज्ञान (Math)",
              desc: "1 से 100 तक गिनती, पहाड़े, रोचक जोड़, घटाव और गुणा के दृश्य अभ्यास।",
              icon: <Calculator className="w-6 h-6 text-indigo-500" />,
              color: "bg-indigo-500/10 border-indigo-500/30",
              badge: "1 से 100 तक गिनती",
            },
            {
              title: "6. अंग्रेजी Alphabet व फ़ोनिक्स",
              desc: "A to Z अक्षर ज्ञान, उच्चारित ध्वनि (Phonics) व शब्दों का सचित्र संग्रह।",
              icon: <GraduationCap className="w-6 h-6 text-purple-500" />,
              color: "bg-purple-500/10 border-purple-500/30",
              badge: "Phonics & Words",
            },
            {
              title: "7. बाल विकास क्विज़ व रिपोर्ट",
              desc: "मजेदार बहुविकल्पीय क्विज़, स्टार बैज, स्कोरिंग और प्रेरणादायी रिपोर्ट कार्ड।",
              icon: <Award className="w-6 h-6 text-amber-500" />,
              color: "bg-yellow-500/10 border-yellow-500/30",
              badge: "Quiz & Report Card",
            },
          ].map((pillar, index) => (
            <div
              key={index}
              className={`p-5 rounded-2xl border ${pillar.color} bg-white dark:bg-slate-800/80 space-y-3 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  {pillar.badge}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACCESS CTA */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-10 text-slate-950 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-black">
            आज ही अपने बच्चे की डिजिटल पढ़ाई शुरू करें!
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-900/80 max-w-xl">
            पंजीकरण करके अपनी डिजिटल सदस्य आईडी प्राप्त करें और सम्पूर्ण बाल विकास किट व चिंटू AI शिक्षक को अनलॉक करें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenRegister()}
            className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95"
          >
            नया रजिस्ट्रेशन करें
          </button>
          <button
            type="button"
            onClick={onOpenLogin}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow transition-transform active:scale-95"
          >
            सदस्य लॉगिन
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <h4 className="text-sm font-black text-amber-400">IOIS बाल विकास केंद्र</h4>
            <p className="text-slate-300">
              डिजिटल बाल विकास, सचित्र पोथी व इंटरैक्टिव लर्निंग प्लेटफॉर्म।
            </p>
            <p className="text-slate-400 text-[11px]">
              हर बच्चे के उज्ज्वल भविष्य और प्रारंभिक मानसिक विकास के लिए समर्पित।
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-black text-amber-400">हेल्पलाइन व संपर्क</h4>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span className="font-mono font-bold">+91 8877490845</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="font-mono">ioisplatform@gmail.com</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-black text-amber-400">व्यवस्थापक</h4>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>व्यवस्थापक लॉगिन (Admin Portal)</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 IOIS बाल विकास प्लेटफॉर्म। सर्वाधिकार सुरक्षित।</span>
          <span>सुरक्षित, विज्ञापन-मुक्त एवं बाल-अनुकूल डिजिटल वातावरण</span>
        </div>
      </div>
    </div>
  );
};
