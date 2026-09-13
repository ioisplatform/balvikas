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
  Upload,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  QrCode,
  CreditCard,
  Building2,
  BookOpen,
  ArrowLeft,
  Bot,
  Tv,
  FileText,
  Gem,
  Coins,
  CloudSun,
  Calendar,
  Briefcase,
  HelpCircle,
  Award,
  ChevronRight,
} from "lucide-react";
import { UserProfile } from "../types";
import { IOIS_PLANS } from "../data/learningData";

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

  // 2. Plan Selection
  const [selectedPlanId, setSelectedPlanId] = useState("bal_vikas_10");
  const [designation, setDesignation] = useState("Verified Elite Member");

  // 3. Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 4. Profile Photo
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [photoDriveLink, setPhotoDriveLink] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  // 5. Payment & Proof
  const [utrNumber, setUtrNumber] = useState("");
  const [payoutUpi, setPayoutUpi] = useState("");
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

  // Official constants requested
  const OFFICIAL_PAYEE_NAME = "Vikas Kumar";
  const OFFICIAL_UPI_ADDRESS = "8877490845@spicepay";
  const OFFICIAL_WHATSAPP = "+91 8877490845";

  // Selected plan calculation
  const currentPlan = useMemo(() => {
    return IOIS_PLANS.find((p) => p.id === selectedPlanId) || IOIS_PLANS[0];
  }, [selectedPlanId]);

  // Estimated User ID calculation
  const estimatedUserId = useMemo(() => {
    const trimmed = fullName.trim();
    let initials = "RK";
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
    const planCost = currentPlan.price.toString().padStart(2, "0");
    return `IOIS${planCost}${initials}01`;
  }, [fullName, currentPlan.price]);

  // Initials for breakdown description
  const nameInitials = useMemo(() => {
    const trimmed = fullName.trim();
    if (!trimmed) return "RK";
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return trimmed.substring(0, 2).toUpperCase();
  }, [fullName]);

  // Client-side image compression utility
  const handleCompressFile = (
    file: File,
    type: "photo" | "screenshot"
  ) => {
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
  )}&pn=${encodeURIComponent(OFFICIAL_PAYEE_NAME)}&am=${currentPlan.price}&cu=INR&tn=${encodeURIComponent(
    `IOIS Plan Registration ${currentPlan.name}`
  )}`;

  // Dynamic QR Code link
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `upi://pay?pa=${OFFICIAL_UPI_ADDRESS}&pn=${OFFICIAL_PAYEE_NAME}&am=${currentPlan.price}&cu=INR`
  )}`;

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim()) {
      setErrorMessage("कृपया अपना पूरा नाम दर्ज करें (Full Name is required).");
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.trim().replace(/\D/g, "").length < 10) {
      setErrorMessage("कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (Valid 10-digit mobile number required).");
      return;
    }
    if (!sponsorId.trim()) {
      setErrorMessage("स्पॉन्सर आईडी अनिवार्य है। यदि नहीं है तो IOIS999VK01 दर्ज करें।");
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
    if (!payoutUpi.trim()) {
      setErrorMessage("कृपया कमाई और पेआउट प्राप्त करने हेतु अपनी UPI ID अवश्य दर्ज करें (Payout UPI ID required).");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: fullName.trim(),
        email: emailId.trim() || `${mobileNumber.trim().slice(-10)}@iois.in`,
        mobile: mobileNumber.trim(),
        password,
        planId: currentPlan.id,
        planName: currentPlan.name,
        planPrice: currentPlan.price,
        referralCode: "IOISVIP",
        sponsorId: sponsorId.trim(),
        city: cityState.trim(),
        designation,
        utrNumber: utrNumber.trim(),
        payoutUpi: payoutUpi.trim(),
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
          `🎉 बधाई हो! आपका पंजीकरण सफलतापूर्वक दर्ज हो गया है। आपकी स्थायी सदस्य ID: ${createdUser.uniqueId} है। एडमिन द्वारा आपके UTR व पेमेंट सत्यापन (लगभग 5 मिनट) के बाद आईडी पूरी तरह सक्रिय हो जाएगी।`
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error(data.error || "पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "पंजीकरण विफल। कृपया नेटवर्क चेक करके पुनः प्रयास करें।";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceJump = (target: string) => {
    if (target === "home") {
      onNavigateToHome();
    } else if (target === "login") {
      onNavigateToLogin();
    } else if (target === "admin" && onOpenAdmin) {
      onOpenAdmin();
    } else if (onNavigateToTab) {
      onNavigateToTab(target);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-4 transition-colors font-sans">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-6">
        
        {/* Top Quick Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← मुख्य होम पेज पर वापस जाएं (Home)</span>
          </button>

          {/* Quick Micro-links */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
            {[
              { label: "होम", id: "home" },
              { label: "RTPS व जमीन", id: "services" },
              { label: "7 प्लान्स", id: "plans" },
              { label: "मौसम", id: "weather" },
              { label: "लाइव टीवी", id: "tv" },
              { label: "पंचांग", id: "panchang" },
              { label: "मंडी भाव", id: "mandi" },
              { label: "रजिस्ट्रेशन", id: "register", active: true },
              { label: "ID कार्ड", id: "idcard" },
              { label: "कैलकुलेटर", id: "calculator" },
              { label: "जॉब अलर्ट्स", id: "jobs" },
              { label: "सरकारी वेबसाइट्स", id: "gov" },
              { label: "हेल्पलाइन", id: "helpline" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleServiceJump(item.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  item.active
                    ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button onClick={onNavigateToHome} className="hover:text-amber-600 hover:underline">
            Home
          </button>
          <span>/</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">register</span>
          <span className="ml-auto text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-300 dark:border-emerald-800">
            ✓ 256-Bit SSL Secured
          </span>
        </div>

        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-black tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>ALL-IN-ONE OFFICIAL PORTAL</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              नया सदस्य रजिस्ट्रेशन (Official In-App Registration)
            </h1>

            <p className="text-amber-100 text-xs sm:text-sm font-medium leading-relaxed">
              डायरेक्ट इन-ऐप फॉर्म, 25MB+ पेमेंट प्रूफ अपलोड व ऑटो-जनरेटेड यूनिक User ID
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-100">
              <span className="bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
                📝 IOIS आधिकारिक रजिस्ट्रेशन व वेरिफिकेशन
              </span>
            </div>

            <p className="text-xs text-amber-50 leading-relaxed pt-1">
              अपना विवरण भरें, उपयुक्त प्लान चुनें और पेमेंट विवरण दर्ज करें। पंजीकरण पूर्ण होते ही आपका आधिकारिक डिजिटल मेंबर ID व डैशबोर्ड तुरंत सक्रिय हो जाएगा।
            </p>
          </div>

          <div className="absolute -bottom-10 -right-10 text-9xl opacity-15 select-none pointer-events-none">
            📝
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
                <h3 className="text-xl font-black">पंजीकरण सफलता से दर्ज हो गया!</h3>
                <p className="text-xs sm:text-sm text-emerald-100">
                  आपकी आधिकारिक डिजिटल सदस्य ID: <strong className="text-yellow-300 font-mono text-base">{registeredUser.uniqueId}</strong>
                </p>
                <p className="text-xs text-emerald-100">
                  प्लान: <strong>{registeredUser.planName} (₹{registeredUser.planPrice})</strong> • स्पॉन्सर: <strong>{registeredUser.sponsorId}</strong>
                </p>
              </div>
            </div>

            <div className="p-4 bg-black/20 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-yellow-200">
                <ShieldCheck className="w-4 h-4" />
                <span>सत्यापन प्रक्रिया (Verification in progress):</span>
              </div>
              <p className="text-emerald-100 text-[11px] leading-relaxed">
                एडमिन टीम आपके पेमेंट प्रूफ और UTR नंबर का मिलान कर रही है। आम तौर पर इसमें 5 मिनट का समय लगता है। स्वीकृति मिलते ही आप तुरंत सदस्य लॉगिन कर सकते हैं।
              </p>
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
                href={`https://wa.me/918877490845?text=Hello%20Vikas%20Sir,%20Maine%20IOIS%20pe%20register%20kiya%20hai.%20My%20ID:%20${registeredUser.uniqueId},%20Name:%20${registeredUser.name}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs flex items-center gap-2 backdrop-blur transition-all"
              >
                <PhoneCall className="w-4 h-4 text-emerald-300" />
                <span>व्हाट्सएप पर अप्रूवल संदेश भेजें</span>
              </a>
            </div>
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Card Top Title & Switch to Login */}
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>नया खाता पंजीकरण फॉर्म (Direct Member Enrollment)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                सभी आवश्यक फ़ील्ड (*) अनिवार्य हैं
              </p>
            </div>

            <button
              onClick={onNavigateToLogin}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <span>पहले से खाता है? लॉगिन करें →</span>
            </button>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            {/* ⚠️ अति आवश्यक निर्देश व चेतावनी (Mandatory Alert) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-black text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>⚠️ अति आवश्यक निर्देश व चेतावनी (Mandatory Alert)</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white font-bold">
                      UPI ID / Payment Received Address सही-सही भरें:
                    </strong>{" "}
                    जहाँ आप अपनी कमाई, 70% रेफरल इंसेंटिव और दैनिक पेआउट प्राप्त करना चाहते हैं (Google Pay, PhonePe, Paytm, BHIM आदि), वह UPI ID या पता बिल्कुल सही-सही और सावधानीपूर्वक भरें ताकि पैसा सीधे आपके खाते में जमा हो।
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white font-bold">
                      Sponsor ID (स्पॉन्सर आईडी) जरूर भरें:
                    </strong>{" "}
                    रजिस्ट्रेशन के लिए Sponsor ID भरना अनिवार्य है। यदि आपके पास कोई स्पॉन्सर आईडी नहीं है, तो आधिकारिक हेडक्वार्टर आईडी <span className="font-mono font-black text-amber-700 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">IOIS999VK01</span> दर्ज करें।
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 shadow-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1: व्यक्तिगत व स्पॉन्सर विवरण */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    व्यक्तिगत व स्पॉन्सर विवरण (Personal & Sponsor Details)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      पूरा नाम (Full Name) * :
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="उदा. Rahul Kumar"
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                      (User ID आपके नाम के पहले अक्षरों से स्वतः बनेगी)
                    </span>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      मोबाइल / WhatsApp नंबर * :
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        required
                        maxLength={13}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="उदा. +91 9876543210"
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sponsor ID */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Sponsor ID (स्पॉन्सर आईडी) * (अनिवार्य):
                      </label>
                      <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded font-black">
                        ज़रूर भरें
                      </span>
                    </div>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={sponsorId}
                        onChange={(e) => setSponsorId(e.target.value)}
                        placeholder="IOIS999VK01"
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-amber-400 dark:border-amber-600 rounded-xl text-xs font-mono font-black text-amber-700 dark:text-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                      (डिफ़ॉल्ट आधिकारिक स्पॉन्सर आईडी: IOIS999VK01)
                    </span>
                  </div>

                  {/* Email ID */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ईमेल पता (Email ID):
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Address / City */}
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      शहर / राज्य (Address/City):
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

              {/* SECTION 2: प्लान व सदस्यता स्तर */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    प्लान व सदस्यता स्तर (Select Plan)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      IOIS एक्टिव प्लान * :
                    </label>
                    <select
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-amber-400 dark:border-amber-600 rounded-xl text-xs font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="bal_vikas_10">
                        Plan 01: Bal Vikas Access — ₹10 (70% Payout)
                      </option>
                      <option value="plan_50">Plan 02: Primary Education Booster — ₹50 (70% Payout)</option>
                      <option value="plan_100">Plan 03: Complete NCERT Kit — ₹100 (70% Payout)</option>
                      <option value="plan_200">Plan 04: Digital India Smart Pro — ₹200 (70% Payout)</option>
                      <option value="plan_400">Plan 05: Master Scholar & Income — ₹400 (70% Payout)</option>
                      <option value="plan_600">Plan 06: Leader & District Mentor — ₹600 (70% Payout)</option>
                      <option value="plan_999">Plan 07: National Lifetime VIP — ₹999 (70% Payout)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      सदस्यता पद (Designation):
                    </label>
                    <select
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="Verified Elite Member">Verified Elite Member</option>
                      <option value="Active Student Member">Active Student Member</option>
                      <option value="Guardian / Parent Mentor">Guardian / Parent Mentor</option>
                      <option value="District Coordinator">District Coordinator</option>
                    </select>
                  </div>
                </div>

                {/* Plan Highlights Box */}
                <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-300 dark:border-amber-700/60 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-black text-amber-800 dark:text-amber-300">
                      चयनित: {currentPlan.name}
                    </span>
                    <span className="block text-[11px] text-slate-600 dark:text-slate-400">
                      आजीवन वैधता • 70% इंसेंटिव सपोर्ट • डिजिटल आईडी कार्ड
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                      ₹{currentPlan.price}
                    </span>
                    <span className="block text-[10px] text-slate-500">एकमुश्त शुल्क</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: सुरक्षित पासवर्ड बनाएं */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    3
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
                    {confirmPassword && password !== confirmPassword && (
                      <span className="text-[11px] text-red-500 mt-1 block font-bold">
                        ⚠️ पासवर्ड मेल नहीं खा रहे हैं
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: डिजिटल ID कार्ड फोटो */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    4
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      डिजिटल ID कार्ड फोटो (Card Profile Photo)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      अपनी फ़ोटो अपलोड करें (या 25MB से बड़ी फ़ाइल हेतु Drive Link दें)
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200 flex items-center justify-between">
                    <span className="font-bold">Fast Instant Upload (Auto-Optimized)</span>
                    <span className="text-[10px]">यह फ़ोटो आपके डिजिटल ID कार्ड पर प्रदर्शित होगी।</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        फ़ाइल चुनें (JPG/PNG) - फास्ट अपलोड व ऑटो-कंप्रेशन
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

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        या 25MB+ हेतु Google Drive लिंक दें:
                      </label>
                      <input
                        type="url"
                        value={photoDriveLink}
                        onChange={(e) => setPhotoDriveLink(e.target.value)}
                        placeholder="https://drive.google.com/file/d/..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Photo Preview Box */}
                  {(photoDataUrl || photoDriveLink) && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                      {photoDataUrl ? (
                        <img
                          src={photoDataUrl}
                          alt="Photo Preview"
                          className="w-12 h-12 object-cover rounded-xl border-2 border-emerald-500"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600">
                          <Check className="w-6 h-6" />
                        </div>
                      )}
                      <div className="text-xs">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                          Preview: फ़ाइल सफलतापूर्वक अटैच हो गई
                        </span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400">
                          {photoFileName || "Google Drive Link Attached"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: आधिकारिक पेमेंट व वेरिफिकेशन प्रूफ */}
              <div className="space-y-4 p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700/80">
                <div className="flex items-center gap-2 border-b border-amber-200 dark:border-amber-800/80 pb-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    5
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      आधिकारिक पेमेंट व वेरिफिकेशन प्रूफ (Payment to Vikas Kumar)
                    </h3>
                  </div>
                </div>

                {/* Plan & Amount Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">चुना हुआ प्लान व देय शुल्क:</span>
                    <strong className="text-sm font-black text-slate-900 dark:text-white block">
                      PLAN 01 ({currentPlan.name})
                    </strong>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-slate-500 block text-[11px]">देय राशि:</span>
                    <strong className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      ₹{currentPlan.price}
                    </strong>
                  </div>
                </div>

                {/* UPI QR & Details Card */}
                <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
                  {/* QR Code Container */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-amber-400 flex flex-col items-center">
                      <img
                        src={qrCodeUrl}
                        alt="UPI QR Code - Vikas Kumar"
                        className="w-40 h-40 object-contain rounded-lg"
                      />
                      <span className="text-[10px] font-black text-slate-800 mt-1 uppercase tracking-wider">
                        UPI QR Code - Vikas Kumar
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center">
                      SCAN VIA GPAY / PHONEPE / PAYTM
                    </span>
                  </div>

                  {/* Payment Info & Copy Action */}
                  <div className="flex-1 space-y-3 text-xs w-full">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                        आधिकारिक प्राप्तकर्ता नाम (Payee Name):
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {OFFICIAL_PAYEE_NAME}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] border border-emerald-300 dark:border-emerald-800">
                          VERIFIED
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                        आधिकारिक UPI ID (Official Payment Address):
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono font-black text-sm text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 select-all">
                          {OFFICIAL_UPI_ADDRESS}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(OFFICIAL_UPI_ADDRESS)}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1 shadow transition-all active:scale-95"
                        >
                          {copiedUpi ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedUpi ? "कॉपी हो गया!" : "कॉपी करें"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={mobileUpiLink}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>सीधे UPI ऐप से भुगतान करें (Mobile Pay)</span>
                      </a>

                      <a
                        href={`https://wa.me/918877490845?text=Hello%20Vikas%20Sir,%20Payment%20related%20help%20chahiye`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-slate-300 dark:border-slate-700"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                        <span>व्हाट्सएप सहायता: {OFFICIAL_WHATSAPP}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Instruction note */}
                <div className="p-3 bg-amber-100/60 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                  📌 <strong>निर्देश:</strong> ऊपर दिए गए UPI ID (<strong>{OFFICIAL_UPI_ADDRESS} - {OFFICIAL_PAYEE_NAME}</strong>) या QR कोड पर ₹{currentPlan.price} ट्रांसफर करें और सफल ट्रांजेक्शन का स्क्रीनशॉट व 12-अंकों का UTR नंबर नीचे दर्ज करें।
                </div>

                {/* Screenshot & UTR Form Fields */}
                <div className="space-y-4 pt-2 text-xs">
                  {/* Payment Screenshot */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      पेमेंट स्क्रीनशॉट अपलोड करें (Payment Screenshot Proof)
                    </label>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Fast Instant Upload (Auto-Optimized)</span>
                        <span className="text-amber-600 font-bold">एडमिन आपके स्क्रीनशॉट को देखकर 5 मिनट में अप्रूव करेगा।</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <div>
                          <label className="block font-semibold text-slate-600 dark:text-slate-400 text-[11px] mb-1">
                            फ़ाइल चुनें (JPG/PNG) - फास्ट अपलोड व ऑटो-कंप्रेशन
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCompressFile(file, "screenshot");
                            }}
                            className="w-full text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                          />
                          {isCompressingScreenshot && (
                            <span className="text-[11px] text-amber-600 block mt-1">
                              स्क्रीनशॉट कंप्रेस हो रहा है...
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-600 dark:text-slate-400 text-[11px] mb-1">
                            या 25MB+ हेतु Google Drive लिंक दें:
                          </label>
                          <input
                            type="url"
                            value={screenshotDriveLink}
                            onChange={(e) => setScreenshotDriveLink(e.target.value)}
                            placeholder="https://drive.google.com/file/d/..."
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Screenshot Attached Banner */}
                      {(screenshotDataUrl || screenshotDriveLink) && (
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                            पेमेंट प्रूफ अटैच हो गया: {screenshotFileName || "Drive Link"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* UTR Number */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      UTR / Transaction Ref नंबर:
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="उदा. 4239XXXXXXXX"
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Payment Received Address / Payout UPI */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        पेमेंट रिसीव करने का UPI ID / Payment Received Address * :
                      </label>
                      <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded font-black">
                        सावधानीपूर्वक भरें
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={payoutUpi}
                      onChange={(e) => setPayoutUpi(e.target.value)}
                      placeholder="उदा. 9876543210@paytm या name@okhdfcbank"
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 rounded-xl text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <div className="p-2.5 mt-1.5 bg-amber-100/60 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 leading-tight">
                      ⚠️ <strong>चेतावनी:</strong> जहाँ आप अपनी कमाई व 70% इंसेंटिव पाना चाहते हैं, वही सही UPI ID भरें।
                    </div>
                  </div>
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
                    <span>रजिस्ट्रेशन / Join Now (तुरंत डिजिटल ID कार्ड प्राप्त करें)</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Live User ID Generation Preview Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="space-y-0.5">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    आपकी यूनिक User ID कैसे बनेगी?
                  </span>
                  <div className="text-xs text-slate-300">
                    अनुमानित User ID प्रिव्यू:
                  </div>
                </div>
                <div className="px-4 py-2 bg-amber-500 text-slate-950 font-mono font-black text-base sm:text-lg rounded-xl shadow-lg tracking-wider">
                  {estimatedUserId}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-amber-300 font-bold block">1. IOIS:</span>
                  <span className="text-slate-300 text-[11px] block">
                    प्लेटफॉर्म का आधिकारिक ब्रांड कोड
                  </span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-amber-300 font-bold block">2. {currentPlan.price}:</span>
                  <span className="text-slate-300 text-[11px] block">
                    आपके चुने हुए प्लान की कीमत (₹{currentPlan.price})
                  </span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-amber-300 font-bold block">3. {nameInitials}:</span>
                  <span className="text-slate-300 text-[11px] block">
                    आपके नाम और उपनाम के पहले अक्षर ({fullName.trim() || "Rahul Kumar"})
                  </span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-amber-300 font-bold block">4. 01:</span>
                  <span className="text-slate-300 text-[11px] block">
                    उस प्लान को चुनने वाले सदस्य का यूनिक क्रम संख्या
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic text-center pt-1 border-t border-slate-700/60">
                यह ID 100% नॉन-एडिटेबल और कभी रिपीट न होने वाली आजीवन पहचान है।
              </p>
            </div>

            {/* Direct & Safe Payment System Guarantee Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  सुरक्षित व सीधा पेमेंट सिस्टम
                </h4>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                किसी भी थर्ड पार्टी ऐप की आवश्यकता नहीं है। पंजीकरण के तुरंत बाद आपका डैशबोर्ड खुल जाएगा जहाँ आप अपना विवरण कभी भी अपडेट कर सकते हैं।
              </p>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 pt-1">
                <span>24x7 WhatsApp सपोर्ट:</span>
                <a
                  href="https://wa.me/918877490845"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>+91 8877490845</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 1-क्लिक क्विक शॉर्टकट • किसी भी अन्य पेज पर सीधे जाएं */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>1-क्लिक क्विक शॉर्टकट</span>
                <span className="text-xs text-slate-500 font-normal">• किसी भी अन्य पेज पर सीधे जाएं</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                अगला क्या देखना चाहते हैं? (Quick Jump to Any Service)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleServiceJump("chatbot")}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-blue-100"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI से पूछें</span>
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                ऊपर जाएं (Top)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              {
                id: "home",
                title: "मुख्य होम पेज",
                desc: "सभी सेवाओं का केंद्रीय डैशबोर्ड",
                icon: "🏠",
              },
              {
                id: "services",
                title: "RTPS व जमीन सुधार",
                desc: "जाति, आय, दाखिल खारिज, LPC व पेंशन",
                icon: "📜",
              },
              {
                id: "plans",
                title: "7 मास्टर प्लांस",
                desc: "₹10 से ₹999 तक के सभी प्लांस",
                icon: "💎",
              },
              {
                id: "register",
                title: "रजिस्ट्रेशन / Join Now",
                desc: "डायरेक्ट इन-ऐप सदस्य खाता व डिजिटल ID",
                icon: "📝",
                current: true,
              },
              {
                id: "idcard",
                title: "डिजिटल ID कार्ड",
                desc: "स्मार्ट कार्ड प्रिव्यू व डाउनलोड",
                icon: "🪪",
              },
              {
                id: "weather",
                title: "लाइव मौसम अलर्ट",
                desc: "शहरवार तापमान व वर्षा रिपोर्ट",
                icon: "⛅",
              },
              {
                id: "tv",
                title: "लाइव टीवी व न्यूज़",
                desc: "24x7 समाचार व डिजिटल ई-अखबार",
                icon: "📺",
              },
              {
                id: "entertainment",
                title: "🎬 मनोरंजन व चैट",
                desc: "बिना Ads वीडियो, लाइव चैट व फ्री AI टूल्स",
                icon: "🎬",
              },
              {
                id: "panchang",
                title: "पंचांग व 12 राशिफल",
                desc: "शुभ मुहूर्त, राहु काल व भाग्य फल",
                icon: "🕉️",
              },
              {
                id: "mandi",
                title: "मंडी भाव व सोना",
                desc: "फसल दाम व 24K/22K गोल्ड रेट",
                icon: "🌾",
              },
              {
                id: "gov",
                title: "सरकारी डायरेक्टरी",
                desc: "आधार, पैन, राशन व आयुष्मान लिंक",
                icon: "🏛️",
              },
              {
                id: "jobs",
                title: "लाइव जॉब अलर्ट्स",
                desc: "सरकारी व प्राइवेट भर्तियां",
                icon: "💼",
              },
              {
                id: "calculator",
                title: "इंसेंटिव कैलकुलेटर",
                desc: "70% दैनिक व मासिक आय अनुमान",
                icon: "🧮",
              },
              {
                id: "career",
                title: "कैरियर असेसमेंट",
                desc: "15-सवाल स्मार्ट टेस्ट",
                icon: "🎯",
              },
              {
                id: "parent",
                title: "अभिभावक पोर्टल",
                desc: "100% चाइल्ड सेफ वातावरण व नीतियां",
                icon: "👨‍👩‍👧",
              },
              {
                id: "helpline",
                title: "24x7 हेल्पलाइन व FAQ",
                desc: "WhatsApp व Telegram सपोर्ट",
                icon: "📞",
              },
              {
                id: "admin",
                title: "एडमिन वेरिफिकेशन",
                desc: "मास्टर पिन से लॉगिन व अप्रूवल",
                icon: "🛡️",
              },
            ].map((srv) => (
              <div
                key={srv.id}
                onClick={() => handleServiceJump(srv.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  srv.current
                    ? "bg-amber-500/10 border-amber-500 dark:bg-amber-950/40"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-amber-400 hover:scale-[1.01]"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg shrink-0 shadow-sm">
                  {srv.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {srv.title}
                    </span>
                    {srv.current && (
                      <span className="text-[9px] bg-amber-500 text-slate-950 px-1 rounded font-black">
                        वर्तमान पेज
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                    {srv.desc}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Official Footer */}
        <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4 text-center">
          <div className="flex items-center justify-center">
            <button
              onClick={onNavigateToHome}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
            >
              ← मुख्य होम पेज पर वापस लौटें (Back to Home)
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <button onClick={onNavigateToHome} className="hover:text-amber-600">
              होम
            </button>
            <span>•</span>
            <button onClick={() => handleServiceJump("plans")} className="hover:text-amber-600">
              7 मास्टर प्लान
            </button>
            <span>•</span>
            <span className="text-amber-600 font-bold">रजिस्ट्रेशन / Join Now</span>
            <span>•</span>
            <button onClick={() => handleServiceJump("privacy")} className="hover:text-amber-600">
              गोपनीयता नीति (Privacy Policy)
            </button>
            <span>•</span>
            <button onClick={() => handleServiceJump("terms")} className="hover:text-amber-600">
              नियम व शर्तें (Terms)
            </button>
            <span>•</span>
            <button onClick={() => handleServiceJump("disclaimer")} className="hover:text-amber-600">
              अस्वीकरण (Disclaimer)
            </button>
            <span>•</span>
            <button onClick={() => handleServiceJump("helpline")} className="hover:text-amber-600">
              हेल्पलाइन व संपर्क
            </button>
          </div>

          <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="font-black text-slate-900 dark:text-white tracking-wider">
              IOIS PLATFORM
            </div>
            <div className="font-semibold text-amber-600 dark:text-amber-400">
              Indian Online Income Supporting System
            </div>
            <p className="text-[11px] text-slate-500">
              डिजिटल शिक्षा, आत्मनिर्भर भारत और पारदर्शी इंस्टेंट इंसेंटिव सपोर्ट प्रणाली।
            </p>
            <p className="text-[10px] text-slate-400 pt-1">
              © 2026 IOIS National Infrastructure Project. All Rights Reserved.
              <br />
              Made with precision for Digital India & Google AdSense Compliance
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
};
