import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Award,
  ChevronRight,
  ExternalLink,
  Laptop,
  HelpCircle,
  Sparkles,
  RefreshCw,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";

export const CareerNcertJobs: React.FC = () => {
  const [sectionTab, setSectionTab] = useState<"career" | "ncert_gk" | "job_alerts">("career");

  // Mock Test State
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [answeredMap, setAnsweredMap] = useState<Record<number, number>>({});

  // 10 GK Mock Test Questions
  const GK_QUESTIONS = [
    {
      q: "भारत के वर्तमान मुख्य चुनाव आयुक्त कौन हैं या चुनाव आयोग का मुख्यालय कहाँ स्थित है?",
      options: ["मुंबई", "नई दिल्ली", "कोलकाता", "चेन्नई"],
      correct: 1,
      explanation: "भारत के चुनाव आयोग (ECI) का मुख्यालय 'निर्वाचन सदन', नई दिल्ली में स्थित है।",
    },
    {
      q: "बिहार की पहली महिला उपमुख्यमंत्री कौन बनी थीं?",
      options: ["राबड़ी देवी", "रेणु देवी", "मीसा भारती", "अनुग्रह नारायण"],
      correct: 1,
      explanation: "रेणु देवी वर्ष 2020 में बिहार की पहली महिला उप-मुख्यमंत्री बनी थीं।",
    },
    {
      q: "कंप्यूटर में ADCA का पूरा नाम क्या होता है?",
      options: [
        "Advanced Diploma in Computer Applications",
        "Associate Degree in Computer Algorithm",
        "Applied Diploma in Cyber Architecture",
        "Advanced Data and Cloud Automation",
      ],
      correct: 0,
      explanation: "ADCA का पूर्ण रूप 'Advance Diploma in Computer Applications' होता है जो 1 वर्ष का कोर्स है।",
    },
    {
      q: "RTPS बिहार पोर्टल के माध्यम से कौन सा प्रमाणपत्र ऑनलाइन बनाया जाता है?",
      options: ["जाति प्रमाणपत्र", "आवासीय (निवास) प्रमाणपत्र", "आय प्रमाणपत्र", "उपर्युक्त सभी"],
      correct: 3,
      explanation: "RTPS (Right to Public Services) बिहार पर जाति, आय, निवास व ईडब्ल्यूएस सभी प्रमाणपत्र बनते हैं।",
    },
    {
      q: "भारत में 'राष्ट्रीय युवा दिवस' (National Youth Day) किस तिथि को मनाया जाता है?",
      options: ["12 जनवरी (स्वामी विवेकानंद जयंती)", "23 जनवरी", "15 अगस्त", "2 अक्टूबर"],
      correct: 0,
      explanation: "12 जनवरी को स्वामी विवेकानंद जी के जन्मदिवस पर पूरे देश में राष्ट्रीय युवा दिवस मनाया जाता है।",
    },
    {
      q: "सूर्य से आने वाली हानिकारक पराबैंगनी (UV) किरणों से पृथ्वी की रक्षा कौन सी परत करती है?",
      options: ["ओजोन परत (Ozone Layer)", "क्षोभमंडल", "मध्यमंडल", "बहिर्मंडल"],
      correct: 0,
      explanation: "समताप मंडल में स्थित ओजोन परत (Ozone) पराबैंगनी किरणों को सोख लेती है।",
    },
    {
      q: "NCERT का मुख्यालय कहाँ स्थित है?",
      options: ["भोपाल", "नई दिल्ली", "वाराणसी", "बेंगलुरु"],
      correct: 1,
      explanation: "राष्ट्रीय शैक्षिक अनुसंधान और प्रशिक्षण परिषद (NCERT) का मुख्यालय नई दिल्ली में है।",
    },
    {
      q: "भारतीय संविधान का जनक किसे कहा जाता है?",
      options: ["डॉ. भीमराव अंबेडकर", "महात्मा गांधी", "डॉ. राजेंद्र प्रसाद", "सरदार पटेल"],
      correct: 0,
      explanation: "डॉ. बी. आर. अंबेडकर संविधान सभा की प्रारूप समिति के अध्यक्ष थे और उन्हें संविधान का जनक कहा जाता है।",
    },
    {
      q: "MS Excel में किसी सेल में फॉर्मूला शुरू करने के लिए किस चिह्न का प्रयोग किया जाता है?",
      options: ["=", "+", "@", "#"],
      correct: 0,
      explanation: "माइक्रोसॉफ्ट एक्सेल और गूगल शीट्स में सभी सूत्र बराबर (=) चिह्न से प्रारंभ होते हैं।",
    },
    {
      q: "भारत का राष्ट्रीय डिजिटल पहचान पत्र क्या है जिसमें 12 अंक होते हैं?",
      options: ["पैन कार्ड", "आधार कार्ड", "वोटर आईडी", "राशन कार्ड"],
      correct: 1,
      explanation: "UIDAI द्वारा जारी 12 अंकों का विशिष्ट पहचान पत्र आधार (Aadhaar) कार्ड है।",
    },
  ];

  const handleSelectAnswer = (optIndex: number) => {
    if (isTestSubmitted) return;
    setSelectedAnswer(optIndex);
    setAnsweredMap((prev) => ({ ...prev, [currentQuestion]: optIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < GK_QUESTIONS.length - 1) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      setSelectedAnswer(answeredMap[nextQ] !== undefined ? answeredMap[nextQ] : null);
    } else {
      // Calculate score and submit
      let correctCount = 0;
      GK_QUESTIONS.forEach((q, idx) => {
        if (answeredMap[idx] === q.correct) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setIsTestSubmitted(true);
    }
  };

  const handleRestartMockTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsTestSubmitted(false);
    setAnsweredMap({});
  };

  // Job Alerts List
  const JOB_ALERTS = [
    {
      id: "job_rpf",
      title: "रेलवे सुरक्षा बल (RPF कांस्टेबल व SI भर्ती 2026)",
      org: "भारतीय रेलवे भर्ती बोर्ड (RRB)",
      posts: "4,660 पद",
      qualification: "10वीं पास (कांस्टेबल) / स्नातक (सब-इंस्पेक्टर)",
      age: "18 से 28 वर्ष (नियमानुसार छूट)",
      lastDate: "30 मार्च 2026",
      status: "ऑनलाइन आवेदन जारी",
      statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      officialUrl: "https://www.rrbcdg.gov.in/",
    },
    {
      id: "job_ssc_gd",
      title: "SSC GD कांस्टेबल (BSF, CISF, CRPF, ITBP, SSB)",
      org: "कर्मचारी चयन आयोग (Staff Selection Commission)",
      posts: "26,146 पद",
      qualification: "10वीं कक्षा उत्तीर्ण (Matric Pass)",
      age: "18 से 23 वर्ष",
      lastDate: "15 अप्रैल 2026",
      status: "अधिसूचना जारी",
      statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
      officialUrl: "https://ssc.gov.in/",
    },
    {
      id: "job_bihar_police",
      title: "बिहार पुलिस कांस्टेबल व डायल 112 चालक सिपाही",
      org: "केंद्रीय चयन पर्षद (सिपाही भर्ती - CSBC)",
      posts: "19,400 पद",
      qualification: "12वीं (इंटरमीडिएट पास)",
      age: "18 से 25 वर्ष",
      lastDate: "25 अप्रैल 2026",
      status: "शीघ्र प्रारंभ",
      statusColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      officialUrl: "https://csbc.bihar.gov.in/",
    },
    {
      id: "job_bpsc_teacher",
      title: "BPSC शिक्षक भर्ती TRE 4.0 (कक्षा 1 से 12)",
      org: "बिहार लोक सेवा आयोग (BPSC)",
      posts: "85,000+ संभावित पद",
      qualification: "D.El.Ed / B.Ed + CTET / STET",
      age: "21 से 40 वर्ष",
      lastDate: "मई 2026 (अपेक्षित)",
      status: "कैलेंडर जारी",
      statusColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
      officialUrl: "https://www.bpsc.bih.nic.in/",
    },
    {
      id: "job_post_office",
      title: "डाक विभाग ग्रामीण डाक सेवक (India Post GDS)",
      org: "भारतीय डाक विभाग (Ministry of Communications)",
      posts: "30,000+ पद",
      qualification: "10वीं पास (गणित व अंग्रेजी सहित, बिना परीक्षा मेरिट)",
      age: "18 से 40 वर्ष",
      lastDate: "मई 2026",
      status: "वार्षिक चक्र",
      statusColor: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
      officialUrl: "https://indiapostgdsonline.gov.in/",
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>करियर गाइडेंस, NCERT बुक्स व भर्ती अलर्ट्स</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            10वीं/12वीं के बाद क्या करें, 1-वर्षीय ADCA कंप्यूटर गाइड, डेली मॉक टेस्ट व सरकारी नौकरी सूचना
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setSectionTab("career")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              sectionTab === "career"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
            }`}
          >
            🎓 करियर व ADCA गाइड
          </button>
          <button
            type="button"
            onClick={() => setSectionTab("ncert_gk")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              sectionTab === "ncert_gk"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
            }`}
          >
            📚 NCERT व मॉक टेस्ट
          </button>
          <button
            type="button"
            onClick={() => setSectionTab("job_alerts")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              sectionTab === "job_alerts"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
            }`}
          >
            📢 सरकारी नौकरी अलर्ट्स
          </button>
        </div>
      </div>

      {/* VIEW 1: CAREER & ADCA GUIDE */}
      {sectionTab === "career" && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
              IOIS आत्मनिर्भर युवा करियर परामर्श
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              10वीं व 12वीं पास छात्रों के लिए सर्वश्रेष्ठ करियर विकल्प
            </h3>
            <p className="text-xs text-indigo-100">
              सही समय पर सही मार्गदर्शन से आप अपनी पढ़ाई के साथ-साथ ऑनलाइन या ऑफलाइन स्वरोजगार प्रारंभ कर सकते हैं।
            </p>
          </div>

          {/* 10th vs 12th Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 10th Pass Roadmaps */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>10वीं (मैट्रिक) के बाद 5 मुख्य रास्ते:</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <strong className="text-blue-700 dark:text-blue-400 block font-bold">1. 11वीं-12वीं (इंटरमीडिएट):</strong>
                  <span>साइंस (PCM/PCB - इंजीनियरिंग व डॉक्टर), कॉमर्स (CA/बैंकिंग), आर्ट्स (UPSC, BPSC व सरकारी नौकरी)।</span>
                </li>
                <li className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <strong className="text-emerald-700 dark:text-emerald-400 block font-bold">2. पॉलिटेक्निक डिप्लोमा (3 वर्ष):</strong>
                  <span>इलेक्ट्रिकल, मैकेनिकल, सिविल या कंप्यूटर साइंस डिप्लोमा कर सीधे जूनियर इंजीनियर (JE) बनें।</span>
                </li>
                <li className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <strong className="text-amber-700 dark:text-amber-400 block font-bold">3. ITI ट्रेड कोर्स (1-2 वर्ष):</strong>
                  <span>इलेक्ट्रीशियन, फिटर, वेल्डर, COPA (कंप्यूटर ऑपरेटर) कर रेलवे लोको पायलट व मेट्रो में नौकरी।</span>
                </li>
                <li className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <strong className="text-purple-700 dark:text-purple-400 block font-bold">4. डिफेन्स (सेना भर्ती):</strong>
                  <span>भारतीय सेना (अग्निवेर जीडी), नेवी एमआर, कोस्टगार्ड नाविक में 10वीं पास पर सीधी भर्ती।</span>
                </li>
              </ul>
            </div>

            {/* 12th Pass Roadmaps */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>12वीं (इंटर) के बाद करियर विकल्प:</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <strong className="text-indigo-700 dark:text-indigo-400 block font-bold">1. प्रतियोगी सरकारी परीक्षाएं:</strong>
                  <span>SSC CHSL, SSC GD, रेलवे NTPC अंडरग्रेजुएट, बिहार पुलिस सिपाही, कोर्ट क्लर्क व स्टेनोग्राफर।</span>
                </li>
                <li className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <strong className="text-rose-700 dark:text-rose-400 block font-bold">2. डिफेन्स अधिकारी (NDA परीक्षा):</strong>
                  <span>UPSC NDA परीक्षा पास कर सीधे थल सेना, वायु सेना या नौसेना में लेफ्टिनेंट पद।</span>
                </li>
                <li className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <strong className="text-teal-700 dark:text-teal-400 block font-bold">3. डिग्री कोर्स (B.A / B.Sc / B.Com / BBA / BCA):</strong>
                  <span>स्नातक के साथ UPSC / BPSC / बैंक PO / रेलवे की तैयारी।</span>
                </li>
                <li className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <strong className="text-cyan-700 dark:text-cyan-400 block font-bold">4. शिक्षक प्रशिक्षण (D.El.Ed):</strong>
                  <span>12वीं के बाद 2-वर्षीय D.El.Ed कर CTET / BTET पास कर प्राथमिक शिक्षक बनें।</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ADCA Full Course Breakdown */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-850 border-2 border-amber-300 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  12 महीने का कंप्यूटर डिप्लोमा कोर्स
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  ADCA (Advance Diploma in Computer Applications) संपूर्ण पाठ्यक्रम
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700">
                <strong className="text-amber-700 dark:text-amber-400 block font-bold mb-1">
                  मॉड्यूल 1: फंडामेंटल्स व विंडोज़
                </strong>
                <span className="text-slate-600 dark:text-slate-300">
                  कंप्यूटर हार्डवेयर, सॉफ्टवेयर, MS Paint, Notepad, Wordpad, File & Folder प्रबंधन।
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700">
                <strong className="text-amber-700 dark:text-amber-400 block font-bold mb-1">
                  मॉड्यूल 2: MS Office सूट
                </strong>
                <span className="text-slate-600 dark:text-slate-300">
                  MS Word (दस्तावेज़), MS Excel (फॉर्मूले, शीट, डेटा एंट्री), MS PowerPoint (प्रेजेंटेशन)।
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700">
                <strong className="text-amber-700 dark:text-amber-400 block font-bold mb-1">
                  मॉड्यूल 3: टैली प्राइम व अकाउंटिंग
                </strong>
                <span className="text-slate-600 dark:text-slate-300">
                  Tally Prime, GST बिलिंग, लेजर निर्माण, वाउचर एंट्री, बैलेंस शीट व इन्वेंटरी।
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700">
                <strong className="text-amber-700 dark:text-amber-400 block font-bold mb-1">
                  मॉड्यूल 4: इंटरनेट, DTP व साइबर कैफ़े
                </strong>
                <span className="text-slate-600 dark:text-slate-300">
                  Photoshop, PageMaker, ऑनलाइन सरकारी फॉर्म, RTPS आवेदन, आधार डाउनलोड, फोटो कंप्रेसर।
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: NCERT BOOKS & DAILY GK MOCK TEST */}
      {sectionTab === "ncert_gk" && (
        <div className="space-y-6">
          {/* NCERT Class 1-12 Quick Library */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  NCERT ई-पाठशाला पाठ्यपुस्तकें (कक्षा 1 से 12)
                </h3>
              </div>
              <a
                href="https://ncert.nic.in/textbook.php"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>आधिकारिक NCERT वेबसाइट</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
              {[
                { title: "कक्षा 1-5", desc: "रिमझिम, मैरीगोल्ड, गणित का जादू", url: "https://ncert.nic.in/textbook.php" },
                { title: "कक्षा 6", desc: "वसंत, विज्ञान, हमारा अतीत", url: "https://ncert.nic.in/textbook.php" },
                { title: "कक्षा 7", desc: "गणित, विज्ञान, सामाजिक", url: "https://ncert.nic.in/textbook.php" },
                { title: "कक्षा 8", desc: "संसाधन एवं विकास, विज्ञान", url: "https://ncert.nic.in/textbook.php" },
                { title: "कक्षा 9-10", desc: "गणित, विज्ञान, क्षितिज", url: "https://ncert.nic.in/textbook.php" },
                { title: "कक्षा 11-12", desc: "भौतिकी, रसायन, इतिहास, भूगोल", url: "https://ncert.nic.in/textbook.php" },
              ].map((c, i) => (
                <a
                  key={i}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all block text-center group"
                >
                  <strong className="text-amber-700 dark:text-amber-400 font-bold block group-hover:text-amber-500">
                    {c.title}
                  </strong>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{c.desc}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Interactive Daily GK Mock Test */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-850 border-2 border-blue-200 dark:border-slate-700 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  IOIS डेली 10 प्रश्न सामान्य ज्ञान व करंट अफेयर्स टेस्ट
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  डेली ऑनलाइन मॉक टेस्ट (Daily Live Quiz)
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {!isTestSubmitted ? (
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    प्रश्न {currentQuestion + 1} of {GK_QUESTIONS.length}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRestartMockTest}
                    className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>पुनः टेस्ट दें (Restart)</span>
                  </button>
                )}
              </div>
            </div>

            {!isTestSubmitted ? (
              <div className="space-y-4">
                {/* Question Text */}
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  Q{currentQuestion + 1}. {GK_QUESTIONS[currentQuestion].q}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GK_QUESTIONS[currentQuestion].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(oIdx)}
                      className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedAnswer === oIdx
                          ? "bg-blue-600 text-white border-blue-700 shadow-md"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-50/60"
                      }`}
                    >
                      <span>
                        <strong className="mr-2">{String.fromCharCode(65 + oIdx)}.</strong>
                        {opt}
                      </span>
                      {selectedAnswer === oIdx && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>

                {/* Next / Submit Button */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] text-slate-400">
                    उत्तर चुनने के बाद अगला प्रश्न दबाएं।
                  </span>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                  >
                    <span>
                      {currentQuestion === GK_QUESTIONS.length - 1 ? "टेस्ट समाप्त करें (Submit)" : "अगला प्रश्न (Next)"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Results Screen */
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 mx-auto flex items-center justify-center text-2xl font-black">
                  {score >= 7 ? "🏆" : "👍"}
                </div>
                <div>
                  <h5 className="text-xl font-black text-slate-900 dark:text-white">
                    आपका टेस्ट परिणाम: {score} / {GK_QUESTIONS.length} अंक
                  </h5>
                  <p className="text-xs text-slate-500 mt-1">
                    {score >= 8
                      ? "उत्कृष्ट प्रदर्शन! आपकी सामान्य ज्ञान की तैयारी बहुत अच्छी है।"
                      : score >= 5
                      ? "अच्छा प्रयास! थोड़ा और अध्ययन करके आप 10 में से 10 प्राप्त कर सकते हैं।"
                      : "नियमित अध्ययन करें। प्रतिदिन NCERT और GK क्विज़ का अभ्यास करें।"}
                  </p>
                </div>

                {/* Review All Answers */}
                <div className="text-left space-y-2 max-h-64 overflow-y-auto pr-1">
                  {GK_QUESTIONS.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                        <span>{idx + 1}. {q.q}</span>
                        {answeredMap[idx] === q.correct ? (
                          <span className="text-emerald-600 font-bold">✓ सही</span>
                        ) : (
                          <span className="text-red-500 font-bold">✗ गलत</span>
                        )}
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        सही उत्तर: {q.options[q.correct]}
                      </div>
                      <div className="text-[10px] text-slate-400">{q.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: GOVERNMENT RECRUITMENT & JOB ALERTS */}
      {sectionTab === "job_alerts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              नवीनतम आधिकारिक सरकारी भर्ती अधिसूचनाएं (Live Job Updates):
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              • वास्तविक आधिकारिक लिंक
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {JOB_ALERTS.map((job) => (
              <div
                key={job.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">{job.org}</span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                      {job.title}
                    </h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 self-start sm:self-center ${job.statusColor}`}>
                    {job.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">कुल पद</span>
                    <strong className="text-slate-800 dark:text-slate-100">{job.posts}</strong>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">शैक्षणिक योग्यता</span>
                    <strong className="text-slate-800 dark:text-slate-100">{job.qualification}</strong>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">आयु सीमा</span>
                    <strong className="text-slate-800 dark:text-slate-100">{job.age}</strong>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">अंतिम तिथि</span>
                    <strong className="text-rose-600 dark:text-rose-400 font-bold">{job.lastDate}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    फॉर्म भरने से पूर्व विस्तृत आधिकारिक अधिसूचना अवश्य पढ़ें।
                  </span>
                  <a
                    href={job.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>आधिकारिक पोर्टल</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
