import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Sparkles,
  User,
  Smartphone,
  Mail,
  MapPin,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  CreditCard,
  Building2,
  BookOpen,
  ArrowLeft,
  Bot,
  Award,
  ChevronRight,
  Copy,
} from "lucide-react";
import { UserProfile } from "../types";

interface RegistrationSectionProps {
  onSuccessLogin?: (user: UserProfile) => void;
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenAdmin?: () => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  onSuccessLogin,
  onNavigateToLogin,
  onNavigateToHome,
  onNavigateToTab,
  onOpenAdmin,
}) => {
  // 1. Personal & Sponsor Details
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [sponsorId, setSponsorId] = useState("IOIS999VK01");
  const [emailId, setEmailId] = useState("");
  const [cityState, setCityState] = useState("पटना, बिहार");
  const [childGrade, setChildGrade] = useState("Class 1 (कक्षा 1)");

  // 2. Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 3. Profile Photo
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [photoDriveLink, setPhotoDriveLink] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  // 4. Token Registration & Payment
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>("");
  const [screenshotDriveLink, setScreenshotDriveLink] = useState("");
  const [screenshotFileName, setScreenshotFileName] = useState("");
  const [isCompressingScreenshot, setIsCompressingScreenshot] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<UserProfile | null>(null);

  // Official constants
  const OFFICIAL_PAYEE_NAME = "Vikas Kumar";
  const OFFICIAL_UPI_ADDRESS = "8877490845@spicepay";
  const OFFICIAL_WHATSAPP = "+91 8877490845";
  const REGISTRATION_FEE = 10;

  // Estimated User ID calculation
  const estimatedUserId = useMemo(() => {
    const trimmed = fullName.trim();
    let initials = "BV";
    if (trimmed) {
      const parts = trimmed.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else if (parts.length === 1 && parts[0].length >= 2) {
        initials = parts[0].substring(0, 2).toUpperCase();
      } else if (parts[0]) {
        initials = (parts[0][0] + "X").toUpperCase();
      }
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
    const seqStr = nextSeq.toString().padStart(2, "0");
    return `IOIS10${initials}${seqStr}`;
  }, [fullName]);

  // Client-side image compression utility
  const handleCompressFile = (file: File, type: "photo" | "screenshot") => {
    if (type === "photo") setIsCompressingPhoto(true);
    else setIsCompressingScreenshot(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedData = canvas.toDataURL("image/jpeg", 0.75);

          if (type === "photo") {
            setPhotoDataUrl(compressedData);
            setPhotoFileName(file.name);
          } else {
            setScreenshotDataUrl(compressedData);
            setScreenshotFileName(file.name);
          }
        } catch {
          if (type === "photo") {
            setPhotoDataUrl(e.target?.result as string);
            setPhotoFileName(file.name);
          } else {
            setScreenshotDataUrl(e.target?.result as string);
            setScreenshotFileName(file.name);
          }
        } finally {
          if (type === "photo") setIsCompressingPhoto(false);
          else setIsCompressingScreenshot(false);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Direct Mobile UPI link
  const mobileUpiLink = `upi://pay?pa=${encodeURIComponent(
    OFFICIAL_UPI_ADDRESS
  )}&pn=${encodeURIComponent(OFFICIAL_PAYEE_NAME)}&am=${REGISTRATION_FEE}&cu=INR&tn=${encodeURIComponent(
    "IOIS Bal Vikas Registration"
  )}`;

  // Dynamic QR Code link
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `upi://pay?pa=${OFFICIAL_UPI_ADDRESS}&pn=${OFFICIAL_PAYEE_NAME}&am=${REGISTRATION_FEE}&cu=INR`
  )}`;

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim()) {
      setErrorMessage("कृपया बच्चे अथवा अभिभावक का पूरा नाम दर्ज करें (Name is required).");
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.trim().replace(/\D/g, "").length < 10) {
      setErrorMessage("कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (Valid 10-digit mobile number required).");
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage("पासवर्ड कम से कम 4 अक्षरों का होना चाहिए (Password minimum 4 characters).");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("पासवर्ड और कन्फर्म पासवर्ड एक समान नहीं हैं (Passwords do not match).");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: fullName.trim(),
        email: emailId.trim() || `${mobileNumber.trim().slice(-10)}@iois.in`,
        mobile: mobileNumber.trim(),
        password,
        planId: "bal_vikas_10",
        planName: "डिजिटल बाल विकास सम्पूर्ण किट",
        planPrice: REGISTRATION_FEE,
        referralCode: "BALVIKAS",
        sponsorId: sponsorId.trim() || "IOIS999VK01",
        city: cityState.trim(),
        designation: "Student Member",
        childGrade,
        utrNumber: utrNumber.trim(),
        photoUrl: photoDataUrl || photoDriveLink.trim(),
        paymentScreenshot: screenshotDataUrl || screenshotDriveLink.trim(),
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.user) {
        const createdUser: UserProfile = {
          ...data.user,
          isDemo: false,
          paymentStatus: "pending",
        };
        setRegisteredUser(createdUser);
        setSuccessMessage(
          `🎉 बधाई हो! आपका बाल विकास पंजीकरण सफलतापूर्वक दर्ज हो गया है। आपकी सदस्य ID: ${createdUser.uniqueId} है। सत्यापन के बाद आईडी पूरी तरह सक्रिय हो जाएगी।`
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error(data.error || "पंजीकरण विफल। कृपया सही विवरण दर्ज करें।");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "पंजीकरण विफल। कृपया नेटवर्क चेक करके पुनः प्रयास करें।";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-4 transition-colors font-sans">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Top Quick Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← मुख्य पृष्ठ पर वापस जाएं (Home)</span>
          </button>

          <button
            onClick={onNavigateToLogin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-all shadow-sm"
          >
            <span>पहले से खाता है? सदस्य लॉगिन करें →</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-black tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>बाल विकास डिजिटल सदस्यता</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              नया विद्यार्थी पंजीकरण फॉर्म (Student Enrollment)
            </h1>

            <p className="text-amber-100 text-xs sm:text-sm font-medium leading-relaxed">
              डिजिटल बाल विकास पुस्तक, चिंटू AI शिक्षक, 3D मानव शरीर अंग, ड्रॉइंग कैनवास, गणित व अंग्रेजी फ़ोनिक्स किट का सम्पूर्ण एक्सेस प्राप्त करें।
            </p>
          </div>

          <div className="absolute -bottom-10 -right-10 text-9xl opacity-15 select-none pointer-events-none">
            📖
          </div>
        </div>

        {/* Success Banner if registered */}
        {registeredUser && (
          <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black">पंजीकरण सफलतापूर्वक दर्ज हो गया!</h3>
                <p className="text-xs sm:text-sm text-emerald-100">
                  आपकी सदस्य ID: <strong className="text-yellow-300 font-mono text-base">{registeredUser.uniqueId}</strong>
                </p>
                <p className="text-xs text-emerald-100">
                  नाम: <strong>{registeredUser.name}</strong> • मोबाइल: <strong>{registeredUser.mobile}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToLogin}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                <span>सदस्य लॉगिन पर जाएं (Go to Login)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/918877490845?text=Hello%20Sir,%20Maine%20Bal%20Vikas%20pe%20register%20kiya%20hai.%20ID:%20${registeredUser.uniqueId},%20Name:%20${registeredUser.name}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs flex items-center gap-2 backdrop-blur transition-all"
              >
                <PhoneCall className="w-4 h-4 text-emerald-300" />
                <span>व्हाट्सएप पर सहायता संदेश भेजें</span>
              </a>
            </div>
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                पंजीकरण विवरण (Child & Parent Information)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                कृपया सही जानकारी दर्ज करें। (*) वाले फ़ील्ड अनिवार्य हैं।
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 shadow-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1: व्यक्तिगत विवरण */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    विद्यार्थी व अभिभावक का विवरण (Student & Guardian Details)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      बच्चे अथवा अभिभावक का पूरा नाम * :
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="उदा. Aarav Kumar"
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      मोबाइल नंबर * :
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        required
                        maxLength={13}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="उदा. 9876543210"
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Class / Grade */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      कक्षा / आयु वर्ग (Class/Grade):
                    </label>
                    <select
                      value={childGrade}
                      onChange={(e) => setChildGrade(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="Nursery / LKG">Nursery / LKG (प्रारंभिक)</option>
                      <option value="UKG / Balvatika">UKG / Balvatika</option>
                      <option value="Class 1 (कक्षा 1)">Class 1 (कक्षा 1)</option>
                      <option value="Class 2 (कक्षा 2)">Class 2 (कक्षा 2)</option>
                      <option value="Class 3-5 (प्राथमिक)">Class 3-5 (प्राथमिक)</option>
                    </select>
                  </div>

                  {/* Email ID */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ईमेल पता (वैकल्पिक):
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Address / City */}
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      शहर / राज्य (City/State):
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        placeholder="उदा. पटना, बिहार"
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: सुरक्षित पासवर्ड */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    सुरक्षित पासवर्ड बनाएं (Create Password)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Password */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      पासवर्ड (Password) * :
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="कम से कम 4 अक्षर का पासवर्ड"
                        className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      पासवर्ड कन्फर्म करें * :
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="पुनः वही पासवर्ड दर्ज करें"
                        className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: फ़ोटो अपलोड (वैकल्पिक) */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      विद्यार्थी प्रोफ़ाइल फ़ोटो (वैकल्पिक)
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        फ़ाइल चुनें (JPG/PNG)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCompressFile(file, "photo");
                        }}
                        className="w-full text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                      />
                      {isCompressingPhoto && (
                        <span className="text-[11px] text-amber-600 block mt-1">
                          फ़ोटो ऑप्टिमाइज़ हो रही है...
                        </span>
                      )}
                    </div>
                  </div>

                  {photoDataUrl && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                      <img
                        src={photoDataUrl}
                        alt="Photo Preview"
                        className="w-12 h-12 object-cover rounded-xl border-2 border-emerald-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                          Preview: फ़ोटो अटैच हो गई
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border-2 border-amber-300 dark:border-amber-500"
              >
                {loading ? (
                  <span>पंजीकरण प्रोसेस हो रहा है... कृपया प्रतीक्षा करें</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>रजिस्ट्रेशन पूर्ण करें व डिजिटल ID कार्ड प्राप्त करें</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Estimated User ID Card */}
        <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2 text-center">
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
            ऑटो-जनरेटेड डिजिटल आईडी
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-black text-amber-300">
            {estimatedUserId}
          </div>
          <p className="text-xs text-slate-400">
            यह आईडी आपके नाम के अक्षरों से स्वतः तैयार होकर हमेशा सुरक्षित रहेगी।
          </p>
        </div>

      </div>
    </div>
  );
};
