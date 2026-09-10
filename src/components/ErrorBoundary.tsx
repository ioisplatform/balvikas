import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-white">
              IOIS बाल विकास प्लेटफ़ॉर्म
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              पेज लोड करने में कोई तकनीकी समस्या आई है। कृपया पेज को रीफ्रेश करें अथवा मुख्य पृष्ठ पर लौटें।
            </p>

            {this.state.error && (
              <div className="p-3 bg-slate-950/60 rounded-xl text-[11px] font-mono text-rose-400 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow"
              >
                <RefreshCw className="w-4 h-4" />
                <span>पुनः लोड करें (Reload)</span>
              </button>

              <button
                onClick={() => {
                  try {
                    localStorage.removeItem("iois_progress");
                    localStorage.removeItem("iois_user");
                  } catch {
                    // ignore
                  }
                  window.location.href = "./";
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                <span>रीसेट व होम (Home)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
