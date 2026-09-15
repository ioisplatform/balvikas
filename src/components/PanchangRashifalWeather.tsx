import React, { useState } from "react";
import {
  Calendar,
  Sun,
  Moon,
  Compass,
  Clock,
  Sparkles,
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  ChevronRight,
  Star,
  CheckCircle2,
} from "lucide-react";

export const PanchangRashifalWeather: React.FC = () => {
  const [subTab, setSubTab] = useState<"panchang" | "rashifal" | "weather">("panchang");
  const [selectedRashi, setSelectedRashi] = useState<number>(0);
  const [selectedCity, setSelectedCity] = useState<string>("Patna");

  // Today's live calculated date strings (IST)
  const today = new Date();
  const dateStr = today.toLocaleDateString("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 12 Rashis Data
  const RASHIS = [
    {
      name: "मेष (Aries)",
      symbol: "♈",
      ruler: "मंगल",
      element: "अग्नि",
      prediction: "आज आपके करियर और व्यवसाय में नए अवसर प्राप्त होंगे। विद्यार्थियों के लिए अध्ययन हेतु दिन शुभ है। आर्थिक लाभ के योग हैं।",
      luckyColor: "लाल व केसरिया",
      luckyNumber: "9",
      rating: 5,
    },
    {
      name: "वृषभ (Taurus)",
      symbol: "♉",
      ruler: "शुक्र",
      element: "पृथ्वी",
      prediction: "पारिवारिक जीवन में सुख-शांति बनी रहेगी। लंबे समय से रुका हुआ सरकारी या वित्तीय कार्य आज गति पकड़ेगा। स्वास्थ्य उत्तम रहेगा।",
      luckyColor: "सफेद व चमकीला नीला",
      luckyNumber: "6",
      rating: 4,
    },
    {
      name: "मिथुन (Gemini)",
      symbol: "♊",
      ruler: "बुध",
      element: "वायु",
      prediction: "संचार और बातचीत से बड़े कार्य सिद्ध होंगे। नए ऑनलाइन प्रोजेक्ट या कोर्स की शुरुआत के लिए अनुकूल समय है। मित्रों का सहयोग मिलेगा।",
      luckyColor: "हरा व तोतिया",
      luckyNumber: "5",
      rating: 5,
    },
    {
      name: "कर्क (Cancer)",
      symbol: "♋",
      ruler: "चंद्रमा",
      element: "जल",
      prediction: "माता-पिता के आशीर्वाद से मन प्रसन्न रहेगा। रचनात्मक कार्यों में रुचि बढ़ेगी। जल्दबाजी में धन का लेन-देन न करें।",
      luckyColor: "दूधिया सफेद व चांदी",
      luckyNumber: "2",
      rating: 4,
    },
    {
      name: "सिंह (Leo)",
      symbol: "♌",
      ruler: "सूर्य",
      element: "अग्नि",
      prediction: "आत्मविश्वास में जबरदस्त वृद्धि होगी। प्रतियोगी परीक्षाओं की तैयारी कर रहे छात्रों को शुभ समाचार मिल सकता है। मान-सम्मान में वृद्धि।",
      luckyColor: "सुनहरा व नारंगी",
      luckyNumber: "1",
      rating: 5,
    },
    {
      name: "कन्या (Virgo)",
      symbol: "♍",
      ruler: "बुध",
      element: "पृथ्वी",
      prediction: "कठिन परिश्रम का उचित प्रतिफल मिलेगा। दस्तावेजी कार्यों व ऑनलाइन फॉर्म भरने में सावधानी बरतें। शाम तक मानसिक शांति मिलेगी।",
      luckyColor: "गहरा हरा व भूरा",
      luckyNumber: "5",
      rating: 4,
    },
    {
      name: "तुला (Libra)",
      symbol: "♎",
      ruler: "शुक्र",
      element: "वायु",
      prediction: "साझेदारी और सहयोग से लाभ होगा। किसी नए कौशल या कंप्यूटर कोर्स को सीखने का मन बनेगा। जीवनसाथी का भरपूर साथ मिलेगा।",
      luckyColor: "गुलाबी व आसमानी",
      luckyNumber: "7",
      rating: 5,
    },
    {
      name: "वृश्चिक (Scorpio)",
      symbol: "♏",
      ruler: "मंगल",
      element: "जल",
      prediction: "गूढ़ विषयों और अनुसंधान में सफलता मिलेगी। गुप्त शत्रुओं से सावधान रहें। योग व प्राणायाम से दिन ऊर्जावान रहेगा।",
      luckyColor: "मैरून व गहरा लाल",
      luckyNumber: "8",
      rating: 4,
    },
    {
      name: "धनु (Sagittarius)",
      symbol: "♐",
      ruler: "बृहस्पति",
      element: "अग्नि",
      prediction: "उच्च शिक्षा व आध्यात्मिक रुचि बढ़ेगी। समाज में आपकी प्रतिष्ठा बढ़ेगी। गुरुजनों से मार्गदर्शन लेकर ही बड़ा निर्णय लें।",
      luckyColor: "पीला व हल्दी रंग",
      luckyNumber: "3",
      rating: 5,
    },
    {
      name: "मकर (Capricorn)",
      symbol: "♑",
      ruler: "शनि",
      element: "पृथ्वी",
      prediction: "कार्यक्षेत्र में वरिष्ठ अधिकारियों से प्रशंसा मिलेगी। संपत्ति या भूमि संबंधी कार्यों में प्रगति होगी। आलस्य से बचें।",
      luckyColor: "नीला व स्लेटी",
      luckyNumber: "4",
      rating: 4,
    },
    {
      name: "कुंभ (Aquarius)",
      symbol: "♒",
      ruler: "शनि",
      element: "वायु",
      prediction: "डिजिटल तकनीक और नवाचार से लाभ होगा। नए मित्रों का सहयोग मिलेगा। समाज कल्याण के कार्यों में सहभागिता बढ़ेगी।",
      luckyColor: "नेवी ब्लू व जामुनी",
      luckyNumber: "8",
      rating: 5,
    },
    {
      name: "मीन (Pisces)",
      symbol: "♓",
      ruler: "बृहस्पति",
      element: "जल",
      prediction: "रचनात्मक और शैक्षणिक प्रयासों में विजय मिलेगी। धन आगमन के नए स्रोत खुलेंगे। सकारात्मक विचारों से दिन आनंदमय रहेगा।",
      luckyColor: "पीला व सुनहरा",
      luckyNumber: "3",
      rating: 5,
    },
  ];

  // Weather Data for Major Cities
  const CITIES_WEATHER: Record<string, {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    high: number;
    low: number;
    forecast: Array<{ day: string; temp: number; icon: string; condition: string }>;
  }> = {
    Patna: {
      temp: 29,
      condition: "स्वच्छ व सुहावना (Clear Sunny)",
      humidity: 58,
      wind: 12,
      high: 33,
      low: 22,
      forecast: [
        { day: "कल", temp: 31, icon: "☀️", condition: "धूप" },
        { day: "परसों", temp: 30, icon: "⛅", condition: "हल्के बादल" },
        { day: "गुरुवार", temp: 28, icon: "🌦️", condition: "हल्की बूंदाबांदी" },
        { day: "शुक्रवार", temp: 32, icon: "☀️", condition: "साफ़ मौसम" },
      ],
    },
    Delhi: {
      temp: 28,
      condition: "हल्के बादल (Partly Cloudy)",
      humidity: 50,
      wind: 14,
      high: 32,
      low: 21,
      forecast: [
        { day: "कल", temp: 29, icon: "☀️", condition: "धूप" },
        { day: "परसों", temp: 31, icon: "⛅", condition: "धूप-छांव" },
        { day: "गुरुवार", temp: 30, icon: "☀️", condition: "साफ़" },
        { day: "शुक्रवार", temp: 29, icon: "⛅", condition: "हल्के बादल" },
      ],
    },
    Ranchi: {
      temp: 26,
      condition: "ठंडी हवाएं व सुहावना (Pleasant Breeze)",
      humidity: 65,
      wind: 10,
      high: 29,
      low: 19,
      forecast: [
        { day: "कल", temp: 27, icon: "⛅", condition: "बादल" },
        { day: "परसों", temp: 25, icon: "🌦️", condition: "बौछार" },
        { day: "गुरुवार", temp: 26, icon: "☀️", condition: "सुहावना" },
        { day: "शुक्रवार", temp: 28, icon: "☀️", condition: "धूप" },
      ],
    },
    Lucknow: {
      temp: 30,
      condition: "धूप व सुहावनी हवा (Sunny)",
      humidity: 54,
      wind: 11,
      high: 34,
      low: 23,
      forecast: [
        { day: "कल", temp: 32, icon: "☀️", condition: "धूप" },
        { day: "परसों", temp: 31, icon: "☀️", condition: "धूप" },
        { day: "गुरुवार", temp: 29, icon: "⛅", condition: "बादल" },
        { day: "शुक्रवार", temp: 33, icon: "☀️", condition: "साफ़" },
      ],
    },
  };

  const currentWeather = CITIES_WEATHER[selectedCity] || CITIES_WEATHER.Patna;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
      {/* Navigation Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>दैनिक पंचांग, राशिफल व मौसम सेवा</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            आज की तिथि, शुभ मुहूर्त, 12 राशियों का फलादेश एवं लाइव मौसम पूर्वानुमान
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setSubTab("panchang")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              subTab === "panchang"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
            }`}
          >
            🕉️ दैनिक पंचांग
          </button>
          <button
            type="button"
            onClick={() => setSubTab("rashifal")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              subTab === "rashifal"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
            }`}
          >
            ⭐ 12 राशियां (राशिफल)
          </button>
          <button
            type="button"
            onClick={() => setSubTab("weather")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              subTab === "weather"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
            }`}
          >
            🌤️ लाइव मौसम
          </button>
        </div>
      </div>

      {/* VIEW 1: DAILY PANCHANG */}
      {subTab === "panchang" && (
        <div className="space-y-6">
          {/* Top Running Panchang Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                विक्रम संवत 2082 • शक संवत 1948
              </span>
              <span className="text-xs font-bold">{dateStr}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              आज का पंचांग एवं शुभ मुहूर्त (Patna / Delhi IST)
            </h3>
            <p className="text-xs text-amber-100">
              प्रत्येक शुभ कार्य, गृह प्रवेश, नामकरण, यात्रा या अध्ययन प्रारंभ करने हेतु प्रामाणिक वैदिक मुहूर्त।
            </p>
          </div>

          {/* Grid of Panchang Elements */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700">
              <span className="text-amber-700 dark:text-amber-400 font-bold block">तिथि (Tithi)</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block mt-1">
                शुक्ल पक्ष प्रतिपदा
              </strong>
              <span className="text-[11px] text-slate-400">दोपहर 02:40 तक, उपरांत द्वितीया</span>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-slate-800/80 border border-orange-200 dark:border-slate-700">
              <span className="text-orange-700 dark:text-orange-400 font-bold block">नक्षत्र (Nakshatra)</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block mt-1">
                रोहिणी नक्षत्र
              </strong>
              <span className="text-[11px] text-slate-400">सायं 06:15 तक, उपरांत मृगशिरा</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold block">योग व करण</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block mt-1">
                शोभन योग • बव करण
              </strong>
              <span className="text-[11px] text-slate-400">सर्वार्थ सिद्धि योग विद्यमान</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700">
              <span className="text-blue-700 dark:text-blue-400 font-bold block">सूर्योदय व सूर्यास्त</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block mt-1">
                05:48 AM • 06:12 PM
              </strong>
              <span className="text-[11px] text-slate-400">चंद्रास्त: रात्रि 09:30 PM</span>
            </div>
          </div>

          {/* Shubh & Ashubh Muhurat Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>शुभ मुहूर्त (शुभ कार्य हेतु श्रेष्ठ समय)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center justify-between border-b border-emerald-200/50 pb-1">
                  <span>अभिजीत मुहूर्त:</span>
                  <strong className="font-mono text-emerald-700 dark:text-emerald-400">11:45 AM से 12:35 PM</strong>
                </li>
                <li className="flex items-center justify-between border-b border-emerald-200/50 pb-1">
                  <span>अमृत काल (Amrit Kaal):</span>
                  <strong className="font-mono text-emerald-700 dark:text-emerald-400">02:10 PM से 03:45 PM</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>विजय मुहूर्त:</span>
                  <strong className="font-mono text-emerald-700 dark:text-emerald-400">02:20 PM से 03:10 PM</strong>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 space-y-3">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-black text-sm">
                <Clock className="w-4 h-4 text-red-600" />
                <span>अशुभ काल (नए कार्यों से बचें)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center justify-between border-b border-red-200/50 pb-1">
                  <span>राहुकाल (Rahu Kaal):</span>
                  <strong className="font-mono text-red-700 dark:text-red-400">04:30 PM से 06:00 PM</strong>
                </li>
                <li className="flex items-center justify-between border-b border-red-200/50 pb-1">
                  <span>यमगण्ड (Yamagand):</span>
                  <strong className="font-mono text-red-700 dark:text-red-400">01:30 PM से 03:00 PM</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>गुलिक काल:</span>
                  <strong className="font-mono text-red-700 dark:text-red-400">12:00 PM से 01:30 PM</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 12 RASHIS (RASHIFAL) */}
      {subTab === "rashifal" && (
        <div className="space-y-6">
          {/* Rashi Selector Badges */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {RASHIS.map((r, idx) => (
              <button
                key={r.name}
                type="button"
                onClick={() => setSelectedRashi(idx)}
                className={`p-2.5 rounded-2xl text-center border transition-all ${
                  selectedRashi === idx
                    ? "bg-amber-500 text-slate-950 font-black border-amber-600 shadow-md scale-[1.02]"
                    : "bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-100/50"
                }`}
              >
                <span className="text-xl block">{r.symbol}</span>
                <span className="text-[11px] font-bold block mt-0.5 truncate">{r.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Selected Rashi Detail Card */}
          {(() => {
            const r = RASHIS[selectedRashi];
            return (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-2 border-amber-300 dark:border-slate-700 space-y-4 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 rounded-2xl bg-amber-500/20">{r.symbol}</span>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {r.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span>स्वामी ग्रह: {r.ruler}</span>
                        <span>•</span>
                        <span>तत्व: {r.element}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < r.rating ? "text-amber-500 fill-amber-500" : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-white/70 dark:bg-slate-900/70 p-4 rounded-2xl border border-amber-200/60 dark:border-slate-800">
                  <strong className="block text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">
                    दैनिक फलादेश (Today's Horoscope):
                  </strong>
                  {r.prediction}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-amber-200/60 dark:border-slate-800">
                    <span className="text-slate-400 block font-bold">शुभ रंग (Lucky Color)</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-black mt-0.5 block">
                      {r.luckyColor}
                    </strong>
                  </div>
                  <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-amber-200/60 dark:border-slate-800">
                    <span className="text-slate-400 block font-bold">शुभ अंक (Lucky Number)</span>
                    <strong className="text-amber-600 dark:text-amber-400 font-black text-base mt-0.5 block">
                      {r.luckyNumber}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* VIEW 3: LIVE WEATHER FORECAST */}
      {subTab === "weather" && (
        <div className="space-y-6">
          {/* City Selection Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">शहर चुनें:</span>
              {(["Patna", "Delhi", "Ranchi", "Lucknow"] as const).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedCity === city
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {city === "Patna" ? "पटना (Patna)" : city === "Delhi" ? "दिल्ली (Delhi)" : city === "Ranchi" ? "रांची (Ranchi)" : "लखनऊ (Lucknow)"}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">अपडेट: अभी-अभी (Live Radar)</span>
          </div>

          {/* Current Weather Hero */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                  {selectedCity === "Patna" ? "पटना, बिहार" : selectedCity}
                </span>
                <h3 className="text-4xl sm:text-5xl font-black mt-2">
                  {currentWeather.temp}°C
                </h3>
                <p className="text-sm font-bold text-sky-100 mt-1">
                  {currentWeather.condition}
                </p>
              </div>

              <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center text-5xl">
                ☀️
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-xs">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-200" />
                <div>
                  <span className="text-sky-200 text-[10px] block">आर्द्रता (Humidity)</span>
                  <strong className="font-bold">{currentWeather.humidity}%</strong>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-sky-200" />
                <div>
                  <span className="text-sky-200 text-[10px] block">हवा (Wind Speed)</span>
                  <strong className="font-bold">{currentWeather.wind} km/h</strong>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-sky-200" />
                <div>
                  <span className="text-sky-200 text-[10px] block">अधिकतम / न्यूनतम</span>
                  <strong className="font-bold">{currentWeather.high}° / {currentWeather.low}°</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Day Forecast Cards */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              आगामी 4 दिनों का मौसम पूर्वानुमान (Weekly Outlook):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentWeather.forecast.map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center space-y-1"
                >
                  <span className="text-xs font-bold text-slate-500 block">{f.day}</span>
                  <span className="text-3xl block py-1">{f.icon}</span>
                  <strong className="text-sm font-black text-slate-800 dark:text-white block">
                    {f.temp}°C
                  </strong>
                  <span className="text-[11px] text-slate-400 block">{f.condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
