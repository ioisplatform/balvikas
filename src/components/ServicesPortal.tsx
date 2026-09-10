import React, { useState, useEffect } from "react";
import {
  Globe,
  ExternalLink,
  Search,
  Sparkles,
  Landmark,
  BookOpen,
  CloudSun,
  Tv,
  Calendar,
  CreditCard,
  PhoneCall,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Award,
  Layers,
} from "lucide-react";
import { PlatformService, UserProfile } from "../types";
import { playAudioText } from "../utils/speech";

interface ServicesPortalProps {
  user: UserProfile | null;
  language: "hi" | "en";
  soundEnabled: boolean;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
}

export const ServicesPortal: React.FC<ServicesPortalProps> = ({
  user,
  language,
  soundEnabled,
  onOpenAdmin,
  onOpenAuth,
}) => {
  const [services, setServices] = useState<PlatformService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch {
      // Fallback local services
      setServices([
        {
          id: "srv_bal_vikas",
          titleHi: "बाल विकास 48 पृष्ठ डिजिटल किट",
          titleEn: "Bal Vikas 48-Page Kit",
          category: "education",
          description: "कक्षा 1 से 5 के लिए संपूर्ण बुनियादी शैक्षणिक सामग्री, मनोहर पोथी एवं गुड इंग्लिश।",
          icon: "BookOpen",
          link: "#pdf_viewer",
          badge: "Featured",
          active: true,
        },
        {
          id: "srv_rtps",
          titleHi: "बिहार लोक सेवाएं (RTPS Bihar)",
          titleEn: "RTPS Bihar Public Services",
          category: "gov",
          description: "जाति, आय, निवास प्रमाण पत्र एवं अन्य नागरिक सेवाओं का आधिकारिक पोर्टल।",
          icon: "Landmark",
          link: "https://serviceonline.bihar.gov.in/",
          badge: "आधिकारिक",
          active: true,
        },
        {
          id: "srv_land",
          titleHi: "बिहार भूमि जानकारी एवं दाखिल खारिज",
          titleEn: "Bihar Bhumi Land Records",
          category: "gov",
          description: "ऑनलाइन दाखिल-खारिज, जमाबंदी पंजी, भू-नक्शा एवं भूमि रिकॉर्ड्स की स्थिति देखें।",
          icon: "Landmark",
          link: "https://biharbhumi.bihar.gov.in/",
          badge: "Direct",
          active: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const playSpeech = (text: string) => {
    if (soundEnabled) {
      playAudioText(text, "hi-IN");
    }
  };

  const categories = [
    { id: "all", labelHi: "सभी सेवाएं (All)", icon: Layers },
    { id: "education", labelHi: "शिक्षा किट (Edu)", icon: BookOpen },
    { id: "gov", labelHi: "सरकारी पोर्टल (Gov)", icon: Landmark },
    { id: "utilities", labelHi: "दैनिक उपयोगिता (Utils)", icon: Sparkles },
    { id: "entertainment", labelHi: "टीवी व समाचार (Media)", icon: Tv },
    { id: "income", labelHi: "आय व प्लान्स (Income)", icon: CreditCard },
  ];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === "all" || srv.category === selectedCategory;
    const matchesSearch =
      srv.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur border border-white/30 text-xs font-black">
            <Globe className="w-3.5 h-3.5" />
            <span>IOIS यूनिफाइड सर्विस नेटवर्क</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            डिजिटल सेवा एवं जनोपयोगी पोर्टल
          </h2>

          <p className="text-xs sm:text-sm text-amber-50/90 leading-relaxed">
            कक्षा 1 से 5 की बाल विकास शिक्षा सामग्री से लेकर सरकारी योजनाएं, RTPS, भूमि रिकॉर्ड्स, मौसम, समाचार और आय प्रबंधन की सभी सेवाएं एक ही मंच पर।
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => playSpeech("आई ओ आई एस डिजिटल सेवा पोर्टल में आपका स्वागत है।")}
              className="px-4 py-2 rounded-xl bg-white text-amber-700 font-extrabold text-xs shadow hover:bg-amber-50 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>पोर्टल गाइड सुनें</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 rounded-xl bg-black/20 hover:bg-black/30 border border-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4" />
              <span>एडमिन सेवा प्रबंधन (Manage Services)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.labelHi}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Refresh */}
        <div className="flex items-center gap-2 w-full sm:w-72">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="सेवा का नाम या विषय खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={fetchServices}
            disabled={loading}
            title="ताज़ा करें"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">सेवाएं लोड की जा रही हैं...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-16 text-center p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
          <Globe className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">
            कोई सेवा नहीं मिली
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            खोज शब्द बदलकर पुनः प्रयास करें या एडमिन कंसोल से नयी सेवा जोड़ें।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="group p-5 bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>

                  {srv.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                      {srv.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {srv.titleHi}
                  </h4>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {srv.titleEn}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  {srv.category}
                </span>

                <a
                  href={srv.link}
                  target={srv.link.startsWith("http") ? "_blank" : "_self"}
                  rel={srv.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-500 hover:text-white text-amber-700 dark:text-amber-300 font-bold text-xs transition-colors shadow-sm"
                >
                  <span>सेवा खोलें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
