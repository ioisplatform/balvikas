import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  RotateCcw,
  Volume2,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eraser,
  PenTool,
  CheckCircle2,
  Star,
  Award,
  BookOpen,
} from "lucide-react";

interface PencilTracingVideoEngineProps {
  onBackToDashboard?: () => void;
  onOpenDrawing?: () => void;
  language?: "hi" | "en";
  soundEnabled?: boolean;
}

// Letter definitions for English (A to Z) & Hindi (अ से ज्ञ:)
const ENGLISH_LETTERS = [
  { char: "A", small: "a", word: "Apple", hindi: "सेब", icon: "🍎", phonics: "ऐ-प-ल", storyText: "A for Apple! मीठा लाल सेब, और A for Ant यानी नटखट चींटी!" },
  { char: "B", small: "b", word: "Ball", hindi: "गेंद", icon: "⚽", phonics: "ब-ऑ-ल", storyText: "B for Ball! चलो गेंद से खेलें, B for Butterfly यानी तितली!" },
  { char: "C", small: "c", word: "Cat", hindi: "बिल्ली", icon: "🐱", phonics: "क-ऐ-ट", storyText: "C for Cat! म्याऊँ म्याऊँ बिल्ली, C for Car यानी कार!" },
  { char: "D", small: "d", word: "Duck", hindi: "बतख", icon: "🦆", phonics: "ड-अ-क", storyText: "D for Duck! क्वैक क्वैक बतख, D for Drum यानी ढोलक!" },
  { char: "E", small: "e", word: "Elephant", hindi: "हाथी", icon: "🐘", phonics: "ए-ल-फेंट", storyText: "E for Elephant! बड़ा सा हाथी, E for Egg यानी अंडा!" },
  { char: "F", small: "f", word: "Fish", hindi: "मछली", icon: "🐟", phonics: "फ-इ-श", storyText: "F for Fish! जल की रानी मछली, F for Flower यानी फूल!" },
  { char: "G", small: "g", word: "Grapes", hindi: "अंगूर", icon: "🍇", phonics: "ग-रे-प्स", storyText: "G for Grapes! खट्टे-मीठे अंगूर, G for Girl यानी गुड़िया!" },
  { char: "H", small: "h", word: "Horse", hindi: "घोड़ा", icon: "🐴", phonics: "ह-ऑ-र्स", storyText: "H for Horse! टिक-टिक करता घोड़ा, H for House यानी घर!" },
  { char: "I", small: "i", word: "Ice Cream", hindi: "आइसक्रीम", icon: "🍦", phonics: "आ-इ-स-क्रीम", storyText: "I for Ice Cream! ठंडी-मीठी आइसक्रीम, I for Island यानी द्वीप!" },
  { char: "J", small: "j", word: "Jug", hindi: "जग", icon: "🏺", phonics: "ज-अ-ग", storyText: "J for Jug! पानी का जग, J for Joker यानी जोकर!" },
  { char: "K", small: "k", word: "Kite", hindi: "पतंग", icon: "🪁", phonics: "क-आ-इ-ट", storyText: "K for Kite! आसमान में उड़ती पतंग, K for King यानी राजा!" },
  { char: "L", small: "l", word: "Lion", hindi: "शेर", icon: "🦁", phonics: "ल-आ-इ-न", storyText: "L for Lion! जंगल का राजा शेर, L for Leaf यानी पत्ता!" },
  { char: "M", small: "m", word: "Mango", hindi: "आम", icon: "🥭", phonics: "म-ऐं-गो", storyText: "M for Mango! फलों का राजा आम, M for Monkey यानी बंदर!" },
  { char: "N", small: "n", word: "Nest", hindi: "घोंसला", icon: "🪺", phonics: "न-ए-स-ट", storyText: "N for Nest! चिड़िया का घोंसला, N for Net यानी जाल!" },
  { char: "O", small: "o", word: "Orange", hindi: "संतरा", icon: "🍊", phonics: "ऑ-रें-ज", storyText: "O for Orange! रसीला संतरा, O for Owl यानी उल्लू!" },
  { char: "P", small: "p", word: "Parrot", hindi: "तोता", icon: "🦜", phonics: "प-ऐ-र-ट", storyText: "P for Parrot! हरा-भरा मिट्ठू तोता, P for Pen यानी कलम!" },
  { char: "Q", small: "q", word: "Queen", hindi: "रानी", icon: "👸", phonics: "क-वी-न", storyText: "Q for Queen! ताज वाली रानी, Q for Quill यानी पंख!" },
  { char: "R", small: "r", word: "Rabbit", hindi: "खरगोश", icon: "🐰", phonics: "र-ऐ-ब-इ-ट", storyText: "R for Rabbit! सफेद प्यारा खरगोश, R for Rose यानी गुलाब!" },
  { char: "S", small: "s", word: "Sun", hindi: "सूरज", icon: "☀️", phonics: "स-अ-न", storyText: "S for Sun! चमकता हुआ सूरज, S for Star यानी तारा!" },
  { char: "T", small: "t", word: "Tiger", hindi: "बाघ", icon: "🐯", phonics: "ट-आ-इ-ग-र", storyText: "T for Tiger! ताकतवर राष्ट्रीय पशु बाघ, T for Tree यानी पेड़!" },
  { char: "U", small: "u", word: "Umbrella", hindi: "छाता", icon: "☂️", phonics: "अ-म-ब्रे-ला", storyText: "U for Umbrella! बारिश का साथी छाता, U for Uniform यानी वर्दी!" },
  { char: "V", small: "v", word: "Van", hindi: "वैन", icon: "🚐", phonics: "व-ऐ-न", storyText: "V for Van! स्कूल वाली वैन, V for Violin यानी वायलिन!" },
  { char: "W", small: "w", word: "Watch", hindi: "घड़ी", icon: "⌚", phonics: "व-ऑ-च", storyText: "W for Watch! समय बताने वाली घड़ी, W for Watermelon यानी तरबूज!" },
  { char: "X", small: "x", word: "Xylophone", hindi: "जाइलोफ़ोन", icon: "🎹", phonics: "ज़-आ-इ-लो-फ़ोन", storyText: "X for Xylophone! मधुर धुन का बाजा, X for X-Ray यानी एक्स-रे!" },
  { char: "Y", small: "y", word: "Yak", hindi: "याक", icon: "🐂", phonics: "य-ऐ-क", storyText: "Y for Yak! बर्फीले पहाड़ों का याक, Y for Yo-Yo यानी लट्टू!" },
  { char: "Z", small: "z", word: "Zebra", hindi: "ज़ेबरा", icon: "🦓", phonics: "ज़े-ब्र-आ", storyText: "Z for Zebra! काली-सफेद धारियों वाला ज़ेबरा, Z for Zoo यानी चिड़ियाघर!" },
];

const HINDI_LETTERS = [
  // Swar
  { char: "अ", word: "अनार", english: "Pomegranate", icon: "🍎", category: "swar", storyText: "अ से अनार! दानेदार लाल अनार, रोज़ खाओ और सेहत बनाओ!" },
  { char: "आ", word: "आम", english: "Mango", icon: "🥭", category: "swar", storyText: "आ से आम! फलों का राजा मीठा आम, सब करते इसका गुणगान!" },
  { char: "इ", word: "इमली", english: "Tamarind", icon: "🫐", category: "swar", storyText: "इ से इमली! खट्टी-मीठी इमली, मुंह में पानी लाती!" },
  { char: "ई", word: "ईख", english: "Sugarcane", icon: "🎋", category: "swar", storyText: "ई से ईख! मीठा-मीठा गन्ना, जिससे बने गुड़ और चीनी!" },
  { char: "उ", word: "उल्लू", english: "Owl", icon: "🦉", category: "swar", storyText: "उ से उल्लू! रात को जागे दिन में सोए, आंखें बड़ी-बड़ी!" },
  { char: "ऊ", word: "ऊन", english: "Wool", icon: "🧶", category: "swar", storyText: "ऊ से ऊन! भेड़ों से मिलती ऊन, जो सर्दी में दे आराम!" },
  { char: "ऋ", word: "ऋषि", english: "Sage", icon: "🧘", category: "swar", storyText: "ऋ से ऋषि! ज्ञान का सागर, तप और ध्यान में लीन!" },
  { char: "ए", word: "एड़ी", english: "Heel", icon: "🦶", category: "swar", storyText: "ए से एड़ी! पैरों का आधार, मजबूती से कदम बढ़ाओ!" },
  { char: "ऐ", word: "ऐनक", english: "Spectacles", icon: "👓", category: "swar", storyText: "ऐ से ऐनक! दादाजी की प्यारी ऐनक, सब कुछ साफ दिखाए!" },
  { char: "ओ", word: "ओखली", english: "Mortar", icon: "🥣", category: "swar", storyText: "ओ से ओखली! गांव की शान, जिसमें कूटे अन्न!" },
  { char: "औ", word: "औरत", english: "Woman", icon: "👩", category: "swar", storyText: "औ से औरत! ममता की मूरत, घर को स्वर्ग बनाए!" },
  { char: "अं", word: "अंगूर", english: "Grapes", icon: "🍇", category: "swar", storyText: "अं से अंगूर! गुच्छों में लटके हरे और काले अंगूर!" },
  { char: "अः", word: "खाली", english: "Aha", icon: "✨", category: "swar", storyText: "अः से खाली! बच्चों बजाओ ताली!" },
  // Vyanjan
  { char: "क", word: "कबूतर", english: "Pigeon", icon: "🕊️", category: "vyanjan", storyText: "क से कबूतर! गुटर-गूं करता कबूतर, शांति का प्रतीक!" },
  { char: "ख", word: "खरगोश", english: "Rabbit", icon: "🐰", category: "vyanjan", storyText: "ख से खरगोश! तेज दौड़ने वाला प्यारा सफेद खरगोश!" },
  { char: "ग", word: "गमला", english: "Flower Pot", icon: "🪴", category: "vyanjan", storyText: "ग से गमला! सुंदर-सुंदर फूलों का हरा-भरा गमला!" },
  { char: "घ", word: "घड़ी", english: "Clock", icon: "⏰", category: "vyanjan", storyText: "घ से घड़ी! टिक-टिक करती घड़ी, जो सिखाए समय का मोल!" },
  { char: "ङ", word: "खाली", english: "Nga", icon: "✨", category: "vyanjan", storyText: "ङ है खाली, बच्चों बजाओ ताली!" },
  { char: "च", word: "चम्मच", english: "Spoon", icon: "🥄", category: "vyanjan", storyText: "च से चम्मच! खीर खाओ चम्मच से!" },
  { char: "छ", word: "छतरी", english: "Umbrella", icon: "☂️", category: "vyanjan", storyText: "छ से छतरी! धूप और बारिश में काम आए छतरी!" },
  { char: "ज", word: "जहाज", english: "Ship", icon: "🚢", category: "vyanjan", storyText: "ज से जहाज! समंदर की लहरों पर तैरता बड़ा जहाज!" },
  { char: "झ", word: "झंडा", english: "Flag", icon: "🇮🇳", category: "vyanjan", storyText: "झ से झंडा! तिरंगा हमारा प्यारा राष्ट्रीय ध्वज!" },
  { char: "ञ", word: "खाली", english: "Nya", icon: "✨", category: "vyanjan", storyText: "ञ है खाली, बच्चों बजाओ ताली!" },
  { char: "ट", word: "टमाटर", english: "Tomato", icon: "🍅", category: "vyanjan", storyText: "ट से टमाटर! लाल-लाल रसीला टमाटर!" },
  { char: "ठ", word: "ठठेरा", english: "Tinkers", icon: "🔨", category: "vyanjan", storyText: "ठ से ठठेरा! बर्तन बनाने वाला कारीगर!" },
  { char: "ड", word: "डमरू", english: "Damru", icon: "🥁", category: "vyanjan", storyText: "ड से डमरू! डम-डम बाजे भोले का डमरू!" },
  { char: "ढ", word: "ढक्कन", english: "Lid", icon: "🫙", category: "vyanjan", storyText: "ढ से ढक्कन! बर्तन को ढकने का साधन!" },
  { char: "ण", word: "खाली", english: "Nna", icon: "✨", category: "vyanjan", storyText: "ण है खाली, बच्चों बजाओ ताली!" },
  { char: "त", word: "तरबूज", english: "Watermelon", icon: "🍉", category: "vyanjan", storyText: "त से तरबूज! गर्मियों में ठंडक दे मीठा तरबूज!" },
  { char: "थ", word: "थर्मस", english: "Thermos", icon: "🍶", category: "vyanjan", storyText: "थ से थर्मस! गर्म को गर्म रखे और ठंडे को ठंडा!" },
  { char: "द", word: "दवात", english: "Inkpot", icon: "🖋️", category: "vyanjan", storyText: "द से दवात! नीली-काली स्याही से लिखो!" },
  { char: "ध", word: "धनुष", english: "Bow", icon: "🏹", category: "vyanjan", storyText: "ध से धनुष! श्री राम का शक्तिशाली धनुष!" },
  { char: "न", word: "नल", english: "Tap", icon: "🚰", category: "vyanjan", storyText: "न से नल! नल से बहता शीतल जल, कभी व्यर्थ न बहाएं!" },
  { char: "प", word: "पतंग", english: "Kite", icon: "🪁", category: "vyanjan", storyText: "प से पतंग! डोर के सहारे आसमान चूमे पतंग!" },
  { char: "फ", word: "फल", english: "Fruits", icon: "🍎", category: "vyanjan", storyText: "फ से फल! सेहतमंद ताजे फल रोज़ खाओ!" },
  { char: "ब", word: "बतख", english: "Duck", icon: "🦆", category: "vyanjan", storyText: "ब से बतख! तालाब में तैरती प्यारी बतख!" },
  { char: "भ", word: "भालू", english: "Bear", icon: "🐻", category: "vyanjan", storyText: "भ से भालू! जंगल में झूमता मोटा भालू!" },
  { char: "म", word: "मछली", english: "Fish", icon: "🐟", category: "vyanjan", storyText: "म से मछली! मछली जल की रानी है, जीवन उसका पानी है!" },
  { char: "य", word: "यज्ञ", english: "Yagya", icon: "🔥", category: "vyanjan", storyText: "य से यज्ञ! वातावरण को शुद्ध करे पावन यज्ञ!" },
  { char: "र", word: "रथ", english: "Chariot", icon: "🛞", category: "vyanjan", storyText: "र से रथ! राजा-महाराजाओं की शाही सवारी!" },
  { char: "ल", word: "लट्टू", english: "Spinning Top", icon: "🪀", category: "vyanjan", storyText: "ल से लट्टू! धागे से घूमे गोल-गोल लट्टू!" },
  { char: "व", word: "वक", english: "Crane", icon: "🦩", category: "vyanjan", storyText: "व से वक! शांत पानी में मछली पकड़े बगुला!" },
  { char: "श", word: "शलजम", english: "Turnip", icon: "🧅", category: "vyanjan", storyText: "श से शलजम! पौष्टिक सब्जी शलजम!" },
  { char: "ष", word: "षट्कोण", english: "Hexagon", icon: "⬡", category: "vyanjan", storyText: "ष से षट्कोण! छह कोनों वाली आकृति!" },
  { char: "स", word: "सपेरा", english: "Snake Charmer", icon: "🪈", category: "vyanjan", storyText: "स से सपेरा! बीन बजाए सपेरा!" },
  { char: "ह", word: "हाथी", english: "Elephant", icon: "🐘", category: "vyanjan", storyText: "ह से हाथी! सूंड हिलाता भारी-भरकम हाथी!" },
  { char: "क्ष", word: "क्षत्रिय", english: "Warrior", icon: "⚔️", category: "vyanjan", storyText: "क्ष से क्षत्रिय! देश की रक्षा करने वाले शूरवीर!" },
  { char: "त्र", word: "त्रिशूल", english: "Trident", icon: "🔱", category: "vyanjan", storyText: "त्र से त्रिशूल! महादेव का पावन त्रिशूल!" },
  { char: "ज्ञ", word: "ज्ञानी", english: "Scholar", icon: "📖", category: "vyanjan", storyText: "ज्ञ से ज्ञानी! ज्ञान से जग में उजियारा फैलाओ!" },
];

export const PencilTracingVideoEngine: React.FC<PencilTracingVideoEngineProps> = ({
  onBackToDashboard,
  language = "hi",
  soundEnabled = true,
}) => {
  const [langMode, setLangMode] = useState<"english" | "hindi">("english");
  const [selectedEngIndex, setSelectedEngIndex] = useState<number>(0);
  const [selectedHindiIndex, setSelectedHindiIndex] = useState<number>(0);

  // User Practice Mode vs Automated Video Animation Mode
  const [activeMode, setActiveMode] = useState<"video" | "practice">("video");
  const [dialogueText, setDialogueText] = useState<string>(
    '🐜 चींटी: "नमस्ते बच्चों! \'प्ले वीडियो कहानी\' दबाएं, मैं आपको Pencil पकड़ कर A लिखना और सेब की दुनिया दिखाऊंगी!"'
  );

  // Drawing Tools State for practice mode
  const [practiceColor, setPracticeColor] = useState<string>("#16A34A"); // Green pencil
  const [practiceTool, setPracticeTool] = useState<"pencil" | "eraser">("pencil");
  const [userPaths, setUserPaths] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number }>>([]);
  const [showReward, setShowReward] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Animation Engine Progress State
  const progRef = useRef<{
    tCap: number;
    tSmall: number;
    isPlaying: boolean;
    antPos: { x: number; y: number; angle: number };
    antTarget: { x: number; y: number };
    antLegAngle: number;
    isAntInsideApple: boolean;
    isAntCarryingPiece: boolean;
  }>({
    tCap: 0,
    tSmall: 0,
    isPlaying: false,
    antPos: { x: 40, y: 350, angle: 0 },
    antTarget: { x: 40, y: 350 },
    antLegAngle: 0,
    isAntInsideApple: false,
    isAntCarryingPiece: false,
  });

  const currentEng = ENGLISH_LETTERS[selectedEngIndex];
  const currentHindi = HINDI_LETTERS[selectedHindiIndex];

  // Speak high-pitch ant/teacher voice
  const speakVoice = useCallback(
    (text: string, callback?: () => void) => {
      setDialogueText(text);
      if (soundEnabled && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text.replace(/^[🐜👦🎓\s:]+/, ""));
        msg.lang = "hi-IN";
        msg.rate = 0.94;
        msg.pitch = 1.48; // cute cheerful kid/cartoon pitch
        if (callback) msg.onend = callback;
        msg.onerror = () => {
          if (callback) callback();
        };
        window.speechSynthesis.speak(msg);
      } else {
        if (callback) setTimeout(callback, 2500);
      }
    },
    [soundEnabled]
  );

  // 4-Line Notebook coordinates calculation
  const getLineY = (row: number, lineIdx: number) => {
    const base = row === 0 ? 55 : 225;
    return base + lineIdx * 32;
  };

  // Capital 'A' 3-stroke mathematical path
  const getCapAPoint = (t: number) => {
    const l1 = getLineY(0, 0); // Top Red
    const l3 = getLineY(0, 2); // Bottom Blue
    const midY = getLineY(0, 1.2);

    if (t <= 0.45) {
      // Stroke 1: Bottom Left to Top Apex
      const p = t / 0.45;
      return { x: 50 + 40 * p, y: l3 + (l1 - l3) * p };
    } else if (t <= 0.85) {
      // Stroke 2: Top Apex to Bottom Right
      const p = (t - 0.45) / 0.4;
      return { x: 90 + 40 * p, y: l1 + (l3 - l1) * p };
    } else {
      // Stroke 3: Horizontal Middle Crossbar
      const p = (t - 0.85) / 0.15;
      return { x: 62 + 48 * p, y: midY };
    }
  };

  // Small 'a' mathematical path (Circle + vertical curve)
  const getSmallAPoint = (t: number) => {
    const l2 = getLineY(1, 1);
    const l3 = getLineY(1, 2);
    const centerY = (l2 + l3) / 2;
    const r = (l3 - l2) / 2;
    const centerX = 90;

    if (t <= 0.75) {
      const angle = -(t / 0.75) * Math.PI * 2;
      return { x: centerX + Math.cos(angle) * r, y: centerY + Math.sin(angle) * r };
    } else {
      const p = (t - 0.75) / 0.25;
      return { x: centerX + r, y: l2 + (l3 - l2) * p };
    }
  };

  // Hindi 'अ' mathematical stroke path
  const getHindiAPoint = (t: number) => {
    const topY = 70;
    const midY = 135;
    const botY = 200;
    const centerX = 90;

    if (t <= 0.3) {
      // Upper curve
      const angle = Math.PI + (t / 0.3) * Math.PI;
      return { x: centerX + Math.cos(angle) * 28, y: (topY + midY) / 2 + Math.sin(angle) * 26 };
    } else if (t <= 0.6) {
      // Lower curve with tail
      const p = (t - 0.3) / 0.3;
      const angle = Math.PI + p * (Math.PI * 1.15);
      return { x: centerX + Math.cos(angle) * 32, y: (midY + botY) / 2 + Math.sin(angle) * 30 };
    } else if (t <= 0.75) {
      // Middle horizontal link line
      const p = (t - 0.6) / 0.15;
      return { x: centerX + 20 * p, y: midY };
    } else if (t <= 0.9) {
      // Standing vertical line
      const p = (t - 0.75) / 0.15;
      return { x: centerX + 25, y: topY + (botY - topY) * p };
    } else {
      // Shirorekha (Top roof line)
      const p = (t - 0.9) / 0.1;
      return { x: centerX - 35 + 85 * p, y: topY };
    }
  };

  // Draw 3D Ultra Glossy Apple with tunnel hole and drop shadow
  const drawAppleGraphic = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    ctx.save();
    // Drop Shadow
    ctx.beginPath();
    ctx.ellipse(cx, cy + 75, 75, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fill();

    // Stem
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy - 45);
    ctx.quadraticCurveTo(cx - 15, cy - 80, cx - 22, cy - 85);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#3d1e0b";
    ctx.lineCap = "round";
    ctx.stroke();

    // Leaf
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy - 70);
    ctx.quadraticCurveTo(cx + 30, cy - 100, cx + 45, cy - 70);
    ctx.quadraticCurveTo(cx + 15, cy - 50, cx - 10, cy - 70);
    const leafGrad = ctx.createLinearGradient(cx - 10, cy - 90, cx + 45, cy - 50);
    leafGrad.addColorStop(0, "#4ade80");
    leafGrad.addColorStop(1, "#15803d");
    ctx.fillStyle = leafGrad;
    ctx.fill();

    // Apple Body Gradient
    ctx.beginPath();
    ctx.moveTo(cx, cy - 45);
    ctx.bezierCurveTo(cx + 50, cy - 65, cx + 85, cy - 10, cx + 75, cy + 35);
    ctx.bezierCurveTo(cx + 65, cy + 75, cx + 20, cy + 80, cx, cy + 65);
    ctx.bezierCurveTo(cx - 20, cy + 80, cx - 65, cy + 75, cx - 75, cy + 35);
    ctx.bezierCurveTo(cx - 85, cy - 10, cx - 50, cy - 65, cx, cy - 45);

    const appleGrad = ctx.createRadialGradient(cx - 25, cy - 20, 10, cx, cy, 85);
    appleGrad.addColorStop(0, "#ff4d4d");
    appleGrad.addColorStop(0.5, "#dc2626");
    appleGrad.addColorStop(0.85, "#991b1b");
    appleGrad.addColorStop(1, "#450a0a");
    ctx.fillStyle = appleGrad;
    ctx.fill();

    // Apple Tunnel Hole where Ant enters
    ctx.beginPath();
    ctx.ellipse(cx - 10, cy + 20, 18, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#450a0a";
    ctx.fill();
    ctx.strokeStyle = "#7f1d1d";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glossy Reflection Highlight
    ctx.beginPath();
    ctx.ellipse(cx - 35, cy - 20, 16, 35, Math.PI / 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.fill();

    ctx.restore();
  };

  // Draw Crawling 3D Ant Character
  const drawCrawlingAnt = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number
  ) => {
    if (progRef.current.isAntInsideApple) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    progRef.current.antLegAngle += 0.25;
    const legOffset = Math.sin(progRef.current.antLegAngle) * 5;

    // Antennae
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, -4);
    ctx.quadraticCurveTo(20, -14, 25, -12);
    ctx.moveTo(12, 4);
    ctx.quadraticCurveTo(20, 14, 25, 12);
    ctx.stroke();

    // 6 Legs
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(-5 + legOffset, -14);
    ctx.moveTo(-4, -2);
    ctx.lineTo(-4 - legOffset, -14);
    ctx.moveTo(-8, -2);
    ctx.lineTo(-13 + legOffset, -14);

    ctx.moveTo(0, 2);
    ctx.lineTo(-5 - legOffset, 14);
    ctx.moveTo(-4, 2);
    ctx.lineTo(-4 + legOffset, 14);
    ctx.moveTo(-8, 2);
    ctx.lineTo(-13 - legOffset, 14);
    ctx.stroke();

    // Segments: Head, Eye, Thorax, Abdomen
    ctx.beginPath();
    ctx.ellipse(10, 0, 6, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#334155";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(12, -2, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1e293b";
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(-14, 0, 11, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();

    // Piece of apple carried
    if (progRef.current.isAntCarryingPiece) {
      ctx.beginPath();
      ctx.arc(18, 0, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#fef08a";
      ctx.fill();
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  };

  // Draw real rotating pencil attached to current tip
  const drawPencil = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 4);
    // Tip
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-8, -4);
    ctx.lineTo(-8, 4);
    ctx.fill();
    // Wood
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(-16, -7);
    ctx.lineTo(-16, 7);
    ctx.lineTo(-8, 4);
    ctx.fill();
    // Body
    ctx.fillStyle = "#ea580c";
    ctx.fillRect(-36, -7, 20, 14);
    ctx.restore();
  };

  // Draw stroke along parametric path
  const drawPencilStroke = (
    ctx: CanvasRenderingContext2D,
    pathFn: (t: number) => { x: number; y: number },
    prog: number,
    color: string
  ) => {
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let t = 0; t <= prog; t += 0.01) {
      const pt = pathFn(t);
      if (t === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    if (prog < 1 && prog > 0) {
      const pt = pathFn(prog);
      drawPencil(ctx, pt.x, pt.y);
    }
  };

  // Main Canvas Render Loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (langMode === "english") {
      // 1. Draw 4-Line Notebook Lines
      for (let r = 0; r < 2; r++) {
        for (let i = 0; i < 4; i++) {
          const y = getLineY(r, i);
          ctx.beginPath();
          ctx.moveTo(25, y);
          ctx.lineTo(w - 280, y);
          ctx.strokeStyle = i === 0 || i === 3 ? "#ef4444" : "#3b82f6";
          ctx.lineWidth = 1.5;
          if (i === 1 || i === 2) ctx.setLineDash([5, 5]);
          else ctx.setLineDash([]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 2. Reference Faint Guide Letters
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "900 95px sans-serif";
      ctx.fillText(currentEng.char, 48, getLineY(0, 2) - 2);
      ctx.font = "900 62px sans-serif";
      ctx.fillText(currentEng.small, 78, getLineY(1, 2) - 2);

      // 3. Automated Pencil Tracing Animation Engine
      if (progRef.current.isPlaying) {
        if (progRef.current.tCap < 1) progRef.current.tCap += 0.005;
        if (progRef.current.tSmall < 1) progRef.current.tSmall += 0.006;
      }

      drawPencilStroke(ctx, getCapAPoint, progRef.current.tCap, "#0284c7");
      drawPencilStroke(ctx, getSmallAPoint, progRef.current.tSmall, "#dc2626");

      // 4. Ultra-Realistic Apple Graphic
      const appleX = w - 140;
      const appleY = 145;
      drawAppleGraphic(ctx, appleX, appleY);

      // 5. Ant Physics & Movement Update
      const dx = progRef.current.antTarget.x - progRef.current.antPos.x;
      const dy = progRef.current.antTarget.y - progRef.current.antPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 3) {
        progRef.current.antPos.x += (dx / dist) * 2.2;
        progRef.current.antPos.y += (dy / dist) * 2.2;
        progRef.current.antPos.angle = Math.atan2(dy, dx);
      }

      drawCrawlingAnt(
        ctx,
        progRef.current.antPos.x,
        progRef.current.antPos.y,
        progRef.current.antPos.angle
      );
    } else {
      // HINDI NOTEBOOK RULING (2-line Shirorekha paper)
      for (let i = 0; i < 3; i++) {
        const y = 70 + i * 65;
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(w - 280, y);
        ctx.strokeStyle = i === 0 ? "#ef4444" : "#3b82f6";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Faint Guide Letter
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "900 130px sans-serif";
      ctx.fillText(currentHindi.char, 45, 195);

      // Animated Stroke
      if (progRef.current.isPlaying) {
        if (progRef.current.tCap < 1) progRef.current.tCap += 0.005;
      }
      drawPencilStroke(ctx, getHindiAPoint, progRef.current.tCap, "#dc2626");

      // Character Illustration card on right
      const iconX = w - 140;
      const iconY = 140;
      ctx.save();
      ctx.beginPath();
      ctx.arc(iconX, iconY, 65, 0, Math.PI * 2);
      ctx.fillStyle = "#fef3c7";
      ctx.fill();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.font = "70px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(currentHindi.icon, iconX, iconY);
      ctx.restore();
    }

    // 6. Render User Practice Drawing Paths
    ctx.strokeStyle = practiceTool === "eraser" ? "#ffffff" : practiceColor;
    ctx.lineWidth = practiceTool === "eraser" ? 22 : 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    userPaths.forEach((path) => {
      ctx.beginPath();
      path.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    });

    animFrameRef.current = requestAnimationFrame(render);
  }, [langMode, currentEng, currentHindi, practiceColor, practiceTool, userPaths]);

  // Canvas Resize Handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      progRef.current.antPos = { x: 40, y: canvas.height - 60, angle: 0 };
      progRef.current.antTarget = { x: 40, y: canvas.height - 60 };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [render]);

  // Automated Animated Video Story Sequence
  const handleStartFullVideo = () => {
    progRef.current.tCap = 0;
    progRef.current.tSmall = 0;
    progRef.current.isPlaying = true;
    progRef.current.isAntInsideApple = false;
    progRef.current.isAntCarryingPiece = false;
    setShowReward(false);

    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 800;

    if (langMode === "english") {
      progRef.current.antTarget = { x: 140, y: getLineY(0, 2) + 20 };

      speakVoice(
        `हेलो बच्चों! मैं चींटी हूँ! अपनी पेंसिल पकड़ो और मेरे साथ ${currentEng.char} लिखना सीखो!`,
        () => {
          speakVoice(
            "पहले ऊपर से नीचे बाईं तिरछी लाइन खींचो, फिर दाईं तिरछी लाइन और बीच में सोई हुई लाइन! बन गया Capital A!",
            () => {
              speakVoice(
                "अब बीच की दो लाइनों में गोल अंडा बना कर सीधी लाइन खींचो! बन गया Small a!",
                () => {
                  progRef.current.antTarget = { x: w - 150, y: 160 };

                  speakVoice(
                    `${currentEng.char} for ${currentEng.word}! चलो सेब के अंदर चल कर देखते हैं!`,
                    () => {
                      progRef.current.isAntInsideApple = true;

                      speakVoice(
                        "वाह! मैं सेब के अंदर आ गई! यह अंदर से बहुत मीठा, लाल और सेहतमंद है!",
                        () => {
                          progRef.current.isAntInsideApple = false;
                          progRef.current.isAntCarryingPiece = true;
                          progRef.current.antTarget = { x: w - 210, y: 220 };

                          speakVoice(
                            `A for Ant... Ant यानी मैं चींटी! अब आप सब भी पेंसिल पकड़ कर स्क्रीन पर ${currentEng.char} लिखिए! 🐜🍎`,
                            () => {
                              setShowReward(true);
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    } else {
      speakVoice(
        `हेलो बच्चों! चलो हिंदी का अक्षर '${currentHindi.char}' लिखना सीखें! ${currentHindi.storyText}`,
        () => {
          speakVoice(
            `पहले दो अर्धगोले बनाएं, फिर बीच की सोई लाइन, खड़ी लाइन और ऊपर शिरोरेखा खींचे! बन गया ${currentHindi.char}!`,
            () => {
              setShowReward(true);
            }
          );
        }
      );
    }
  };

  // Touch and Mouse events for student practice slate
  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeMode !== "practice") setActiveMode("practice");
    setIsDrawing(true);
    const pos = getEventPos(e);
    const newPath = [pos];
    setCurrentPath(newPath);
    setUserPaths((prev) => [...prev, newPath]);
  };

  const drawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pos = getEventPos(e);
    setUserPaths((prev) => {
      if (prev.length === 0) return prev;
      const last = [...prev[prev.length - 1], pos];
      return [...prev.slice(0, -1), last];
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearDrawings = () => {
    setUserPaths([]);
    setShowReward(false);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="डैशबोर्ड पर वापस जाएं"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                ORIGINAL REAL ANIMATION
              </span>
              <span className="text-xs text-sky-200 font-bold">4-Line & Shirorekha Copy</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              🎬 असली पेंसिल ट्रेसिंग व एनिमेटेड वीडियो कहानी (A to Z और अ से ज्ञ:)
            </h1>
            <p className="text-xs text-sky-100 max-w-2xl mt-0.5">
              कक्षा 1 के बच्चों के लिए विशेष: असली पेंसिल से अक्षर बनाना सीखें, चींटी की जीवंत वीडियो कहानी देखें और खुद लिखकर अभ्यास करें!
            </p>
          </div>
        </div>

        {/* English vs Hindi Mode Switch */}
        <div className="flex items-center gap-1.5 bg-white/15 p-1 rounded-2xl border border-white/20">
          <button
            onClick={() => {
              setLangMode("english");
              clearDrawings();
            }}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
              langMode === "english"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-white hover:bg-white/10"
            }`}
          >
            🔤 English (A to Z)
          </button>
          <button
            onClick={() => {
              setLangMode("hindi");
              clearDrawings();
            }}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
              langMode === "hindi"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-white hover:bg-white/10"
            }`}
          >
            🕉️ हिन्दी (अ से ज्ञ:)
          </button>
        </div>
      </div>

      {/* Interactive Letter Picker Carousel */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-black text-slate-500 whitespace-nowrap pl-2">
          {langMode === "english" ? "अक्षर चुनें (Pick Letter):" : "वर्ण चुनें:"}
        </span>
        <div className="flex items-center gap-1.5">
          {langMode === "english"
            ? ENGLISH_LETTERS.map((item, idx) => (
                <button
                  key={item.char}
                  onClick={() => {
                    setSelectedEngIndex(idx);
                    clearDrawings();
                  }}
                  className={`w-9 h-9 rounded-xl font-mono font-black text-sm transition-all flex items-center justify-center shrink-0 ${
                    selectedEngIndex === idx
                      ? "bg-sky-600 text-white scale-110 shadow-md ring-2 ring-sky-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50"
                  }`}
                >
                  {item.char}
                </button>
              ))
            : HINDI_LETTERS.map((item, idx) => (
                <button
                  key={item.char}
                  onClick={() => {
                    setSelectedHindiIndex(idx);
                    clearDrawings();
                  }}
                  className={`w-9 h-9 rounded-xl font-black text-sm transition-all flex items-center justify-center shrink-0 ${
                    selectedHindiIndex === idx
                      ? "bg-red-600 text-white scale-110 shadow-md ring-2 ring-red-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50"
                  }`}
                >
                  {item.char}
                </button>
              ))}
        </div>
      </div>

      {/* Main Real Animation Video Canvas Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-4 border-sky-300 dark:border-slate-700 overflow-hidden shadow-2xl flex flex-col">
        {/* Ant Voice Dialogue Speech Banner */}
        <div className="bg-amber-100 dark:bg-amber-950/60 border-b-2 border-amber-300 dark:border-amber-800/80 p-3.5 sm:p-4 text-center text-sm sm:text-base font-black text-amber-900 dark:text-amber-200 min-h-[60px] flex items-center justify-center leading-relaxed">
          {dialogueText}
        </div>

        {/* Canvas Animation Area */}
        <div className="relative w-full h-[440px] bg-white touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={drawMove}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={drawMove}
            onTouchEnd={stopDrawing}
            className="w-full h-full block cursor-crosshair"
          />

          {/* Top Right Letter Badge */}
          <div className="absolute top-3 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="text-2xl font-black text-sky-600">
              {langMode === "english" ? `${currentEng.char} ${currentEng.small}` : currentHindi.char}
            </span>
            <span className="text-xs font-bold text-slate-600">
              {langMode === "english" ? `${currentEng.word} (${currentEng.hindi})` : currentHindi.word}
            </span>
            <span className="text-xl">{langMode === "english" ? currentEng.icon : currentHindi.icon}</span>
          </div>

          {/* Reward Stars Overlay */}
          {showReward && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-5 py-2.5 rounded-2xl shadow-xl border-2 border-white flex items-center gap-3 animate-in fade-in zoom-in">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-current text-slate-950" />
                ))}
              </div>
              <span className="font-black text-xs sm:text-sm">
                शाबाश! आपने बहुत सुंदर लिखा! 5 स्टार्स! ⭐
              </span>
            </div>
          )}
        </div>

        {/* Bottom Control Bar & Practice Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleStartFullVideo}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>▶️ प्ले वीडियो कहानी (Video Story)</span>
            </button>

            <button
              onClick={() => {
                setActiveMode("practice");
                speakVoice("अब स्क्रीन पर अपनी उंगली या माउस से पेंसिल चलाएं!");
              }}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
                activeMode === "practice"
                  ? "bg-sky-500 text-white border-sky-600 shadow-md"
                  : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600"
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>✍️ खुद लिखकर अभ्यास करें (Practice)</span>
            </button>

            <button
              onClick={clearDrawings}
              className="px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>🧹 ड्राइंग साफ़ करें</span>
            </button>
          </div>

          {/* Drawing Color Selector for Student */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">रंग:</span>
            {["#16A34A", "#DC2626", "#2563EB", "#D97706", "#7C3AED", "#18181B"].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setPracticeColor(c);
                  setPracticeTool("pencil");
                }}
                className={`w-7 h-7 rounded-xl transition-transform ${
                  practiceColor === c && practiceTool === "pencil"
                    ? "scale-125 ring-2 ring-sky-500 shadow"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}

            <button
              onClick={() => setPracticeTool(practiceTool === "eraser" ? "pencil" : "eraser")}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                practiceTool === "eraser"
                  ? "bg-red-500 text-white border-red-600"
                  : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200"
              }`}
              title="इरेज़र"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Kid-Friendly Instruction Footer */}
        <div className="px-5 py-2.5 bg-sky-50 dark:bg-sky-950/40 border-t border-sky-200 dark:border-sky-900 text-center text-xs font-bold text-sky-800 dark:text-sky-300">
          ✍️ बच्चे माउस या उंगली से स्क्रीन पर 4-लाइन कॉपी की तरह अक्षर लिखने का अभ्यास कर सकते हैं!
        </div>
      </div>
    </div>
  );
};
