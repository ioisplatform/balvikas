import React from "react";
import { BookOpen, Sparkles, PhoneCall } from "lucide-react";

interface IOISRunningHeaderProps {
  onJoinClick?: () => void;
  showJoinBtn?: boolean;
}

export const IOISRunningHeader: React.FC<IOISRunningHeaderProps> = ({
  onJoinClick,
  showJoinBtn = true,
}) => {
  return (
    <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-800 text-white shadow-md border-b-2 border-amber-300 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center h-10 px-2 sm:px-4">
        {/* Fixed Left IOIS Logo */}
        <div className="flex items-center gap-2 shrink-0 bg-red-900/90 px-2.5 py-1 rounded-lg border border-amber-400/60 mr-3 shadow-sm z-10">
          <div className="w-6 h-6 rounded-md bg-amber-400 text-red-950 flex items-center justify-center font-black text-xs shadow">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1 font-black text-xs tracking-wider">
            <span className="text-amber-300">IOIS</span>
            <span className="text-[11px] text-white font-bold hidden sm:inline">
              बाल विकास मंच
            </span>
          </div>
        </div>

        {/* Continuous Running Heading Ticker (Marquee) */}
        <div className="flex-1 overflow-hidden relative flex items-center">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-8 font-semibold text-xs text-amber-50">
            <span className="inline-flex items-center gap-1.5 font-extrabold text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
              <span>
                विशेष सूचना: जिसने ज्वाइन नहीं किया वह तुरंत ₹10 से नया रजिस्ट्रेशन करें और अपनी डिजिटल आईडी व संपूर्ण 48 पृष्ठ अध्ययन सामग्री प्राप्त करें!
              </span>
            </span>
            <span className="text-white/60">•</span>
            <span>
              IOIS बाल विकास डिजिटल किट: कक्षा 1 से 5 NCERT आधारित संपूर्ण पाठ्यक्रम (मनोहर पोथी, गुड इंग्लिश व 1-20 पहाड़े)
            </span>
            <span className="text-white/60">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-200 font-bold">
              <span>लाइफटाइम डिजिटल आईडी कार्ड व 70% तक डायरेक्ट पेआउट</span>
            </span>
            <span className="text-white/60">•</span>
            <span className="inline-flex items-center gap-1 text-amber-200 font-mono font-bold">
              <PhoneCall className="w-3 h-3" />
              <span>24x7 हेल्पलाइन: +91 8877490845</span>
            </span>
            <span className="text-white/60">•</span>
            <span className="font-mono text-amber-300">
              आधिकारिक पोर्टल: www.ioisplatform.github.io
            </span>
          </div>
        </div>

        {/* Optional Right Action Button */}
        {showJoinBtn && onJoinClick && (
          <button
            onClick={onJoinClick}
            className="shrink-0 ml-3 px-2.5 py-1 bg-amber-300 hover:bg-amber-400 text-red-950 font-black text-[11px] rounded-lg shadow transition-transform active:scale-95 flex items-center gap-1 z-10"
          >
            <span>₹10 में ज्वाइन करें</span>
          </button>
        )}
      </div>
    </div>
  );
};
