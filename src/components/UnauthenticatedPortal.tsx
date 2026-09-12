import React, { useState } from "react";
import {
  BookOpen,
  Lock,
  User,
  Smartphone,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Layers,
  Award,
  Bot,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Landmark,
  FileText,
  UserCheck,
  QrCode,
  CreditCard,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import { UserProfile } from "../types";
import { IOISRunningHeader } from "./IOISRunningHeader";
import { IOIS_PLANS } from "../data/learningData";
import { AiChatbot } from "./AiChatbot";
import { ServicesPortal } from "./ServicesPortal";

interface UnauthenticatedPortalProps {
  onSuccessLogin: (user: UserProfile) => void;
  onOpenAdmin: () => void;
  language: "hi" | "en";
  setLanguage?: (lang: "hi" | "en") => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
  soundEnabled?: boolean;
  setSoundEnabled?: (sound: boolean) => void;
}

type PortalTab = "login" | "register" | "bal_guru" | "official_page" | "forgot";

export const UnauthenticatedPortal: React.FC<UnauthenticatedPortalProps> = ({
  onSuccessLogin,
  onOpenAdmin,
  language,
  setLanguage,
  darkMode = false,
  setDarkMode,
  soundEnabled = true,
  setSoundEnabled,
}) => {
  // Strictly permitted unauthenticated views: Login, Registration, Bal Guru, and IOIS Official Page
  const [activeTab, setActiveTab] = useState<PortalTab>("login");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Registration form state
  const [regName, setRegName] = useState<string>("");
  const [regMobile, setRegMobile] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("bal_vikas_10");
  const [regGrade, setRegGrade] = useState<string>("Class 1");
  const [sponsorId, setSponsorId] = useState<string>("IOIS999VK01");
  const [utrNumber, setUtrNumber] = useState<string>("");

  // Forgot password state
  const [forgotContact, setForgotContact] = useState<string>("");
  const [forgotOtp, setForgotOtp] = useState<string>("");
  const [forgotNewPassword, setForgotNewPassword] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const currentPlan = IOIS_PLANS.find((p) => p.id === selectedPlanId) || IOIS_PLANS[0];

  // Handle Member Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const verifiedMember: UserProfile = {
          ...data.user,
          isDemo: false,
          paymentStatus: "verified",
        };
        localStorage.setItem("iois_user", JSON.stringify(verifiedMember));
        onSuccessLogin(verifiedMember);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "लॉगिन विफल। कृपया सही आईडी व पासवर्ड दर्ज करें।");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "लॉगिन विफल। कृपया सही आईडी व पासवर्ड दर्ज करें।";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle New Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!regName.trim() || !regMobile.trim() || !regPassword) {
      setErrorMessage("कृपया नाम, मोबाइल नंबर और पासवर्ड दर्ज करें।");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage("पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खा रहे हैं।");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim() || `${regMobile.trim()}@iois.in`,
          mobile: regMobile.trim(),
          password: regPassword,
          planId: selectedPlanId,
          classGrade: regGrade,
          sponsorId: sponsorId.trim(),
          utrNumber: utrNumber.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.user) {
        const assignedId = data.user.uniqueId;
        setSuccessMessage(
          `✅ पंजीकरण सफल! आपकी डिजिटल सदस्य आईडी "${assignedId}" है। आपका खाता एडमिन अनुमोदन (Approval) हेतु दर्ज हो गया है। एडमिन द्वारा स्वीकृत (Approved) होने के बाद ही आप लॉगिन कर पाएंगे।`
        );
        // Pre-fill login identifier and redirect to login screen
        setLoginIdentifier(assignedId);
        setLoginPassword("");
        setTimeout(() => {
          setActiveTab("login");
        }, 3000);
      } else {
        throw new Error(data.error || "पंजीकरण विफल। कृपया सही विवरण दर्ज करें।");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "पंजीकरण विफल। कृपया पुनः प्रयास करें।";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Official Running Ticker */}
      <IOISRunningHeader
        onJoinClick={() => setActiveTab("register")}
        showJoinBtn={activeTab !== "register"}
      />

      {/* 2. Top Navigation Bar: ONLY the permitted 4 options */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div
            onClick={() => setActiveTab("login")}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 dark:text-amber-400 tracking-tight">
                  IOIS बाल विकास
                </span>
                <span className="text-[10px] uppercase font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800 hidden sm:inline-block">
                  प्राथमिक शिक्षा
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                कक्षा 1 से 5 डिजिटल अध्ययन एवं नागरिक सेवा मंच
              </span>
            </div>
          </div>

          {/* Center: The ONLY 4 Allowed Options */}
          <nav aria-label="Portal Navigation" className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-x-auto">
            {/* 1. सदस्य लॉगिन */}
            <button
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "login" || activeTab === "forgot"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>सदस्य लॉगिन</span>
            </button>

            {/* 2. नया रजिस्ट्रेशन */}
            <button
              onClick={() => {
                setActiveTab("register");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "register"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-300" />
              <span>नया रजिस्ट्रेशन (₹10)</span>
            </button>

            {/* 3. बाल गुरु AI */}
            <button
              onClick={() => {
                setActiveTab("bal_guru");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "bal_guru"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>बाल गुरु AI</span>
            </button>

            {/* 4. IOIS की ऑफिशियल पेज */}
            <button
              onClick={() => {
                setActiveTab("official_page");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "official_page"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>IOIS ऑफिशियल पेज</span>
            </button>
          </nav>

          {/* Right: Language, Sound, Dark mode, Admin */}
          <div className="flex items-center gap-1.5">
            {setLanguage && (
              <button
                onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                title="भाषा बदलें (Switch Language)"
              >
                {language === "hi" ? "EN" : "हिन्दी"}
              </button>
            )}

            {setSoundEnabled && (
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                title={soundEnabled ? "आवाज बंद करें" : "आवाज चालू करें"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
            )}

            {setDarkMode && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                title={darkMode ? "लाइट मोड" : "डार्क मोड"}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              एडमिन
            </button>
          </div>
        </div>
      </header>

      {/* Main Active View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col justify-start">
        {/* TAB 1: MEMBER LOGIN */}
        {activeTab === "login" && (
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 text-white text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
                  <UserCheck className="w-3.5 h-3.5 text-yellow-300" />
                  <span>सत्यापित सदस्य प्रवेश द्वार</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black">IOIS सदस्य लॉगिन</h1>
                <p className="text-xs text-amber-100 mt-1 max-w-md mx-auto">
                  संपूर्ण 48 पृष्ठों की अध्ययन किट, मनोहर पोथी, गुड इंग्लिश व डिजिटल ID कार्ड पाने के लिए अपनी आईडी व पासवर्ड से लॉगिन करें।
                </p>
              </div>

              <div className="p-6">
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      यूनिक ID / मोबाइल नंबर / ईमेल
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="उदा: IOIS10RK01 या 9876543210"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        पासवर्ड (Password)
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveTab("forgot")}
                        className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                      >
                        ID या पासवर्ड भूल गए?
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="पासवर्ड दर्ज करें"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>लॉगिन हो रहा है...</span>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>सदस्य लॉगिन करें (Enter Member Portal)</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to Registration */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-left flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-amber-200 block">
                        नया विद्यार्थी या अभिभावक?
                      </span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 block">
                        मात्र ₹10 में 48 पृष्ठ डिजिटल किट व ID कार्ड पाएं
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>नया रजिस्ट्रेशन</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>केवल एडमिन द्वारा स्वीकृत (Approved) सदस्य ही पोर्टल में लॉगिन कर सकते हैं।</span>
                  </div>
                </div>
              </div>

              {/* Bottom SSL Security */}
              <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>सुरक्षित SSL 256-बिट एन्क्रिप्टेड पोर्टल</span>
                </span>
                <span className="font-mono font-bold text-amber-600">
                  हेल्पलाइन: +91 8877490845
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NEW REGISTRATION */}
        {activeTab === "register" && (
          <div className="flex-1 max-w-2xl mx-auto w-full py-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 text-white text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>नया विद्यार्थी / सदस्य रजिस्ट्रेशन</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black">IOIS बाल विकास डिजिटल किट</h1>
                <p className="text-xs text-amber-100 mt-1 max-w-md mx-auto">
                  मात्र ₹10 में प्राथमिक शिक्षा (NCERT कक्षा 1 से 5) की संपूर्ण 48 पृष्ठ सचित्र सामग्री, मनोहर पोथी, गुड इंग्लिश व डिजिटल ID कार्ड प्राप्त करें।
                </p>
              </div>

              <div className="p-6">
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Highlighted ₹10 Plan Card */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-600/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs uppercase font-extrabold text-amber-800 dark:text-amber-300 block">
                          प्राथमिक शिक्षा बेसिक किट (Class 1-5)
                        </span>
                        <h2 className="text-base font-black text-slate-900 dark:text-white">
                          48 पृष्ठ सम्पूर्ण अध्ययन किट
                        </h2>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-amber-600 dark:text-amber-400">₹10</span>
                        <span className="text-[10px] text-slate-500 block">एकमुश्त सदस्यता</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2.5 border-t border-amber-200/80 dark:border-amber-800/50 text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1">✓ 48 पृष्ठ सचित्र किट</span>
                      <span className="flex items-center gap-1">✓ हिंदी मनोहर पोथी</span>
                      <span className="flex items-center gap-1">✓ गुड इंग्लिश व वोकैब</span>
                      <span className="flex items-center gap-1">✓ 1-100 गिनती व पहाड़े</span>
                      <span className="flex items-center gap-1">✓ डिजिटल स्टूडेंट ID कार्ड</span>
                      <span className="flex items-center gap-1">✓ शुद्ध ऑडियो उच्चारण</span>
                    </div>

                    {/* Plan Selector if higher plan desired */}
                    <div className="mt-3 pt-2 border-t border-amber-200/50 flex items-center justify-between text-xs">
                      <label className="text-slate-600 dark:text-slate-400 font-semibold">
                        अन्य प्लान चुनें:
                      </label>
                      <select
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        className="px-2 py-1 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg text-xs font-bold"
                      >
                        {IOIS_PLANS.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            ₹{plan.price} - {plan.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Student Details Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        विद्यार्थी का नाम *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="विद्यार्थी का नाम दर्ज करें"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        मोबाइल नंबर *
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={regMobile}
                          onChange={(e) => setRegMobile(e.target.value)}
                          placeholder="10 अंकों का मोबाइल नंबर"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ईमेल आईडी (वैकल्पिक)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        कक्षा (Class Grade)
                      </label>
                      <select
                        value={regGrade}
                        onChange={(e) => setRegGrade(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
                      >
                        <option value="Class 1">कक्षा 1 (Class 1)</option>
                        <option value="Class 2">कक्षा 2 (Class 2)</option>
                        <option value="Class 3">कक्षा 3 (Class 3)</option>
                        <option value="Class 4">कक्षा 4 (Class 4)</option>
                        <option value="Class 5">कक्षा 5 (Class 5)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        पासवर्ड बनाएं *
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="न्यूनतम 4 अक्षर"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        पासवर्ड की पुष्टि करें *
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="वही पासवर्ड दोबारा लिखें"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment & Sponsor Details */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>स्पॉन्सर / रेफरल आईडी:</span>
                      <span className="font-mono text-amber-600 font-bold">{sponsorId}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span>UPI भुगतान पता:</span>
                      <span className="font-mono font-bold text-emerald-600">ioisplatform@okaxis</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        12 अंकों का UTR / Transaction No. (वैकल्पिक)
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="उदा: 423987654321"
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>पंजीकरण हो रहा है...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>पंजीकरण पूरा करें (Get Digital ID)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-xs text-slate-500">पहले से खाता है? </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      सदस्य लॉगिन करें
                    </button>
                  </div>
                </form>
              </div>

              {/* Bottom Security Footer */}
              <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>सुरक्षित SSL 256-बिट एन्क्रिप्टेड पोर्टल</span>
                </span>
                <span className="font-mono font-bold text-amber-600">
                  हेल्पलाइन: +91 8877490845
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BAL GURU AI (Interactive AI Tutor for visitors) */}
        {activeTab === "bal_guru" && (
          <div className="flex-1 w-full flex flex-col space-y-4">
            {/* Bal Guru Introduction Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-5 rounded-3xl shadow-xl border border-blue-600/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <Bot className="w-7 h-7 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-black">
                      बाल गुरु AI — आपका डिजिटल शिक्षक व मार्गदर्शक
                    </h1>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[10px]">
                      FREE
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 mt-1 max-w-2xl">
                    नमस्ते प्रिय विद्यार्थी व अभिभावक! बाल गुरु से हिंदी वर्णमाला, अंग्रेजी अक्षर, गणित पहाड़े, नैतिक कहानियां या कोई भी पहेली बिना रोकटोक पूछें।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab("register")}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>नया रजिस्ट्रेशन (₹10)</span>
                </button>
                <button
                  onClick={() => setActiveTab("login")}
                  className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-black text-xs border border-white/30 transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>सदस्य लॉगिन</span>
                </button>
              </div>
            </div>

            {/* Interactive Bal Guru AI Chatbot */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 min-h-[500px] flex flex-col">
              <AiChatbot
                language={language}
                soundEnabled={soundEnabled}
                selectedGrade="Class 1"
                studentName="प्रिय विद्यार्थी"
              />
            </div>

            {/* Educational Kit Callout */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong className="font-bold text-slate-900 dark:text-amber-200">
                    सम्पूर्ण 48 पृष्ठों की सचित्र मनोहर पोथी, गुड इंग्लिश व डिजिटल ID कार्ड
                  </strong>{" "}
                  का पूर्ण एक्सेस पाने के लिए कृपया मात्र ₹10 में नया रजिस्ट्रेशन करें अथवा लॉगिन करें।
                </span>
              </div>
              <button
                onClick={() => setActiveTab("register")}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0"
              >
                रजिस्ट्रेशन करें
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: IOIS OFFICIAL PAGE (Official Public Services Portal) */}
        {activeTab === "official_page" && (
          <div className="flex-1 w-full flex flex-col space-y-4">
            {/* Official Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 rounded-3xl shadow-xl border border-emerald-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <Globe className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-black">
                      IOIS आधिकारिक नागरिक एवं डिजिटल सेवा मंच
                    </h1>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px]">
                      OFFICIAL
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100 mt-1 max-w-2xl">
                    बिहार लोक सेवाएं (RTPS), भूमि दाखिल-खारिज, मौसम पूर्वानुमान, दूरदर्शन बिहार शैक्षिक प्रसारण, पंचांग एवं IOIS बाल विकास मंच।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab("register")}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>नया रजिस्ट्रेशन (₹10)</span>
                </button>
                <button
                  onClick={() => setActiveTab("login")}
                  className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-black text-xs border border-white/30 transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>सदस्य लॉगिन</span>
                </button>
              </div>
            </div>

            {/* Services Portal Component */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
              <ServicesPortal
                user={null}
                language={language}
                soundEnabled={soundEnabled}
                onOpenAdmin={onOpenAdmin}
                onOpenAuth={() => setActiveTab("login")}
              />
            </div>

            {/* Official Contact & Head Office Details */}
            <div className="bg-slate-50 dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Landmark className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-slate-900 dark:text-white">मुख्यालय (Head Office)</strong>
                  <span className="text-slate-500 dark:text-slate-400">
                    IOIS डिजिटल बाल विकास, पटना, बिहार - 800001
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-slate-900 dark:text-white">हेल्पलाइन नंबर</strong>
                  <span className="text-slate-500 dark:text-slate-400 font-mono font-bold">
                    +91 8877490845 (सुबह 9:00 से शाम 7:00)
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-slate-900 dark:text-white">आधिकारिक ईमेल</strong>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">
                    ioisplatform@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FORGOT PASSWORD / ID RECOVERY */}
        {activeTab === "forgot" && (
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white text-center">
                <h1 className="text-xl font-black">ID / पासवर्ड रिकवरी</h1>
                <p className="text-xs text-slate-300 mt-1">
                  अपना पंजीकृत मोबाइल नंबर दर्ज करें और नया पासवर्ड सेट करें
                </p>
              </div>

              <div className="p-6 space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs">
                    {successMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    पंजीकृत मोबाइल नंबर
                  </label>
                  <input
                    type="tel"
                    value={forgotContact}
                    onChange={(e) => setForgotContact(e.target.value)}
                    placeholder="उदा: 9876543210"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(true);
                    setSuccessMessage("सत्यापन OTP: 123456 आपके नंबर पर भेजा गया है।");
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
                >
                  OTP प्राप्त करें
                </button>

                {otpSent && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        OTP दर्ज करें
                      </label>
                      <input
                        type="text"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        placeholder="6 अंकों का OTP (उदा: 123456)"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        नया पासवर्ड दर्ज करें
                      </label>
                      <input
                        type="password"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="नया पासवर्ड"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSuccessMessage("पासवर्ड सफलतापूर्वक रीसेट हो गया है! अब सदस्य लॉगिन करें।");
                        setTimeout(() => {
                          setActiveTab("login");
                        }, 900);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                    >
                      पासवर्ड अपडेट करें
                    </button>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    ← वापस लॉगिन पर जाएं
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
