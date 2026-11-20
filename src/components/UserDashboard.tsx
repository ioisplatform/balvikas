import React, { useState, useRef } from "react";
import {
  CreditCard,
  BookOpen,
  CheckCircle2,
  Download,
  Printer,
  Share2,
  Sparkles,
  ShieldCheck,
  Award,
  TrendingUp,
  FileText,
  Calendar,
  User,
  Phone,
  QrCode,
  Landmark,
  CloudSun,
  Tv,
  Calculator,
  Lock,
  Smartphone,
  Laptop,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  PenTool,
  Bot,
  Flame,
  ArrowRight,
  RefreshCw,
  LogOut,
  AlertCircle,
  Eye,
  Camera,
} from "lucide-react";
import { UserProfile, StudentProgress } from "../types";
import { DIGITAL_BADGES } from "../data/learningData";
import { playAudioText } from "../utils/speech";

interface UserDashboardProps {
  user: UserProfile;
  progress: StudentProgress;
  language: "hi" | "en";
  soundEnabled: boolean;
  onNavigateToTab: (tab: string) => void;
  onLogout: () => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

type DashboardSection =
  | "id_card"
  | "pustika"
  | "homework_report"
  | "earnings"
  | "services"
  | "security";

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  progress,
  language,
  soundEnabled,
  onNavigateToTab,
  onLogout,
  onUpdateUser,
}) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>("id_card");
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Homework check state
  const [homeworkStatus, setHomeworkStatus] = useState<Record<string, boolean>>({
    hw_1: true,
    hw_2: true,
    hw_3: false,
    hw_4: false,
  });

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const idCardRef = useRef<HTMLDivElement>(null);

  const referralUrl = `https://ioisplatform.github.io/?ref=${user.uniqueId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.uniqueId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrintIdCard = () => {
    window.print();
  };

  const toggleHomework = (id: string) => {
    setHomeworkStatus((prev) => ({ ...prev, [id]: !prev[id] }));
    if (soundEnabled) {
      playAudioText("गृहकार्य स्थिति अपडेट हो गई", "hi-IN");
    }
  };

  // Format date helper
  const formattedRegDate = user.registeredAt
    ? new Date(user.registeredAt).toLocaleDateString("hi-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "15 अगस्त 2024";

  return (
    <div className="space-y-6">
      {/* 1. Official Header Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Student Photo / Avatar with Official Frame */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-lg border-2 border-amber-300 overflow-hidden flex items-center justify-center">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-slate-900 font-black text-2xl">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full shadow border-2 border-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-500/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20">
                  सत्यापित सदस्य (Verified)
                </span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {user.classGrade || "Class 1 (कक्षा 1)"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{user.name}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-amber-100 font-medium">
                <span className="flex items-center gap-1">
                  <span>सदस्य आईडी:</span>
                  <strong className="font-mono bg-black/30 px-2 py-0.5 rounded text-amber-300 font-bold">
                    {user.uniqueId}
                  </strong>
                </span>
                <span>•</span>
                <span>{user.mobile}</span>
                <span>•</span>
                <span>योजना: {user.planName}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveSection("id_card")}
              className="px-4 py-2 bg-yellow-400 text-slate-950 font-black rounded-xl text-xs shadow-md hover:bg-yellow-300 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>पहचान पत्र देखें (ID Card)</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Official Tricolor Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-amber-500" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-emerald-600" />
        </div>
      </div>

      {/* 2. Navigation Pills: Clean and Distinct Section Pages */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveSection("id_card")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all shadow-sm ${
            activeSection === "id_card"
              ? "bg-amber-500 text-slate-950 shadow-amber-500/20 scale-[1.02]"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          <span>१. पहचान पत्र (Digital ID Card)</span>
        </button>

        <button
          onClick={() => setActiveSection("pustika")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all shadow-sm ${
            activeSection === "pustika"
              ? "bg-amber-500 text-slate-950 shadow-amber-500/20 scale-[1.02]"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>२. बाल विकास अध्ययन किट (720 पृष्ठ)</span>
        </button>

        <button
          onClick={() => setActiveSection("homework_report")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all shadow-sm ${
            activeSection === "homework_report"
              ? "bg-amber-500 text-slate-950 shadow-amber-500/20 scale-[1.02]"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>३. दैनिक गृहकार्य व प्रगति रिपोर्ट</span>
        </button>

        <button
          onClick={() => setActiveSection("earnings")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all shadow-sm ${
            activeSection === "earnings"
              ? "bg-amber-500 text-slate-950 shadow-amber-500/20 scale-[1.02]"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>४. रेफरल, कमीशन व आमदनी</span>
        </button>

        <button
          onClick={() => setActiveSection("services")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all shadow-sm ${
            activeSection === "services"
              ? "bg-amber-500 text-slate-950 shadow-amber-500/20 scale-[1.02]"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
          }`}
        >
          <Landmark className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>५. सरकारी व उपयोगी सेवाएं</span>
        </button>

        <button
          onClick={() => setActiveSection("security")}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all shadow-sm ${
            activeSection === "security"
              ? "bg-amber-500 text-slate-950 shadow-amber-500/20 scale-[1.02]"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>६. खाता सुरक्षा व डिवाइस</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: OFFICIAL DIGITAL ID CARD (बाल विकास सेवा LOOK) */}
      {/* ========================================================================= */}
      {activeSection === "id_card" && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                आधिकारिक बाल विकास सेवा डिजिटल पहचान पत्र (Active Digital Card)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCardSide(cardSide === "front" ? "back" : "front")}
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{cardSide === "front" ? "पिछला भाग देखें (Back)" : "सामने का भाग देखें (Front)"}</span>
              </button>

              <button
                onClick={handlePrintIdCard}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट ID कार्ड</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "कॉपी हो गया!" : "शेयर करें"}</span>
              </button>
            </div>
          </div>

          {/* Real Government / Bal Vikas Seva Style ID Card Canvas */}
          <div className="flex justify-center">
            <div
              ref={idCardRef}
              className="w-full max-w-xl bg-white text-slate-900 rounded-3xl border-4 border-amber-500 shadow-2xl overflow-hidden relative"
              style={{ minHeight: "360px" }}
            >
              {/* Card Top Tricolor Strip */}
              <div className="h-3 flex">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-[#FFFFFF] border-y border-slate-200" />
                <div className="flex-1 bg-[#138808]" />
              </div>

              {/* Official Header */}
              <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-white p-4 text-center relative">
                <div className="flex items-center justify-between">
                  {/* Left: Emblem */}
                  <div className="w-11 h-11 rounded-full bg-white text-amber-700 p-1 flex items-center justify-center font-black shadow-md shrink-0">
                    <Landmark className="w-6 h-6" />
                  </div>

                  {/* Center: Official Title */}
                  <div className="space-y-0.5">
                    <p className="text-[10px] sm:text-xs font-black tracking-wider text-amber-200 uppercase">
                      डिजिटल बाल विकास एवं पोषण अध्ययन मिशन
                    </p>
                    <h2 className="text-base sm:text-xl font-black tracking-tight text-white">
                      बाल विकास सेवा (IOIS BAL VIKAS SEVA)
                    </h2>
                    <p className="text-[9px] text-amber-100 font-semibold">
                      कक्षा 1 से 5 विद्यार्थी एवं सदस्य पहचान पत्र • Gov. Recognized Digital Initiative
                    </p>
                  </div>

                  {/* Right: Gold Seal / Emblem */}
                  <div className="w-11 h-11 rounded-full bg-yellow-400 text-slate-950 p-1 flex items-center justify-center font-black shadow-md shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {cardSide === "front" ? (
                /* FRONT SIDE OF ID CARD */
                <div className="p-5 sm:p-6 space-y-4 relative">
                  {/* Background Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                    <span className="text-[120px] font-black">IOIS</span>
                  </div>

                  {/* Main Details Grid */}
                  <div className="grid grid-cols-12 gap-4 items-center relative z-10">
                    {/* Left: Photo & Hologram */}
                    <div className="col-span-4 sm:col-span-3 flex flex-col items-center gap-2">
                      <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-gradient-to-b from-amber-100 to-orange-100 border-2 border-amber-500 shadow-md overflow-hidden flex items-center justify-center p-1">
                        {user.photoUrl ? (
                          <img
                            src={user.photoUrl}
                            alt={user.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-amber-300 to-orange-400 rounded-xl flex flex-col items-center justify-center text-slate-900 font-black">
                            <span className="text-3xl">👧</span>
                            <span className="text-[9px] mt-1 font-bold">छात्र/सदस्य</span>
                          </div>
                        )}
                      </div>

                      {/* Gold Hologram Badge */}
                      <div className="px-2 py-0.5 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 text-slate-950 text-[9px] font-black rounded-md shadow border border-yellow-500 text-center tracking-wide">
                        ★ VERIFIED ★
                      </div>
                    </div>

                    {/* Center & Right: Student Info */}
                    <div className="col-span-8 sm:col-span-9 space-y-2 text-xs">
                      {/* Name */}
                      <div className="border-b border-slate-200 pb-1.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">
                          लाभार्थी / छात्र का नाम (Student Name):
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-none">
                          {user.name}
                        </h3>
                      </div>

                      {/* Unique ID & Class */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">
                            डिजिटल सदस्य ID:
                          </span>
                          <span className="font-mono font-black text-amber-700 text-sm bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                            {user.uniqueId}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">
                            कक्षा (Class Grade):
                          </span>
                          <span className="font-black text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded inline-block">
                            {user.classGrade || "Class 1 (कक्षा 1)"}
                          </span>
                        </div>
                      </div>

                      {/* Guardian & Mobile */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">
                            पिता / अभिभावक:
                          </span>
                          <span className="font-bold text-slate-800">
                            {user.fatherName || "श्री राम कुमार"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">
                            पंजीकृत मोबाइल:
                          </span>
                          <span className="font-mono font-bold text-slate-800">
                            {user.mobile}
                          </span>
                        </div>
                      </div>

                      {/* Issue Date & Validity */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold block">
                            जारी तिथि: {formattedRegDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-emerald-700 font-black block">
                            मान्यता: आजीवन (LIFETIME)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Security Row: Barcode, QR Code & Signatures */}
                  <div className="pt-2 border-t-2 border-dashed border-amber-200 flex items-center justify-between gap-4">
                    {/* Security QR Code */}
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-white border border-slate-300 p-1 rounded-lg shadow-sm flex items-center justify-center">
                        <QrCode className="w-10 h-10 text-slate-900" />
                      </div>
                      <div className="text-[9px] text-slate-500 leading-tight">
                        <span className="font-bold block text-slate-800">सत्यापन कोड</span>
                        <span>QR स्कैन करें</span>
                      </div>
                    </div>

                    {/* Official Stamp */}
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-full border-2 border-red-600/70 text-red-600 flex flex-col items-center justify-center p-0.5 rotate-[-12deg] shadow-sm select-none">
                        <span className="text-[7px] font-black uppercase">बाल विकास सेवा</span>
                        <span className="text-[8px] font-black">★ VERIFIED ★</span>
                        <span className="text-[6px]">PATNA</span>
                      </div>
                    </div>

                    {/* Signatures */}
                    <div className="text-right">
                      <div className="font-serif italic font-black text-xs text-slate-800 tracking-wider">
                        Vikas Kumar
                      </div>
                      <div className="border-t border-slate-400 pt-0.5 text-[9px] text-slate-500 font-bold">
                        निदेशक / प्राधिकृत हस्ताक्षरकर्ता
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* BACK SIDE OF ID CARD */
                <div className="p-5 sm:p-6 space-y-4 relative text-xs">
                  <div className="space-y-2">
                    <h4 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-1">
                      महत्वपूर्ण निर्देश एवं सेवा शर्तें (Terms of Service)
                    </h4>
                    <ul className="space-y-1.5 text-slate-600 text-[11px] list-disc list-inside">
                      <li>यह पहचान पत्र IOIS बाल विकास सेवा मिशन का आधिकारिक डिजिटल दस्तावेज है।</li>
                      <li>इस कार्ड के माध्यम से 720 पृष्ठ संपूर्ण अध्ययन किट एवं पोर्टल का आजीवन एक्सेस प्राप्त है।</li>
                      <li>कार्ड खोने या बदलने की स्थिति में आधिकारिक पोर्टल से तुरंत पुनः डाउनलोड किया जा सकता है।</li>
                      <li>सत्यापन हेतु ऊपर दिए गए क्यूआर कोड को किसी भी मोबाइल स्कैनर से स्कैन किया जा सकता है।</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1 text-[11px]">
                    <span className="font-bold text-amber-900 block">सहायता एवं कार्यालय संपर्क:</span>
                    <p className="text-slate-700">
                      हेल्पलाइन: <strong>+91 8877490845</strong> • ईमेल: <strong>support@iois.in</strong>
                    </p>
                    <p className="text-slate-600 text-[10px]">
                      कार्यालय: बाल विकास सेवा डिजिटल सेल, पटना, बिहार - 800001
                    </p>
                  </div>

                  <div className="text-center pt-2">
                    <span className="font-mono text-[10px] tracking-widest text-slate-400">
                      ||| ||||| |||| |||||| ||| ||||||| {user.uniqueId}
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom Tricolor Strip */}
              <div className="h-2 flex">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-[#FFFFFF]" />
                <div className="flex-1 bg-[#138808]" />
              </div>
            </div>
          </div>

          {/* Download & Usage Information Card */}
          <div className="p-4 bg-amber-50 dark:bg-slate-800/80 rounded-2xl border border-amber-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-extrabold text-amber-900 dark:text-amber-300 block">
                💡 सुझाव: आप इस ID कार्ड का कलर प्रिंट निकालकर लेमिनेशन (PVC Card) करवा सकते हैं!
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                यह पहचान पत्र स्कूल, कोचिंग एवं बाल विकास अध्ययन केंद्रों पर प्रस्तुत करने हेतु 100% मान्य है।
              </p>
            </div>
            <button
              onClick={handlePrintIdCard}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs whitespace-nowrap shadow-sm"
            >
              PVC प्रिंट निकालें
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: BAL VIKAS PUSTIKA & STUDY HUB (720 PAGES ACCESS) */}
      {/* ========================================================================= */}
      {activeSection === "pustika" && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white font-black text-xs uppercase tracking-wider">
                पूर्ण डिजिटल अध्ययन किट • 720 पृष्ठ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                बाल विकास सम्पूर्ण अध्ययन पुस्तिका
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm max-w-2xl">
                A to Z फोनिक्स, अ से ज्ञ वर्णमाला, 12 मात्राएं (बारहखड़ी), 1 से 100 तक गिनती, 1 से 40 तक पहाड़ा, सचित्र कहानियां व दैनिक गृहकार्य।
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab("bal_vikas_pustika")}
              className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-2xl text-sm shadow-xl flex items-center gap-2 shrink-0 transition-transform active:scale-95"
            >
              <span>संपूर्ण 720 पृष्ठ पुस्तिका खोलें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Subject Gateways */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => onNavigateToTab("hindi")}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl font-black">
                अ
              </div>
              <h3 className="font-black text-slate-800 dark:text-slate-100">हिंदी वर्णमाला (अ से ज्ञ)</h3>
              <p className="text-xs text-slate-500">स्वर, व्यंजन व सचित्र मनोहर पोथी का पूरा अभ्यास।</p>
            </div>

            <div
              onClick={() => onNavigateToTab("alphabet26")}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black font-serif">
                Aa
              </div>
              <h3 className="font-black text-slate-800 dark:text-slate-100">Good English (A to Z)</h3>
              <p className="text-xs text-slate-500">26 पृष्ठ फोनिक्स ध्वनियां, शब्द एवं चित्र।</p>
            </div>

            <div
              onClick={() => onNavigateToTab("math")}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl font-black">
                123
              </div>
              <h3 className="font-black text-slate-800 dark:text-slate-100">गणित: गिनती व पहाड़ा</h3>
              <p className="text-xs text-slate-500">1 से 100 गिनती, 1 से 20 पहाड़ा एवं जोड़-घटाव।</p>
            </div>

            <div
              onClick={() => onNavigateToTab("pencil_tracing")}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-sky-500 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-2xl font-black">
                ✏️
              </div>
              <h3 className="font-black text-slate-800 dark:text-slate-100">पेंसिल ट्रेसिंग वीडियो लैब</h3>
              <p className="text-xs text-slate-500">हाथ से पेंसिल चलाने का सटीक एनीमेशन व स्लेट।</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: DAILY HOMEWORK & PROGRESS REPORT */}
      {/* ========================================================================= */}
      {activeSection === "homework_report" && (
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs text-slate-500 font-bold block">अध्ययन स्ट्रीक</span>
              <div className="flex items-center gap-1.5 text-2xl font-black text-amber-600">
                <Flame className="w-6 h-6 fill-amber-500" />
                <span>{progress.streakDays || 3} दिन</span>
              </div>
              <span className="text-[10px] text-slate-400">लगातार अध्ययन सक्रिय</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs text-slate-500 font-bold block">क्विज़ सटीकता</span>
              <div className="text-2xl font-black text-emerald-600 font-mono">
                {progress.quizAccuracy || 90}%
              </div>
              <span className="text-[10px] text-slate-400">उत्कृष्ट प्रदर्शन ⭐</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs text-slate-500 font-bold block">सीखे गए अक्षर</span>
              <div className="text-2xl font-black text-blue-600 font-mono">
                {(progress.hindiLettersLearned?.length || 12) + (progress.englishLettersLearned?.length || 10)}
              </div>
              <span className="text-[10px] text-slate-400">हिंदी व अंग्रेजी कुल</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs text-slate-500 font-bold block">अर्जित मेडल / बैज</span>
              <div className="text-2xl font-black text-purple-600 font-mono">
                {progress.badgesUnlocked?.length || 2} / {DIGITAL_BADGES.length}
              </div>
              <span className="text-[10px] text-slate-400">डिजिटल उपलब्धियां</span>
            </div>
          </div>

          {/* Daily Homework Checklist */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                  आज का दैनिक गृहकार्य (Today's Homework Tasks)
                </h3>
                <p className="text-xs text-slate-500">पूरा होने पर टिक करें और स्टार अर्जित करें!</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                2 / 4 पूर्ण
              </span>
            </div>

            <div className="space-y-3">
              {[
                { id: "hw_1", title: "हिंदी वर्णमाला: अ से उ तक 5 अक्षर बोलकर पढ़ें व स्लेट पर लिखें", tab: "hindi" },
                { id: "hw_2", title: "Good English: A for Apple से E for Elephant तक फोनिक्स उच्चारण", tab: "english" },
                { id: "hw_3", title: "गणित अभ्यास: 1 से 20 तक गिनती व 2 का पहाड़ा याद करें", tab: "math" },
                { id: "hw_4", title: "रचनात्मक ड्रॉइंग: सेब और सूरज का सुंदर चित्र बनाएं", tab: "drawing" },
              ].map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={homeworkStatus[task.id]}
                      onChange={() => toggleHomework(task.id)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        homeworkStatus[task.id]
                          ? "line-through text-slate-400"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {task.title}
                    </span>
                  </label>

                  <button
                    onClick={() => onNavigateToTab(task.tab)}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
                  >
                    अभ्यास करें →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: REFERRAL & EARNINGS MODEL (50%-70% COMMISSION) */}
      {/* ========================================================================= */}
      {activeSection === "earnings" && (
        <div className="space-y-6">
          {/* Earnings Card */}
          <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white font-black text-xs uppercase tracking-wider">
                50% से 70% डायरेक्ट कमीशन मॉडल
              </span>
              <h2 className="text-3xl sm:text-4xl font-black">
                कुल अर्जित राशि: ₹{user.referralEarnings || 21}
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm">
                अपने रेफरल लिंक से अन्य बच्चों या मित्रों को जोड़ें और प्रति रेफरल तुरंत 50% से 70% कमीशन प्राप्त करें।
              </p>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20 space-y-2 text-center shrink-0 w-full md:w-auto">
              <span className="text-xs text-emerald-100 font-bold block">पेआउट स्थिति</span>
              <span className="px-3 py-1 bg-emerald-400 text-slate-950 font-black text-xs rounded-full inline-block">
                सत्यापित (Instant UPI Payout)
              </span>
              <p className="text-[11px] text-emerald-200 pt-1">
                UPI: {user.payoutUpi || user.mobile + "@paytm"}
              </p>
            </div>
          </div>

          {/* Referral Link & Share Box */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
              आपका विशेष रेफरल कोड एवं लिंक
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full flex items-center bg-slate-100 dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate select-all">
                  {referralUrl}
                </span>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "लिंक कॉपी हो गया!" : "रेफरल लिंक कॉपी करें"}</span>
              </button>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-300 space-y-1">
              <span className="font-black block">💡 कमीशन का सीधा नियम:</span>
              <p>
                ₹10 के प्लान पर प्रति रेफरल ₹5 से ₹7 सीधा आपके खाते में जुड़ता है। ₹999 प्लान पर ₹500 से ₹700 तक तुरंत आमदनी!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: GOVT & PUBLIC USEFUL SERVICES */}
      {/* ========================================================================= */}
      {activeSection === "services" && (
        <div className="space-y-6">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-base">
              सरकारी एवं जनोपयोगी सेवाएं (Official Public Services Portal)
            </h3>
            <p className="text-xs text-slate-500">
              बिहार एवं भारत सरकार के महत्वपूर्ण पोर्टल, भूमि रिकॉर्ड, मौसम, शिक्षा टीवी व टूल्स का सीधा उपयोग करें।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Service 1 */}
            <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm">RTPS व भूमि रिकॉर्ड</h4>
              <p className="text-xs text-slate-500">दाखिल खारिज, जमीन लगान रसीद, एलपीसी एवं जाति/आय प्रमाणपत्र।</p>
              <a
                href="https://biharbhumi.bihar.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline"
              >
                <span>पोर्टल खोलें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 2 */}
            <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <CloudSun className="w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm">मौसम पूर्वानुमान (IMD)</h4>
              <p className="text-xs text-slate-500">दैनिक तापमान, वर्षा का अनुमान, आर्द्रता और कृषि अलर्ट।</p>
              <a
                href="https://mausam.imd.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
              >
                <span>मौसम देखें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 3 */}
            <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Tv className="w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm">पीएम ई-विद्या टीवी</h4>
              <p className="text-xs text-slate-500">कक्षा 1 से 5 शैक्षणिक प्रसारण, ज्ञान दर्शन एवं डीडी शिक्षा।</p>
              <a
                href="https://www.youtube.com/@pmevidya"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline"
              >
                <span>लाइव देखें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: ACCOUNT SECURITY & MULTI-DEVICE MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSection === "security" && (
        <div className="space-y-6">
          {/* Active Devices */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                  सक्रिय उपकरण सत्र (Active Devices: {user.devices?.length || 1} / 4)
                </h3>
                <p className="text-xs text-slate-500">
                  आप एक साथ अधिकतम 4 अलग-अलग मोबाइल या कंप्यूटर पर लॉगिन रख सकते हैं।
                </p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                सुरक्षित एन्क्रिप्टेड
              </span>
            </div>

            <div className="space-y-3">
              {(user.devices && user.devices.length > 0
                ? user.devices
                : [
                    {
                      id: "current_device",
                      deviceName: "वर्तमान डिवाइस (Current Device)",
                      browser: "Web Browser",
                      ip: "127.0.0.1",
                      lastActive: new Date().toISOString(),
                    },
                  ]
              ).map((dev, idx) => (
                <div
                  key={dev.id || idx}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-slate-800 text-amber-700 flex items-center justify-center">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {dev.deviceName}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        सक्रिय: {new Date(dev.lastActive).toLocaleTimeString()} • IP: {dev.ip}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                    सक्रिय (Active)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
