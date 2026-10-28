"use client";

import { useState } from "react";
import { retryFailedSpreadsheetSync } from "@/app/actions/admin";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export function AdminSyncRetry({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleRetry = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await retryFailedSpreadsheetSync(submissionId);
      setIsSuccess(res.success);
      setMessage(res.success ? "Tersinkronisasi!" : res.error || "Gagal.");
    } catch {
      setIsSuccess(false);
      setMessage("Error jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleRetry}
        disabled={loading}
        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded border border-[#E1E5DF] bg-[#FFFFFF] hover:bg-[#F7F7F2] text-[#202522] disabled:opacity-50"
        title="Ulangi sinkronisasi ke Google Sheets"
      >
        <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin text-[#174C3C]" : ""}`} />
        <span>Sync Ulang</span>
      </button>
      {message && (
        <span
          className={`text-[11px] flex items-center gap-0.5 ${
            isSuccess ? "text-[#174C3C]" : "text-[#B42318]"
          }`}
        >
          {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {message}
        </span>
      )}
    </div>
  );
}
