"use client";

import React from "react";
import {
  ScoringResult,
  calculateDependencyScore,
  generateNarrativeConclusion,
} from "@/lib/scoring";
import {
  Check,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface AcademicEvaluationReportProps {
  submissionId: string;
  submittedAt: string;
  score: number;
  category: string;
  scoringDetails: ScoringResult;
  answers: Record<string, any>;
}

export function AcademicEvaluationReport({
  submissionId,
  submittedAt,
  score,
  category,
  scoringDetails,
  answers,
}: AcademicEvaluationReportProps) {
  // Ensure scoring details are fresh and valid
  const details: ScoringResult =
    scoringDetails?.usageProfile && scoringDetails?.strengths
      ? scoringDetails
      : calculateDependencyScore(answers as any);

  const {
    band,
    bandLabel,
    usageProfile,
    metrics,
    strengths,
    risks,
  } = details;

  const formattedDate = new Date(submittedAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Satu Kotak Rangkuman Tunggal */}
      <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5 text-[#202522]">
        
        {/* Header Rangkuman */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E1E5DF]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#174C3C] block">
              HIMALKOM IPB • GRAND SURVEY 2026
            </span>
            <h1 className="text-lg sm:text-xl font-black text-[#202522] tracking-tight">
              Rangkuman Hasil Evaluasi AI
            </h1>
          </div>
          <div className="text-right text-[11px] text-[#737A74] font-mono">
            <div>{submissionId.slice(0, 8)}</div>
            <div>{formattedDate}</div>
          </div>
        </div>

        {/* Skor Utama & Kategori */}
        <div className="bg-[#FAFDFB] border border-[#E1E5DF] rounded-xl p-4 text-center space-y-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737A74] block">
            Indeks Ketergantungan AI
          </span>
          <div className="flex items-baseline justify-center gap-1 font-mono">
            <span className="text-4xl sm:text-5xl font-black text-[#202522] tracking-tight">
              {score.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-[#737A74]">/ 100</span>
          </div>

          <div>
            <span
              className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                band === "RENDAH"
                  ? "bg-[#EBF2EE] text-[#174C3C] border border-[#174C3C]/30"
                  : band === "SEDANG"
                  ? "bg-[#FAF5EB] text-[#B88728] border border-[#D5A85B]/40"
                  : "bg-[#FEE4E2] text-[#B42318] border border-[#B42318]/30"
              }`}
            >
              {bandLabel}
            </span>
          </div>

          {/* Mini Spectrum Bar */}
          <div className="pt-1 max-w-xs mx-auto space-y-1">
            <div className="relative w-full h-2 bg-[#E1E5DF] rounded-full overflow-hidden flex">
              <div className="h-full bg-[#174C3C]/30 w-1/3 border-r border-white" />
              <div className="h-full bg-[#D5A85B]/30 w-1/3 border-r border-white" />
              <div className="h-full bg-[#B42318]/30 w-1/3" />
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-[#202522] -ml-0.5 rounded-full"
                style={{ left: `${Math.min(99, Math.max(1, score))}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-[#737A74]">
              <span>Mandiri (0)</span>
              <span>Moderat (33)</span>
              <span>Kritis (67-100)</span>
            </div>
          </div>
        </div>

        {/* 4 Fakta Utama Penggunaan (Grid Kompak) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-[#F7F7F2] border border-[#E1E5DF]">
            <span className="text-[10px] text-[#737A74] block">Alat Utama:</span>
            <span className="font-bold text-[#202522] truncate block mt-0.5">
              {usageProfile.primaryTool}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F7F2] border border-[#E1E5DF]">
            <span className="text-[10px] text-[#737A74] block">Durasi Penggunaan:</span>
            <span className="font-bold text-[#202522] truncate block mt-0.5">
              {usageProfile.weeklyDuration}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F7F2] border border-[#E1E5DF]">
            <span className="text-[10px] text-[#737A74] block">Kemandirian Debugging:</span>
            <span className="font-bold text-[#174C3C] font-mono block mt-0.5">
              {metrics.debuggingAutonomy}%
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F7F2] border border-[#E1E5DF]">
            <span className="text-[10px] text-[#737A74] block">Uji Deteksi Jurnal:</span>
            <span className="font-bold text-[#174C3C] font-mono block mt-0.5">
              {metrics.journalAccuracy.correct} / 6 Benar ({metrics.journalAccuracy.percentage}%)
            </span>
          </div>
        </div>

        {/* Kelebihan & Kelemahan (Berdampingan) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          {/* Kelebihan */}
          <div className="p-3 rounded-lg bg-[#FAFDFB] border border-[#D1E3D8] space-y-1.5">
            <span className="font-bold text-[#174C3C] flex items-center gap-1 text-[11px] uppercase tracking-wider">
              Kelebihan
            </span>
            <ul className="space-y-1.5 text-[#4A524C] leading-snug">
              {strengths.slice(0, 3).map((st) => (
                <li key={st.id} className="flex items-start gap-1.5">
                  <span className="text-[#174C3C] font-bold mt-0.5">•</span>
                  <span>{st.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kelemahan / Titik Perhatian */}
          <div className="p-3 rounded-lg bg-[#FFFDFB] border border-[#E8D9BF] space-y-1.5">
            <span className="font-bold text-[#B88728] flex items-center gap-1 text-[11px] uppercase tracking-wider">
              Kekurangan
            </span>
            <ul className="space-y-1.5 text-[#4A524C] leading-snug">
              {risks.slice(0, 3).map((rk) => (
                <li key={rk.id} className="flex items-start gap-1.5">
                  <span className="text-[#B88728] font-bold mt-0.5">•</span>
                  <span>{rk.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kesimpulan Evaluasi (Satu Rangkuman Berdasarkan Data Responden) */}
        <div className="p-3.5 rounded-xl bg-[#FAF5EB] border border-[#D5A85B]/30 flex items-start gap-2.5 text-xs text-[#5C4314] leading-relaxed">
          <div>
            <strong className="text-[#202522]">Kesimpulan: </strong>
            <span>{details.narrativeConclusion || generateNarrativeConclusion(answers, details)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
