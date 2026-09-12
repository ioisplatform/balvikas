import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  RefreshCw,
  Laptop,
  LogOut,
  User,
  ShieldAlert,
  Award,
  Bell,
  HelpCircle,
} from "lucide-react";
import { UserProfile } from "../types";
import { IOISRunningHeader } from "./IOISRunningHeader";

interface HeaderProps {
  user: UserProfile | null;
  language: "hi" | "en";
  setLanguage: (lang: "hi" | "en") => void;
  darkMode: boolean;
  setDarkMode: (dm: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (s: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenDevices: () => void;
  onOpenAdmin: () => void;
  onOpenTutorial: () => void;
  onOpenNotifications: () => void;
  isSyncing: boolean;
  onManualSync: () => void;
  selectedGrade: string;
  setSelectedGrade: (g: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenDevices,
  onOpenAdmin,
  onOpenTutorial,
  onOpenNotifications,
  isSyncing,
  onManualSync,
  selectedGrade,
  setSelectedGrade,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: "dashboard", labelHi: "डैशबोर्ड", labelEn: "Dashboard", icon: "🏠" },
    { id: "pdf_viewer", labelHi: "बाल विकास के लिए अध्ययन सामग्री", labelEn: "Bal Vikas Study Material", icon: "📚" },
    { id: "services", labelHi: "IOIS सेवा पोर्टल", labelEn: "Services Portal", icon: "🌐" },
    { id: "hindi", labelHi: "हिंदी (वर्णमाला)", labelEn: "Hindi (Varnamala)", icon: "अ" },
    { id: "english", labelHi: "Good English", labelEn: "Good English", icon: "Aa" },
    { id: "math", labelHi: "गणित (Math)", labelEn: "Mathematics", icon: "123" },
    { id: "flashcards", labelHi: "चित्र ज्ञान (GK)", labelEn: "Flashcards (GK)", icon: "🦁" },
    { id: "drawing", labelHi: "ड्रॉइंग बॉक्स", labelEn: "Drawing Box", icon: "🎨" },
    { id: "stories", labelHi: "कहानियाँ", labelEn: "Stories", icon: "📖" },
    { id: "quiz", labelHi: "क्विज़ & बैज", labelEn: "Quiz & Badges", icon: "🏆" },
    { id: "chatbot", labelHi: "बाल गुरु AI", labelEn: "Bal Guru AI", icon: "🤖" },
    { id: "report", labelHi: "प्रगति पत्र", labelEn: "Report Card", icon: "📊" },
    { id: "plans", labelHi: "IOIS प्लान्स", labelEn: "IOIS Plans", icon: "💎" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-amber-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Official Running Ticker with IOIS Logo */}
      <IOISRunningHeader onJoinClick={onOpenAuth} showJoinBtn={!user} />

      {/* Top Banner with Unique ID, Grade Selector, and Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-amber-100/70 dark:border-slate-800/80 text-xs sm:text-sm">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-extrabold text-slate-800 dark:text-amber-400 tracking-tight text-base sm:text-lg">
              <span>IOIS बाल विकास</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                डिजिटल किट
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {language === "hi"
                ? "कक्षा 1 से 5 शैक्षणिक मंच • खेल-खेल में सीखें"
                : "Class 1 to 5 Fun Learning Educational Platform"}
            </p>
          </div>
        </div>

        {/* Grade Selector & User Unique ID */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Grade selection */}
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-slate-700">
            <span className="text-amber-700 dark:text-amber-400 font-medium text-xs">
              {language === "hi" ? "कक्षा:" : "Class:"}
            </span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-transparent font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
            </select>
          </div>

          {/* User ID display badge */}
          {user ? (
            <div
              onClick={onOpenDevices}
              title="Click to view connected devices & security"
              className="cursor-pointer group flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700/50 hover:shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-medium hidden md:inline">User ID:</span>
              <span className="font-mono font-bold tracking-wide text-xs group-hover:underline">
                {user.uniqueId}
              </span>
              <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.2 rounded font-semibold">
                ₹{user.planPrice}
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-sm shadow-amber-500/30 transition-transform active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>{language === "hi" ? "लॉगिन / पंजीकरण" : "Login / Register"}</span>
            </button>
          )}

          {/* Cloud Sync Indicator */}
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            title={language === "hi" ? "क्लाउड डेटा सिंक करें" : "Sync Cloud Data"}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-amber-500" : ""}`} />
            <span className="hidden lg:inline">{isSyncing ? "Syncing..." : "Cloud Sync"}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute Voice & Sound" : "Enable Voice & Sound"}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs transition-colors"
          >
            {language === "hi" ? "EN" : "हिन्दी"}
          </button>

          {/* Guided Tutorial Button */}
          <button
            onClick={onOpenTutorial}
            title={language === "hi" ? "ऐप ट्यूटोरियल देखें" : "View App Tutorial"}
            className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notification Preferences */}
          <button
            onClick={onOpenNotifications}
            title={language === "hi" ? "नोटिफिकेशन सेटिंग्स" : "Notification Settings"}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* User Account / Admin button */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-sm"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={onOpenAdmin}
                title="Admin Panel (IOISSYSTEM)"
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}

            {/* Profile Dropdown */}
            {showProfileMenu && user && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  <div className="mt-1 font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    ID: {user.uniqueId}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenDevices();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                >
                  <Laptop className="w-4 h-4 text-emerald-500" />
                  <span>{language === "hi" ? "मल्टी-डिवाइस लॉगिन (4)" : "Multi-Device Login (4)"}</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenAdmin();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>{language === "hi" ? "एडमिन पैनल (Admin)" : "Admin Panel"}</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === "hi" ? "लॉगआउट" : "Log Out"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1 sm:gap-2 py-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-amber-500 text-white shadow-sm shadow-amber-500/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 hover:text-amber-700 dark:hover:text-amber-400"
                }`}
              >
                <span>{item.icon}</span>
                <span>{language === "hi" ? item.labelHi : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
