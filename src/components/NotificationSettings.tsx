import React, { useState } from "react";
import { X, Bell, Clock, Volume2, ShieldCheck, Check } from "lucide-react";

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  language: "hi" | "en";
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [studyReminder, setStudyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("17:00");
  const [quizAlerts, setQuizAlerts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
              अध्ययन एवं रिमाइंडर सेटिंग्स
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>सेटिंग्स सफलतापूर्वक सहेजी गईं!</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          {/* Daily Study Reminder */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                दैनिक अध्ययन रिमाइंडर (Daily Reminder)
              </span>
              <span className="text-slate-500">प्रतिदिन पढ़ाई का समय याद दिलाएं</span>
            </div>
            <input
              type="checkbox"
              checked={studyReminder}
              onChange={(e) => setStudyReminder(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
          </div>

          {/* Reminder Time */}
          {studyReminder && (
            <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                रिमाइंडर का समय (Time):
              </span>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold"
              />
            </div>
          )}

          {/* Quiz Alerts */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                क्विज़ एवं नए बैज अलर्ट
              </span>
              <span className="text-slate-500">नए बैज अनलॉक होने पर सूचना</span>
            </div>
            <input
              type="checkbox"
              checked={quizAlerts}
              onChange={(e) => setQuizAlerts(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                ध्वनि और उच्चारण (Voice & Audio)
              </span>
              <span className="text-slate-500">कार्ड और अक्षरों का स्पष्ट उच्चारण</span>
            </div>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-sm shadow-md transition-transform active:scale-98"
        >
          सेव करें (Save Preferences)
        </button>
      </div>
    </div>
  );
};
