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

// Initial seed demo user if file doesn't exist
let users: UserRecord[] = [];
if (fs.existsSync(USERS_FILE)) {
  try {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
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
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save users file", err);
  }
}

// Unique ID Generator: IOIS + PlanCode + Initials + Sequence
// Example: IOIS + 10 + RK + 01 -> IOIS10RK01
// 1. IOIS: Platform Code
// 2. 10: Plan Price (₹10)
// 3. RK: Initials of user (Rahul Kumar)
// 4. 01: Sequence number of member joining that plan
function generateUniqueId(name: string, planPrice: number = 10): string {
  const planCode = planPrice.toString().padStart(2, "0");
  const words = name.trim().split(/\s+/).filter(Boolean);
  let initials = "ST";
  if (words.length >= 2) {
    initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else if (words.length === 1 && words[0].length === 1) {
    initials = (words[0][0] + "X").toUpperCase();
  }

  // Count existing members who joined this plan
  const countInPlan = users.filter((u) => u.planPrice === planPrice || u.uniqueId.startsWith(`IOIS${planCode}`)).length + 1;
  let seq = countInPlan.toString().padStart(2, "0");
  let candidate = `IOIS${planCode}${initials}${seq}`;

  // Ensure absolute uniqueness
  let counter = countInPlan;
  while (users.some((u) => u.uniqueId === candidate)) {
    counter++;
    seq = counter.toString().padStart(2, "0");
    candidate = `IOIS${planCode}${initials}${seq}`;
  }
  return candidate;
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
      designation: designation || "Verified Elite Member",
      utrNumber: utrNumber || "",
      payoutUpi: payoutUpi || "",
      paymentStatus: "verified",
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

// Self-service Password & User ID Recovery
app.post("/api/auth/recover", (req, res) => {
  try {
    const { contact, newPassword, otpCode } = req.body;
    if (!contact) {
      return res.status(400).json({ error: "ईमेल या मोबाइल नंबर दर्ज करें (Contact required)" });
    }

    const cleanContact = contact.trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanContact || u.mobile === cleanContact
    );

    if (!user) {
      return res.status(404).json({ error: "इस ईमेल या मोबाइल से कोई खाता नहीं मिला।" });
    }

    // If only requesting OTP/lookup
    if (!newPassword) {
      const generatedOtp = "123456"; // Standard test OTP for smooth preview
      return res.json({
        found: true,
        maskedUniqueId: user.uniqueId,
        message: `सत्यापन कोड भेज दिया गया है। आपकी Unique ID है: ${user.uniqueId}`,
        testOtp: generatedOtp,
      });
    }

    // Reset password
    if (otpCode !== "123456" && otpCode !== "654321") {
      return res.status(400).json({ error: "अमान्य OTP कोड दर्ज किया गया।" });
    }

    user.password = newPassword;
    saveUsers();

    res.json({
      success: true,
      message: "पासवर्ड सफलतापूर्वक बदल दिया गया है! अब आप लॉगिन कर सकते हैं।",
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
    } = req.body;

    if (newAdminPassword && newAdminPassword.trim().length >= 6) {
      settings.adminPassword = newAdminPassword.trim();
    }
    if (officialUpiId) settings.officialUpiId = officialUpiId.trim();
    if (officialPayeeName) settings.officialPayeeName = officialPayeeName.trim();
    if (officialWhatsapp) settings.officialWhatsapp = officialWhatsapp.trim();
    if (sponsorDefaultId) settings.sponsorDefaultId = sponsorDefaultId.trim();
    if (systemNotice !== undefined) settings.systemNotice = systemNotice;

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
      },
    });
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ error: "Failed to update settings" });
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
