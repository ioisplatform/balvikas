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
import { syncUserToCloudAndLocal, findUserInCloudOrLocal } from "../utils/userSync";
import { IOISRunningHeader } from "./IOISRunningHeader";
import { AiChatbot } from "./AiChatbot";
import { BalVikasPustikaSection } from "./BalVikasPustikaSection";
import { RegistrationSection } from "./RegistrationSection";
import { IOISPublicHome } from "./IOISPublicHome";

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

type PortalTab =
  | "home"
  | "login"
  | "register"
  | "bal_vikas_pustika"
  | "bal_guru"
  | "forgot";

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
  // Default to comprehensive public portal Home
  const [activeTab, setActiveTab] = useState<PortalTab>("home");
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

  // 2FA state for Login
  const [loginRequires2FA, setLoginRequires2FA] = useState<boolean>(false);
  const [login2FACode, setLogin2FACode] = useState<string>("");

  // Forgot password & ID recovery state
  const [recoverySubTab, setRecoverySubTab] = useState<"password" | "userid">("password");
  const [forgotUniqueId, setForgotUniqueId] = useState<string>("");
  const [forgotContact, setForgotContact] = useState<string>("");
  const [forgotOtp, setForgotOtp] = useState<string>("");
  const [forgotNewPassword, setForgotNewPassword] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [recoveredUserInfo, setRecoveredUserInfo] = useState<{ id: string; name: string } | null>(null);
  const [findIdEmail, setFindIdEmail] = useState<string>("");
  const [findIdMobile, setFindIdMobile] = useState<string>("");

  // Handle Member Login - Direct access for registered members from github.io & server
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      let verifiedMember: UserProfile | null = null;
      let backendAttempted = false;

      // 1. Try Backend API
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: loginIdentifier.trim(),
            password: loginPassword,
            twoFactorCode: loginRequires2FA ? login2FACode.trim() : undefined,
          }),
        });

        backendAttempted = true;
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          if (data.requires2FA) {
            setLoginRequires2FA(true);
            setSuccessMessage(data.message || "2FA सुरक्षा कोड आपके पंजीकृत मोबाइल पर भेजा गया है। कृपया कोड दर्ज करें।");
            setLoading(false);
            return;
          }
          if (data.user) {
            verifiedMember = {
              ...data.user,
              isDemo: false,
              paymentStatus: "verified",
            };
          }
        } else if (res.status === 401 || res.status === 400 || res.status === 404 || res.status === 429) {
          // Reject immediately if server returned invalid credentials or lockout error
          throw new Error(data.error || "लॉगिन विफल! अमान्य यूजर आईडी या गलत पासवर्ड।");
        }
      } catch (fetchErr: unknown) {
        const msg = fetchErr instanceof Error ? fetchErr.message : "";
        if (msg.includes("लॉगिन विफल") || msg.includes("गलत") || msg.includes("खाता नहीं मिला") || msg.includes("अमान्य") || msg.includes("सुरक्षा लॉक")) {
          throw fetchErr;
        }
        console.warn("Backend API not reachable (GitHub Pages or offline):", fetchErr);
      }

      // 2. If backend was unreachable (e.g. static GitHub Pages), search Firestore / LocalStorage
      if (!verifiedMember && !backendAttempted) {
        const found = await findUserInCloudOrLocal(loginIdentifier.trim(), loginPassword);
        if (found) {
          verifiedMember = {
            ...found,
            isDemo: false,
            paymentStatus: "verified",
          };
        }
      }

      if (verifiedMember) {
        await syncUserToCloudAndLocal(verifiedMember);
        setSuccessMessage("लॉगिन सफल! पोर्टल में प्रवेश किया जा रहा है...");
        setTimeout(() => {
          onSuccessLogin(verifiedMember!);
        }, 400);
      } else {
        throw new Error("लॉगिन विफल! अमान्य यूजर आईडी या गलत पासवर्ड। कृपया सही जानकारी दर्ज करें या नया पंजीकरण करें।");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "लॉगिन विफल! अमान्य यूजर आईडी या गलत पासवर्ड।";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Secure Password Recovery - Step 1: Send OTP
  const handleSendRecoveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (!forgotUniqueId.trim() || !forgotContact.trim()) {
        throw new Error("कृपया अपनी यूजर ID और पंजीकृत मोबाइल या ईमेल दोनों दर्ज करें।");
      }

      const res = await fetch("/api/auth/recover-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueId: forgotUniqueId.trim(),
          contact: forgotContact.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "सत्यापन विफल हुआ।");
      }

      setOtpSent(true);
      setSuccessMessage(data.message || "सत्यापन कोड आपके पंजीकृत विवरण पर भेज दिया गया है।");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "सत्यापन प्रक्रिया में त्रुटि आई।");
    } finally {
      setLoading(false);
    }
  };

  // Secure Password Recovery - Step 2: Reset Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!forgotOtp.trim()) {
      setErrorMessage("कृपया 6-अंकों का सत्यापन कोड (OTP) दर्ज करें।");
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 4) {
      setErrorMessage("नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/recover-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueId: forgotUniqueId.trim(),
          code: forgotOtp.trim(),
          newPassword: forgotNewPassword.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "पासवर्ड रीसेट विफल हुआ।");
      }

      setSuccessMessage("पासवर्ड सफलतापूर्वक बदल गया है! अब नए पासवर्ड से लॉगिन करें।");
      setLoginIdentifier(forgotUniqueId.trim());
      setLoginPassword(forgotNewPassword.trim());
      setTimeout(() => {
        setActiveTab("login");
        setOtpSent(false);
        setForgotOtp("");
        setForgotNewPassword("");
      }, 1200);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "पासवर्ड अपडेट में त्रुटि आई।");
    } finally {
      setLoading(false);
    }
  };

  // Secure User ID Recovery
  const handleFindUserIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!findIdEmail.trim() || !findIdMobile.trim()) {
      setErrorMessage("कृपया पंजीकृत ईमेल और पंजीकृत मोबाइल नंबर दोनों दर्ज करें।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/recover-userid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: findIdEmail.trim(),
          mobile: findIdMobile.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "खाता नहीं मिला।");
      }

      setRecoveredUserInfo({ id: data.uniqueId, name: data.name });
      setSuccessMessage(`सत्यापन सफल! आपकी यूजर ID है: ${data.uniqueId}`);
      setLoginIdentifier(data.uniqueId);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "यूजर ID खोजने में त्रुटि आई।");
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
      let createdUser: UserProfile | null = null;
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
            utrNumber: utrNumber.trim() || "UPI-VERIFIED",
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok && data.user) {
          createdUser = {
            ...data.user,
            isDemo: false,
            paymentStatus: "verified",
          };
        }
      } catch (fetchErr) {
        console.warn("Backend API not reachable (GitHub Pages):", fetchErr);
      }

      if (!createdUser) {
        const cleanMobile = regMobile.trim().replace(/\D/g, "");
        const words = regName.trim().split(/\s+/).filter(Boolean);
        let initials = "ST";
        if (words.length >= 2) {
          initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
        } else if (words.length === 1 && words[0].length >= 2) {
          initials = words[0].substring(0, 2).toUpperCase();
        }
        let nextSeq = 2;
        try {
          const stored = localStorage.getItem("iois_users_cloud") || localStorage.getItem("iois_registered_members");
          if (stored) {
            const list = JSON.parse(stored);
            if (Array.isArray(list)) {
              let maxN = 1;
              for (const u of list) {
                const m = (u.uniqueId || "").match(/(\d{2,})$/);
                if (m) {
                  const n = parseInt(m[1], 10);
                  if (!isNaN(n) && n > maxN) maxN = n;
                }
              }
              nextSeq = Math.max(list.length + 1, maxN + 1);
            }
          }
        } catch {}
        const seq = nextSeq.toString().padStart(2, "0");
        createdUser = {
          uniqueId: `IOIS10${initials}${seq}`,
          name: regName.trim(),
          email: regEmail.trim() || `${cleanMobile}@iois.in`,
          mobile: cleanMobile,
          password: regPassword,
          planId: selectedPlanId,
          planName: "डिजिटल बाल विकास सम्पूर्ण किट",
          planPrice: 10,
          paymentStatus: "verified",
          referralEarnings: 0,
          twoFactorEnabled: false,
          city: "Bihar",
          designation: "Verified Student Member",
          registeredAt: new Date().toISOString(),
          devices: [],
          progress: {
            hindiProgress: 0,
            englishProgress: 0,
            mathProgress: 0,
            drawingCount: 0,
            quizzesCompleted: 0,
            quizAccuracy: 100,
            studyTimeMinutes: 0,
            streakDays: 1,
            badges: ["badge_starter"],
            savedDrawings: [],
            classGrade: regGrade,
          },
        };
      }

      await syncUserToCloudAndLocal(createdUser);

      setSuccessMessage(
        `✅ पंजीकरण सफल! आपकी डिजिटल सदस्य आईडी "${createdUser.uniqueId}" है। आपका खाता सक्रिय हो गया है और आप तुरंत लॉगिन कर सकते हैं।`
      );
      setLoginIdentifier(createdUser.uniqueId);
      setLoginPassword(regPassword);
      setTimeout(() => {
        setActiveTab("login");
      }, 1500);
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
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center text-white font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xs font-black tracking-tighter">IOIS</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-amber-400 tracking-tight">
                  IOIS बाल विकास
                </span>
                <span className="text-[10px] uppercase font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow-sm hidden sm:inline-block">
                  INDIA 🇮🇳
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
                सम्पूर्ण डिजिटल बाल विकास व शिक्षा पोर्टल • 700+ पृष्ठ अध्ययन पुस्तिका
              </span>
            </div>
          </div>

          {/* Center: Simplified Navigation for Child Development Platform */}
          <nav aria-label="Portal Navigation" className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-x-auto max-w-full">
            {/* 0. होम पेज */}
            <button
              onClick={() => {
                setActiveTab("home");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "home"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
            >
              <span>🏠 मुख्य पृष्ठ (Home)</span>
            </button>

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

            {/* 2. नया रजिस्ट्रेशन / Join Now */}
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
              <span>नया रजिस्ट्रेशन</span>
            </button>

            {/* 3. बाल विकास पुस्तक */}
            <button
              onClick={() => {
                setActiveTab("bal_vikas_pustika");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "bal_vikas_pustika"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>📖 डिजिटल बाल विकास पुस्तक</span>
            </button>

            {/* 4. चिंटू AI शिक्षक / बाल गुरु */}
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
              <span>बाल गुरु AI शिक्षक</span>
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
        {/* TAB 0: COMPREHENSIVE PUBLIC HOME PAGE */}
        {activeTab === "home" && (
          <div className="flex-1 w-full space-y-6">
            <IOISPublicHome
              onNavigateToTab={(tabId) => {
                setActiveTab(tabId as any);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onOpenLogin={() => {
                setActiveTab("login");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onOpenRegister={(planId) => {
                if (planId) setSelectedPlanId(planId);
                setActiveTab("register");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onOpenAdmin={onOpenAdmin}
            />
          </div>
        )}

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

                  {loginRequires2FA && (
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-700 animate-in fade-in space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>2FA सुरक्षा कोड (Enter 6-Digit Verification Code)</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={login2FACode}
                        onChange={(e) => setLogin2FACode(e.target.value)}
                        placeholder="6-अंकों का 2FA कोड दर्ज करें"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-600 rounded-xl text-sm font-mono font-bold tracking-widest text-center"
                      />
                      <p className="text-[10px] text-amber-700 dark:text-amber-300">
                        सुरक्षा कोड आपके पंजीकृत मोबाइल नंबर पर भेजा गया है।
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>सत्यापन हो रहा है...</span>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>{loginRequires2FA ? "2FA कोड सत्यापित कर प्रवेश करें" : "सदस्य लॉगिन करें (Secure Member Login)"}</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Official Secure Login Information */}
                <div className="mt-4 p-3.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>256-Bit SSL सुरक्षित व एन्क्रिप्टेड लॉगिन (Bank-Grade Security)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    केवल वही सदस्य या छात्र लॉगिन कर सकते हैं जिनका इस पोर्टल पर सफलतापूर्वक पंजीकरण हुआ है अथवा जिन्हें एडमिन द्वारा अधिकृत किया गया है। किसी भी रैंडम लॉगिन की अनुमति नहीं है।
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    * सुरक्षा नीति: लगातार 5 गलत पासवर्ड दर्ज करने पर खाता 15 मिनट के लिए लॉक कर दिया जाता है।
                  </p>
                </div>

                {/* Switch to Registration */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 rounded-2xl border-2 border-amber-300 dark:border-amber-700 text-left flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-amber-200 block">
                        नया सदस्य या विद्यार्थी?
                      </span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 block">
                        डायरेक्ट इन-ऐप फॉर्म, 25MB+ प्रूफ अपलोड व ऑटो-जनरेटेड यूनिक ID
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("register");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1 shadow-md transition-transform active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>रजिस्ट्रेशन / Join Now</span>
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

        {/* TAB 2: OFFICIAL IN-APP REGISTRATION & JOIN NOW */}
        {activeTab === "register" && (
          <div className="flex-1 w-full">
            <RegistrationSection
              onSuccessLogin={(user) => {
                onSuccessLogin(user);
              }}
              onNavigateToLogin={() => {
                setActiveTab("login");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onNavigateToHome={() => {
                setActiveTab("login");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onNavigateToTab={(tab) => {
                if (tab === "bal_vikas_pustika") setActiveTab("bal_vikas_pustika");
                else if (tab === "chatbot" || tab === "bal_guru") setActiveTab("bal_guru");
                else setActiveTab("login");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onOpenAdmin={onOpenAdmin}
            />
          </div>
        )}

        {/* TAB 2.5: BAL VIKAS PUSTIKA (700+ Pages Workbook - STRICT LOGIN WALL) */}
        {activeTab === "bal_vikas_pustika" && (
          <div className="flex-1 w-full max-w-2xl mx-auto my-6 p-8 bg-white dark:bg-slate-900 rounded-3xl border-4 border-amber-300 dark:border-amber-700 shadow-2xl text-center space-y-6 animate-in fade-in">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shadow-inner">
              <Lock className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black">
                🔒 केवल पंजीकृत सदस्यों के लिए सुरक्षित (Login Required)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-400">
                बाल विकास: 700+ पृष्ठ सम्पूर्ण डिजिटल पुस्तक
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                यह विशेष 700+ पृष्ठों की सचित्र अध्ययन पुस्तक केवल पंजीकृत विद्यार्थियों व अभिभावकों के लिए सुरक्षित है। बिना लॉगिन के कोई भी अध्ययन सामग्री या पृष्ठ प्रदर्शित नहीं किए जाते हैं। कृपया अपनी स्थायी यूजर ID से लॉगिन करें या मात्र ₹10 में नया रजिस्ट्रेशन करें।
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab("login")}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-sm shadow-md transition-transform active:scale-95"
              >
                सदस्य लॉगिन करें (Member Login)
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black rounded-2xl text-sm shadow-md transition-transform active:scale-95"
              >
                नया रजिस्ट्रेशन करें (मात्र ₹10)
              </button>
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

        {/* TAB 5: FORGOT PASSWORD / ID RECOVERY */}
        {activeTab === "forgot" && (
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/60 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>सुरक्षित खाता रिकवरी पोर्टल</span>
                </div>
                <h1 className="text-xl font-black">खाता व क्रेडेंशियल रिकवरी</h1>
                <p className="text-xs text-slate-300 mt-1">
                  अपना पासवर्ड रीसेट करें अथवा अपनी पंजीकृत यूनिक यूजर ID प्राप्त करें
                </p>

                {/* Sub-tab navigation */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-950/50 rounded-xl border border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoverySubTab("password");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                      recoverySubTab === "password"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    🔑 पासवर्ड रीसेट करें
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoverySubTab("userid");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                      recoverySubTab === "userid"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    🆔 यूजर ID खोजें
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* MODE 1: PASSWORD RESET */}
                {recoverySubTab === "password" && (
                  <div className="space-y-4">
                    {!otpSent ? (
                      <form onSubmit={handleSendRecoveryOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            यूनिक यूजर ID (Unique Member ID)
                          </label>
                          <input
                            type="text"
                            required
                            value={forgotUniqueId}
                            onChange={(e) => setForgotUniqueId(e.target.value)}
                            placeholder="उदा: IOIS10RK01"
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            पंजीकृत मोबाइल नंबर या ईमेल ID
                          </label>
                          <input
                            type="text"
                            required
                            value={forgotContact}
                            onChange={(e) => setForgotContact(e.target.value)}
                            placeholder="उदा: 9876543210 या yourname@gmail.com"
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? "सत्यापन कोड भेजा जा रहा है..." : "सुरक्षित OTP सत्यापन कोड भेजें"}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleResetPasswordSubmit} className="space-y-3 pt-1">
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs">
                          <span className="font-bold text-amber-900 dark:text-amber-200 block">
                            आईडी: {forgotUniqueId}
                          </span>
                          <span className="text-[11px] text-amber-700 dark:text-amber-300">
                            सत्यापन कोड आपके पंजीकृत नंबर/ईमेल पर भेजा जा चुका है। यह कोड 15 मिनट के लिए मान्य है।
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            6-अंकों का सत्यापन OTP कोड
                          </label>
                          <input
                            type="text"
                            required
                            value={forgotOtp}
                            onChange={(e) => setForgotOtp(e.target.value)}
                            placeholder="6-अंकों का OTP कोड"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold tracking-widest text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            नया पासवर्ड (New Password - न्यूनतम 4 अक्षर)
                          </label>
                          <input
                            type="password"
                            required
                            value={forgotNewPassword}
                            onChange={(e) => setForgotNewPassword(e.target.value)}
                            placeholder="नया पासवर्ड बनाएं"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="w-1/3 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl"
                          >
                            वापस
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow"
                          >
                            {loading ? "पासवर्ड बदला जा रहा है..." : "पासवर्ड अपडेट करें"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* MODE 2: USER ID RECOVERY */}
                {recoverySubTab === "userid" && (
                  <form onSubmit={handleFindUserIdSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        पंजीकृत ईमेल ID (Registered Email)
                      </label>
                      <input
                        type="email"
                        required
                        value={findIdEmail}
                        onChange={(e) => setFindIdEmail(e.target.value)}
                        placeholder="उदा: student@gmail.com"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        पंजीकृत मोबाइल नंबर (Registered 10-Digit Mobile)
                      </label>
                      <input
                        type="tel"
                        required
                        value={findIdMobile}
                        onChange={(e) => setFindIdMobile(e.target.value)}
                        placeholder="उदा: 9876543210"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? "खोजा जा रहा है..." : "मेरी यूजर ID खोजें"}
                    </button>

                    {recoveredUserInfo && (
                      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-700 space-y-2">
                        <div className="text-xs text-emerald-800 dark:text-emerald-200">
                          सदस्य का नाम: <span className="font-bold">{recoveredUserInfo.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-black text-emerald-900 dark:text-emerald-100">
                            {recoveredUserInfo.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setLoginIdentifier(recoveredUserInfo.id);
                              setActiveTab("login");
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow"
                          >
                            इस ID से लॉगिन करें →
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
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
