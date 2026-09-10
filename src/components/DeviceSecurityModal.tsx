import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Laptop,
  Smartphone,
  Trash2,
  Lock,
  Radio,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { UserProfile } from "../types";

interface DeviceSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdateUser: (updatedUser: UserProfile) => void;
  language: "hi" | "en";
}

export const DeviceSecurityModal: React.FC<DeviceSecurityModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  language,
}) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  if (!isOpen || !user) return null;

  const handleToggle2FA = async () => {
    setLoading(true);
    setStatusMessage("");
    const new2FAState = !user.twoFactorEnabled;

    try {
      const res = await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueId: user.uniqueId,
          toggle2FA: new2FAState,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "2FA update failed");

      onUpdateUser({
        ...user,
        twoFactorEnabled: new2FAState,
      });

      setStatusMessage(
        new2FAState
          ? language === "hi"
            ? "2-फैक्टर ऑथेंटिकेशन (2FA) सफलतापूर्वक चालू कर दिया गया है!"
            : "Two-Factor Authentication (2FA) enabled successfully!"
          : language === "hi"
          ? "2FA बंद कर दिया गया है।"
          : "2FA disabled."
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error updating 2FA";
      setStatusMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    setLoading(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueId: user.uniqueId,
          removeDeviceId: deviceId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Device removal failed");

      const updatedDevices = user.devices.filter((d) => d.id !== deviceId);
      onUpdateUser({
        ...user,
        devices: updatedDevices,
      });

      setStatusMessage(
        language === "hi"
          ? "उपकरण सत्र सफलतापूर्वक समाप्त कर दिया गया।"
          : "Device session successfully terminated."
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error removing device";
      setStatusMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6" />
            <div>
              <h3 className="font-extrabold text-base">
                {language === "hi" ? "मल्टी-डिवाइस व सुरक्षा केंद्र" : "Device Security & Session Control"}
              </h3>
              <p className="text-[11px] text-emerald-100">
                End-to-End Encrypted Cloud Synchronization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* User ID & Plan Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                {language === "hi" ? "स्थायी यूनिक आईडी (Non-Editable)" : "Unique User ID"}
              </span>
              <span className="font-mono text-lg font-black text-amber-600 dark:text-amber-400 tracking-wider">
                {user.uniqueId}
              </span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                {user.name} • {user.email}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                ₹{user.planPrice} Plan Active
              </span>
              <p className="text-[11px] text-slate-500 mt-1">{user.mobile}</p>
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* 2FA Section */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  {language === "hi" ? "टू-फैक्टर ऑथेंटिकेशन (2FA)" : "Two-Factor Authentication (2FA)"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                {language === "hi"
                  ? "प्रत्येक नए लॉगिन पर 6-अंकों के सुरक्षा OTP कोड की आवश्यकता होगी।"
                  : "Requires a 6-digit OTP verification on every new login session."}
              </p>
            </div>
            <button
              onClick={handleToggle2FA}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                user.twoFactorEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  user.twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Active Devices (Up to 4 devices) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>
                  {language === "hi"
                    ? `सक्रिय उपकरण सत्र (${user.devices?.length || 1} / 4)`
                    : `Active Devices (${user.devices?.length || 1} / 4)`}
                </span>
              </span>
              <span className="text-[10px] text-slate-400">अधिकतम 4 उपकरण समर्थित</span>
            </div>

            <div className="space-y-2">
              {user.devices && user.devices.length > 0 ? (
                user.devices.map((dev, idx) => (
                  <div
                    key={dev.id || idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/70 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        {dev.deviceName.toLowerCase().includes("mobile") ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            {dev.deviceName}
                          </span>
                          {idx === user.devices.length - 1 && (
                            <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                              वर्तमान उपकरण
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          IP: {dev.ip} • सक्रिय: {new Date(dev.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {user.devices.length > 1 && (
                      <button
                        onClick={() => handleRemoveDevice(dev.id)}
                        disabled={loading}
                        title="Remote Logout Device"
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-2">वर्तमान में 1 डिवाइस सक्रिय है।</p>
              )}
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>क्लाउड सुरक्षा गारंटी:</strong> आपका अध्ययन डेटा, क्विज़ स्कोर और चित्रकारी
              256-बिट एन्क्रिप्शन के साथ स्वचालित रूप से क्लाउड बैकअप में सुरक्षित रहते हैं। किसी भी डिवाइस से लॉगिन करने पर आपका कोई डेटा मिस नहीं होगा।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
