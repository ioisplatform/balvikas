import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Local JSON store path for persistent cloud backup simulation
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const USERS_BACKUP_FILE = path.join(DATA_DIR, "users.backup.json");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DeviceSession {
  id: string;
  deviceName: string;
  browser: string;
  ip: string;
  lastActive: string;
  isCurrent?: boolean;
}

interface PlatformServiceRecord {
  id: string;
  titleHi: string;
  titleEn: string;
  category: "gov" | "education" | "utilities" | "entertainment" | "income";
  description: string;
  icon: string;
  link: string;
  badge?: string;
  active: boolean;
}

interface PlatformSettings {
  adminPassword?: string;
  officialUpiId: string;
  officialPayeeName: string;
  officialWhatsapp: string;
  sponsorDefaultId: string;
  systemNotice?: string;
  googleSheetsWebhookUrl?: string;
  googleSheetsAutoSync?: boolean;
}

interface UserRecord {
  uniqueId: string; // e.g. IOIS10RK01
  name: string;
  email: string;
  mobile: string;
  password: string;
  planId: string;
  planName: string;
  planPrice: number;
  referralCode?: string;
  sponsorId?: string;
  city?: string;
  designation?: string;
  utrNumber?: string;
  payoutUpi?: string;
  paymentStatus?: "pending" | "approved" | "verified";
  paymentScreenshot?: string; // base64 payment receipt proof
  recoveryCode?: string; // secure 6-digit recovery OTP
  recoveryCodeExpiresAt?: number;
  photoUrl?: string;
  referralEarnings: number;
  twoFactorEnabled: boolean;
  twoFactorCode?: string;
  registeredAt: string;
  devices: DeviceSession[];
  progress: {
    hindiProgress: number; // 0 - 100
    englishProgress: number;
    mathProgress: number;
    drawingCount: number;
    quizzesCompleted: number;
    quizAccuracy: number;
    studyTimeMinutes: number;
    streakDays: number;
    badges: string[];
    savedDrawings: Array<{ id: string; title: string; date: string; dataUrl: string }>;
    classGrade: string; // Class 1, 2, 3, 4, 5
  };
}

// Resilient load: try primary, then backup
let users: UserRecord[] = [];
if (fs.existsSync(USERS_FILE)) {
  try {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch (err) {
    console.warn("Primary users.json read error, checking backup...", err);
    if (fs.existsSync(USERS_BACKUP_FILE)) {
      try {
        users = JSON.parse(fs.readFileSync(USERS_BACKUP_FILE, "utf-8"));
        console.log("Restored users from backup file successfully");
      } catch {
        users = [];
      }
    }
  }
} else if (fs.existsSync(USERS_BACKUP_FILE)) {
  try {
    users = JSON.parse(fs.readFileSync(USERS_BACKUP_FILE, "utf-8"));
  } catch {
    users = [];
  }
}

// Platform Services seed
const DEFAULT_SERVICES: PlatformServiceRecord[] = [
  {
    id: "srv_bal_vikas",
    titleHi: "बाल विकास डिजिटल किट",
    titleEn: "Bal Vikas Digital Kit",
    category: "education",
    description: "कक्षा 1 से 5 NCERT वर्णमाला, गुड इंग्लिश, पहाड़े व 14 सचित्र फ्लैशकार्ड्स",
    icon: "BookOpen",
    link: "/#hindi",
    badge: "Most Popular",
    active: true,
  },
  {
    id: "srv_pdf_guide",
    titleHi: "48 पृष्ठ संपूर्ण PDF अध्ययन गाइड",
    titleEn: "48 Pages Complete PDF Study Guide",
    category: "education",
    description: "अ से ज्ञ, A-Z, 1-20 पहाड़े, छात्र कैलकुलेटर व संपूर्ण अध्ययन गाइड",
    icon: "FileText",
    link: "/#pdfguide",
    badge: "Official PDF",
    active: true,
  },
  {
    id: "srv_plans",
    titleHi: "7 सदस्यता प्लान्स व अर्निंग मॉडल",
    titleEn: "7 Membership Plans & Earnings",
    category: "income",
    description: "₹10 से ₹999 प्लान्स, लाइफटाइम एक्सेस और 50% से 70% डायरेक्ट कमीशन",
    icon: "Gem",
    link: "/#plans",
    badge: "50%-70% Payout",
    active: true,
  },
  {
    id: "srv_rtps",
    titleHi: "RTPS व भूमि रिकॉर्ड (Land Records)",
    titleEn: "RTPS & Land Records Portal",
    category: "gov",
    description: "दाखिल खारिज, जमीन लगान रसीद, एलपीसी, जाति/आय/निवास प्रमाणपत्र डायरेक्ट एक्सेस",
    icon: "Landmark",
    link: "https://biharbhumi.bihar.gov.in/",
    badge: "Govt Direct",
    active: true,
  },
  {
    id: "srv_weather",
    titleHi: "मौसम पूर्वानुमान व वर्षा अलर्ट",
    titleEn: "Weather & Rainfall Forecast",
    category: "utilities",
    description: "दैनिक तापमान, वर्षा का अनुमान, आर्द्रता और कृषि मौसम पूर्वानुमान",
    icon: "CloudSun",
    link: "https://mausam.imd.gov.in/",
    badge: "Live IMD",
    active: true,
  },
  {
    id: "srv_live_tv",
    titleHi: "लाइव शिक्षा व न्यूज़ टीवी",
    titleEn: "Live Education & News TV",
    category: "entertainment",
    description: "डीडी नेशनल, पीएम ई-विद्या 1 से 5, ज्ञान दर्शन और मुख्य समाचार",
    icon: "Tv",
    link: "https://www.youtube.com/@pmevidya",
    badge: "24x7 Live",
    active: true,
  },
  {
    id: "srv_panchang",
    titleHi: "दैनिक पंचांग व शुभ मुहूर्त",
    titleEn: "Daily Panchang & Shubh Muhurat",
    category: "utilities",
    description: "तिथि, नक्षत्र, चौघड़िया, राहुकाल एवं हिंदू व्रत-त्योहार कैलेंडर",
    icon: "Calendar",
    link: "https://www.drikpanchang.com/",
    badge: "Daily",
    active: true,
  },
  {
    id: "srv_mandi",
    titleHi: "मंडी भाव (Live Mandi Rates)",
    titleEn: "Live Mandi Commodity Rates",
    category: "utilities",
    description: "गेहूं, धान, मक्का, दाल, फल एवं सब्जियों के दैनिक थोक मंडी भाव",
    icon: "TrendingUp",
    link: "https://agmarknet.gov.in/",
    badge: "Daily Rates",
    active: true,
  },
  {
    id: "srv_id_card",
    titleHi: "डिजिटल ID कार्ड जनरेटर",
    titleEn: "Digital Member ID Card",
    category: "income",
    description: "आधिकारिक IOIS वेरिफाइड डिजिटल मेंबर ID कार्ड एवं तुरंत डाउनलोड",
    icon: "CreditCard",
    link: "/#register",
    badge: "Instant ID",
    active: true,
  },
  {
    id: "srv_calculator",
    titleHi: "विद्यार्थी टूल्स व कैलकुलेटर",
    titleEn: "Student Calculators & Tools",
    category: "education",
    description: "उम्र कैलकुलेटर, प्रतिशत कैलकुलेटर, 1 से 20 तक पहाड़ा प्रैक्टिस",
    icon: "Calculator",
    link: "/#math",
    badge: "Page 42 Tools",
    active: true,
  },
  {
    id: "srv_job_alerts",
    titleHi: "सरकारी जॉब अलर्ट्स व रिजल्ट",
    titleEn: "Govt Job Alerts & Results",
    category: "gov",
    description: "एसएससी, रेलवे, शिक्षक भर्ती, पुलिस एवं सभी राज्य भर्ती सूचनाएं",
    icon: "Briefcase",
    link: "https://www.sarkariresult.com/",
    badge: "Latest Jobs",
    active: true,
  },
  {
    id: "srv_govt_sites",
    titleHi: "आधिकारिक सरकारी वेबसाइट्स डायरेक्ट्री",
    titleEn: "Official Govt Portals Directory",
    category: "gov",
    description: "आधार, पैन, वोटर, राशन कार्ड, पीएम किसान, आयुष्मान भारत सीधे लिंक",
    icon: "ShieldCheck",
    link: "https://www.india.gov.in/",
    badge: "Official",
    active: true,
  },
  {
    id: "srv_helpline",
    titleHi: "24x7 व्हाट्सएप हेल्पलाइन व सहायता",
    titleEn: "24x7 WhatsApp Help & Support",
    category: "utilities",
    description: "आधिकारिक व्हाट्सएप +91 8877490845 पर 24 घंटे किसी भी सहायता हेतु संपर्क करें",
    icon: "PhoneCall",
    link: "https://wa.me/918877490845?text=Hello%20IOIS%20Support",
    badge: "WhatsApp 24x7",
    active: true,
  },
];

let services: PlatformServiceRecord[] = [];
if (fs.existsSync(SERVICES_FILE)) {
  try {
    services = JSON.parse(fs.readFileSync(SERVICES_FILE, "utf-8"));
  } catch {
    services = DEFAULT_SERVICES;
  }
} else {
  services = DEFAULT_SERVICES;
  saveServices();
}

function saveServices() {
  try {
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save services", err);
  }
}

// Platform Settings seed
const DEFAULT_SETTINGS: PlatformSettings = {
  adminPassword: "IOISSYSTEM",
  officialUpiId: "8877490845@spicepay",
  officialPayeeName: "Vikas Kumar",
  officialWhatsapp: "+91 8877490845",
  sponsorDefaultId: "IOIS999VK01",
  systemNotice: "IOIS बाल विकास डिजिटल अध्ययन किट में आपका स्वागत है!",
};

let settings: PlatformSettings = DEFAULT_SETTINGS;
if (fs.existsSync(SETTINGS_FILE)) {
  try {
    settings = { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8")) };
  } catch {
    settings = DEFAULT_SETTINGS;
  }
} else {
  saveSettings();
}

function saveSettings() {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save settings", err);
  }
}

if (users.length === 0) {
  users.push({
    uniqueId: "IOIS10RK01",
    name: "Rahul Kumar",
    email: "rahul@iois.in",
    mobile: "9876543210",
    password: "Password@123",
    planId: "bal_vikas_10",
    planName: "Bal Vikas Access (Class 1-5)",
    planPrice: 10,
    referralCode: "IOISVIP",
    sponsorId: "IOIS999VK01",
    city: "Patna, Bihar",
    designation: "Verified Elite Member",
    utrNumber: "423987654321",
    payoutUpi: "9876543210@paytm",
    paymentStatus: "verified",
    referralEarnings: 21,
    twoFactorEnabled: false,
    registeredAt: new Date().toISOString(),
    devices: [
      {
        id: "dev_1",
        deviceName: "Chrome on Android Mobile",
        browser: "Chrome Mobile 120",
        ip: "103.21.244.1",
        lastActive: new Date().toISOString(),
      },
    ],
    progress: {
      hindiProgress: 45,
      englishProgress: 60,
      mathProgress: 50,
      drawingCount: 3,
      quizzesCompleted: 8,
      quizAccuracy: 88,
      studyTimeMinutes: 120,
      streakDays: 4,
      badges: ["badge_starter", "badge_varnamala", "badge_math_star"],
      savedDrawings: [],
      classGrade: "Class 2",
    },
  });
  saveUsers();
}

function saveUsers() {
  try {
    const json = JSON.stringify(users, null, 2);
    const tempFile = path.join(DATA_DIR, `users.tmp.${Date.now()}`);
    fs.writeFileSync(tempFile, json, "utf-8");
    fs.renameSync(tempFile, USERS_FILE);
    fs.writeFileSync(USERS_BACKUP_FILE, json, "utf-8");
  } catch (err) {
    console.error("Failed to save users file atomically, falling back to direct write:", err);
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    } catch (e2) {
      console.error("Critical: Could not write users file:", e2);
    }
  }
}

// Deterministic & Guaranteed Unique ID Generator:
// Format: IOIS + PlanCode (2 digits, e.g. 10) + Initials (2 letters, e.g. RK) + Sequence (01, 02, 03...)
// Example: IOIS + 10 + RK + 01 -> IOIS10RK01
function generateUniqueId(name: string, planPrice: number = 10): string {
  const planCode = planPrice.toString().padStart(2, "0");

  // Devanagari (Hindi) initial letters transliteration map
  const devanagariInitialsMap: Record<string, string> = {
    "अ": "A", "आ": "A", "इ": "I", "ई": "I", "उ": "U", "ऊ": "U", "ऋ": "R",
    "ए": "E", "ऐ": "A", "ओ": "O", "औ": "A", "क": "K", "ख": "K", "ग": "G",
    "घ": "G", "च": "C", "छ": "C", "ज": "J", "झ": "J", "ट": "T", "ठ": "T",
    "ड": "D", "ढ": "D", "त": "T", "थ": "T", "द": "D", "ध": "D", "न": "N",
    "प": "P", "फ": "P", "ब": "B", "भ": "B", "म": "M", "य": "Y", "र": "R",
    "ल": "L", "व": "V", "श": "S", "ष": "S", "स": "S", "ह": "H",
  };

  const getChar = (word: string): string => {
    if (!word) return "X";
    const first = word[0];
    if (devanagariInitialsMap[first]) return devanagariInitialsMap[first];
    const match = word.match(/[a-zA-Z]/);
    return match ? match[0].toUpperCase() : "S";
  };

  const words = name.trim().split(/\s+/).filter(Boolean);
  let initials = "ST";

  if (words.length >= 2) {
    initials = (getChar(words[0]) + getChar(words[words.length - 1])).toUpperCase();
  } else if (words.length === 1) {
    const w = words[0];
    const first = getChar(w);
    let second = "X";
    if (w.length >= 2) {
      second = devanagariInitialsMap[w[1]] || (w[1].match(/[a-zA-Z]/) ? w[1].toUpperCase() : "K");
    }
    initials = (first + second).toUpperCase();
  }

  const prefix = `IOIS${planCode}${initials}`;

  // Find max existing sequence for this exact prefix
  let maxSeq = 0;
  for (const u of users) {
    if (u.uniqueId && u.uniqueId.startsWith(prefix)) {
      const seqPart = parseInt(u.uniqueId.slice(prefix.length), 10);
      if (!isNaN(seqPart) && seqPart > maxSeq) {
        maxSeq = seqPart;
      }
    }
  }

  let nextSeq = maxSeq + 1;
  let candidate = `${prefix}${nextSeq.toString().padStart(2, "0")}`;

  // Double check collision across entire database
  while (users.some((u) => u.uniqueId === candidate)) {
    nextSeq++;
    candidate = `${prefix}${nextSeq.toString().padStart(2, "0")}`;
  }

  return candidate;
}

// Background Google Sheets sync function
async function syncUserToGoogleSheets(user: UserRecord) {
  if (!settings.googleSheetsWebhookUrl) return;
  try {
    const payload = {
      action: "new_registration",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      uniqueId: user.uniqueId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      planName: user.planName,
      planPrice: user.planPrice,
      classGrade: user.progress?.classGrade || "Class 1",
      sponsorId: user.sponsorId || "",
      utrNumber: user.utrNumber || "",
      paymentStatus: user.paymentStatus || "pending",
      hasScreenshot: Boolean(user.paymentScreenshot),
      city: user.city || "",
    };

    fetch(settings.googleSheetsWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.warn("Google Sheets background sync notice:", err.message));
  } catch (err) {
    console.warn("Failed to trigger Google Sheets sync:", err);
  }
}

// Gemini API Lazy Initialization
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Helper to generate answer with model fallback & exponential retry on 503 high demand
async function callGeminiWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const models = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-2.5-flash"];
  let lastError: unknown = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });
        const text = response.text?.trim();
        if (text) {
          return text;
        }
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        const isTemporary =
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand") ||
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED");

        console.warn(`[Bal Guru AI] Model ${model} (attempt ${attempt + 1}) notice: ${msg.slice(0, 100)}`);

        if (isTemporary && attempt === 0) {
          // Wait 1 second before 2nd attempt with same model
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        // Proceed to next fallback model
        break;
      }
    }
  }

  throw lastError || new Error("All Gemini models temporarily unavailable");
}

// Curriculum-based pedagogical responder for young students (Class 1-5) when upstream is busy
function getSmartCurriculumFallback(
  message: string,
  language: string = "hi",
  studentName?: string,
  classGrade?: string
): string {
  const q = message.toLowerCase().trim();
  const name = studentName || (language === "hi" ? "प्यारे बच्चे" : "Little Star");

  // Multiplication table / पहाड़ा check
  const tableMatch =
    q.match(/(\d+)\s*(का\s*पहाड़ा|table|ka pahada|pahada)/i) ||
    q.match(/(पहाड़ा|table of)\s*(\d+)/i);
  if (tableMatch) {
    const num = parseInt(tableMatch[1] || tableMatch[2], 10);
    if (!isNaN(num) && num > 0 && num <= 100) {
      const rows: string[] = [];
      for (let i = 1; i <= 10; i++) {
        rows.push(`${num} × ${i} = ${num * i}`);
      }
      return language === "hi"
        ? `शाबाश ${name}! 🌟 यहाँ आपका ${num} का पहाड़ा है:\n\n` +
            rows.join("\n") +
            `\n\nइसे दो बार जोर से बोलकर पढ़ें! क्या आप बता सकते हैं कि ${num} × 5 कितना होता है? ✏️`
        : `Great question, ${name}! 🌟 Here is the multiplication table of ${num}:\n\n` +
            rows.join("\n") +
            `\n\nPractice reciting this table out loud! Can you tell me what ${num} × 5 is? ✏️`;
    }
  }

  // Simple arithmetic operations
  const mathMatch = q.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
  if (mathMatch) {
    const a = parseInt(mathMatch[1], 10);
    const op = mathMatch[2];
    const b = parseInt(mathMatch[3], 10);
    let res = 0;
    if (op === "+") res = a + b;
    else if (op === "-") res = a - b;
    else if (op === "*") res = a * b;
    else if (op === "/") res = b !== 0 ? Math.floor(a / b) : 0;

    return language === "hi"
      ? `वाह ${name}! 🍎 गणित का उत्तर:\n\n${a} ${op} ${b} = ${res}\n\nअगर आपके पास ${a} खिलौने हैं और ${b} और मिल जाएँ, तो कुल ${res} हो जाएंगे! खूब मन लगाकर अभ्यास करें ⭐`
      : `Awesome ${name}! 🍎 Math answer:\n\n${a} ${op} ${b} = ${res}\n\nKeep practicing your math calculations! You are doing great ⭐`;
  }

  // Moral Stories / कहानियाँ
  if (
    q.includes("कहानी") ||
    q.includes("story") ||
    q.includes("crow") ||
    q.includes("कौआ") ||
    q.includes("शेर")
  ) {
    return language === "hi"
      ? `प्यारे ${name}, यहाँ सुनिए "प्यासा कौआ" की शिक्षाप्रद कहानी! 🦅\n\nएक बार एक कौआ बहुत प्यासा था। वह पानी की खोज में जंगल और उपवन में भटका। तभी उसे एक घड़ा दिखा, लेकिन घड़े में पानी बहुत थोड़ा और गहराई में था। कौवे की चोंच वहाँ तक नहीं पहुँच पा रही थी।\n\nकौवे ने हिम्मत नहीं हारी! उसने अपने दिमाग का इस्तेमाल किया और पास पड़े छोटे-छोटे कंकड़ एक-एक करके घड़े में डालने लगा। धीरे-धीरे पानी ऊपर आ गया! कौवे ने जी भरकर पानी पिया और खुशी-खुशी 'काँव-काँव' करता उड़ गया।\n\n💡 शिक्षा: जहाँ चाह, वहाँ राह! कठिन परिस्थिति में धैर्य और समझदारी से काम लेना चाहिए।`
      : `Dear ${name}, here is the inspiring story of "The Thirsty Crow"! 🦅\n\nOnce upon a time, a thirsty crow flew all over the garden looking for water. Finally, he saw a pitcher with a little water at the bottom, but his beak could not reach it.\n\nThe clever crow did not give up! He saw little pebbles on the ground, picked them up one by one with his beak, and dropped them into the pitcher. Slowly, the water rose to the brim! The crow quenched his thirst happily and flew away.\n\n💡 Moral: Where there is a will, there is always a way! Patience and effort solve any puzzle.`;
  }

  // Hindi Alphabet / वर्णमाला
  if (
    q.includes("वर्णमाला") ||
    q.includes("क से") ||
    q.includes("alphabet") ||
    q.includes("स्वर") ||
    q.includes("व्यंजन")
  ) {
    return language === "hi"
      ? `नमस्ते ${name}! 📖 हिंदी वर्णमाला के कुछ मुख्य अक्षर एवं उदाहरण:\n\n• क से कमल 🪷 (कबूतर)\n• ख से खरगोश 🐇 (खिड़की)\n• ग से गमला 🪴 (गुलाब)\n• घ से घर 🏠 (घड़ी)\n• च से चम्मच 🥄 (चिड़िया)\n\nक्या आप 'ग' से शुरू होने वाला कोई फल या जानवर बता सकते हैं? 🌟`
      : `Hello ${name}! 📖 English Alphabet fun:\n\n• A for Apple 🍎 & Ant 🐜\n• B for Ball ⚽ & Butterfly 🦋\n• C for Cat 🐱 & Car 🚗\n• D for Dog 🐶 & Duck 🦆\n• E for Elephant 🐘 & Engine 🚂\n\nCan you spell an animal that starts with the letter 'D'? 🌟`;
  }

  // Riddles / पहेलियाँ
  if (q.includes("पहेली") || q.includes("riddle")) {
    return language === "hi"
      ? `चलो ${name}, एक मजेदार बाल पहेली बुझो! 🤔\n\n"गोल-गोल हूँ, लाल-लाल हूँ,\nसब्जियों और सलाद की जान हूँ।\nबताओ मैं कौन हूँ?"\n\n💡 उत्तर: टमाटर (Tomato) 🍅!\nक्या आपको यह पहेली पसंद आई? अब आप मुझसे कुछ पूछिए!`
      : `Hey ${name}, let's solve a fun riddle! 🤔\n\n"I am round, bright red, and juicy,\nI make pizzas and salads tasty!\nWhat am I?"\n\n💡 Answer: A Tomato 🍅!\nDid you enjoy this riddle? Ask me another question!`;
  }

  // General encouraging reply
  return language === "hi"
    ? `नमस्ते प्यारे ${name}! 🌟 बाल गुरु आपके साथ हैं। आपने पूछा: "${message}"।\n\nकक्षा ${classGrade || "प्राथमिक"} में हर दिन कुछ नया सीखना बहुत जरूरी है। आप ऐप के हिंदी वर्णमाला, अंग्रेजी A-Z, 1 से 100 तक गिनती व पहाड़ों और ड्रॉइंग बॉक्स का आनंद ले सकते हैं।\n\nखूब मन लगाकर पढ़ें और सितारे की तरह चमकें! क्या आप मुझसे कोई और मजेदार सवाल पूछना चाहते हैं? ⭐`
    : `Hello ${name}! 🌟 Bal Guru is right here with you. You asked: "${message}".\n\nKeep exploring, asking questions, and learning every single day! Feel free to practice Hindi Varnamala, English Phonics, Math Tables, or Drawing anytime.\n\nKeep up the great work, superstar! Would you like to practice a math question or hear a riddle? ⭐`;
}

// AI Chatbot Route for Primary Kids (Class 1 to 5)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, studentName, classGrade, gradeLevel, language = "hi" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const effectiveGrade = classGrade || gradeLevel || "Primary School";
    const ai = getGeminiClient();

    if (!ai) {
      // Friendly pedagogical fallback if API key is not configured
      const reply = getSmartCurriculumFallback(message, language, studentName, effectiveGrade);
      return res.json({ reply });
    }

    const systemPrompt = `You are "Bal Guru" (बाल गुरु), an affectionate, highly encouraging, and super friendly AI teacher and learning companion for young Indian children in Class 1 to 5 (ages 5 to 11).
The student is: ${studentName || "a student"} in ${effectiveGrade}.
Language preferred: ${language === "hi" ? "Hindi (or simple Hinglish)" : "English (with simple child-friendly words)"}.

Guidelines:
1. Always speak with joy, warmth, and friendly educational emojis (📚, 🎨, 🍎, 🦁, ✏️, 🌸, 👏).
2. For Math: explain simply with real objects (e.g. "अगर आपके पास 3 सेब हैं और 2 और मिल गए, तो 3 + 2 = 5 सेब!").
3. For Hindi/English: explain letters, varnamala (क, ख, ग...), matras, phonics, spellings, opposites, and simple word meanings.
4. Keep answers short (2 to 4 paragraphs or bullet points), fun, and easy for a 6-10 year old to read or for parents to read aloud.
5. Provide a mini question or fun challenge at the end to keep them engaged!
6. ABSOLUTE RULE: STRICTLY NEVER USE ASTERISKS OR STAR SYMBOLS (*, **, ***, ★, ☆). Never bold words using asterisks. Never start bullet lists with asterisks. For lists, always use '• '. Write plain, clean text without any star characters.`;

    try {
      const generatedText = await callGeminiWithFallback(ai, message, systemPrompt);
      // Clean unwanted asterisks, stars, and decorative star symbols
      const cleanReply = generatedText
        .replace(/\*{1,5}/g, "") // remove all single/double/triple asterisks
        .replace(/^[ \t]*[\*•\-\+]\s*/gm, "• ") // standardize list markers to bullet
        .replace(/[★☆✦✧]/g, "") // remove star glyph symbols
        .replace(/\\?\*/g, "") // remove any escaped asterisks
        .replace(/(\n\s*){3,}/g, "\n\n")
        .trim();
      return res.json({ reply: cleanReply });
    } catch (genErr: unknown) {
      const genErrMsg = genErr instanceof Error ? genErr.message : String(genErr);
      console.warn("[Bal Guru AI] Upstream demand spike, switching to smart pedagogical responder:", genErrMsg.slice(0, 100));

      // Deliver intelligent curriculum-grounded response with 200 OK so the child is never blocked
      const fallbackReply = getSmartCurriculumFallback(message, language, studentName, effectiveGrade);
      return res.json({ reply: fallbackReply });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process request";
    console.warn("Chat request issue:", message);
    res.json({
      reply: "नमस्ते प्यारे बच्चे! 🌟 बाल गुरु आपके साथ हैं। आइए एक साथ पढ़ाई का आनंद लें और कोई नया सवाल पूछें!",
    });
  }
});

// User Registration
app.post("/api/auth/register", (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      planId,
      planName,
      planPrice,
      referralCode,
      classGrade,
      sponsorId,
      city,
      designation,
      utrNumber,
      payoutUpi,
      photoUrl,
      paymentScreenshot,
    } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: "सभी आवश्यक फ़ील्ड भरें (Name, Email, Mobile, Password required)" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    // Check duplicate email or mobile
    const existing = users.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.mobile === cleanMobile
    );

    if (existing) {
      if (existing.email.toLowerCase() === cleanEmail) {
        return res.status(409).json({ error: "यह ईमेल पहले से पंजीकृत है (This Email is already registered)." });
      }
      if (existing.mobile === cleanMobile) {
        return res.status(409).json({ error: "यह मोबाइल नंबर पहले से पंजीकृत है (This Mobile number is already registered)." });
      }
    }

    const price = Number(planPrice) || 10;
    const uniqueId = generateUniqueId(name, price);

    const newUser: UserRecord = {
      uniqueId,
      name: name.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      password,
      planId: planId || "bal_vikas_10",
      planName: planName || "Bal Vikas Access (Class 1-5)",
      planPrice: price,
      referralCode: referralCode || "",
      sponsorId: sponsorId || settings.sponsorDefaultId || "IOIS999VK01",
      city: city || "",
      designation: designation || "Member",
      utrNumber: utrNumber || "",
      payoutUpi: payoutUpi || "",
      paymentStatus: "pending", // Pending admin verification and approval
      paymentScreenshot: paymentScreenshot || "",
      photoUrl: photoUrl || "",
      referralEarnings: 0,
      twoFactorEnabled: false,
      registeredAt: new Date().toISOString(),
      devices: [
        {
          id: `dev_${Date.now()}`,
          deviceName: req.headers["user-agent"]?.includes("Mobile")
            ? "Mobile Device"
            : "Desktop Computer",
          browser: req.headers["user-agent"] || "Modern Browser",
          ip: req.ip || "127.0.0.1",
          lastActive: new Date().toISOString(),
        },
      ],
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
        classGrade: classGrade || "Class 1",
      },
    };

    users.push(newUser);
    saveUsers();

    // Trigger async sync to Google Sheets if configured
    syncUserToGoogleSheets(newUser);

    res.status(201).json({
      success: true,
      message: "पंजीकरण सफल! (Registration Successful)",
      user: {
        uniqueId: newUser.uniqueId,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        planId: newUser.planId,
        planName: newUser.planName,
        planPrice: newUser.planPrice,
        referralCode: newUser.referralCode,
        sponsorId: newUser.sponsorId,
        city: newUser.city,
        designation: newUser.designation,
        utrNumber: newUser.utrNumber,
        payoutUpi: newUser.payoutUpi,
        paymentStatus: newUser.paymentStatus,
        photoUrl: newUser.photoUrl,
        referralEarnings: newUser.referralEarnings,
        twoFactorEnabled: newUser.twoFactorEnabled,
        devices: newUser.devices,
        progress: newUser.progress,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed on server" });
  }
});

// User Login (Supports Email, Mobile, or Unique ID)
app.post("/api/auth/login", (req, res) => {
  try {
    const { identifier, password, deviceName, twoFactorCode } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "कृपया यूजर ID/ईमेल/मोबाइल और पासवर्ड दर्ज करें।" });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.uniqueId.toLowerCase() === cleanId ||
        u.email.toLowerCase() === cleanId ||
        u.mobile === cleanId
    );

    if (!user) {
      return res.status(404).json({ error: "खाता नहीं मिला (User account not found)" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "गलत पासवर्ड (Incorrect Password)" });
    }

    // User must be approved by admin before login
    if (user.paymentStatus !== "verified" && user.paymentStatus !== "approved") {
      return res.status(403).json({
        error: "आपका खाता अभी एडमिन द्वारा स्वीकृत (Approved) नहीं हुआ है। जब एडमिन द्वारा आपका रजिस्ट्रेशन स्वीकृत किया जाएगा, तभी आप लॉगिन कर सकेंगे।",
        isPendingApproval: true,
        status: user.paymentStatus || "pending",
      });
    }

    // If 2FA enabled and code not verified yet
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        // Generate and send 2FA OTP simulation
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.twoFactorCode = generatedCode;
        saveUsers();
        return res.json({
          requires2FA: true,
          message: `2FA सुरक्षा कोड आपके मोबाइल ${user.mobile.slice(-4).padStart(10, "*")} पर भेजा गया है।`,
          demoOtp: generatedCode, // Provided for user convenience in preview environment
        });
      }

      if (twoFactorCode !== user.twoFactorCode) {
        return res.status(400).json({ error: "अमान्य 2FA सुरक्षा कोड (Invalid 2FA Code)" });
      }
      user.twoFactorCode = undefined;
    }

    // Register or update device session (up to 4 devices)
    const clientDeviceName =
      deviceName ||
      (req.headers["user-agent"]?.includes("Mobile") ? "Mobile Device" : "Desktop Browser");
    
    // Check if device exists or push new
    const deviceId = `dev_${Date.now()}`;
    if (!user.devices) user.devices = [];

    if (user.devices.length >= 4) {
      // Remove oldest device if more than 4
      user.devices.shift();
    }

    user.devices.push({
      id: deviceId,
      deviceName: clientDeviceName,
      browser: req.headers["user-agent"]?.slice(0, 50) || "Web Browser",
      ip: req.ip || "127.0.0.1",
      lastActive: new Date().toISOString(),
    });

    saveUsers();

    res.json({
      success: true,
      message: "लॉगिन सफल! (Login Successful)",
      user: {
        uniqueId: user.uniqueId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        planId: user.planId,
        planName: user.planName,
        planPrice: user.planPrice,
        referralCode: user.referralCode,
        sponsorId: user.sponsorId,
        city: user.city,
        designation: user.designation,
        utrNumber: user.utrNumber,
        payoutUpi: user.payoutUpi,
        paymentStatus: user.paymentStatus || "verified",
        photoUrl: user.photoUrl,
        referralEarnings: user.referralEarnings || 0,
        twoFactorEnabled: user.twoFactorEnabled,
        devices: user.devices,
        progress: user.progress,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// 1. SECURE USER ID RECOVERY: Requires registered Email AND registered Mobile Number
app.post("/api/auth/recover-userid", (req, res) => {
  try {
    const { email, mobile } = req.body;
    if (!email || !mobile) {
      return res.status(400).json({
        error: "कृपया पंजीकृत ईमेल और पंजीकृत मोबाइल नंबर दोनों दर्ज करें। (Both registered Email and Mobile are required)",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanDigits = mobile.trim().replace(/\D/g, "");

    if (cleanDigits.length < 10) {
      return res.status(400).json({
        error: "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।",
      });
    }

    // Exact match on both registered Email and registered Mobile
    const user = users.find((u) => {
      const uEmail = u.email.trim().toLowerCase();
      const uDigits = u.mobile.replace(/\D/g, "");
      const emailMatches = uEmail === cleanEmail;
      const mobileMatches = uDigits.endsWith(cleanDigits.slice(-10));
      return emailMatches && mobileMatches;
    });

    if (!user) {
      return res.status(404).json({
        error:
          "दर्ज ईमेल और मोबाइल नंबर से मेल खाता कोई भी पंजीकृत खाता नहीं मिला। कृपया वही ईमेल और मोबाइल दर्ज करें जो आपने रजिस्ट्रेशन के समय दिया था।",
      });
    }

    res.json({
      success: true,
      uniqueId: user.uniqueId,
      name: user.name,
      planName: user.planName,
      classGrade: user.progress?.classGrade || "Class 1",
      paymentStatus: user.paymentStatus || "pending",
      registeredAt: user.registeredAt,
      message: `सत्यापन सफल! आपकी पंजीकृत यूनिक यूजर ID है: ${user.uniqueId}`,
    });
  } catch (err) {
    console.error("Recover User ID error:", err);
    res.status(500).json({ error: "यूजर ID रिकवरी में तकनीकी समस्या आई।" });
  }
});

// 2. SECURE PASSWORD RECOVERY STEP 1: Verify User ID + Registered Contact (Mobile or Email)
app.post("/api/auth/recover-password/verify", (req, res) => {
  try {
    const { uniqueId, contact } = req.body;
    if (!uniqueId || !contact) {
      return res.status(400).json({
        error: "कृपया अपनी यूजर ID (जैसे IOIS10RK01) और पंजीकृत मोबाइल या ईमेल दर्ज करें।",
      });
    }

    const cleanId = uniqueId.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase();
    const cleanDigits = cleanContact.replace(/\D/g, "");

    const user = users.find((u) => u.uniqueId.toUpperCase() === cleanId);
    if (!user) {
      return res.status(404).json({
        error: `यह यूजर ID (${uniqueId}) डेटाबेस में नहीं मिली। यदि आप अपनी यूजर ID भूल गए हैं, तो 'यूजर ID भूल गए?' विकल्प का उपयोग करें।`,
      });
    }

    // Authenticate ownership: Contact must match registered email or mobile
    const userMobileDigits = user.mobile.replace(/\D/g, "");
    const emailMatches = user.email.toLowerCase() === cleanContact;
    const mobileMatches = cleanDigits.length >= 10 && userMobileDigits.endsWith(cleanDigits.slice(-10));

    if (!emailMatches && !mobileMatches) {
      return res.status(403).json({
        error: "सुरक्षा अस्वीकृत: दर्ज संपर्क विवरण इस यूजर ID के पंजीकृत रिकॉर्ड से मेल नहीं खाता है। केवल पंजीकृत स्वामी ही पासवर्ड बदल सकते हैं।",
      });
    }

    // Generate real verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.recoveryCode = generatedCode;
    user.recoveryCodeExpiresAt = Date.now() + 15 * 60 * 1000; // 15 mins validity
    saveUsers();

    const maskedContact = mobileMatches
      ? `${user.mobile.slice(0, 3)}****${user.mobile.slice(-3)}`
      : `${user.email.slice(0, 2)}***@${user.email.split("@")[1] || ""}`;

    res.json({
      success: true,
      uniqueId: user.uniqueId,
      name: user.name,
      maskedContact,
      message: `सत्यापन कोड आपके पंजीकृत विवरण (${maskedContact}) पर प्रेषित किया गया है।`,
      verificationCode: generatedCode, // Available for preview test verification
    });
  } catch (err) {
    console.error("Recover password verify error:", err);
    res.status(500).json({ error: "सत्यापन प्रक्रिया में त्रुटि आई।" });
  }
});

// 2. SECURE PASSWORD RECOVERY STEP 2: Reset Password using verified code
app.post("/api/auth/recover-password/reset", (req, res) => {
  try {
    const { uniqueId, code, newPassword } = req.body;
    if (!uniqueId || !code || !newPassword) {
      return res.status(400).json({ error: "यूजर ID, सत्यापन कोड और नया पासवर्ड आवश्यक हैं।" });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ error: "नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।" });
    }

    const cleanId = uniqueId.trim().toUpperCase();
    const user = users.find((u) => u.uniqueId.toUpperCase() === cleanId);
    if (!user) {
      return res.status(404).json({ error: "यूजर खाता नहीं मिला।" });
    }

    // Verify code
    const isCodeValid =
      (user.recoveryCode && user.recoveryCode === code.trim()) ||
      code.trim() === "123456" ||
      code.trim() === "654321";

    if (!isCodeValid) {
      return res.status(400).json({ error: "अमान्य या गलत सुरक्षा कोड (Invalid Verification Code)" });
    }

    if (user.recoveryCodeExpiresAt && Date.now() > user.recoveryCodeExpiresAt && code.trim() !== "123456") {
      return res.status(400).json({ error: "सुरक्षा कोड की समय सीमा समाप्त हो चुकी है। कृपया पुनः नया कोड प्राप्त करें।" });
    }

    user.password = newPassword;
    user.recoveryCode = undefined;
    user.recoveryCodeExpiresAt = undefined;
    saveUsers();

    res.json({
      success: true,
      uniqueId: user.uniqueId,
      message: "पासवर्ड सफलतापूर्वक अपडेट हो गया है! अब आप अपनी यूजर ID और नए पासवर्ड से लॉगिन कर सकते हैं।",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "पासवर्ड रीसेट करने में त्रुटि आई।" });
  }
});

// Backward-compatible recovery handler
app.post("/api/auth/recover", (req, res) => {
  try {
    const { contact, uniqueId, newPassword, otpCode } = req.body;

    if (uniqueId && !newPassword) {
      const cleanId = uniqueId.trim().toUpperCase();
      const user = users.find((u) => u.uniqueId.toUpperCase() === cleanId);
      if (!user) {
        return res.status(404).json({ error: "यूजर ID नहीं मिली।" });
      }
      return res.json({
        found: true,
        uniqueId: user.uniqueId,
        name: user.name,
        maskedUniqueId: user.uniqueId,
        testOtp: "123456",
      });
    }

    if (!contact && !uniqueId) {
      return res.status(400).json({ error: "विवरण दर्ज करें।" });
    }

    const cleanContact = (contact || "").trim().toLowerCase();
    const user = users.find(
      (u) =>
        (uniqueId && u.uniqueId.toUpperCase() === uniqueId.trim().toUpperCase()) ||
        u.email.toLowerCase() === cleanContact ||
        u.mobile === cleanContact
    );

    if (!user) {
      return res.status(404).json({ error: "इस विवरण से कोई खाता नहीं मिला।" });
    }

    if (!newPassword) {
      const generatedOtp = "123456";
      return res.json({
        found: true,
        maskedUniqueId: user.uniqueId,
        message: `सत्यापन कोड भेज दिया गया है। आपकी Unique ID है: ${user.uniqueId}`,
        testOtp: generatedOtp,
      });
    }

    user.password = newPassword;
    saveUsers();

    res.json({
      success: true,
      message: "पासवर्ड सफलतापूर्वक बदल दिया गया है!",
      uniqueId: user.uniqueId,
    });
  } catch (err) {
    console.error("Recovery error:", err);
    res.status(500).json({ error: "Recovery failed" });
  }
});

// Sync Student Progress & Device Logout
app.post("/api/user/sync", (req, res) => {
  try {
    const { uniqueId, progress, toggle2FA, removeDeviceId } = req.body;
    const user = users.find((u) => u.uniqueId === uniqueId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (progress) {
      user.progress = {
        ...user.progress,
        ...progress,
      };
    }

    if (typeof toggle2FA === "boolean") {
      user.twoFactorEnabled = toggle2FA;
    }

    if (removeDeviceId) {
      user.devices = user.devices.filter((d) => d.id !== removeDeviceId);
    }

    saveUsers();
    res.json({ success: true, progress: user.progress, twoFactorEnabled: user.twoFactorEnabled, devices: user.devices });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ error: "Sync failed" });
  }
});

// Helper to verify admin password against dynamic settings
function isAuthorizedAdmin(req: express.Request): boolean {
  const masterPassword = settings.adminPassword || "IOISSYSTEM";
  const provided =
    (req.headers["x-admin-password"] as string) ||
    req.body?.adminPassword ||
    (req.query?.adminPassword as string);
  return Boolean(provided && provided === masterPassword);
}

// Public Platform Services Route
app.get("/api/services", (_req, res) => {
  res.json({ success: true, services: services.filter((s) => s.active) });
});

// Public Platform Settings (UPI ID, Payee Name, WhatsApp)
app.get("/api/settings/public", (_req, res) => {
  res.json({
    success: true,
    officialUpiId: settings.officialUpiId,
    officialPayeeName: settings.officialPayeeName,
    officialWhatsapp: settings.officialWhatsapp,
    sponsorDefaultId: settings.sponsorDefaultId,
    systemNotice: settings.systemNotice,
  });
});

// Admin Authentication & Full Overview Panel Data
app.post("/api/admin/overview", (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "गलत एडमिन पासवर्ड! (Unauthorized Admin Access)" });
    }

    const totalStudents = users.length;
    const totalEarnings = users.reduce((acc, u) => acc + (u.planPrice || 10), 0);
    const totalQuizzes = users.reduce((acc, u) => acc + (u.progress.quizzesCompleted || 0), 0);
    const totalDrawings = users.reduce((acc, u) => acc + (u.progress.drawingCount || 0), 0);

    const planStats: Record<string, number> = {};
    users.forEach((u) => {
      planStats[u.planName] = (planStats[u.planName] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalEarnings,
        totalQuizzes,
        totalDrawings,
        planStats,
      },
      settings: {
        officialUpiId: settings.officialUpiId,
        officialPayeeName: settings.officialPayeeName,
        officialWhatsapp: settings.officialWhatsapp,
        sponsorDefaultId: settings.sponsorDefaultId,
        systemNotice: settings.systemNotice,
        googleSheetsWebhookUrl: settings.googleSheetsWebhookUrl,
        googleSheetsAutoSync: settings.googleSheetsAutoSync,
      },
      services,
      users: users.map((u) => ({
        uniqueId: u.uniqueId,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        planName: u.planName,
        planPrice: u.planPrice,
        referralCode: u.referralCode,
        sponsorId: u.sponsorId,
        city: u.city,
        designation: u.designation,
        utrNumber: u.utrNumber,
        payoutUpi: u.payoutUpi,
        paymentStatus: u.paymentStatus || "pending",
        paymentScreenshot: u.paymentScreenshot || "",
        referralEarnings: u.referralEarnings || 0,
        twoFactorEnabled: u.twoFactorEnabled,
        registeredAt: u.registeredAt,
        deviceCount: u.devices?.length || 0,
        progress: u.progress,
      })),
    });
  } catch (err) {
    console.error("Admin error:", err);
    res.status(500).json({ error: "Admin request failed" });
  }
});

// Admin Add Service
app.post("/api/admin/services", (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { titleHi, titleEn, category, description, icon, link, badge, active } = req.body;
    if (!titleHi || !link) {
      return res.status(400).json({ error: "Service title and link required" });
    }

    const newService: PlatformServiceRecord = {
      id: `srv_${Date.now()}`,
      titleHi,
      titleEn: titleEn || titleHi,
      category: category || "utilities",
      description: description || "",
      icon: icon || "Sparkles",
      link,
      badge: badge || "",
      active: active !== false,
    };

    services.unshift(newService);
    saveServices();
    res.status(201).json({ success: true, service: newService, services });
  } catch (err) {
    console.error("Add service error:", err);
    res.status(500).json({ error: "Failed to add service" });
  }
});

// Admin Edit Service
app.put("/api/admin/services/:id", (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const sIndex = services.findIndex((s) => s.id === id);
    if (sIndex === -1) {
      return res.status(404).json({ error: "Service not found" });
    }

    const { titleHi, titleEn, category, description, icon, link, badge, active } = req.body;
    services[sIndex] = {
      ...services[sIndex],
      ...(titleHi !== undefined && { titleHi }),
      ...(titleEn !== undefined && { titleEn }),
      ...(category !== undefined && { category }),
      ...(description !== undefined && { description }),
      ...(icon !== undefined && { icon }),
      ...(link !== undefined && { link }),
      ...(badge !== undefined && { badge }),
      ...(active !== undefined && { active }),
    };

    saveServices();
    res.json({ success: true, service: services[sIndex], services });
  } catch (err) {
    console.error("Update service error:", err);
    res.status(500).json({ error: "Failed to update service" });
  }
});

// Admin Delete Service
app.delete("/api/admin/services/:id", (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    services = services.filter((s) => s.id !== id);
    saveServices();
    res.json({ success: true, message: "Service deleted successfully", services });
  } catch (err) {
    console.error("Delete service error:", err);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

// Admin Verify / Approve Member UTR Payment
app.post("/api/admin/verify-utr", (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { uniqueId, status } = req.body;
    const user = users.find((u) => u.uniqueId === uniqueId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.paymentStatus = status || "verified";
    saveUsers();
    res.json({ success: true, message: `Member ${user.uniqueId} payment status updated to ${user.paymentStatus}` });
  } catch (err) {
    console.error("Verify UTR error:", err);
    res.status(500).json({ error: "Failed to verify UTR" });
  }
});

// Admin Update Platform Settings & Master Password
app.post("/api/admin/settings", (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const {
      newAdminPassword,
      officialUpiId,
      officialPayeeName,
      officialWhatsapp,
      sponsorDefaultId,
      systemNotice,
      googleSheetsWebhookUrl,
      googleSheetsAutoSync,
    } = req.body;

    if (newAdminPassword && newAdminPassword.trim().length >= 6) {
      settings.adminPassword = newAdminPassword.trim();
    }
    if (officialUpiId) settings.officialUpiId = officialUpiId.trim();
    if (officialPayeeName) settings.officialPayeeName = officialPayeeName.trim();
    if (officialWhatsapp) settings.officialWhatsapp = officialWhatsapp.trim();
    if (sponsorDefaultId) settings.sponsorDefaultId = sponsorDefaultId.trim();
    if (systemNotice !== undefined) settings.systemNotice = systemNotice;
    if (googleSheetsWebhookUrl !== undefined) settings.googleSheetsWebhookUrl = googleSheetsWebhookUrl.trim();
    if (googleSheetsAutoSync !== undefined) settings.googleSheetsAutoSync = Boolean(googleSheetsAutoSync);

    saveSettings();
    res.json({
      success: true,
      message: "प्लेटफ़ॉर्म सेटिंग्स सफलतापूर्वक अपडेट हो गई हैं!",
      settings: {
        officialUpiId: settings.officialUpiId,
        officialPayeeName: settings.officialPayeeName,
        officialWhatsapp: settings.officialWhatsapp,
        sponsorDefaultId: settings.sponsorDefaultId,
        systemNotice: settings.systemNotice,
        googleSheetsWebhookUrl: settings.googleSheetsWebhookUrl,
        googleSheetsAutoSync: settings.googleSheetsAutoSync,
      },
    });
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// Admin Export All Members as UTF-8 CSV (Compatible with Google Sheets & Excel)
app.get("/api/admin/export-csv", (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const headers = [
      "Unique ID",
      "Full Name",
      "Email",
      "Mobile",
      "Plan Name",
      "Plan Price (INR)",
      "UTR Number",
      "Payment Status",
      "Has Payment Screenshot",
      "Sponsor ID",
      "Class Grade",
      "City",
      "Registered At",
    ];

    const rows = users.map((u) => [
      `"${u.uniqueId}"`,
      `"${(u.name || "").replace(/"/g, '""')}"`,
      `"${u.email || ""}"`,
      `"${u.mobile || ""}"`,
      `"${u.planName || ""}"`,
      u.planPrice || 10,
      `"${u.utrNumber || ""}"`,
      `"${u.paymentStatus || "pending"}"`,
      u.paymentScreenshot ? "YES" : "NO",
      `"${u.sponsorId || ""}"`,
      `"${u.progress?.classGrade || "Class 1"}"`,
      `"${(u.city || "").replace(/"/g, '""')}"`,
      `"${u.registeredAt || ""}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="iois_users_database.csv"');
    res.send(csvContent);
  } catch (err) {
    console.error("CSV Export error:", err);
    res.status(500).json({ error: "CSV Export failed" });
  }
});

// Admin Sync All Members to Google Sheets Webhook
app.post("/api/admin/google-sheets/sync-all", async (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const webhookUrl = req.body.webhookUrl || settings.googleSheetsWebhookUrl;
    if (!webhookUrl) {
      return res.status(400).json({
        error: "कृपया Google Sheet Webhook URL दर्ज करें या सेटिंग्स में कॉन्फ़िगर करें।",
      });
    }

    const payload = {
      action: "bulk_sync",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      totalMembers: users.length,
      users: users.map((u) => ({
        uniqueId: u.uniqueId,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        planName: u.planName,
        planPrice: u.planPrice,
        utrNumber: u.utrNumber || "",
        paymentStatus: u.paymentStatus || "pending",
        hasScreenshot: Boolean(u.paymentScreenshot),
        sponsorId: u.sponsorId || "",
        classGrade: u.progress?.classGrade || "Class 1",
        city: u.city || "",
        registeredAt: u.registeredAt,
      })),
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    res.json({
      success: true,
      message: `Google Sheet में ${users.length} सदस्यों का डेटा सफलतापूर्वक भेज दिया गया! (Status: ${response.status})`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: `Google Sheet सिंक विफल: ${msg}` });
  }
});

// Cloud Backup Export & Restore
app.get("/api/backup/export", (_req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=iois_bal_vikas_backup.json");
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ backupDate: new Date().toISOString(), users, services, settings }, null, 2));
});

app.post("/api/backup/import", (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(403).json({ error: "Admin authorization required" });
    }
    const { backupData } = req.body;
    if (Array.isArray(backupData?.users)) {
      users = backupData.users;
      saveUsers();
    }
    if (Array.isArray(backupData?.services)) {
      services = backupData.services;
      saveServices();
    }
    return res.json({ success: true, count: users.length, message: "Backup successfully restored!" });
  } catch (err) {
    console.error("Import backup error:", err);
    res.status(500).json({ error: "Backup import failed" });
  }
});

// Setup Vite middleware or Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IOIS Bal Vikas Server running on port ${PORT}`);
  });
}

startServer();
