import React, { useState } from "react";
import {
  Check,
  Award,
  Sparkles,
  Calculator,
  ShieldCheck,
  Users,
  ChevronRight,
} from "lucide-react";
import { IOIS_PLANS } from "../data/learningData";
import { UserProfile } from "../types";

interface IOISPlansSectionProps {
  user: UserProfile | null;
  onSelectPlan?: (planId: string) => void;
  language: "hi" | "en";
}

export const IOISPlansSection: React.FC<IOISPlansSectionProps> = ({
  user,
  onSelectPlan,
  language,
}) => {
  const [referralCount, setReferralCount] = useState<number>(10);
  const [calcPlanPrice, setCalcPlanPrice] = useState<number>(10);

  // Exact plan-specific earning calculation from IOIS PDF
  const selectedPlan = IOIS_PLANS.find((p) => p.price === calcPlanPrice) || IOIS_PLANS[0];
  const directPayoutPerReferral = selectedPlan.directPayout || 7;
  const commissionPercent = selectedPlan.commissionPercent || 70;
  const directEarning = referralCount * directPayoutPerReferral;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              IOIS Platform Membership Plans
            </span>
            <span className="bg-yellow-300 text-yellow-950 px-2 py-0.5 rounded-full text-xs font-extrabold">
              PDF Pages 42–48 Complete Breakdown
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            IOIS सदस्यता प्लान्स एवं आधिकारिक अर्निंग मॉडल
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1.5 max-w-xl">
            प्रत्येक प्लान की अपनी निश्चित कमीशन दर है (50% से 70%)। बाल विकास कक्षा 1 से 5 डिजिटल किट, लाइफटाइम एक्सेस और डायरेक्ट बैंक/UPI ट्रांसफर।
          </p>
        </div>

        {user && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right">
            <span className="text-xs text-amber-100 block">सक्रिय सदस्यता:</span>
            <span className="font-extrabold text-lg text-white block">{user.planName}</span>
            <span className="font-mono text-xs text-amber-200">ID: {user.uniqueId}</span>
          </div>
        )}
      </div>

      {/* 7 Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {IOIS_PLANS.map((plan, idx) => {
          const isUserPlan = user?.planId === plan.id;
          const isFeatured = plan.id === "bal_vikas_10";

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition-all relative ${
                isFeatured
                  ? "bg-white dark:bg-slate-800 border-2 border-amber-500 shadow-xl scale-102"
                  : isUserPlan
                  ? "bg-white dark:bg-slate-800 border-2 border-emerald-500 shadow-lg"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md"
              }`}
            >
              {isFeatured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-extrabold text-[10px] uppercase px-3 py-0.5 rounded-full shadow">
                  सर्वाधिक लोकप्रिय (Most Popular)
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Plan #{idx + 1}
                  </span>
                  <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 mt-0.5">
                    {plan.name}
                  </h3>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {plan.badge}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 py-2 border-y border-slate-100 dark:border-slate-700/60">
                  <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 font-mono">
                    ₹{plan.price}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ एकमुश्त (One-time)</span>
                </div>

                {/* Features list */}
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <div className="p-2.5 bg-amber-50 dark:bg-slate-900 rounded-xl mb-3 text-[11px] text-amber-800 dark:text-amber-300 font-semibold text-center">
                  रेफरल अर्निंग: {plan.referralAmount} ({plan.referralRate} कमीशन)
                </div>

                {isUserPlan ? (
                  <button
                    disabled
                    className="w-full py-2 bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-default"
                  >
                    <Check className="w-4 h-4" />
                    <span>सक्रिय प्लान (Active)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectPlan?.(plan.id)}
                    className="w-full py-2 bg-slate-100 hover:bg-amber-500 dark:bg-slate-700 dark:hover:bg-amber-500 text-slate-800 dark:text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    प्लान चुनें (Select Plan)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Referral Income Calculator (PDF Page 48) */}
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
              प्रत्येक प्लान की निश्चित कमीशन दर के अनुसार आपकी वास्तविक सीधी आय (हर प्लान पर फ्लैट 70% नहीं):
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
                <th className="p-2">प्लान का नाम</th>
                <th className="p-2">मूल्य</th>
                <th className="p-2">कमीशन %</th>
                <th className="p-2">प्रति सदस्य कमाई</th>
                <th className="p-2">10 रेफरल</th>
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
                  <td className="p-2 text-slate-800 dark:text-slate-200">{p.name}</td>
                  <td className="p-2 font-mono font-bold text-slate-700 dark:text-slate-300">₹{p.price}</td>
                  <td className="p-2 text-amber-600 dark:text-amber-400 font-semibold">{p.commissionPercent}%</td>
                  <td className="p-2 font-mono text-emerald-700 dark:text-emerald-400 font-bold">₹{p.directPayout}</td>
                  <td className="p-2 font-mono text-slate-700 dark:text-slate-300">₹{(p.directPayout * 10).toLocaleString("en-IN")}</td>
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
