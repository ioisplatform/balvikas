import React, { useState } from "react";
import {
  Shield,
  FileText,
  AlertTriangle,
  PhoneCall,
  Mail,
  MapPin,
  Lock,
  HeartHandshake,
  CheckCircle2,
  Info,
} from "lucide-react";

export const LegalPoliciesSection: React.FC<{ initialTab?: string }> = ({ initialTab = "about" }) => {
  const [activeTab, setActiveTab] = useState<
    "about" | "privacy" | "terms" | "disclaimer" | "contact" | "parental"
  >(initialTab as any);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
      {/* Top Header & Tab switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            नीतियां, नियम एवं संपर्क विवरण
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            IOIS नेशनल प्लेटफॉर्म की आधिकारिक गाइडलाइंस, कानूनी नीतियां व अभिभावक मार्गदर्शन
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-bold">
          {[
            { id: "about", label: "हमारे बारे में" },
            { id: "privacy", label: "गोपनीयता नीति" },
            { id: "terms", label: "नियम व शर्तें" },
            { id: "disclaimer", label: "अस्वीकरण" },
            { id: "contact", label: "संपर्क करें" },
            { id: "parental", label: "अभिभावक सुरक्षा" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ABOUT US */}
      {activeTab === "about" && (
        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
            <h3 className="text-base font-black text-amber-900 dark:text-amber-200 mb-1">
              IOIS - Indian Online Income Supporting System
            </h3>
            <p>
              IOIS एक समर्पित गैर-सरकारी डिजिटल शैक्षणिक, करियर परामर्श एवं युवा आत्मनिर्भरता मंच है। इसका मुख्य उद्देश्य भारत के ग्रामीण व शहरी क्षेत्रों के विद्यार्थियों, अभिभावकों एवं युवाओं को आधुनिक डिजिटल शिक्षा, 700+ पृष्ठों की बाल विकास अध्ययन सामग्री, बुनियादी कंप्यूटर ज्ञान एवं आत्मनिर्भर आय के अवसर प्रदान करना है।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white font-bold block">1. डिजिटल साक्षरता:</strong>
              <span>कक्षा 1 से 5 के बच्चों के लिए आधुनिक विजुअल लर्निंग, मनोहर पोथी, सामान्य ज्ञान और नैतिक शिक्षा।</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white font-bold block">2. युवा स्वरोजगार:</strong>
              <span>घर बैठे वैध एफिलिएट एवं रेफरल प्रोग्राम द्वारा युवाओं को 70% तक प्रत्यक्ष सपोर्ट पेआउट।</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white font-bold block">3. जन-जागरूकता हब:</strong>
              <span>RTPS बिहार, सरकारी भर्ती, जमीन दाखिल-खारिज और आवश्यक नागरिक सेवाओं की सही जानकारी।</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRIVACY POLICY */}
      {activeTab === "privacy" && (
        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>गोपनीयता नीति (Privacy Policy)</span>
          </div>

          <p>
            हम आपकी निजता (Privacy) का अत्यंत आदर करते हैं। IOIS पोर्टल पर पंजीकृत किसी भी सदस्य का नाम, मोबाइल नंबर, ईमेल या UPI विवरण किसी भी तीसरे पक्ष (Third Party) के साथ व्यावसायिक लाभ हेतु साझा नहीं किया जाता है।
          </p>

          <ul className="list-disc list-inside space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <li><strong>डेटा सुरक्षा:</strong> सभी लॉगिन क्रेडेंशियल 256-बिट एन्क्रिप्शन के साथ सुरक्षित रखे जाते हैं।</li>
            <li><strong>फोटो व दस्तावेज़:</strong> फोटो कंप्रेसर टूल में प्रोसेस की जाने वाली कोई भी इमेज सर्वर पर स्टोर नहीं होती; वह आपके ब्राउज़र में ही कंप्रेस होती है।</li>
            <li><strong>UPI लेन-देन:</strong> डायरेक्ट पेआउट व सत्यापन के लिए केवल प्रमाणित बैंकिंग गेटवे व सीधे UPI ऐप्स का उपयोग होता है।</li>
          </ul>
        </div>
      )}

      {/* 3. TERMS OF SERVICE */}
      {activeTab === "terms" && (
        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>नियम एवं शर्तें (Terms of Service)</span>
          </div>

          <ul className="space-y-2.5">
            <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-white block font-bold">1. सदस्यता एवं डिजिटल किट:</strong>
              सदस्यता शुल्क (जैसे ₹10 बेसिक बाल विकास प्लान) 700+ पृष्ठों की डिजिटल ई-बुक व अध्ययन किट के लिए लिया जाता है जो अपरिवर्तनीय (Non-refundable) डिजिटल सेवा है।
            </li>
            <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-white block font-bold">2. रेफरल एवं पेआउट:</strong>
              रेफरल आय का भुगतान व्यवस्थापक द्वारा UTR व ट्रांजैक्शन की पुष्टि के उपरांत सीधे सदस्य की पंजीकृत UPI ID पर भेजा जाता है।
            </li>
            <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-white block font-bold">3. आचार संहिता:</strong>
              किसी भी सदस्य द्वारा भ्रामक जानकारी फैलाने या नकली स्क्रीनशॉट अपलोड करने पर उनकी सदस्य आईडी तुरंत निलंबित की जा सकती है।
            </li>
          </ul>
        </div>
      )}

      {/* 4. DISCLAIMER */}
      {activeTab === "disclaimer" && (
        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>महत्वपूर्ण अस्वीकरण सूचना (Statutory Disclaimer)</span>
            </div>
            <p className="font-medium">
              <strong>IOIS (Indian Online Income Supporting System)</strong> एक स्वतंत्र, गैर-सरकारी, निजी डिजिटल शैक्षणिक एवं सामाजिक जन-जागरूकता पोर्टल है। यह किसी भी केंद्रीय या राज्य सरकारी विभाग, मंत्रालय, RTPS या आयोग का आधिकारिक पोर्टल नहीं है।
            </p>
            <p>
              इस पोर्टल पर प्रदान की जाने वाली सरकारी सेवाओं (जैसे RTPS, आधार, पैन, जमीन, राशन कार्ड, भर्ती) की जानकारी केवल जन-सहायता व मार्गदर्शन के उद्देश्य से दी गई है। सरकारी आवेदनों के लिए उपयोगकर्ता हमेशा संबंधित सरकारी विभागों की आधिकारिक वेबसाइटों का ही उपयोग करें।
            </p>
          </div>
        </div>
      )}

      {/* 5. CONTACT US */}
      {activeTab === "contact" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <PhoneCall className="w-6 h-6 text-emerald-600" />
              <strong className="block text-sm font-bold text-slate-900 dark:text-white">
                हेल्पलाइन एवं व्हाट्सएप
              </strong>
              <div className="font-mono text-base font-bold text-emerald-600">
                +91 8877490845
              </div>
              <p className="text-slate-400 text-[11px]">
                सोमवार से शनिवार: सुबह 9:00 AM से शाम 7:00 PM तक
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <strong className="block text-sm font-bold text-slate-900 dark:text-white">
                आधिकारिक ईमेल आईडी
              </strong>
              <div className="font-mono text-sm font-bold text-blue-600">
                ioisplatform@gmail.com
              </div>
              <p className="text-slate-400 text-[11px]">
                किसी भी तकनीकी सहायता या आईडी एक्टिवेशन हेतु ईमेल करें।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <MapPin className="w-6 h-6 text-amber-600" />
              <strong className="block text-sm font-bold text-slate-900 dark:text-white">
                मुख्यालय पता (Head Office)
              </strong>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                IOIS डिजिटल हब, गांधी मैदान रोड, पटना, बिहार - 800001
              </p>
              <p className="text-slate-400 text-[11px]">
                डिजिटल इंडिया व आत्मनिर्भर युवा मिशन
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. PARENTAL GUIDANCE */}
      {activeTab === "parental" && (
        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <HeartHandshake className="w-4 h-4 text-rose-500" />
            <span>अभिभावक सुरक्षा व बाल मार्गदर्शन (Parental Safety)</span>
          </div>

          <p>
            IOIS बाल विकास किट विशेष रूप से 3 से 12 वर्ष के बच्चों के मानसिक एवं नैतिक विकास को ध्यान में रखकर तैयार की गई है:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <strong className="text-emerald-800 dark:text-emerald-300 font-bold block mb-1">
                ✓ 100% सुरक्षित सामग्री:
              </strong>
              <span>किसी भी प्रकार का अनुचित विज्ञापन, बाहरी लिंक या अनुपयुक्त सामग्री पूर्णतः वर्जित है।</span>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <strong className="text-blue-800 dark:text-blue-300 font-bold block mb-1">
                ✓ स्क्रीन टाइम संतुलन:
              </strong>
              <span>ऑडियो-विजुअल पाठों के साथ-साथ मुद्रण योग्य (Printable) वर्कबुक्स दी जाती हैं जिससे बच्चे पेन-पेंसिल से अभ्यास करें।</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
