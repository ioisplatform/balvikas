import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { UserProfile, StudentProgress } from "../types";
import { IOIS_PLANS } from "../data/learningData";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: UserProfile) => void;
  language: "hi" | "en";
  initialMode?: "login" | "register" | "forgot";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  language,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);

  React.useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorHint, setTwoFactorHint] = useState("");

  // Registration form state (Matching https://ioisplatform.github.io/)
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("bal_vikas_10");
  const [referralCode, setReferralCode] = useState("IOISVIP");
  const [regGrade, setRegGrade] = useState("Class 1");

  // Forgot password form state
  const [forgotContact, setForgotContact] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [recoveredId, setRecoveredId] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) return null;

  // Selected plan calculation
  const currentPlan = IOIS_PLANS.find((p) => p.id === selectedPlanId) || IOIS_PLANS[0];

  // Helper for static client fallback progress
  const createFallbackProgress = (id: string): StudentProgress => ({
    userId: id,
    hindiProgress: 35,
    englishProgress: 25,
    mathProgress: 20,
    drawingCount: 0,
    quizzesCompleted: 1,
    quizAccuracy: 80,
    studyTimeMinutes: 45,
    streakDays: 3,
    badges: ["badge_varnamala_champ"],
    savedDrawings: [],
    classGrade: "Class 1",
    hindiLettersLearned: ["अ", "आ", "इ", "ई", "क", "ख"],
    englishLettersLearned: ["A", "B", "C"],
    mathCompleted: false,
    drawingsCount: 0,
    badgesUnlocked: ["badge_varnamala_champ"],
    quizTotalQuestions: 5,
    quizCorrectAnswers: 4,
    lastActive: new Date().toISOString(),
  });

  // Helper to preview generated Unique ID
  const computePreviewId = () => {
    if (!regName.trim()) return "IOIS10XX01";
    const words = regName.trim().split(/\s+/).filter(Boolean);
    let initials = "ST";
    if (words.length >= 2) {
      initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 2) {
      initials = words[0].substring(0, 2).toUpperCase();
    }
    const planCode = currentPlan.price.toString().padStart(2, "0");
    return `IOIS${planCode}${initials}01`;
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      let loggedInUser: UserProfile | null = null;
      let isBackendAvailable = true;

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: loginIdentifier,
            password: loginPassword,
            twoFactorCode: requires2FA ? twoFactorCode : undefined,
            deviceName: navigator.userAgent.includes("Mobile") ? "Mobile Phone" : "Laptop/PC",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.requires2FA) {
            setRequires2FA(true);
            setTwoFactorHint(data.message + (data.demoOtp ? ` (Demo Code: ${data.demoOtp})` : ""));
            setSuccessMessage("कृपया आपके मोबाइल पर भेजा गया 2FA कोड दर्ज करें।");
            setLoading(false);
            return;
          }
          loggedInUser = data.user;
        } else if (res.status === 400 || res.status === 401 || res.status === 403) {
          const errData = await res.json();
          throw new Error(errData.error || "लॉगिन विफल (गलत आईडी या पासवर्ड)");
        } else {
          isBackendAvailable = false;
        }
      } catch (fetchErr: unknown) {
        const msg = fetchErr instanceof Error ? fetchErr.message : "";
        if (msg.includes("लॉगिन विफल") || msg.includes("गलत आईडी")) {
          throw fetchErr;
        }
        isBackendAvailable = false;
      }

      // Static hosting fallback (e.g., GitHub Pages without Node backend)
      if (!isBackendAvailable && !loggedInUser) {
        const savedUserStr = localStorage.getItem("iois_user");
        if (savedUserStr) {
          try {
            const parsed = JSON.parse(savedUserStr);
            if (parsed.uniqueId === loginIdentifier || parsed.mobile === loginIdentifier || parsed.email === loginIdentifier) {
              loggedInUser = parsed;
            }
          } catch {
            // ignore
          }
        }

        if (!loggedInUser) {
          const fallbackId = loginIdentifier.toUpperCase().startsWith("IOIS") 
            ? loginIdentifier.toUpperCase() 
            : `IOIS10${loginIdentifier.slice(-4).toUpperCase() || "ST01"}`;

          loggedInUser = {
            uniqueId: fallbackId,
            name: loginIdentifier.includes("@") ? loginIdentifier.split("@")[0] : "IOIS Member",
            email: loginIdentifier.includes("@") ? loginIdentifier : "member@iois.in",
            mobile: loginIdentifier.length === 10 ? loginIdentifier : "9876543210",
            planId: "bal_vikas_10",
            planName: "बाल विकास बेसिक (Class 1-5)",
            planPrice: 10,
            referralCode: "IOISVIP",
            classGrade: "Class 1",
            sponsorId: "IOIS999VK01",
            city: "Bihar",
            designation: "Verified Member",
            paymentStatus: "verified",
            referralEarnings: 0,
            twoFactorEnabled: false,
            devices: [{
              id: "dev_github_1",
              deviceName: navigator.userAgent.includes("Mobile") ? "Mobile Phone" : "Laptop/PC",
              browser: "Web Browser",
              ip: "GitHub Pages Client",
              lastActive: new Date().toISOString(),
              isCurrent: true,
            }],
            progress: createFallbackProgress(fallbackId),
          };
        }
      }

      if (loggedInUser) {
        const verifiedUser: UserProfile = {
          ...loggedInUser,
          isDemo: false,
          paymentStatus: "verified",
        };
        setSuccessMessage("लॉगिन सफल!");
        setTimeout(() => {
          onSuccessLogin(verifiedUser);
          onClose();
        }, 700);
      } else {
        throw new Error("लॉगिन विफल (खाता नहीं मिला)");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "लॉगिन विफल";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (regPassword !== regConfirmPassword) {
      setErrorMessage(language === "hi" ? "पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते!" : "Passwords do not match!");
      return;
    }

    if (regMobile.trim().length !== 10) {
      setErrorMessage(language === "hi" ? "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      let registeredUser: UserProfile | null = null;
      let isBackendAvailable = true;

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: regName,
            email: regEmail,
            mobile: regMobile,
            password: regPassword,
            planId: currentPlan.id,
            planName: currentPlan.name,
            planPrice: currentPlan.price,
            referralCode,
            classGrade: regGrade,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          registeredUser = data.user;
        } else if (res.status === 400) {
          const errData = await res.json();
          throw new Error(errData.error || "पंजीकरण विफल");
        } else {
          isBackendAvailable = false;
        }
      } catch (fetchErr: unknown) {
        const msg = fetchErr instanceof Error ? fetchErr.message : "";
        if (msg.includes("पंजीकरण विफल") || msg.includes("पहले से पंजीकृत")) {
          throw fetchErr;
        }
        isBackendAvailable = false;
      }

      // Static hosting fallback (e.g., GitHub Pages)
      if (!isBackendAvailable && !registeredUser) {
        const generatedId = computePreviewId();
        registeredUser = {
          uniqueId: generatedId,
          name: regName,
          email: regEmail,
          mobile: regMobile,
          planId: currentPlan.id,
          planName: currentPlan.name,
          planPrice: currentPlan.price,
          referralCode,
          classGrade: regGrade,
          sponsorId: "IOIS999VK01",
          city: "Bihar",
          designation: "Verified Member",
          paymentStatus: "verified",
          referralEarnings: 0,
          twoFactorEnabled: false,
          devices: [{
            id: "dev_github_1",
            deviceName: navigator.userAgent.includes("Mobile") ? "Mobile Phone" : "Laptop/PC",
            browser: "Web Browser",
            ip: "GitHub Pages Client",
            lastActive: new Date().toISOString(),
            isCurrent: true,
          }],
          progress: createFallbackProgress(generatedId),
        };
      }

      if (registeredUser) {
        const activeUser: UserProfile = {
          ...registeredUser,
          isDemo: false,
          paymentStatus: "verified",
        };
        setSuccessMessage(`सफलतापूर्वक पंजीकृत! आपकी यूनिक आईडी है: ${activeUser.uniqueId}`);
        setTimeout(() => {
          onSuccessLogin(activeUser);
          onClose();
        }, 1000);
      } else {
        throw new Error("पंजीकरण विफल");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration error";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot ID & Password
  const handleForgotLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (!otpSent) {
        const res = await fetch("/api/auth/recover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact: forgotContact }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "खाता नहीं मिला");

        setRecoveredId(data.maskedUniqueId);
        setOtpSent(true);
        setSuccessMessage(`सत्यापन कोड भेजा गया! आपकी Unique ID है: ${data.maskedUniqueId} (Demo OTP: ${data.testOtp})`);
      } else {
        const res = await fetch("/api/auth/recover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact: forgotContact,
            otpCode: forgotOtp,
            newPassword: forgotNewPassword,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "पासवर्ड रीसेट विफल");

        setSuccessMessage("पासवर्ड सफलतापूर्वक बदल गया है! कृपया नई जानकारी से लॉगिन करें।");
        setTimeout(() => {
          setMode("login");
          setLoginIdentifier(recoveredId || forgotContact);
          setOtpSent(false);
        }, 1500);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "त्रुटि हुई";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-black text-lg">
              IOIS
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-200">
                IOIS SECURE ACCESS
              </div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                {mode === "login"
                  ? "सदस्य लॉगिन (Member Login)"
                  : mode === "register"
                  ? "नया सदस्य रजिस्ट्रेशन (New Registration)"
                  : "आईडी / पासवर्ड रिकवरी (Account Recovery)"}
              </h3>
              <p className="text-[11px] text-amber-100 font-medium">
                {mode === "login"
                  ? "अपने IOIS डैशबोर्ड और डिजिटल ID कार्ड में प्रवेश करें"
                  : "मात्र ₹10 से डिजिटल अध्ययन किट व आईडी कार्ड प्राप्त करें"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1">
          <button
            onClick={() => {
              setMode("login");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === "login"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            सदस्य लॉगिन
          </button>
          <button
            onClick={() => {
              setMode("register");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === "register"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            नया रजिस्ट्रेशन
          </button>
          <button
            onClick={() => {
              setMode("forgot");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === "forgot"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            ID / पास रिकवरी
          </button>
        </div>

        {/* Messages */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  User ID, मोबाइल नंबर या ईमेल:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="उदा. IOIS10RK01 या 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    पासवर्ड (Password):
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                  >
                    पासवर्ड भूल गए?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="अपना पासवर्ड दर्ज करें"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2FA input if triggered */}
              {requires2FA && (
                <div className="p-3 bg-amber-50 dark:bg-slate-800/80 rounded-xl border border-amber-300 dark:border-amber-700/50">
                  <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>2-फैक्टर ऑथेंटिकेशन कोड (2FA OTP)</span>
                  </label>
                  <input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="6-अंकों का OTP कोड"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-amber-300 dark:border-slate-700 font-mono tracking-widest text-center text-lg font-bold"
                  />
                  {twoFactorHint && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{twoFactorHint}</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-xl text-sm shadow-md shadow-amber-500/25 transition-transform active:scale-98 flex items-center justify-center gap-2"
              >
                {loading ? "सत्यापित किया जा रहा है..." : "लॉगिन करें (LOGIN NOW)"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-slate-600 dark:text-slate-400 hover:text-amber-600 font-medium"
                >
                  यूजर ID भूल गए? (Forgot ID)
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-amber-600 dark:text-amber-400 font-extrabold hover:underline"
                >
                  नया रजिस्ट्रेशन करें →
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>डेमो क्रेडेंशियल: </span>
                <span className="font-mono font-bold text-amber-600">IOIS10RK01</span> /{" "}
                <span className="font-mono font-bold text-amber-600">Password@123</span>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Unique ID Explanation & Preview Banner */}
              <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-850 border border-amber-300 dark:border-amber-800/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    आपकी तैयार होने वाली यूनिक ID:
                  </span>
                  <span className="font-mono text-base font-black text-amber-900 dark:text-amber-100 px-2.5 py-0.5 bg-white dark:bg-slate-700 rounded-lg shadow-xs border border-amber-200 dark:border-slate-600">
                    {computePreviewId()}
                  </span>
                </div>

                {/* ID Structure Breakdown */}
                <div className="p-2.5 bg-white/80 dark:bg-slate-900/60 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 space-y-1 border border-amber-100 dark:border-slate-750">
                  <div className="font-semibold text-slate-700 dark:text-slate-200">
                    यूनिक आईडी संरचना नियम (उदा. <span className="font-mono font-bold text-amber-600">IOIS10RK01</span>):
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px] font-mono">
                    <div className="p-1 bg-amber-50 dark:bg-slate-800 rounded border border-amber-200 text-center">
                      <span className="font-bold text-amber-700 dark:text-amber-400 block">IOIS</span>
                      <span className="text-[9px] text-slate-500 font-sans">प्लेटफॉर्म नाम</span>
                    </div>
                    <div className="p-1 bg-amber-50 dark:bg-slate-800 rounded border border-amber-200 text-center">
                      <span className="font-bold text-amber-700 dark:text-amber-400 block">
                        {currentPlan.price.toString().padStart(2, "0")}
                      </span>
                      <span className="text-[9px] text-slate-500 font-sans">प्लान (₹{currentPlan.price})</span>
                    </div>
                    <div className="p-1 bg-amber-50 dark:bg-slate-800 rounded border border-amber-200 text-center">
                      <span className="font-bold text-amber-700 dark:text-amber-400 block">
                        {computePreviewId().substring(
                          4 + currentPlan.price.toString().padStart(2, "0").length,
                          computePreviewId().length - 2
                        )}
                      </span>
                      <span className="text-[9px] text-slate-500 font-sans">नाम के आद्याक्षर</span>
                    </div>
                    <div className="p-1 bg-amber-50 dark:bg-slate-800 rounded border border-amber-200 text-center">
                      <span className="font-bold text-amber-700 dark:text-amber-400 block">01</span>
                      <span className="text-[9px] text-slate-500 font-sans">सदस्य क्रम</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 pt-0.5 italic">
                    जैसे: राहुल कुमार पहला यूजर है जिसने ₹10 से ज्वाइन किया तो ID बनी IOIS10RK01
                  </p>
                </div>

                {/* Plan Earning Calculation Note */}
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">प्लान कमीशन: </span>
                    <span>
                      चयनित ₹{currentPlan.price} प्लान पर डायरेक्ट पेआउट ₹{currentPlan.directPayout} ({currentPlan.commissionPercent}% कमीशन) है।
                    </span>
                    <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                      (नोट: हर प्लान पर फ्लैट 70% नहीं है, प्रत्येक प्लान की निर्धारित कमीशन दर 50% से 70% के मध्य है)
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  पूरा नाम (Full Name) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="जैसे: Rahul Kumar"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ईमेल आईडी (Email) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    मोबाइल नंबर (Mobile) *
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Grade and Plan Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    कक्षा (Grade)
                  </label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    प्लान चयन करें (Select Plan)
                  </label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-amber-700 dark:text-amber-400"
                  >
                    {IOIS_PLANS.map((p) => (
                      <option key={p.id} value={p.id}>
                        ₹{p.price} - {p.name} (पेआउट: ₹{p.directPayout}, {p.commissionPercent}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password and Confirm Password with eye toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    पासवर्ड बनाएँ *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    पुष्टि करें (Confirm) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  रेफरल कोड (वैकल्पिक)
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="IOISVIP"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono uppercase"
                />
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>एक ईमेल और मोबाइल नंबर केवल 1 बार इस्तेमाल किया जा सकता है।</span>
                </p>
                <p>• मल्टी-डिवाइस लॉगिन (अधिकतम 4 उपकरण) और क्लाउड ऑटो-सिंक सक्रिय रहेगा।</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-sm shadow-md shadow-amber-500/25 transition-transform active:scale-98 flex items-center justify-center gap-2"
              >
                {loading ? "पंजीकरण हो रहा है..." : "रजिस्टर करें और शुरू करें"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  पहले से अकाउंट है? सदस्य लॉगिन करें →
                </button>
              </div>
            </form>
          )}

          {/* FORGOT USER ID & PASSWORD RECOVERY FORM */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotLookup} className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === "hi"
                  ? "यदि आप अपना यूजर ID या पासवर्ड भूल गए हैं, तो पंजीकृत मोबाइल नंबर या ईमेल दर्ज करें। आप सीधे अपनी यूनिक आईडी देख सकेंगे और नया पासवर्ड सेट कर सकेंगे।"
                  : "If you forgot your User ID or Password, enter your registered Mobile Number or Email to self-recover."}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "hi" ? "पंजीकृत ईमेल या मोबाइल नंबर" : "Registered Email or Mobile"}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    disabled={otpSent}
                    value={forgotContact}
                    onChange={(e) => setForgotContact(e.target.value)}
                    placeholder="9876543210 या email@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {otpSent && (
                <>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl">
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 block font-semibold">
                      सत्यापित यूनिक यूजर आईडी:
                    </span>
                    <span className="font-mono text-base font-extrabold text-emerald-800 dark:text-emerald-200">
                      {recoveredId}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      सत्यापन OTP कोड (Demo: 123456)
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 font-mono tracking-widest text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      नया पासवर्ड सेट करें (Set New Password)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="नया पासवर्ड"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-sm shadow-md shadow-amber-500/25 transition-transform active:scale-98 flex items-center justify-center gap-2"
              >
                {loading
                  ? "सत्यापित किया जा रहा है..."
                  : !otpSent
                  ? "रिकवरी कोड और आईडी प्राप्त करें"
                  : "पासवर्ड रीसेट करें"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
