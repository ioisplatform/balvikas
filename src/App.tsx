import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { HindiSection } from "./components/HindiSection";
import { EnglishSection } from "./components/EnglishSection";
import { FlashcardsSection } from "./components/FlashcardsSection";
import { MathSection } from "./components/MathSection";
import { DrawingBox } from "./components/DrawingBox";
import { AiChatbot } from "./components/AiChatbot";
import { QuizSection } from "./components/QuizSection";
import { StudentReport } from "./components/StudentReport";
import { IOISPlansSection } from "./components/IOISPlansSection";
import { PdfViewerSection } from "./components/PdfViewerSection";
import { ServicesPortal } from "./components/ServicesPortal";
import { AuthModal } from "./components/AuthModal";
import { DeviceSecurityModal } from "./components/DeviceSecurityModal";
import { AdminPanel } from "./components/AdminPanel";
import { TutorialModal } from "./components/TutorialModal";
import { NotificationSettings } from "./components/NotificationSettings";
import { UserProfile, StudentProgress, DrawingItem } from "./types";
import { DIGITAL_BADGES } from "./data/learningData";
import { playAudioText } from "./utils/speech";

export default function App() {
  // App State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("iois_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [language, setLanguage] = useState<"hi" | "en">("hi");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("iois_dark_mode") === "true";
    } catch {
      return false;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedGrade, setSelectedGrade] = useState<string>("Class 1");
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isDevicesOpen, setIsDevicesOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Student Progress
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const defaultProgress: StudentProgress = {
      userId: user?.uniqueId || "guest",
      hindiProgress: 35,
      englishProgress: 25,
      mathProgress: 20,
      drawingCount: 1,
      quizzesCompleted: 1,
      quizAccuracy: 80,
      studyTimeMinutes: 45,
      streakDays: 3,
      badges: ["badge_varnamala_champ"],
      savedDrawings: [],
      classGrade: "Class 1",
      hindiLettersLearned: ["अ", "आ", "इ", "ई", "क", "ख"],
      englishLettersLearned: ["A", "B", "C"],
      mathCompleted: false,
      drawingsCount: 1,
      badgesUnlocked: ["badge_varnamala_champ"],
      quizTotalQuestions: 5,
      quizCorrectAnswers: 4,
      lastActive: new Date().toISOString(),
    };

    try {
      const saved = localStorage.getItem("iois_progress");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultProgress,
          ...parsed,
          hindiLettersLearned: Array.isArray(parsed?.hindiLettersLearned)
            ? parsed.hindiLettersLearned
            : defaultProgress.hindiLettersLearned,
          englishLettersLearned: Array.isArray(parsed?.englishLettersLearned)
            ? parsed.englishLettersLearned
            : defaultProgress.englishLettersLearned,
          badgesUnlocked: Array.isArray(parsed?.badgesUnlocked)
            ? parsed.badgesUnlocked
            : defaultProgress.badgesUnlocked,
          drawingsCount: typeof parsed?.drawingsCount === "number"
            ? parsed.drawingsCount
            : (typeof parsed?.drawingCount === "number" ? parsed.drawingCount : 1),
          quizTotalQuestions: typeof parsed?.quizTotalQuestions === "number" ? parsed.quizTotalQuestions : 5,
          quizCorrectAnswers: typeof parsed?.quizCorrectAnswers === "number" ? parsed.quizCorrectAnswers : 4,
        };
      }
    } catch {
      // ignore
    }
    return defaultProgress;
  });

  // Saved Artworks
  const [savedDrawings, setSavedDrawings] = useState<DrawingItem[]>(() => {
    try {
      const saved = localStorage.getItem("iois_drawings");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Toggle Dark Mode Class on Document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("iois_dark_mode", String(darkMode));
    } catch {
      // ignore
    }
  }, [darkMode]);

  // Sync Progress to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("iois_progress", JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Sync User to LocalStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("iois_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("iois_user");
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Sync Drawings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("iois_drawings", JSON.stringify(savedDrawings));
    } catch {
      // ignore
    }
  }, [savedDrawings]);

  // Backend Cloud Synchronization
  const syncToCloud = async (customProgress?: StudentProgress, customDrawings?: DrawingItem[]) => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueId: user.uniqueId,
          progress: customProgress || progress,
          drawings: customDrawings || savedDrawings,
        }),
      });
    } catch (err) {
      console.warn("Cloud sync offline fallback active", err);
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  // Progress Handlers
  const handleLetterLearned = (letter: string) => {
    const isHindi = !/^[A-Za-z]$/.test(letter);
    if (isHindi) {
      if (!progress.hindiLettersLearned.includes(letter)) {
        const updated = {
          ...progress,
          hindiLettersLearned: [...progress.hindiLettersLearned, letter],
        };
        setProgress(updated);
        syncToCloud(updated);
      }
    } else {
      if (!progress.englishLettersLearned.includes(letter)) {
        const updated = {
          ...progress,
          englishLettersLearned: [...progress.englishLettersLearned, letter],
        };
        setProgress(updated);
        syncToCloud(updated);
      }
    }
  };

  const handleUnlockBadge = (badgeId: string) => {
    if (!progress.badgesUnlocked.includes(badgeId)) {
      const updated = {
        ...progress,
        badgesUnlocked: [...progress.badgesUnlocked, badgeId],
      };
      setProgress(updated);
      syncToCloud(updated);
      if (soundEnabled) playAudioText("बधाई हो! आपको नया डिजिटल बैज मिला है!", "hi-IN");
    }
  };

  const handleRecordQuizScore = (correct: number, total: number) => {
    const updated = {
      ...progress,
      quizTotalQuestions: progress.quizTotalQuestions + total,
      quizCorrectAnswers: progress.quizCorrectAnswers + correct,
    };
    setProgress(updated);
    syncToCloud(updated);
  };

  const handleSaveDrawing = (art: DrawingItem) => {
    const updated = [art, ...savedDrawings];
    setSavedDrawings(updated);
    const updatedProg = {
      ...progress,
      drawingsCount: updated.length,
    };
    setProgress(updatedProg);
    handleUnlockBadge("badge_art_master");
    syncToCloud(updatedProg, updated);
  };

  const handleDeleteDrawing = (id: string) => {
    const updated = savedDrawings.filter((d) => d.id !== id);
    setSavedDrawings(updated);
    const updatedProg = {
      ...progress,
      drawingsCount: updated.length,
    };
    setProgress(updatedProg);
    syncToCloud(updatedProg, updated);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("iois_user");
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Global Header */}
      <Header
        user={user}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenDevices={() => setIsDevicesOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        isSyncing={isSyncing}
        onManualSync={() => syncToCloud()}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
      />

      {/* Main View Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === "dashboard" && (
          <Dashboard
            user={user}
            progress={progress}
            selectedGrade={selectedGrade}
            language={language}
            soundEnabled={soundEnabled}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenDevices={() => setIsDevicesOpen(true)}
          />
        )}

        {activeTab === "pdf_viewer" && (
          <PdfViewerSection
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            language={language}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === "services" && (
          <ServicesPortal
            user={user}
            language={language}
            soundEnabled={soundEnabled}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === "hindi" && (
          <HindiSection
            language={language}
            soundEnabled={soundEnabled}
            onLetterLearned={handleLetterLearned}
          />
        )}

        {activeTab === "english" && (
          <EnglishSection
            language={language}
            soundEnabled={soundEnabled}
            onLetterLearned={handleLetterLearned}
          />
        )}

        {activeTab === "math" && (
          <MathSection
            language={language}
            soundEnabled={soundEnabled}
            selectedGrade={selectedGrade}
          />
        )}

        {activeTab === "flashcards" && (
          <FlashcardsSection language={language} soundEnabled={soundEnabled} />
        )}

        {activeTab === "drawing" && (
          <DrawingBox
            language={language}
            savedDrawings={savedDrawings}
            onSaveDrawing={handleSaveDrawing}
            onDeleteDrawing={handleDeleteDrawing}
          />
        )}

        {activeTab === "stories" && (
          <HindiSection
            language={language}
            soundEnabled={soundEnabled}
            onLetterLearned={handleLetterLearned}
          />
        )}

        {activeTab === "quiz" && (
          <QuizSection
            language={language}
            soundEnabled={soundEnabled}
            unlockedBadgeIds={progress.badgesUnlocked}
            onUnlockBadge={handleUnlockBadge}
            onRecordQuizScore={handleRecordQuizScore}
          />
        )}

        {activeTab === "chatbot" && (
          <AiChatbot
            language={language}
            soundEnabled={soundEnabled}
            selectedGrade={selectedGrade}
            studentName={user?.name}
          />
        )}

        {activeTab === "report" && (
          <StudentReport
            user={user}
            progress={progress}
            selectedGrade={selectedGrade}
            language={language}
          />
        )}

        {activeTab === "plans" && (
          <IOISPlansSection
            user={user}
            language={language}
            onSelectPlan={(planId) => {
              setIsAuthOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            IOIS बाल विकास डिजिटल मंच • कक्षा 1 से 5 शैक्षणिक किट
          </p>
          <p>
            Official Portal:{" "}
            <a
              href="https://ioisplatform.github.io/"
              target="_blank"
              rel="noreferrer"
              className="text-amber-600 dark:text-amber-400 font-mono hover:underline"
            >
              https://ioisplatform.github.io/
            </a>{" "}
            • 256-Bit Cloud Encryption • No Data Loss Guaranteed
          </p>
          <div className="flex items-center justify-center gap-4 pt-1 font-medium text-[11px]">
            <button onClick={() => setIsTutorialOpen(true)} className="hover:underline">
              ट्यूटोरियल
            </button>
            <span>•</span>
            <button onClick={() => setIsNotificationsOpen(true)} className="hover:underline">
              रिमाइंडर
            </button>
            <span>•</span>
            <button onClick={() => setIsAdminOpen(true)} className="hover:underline">
              एडमिन कंसोल
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={(loggedInUser) => {
          setUser(loggedInUser);
          syncToCloud();
        }}
        language={language}
      />

      <DeviceSecurityModal
        isOpen={isDevicesOpen}
        onClose={() => setIsDevicesOpen(false)}
        user={user}
        onUpdateUser={(updated) => setUser(updated)}
        language={language}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        language={language}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        language={language}
      />

      <NotificationSettings
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        language={language}
      />
    </div>
  );
}
