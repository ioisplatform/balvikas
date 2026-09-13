// IOIS बाल विकास - 700+ पृष्ठ सम्पूर्ण डिजिटल अध्ययन पुस्तिका (Bal Vikas Workbook & E-Book)

export interface BookChapter {
  id: string;
  partNumber: number;
  partTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  startPage: number;
  endPage: number;
  icon: string;
  color: string;
  description: string;
}

export interface BalVikasPage {
  pageNumber: number;
  partNumber: number;
  partTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  title: string;
  subtitle: string;
  type:
    | "cover"
    | "index"
    | "alphabet_intro"
    | "alphabet_trace"
    | "swar_intro"
    | "swar_trace"
    | "vyanjan_intro"
    | "vyanjan_trace"
    | "barakhadi"
    | "words"
    | "poem"
    | "story"
    | "counting_item"
    | "counting_advanced"
    | "table"
    | "addition"
    | "subtraction"
    | "multiplication"
    | "division"
    | "colors"
    | "shapes"
    | "gk"
    | "homework"
    | "certificate";
  audioText: string;
  badge?: string;
  heroCharacter?: string;
  heroWord?: string;
  heroWordHi?: string;
  heroImage?: string;
  examples?: Array<{ text: string; sub?: string; icon?: string }>;
  traceItems?: string[];
  lines?: string[];
  homeworkTask?: string;
  mathProblem?: {
    num1: number;
    num2: number;
    operator: "+" | "-" | "×" | "÷";
    answer: number;
    visualIcons?: string[];
  };
}

export const BOOK_PARTS = [
  {
    partNumber: 1,
    titleHi: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
    titleEn: "Part 1: Language & Alphabets",
    range: "पेज 6 से 185 (180 पृष्ठ)",
    icon: "🔤",
    color: "from-amber-500 to-orange-600",
  },
  {
    partNumber: 2,
    titleHi: "भाग 2: शब्द रचना, बाल कविताएं एवं प्रेरक कहानियां",
    titleEn: "Part 2: Word Formation, Rhymes & Moral Stories",
    range: "पेज 186 से 295 (110 पृष्ठ)",
    icon: "📖",
    color: "from-blue-500 to-indigo-600",
  },
  {
    partNumber: 3,
    titleHi: "भाग 3: गणित एवं अंक ज्ञान (1-100, पहाड़ा 2-40, जोड़, घटाव, गुणा, भाग)",
    titleEn: "Part 3: Mathematics & Numbers (Tables 2-40, Math Operations)",
    range: "पेज 296 से 560 (265 पृष्ठ)",
    icon: "🔢",
    color: "from-emerald-500 to-teal-600",
  },
  {
    partNumber: 4,
    titleHi: "भाग 4: सामान्य ज्ञान, रंग, आकृतियां एवं व्यावहारिक ज्ञान",
    titleEn: "Part 4: GK, Colors, Shapes & Surroundings",
    range: "पेज 561 से 650 (90 पृष्ठ)",
    icon: "🎨",
    color: "from-purple-500 to-pink-600",
  },
  {
    partNumber: 5,
    titleHi: "भाग 5: दैनिक गृहकार्य, अभ्यास कार्यपत्रिका एवं सफलता प्रमाण-पत्र",
    titleEn: "Part 5: Daily Homework, Practice Sheets & Certificate",
    range: "पेज 651 से 720 (70 पृष्ठ)",
    icon: "🏆",
    color: "from-rose-500 to-amber-600",
  },
];

export const BOOK_CHAPTERS: BookChapter[] = [
  {
    id: "ch_cover",
    partNumber: 0,
    partTitle: "प्रस्तावना",
    chapterNumber: 0,
    chapterTitle: "कवर पृष्ठ (Front Cover)",
    startPage: 1,
    endPage: 1,
    icon: "📘",
    color: "bg-amber-500 text-slate-950",
    description: "बाल विकास सम्पूर्ण डिजिटल अध्ययन पुस्तिका - मुख्य मुखपृष्ठ",
  },
  {
    id: "ch_index",
    partNumber: 0,
    partTitle: "प्रस्तावना",
    chapterNumber: 0,
    chapterTitle: "विस्तृत विषय सूची (Table of Contents)",
    startPage: 2,
    endPage: 5,
    icon: "📋",
    color: "bg-indigo-500 text-white",
    description: "संपूर्ण 720 पृष्ठों की विस्तृत व सुव्यवस्थित पाठ्य अनुक्रमणिका",
  },
  {
    id: "ch_1",
    partNumber: 1,
    partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
    chapterNumber: 1,
    chapterTitle: "अंग्रेजी वर्णमाला A to Z (English Alphabet 26 Letters)",
    startPage: 6,
    endPage: 57,
    icon: "🔤",
    color: "bg-amber-500 text-slate-950",
    description: "प्रत्येक 26 अक्षरों का सचित्र अध्ययन, फोनिक्स एवं डिजिटल ट्रेसिंग वर्कबुक",
  },
  {
    id: "ch_2",
    partNumber: 1,
    partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
    chapterNumber: 2,
    chapterTitle: "हिंदी स्वर वर्णमाला (अ से अः - 13 स्वर)",
    startPage: 58,
    endPage: 83,
    icon: "अ",
    color: "bg-orange-500 text-white",
    description: "अ से अः तक सचित्र स्वर ज्ञान, शब्द निर्माण एवं ट्रेसिंग अभ्यास",
  },
  {
    id: "ch_3",
    partNumber: 1,
    partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
    chapterNumber: 3,
    chapterTitle: "हिंदी व्यंजन वर्णमाला (क से ज्ञ - 36 व्यंजन)",
    startPage: 84,
    endPage: 155,
    icon: "क",
    color: "bg-rose-500 text-white",
    description: "क से ज्ञ तक सभी 36 व्यंजनों का सचित्र अध्ययन, फोनिक्स व लेखन अभ्यास",
  },
  {
    id: "ch_4",
    partNumber: 1,
    partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
    chapterNumber: 4,
    chapterTitle: "हिंदी बारहखड़ी (क से ज्ञ संपूर्ण मात्रा ज्ञान)",
    startPage: 156,
    endPage: 185,
    icon: "का",
    color: "bg-purple-500 text-white",
    description: "क, का, कि, की, कु, कू... बारहखड़ी के 30 विस्तृत पृष्ठ व शब्द उच्चारण",
  },
  {
    id: "ch_5",
    partNumber: 2,
    partTitle: "भाग 2: शब्द रचना, बाल कविताएं एवं कहानियां",
    chapterNumber: 5,
    chapterTitle: "शब्द रचना एवं मात्रा ज्ञान (Word Formation)",
    startPage: 186,
    endPage: 225,
    icon: "📝",
    color: "bg-blue-500 text-white",
    description: "दो, तीन व चार अक्षर वाले बिना मात्रा व मात्रा वाले शब्द जोड़ (कल, कमल, आम)",
  },
  {
    id: "ch_6",
    partNumber: 2,
    partTitle: "भाग 2: शब्द रचना, बाल कविताएं एवं कहानियां",
    chapterNumber: 6,
    chapterTitle: "प्रसिद्ध बाल कविताएं एवं बालगीत (Poems & Rhymes)",
    startPage: 226,
    endPage: 260,
    icon: "🎶",
    color: "bg-teal-500 text-white",
    description: "चंदा मामा, मछली जल की रानी, तितली उड़ी, ट्विंकल ट्विंकल, नानी तेरी मोरनी",
  },
  {
    id: "ch_7",
    partNumber: 2,
    partTitle: "भाग 2: शब्द रचना, बाल कविताएं एवं कहानियां",
    chapterNumber: 7,
    chapterTitle: "रोचक व प्रेरक बाल कहानियां (Moral Stories)",
    startPage: 261,
    endPage: 295,
    icon: "📚",
    color: "bg-emerald-500 text-white",
    description: "प्यासा कौआ, शेर और चूहा, खरगोश और कछुआ, एकता में बल सचित्र कहानियां",
  },
  {
    id: "ch_8",
    partNumber: 3,
    partTitle: "भाग 3: गणित एवं अंक ज्ञान",
    chapterNumber: 8,
    chapterTitle: "1 से 50 तक सचित्र गिनती (Counting 1 to 50 with Objects)",
    startPage: 296,
    endPage: 345,
    icon: "1️⃣",
    color: "bg-amber-600 text-white",
    description: "1 से 50 तक हर संख्या का सचित्र वस्तु प्रदर्शन, शब्द रूप व अंक लेखन",
  },
  {
    id: "ch_9",
    partNumber: 3,
    partTitle: "भाग 3: गणित एवं अंक ज्ञान",
    chapterNumber: 9,
    chapterTitle: "51 से 100 तक गिनती (Numbers 51 to 100)",
    startPage: 346,
    endPage: 395,
    icon: "💯",
    color: "bg-cyan-600 text-white",
    description: "51 से 100 तक गिनती, उल्टी गिनती, मिसिंग नंबर एवं अंक क्रमबद्धता",
  },
  {
    id: "ch_10",
    partNumber: 3,
    partTitle: "भाग 3: गणित एवं अंक ज्ञान",
    chapterNumber: 10,
    chapterTitle: "2 से 20 तक पहाड़ा (Multiplication Tables 2 to 20)",
    startPage: 396,
    endPage: 415,
    icon: "✖️",
    color: "bg-indigo-600 text-white",
    description: "2 से 20 तक के सुस्पष्ट और याद करने में आसान तालिकाओं के 20 पृष्ठ",
  },
  {
    id: "ch_11",
    partNumber: 3,
    partTitle: "भाग 3: गणित एवं अंक ज्ञान",
    chapterNumber: 11,
    chapterTitle: "21 से 40 तक पहाड़ा (Tables 21 to 40 - Advanced)",
    startPage: 416,
    endPage: 435,
    icon: "🧮",
    color: "bg-violet-600 text-white",
    description: "21 से 40 तक उच्च स्तरीय पहाड़े, उच्चारण एवं अभ्यास",
  },
  {
    id: "ch_12",
    partNumber: 3,
    partTitle: "भाग 3: गणित एवं अंक ज्ञान",
    chapterNumber: 12,
    chapterTitle: "जोड़ (Addition - +) सचित्र एवं अभ्यास",
    startPage: 436,
    endPage: 470,
    icon: "➕",
    color: "bg-green-600 text-white",
    description: "सचित्र जोड़ (सेब, गुब्बारे), 1-अंकीय व 2-अंकीय जोड़ के 35 पृष्ठ",
  },
  {
    id: "ch_13",
    partNumber: 3,
    partTitle: "भाग 3: गणित एवं अंक ज्ञान",
    chapterNumber: 13,
    chapterTitle: "घटाव (Subtraction - -) सचित्र एवं अभ्यास",
    startPage: 471,
    endPage: 500,
    icon: "➖",
    color: "bg-red-600 text-white",
    description: "सचित्र घटाव (कम करना), सरल 1-अंकीय व 2-अंकीय घटाव अभ्यास",
  },
  {
    id: "ch_14",
    partNumber: 3,
    partTitle: "भाग 3: गणित एवं अंक ज्ञान",
    chapterNumber: 14,
    chapterTitle: "गुणा (Multiplication - ×) सरल विधि",
    startPage: 501,
    endPage: 530,
    icon: "✖️",
    color: "bg-fuchsia-600 text-white",
    description: "पहाड़ों पर आधारित सरल गुणा, सचित्र समूह विधि व अभ्यास",
  },
  {
    id: "ch_15",
    partNumber: 3,
    partTitle: "भाग 3: गणित एवं अंक ज्ञान",
    chapterNumber: 15,
    chapterTitle: "भाग (Division - ÷) बराबर बांटना",
    startPage: 531,
    endPage: 560,
    icon: "➗",
    color: "bg-orange-600 text-white",
    description: "सचित्र वस्तुओं का बराबर बंटवारा एवं सरल भाग के 30 पृष्ठ",
  },
  {
    id: "ch_16",
    partNumber: 4,
    partTitle: "भाग 4: सामान्य ज्ञान, रंग, आकृतियां एवं पर्यावरण",
    chapterNumber: 16,
    chapterTitle: "रंगों की पहचान (Colors Knowledge)",
    startPage: 561,
    endPage: 575,
    icon: "🎨",
    color: "bg-pink-600 text-white",
    description: "लाल, हरा, नीला, पीला, संतरी, बैंगनी, गुलाबी, सफेद, काला आदि 15 पृष्ठ",
  },
  {
    id: "ch_17",
    partNumber: 4,
    partTitle: "भाग 4: सामान्य ज्ञान, रंग, आकृतियां एवं पर्यावरण",
    chapterNumber: 17,
    chapterTitle: "आकृतियों की पहचान (Shapes Recognition)",
    startPage: 576,
    endPage: 590,
    icon: "🔺",
    color: "bg-yellow-600 text-slate-950",
    description: "वृत्त, वर्ग, त्रिभुज, आयत, तारा, अंडाकार आकृतियां व दैनिक वस्तुएं",
  },
  {
    id: "ch_18",
    partNumber: 4,
    partTitle: "भाग 4: सामान्य ज्ञान, रंग, आकृतियां एवं पर्यावरण",
    chapterNumber: 18,
    chapterTitle: "शरीर के अंग (Parts of Body)",
    startPage: 591,
    endPage: 605,
    icon: "👁️",
    color: "bg-sky-600 text-white",
    description: "आँख, कान, नाक, हाथ, पैर, बाल, दाँत सचित्र एवं उनके कार्य",
  },
  {
    id: "ch_19",
    partNumber: 4,
    partTitle: "भाग 4: सामान्य ज्ञान, रंग, आकृतियां एवं पर्यावरण",
    chapterNumber: 19,
    chapterTitle: "फल एवं सब्जियां (Fruits & Vegetables)",
    startPage: 606,
    endPage: 625,
    icon: "🍎",
    color: "bg-emerald-600 text-white",
    description: "आम, केला, सेब, संतरा, अंगूर, आलू, टमाटर, मटर सचित्र अध्ययन",
  },
  {
    id: "ch_20",
    partNumber: 4,
    partTitle: "भाग 4: सामान्य ज्ञान, रंग, आकृतियां एवं पर्यावरण",
    chapterNumber: 20,
    chapterTitle: "पशु एवं पक्षी (Animals & Birds)",
    startPage: 626,
    endPage: 650,
    icon: "🦁",
    color: "bg-amber-700 text-white",
    description: "पालतू एवं जंगली जानवर, पक्षियों की पहचान, आवाज़ें व आदतें",
  },
  {
    id: "ch_21",
    partNumber: 5,
    partTitle: "भाग 5: दैनिक गृहकार्य, अभ्यास एवं प्रमाण-पत्र",
    chapterNumber: 21,
    chapterTitle: "दैनिक अभ्यास एवं सुलेख कार्यपत्रिका (Daily Practice Sheets)",
    startPage: 651,
    endPage: 710,
    icon: "✍️",
    color: "bg-blue-600 text-white",
    description: "60 दैनिक अभ्यास शीट - ट्रेसिंग, सही मिलान, रिक्त स्थान, रंग भरना व प्रश्न",
  },
  {
    id: "ch_22",
    partNumber: 5,
    partTitle: "भाग 5: दैनिक गृहकार्य, अभ्यास एवं प्रमाण-पत्र",
    chapterNumber: 22,
    chapterTitle: "समीक्षा परीक्षा एवं बाल विकास प्रमाण-पत्र (Certificate)",
    startPage: 711,
    endPage: 720,
    icon: "🎖️",
    color: "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950",
    description: "अंतिम मूल्यांकन एवं IOIS बाल विकास आधिकारिक सफलता प्रमाण-पत्र",
  },
];

// English Letters Data
export const ENGLISH_LETTERS_DATA: Record<
  string,
  {
    letter: string;
    wordEn: string;
    wordHi: string;
    icon: string;
    phonics: string;
    traceSteps: string[];
    otherWords: Array<{ en: string; hi: string; icon: string }>;
  }
> = {
  A: {
    letter: "A",
    wordEn: "Apple",
    wordHi: "एप्पल (सेब)",
    icon: "🍎",
    phonics: "ऐ (æ) - जैसे Apple, Ant, Axe",
    traceSteps: [
      "1. ऊपर से नीचे बाईं ओर तिरछी रेखा खींचें (Slanting Line Left)",
      "2. ऊपर से नीचे दाईं ओर तिरछी रेखा खींचें (Slanting Line Right)",
      "3. बीच में दोनों को जोड़ने वाली सीधी रेखा बनाएं (Sleeping Line)",
    ],
    otherWords: [
      { en: "Ant", hi: "चींटी", icon: "🐜" },
      { en: "Axe", hi: "कुल्हाड़ी", icon: "🪓" },
      { en: "Aeroplane", hi: "हवाई जहाज", icon: "✈️" },
      { en: "Alligator", hi: "मगरमच्छ", icon: "🐊" },
    ],
  },
  B: {
    letter: "B",
    wordEn: "Ball",
    wordHi: "बॉल (गेंद)",
    icon: "⚽",
    phonics: "ब (b) - जैसे Ball, Bat, Boy",
    traceSteps: [
      "1. ऊपर से नीचे एक सीधी खड़ी रेखा खींचें (Standing Line)",
      "2. ऊपर से बीच तक आधा गोला बनाएं (Curved Line Top)",
      "3. बीच से नीचे तक दूसरा आधा गोला बनाएं (Curved Line Bottom)",
    ],
    otherWords: [
      { en: "Bat", hi: "बल्ला", icon: "🏏" },
      { en: "Boy", hi: "लड़का", icon: "👦" },
      { en: "Banana", hi: "केला", icon: "🍌" },
      { en: "Bird", hi: "पक्षी", icon: "🐦" },
    ],
  },
  C: {
    letter: "C",
    wordEn: "Cat",
    wordHi: "कैट (बिल्ली)",
    icon: "🐱",
    phonics: "क (k) - जैसे Cat, Car, Cup",
    traceSteps: [
      "1. ऊपर दाईं ओर से शुरू करके बाईं ओर घूमते हुए एक बड़ा खुला अर्धवृत्त बनाएं",
    ],
    otherWords: [
      { en: "Car", hi: "कार / गाड़ी", icon: "🚗" },
      { en: "Cup", hi: "कप", icon: "☕" },
      { en: "Cake", hi: "केक", icon: "🎂" },
      { en: "Cow", hi: "गाय", icon: "🐄" },
    ],
  },
  D: {
    letter: "D",
    wordEn: "Dog",
    wordHi: "डॉग (कुत्ता)",
    icon: "🐶",
    phonics: "ड (d) - जैसे Dog, Duck, Drum",
    traceSteps: [
      "1. ऊपर से नीचे सीधी खड़ी रेखा (Standing Line)",
      "2. ऊपर से नीचे तक एक बड़ा दाईं ओर मुड़ा हुआ वक्र (Big Curve Right)",
    ],
    otherWords: [
      { en: "Duck", hi: "बत्तख", icon: "🦆" },
      { en: "Drum", hi: "ढोलक", icon: "🥁" },
      { en: "Doll", hi: "गुड़िया", icon: "🪆" },
      { en: "Deer", hi: "हिरन", icon: "🦌" },
    ],
  },
  E: {
    letter: "E",
    wordEn: "Elephant",
    wordHi: "एलीफेंट (हाथी)",
    icon: "🐘",
    phonics: "ए (e) - जैसे Elephant, Egg, Engine",
    traceSteps: [
      "1. एक सीधी खड़ी रेखा (Standing Line)",
      "2. ऊपर एक लेटी हुई रेखा (Top Line)",
      "3. बीच में छोटी लेटी रेखा (Middle Line)",
      "4. नीचे एक लेटी रेखा (Bottom Line)",
    ],
    otherWords: [
      { en: "Egg", hi: "अंडा", icon: "🥚" },
      { en: "Eagle", hi: "चील", icon: "🦅" },
      { en: "Engine", hi: "इंजन", icon: "🚂" },
      { en: "Eye", hi: "आंख", icon: "👁️" },
    ],
  },
  F: {
    letter: "F",
    wordEn: "Fish",
    wordHi: "फिश (मछली)",
    icon: "🐟",
    phonics: "फ़ (f) - जैसे Fish, Fan, Frog",
    traceSteps: [
      "1. ऊपर से नीचे सीधी खड़ी रेखा",
      "2. सबसे ऊपर एक लंबी लेटी हुई रेखा",
      "3. बीच में एक थोड़ी छोटी लेटी रेखा",
    ],
    otherWords: [
      { en: "Fan", hi: "पंखा", icon: "🪭" },
      { en: "Frog", hi: "मेंढक", icon: "🐸" },
      { en: "Fox", hi: "लोमड़ी", icon: "🦊" },
      { en: "Flower", hi: "फूल", icon: "🌸" },
    ],
  },
  G: {
    letter: "G",
    wordEn: "Grapes",
    wordHi: "ग्रेप्स (अंगूर)",
    icon: "🍇",
    phonics: "ग (g) - जैसे Grapes, Girl, Gun",
    traceSteps: [
      "1. C अक्षर की तरह बड़ा बायां वक्र बनाएं",
      "2. नीचे से ऊपर अंदर की ओर रेखा खींचें",
      "3. छोटी लेटी हुई रेखा बनाएं",
    ],
    otherWords: [
      { en: "Girl", hi: "लड़की", icon: "👧" },
      { en: "Goat", hi: "बकरी", icon: "🐐" },
      { en: "Guitar", hi: "गिटार", icon: "🎸" },
      { en: "Gift", hi: "उपहार", icon: "🎁" },
    ],
  },
  H: {
    letter: "H",
    wordEn: "Hen",
    wordHi: "हेन (मुर्गी)",
    icon: "🐔",
    phonics: "ह (h) - जैसे Hen, Hat, Horse",
    traceSteps: [
      "1. बाईं ओर सीधी खड़ी रेखा",
      "2. दाईं ओर समानांतर सीधी खड़ी रेखा",
      "3. दोनों के बीच में लेटी रेखा जोड़ें",
    ],
    otherWords: [
      { en: "Hat", hi: "टोपी", icon: "👒" },
      { en: "Horse", hi: "घोड़ा", icon: "🐴" },
      { en: "House", hi: "घर", icon: "🏠" },
      { en: "Hand", hi: "हाथ", icon: "✋" },
    ],
  },
  I: {
    letter: "I",
    wordEn: "Ice-cream",
    wordHi: "आइसक्रीम",
    icon: "🍦",
    phonics: "इ / आई (i) - जैसे Ice-cream, Inkpot, Igloo",
    traceSteps: [
      "1. बीच में सीधी खड़ी रेखा",
      "2. ऊपर छोटी लेटी रेखा",
      "3. नीचे छोटी लेटी रेखा",
    ],
    otherWords: [
      { en: "Inkpot", hi: "दवात", icon: "✒️" },
      { en: "Igloo", hi: "बर्फ का घर", icon: "🧊" },
      { en: "Island", hi: "द्वीप", icon: "🏝️" },
      { en: "Iron", hi: "इस्त्री", icon: "👔" },
    ],
  },
  J: {
    letter: "J",
    wordEn: "Jug",
    wordHi: "जग",
    icon: "🫖",
    phonics: "ज (j) - जैसे Jug, Joker, Juice",
    traceSteps: [
      "1. ऊपर लेटी रेखा",
      "2. बीच से नीचे आकर बाईं ओर घुमावदार हुक",
    ],
    otherWords: [
      { en: "Joker", hi: "जोकर", icon: "🤡" },
      { en: "Juice", hi: "जूस / शरबत", icon: "🧃" },
      { en: "Jeep", hi: "जीप", icon: "🚙" },
      { en: "Jar", hi: "जार / डिब्बा", icon: "🏺" },
    ],
  },
  K: {
    letter: "K",
    wordEn: "Kite",
    wordHi: "काइट (पतंग)",
    icon: "🪁",
    phonics: "क (k) - जैसे Kite, Kangaroo, King",
    traceSteps: [
      "1. सीधी खड़ी रेखा",
      "2. दाईं ओर ऊपर से बीच में तिरछी रेखा",
      "3. बीच से नीचे दाईं ओर तिरछी रेखा",
    ],
    otherWords: [
      { en: "King", hi: "राजा", icon: "👑" },
      { en: "Kangaroo", hi: "कंगारू", icon: "🦘" },
      { en: "Key", hi: "चाबी", icon: "🔑" },
      { en: "Kettle", hi: "केतली", icon: "🫖" },
    ],
  },
  L: {
    letter: "L",
    wordEn: "Lion",
    wordHi: "लायन (शेर)",
    icon: "🦁",
    phonics: "ल (l) - जैसे Lion, Leaf, Lamp",
    traceSteps: [
      "1. ऊपर से नीचे सीधी खड़ी रेखा",
      "2. नीचे से दाईं ओर लेटी हुई रेखा",
    ],
    otherWords: [
      { en: "Leaf", hi: "पत्ती", icon: "🍃" },
      { en: "Lamp", hi: "दीपक / लैंप", icon: "🪔" },
      { en: "Lotus", hi: "कमल का फूल", icon: "🪷" },
      { en: "Lemon", hi: "नींबू", icon: "🍋" },
    ],
  },
  M: {
    letter: "M",
    wordEn: "Mango",
    wordHi: "मैंगो (आम)",
    icon: "🥭",
    phonics: "म (m) - जैसे Mango, Monkey, Moon",
    traceSteps: [
      "1. बाईं ओर सीधी खड़ी रेखा",
      "2. ऊपर से बीच तक नीचे तिरछी रेखा",
      "3. बीच से वापस ऊपर तिरछी रेखा",
      "4. दाईं ओर सीधी खड़ी रेखा",
    ],
    otherWords: [
      { en: "Monkey", hi: "बंदर", icon: "🐒" },
      { en: "Moon", hi: "चांद", icon: "🌙" },
      { en: "Milk", hi: "दूध", icon: "🥛" },
      { en: "Mouse", hi: "चूहा", icon: "🐭" },
    ],
  },
  N: {
    letter: "N",
    wordEn: "Nest",
    wordHi: "नेस्ट (घोंसला)",
    icon: "🪺",
    phonics: "न (n) - जैसे Nest, Net, Nut",
    traceSteps: [
      "1. बाईं ओर सीधी खड़ी रेखा",
      "2. ऊपर से नीचे दाईं ओर तिरछी रेखा",
      "3. नीचे से ऊपर सीधी खड़ी रेखा",
    ],
    otherWords: [
      { en: "Net", hi: "जाल", icon: "🕸️" },
      { en: "Nut", hi: "अखरोट / मेवे", icon: "🥜" },
      { en: "Nose", hi: "नाक", icon: "👃" },
      { en: "Needle", hi: "सुई", icon: "🪡" },
    ],
  },
  O: {
    letter: "O",
    wordEn: "Orange",
    wordHi: "ऑरेंज (संतरा)",
    icon: "🍊",
    phonics: "ओ / ऑ (o) - जैसे Orange, Owl, Ox",
    traceSteps: [
      "1. ऊपर से शुरू करके बाईं ओर पूरा गोल वृत्त बनाकर ऊपर वापस जोड़ें",
    ],
    otherWords: [
      { en: "Owl", hi: "उल्लू", icon: "🦉" },
      { en: "Ox", hi: "बैल", icon: "🐂" },
      { en: "Onion", hi: "प्याज", icon: "🧅" },
      { en: "Ostrich", hi: "शुतुरमुर्ग", icon: "🦤" },
    ],
  },
  P: {
    letter: "P",
    wordEn: "Parrot",
    wordHi: "पैरट (तोता)",
    icon: "🦜",
    phonics: "प (p) - जैसे Parrot, Pen, Peacock",
    traceSteps: [
      "1. सीधी खड़ी रेखा",
      "2. ऊपर दाईं ओर आधा गोला बनाएं",
    ],
    otherWords: [
      { en: "Pen", hi: "कलम", icon: "🖊️" },
      { en: "Peacock", hi: "मोर", icon: "🦚" },
      { en: "Pencil", hi: "पेंसिल", icon: "✏️" },
      { en: "Pineapple", hi: "अनानास", icon: "🍍" },
    ],
  },
  Q: {
    letter: "Q",
    wordEn: "Queen",
    wordHi: "क्वीन (रानी)",
    icon: "👸",
    phonics: "क्व (kw) - जैसे Queen, Quill, Quilt",
    traceSteps: [
      "1. O की तरह पूरा गोल बनाएं",
      "2. नीचे दाईं ओर एक छोटी तिरछी रेखा बाहर निकालें",
    ],
    otherWords: [
      { en: "Quill", hi: "पंख की कलम", icon: "🪶" },
      { en: "Quilt", hi: "रजाई", icon: "🛏️" },
      { en: "Queue", hi: "कतार / पंक्ति", icon: "🚶‍♂️" },
      { en: "Question", hi: "प्रश्न", icon: "❓" },
    ],
  },
  R: {
    letter: "R",
    wordEn: "Rose",
    wordHi: "रोज़ (गुलाब)",
    icon: "🌹",
    phonics: "र (r) - जैसे Rose, Rabbit, Ring",
    traceSteps: [
      "1. सीधी खड़ी रेखा",
      "2. ऊपर आधा गोला (P की तरह)",
      "3. बीच से नीचे दाईं ओर तिरछी रेखा",
    ],
    otherWords: [
      { en: "Rabbit", hi: "खरगोश", icon: "🐇" },
      { en: "Ring", hi: "अंगूठी", icon: "💍" },
      { en: "Rainbow", hi: "इंद्रधनुष", icon: "🌈" },
      { en: "Rocket", hi: "रॉकेट", icon: "🚀" },
    ],
  },
  S: {
    letter: "S",
    wordEn: "Sun",
    wordHi: "सन (सूरज)",
    icon: "☀️",
    phonics: "स (s) - जैसे Sun, Star, Ship",
    traceSteps: [
      "1. ऊपर से बाईं ओर छोटा वक्र घुमाएं",
      "2. बीच से दाईं ओर नीचे घुमावदार वक्र बनाएं (सांप की चाल)",
    ],
    otherWords: [
      { en: "Star", hi: "तारा", icon: "⭐" },
      { en: "Ship", hi: "पानी का जहाज", icon: "🚢" },
      { en: "Sunflower", hi: "सूरजमुखी", icon: "🌻" },
      { en: "Swan", hi: "हंस", icon: "🦢" },
    ],
  },
  T: {
    letter: "T",
    wordEn: "Tiger",
    wordHi: "टाइगर (बाघ)",
    icon: "🐯",
    phonics: "ट (t) - जैसे Tiger, Tree, Tomato",
    traceSteps: [
      "1. ऊपर एक सीधी लेटी रेखा (Sleeping Line)",
      "2. बीच से नीचे सीधी खड़ी रेखा (Standing Line)",
    ],
    otherWords: [
      { en: "Tree", hi: "पेड़", icon: "🌳" },
      { en: "Tomato", hi: "टमाटर", icon: "🍅" },
      { en: "Train", hi: "रेलगाड़ी", icon: "🚆" },
      { en: "Table", hi: "मेज", icon: "🪑" },
    ],
  },
  U: {
    letter: "U",
    wordEn: "Umbrella",
    wordHi: "अम्ब्रेला (छाता)",
    icon: "☂️",
    phonics: "अ / यू (u) - जैसे Umbrella, Uniform, Utensil",
    traceSteps: [
      "1. ऊपर से नीचे आकर गोल घुमाते हुए वापस ऊपर जाएं (U Shape)",
    ],
    otherWords: [
      { en: "Uniform", hi: "वर्दी / गणवेश", icon: "🥋" },
      { en: "Urn", hi: "कलश", icon: "🏺" },
      { en: "Unicorn", hi: "जादुई घोड़ा", icon: "🦄" },
      { en: "Uncle", hi: "चाचाजी", icon: "👨" },
    ],
  },
  V: {
    letter: "V",
    wordEn: "Van",
    wordHi: "वैन (गाड़ी)",
    icon: "🚐",
    phonics: "व (v) - जैसे Van, Vase, Violin",
    traceSteps: [
      "1. ऊपर से नीचे तिरछी रेखा",
      "2. नीचे के बिंदु से वापस ऊपर दाईं ओर तिरछी रेखा",
    ],
    otherWords: [
      { en: "Vase", hi: "फूलदान", icon: "🏺" },
      { en: "Violin", hi: "वायलिन", icon: "🎻" },
      { en: "Vegetables", hi: "सब्जियां", icon: "🥦" },
      { en: "Vulture", hi: "गिद्ध", icon: "🦅" },
    ],
  },
  W: {
    letter: "W",
    wordEn: "Watch",
    wordHi: "वॉच (घड़ी)",
    icon: "⌚",
    phonics: "व (w) - जैसे Watch, Water, Well",
    traceSteps: [
      "1. दो बार V बनाएं: नीचे, ऊपर, नीचे, ऊपर",
    ],
    otherWords: [
      { en: "Watermelon", hi: "तरबूज", icon: "🍉" },
      { en: "Well", hi: "कुआं", icon: "🪣" },
      { en: "Wheel", hi: "पहिया", icon: "🛞" },
      { en: "Whale", hi: "व्हेल मछली", icon: "🐋" },
    ],
  },
  X: {
    letter: "X",
    wordEn: "Xylophone",
    wordHi: "जाइलोफोन (जलतरंग)",
    icon: "🎵",
    phonics: "क्स (ks) - जैसे Xylophone, X-ray, Xmas Tree",
    traceSteps: [
      "1. बाएं से दाएं तिरछी रेखा",
      "2. दाएं से बाएं काटती हुई तिरछी रेखा",
    ],
    otherWords: [
      { en: "X-ray", hi: "एक्स-रे", icon: "🩻" },
      { en: "Xmas Tree", hi: "क्रिसमस का पेड़", icon: "🎄" },
      { en: "Xiphias", hi: "तलवार मछली", icon: "🐟" },
    ],
  },
  Y: {
    letter: "Y",
    wordEn: "Yak",
    wordHi: "याक (पहाड़ी बैल)",
    icon: "🐂",
    phonics: "य (y) - जैसे Yak, Yo-yo, Yellow",
    traceSteps: [
      "1. ऊपर छोटा V बनाएं",
      "2. V के निचले बिंदु से नीचे सीधी खड़ी रेखा",
    ],
    otherWords: [
      { en: "Yo-yo", hi: "यो-यो खिलौना", icon: "🪀" },
      { en: "Yacht", hi: "नाव / बजरा", icon: "⛵" },
      { en: "Yolk", hi: "अंडे की जर्दी", icon: "🍳" },
    ],
  },
  Z: {
    letter: "Z",
    wordEn: "Zebra",
    wordHi: "ज़ेबरा (चित्तीदार घोड़ा)",
    icon: "🦓",
    phonics: "ज़ (z) - जैसे Zebra, Zoo, Zip",
    traceSteps: [
      "1. ऊपर लेटी रेखा (Sleeping Line)",
      "2. नीचे बाईं ओर तिरछी रेखा",
      "3. नीचे लेटी रेखा",
    ],
    otherWords: [
      { en: "Zoo", hi: "चिड़ियाघर", icon: "🦒" },
      { en: "Zip", hi: "चेन / ज़िप", icon: "🤐" },
      { en: "Zero", hi: "शून्य", icon: "0️⃣" },
    ],
  },
};

// Hindi Swar Data
export const HINDI_SWAR_DATA = [
  { char: "अ", word: "अनार", icon: "🍎", audio: "अ से अनार", details: "अ से अनार, मीठे लाल इसके दाने, सब खाएं बड़े चाव से।" },
  { char: "आ", word: "आम", icon: "🥭", audio: "आ से आम", details: "आ से आम, फलों का राजा, मीठा-मीठा रसीला ताजा।" },
  { char: "इ", word: "इमली", icon: "🍬", audio: "इ से इमली", details: "इ से इमली, खट्टी-मीठी, खाने में बड़ी स्वादिष्ट।" },
  { char: "ई", word: "ईख", icon: "🌾", audio: "ई से ईख", details: "ई से ईख, गन्ने का रस मीठा, इससे बने गुड़ और चीनी।" },
  { char: "उ", word: "उल्लू", icon: "🦉", audio: "उ से उल्लू", details: "उ से उल्लू, रात को जागे, दिन निकले तो डर कर भागे।" },
  { char: "ऊ", word: "ऊन", icon: "🧶", audio: "ऊ से ऊन", details: "ऊ से ऊन, भेड़ से मिलती, सर्दी में स्वेटर बनाती।" },
  { char: "ऋ", word: "ऋषि", icon: "🧘‍♂️", audio: "ऋ से ऋषि", details: "ऋ से ऋषि, वन में रहते, ज्ञान की बातें सबको कहते।" },
  { char: "ए", word: "एड़ी", icon: "🦶", audio: "ए से एड़ी", details: "ए से एड़ी, पैर के पीछे, इस पर पूरा शरीर टिके।" },
  { char: "ऐ", word: "ऐनक", icon: "👓", audio: "ऐ से ऐनक", details: "ऐ से ऐनक, दादाजी लगाएं, धुंधला-धुंधला साफ दिखाएं।" },
  { char: "ओ", word: "ओखली", icon: "🥣", audio: "ओ से ओखली", details: "ओ से ओखली, पत्थर की भारी, धान कूटने की तैयारी।" },
  { char: "औ", word: "औरत", icon: "👩", audio: "औ से औरत", details: "औ से औरत, ममता की मूरत, घर को सजाए इसकी सूरत।" },
  { char: "अं", word: "अंगूर", icon: "🍇", audio: "अं से अंगूर", details: "अं से अंगूर, गुच्छों में लटके, मीठे-मीठे सबको भटके।" },
  { char: "अः", word: "अः खाली", icon: "👏", audio: "अः खाली, बच्चों बजाओ ताली", details: "अः खाली, बच्चों बजाओ ताली, पूरी हो गई स्वर की थाली!" },
];

// Hindi Vyanjan Data
export const HINDI_VYANJAN_DATA = [
  { char: "क", word: "कबूतर", icon: "🕊️" },
  { char: "ख", word: "खरगोश", icon: "🐇" },
  { char: "ग", word: "गमला", icon: "🪴" },
  { char: "घ", word: "घड़ी", icon: "⏰" },
  { char: "ङ", word: "ङ खाली", icon: "✨" },
  { char: "च", word: "चम्मच", icon: "🥄" },
  { char: "छ", word: "छाता", icon: "☂️" },
  { char: "ज", word: "जहाज", icon: "🚢" },
  { char: "झ", word: "झंडा", icon: "🇮🇳" },
  { char: "ञ", word: "ञ खाली", icon: "✨" },
  { char: "ट", word: "टमाटर", icon: "🍅" },
  { char: "ठ", word: "ठठेरा", icon: "🔨" },
  { char: "ड", word: "डमरू", icon: "🪘" },
  { char: "ढ", word: "ढक्कन", icon: "🫕" },
  { char: "ण", word: "ण खाली", icon: "✨" },
  { char: "त", word: "तरबूज", icon: "🍉" },
  { char: "थ", word: "थर्मस", icon: "🍶" },
  { char: "द", word: "दवात", icon: "✒️" },
  { char: "ध", word: "धनुष", icon: "🏹" },
  { char: "न", word: "नल", icon: "🚰" },
  { char: "प", word: "पतंग", icon: "🪁" },
  { char: "फ", word: "फल", icon: "🍎" },
  { char: "ब", word: "बत्तख", icon: "🦆" },
  { char: "भ", word: "भालू", icon: "🐻" },
  { char: "म", word: "मछली", icon: "🐟" },
  { char: "य", word: "यज्ञ", icon: "🔥" },
  { char: "र", word: "रथ", icon: "🛞" },
  { char: "ल", word: "लट्टू", icon: "🪀" },
  { char: "व", word: "वक", icon: "🦩" },
  { char: "श", word: "शलजम", icon: "🧅" },
  { char: "ष", word: "षटकोण", icon: "⬡" },
  { char: "स", word: "सपेरा", icon: "🐍" },
  { char: "ह", word: "हाथी", icon: "🐘" },
  { char: "क्ष", word: "क्षत्रिय", icon: "⚔️" },
  { char: "त्र", word: "त्रिशूल", icon: "🔱" },
  { char: "ज्ञ", word: "ज्ञानी", icon: "🧑‍🏫" },
];

// Helper to calculate total pages: exactly 720 pages!
export const TOTAL_PAGES = 720;

// Resolve detailed page content dynamically for ANY page from 1 to 720
export function getBalVikasPageData(pageNum: number): BalVikasPage {
  const clampPage = Math.max(1, Math.min(TOTAL_PAGES, pageNum));

  // PAGE 1: COVER
  if (clampPage === 1) {
    return {
      pageNumber: 1,
      partNumber: 0,
      partTitle: "प्रस्तावना",
      chapterNumber: 0,
      chapterTitle: "कवर पृष्ठ (Front Cover)",
      title: "बाल विकास: सम्पूर्ण डिजिटल अध्ययन पुस्तिका",
      subtitle: "0-5 वर्ष के बच्चों के लिए A to Z, वर्णमाला, गिनती 1-100, पहाड़ा 2-40, कहानियां व होमवर्क",
      type: "cover",
      audioText: "आई ओ आई एस प्लेटफॉर्म द्वारा प्रस्तुत बाल विकास संपूर्ण डिजिटल अध्ययन पुस्तिका में आपका स्वागत है!",
      heroCharacter: "📘",
    };
  }

  // PAGE 2 to 5: TABLE OF CONTENTS
  if (clampPage >= 2 && clampPage <= 5) {
    return {
      pageNumber: clampPage,
      partNumber: 0,
      partTitle: "प्रस्तावना",
      chapterNumber: 0,
      chapterTitle: `विस्तृत विषय सूची (पृष्ठ भाग ${clampPage - 1})`,
      title: "विस्तृत विषय सूची (Table of Contents)",
      subtitle: "720 पृष्ठों की क्रमबद्ध एवं सुव्यवस्थित पाठ्यक्रम अनुक्रमणिका",
      type: "index",
      audioText: "यह बाल विकास अध्ययन पुस्तिका की संपूर्ण विषय सूची है। आप किसी भी अध्याय या पृष्ठ पर सीधे जा सकते हैं।",
      heroCharacter: "📋",
    };
  }

  // PAGE 6 to 57: CHAPTER 1 - ENGLISH ALPHABET A TO Z (52 pages: 2 pages per letter)
  if (clampPage >= 6 && clampPage <= 57) {
    const letterIndex = Math.floor((clampPage - 6) / 2);
    const isTracePage = (clampPage - 6) % 2 === 1;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letter = alphabet[letterIndex] || "A";
    const info = ENGLISH_LETTERS_DATA[letter] || ENGLISH_LETTERS_DATA["A"];

    if (!isTracePage) {
      return {
        pageNumber: clampPage,
        partNumber: 1,
        partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
        chapterNumber: 1,
        chapterTitle: `अंग्रेजी वर्णमाला: ${letter} for ${info.wordEn}`,
        title: `${letter} for ${info.wordEn} (${info.wordHi})`,
        subtitle: `अक्षर पहचान, फोनिक्स उच्चारण एवं शब्द ज्ञान`,
        type: "alphabet_intro",
        audioText: `${letter} for ${info.wordEn}! ${info.wordHi}. ${info.phonics}`,
        heroCharacter: letter,
        heroWord: info.wordEn,
        heroWordHi: info.wordHi,
        heroImage: letter === "A" ? "/src/assets/images/a_for_apple_art_1789232283132.jpg" : undefined,
        examples: info.otherWords.map((w) => ({ text: w.en, sub: w.hi, icon: w.icon })),
        homeworkTask: `नीचे दिए गए ब्रश से ${letter} अक्षर को सुंदर रंगों से भरें और फोनिक्स उच्चारण दोहराएं।`,
      };
    } else {
      return {
        pageNumber: clampPage,
        partNumber: 1,
        partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
        chapterNumber: 1,
        chapterTitle: `अक्षर ${letter} लेखन व ट्रेसिंग वर्कबुक`,
        title: `अक्षर '${letter}' का डिजिटल ट्रेसिंग अभ्यास (Step-by-Step Tracing)`,
        subtitle: `बिंदुओं को जोड़कर ${letter} और ${letter.toLowerCase()} बनाना सीखें`,
        type: "alphabet_trace",
        audioText: `अब अपनी उंगली या पेन से स्क्रीन पर अक्षर ${letter} को ट्रेस करें।`,
        heroCharacter: letter,
        traceItems: [letter, letter, letter, letter.toLowerCase(), letter.toLowerCase()],
        lines: info.traceSteps,
        homeworkTask: `नीचे दिए गए डिब्बों में बिंदु वाले '${letter}' पर उंगली चलाकर पूरा करें और खाली डिब्बों में खुद लिखें।`,
      };
    }
  }

  // PAGE 58 to 83: CHAPTER 2 - HINDI SWAR (अ से अः - 13 swar, 2 pages each = 26 pages)
  if (clampPage >= 58 && clampPage <= 83) {
    const swarIndex = Math.floor((clampPage - 58) / 2);
    const isTracePage = (clampPage - 58) % 2 === 1;
    const swar = HINDI_SWAR_DATA[swarIndex] || HINDI_SWAR_DATA[0];

    if (!isTracePage) {
      return {
        pageNumber: clampPage,
        partNumber: 1,
        partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
        chapterNumber: 2,
        chapterTitle: `हिंदी स्वर: '${swar.char}' से ${swar.word}`,
        title: `${swar.char} से ${swar.word} ${swar.icon}`,
        subtitle: `स्वर पहचान, स्पष्ट उच्चारण एवं सचित्र व्याख्या`,
        type: "swar_intro",
        audioText: `${swar.audio}! ${swar.details}`,
        heroCharacter: swar.char,
        heroWord: swar.word,
        heroWordHi: swar.char,
        lines: [swar.details],
        examples: [
          { text: `${swar.char} से ${swar.word}`, sub: "मुख्य शब्द", icon: swar.icon },
          { text: "स्वर ध्वनि", sub: "स्पष्ट कंठ उच्चारण", icon: "🗣️" },
        ],
        homeworkTask: `अक्षर '${swar.char}' का 5 बार बोलकर उच्चारण करें और चित्र को सुंदर रंगों से सजाएं।`,
      };
    } else {
      return {
        pageNumber: clampPage,
        partNumber: 1,
        partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
        chapterNumber: 2,
        chapterTitle: `स्वर '${swar.char}' लेखन अभ्यास`,
        title: `स्वर '${swar.char}' का सुलेख व बिंदु मिलान (Tracing Worksheet)`,
        subtitle: `बिंदुओं को मिलाकर स्वर '${swar.char}' लिखना सीखें`,
        type: "swar_trace",
        audioText: `स्क्रीन पर उंगली चलाकर स्वर ${swar.char} लिखें और 'चेक करें' दबाएं।`,
        heroCharacter: swar.char,
        traceItems: [swar.char, swar.char, swar.char, swar.char, swar.char],
        lines: [
          "1. ऊपर से पहला वक्र बनाएं",
          "2. दूसरा वक्र नीचे तक ले जाएं",
          "3. बीच में छोटी लेटी रेखा खींचें",
          "4. सीधी खड़ी रेखा और ऊपर शिरोरेखा लगाएं",
        ],
        homeworkTask: `अभ्यास कार्य: डिब्बों में दिए गए बिंदु वाले '${swar.char}' को पूरा करें।`,
      };
    }
  }

  // PAGE 84 to 155: CHAPTER 3 - HINDI VYANJAN (क से ज्ञ - 36 vyanjan, 2 pages each = 72 pages)
  if (clampPage >= 84 && clampPage <= 155) {
    const vyanjanIndex = Math.floor((clampPage - 84) / 2);
    const isTracePage = (clampPage - 84) % 2 === 1;
    const v = HINDI_VYANJAN_DATA[vyanjanIndex] || HINDI_VYANJAN_DATA[0];

    if (!isTracePage) {
      return {
        pageNumber: clampPage,
        partNumber: 1,
        partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
        chapterNumber: 3,
        chapterTitle: `हिंदी व्यंजन: '${v.char}' से ${v.word}`,
        title: `${v.char} से ${v.word} ${v.icon}`,
        subtitle: `व्यंजन पहचान, उच्चारण एवं सचित्र ज्ञान`,
        type: "vyanjan_intro",
        audioText: `${v.char} से ${v.word}! बोलें ${v.char}`,
        heroCharacter: v.char,
        heroWord: v.word,
        heroWordHi: v.char,
        examples: [
          { text: `${v.char} से ${v.word}`, sub: "पहचान शब्द", icon: v.icon },
          { text: `व्यंजन वर्ण`, sub: "हिंदी वर्णमाला", icon: "📖" },
        ],
        homeworkTask: `अक्षर '${v.char}' को याद करें और दिए गए कैनवास पर अपनी उंगली से बड़ा '${v.char}' लिखें।`,
      };
    } else {
      return {
        pageNumber: clampPage,
        partNumber: 1,
        partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
        chapterNumber: 3,
        chapterTitle: `व्यंजन '${v.char}' लेखन अभ्यास`,
        title: `व्यंजन '${v.char}' का सुलेख व ट्रेसिंग अभ्यास`,
        subtitle: `कदम-दर-कदम व्यंजन '${v.char}' बनाना सीखें`,
        type: "vyanjan_trace",
        audioText: `व्यंजन ${v.char} को ट्रेस करें और अपना होमवर्क पूरा करें।`,
        heroCharacter: v.char,
        traceItems: [v.char, v.char, v.char, v.char, v.char],
        lines: [
          "1. सीधी खड़ी रेखा खींचें",
          "2. बाईं ओर गोल बनाएं",
          "3. दाईं ओर मुड़ा हुआ हुक बनाएं",
          "4. ऊपर सीधी शिरोरेखा लगाएं",
        ],
        homeworkTask: `वर्कबुक कार्य: डिब्बों में बिंदु वाले '${v.char}' को पूरा करें और फिर खाली डिब्बों में लिखें।`,
      };
    }
  }

  // PAGE 156 to 185: CHAPTER 4 - BARAKHADI (30 pages)
  if (clampPage >= 156 && clampPage <= 185) {
    const bIndex = clampPage - 156;
    const consList = ["क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह"];
    const cons = consList[bIndex] || "क";
    const matras = [
      `${cons}`,
      `${cons}ा`,
      `${cons}ि`,
      `${cons}ी`,
      `${cons}ु`,
      `${cons}ू`,
      `${cons}े`,
      `${cons}ै`,
      `${cons}ो`,
      `${cons}ौ`,
      `${cons}ं`,
      `${cons}ः`,
    ];

    return {
      pageNumber: clampPage,
      partNumber: 1,
      partTitle: "भाग 1: भाषा एवं वर्णमाला ज्ञान",
      chapterNumber: 4,
      chapterTitle: `'${cons}' की संपूर्ण बारहखड़ी (Barakhadi)`,
      title: `'${cons}' की बारहखड़ी एवं मात्रा ज्ञान`,
      subtitle: `स्वर मात्राओं के योग से '${cons}' के सभी 12 रूपों का उच्चारण व लेखन`,
      type: "barakhadi",
      audioText: `${cons} की बारहखड़ी: ${matras.join(", ")}`,
      heroCharacter: cons,
      traceItems: matras,
      lines: [
        `अ की मात्रा: ${cons} | आ की मात्रा: ${cons}ा`,
        `इ की मात्रा: ${cons}ि | ई की मात्रा: ${cons}ी`,
        `उ की मात्रा: ${cons}ु | ऊ की मात्रा: ${cons}ू`,
        `ए की मात्रा: ${cons}े | ऐ की मात्रा: ${cons}ै`,
        `ओ की मात्रा: ${cons}ो | औ की मात्रा: ${cons}ौ`,
        `अं की मात्रा: ${cons}ं | अः की मात्रा: ${cons}ः`,
      ],
      homeworkTask: `अपनी कॉपी/स्क्रीन पर '${cons}' की पूरी बारहखड़ी लिखकर उच्चारण दोहराएं।`,
    };
  }

  // PAGE 186 to 225: CHAPTER 5 - WORD FORMATION (40 pages)
  if (clampPage >= 186 && clampPage <= 225) {
    const wIndex = clampPage - 186;
    const wordTopics = [
      { t: "दो अक्षर वाले शब्द: क + ल = कल", words: ["क + ल = कल", "घ + र = घर", "ब + स = बस", "ज + ल = जल", "फ + ल = फल"], icon: "🏠" },
      { t: "दो अक्षर वाले शब्द: न + ल = नल", words: ["न + ल = नल", "ह + ल = हल", "म + ग = मग", "ज + ग = जग", "र + थ = रथ"], icon: "🚰" },
      { t: "तीन अक्षर वाले शब्द: क + म + ल = कमल", words: ["क + म + ल = कमल", "म + ट + र = मटर", "स + ड़ + क = सड़क", "न + य + न = नयन"], icon: "🪷" },
      { t: "तीन अक्षर वाले शब्द: ब + ट + न = बटन", words: ["ब + ट + न = बटन", "क + ल + म = कलम", "भ + ग + त = भगत", "श + ह + र = शहर"], icon: "🔘" },
      { t: "चार अक्षर वाले शब्द: अ + च + क + न = अचकन", words: ["अचकन", "बरगद", "शरबत", "कसरत", "थर्मस"], icon: "🌳" },
      { t: "चार अक्षर वाले शब्द: ट + म + ट + म = टमटम", words: ["टमटम", "शलगम", "उपवन", "खटमल", "पनघट"], icon: "🛺" },
      { t: "आ (ा) की मात्रा वाले शब्द: आ + म = आम", words: ["आम", "काम", "नाम", "दाम", "शाम"], icon: "🥭" },
      { t: "आ (ा) की मात्रा वाले शब्द: र + ा + ज + ा = राजा", words: ["राजा", "बाजा", "माला", "ताला", "काला"], icon: "👑" },
      { t: "इ (ि) की मात्रा वाले शब्द: क + िता + ब = किताब", words: ["किताब", "हिरन", "चिड़िया", "डाकिया", "पहिया"], icon: "📖" },
      { t: "ई (ी) की मात्रा वाले शब्द: त + ि + त + ल + ी = तितली", words: ["तितली", "हाथी", "पानी", "रानी", "नानी"], icon: "🦋" },
      { t: "उ (ु) की मात्रा वाले शब्द: ग + ु + ल + ा + ब = गुलाब", words: ["गुलाब", "साबुन", "धनुष", "बुलबुल", "कछुआ"], icon: "🌹" },
      { t: "ऊ (ू) की मात्रा वाले शब्द: स + ू + र + ज = सूरज", words: ["सूरज", "भालू", "फूल", "दूध", "तराजू"], icon: "☀️" },
      { t: "ए (े) की मात्रा वाले शब्द: श + े + र = शेर", words: ["शेर", "पेड़", "सेब", "केला", "रेल"], icon: "🦁" },
      { t: "ऐ (ै) की मात्रा वाले शब्द: प + ै + र = पैर", words: ["पैर", "बैल", "सैनिक", "पैसा", "थैला"], icon: "🐂" },
      { t: "ओ (ो) की मात्रा वाले शब्द: म + ो + र = मोर", words: ["मोर", "तोता", "कोयल", "ढोलक", "समोसा"], icon: "🦚" },
      { t: "औ (ौ) की मात्रा वाले शब्द: न + ौ + क + ा = नौका", words: ["नौका", "पौधा", "खिलौना", "कौआ", "हथौड़ा"], icon: "⛵" },
    ];
    const item = wordTopics[wIndex % wordTopics.length];

    return {
      pageNumber: clampPage,
      partNumber: 2,
      partTitle: "भाग 2: शब्द रचना, बाल कविताएं एवं कहानियां",
      chapterNumber: 5,
      chapterTitle: `शब्द रचना: ${item.t}`,
      title: item.t,
      subtitle: `अक्षरों को जोड़कर नए शब्द बनाना और पढ़ना सीखें`,
      type: "words",
      audioText: `${item.t}. शब्द पढ़ें: ${item.words.join(", ")}`,
      heroCharacter: item.icon,
      examples: item.words.map((w) => ({ text: w, icon: "✏️" })),
      homeworkTask: `इन शब्दों को अपनी उंगली से स्क्रीन पर लिखकर 3 बार जोर से बोलें।`,
    };
  }

  // PAGE 226 to 260: CHAPTER 6 - POEMS & RHYMES (35 pages)
  if (clampPage >= 226 && clampPage <= 260) {
    const pIndex = clampPage - 226;
    const poems = [
      {
        title: "चंदा मामा दूर के",
        lines: [
          "चंदा मामा दूर के, पुए पकाएं बूर के।",
          "आप खाएं थाली में, मुन्ने को दें प्याली में।",
          "प्याली गई टूट, मुन्ना गया रूठ!",
          "लाएंगे नई प्यालियां, बजा बजा के तालियां!",
        ],
        icon: "🌙",
      },
      {
        title: "मछली जल की रानी है",
        lines: [
          "मछली जल की रानी है, जीवन उसका पानी है।",
          "हाथ लगाओ तो डर जाएगी, बाहर निकालो तो मर जाएगी!",
          "पानी में डालो तैर जाएगी, दाना डालो खा जाएगी!",
        ],
        icon: "🐟",
      },
      {
        title: "एक दो कभी न रो",
        lines: [
          "एक, दो — कभी न रो!",
          "तीन, चार — करो प्यार!",
          "पाँच, छह — मिलकर रह!",
          "सात, आठ — पढ़ ले पाठ!",
          "नौ, दस — गिनती बस!",
        ],
        icon: "🔢",
      },
      {
        title: "तितली उड़ी बस पर चढ़ी",
        lines: [
          "तितली उड़ी बस पर चढ़ी, सीट न मिली तो रोने लगी।",
          "ड्राइवर ने बोला आजा मेरे पास, तितली बोली ना बाबा ना!",
          "मेरा घर है पास, मैं जाऊंगी अपने घर!",
        ],
        icon: "🦋",
      },
      {
        title: "नानी तेरी मोरनी को मोर ले गए",
        lines: [
          "नानी तेरी मोरनी को मोर ले गए,",
          "बाकी जो बचा था काले चोर ले गए!",
          "खाके पीके मोटे होके चोर बैठे रेल में,",
          "चोरों वाला डिब्बा पहुंचा सीधा जेल में!",
        ],
        icon: "🦚",
      },
      {
        title: "Twinkle Twinkle Little Star",
        lines: [
          "Twinkle, twinkle, little star,",
          "How I wonder what you are!",
          "Up above the world so high,",
          "Like a diamond in the sky!",
        ],
        icon: "⭐",
      },
      {
        title: "Johny Johny Yes Papa",
        lines: [
          "Johny, Johny, Yes, Papa?",
          "Eating sugar? No, Papa!",
          "Telling lies? No, Papa!",
          "Open your mouth, Ha! Ha! Ha!",
        ],
        icon: "👦",
      },
    ];
    const p = poems[pIndex % poems.length];

    return {
      pageNumber: clampPage,
      partNumber: 2,
      partTitle: "भाग 2: शब्द रचना, बाल कविताएं एवं कहानियां",
      chapterNumber: 6,
      chapterTitle: `बाल कविता: ${p.title}`,
      title: `कविता: ${p.title} ${p.icon}`,
      subtitle: `सस्वर गायन, लयबद्ध आनंद एवं बाल अभिव्यक्ति`,
      type: "poem",
      audioText: `${p.title}. ${p.lines.join(" ")}`,
      heroCharacter: p.icon,
      lines: p.lines,
      homeworkTask: `इस कविता को 2 बार गाकर सुनाएं और नीचे अपने मनपसंद रंग भरें!`,
    };
  }

  // PAGE 261 to 295: CHAPTER 7 - MORAL STORIES (35 pages)
  if (clampPage >= 261 && clampPage <= 295) {
    const sIndex = clampPage - 261;
    const stories = [
      {
        title: "प्यासा कौआ (The Thirsty Crow)",
        lines: [
          "एक कौए को बहुत तेज प्यास लगी थी। वह पानी की तलाश में इधर-उधर उड़ रहा था।",
          "उसे एक बगीचे में घड़ा दिखा, परंतु घड़े में पानी बहुत नीचे था और कौए की चोंच वहाँ तक नहीं पहुँच पा रही थी।",
          "कौए ने अपनी बुद्धि लगाई। उसने पास पड़े कंकड़ों को एक-एक करके अपनी चोंच से घड़े में डालना शुरू किया।",
          "कंकड़ डालने से पानी धीरे-धीरे ऊपर आ गया। कौए ने जी भरकर पानी पिया और खुशी-खुशी उड़ गया।",
          "सीख (Moral): जहाँ चाह, वहाँ राह। कठिनाई में समझदारी और मेहनत से रास्ता निकल आता है।",
        ],
        icon: "🐦",
      },
      {
        title: "शेर और चूहा (The Lion & the Mouse)",
        lines: [
          "एक जंगल में एक शेर सो रहा था। तभी एक छोटा चूहा शेर के ऊपर कूदने लगा। शेर जाग गया और गुस्से में चूहे को पकड़ लिया।",
          "चूहे ने विनती की- 'महाराज, मुझे छोड़ दीजिए! कभी मैं भी आपकी मदद करूंगा।' शेर हंस पड़ा और दया करके उसे छोड़ दिया।",
          "कुछ दिन बाद, शेर एक शिकारी के जाल में फंस गया और जोर-जोर से दहाड़ने लगा।",
          "चूहे ने शेर की दहाड़ सुनी और दौड़कर आया। उसने अपने नुकीले दांतों से जाल की रस्सियां काट दीं और शेर को आजाद कर दिया।",
          "सीख (Moral): कोई भी छोटा या कमजोर नहीं होता। हर किसी की अपनी ताकत होती है और भलाई का फल भलाई होता है।",
        ],
        icon: "🦁",
      },
      {
        title: "खरगोश और कछुआ (The Tortoise & Hare)",
        lines: [
          "खरगोश को अपनी तेज दौड़ पर बहुत घमंड था। उसने कछुए का मजाक उड़ाया और दौड़ की चुनौती दी।",
          "दौड़ शुरू हुई। खरगोश बहुत आगे निकल गया और सोचा कछुआ तो बहुत पीछे है, थोड़ा सो लेता हूँ।",
          "कछुआ बिना रुके धीरे-धीरे अपनी चाल से चलता रहा। वह खरगोश से आगे निकल गया।",
          "जब खरगोश की आँख खुली, कछुआ जीत की रेखा पार कर चुका था।",
          "सीख (Moral): लगातार मेहनत करने वाला हमेशा जीतता है। कभी घमंड नहीं करना चाहिए।",
        ],
        icon: "🐢",
      },
    ];
    const st = stories[sIndex % stories.length];

    return {
      pageNumber: clampPage,
      partNumber: 2,
      partTitle: "भाग 2: शब्द रचना, बाल कविताएं एवं कहानियां",
      chapterNumber: 7,
      chapterTitle: `प्रेरक कहानी: ${st.title}`,
      title: `कहानी: ${st.title} ${st.icon}`,
      subtitle: `नैतिक मूल्यों व अच्छे संस्कारों से परिपूर्ण सचित्र कहानी`,
      type: "story",
      audioText: `${st.title}. ${st.lines.join(" ")}`,
      heroCharacter: st.icon,
      lines: st.lines,
      homeworkTask: `इस कहानी से आपने क्या सीखा? अपने माता-पिता को कहानी सुनाएं।`,
    };
  }

  // PAGE 296 to 345: CHAPTER 8 - COUNTING 1 TO 50 (50 pages: 1 page per number)
  if (clampPage >= 296 && clampPage <= 345) {
    const num = clampPage - 296 + 1;
    const hindiWords = [
      "", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ", "दस",
      "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अट्ठारह", "उन्नीस", "बीस",
      "इक्कीस", "बाईस", "तेईस", "चौबीस", "पच्चीस", "छब्बीस", "सत्ताईस", "अट्ठाइस", "उनतीस", "तीस",
      "इकतीस", "बत्तीस", "तैंतीस", "चौंतीस", "पैंतीस", "छत्तीस", "सैंतीस", "अड़तीस", "उनतालीस", "चालीस",
      "इकतालीस", "बयालीस", "तैंतालीस", "चौवालीस", "पैंतालीस", "छियालीस", "सैंतालीस", "अड़तालीस", "उनचास", "पचास"
    ];
    const englishWords = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty",
      "Twenty-One", "Twenty-Two", "Twenty-Three", "Twenty-Four", "Twenty-Five", "Twenty-Six", "Twenty-Seven", "Twenty-Eight", "Twenty-Nine", "Thirty",
      "Thirty-One", "Thirty-Two", "Thirty-Three", "Thirty-Four", "Thirty-Five", "Thirty-Six", "Thirty-Seven", "Thirty-Eight", "Thirty-Nine", "Forty",
      "Forty-One", "Forty-Two", "Forty-Three", "Forty-Four", "Forty-Five", "Forty-Six", "Forty-Seven", "Forty-Eight", "Forty-Nine", "Fifty"
    ];
    const hiWord = hindiWords[num] || String(num);
    const enWord = englishWords[num] || String(num);
    const icons = ["🎈", "🍎", "⭐", "⚽", "🚗", "🧸", "🍌", "🍓", "🧁", "🌸"];
    const chosenIcon = icons[num % icons.length];

    return {
      pageNumber: clampPage,
      partNumber: 3,
      partTitle: "भाग 3: गणित एवं अंक ज्ञान",
      chapterNumber: 8,
      chapterTitle: `संख्या ${num}: ${hiWord} (${enWord})`,
      title: `संख्या ${num} - ${hiWord} (${enWord}) ${chosenIcon}`,
      subtitle: `सचित्र गणना, अंक पहचान एवं लेखन अभ्यास`,
      type: "counting_item",
      audioText: `संख्या ${num}! हिंदी में ${hiWord}, अंग्रेजी में ${enWord}!`,
      heroCharacter: String(num),
      heroWord: enWord,
      heroWordHi: hiWord,
      traceItems: [String(num), String(num), String(num), String(num)],
      homeworkTask: `नीचे दिए गए ${num} चित्रों को गिनें और अंक ${num} को डिब्बों में सुंदर बनाएं।`,
    };
  }

  // PAGE 346 to 395: CHAPTER 9 - NUMBERS 51 TO 100 (50 pages)
  if (clampPage >= 346 && clampPage <= 395) {
    const num = clampPage - 346 + 51;
    return {
      pageNumber: clampPage,
      partNumber: 3,
      partTitle: "भाग 3: गणित एवं अंक ज्ञान",
      chapterNumber: 9,
      chapterTitle: `संख्या ${num} (गिनती 51 से 100)`,
      title: `अंक ${num} - संख्या ज्ञान एवं अनुक्रम`,
      subtitle: `संख्या क्रम, पूर्ववर्ती एवं उत्तरवर्ती अंक समझ`,
      type: "counting_advanced",
      audioText: `संख्या ${num}! ${num - 1} के बाद आता है ${num}`,
      heroCharacter: String(num),
      lines: [
        `अंक: ${num}`,
        `पिछला अंक (Before): ${num - 1}`,
        `अगला अंक (After): ${num + 1}`,
        `दहाई व इकाई: ${Math.floor(num / 10)} दहाई + ${num % 10} इकाई`,
      ],
      traceItems: [String(num), String(num), String(num)],
      homeworkTask: `अंक ${num} को 4 बार लिखें और बताएं कि ${num} से पहले क्या आता है।`,
    };
  }

  // PAGE 396 to 415: CHAPTER 10 - TABLES 2 TO 20 (20 pages: 1 page per table)
  if (clampPage >= 396 && clampPage <= 415) {
    const tableNum = clampPage - 396 + 2; // 2 to 21
    const tableRows = [];
    for (let i = 1; i <= 10; i++) {
      tableRows.push(`${tableNum} × ${i} = ${tableNum * i}`);
    }

    return {
      pageNumber: clampPage,
      partNumber: 3,
      partTitle: "भाग 3: गणित एवं अंक ज्ञान",
      chapterNumber: 10,
      chapterTitle: `${tableNum} का पहाड़ा (Table of ${tableNum})`,
      title: `${tableNum} का संपूर्ण पहाड़ा (Multiplication Table)`,
      subtitle: `सचित्र विधि से याद करें और उच्चारण दोहराएं`,
      type: "table",
      audioText: `${tableNum} का पहाड़ा: ${tableRows.slice(0, 5).join(", ")}`,
      heroCharacter: `${tableNum}`,
      lines: tableRows,
      homeworkTask: `${tableNum} का पहाड़ा बोलकर याद करें और नीचे दी गई खाली तालिका को भरें।`,
    };
  }

  // PAGE 416 to 435: CHAPTER 11 - TABLES 21 TO 40 (20 pages: 1 page per table)
  if (clampPage >= 416 && clampPage <= 435) {
    const tableNum = clampPage - 416 + 21; // 21 to 40
    const tableRows = [];
    for (let i = 1; i <= 10; i++) {
      tableRows.push(`${tableNum} × ${i} = ${tableNum * i}`);
    }

    return {
      pageNumber: clampPage,
      partNumber: 3,
      partTitle: "भाग 3: गणित एवं अंक ज्ञान",
      chapterNumber: 11,
      chapterTitle: `${tableNum} का पहाड़ा (Table of ${tableNum})`,
      title: `${tableNum} का पहाड़ा (Advanced Multiplication Table)`,
      subtitle: `21 से 40 तक उच्च स्तरीय पहाड़े`,
      type: "table",
      audioText: `${tableNum} का पहाड़ा: ${tableRows.slice(0, 5).join(", ")}`,
      heroCharacter: `${tableNum}`,
      lines: tableRows,
      homeworkTask: `अपनी रफ कॉपी में ${tableNum} का पहाड़ा लिखकर अभ्यास करें।`,
    };
  }

  // PAGE 436 to 470: CHAPTER 12 - ADDITION + (35 pages)
  if (clampPage >= 436 && clampPage <= 470) {
    const pIndex = clampPage - 436;
    const n1 = (pIndex % 7) + 1;
    const n2 = ((pIndex * 2) % 6) + 1;
    const sum = n1 + n2;

    return {
      pageNumber: clampPage,
      partNumber: 3,
      partTitle: "भाग 3: गणित एवं अंक ज्ञान",
      chapterNumber: 12,
      chapterTitle: `सचित्र जोड़ (Addition): ${n1} + ${n2} = ${sum}`,
      title: `जोड़ अभ्यास (Addition +): ${n1} + ${n2}`,
      subtitle: `वस्तुओं को एक साथ मिलाकर कुल संख्या ज्ञात करें`,
      type: "addition",
      audioText: `${n1} में ${n2} जोड़ने पर ${sum} होता है। ${n1} प्लस ${n2} इज इक्वल टू ${sum}`,
      heroCharacter: "+",
      mathProblem: {
        num1: n1,
        num2: n2,
        operator: "+",
        answer: sum,
        visualIcons: ["🍎", "⚽", "🎈", "⭐"],
      },
      homeworkTask: `चित्रों को गिनें, दोनों संख्याओं को जोड़ें और सही उत्तर लिखें।`,
    };
  }

  // PAGE 471 to 500: CHAPTER 13 - SUBTRACTION - (30 pages)
  if (clampPage >= 471 && clampPage <= 500) {
    const pIndex = clampPage - 471;
    const n1 = (pIndex % 8) + 3;
    const n2 = (pIndex % 3) + 1;
    const diff = n1 - n2;

    return {
      pageNumber: clampPage,
      partNumber: 3,
      partTitle: "भाग 3: गणित एवं अंक ज्ञान",
      chapterNumber: 13,
      chapterTitle: `सचित्र घटाव (Subtraction): ${n1} - ${n2} = ${diff}`,
      title: `घटाव अभ्यास (Subtraction -): ${n1} - ${n2}`,
      subtitle: `दी गई कुल संख्या में से वस्तुएं कम करना सीखें`,
      type: "subtraction",
      audioText: `${n1} में से ${n2} घटाने पर ${diff} बचता है।`,
      heroCharacter: "-",
      mathProblem: {
        num1: n1,
        num2: n2,
        operator: "-",
        answer: diff,
        visualIcons: ["🎈", "🚗", "🧁"],
      },
      homeworkTask: `कुल वस्तुओं में से काटी गई वस्तुओं को अलग करके बचा हुआ उत्तर लिखें।`,
    };
  }

  // PAGE 501 to 530: CHAPTER 14 - MULTIPLICATION × (30 pages)
  if (clampPage >= 501 && clampPage <= 530) {
    const pIndex = clampPage - 501;
    const n1 = (pIndex % 5) + 2;
    const n2 = (pIndex % 4) + 1;
    const prod = n1 * n2;

    return {
      pageNumber: clampPage,
      partNumber: 3,
      partTitle: "भाग 3: गणित एवं अंक ज्ञान",
      chapterNumber: 14,
      chapterTitle: `गुणा अभ्यास (Multiplication): ${n1} × ${n2} = ${prod}`,
      title: `सरल गुणा (Multiplication ×): ${n1} × ${n2}`,
      subtitle: `समूह में बार-बार जोड़ने की प्रक्रिया`,
      type: "multiplication",
      audioText: `${n1} गुना ${n2} बराबर ${prod}`,
      heroCharacter: "×",
      mathProblem: {
        num1: n1,
        num2: n2,
        operator: "×",
        answer: prod,
      },
      homeworkTask: `${n1} का पहाड़ा ${n2} बार पढ़कर सही उत्तर लिखें।`,
    };
  }

  // PAGE 531 to 560: CHAPTER 15 - DIVISION ÷ (30 pages)
  if (clampPage >= 531 && clampPage <= 560) {
    const pIndex = clampPage - 531;
    const n2 = (pIndex % 4) + 2; // divisor: 2, 3, 4, 5
    const ans = (pIndex % 5) + 1; // 1, 2, 3, 4, 5
    const n1 = n2 * ans;

    return {
      pageNumber: clampPage,
      partNumber: 3,
      partTitle: "भाग 3: गणित एवं अंक ज्ञान",
      chapterNumber: 15,
      chapterTitle: `सरल भाग (Division): ${n1} ÷ ${n2} = ${ans}`,
      title: `बराबर बांटना (Division ÷): ${n1} ÷ ${n2}`,
      subtitle: `${n1} वस्तुओं को ${n2} बराबर भागों में बांटें`,
      type: "division",
      audioText: `${n1} को ${n2} से भाग देने पर ${ans} प्राप्त होता है।`,
      heroCharacter: "÷",
      mathProblem: {
        num1: n1,
        num2: n2,
        operator: "÷",
        answer: ans,
      },
      homeworkTask: `बराबर भागों में बांटें और सही उत्तर बॉक्स में लिखें।`,
    };
  }

  // PAGE 561 to 575: CHAPTER 16 - COLORS (15 pages)
  if (clampPage >= 561 && clampPage <= 575) {
    const cList = [
      { hi: "लाल", en: "Red", hex: "#EF4444", icon: "🔴", item: "टमाटर / सेब" },
      { hi: "हरा", en: "Green", hex: "#10B981", icon: "🟢", item: "पेड़ की पत्ती / तोता" },
      { hi: "नीला", en: "Blue", hex: "#3B82F6", icon: "🔵", item: "आसमान / समुद्र" },
      { hi: "पीला", en: "Yellow", hex: "#F59E0B", icon: "🟡", item: "केला / सूरजमुखी" },
      { hi: "संतरी", en: "Orange", hex: "#F97316", icon: "🟠", item: "संतरा / गाजर" },
      { hi: "गुलाबी", en: "Pink", hex: "#EC4899", icon: "🌸", item: "गुलाब का फूल" },
      { hi: "बैंगनी", en: "Purple", hex: "#8B5CF6", icon: "🟣", item: "बैंगन / जामुन" },
      { hi: "सफेद", en: "White", hex: "#F8FAFC", icon: "⚪", item: "दूध / बगुला" },
      { hi: "काला", en: "Black", hex: "#1E293B", icon: "⚫", item: "कोयल / बाल" },
      { hi: "भूरा", en: "Brown", hex: "#78350F", icon: "🟤", item: "चॉकलेट / मिट्टी" },
    ];
    const cIndex = (clampPage - 561) % cList.length;
    const col = cList[cIndex];

    return {
      pageNumber: clampPage,
      partNumber: 4,
      partTitle: "भाग 4: सामान्य ज्ञान, रंग व आकृतियां",
      chapterNumber: 16,
      chapterTitle: `रंग पहचान: ${col.hi} (${col.en})`,
      title: `${col.hi} रंग - ${col.en} Color ${col.icon}`,
      subtitle: `रंग की पहचान, उदाहरण वस्तुएं एवं रंग भरने का अभ्यास`,
      type: "colors",
      audioText: `यह ${col.hi} रंग है, जिसे अंग्रेजी में ${col.en} कहते हैं। जैसे ${col.item}`,
      heroCharacter: col.icon,
      heroWord: col.en,
      heroWordHi: col.hi,
      examples: [
        { text: col.item, sub: "प्राकृतिक उदाहरण", icon: col.icon },
        { text: `${col.en} Color`, sub: col.hi, icon: "🎨" },
      ],
      homeworkTask: `दिए गए चित्र में सुंदर ${col.hi} रंग भरें!`,
    };
  }

  // PAGE 576 to 590: CHAPTER 17 - SHAPES (15 pages)
  if (clampPage >= 576 && clampPage <= 590) {
    const sList = [
      { hi: "वृत्त / गोल", en: "Circle", icon: "⚪", desc: "रोटी, घड़ी, पहिया" },
      { hi: "वर्ग / चौकोर", en: "Square", icon: "⏹️", desc: "कैरम बोर्ड, रूमाल" },
      { hi: "त्रिभुज / तिकोना", en: "Triangle", icon: "🔺", desc: "समोसा, पेस्ट्री" },
      { hi: "आयत / लंबा चौकोर", en: "Rectangle", icon: "▭", desc: "दरवाजा, ब्लैकबोर्ड" },
      { hi: "तारा", en: "Star", icon: "⭐", desc: "आसमान का चमकता तारा" },
      { hi: "अंडाकार", en: "Oval", icon: "🥚", desc: "अंडा, तरबूज" },
    ];
    const sh = sList[(clampPage - 576) % sList.length];

    return {
      pageNumber: clampPage,
      partNumber: 4,
      partTitle: "भाग 4: सामान्य ज्ञान, रंग व आकृतियां",
      chapterNumber: 17,
      chapterTitle: `आकृति पहचान: ${sh.hi} (${sh.en})`,
      title: `आकृति: ${sh.hi} (${sh.en}) ${sh.icon}`,
      subtitle: `ज्यामितीय आकृतियां एवं आसपास की वस्तुओं में पहचान`,
      type: "shapes",
      audioText: `यह ${sh.hi} है। अंग्रेजी में इसे ${sh.en} कहते हैं। उदाहरण: ${sh.desc}`,
      heroCharacter: sh.icon,
      heroWord: sh.en,
      heroWordHi: sh.hi,
      examples: [
        { text: sh.desc, sub: "आसपास की वस्तुएं", icon: sh.icon },
        { text: sh.en, sub: sh.hi, icon: "📐" },
      ],
      homeworkTask: `कैनवास पर उंगली से ${sh.hi} की आकृति बनाएं और रंग भरें।`,
    };
  }

  // PAGE 591 to 650: CHAPTER 18-20 - GK (Body Parts, Fruits, Animals) (60 pages)
  if (clampPage >= 591 && clampPage <= 650) {
    const gkList = [
      { t: "आँखें (Eyes)", sub: "हम आँखों से दुनिया देखते हैं।", icon: "👁️" },
      { t: "कान (Ears)", sub: "हम कानों से अच्छी बातें और संगीत सुनते हैं।", icon: "👂" },
      { t: "नाक (Nose)", sub: "हम नाक से सांस लेते हैं और फूलों की खुशबू सूंघते हैं।", icon: "👃" },
      { t: "हाथ (Hands)", sub: "हम हाथों से लिखते हैं, ताली बजाते हैं और भोजन करते हैं।", icon: "✋" },
      { t: "पैर (Legs)", sub: "हम पैरों से चलते हैं, दौड़ते हैं और खेलते हैं।", icon: "🦶" },
      { t: "सेब (Apple)", sub: "लाल और मीठा फल, स्वास्थ्य के लिए उत्तम।", icon: "🍎" },
      { t: "केला (Banana)", sub: "ऊर्जा देने वाला स्वादिष्ट फल।", icon: "🍌" },
      { t: "शेर (Lion)", sub: "जंगल का राजा, शक्तिशाली और निर्भीक।", icon: "🦁" },
      { t: "गाय (Cow)", sub: "हमारी गौमाता, हमें मीठा और पौष्टिक दूध देती है।", icon: "🐄" },
      { t: "मोर (Peacock)", sub: "हमारा राष्ट्रीय पक्षी, वर्षा में नाचता है।", icon: "🦚" },
    ];
    const item = gkList[(clampPage - 591) % gkList.length];

    return {
      pageNumber: clampPage,
      partNumber: 4,
      partTitle: "भाग 4: सामान्य ज्ञान एवं पर्यावरण",
      chapterNumber: 18,
      chapterTitle: `ज्ञान दर्शन: ${item.t}`,
      title: `${item.t} ${item.icon}`,
      subtitle: `दैनिक सामान्य ज्ञान एवं पर्यावरण परिचय`,
      type: "gk",
      audioText: `${item.t}. ${item.sub}`,
      heroCharacter: item.icon,
      lines: [item.sub],
      homeworkTask: `इस चित्र को पहचानें और इसके 2 उपयोग या गुण बताएं।`,
    };
  }

  // PAGE 651 to 719: CHAPTER 21-22 - DAILY HOMEWORK & REVIEW (69 pages)
  if (clampPage >= 651 && clampPage <= 719) {
    const day = clampPage - 651 + 1;
    return {
      pageNumber: clampPage,
      partNumber: 5,
      partTitle: "भाग 5: दैनिक गृहकार्य एवं अभ्यास",
      chapterNumber: 21,
      chapterTitle: `दैनिक अभ्यास शीट - दिवस ${day}`,
      title: `दैनिक गृहकार्य कार्यपत्रिका (Worksheet Day ${day})`,
      subtitle: `दिन-प्रतिदिन का सतत अभ्यास, सुलेख एवं मूल्यांकन`,
      type: "homework",
      audioText: `दिवस ${day} का गृहकार्य! आज का अभ्यास कार्य पूरा करें और चेक करें।`,
      heroCharacter: "✍️",
      lines: [
        `1. आज सीखे गए 2 नए अक्षरों को 5 बार लिखें।`,
        `2. 1 से 10 तक गिनती जोर से बोलें और लिखें।`,
        `3. अपने पसंदीदा रंग से नीचे दी गई आकृति में रंग भरें।`,
      ],
      homeworkTask: `आज का गृहकार्य पूरा करके 'होमवर्क चेक करें' बटन दबाएं और स्टार्स प्राप्त करें! ⭐`,
    };
  }

  // PAGE 720: OFFICIAL CERTIFICATE
  return {
    pageNumber: 720,
    partNumber: 5,
    partTitle: "भाग 5: बाल विकास सम्पूर्णता",
    chapterNumber: 22,
    chapterTitle: "आधिकारिक सफलता प्रमाण-पत्र (Certificate)",
    title: "IOIS बाल विकास: सफलता प्रमाण-पत्र",
    subtitle: "720 पृष्ठों का संपूर्ण डिजिटल अध्ययन सफलतापूर्वक संपन्न",
    type: "certificate",
    audioText: "बधाई हो! आपने बाल विकास डिजिटल अध्ययन पुस्तिका के सभी 720 पृष्ठ सफलतापूर्वक पूरे कर लिए हैं!",
    heroCharacter: "🏆",
  };
}
