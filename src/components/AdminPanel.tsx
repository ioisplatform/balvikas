import React, { useState } from "react";
import {
  ShieldAlert,
  Lock,
  Users,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Database,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Sliders,
  CreditCard,
  PhoneCall,
  Save,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { AdminOverview, PlatformService } from "../types";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: "hi" | "en";
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminOverview | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "members" | "settings" | "backup">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified">("all");
  const [actionSuccess, setActionSuccess] = useState("");

  // Service Edit / Add Modal State
  const [isEditingService, setIsEditingService] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<PlatformService>>({
    titleHi: "",
    titleEn: "",
    category: "utilities",
    description: "",
    icon: "Sparkles",
    link: "",
    badge: "",
    active: true,
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    newAdminPassword: "",
    officialUpiId: "8877490845@spicepay",
    officialPayeeName: "Vikas Kumar",
    officialWhatsapp: "+91 8877490845",
    sponsorDefaultId: "IOIS999VK01",
    systemNotice: "",
  });

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(""), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/overview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ adminPassword }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "अमान्य एडमिन पासवर्ड (Invalid Admin Password)");
      }

      setData(resData);
      if (resData.settings) {
        setSettingsForm((prev) => ({
          ...prev,
          officialUpiId: resData.settings.officialUpiId || prev.officialUpiId,
          officialPayeeName: resData.settings.officialPayeeName || prev.officialPayeeName,
          officialWhatsapp: resData.settings.officialWhatsapp || prev.officialWhatsapp,
          sponsorDefaultId: resData.settings.sponsorDefaultId || prev.sponsorDefaultId,
          systemNotice: resData.settings.systemNotice || "",
        }));
      }
      setIsAuthenticated(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "प्रमाणीकरण विफल";
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ adminPassword }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData(resData);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  // Service Management Handlers
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.titleHi || !serviceForm.link) {
      alert("कृपया सेवा का नाम एवं लिंक अवश्य दर्ज करें।");
      return;
    }

    setLoading(true);
    try {
      const isNew = !serviceForm.id;
      const url = isNew ? "/api/admin/services" : `/api/admin/services/${serviceForm.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({
          ...serviceForm,
          adminPassword,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "सेवा सहेजने में विफल");

      showNotification(isNew ? "नयी सेवा सफलतापूर्वक जोड़ दी गई!" : "सेवा का विवरण अपडेट हो गया!");
      setIsEditingService(false);
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!window.confirm(`क्या आप वाकई सेवा "${title}" को हटाना चाहते हैं?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": adminPassword,
        },
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "सेवा हटाने में विफल");

      showNotification(`सेवा "${title}" सफलतापूर्वक हटा दी गई!`);
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleServiceActive = async (service: PlatformService) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({
          active: !service.active,
          adminPassword,
        }),
      });
      if (res.ok) {
        showNotification(`सेवा स्थिति बदली गई: ${!service.active ? "सक्रिय (Active)" : "निष्क्रिय (Inactive)"}`);
        refreshData();
      }
    } catch {
      alert("स्थिति बदलने में असमर्थ");
    }
  };

  // Member UTR Verification
  const handleVerifyMemberUtr = async (uniqueId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === "verified" ? "pending" : "verified";
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-utr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({
          uniqueId,
          status: nextStatus,
          adminPassword,
        }),
      });
      if (res.ok) {
        showNotification(`सदस्य ${uniqueId} का UTR स्टेटस: ${nextStatus === "verified" ? "सत्यापित (Approved)" : "लंबित (Pending)"}`);
        refreshData();
      }
    } catch {
      alert("UTR स्टेटस बदलने में विफल");
    } finally {
      setLoading(false);
    }
  };

  // Save Settings & Gateway Info
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({
          ...settingsForm,
          adminPassword,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "सेटिंग्स सहेजने में विफल");

      if (settingsForm.newAdminPassword) {
        setAdminPassword(settingsForm.newAdminPassword);
        setSettingsForm((prev) => ({ ...prev, newAdminPassword: "" }));
      }
      showNotification("सिस्टम व पेमेंट गेटवे सेटिंग्स सफलतापूर्वक अपडेट हो गईं!");
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  // Backup Export & Import
  const handleExportBackup = async () => {
    try {
      const res = await fetch("/api/backup/export");
      const backupData = await res.json();
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `IOIS-Platform-Backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      showNotification("क्लाउड बैकअप सुरक्षित डाउनलोड हो गया!");
    } catch {
      setAuthError("बैकअप डाउनलोड करने में त्रुटि");
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonContent = JSON.parse(event.target?.result as string);
        const res = await fetch("/api/backup/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": adminPassword,
          },
          body: JSON.stringify({ backupData: jsonContent, adminPassword }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || "Restore failed");

        showNotification("डेटाबेस बैकअप सफलतापूर्वक रीस्टोर हो गया!");
        refreshData();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "फ़ाइल पढ़ने में त्रुटि");
      }
    };
    reader.readAsText(file);
  };

  const totalMembers = data?.stats?.totalStudents || data?.users?.length || 0;
  const totalEarnings = data?.stats?.totalEarnings || data?.totalRevenue || 0;
  const totalServices = data?.services?.length || 0;

  const pendingCount = data?.users?.filter((u) => u.paymentStatus !== "verified").length || 0;
  const verifiedCount = data?.users?.filter((u) => u.paymentStatus === "verified").length || 0;

  const filteredUsers =
    data?.users?.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.mobile.includes(searchQuery) ||
        (u.utrNumber && u.utrNumber.includes(searchQuery));
      if (!matchesSearch) return false;
      if (statusFilter === "pending") return u.paymentStatus !== "verified";
      if (statusFilter === "verified") return u.paymentStatus === "verified";
      return true;
    }) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Top Header - Absolutely no passwords revealed */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                <span>IOIS मास्टर एडमिन कंसोल</span>
                <span className="text-[10px] bg-amber-500/30 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  v2.0 Secure
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                सुरक्षित प्रशासनिक प्रबंधन • सेवा नियंत्रण, UTR सत्यापन एवं सदस्यता
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!isAuthenticated ? (
            /* Secure Login Form - No passwords displayed */
            <div className="max-w-md mx-auto py-12 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <h4 className="font-black text-xl text-slate-800 dark:text-slate-100">
                  प्रशासक प्रमाणीकरण (Admin Access)
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  यह अनुभाग केवल अधिकृत IOIS सिस्टम एडमिनिस्ट्रेटर के लिए सुरक्षित है।
                </p>
              </div>

              {authError && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                    मास्टर एडमिन पासवर्ड (Enter Master Password):
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-4 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-lg shadow-amber-500/20 text-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "सत्यापित किया जा रहा है..." : "एडमिन डैशबोर्ड में प्रवेश करें (Unlock)"}
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated Admin Workspace */
            <div className="space-y-6">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
                {[
                  { id: "overview", label: "डैशबोर्ड आँकड़े", icon: HardDrive },
                  { id: "services", label: `सेवा प्रबंधन (${totalServices})`, icon: Sliders },
                  { id: "members", label: `सदस्य व UTR (${totalMembers})`, icon: Users },
                  { id: "settings", label: "पेमेंट व गेटवे सेटिंग्स", icon: CreditCard },
                  { id: "backup", label: "क्लाउड बैकअप", icon: Database },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={refreshData}
                  disabled={loading}
                  title="डेटा रिफ्रेश करें"
                  className="ml-auto p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 text-slate-700 dark:text-slate-200"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-amber-50/80 dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-slate-700">
                      <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block">
                        कुल पंजीकृत सदस्य
                      </span>
                      <span className="text-3xl font-black text-amber-900 dark:text-amber-200 font-mono mt-1 block">
                        {totalMembers}
                      </span>
                    </div>

                    <div className="p-4 bg-emerald-50/80 dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700">
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">
                        कुल संचित रेवेन्यू
                      </span>
                      <span className="text-3xl font-black text-emerald-900 dark:text-emerald-200 font-mono mt-1 block">
                        ₹{totalEarnings}
                      </span>
                    </div>

                    <div className="p-4 bg-blue-50/80 dark:bg-slate-800 rounded-2xl border border-blue-200 dark:border-slate-700">
                      <span className="text-[11px] text-blue-700 dark:text-blue-400 font-bold block">
                        कुल लाइव सेवाएं
                      </span>
                      <span className="text-3xl font-black text-blue-900 dark:text-blue-200 font-mono mt-1 block">
                        {totalServices}
                      </span>
                    </div>

                    <div className="p-4 bg-purple-50/80 dark:bg-slate-800 rounded-2xl border border-purple-200 dark:border-slate-700">
                      <span className="text-[11px] text-purple-700 dark:text-purple-400 font-bold block">
                        सिस्टम सुरक्षा स्थिति
                      </span>
                      <span className="text-sm font-black text-purple-900 dark:text-purple-200 mt-2 flex items-center gap-1">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>100% सुरक्षित</span>
                      </span>
                    </div>
                  </div>

                  {/* Plan Distribution */}
                  {data?.stats?.planStats && (
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                        योजनावार सदस्य वितरण (Plan Breakdown):
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(data.stats.planStats).map(([pName, count]) => (
                          <div
                            key={pName}
                            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
                          >
                            <span className="text-xs font-semibold text-slate-500 block truncate">
                              {pName}
                            </span>
                            <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
                              {count} सदस्य
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SERVICES MANAGEMENT */}
              {activeTab === "services" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                        प्लेटफ़ॉर्म सेवा प्रबंधन (Services Control)
                      </h4>
                      <p className="text-xs text-slate-500">
                        यहाँ से आप किसी भी सेवा को एडिट, अपडेट, नयी सेवा जोड़ या डिलीट कर सकते हैं।
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setServiceForm({
                          titleHi: "",
                          titleEn: "",
                          category: "utilities",
                          description: "",
                          icon: "Sparkles",
                          link: "",
                          badge: "",
                          active: true,
                        });
                        setIsEditingService(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ नयी सेवा जोड़ें (Add Service)</span>
                    </button>
                  </div>

                  {/* Services Grid/Table */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data?.services?.map((srv) => (
                      <div
                        key={srv.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          srv.active
                            ? "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700"
                            : "bg-slate-100 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 opacity-60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                                {srv.titleHi}
                              </h5>
                              {srv.badge && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                  {srv.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block">{srv.titleEn}</span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              srv.active
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800"
                            }`}
                          >
                            {srv.active ? "सक्रिय (Active)" : "निष्क्रिय"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                          {srv.description}
                        </p>

                        <div className="text-[11px] font-mono text-slate-400 mt-2 truncate">
                          Link: {srv.link}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                          <button
                            onClick={() => handleToggleServiceActive(srv)}
                            className="font-bold text-slate-600 hover:text-amber-600"
                          >
                            {srv.active ? "निष्क्रिय करें" : "सक्रिय करें"}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setServiceForm(srv);
                                setIsEditingService(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>एडिट</span>
                            </button>

                            <button
                              onClick={() => handleDeleteService(srv.id, srv.titleHi)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 font-bold flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>हटाएं</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit/Add Service Modal */}
                  {isEditingService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                            {serviceForm.id ? "सेवा विवरण अपडेट करें (Edit Service)" : "नयी सेवा जोड़ें (Add New Service)"}
                          </h4>
                          <button
                            onClick={() => setIsEditingService(false)}
                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveService} className="space-y-3 text-xs">
                          <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                              सेवा का नाम (हिंदी):
                            </label>
                            <input
                              type="text"
                              required
                              value={serviceForm.titleHi || ""}
                              onChange={(e) => setServiceForm({ ...serviceForm, titleHi: e.target.value })}
                              placeholder="जैसे: भूमि रिकॉर्ड्स / RTPS"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Service Name (English):
                            </label>
                            <input
                              type="text"
                              value={serviceForm.titleEn || ""}
                              onChange={(e) => setServiceForm({ ...serviceForm, titleEn: e.target.value })}
                              placeholder="e.g. Land Records / RTPS"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                श्रेणी (Category):
                              </label>
                              <select
                                value={serviceForm.category || "utilities"}
                                onChange={(e) =>
                                  setServiceForm({
                                    ...serviceForm,
                                    category: e.target.value as PlatformService["category"],
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100"
                              >
                                <option value="education">शिक्षा (Education)</option>
                                <option value="gov">सरकारी (Gov Portal)</option>
                                <option value="utilities">उपयोगिता (Utilities)</option>
                                <option value="entertainment">मनोरंजन/टीवी (Media)</option>
                                <option value="income">आय/प्लान्स (Income)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                बैज टैग (Badge Tag):
                              </label>
                              <input
                                type="text"
                                value={serviceForm.badge || ""}
                                onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                                placeholder="जैसे: New, Live, Direct"
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                              वेबसाइट / पोर्टल लिंक (Target URL):
                            </label>
                            <input
                              type="text"
                              required
                              value={serviceForm.link || ""}
                              onChange={(e) => setServiceForm({ ...serviceForm, link: e.target.value })}
                              placeholder="https://... या /#section"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-800 dark:text-slate-100"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                              संक्षिप्त विवरण (Description):
                            </label>
                            <textarea
                              rows={2}
                              value={serviceForm.description || ""}
                              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                              placeholder="सेवा के मुख्य लाभ व सुविधाएं..."
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="checkbox"
                              id="activeToggle"
                              checked={serviceForm.active !== false}
                              onChange={(e) => setServiceForm({ ...serviceForm, active: e.target.checked })}
                              className="w-4 h-4 text-amber-500 rounded"
                            />
                            <label htmlFor="activeToggle" className="font-bold text-slate-700 dark:text-slate-300">
                              इस सेवा को तुरंत सक्रिय रखें (Show publicly on App)
                            </label>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => setIsEditingService(false)}
                              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                            >
                              रद्द करें
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow"
                            >
                              {loading ? "सहेजा जा रहा है..." : "सेवा सुरक्षित करें (Save)"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MEMBERS & UTR VERIFICATION */}
              {activeTab === "members" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                        पंजीकृत सदस्य व UTR पेमेंट सत्यापन ({filteredUsers.length})
                      </h4>
                      <p className="text-xs text-slate-500">
                        सदस्यों का UTR नंबर देखें एवं उनके डिजिटल सदस्यता कार्ड को वेरिफाई करें।
                      </p>
                    </div>

                    <div className="relative w-72">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="यूनिक ID, नाम, UTR या मोबाइल..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Filter chips */}
                  <div className="flex items-center gap-2 pt-1 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        statusFilter === "all"
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      सभी सदस्य ({data?.users?.length || 0})
                    </button>
                    <button
                      onClick={() => setStatusFilter("pending")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        statusFilter === "pending"
                          ? "bg-rose-500 text-white shadow-sm"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                      }`}
                    >
                      <span>लंबित अनुमोदन (Pending Approval)</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px] font-black">
                        {pendingCount}
                      </span>
                    </button>
                    <button
                      onClick={() => setStatusFilter("verified")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        statusFilter === "verified"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                      }`}
                    >
                      <span>स्वीकृत सदस्य (Approved)</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px] font-black">
                        {verifiedCount}
                      </span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3">यूनिक ID</th>
                          <th className="p-3">सदस्य नाम & शहर</th>
                          <th className="p-3">प्लान (Plan)</th>
                          <th className="p-3">UTR / ट्रांजेक्शन नं.</th>
                          <th className="p-3">पेआउट UPI</th>
                          <th className="p-3">स्थिति</th>
                          <th className="p-3 text-right">सत्यापन कार्रवाई</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredUsers.map((u) => {
                          const isVerified = u.paymentStatus === "verified";
                          return (
                            <tr key={u.uniqueId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                                {u.uniqueId}
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                  {u.name}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {u.city || "Patna"} • {u.mobile}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                  ₹{u.planPrice}
                                </span>
                                <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                                  {u.planName}
                                </span>
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                                {u.utrNumber ? (
                                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                    {u.utrNumber}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">उपलब्ध नहीं</span>
                                )}
                              </td>
                              <td className="p-3 font-mono text-slate-500">
                                {u.payoutUpi || "—"}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    isVerified
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  }`}
                                >
                                  {isVerified ? "सत्यापित (Approved)" : "समीक्षाधीन (Pending)"}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleVerifyMemberUtr(u.uniqueId, u.paymentStatus)}
                                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-sm ${
                                    isVerified
                                      ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                  }`}
                                >
                                  {isVerified ? "लंबित करें" : "स्वीकृत करें (Approve)"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: GATEWAY & SETTINGS */}
              {activeTab === "settings" && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center">
                    <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                      आधिकारिक पेमेंट गेटवे व मास्टर सेटिंग्स
                    </h4>
                    <p className="text-xs text-slate-500">
                      यहाँ किया गया बदलाव पूरे ऐप में स्वतः लागू हो जाएगा।
                    </p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                    <div className="p-4 bg-amber-50/60 dark:bg-slate-800/80 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-3">
                      <h5 className="font-extrabold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" />
                        <span>आधिकारिक UPI भुगतान विवरण (Official Payment Gateway):</span>
                      </h5>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          आधिकारिक UPI ID (Official Receiver UPI):
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.officialUpiId}
                          onChange={(e) => setSettingsForm({ ...settingsForm, officialUpiId: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          आधिकारिक खाताधारक नाम (Official Payee Name):
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.officialPayeeName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, officialPayeeName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          आधिकारिक व्हाट्सएप सहायता नंबर (Official WhatsApp):
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.officialWhatsapp}
                          onChange={(e) => setSettingsForm({ ...settingsForm, officialWhatsapp: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                      <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span>मास्टर एडमिन पासवर्ड बदलें (Change Master Password):</span>
                      </h5>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          नया एडमिन पासवर्ड (खाली छोड़ें यदि नहीं बदलना है):
                        </label>
                        <input
                          type="password"
                          value={settingsForm.newAdminPassword}
                          onChange={(e) => setSettingsForm({ ...settingsForm, newAdminPassword: e.target.value })}
                          placeholder="न्यूनतम 6 अक्षर दर्ज करें..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow-md text-xs transition-transform active:scale-98 flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? "सहेजा जा रहा है..." : "सभी सेटिंग्स अपडेट करें (Save All Changes)"}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: BACKUP & DISASTER RECOVERY */}
              {activeTab === "backup" && (
                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Database className="w-5 h-5 text-amber-500" />
                        <span>क्लाउड डेटा बैकअप और आपदा रिकवरी (Disaster Recovery)</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        संपूर्ण उपयोगकर्ताओं का डेटा, सेवाएं और सिस्टम सेटिंग्स एक क्लिक में सुरक्षित JSON फ़ाइल के रूप में डाउनलोड या रीस्टोर करें।
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={handleExportBackup}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow"
                      >
                        <Download className="w-4 h-4" />
                        <span>संपूर्ण बैकअप डाउनलोड करें (Export JSON)</span>
                      </button>

                      <label className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>बैकअप रीस्टोर करें (Import JSON)</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
