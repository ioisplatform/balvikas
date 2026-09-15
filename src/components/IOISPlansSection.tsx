import React, { useState } from "react";
import {
  Check,
  Award,
  Sparkles,
  Calculator,
  ShieldCheck,
  Users,
  ChevronRight,
  Bot,
  Zap,
  HelpCircle,
} from "lucide-react";
import { IOIS_PLANS } from "../data/learningData";
import { UserProfile, IOISPlan } from "../types";

interface IOISPlansSectionProps {
  user: UserProfile | null;
  onSelectPlan?: (planId: string) => void;
  language: "hi" | "en";
  onAskAI?: (plan: IOISPlan) => void;
}

export const IOISPlansSection: React.FC<IOISPlansSectionProps> = ({
  user,
  onSelectPlan,
  language,
  onAskAI,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "starter" | "career" | "reseller">("all");
  const [referralCount, setReferralCount] = useState<number>(10);
  const [calcPlanPrice, setCalcPlanPrice] = useState<number>(10);
  const [aiModalPlan, setAiModalPlan] = useState<IOISPlan | null>(null);

  // Exact plan-specific earning calculation from IOIS PDF
  const selectedPlan = IOIS_PLANS.find((p) => p.price === calcPlanPrice) || IOIS_PLANS[0];
  const directPayoutPerReferral = selectedPlan.directPayout || 7;
  const commissionPercent = selectedPlan.commissionPercent || 70;
  const directEarning = referralCount * directPayoutPerReferral;

  const filteredPlans = IOIS_PLANS.filter((p) => {
    if (selectedCategory === "all") return true;
    return p.category === selectedCategory;
  });

  const handleAskAI = (plan: IOISPlan) => {
    if (onAskAI) {
      onAskAI(plan);
    } else {
      setAiModalPlan(plan);
    }
  };

  return (
    <div className="space-y-8">
      {/* Official Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-black/20 backdrop-blur px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase text-amber-200">
              IOIS PLATFORM • Indian Online Income Supporting System
            </span>
            <span className="bg-yellow-400 text-yellow-950 px-3 py-1 rounded-full text-xs font-black">
              100% पारदर्शी डिजिटल लर्निंग
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            IOIS 7 Dynamic Master Plans
          </h1>

          <p className="text-sm sm:text-base text-amber-100 font-medium max-w-2xl leading-relaxed">
            ₹10 से लेकर ₹999 तक के प्रत्येक प्लान में वास्तविक डिजिटल रिसोर्सेज, ई-बुक्स और उच्च कमीशन पेआउट (50% से 70%) शामिल हैं। अपनी आवश्यकता और लक्ष्य के अनुसार सही प्लान का चयन करें और डिजिटल कौशल के साथ तत्काल आय प्राप्त करें।
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-amber-100">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/15">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>स्वदेशी डिजिटल स्वावलंबन नेटवर्क</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/15">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>इंस्टेंट पेआउट सीधे UPI / बैंक खाते में</span>
            </div>
          </div>
        </div>

        {user && (
          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div>
              <span className="text-amber-200 font-bold block">आपकी सक्रिय सदस्यता:</span>
              <span className="text-base font-black text-white">{user.planName}</span>
            </div>
            <div className="font-mono bg-white/15 px-3 py-1 rounded-lg">
              Unique ID: <strong className="text-yellow-300">{user.uniqueId}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {[
          { id: "all", label: "सभी 7 प्लान (All Plans)" },
          { id: "starter", label: "शुरुआती प्लान (₹10 - ₹49)" },
          { id: "career", label: "कैरियर व छात्र (₹99 - ₹299)" },
          { id: "reseller", label: "रीसेलर व मास्टर (₹499 - ₹999)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              selectedCategory === tab.id
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 7 Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const isUserPlan = user?.planId === plan.id;
          const isMaster = plan.isMasterTier || plan.price === 999;
          const isStarter = plan.price === 10;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                isMaster
                  ? "bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 text-white border-2 border-amber-400 shadow-2xl scale-102"
                  : isStarter
                  ? "bg-amber-50/50 dark:bg-slate-900/90 border-2 border-amber-400 shadow-xl"
                  : isUserPlan
                  ? "bg-emerald-50/40 dark:bg-slate-900/90 border-2 border-emerald-500 shadow-lg"
                  : "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:shadow-lg"
              }`}
            >
              {/* Top Banner Tag */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      isMaster
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-950"
                    }`}
                  >
                    {plan.planNumber || `PLAN ₹${plan.price}`}
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    {plan.badge}
                  </span>
                </div>

                {plan.subtitle && (
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    {plan.subtitle}
                  </span>
                )}

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="py-3 border-y border-slate-200 dark:border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-amber-600 dark:text-amber-400">
                      ₹{plan.price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {plan.priceSubtitle || "/ एकमुश्त (One-time)"}
                    </span>
                  </div>
                </div>

                {/* Instant Payout per Referral Box */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <span>
                      {isMaster
                        ? "प्रत्येक मास्टर रेफरल पर सीधा इंसेंटिव (Instant Payout):"
                        : "Instant Payout per Referral:"}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                    {plan.referralAmount}
                  </div>
                  <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 block font-medium">
                    (सफल सक्रियण पर तत्काल 100% पारदर्शी पेआउट)
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                    मुख्य विशेषताएं व अध्ययन किट:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Real Success Story Box */}
                {plan.story && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{plan.story.title}:</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{plan.story.text}"
                    </p>
                    {plan.story.author && (
                      <span className="block text-[10px] font-bold text-slate-400 text-right">
                        — {plan.story.author}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2">
                {isUserPlan ? (
                  <button
                    disabled
                    className="w-full py-3 bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-default shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>सक्रिय प्लान (Current Active Plan)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectPlan?.(plan.id)}
                    className={`w-full py-3 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                      isMaster
                        ? "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950"
                    }`}
                  >
                    <span>{plan.actionText || `ACTIVATE @ ₹${plan.price}`}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* AI Guidance Button */}
                <button
                  type="button"
                  onClick={() => handleAskAI(plan)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI से पूछें (Ask AI About This Plan)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Explanation Modal */}
      {aiModalPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    AI गाइड: {aiModalPlan.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    मूल्य: ₹{aiModalPlan.price} • पेआउट: {aiModalPlan.referralAmount}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAiModalPlan(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕ बंद करें
              </button>
            </div>

            <div className="p-4 bg-amber-50/60 dark:bg-slate-800/60 rounded-2xl border border-amber-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong>इस प्लान का मुख्य उद्देश्य:</strong> {aiModalPlan.description}
              </p>
              <p>
                <strong>अर्निंग मॉडल (Payout Breakdown):</strong> जब भी कोई नया सदस्य आपके यूनिक रेफरल लिंक या स्पॉन्सर आईडी से {aiModalPlan.name} (₹{aiModalPlan.price}) सक्रिय करेगा, आपको <strong>{aiModalPlan.referralAmount}</strong> का सीधा पेआउट तुरंत प्राप्त होगा।
              </p>
              {aiModalPlan.story && (
                <p className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 italic">
                  💡 सफलता का उदाहरण ({aiModalPlan.story.title}): "{aiModalPlan.story.text}"
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const pId = aiModalPlan.id;
                  setAiModalPlan(null);
                  onSelectPlan?.(pId);
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-colors"
              >
                ₹{aiModalPlan.price} में अभी सक्रिय करें →
              </button>
              <button
                onClick={() => setAiModalPlan(null)}
                className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                ठीक है
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Referral Income Calculator */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
              यूनिक रेफरल इनकम कैलकुलेटर (Plan-Wise Commission Calculator)
            </h3>
            <p className="text-xs text-slate-500">
              प्रत्येक प्लान की निश्चित कमीशन दर के अनुसार आपकी वास्तविक सीधी आय (50% से 70%):
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              प्लान चुनें (Select Plan)
            </label>
            <select
              value={calcPlanPrice}
              onChange={(e) => setCalcPlanPrice(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            >
              {IOIS_PLANS.map((p) => (
                <option key={p.id} value={p.price}>
                  ₹{p.price} - {p.name} ({p.commissionPercent}% = ₹{p.directPayout})
                </option>
              ))}
            </select>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
              इस प्लान का कमीशन: {commissionPercent}% (₹{directPayoutPerReferral} प्रति सदस्य)
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                रेफर किए गए सदस्य:
              </label>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                {referralCount} सदस्य
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={referralCount}
              onChange={(e) => setReferralCount(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
              <span>1</span>
              <span>25</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-slate-700 text-center shadow-inner">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
              आपकी सीधी अर्निंग ({commissionPercent}%):
            </span>
            <span className="text-3xl font-black text-emerald-800 dark:text-emerald-200 font-mono block my-0.5">
              ₹{directEarning.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              ({referralCount} सदस्य × ₹{directPayoutPerReferral} प्रति रेफरल)
            </span>
          </div>
        </div>

        {/* Plan Breakdown Matrix */}
        <div className="overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            📊 सभी 7 प्लान्स का आधिकारिक कमीशन व अर्निंग चार्ट:
          </h4>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="p-2">प्लान</th>
                <th className="p-2">नाम</th>
                <th className="p-2">मूल्य</th>
                <th className="p-2">कमीशन %</th>
                <th className="p-2">प्रति सदस्य कमाई</th>
                <th className="p-2">10 रेफरल</th>
                <th className="p-2">20 रेफरल</th>
                <th className="p-2">50 रेफरल</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {IOIS_PLANS.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-amber-50/40 dark:hover:bg-slate-800/50 ${
                    p.price === calcPlanPrice ? "bg-emerald-50/60 dark:bg-emerald-950/20 font-bold" : ""
                  }`}
                >
                  <td className="p-2 font-mono font-bold text-amber-600 dark:text-amber-400">{p.planNumber || `P#`}</td>
                  <td className="p-2 text-slate-800 dark:text-slate-200">{p.name}</td>
                  <td className="p-2 font-mono font-bold text-slate-700 dark:text-slate-300">₹{p.price}</td>
                  <td className="p-2 text-amber-600 dark:text-amber-400 font-semibold">{p.commissionPercent}%</td>
                  <td className="p-2 font-mono text-emerald-700 dark:text-emerald-400 font-bold">₹{p.directPayout}</td>
                  <td className="p-2 font-mono text-slate-700 dark:text-slate-300">₹{(p.directPayout * 10).toLocaleString("en-IN")}</td>
                  <td className="p-2 font-mono text-slate-700 dark:text-slate-300">₹{(p.directPayout * 20).toLocaleString("en-IN")}</td>
                  <td className="p-2 font-mono font-bold text-emerald-800 dark:text-emerald-300">₹{(p.directPayout * 50).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
