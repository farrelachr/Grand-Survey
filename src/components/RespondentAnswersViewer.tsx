"use client";

import { useState } from "react";
import { SURVEY_SECTIONS_DATA } from "@/lib/survey-questions";
import { LIKERT_OPTIONS } from "@/lib/survey-schema";
import {
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Filter,
} from "lucide-react";

interface RespondentAnswersViewerProps {
  answers: Record<string, any>;
}

export function RespondentAnswersViewer({ answers }: RespondentAnswersViewerProps) {
  const [selectedSection, setSelectedSection] = useState<number>(0);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
  });

  const toggleSection = (sectionNumber: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionNumber]: !prev[sectionNumber],
    }));
  };

  const toggleAll = (expand: boolean) => {
    const updated: Record<number, boolean> = {};
    for (let i = 1; i <= 9; i++) {
      updated[i] = expand;
    }
    setExpandedSections(updated);
  };

  const filteredSections =
    selectedSection === 0
      ? SURVEY_SECTIONS_DATA
      : SURVEY_SECTIONS_DATA.filter((s) => s.sectionNumber === selectedSection);

  const getLikertLabel = (val: number) => {
    const opt = LIKERT_OPTIONS.find((lo) => lo.value === val);
    return opt ? `${opt.value} — ${opt.label}` : String(val);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1E5DF] pb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#202522] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#174C3C]" />
            Salinan Jawaban Survei Anda
          </h2>
          <p className="text-xs text-[#636B65] mt-1">
            Arsip resmi seluruh jawaban yang Anda isi pada kuesioner Grand Survey HIMALKOM 2026.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-[#202522] border border-[#E1E5DF] bg-[#FFFFFF] hover:bg-[#F7F7F2] transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#737A74]" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter and Accordion Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#737A74]" />
          <span className="font-semibold text-[#202522]">Filter Bagian:</span>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(Number(e.target.value))}
            className="p-1.5 bg-[#FFFFFF] border border-[#E1E5DF] rounded text-xs text-[#202522] focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C]"
          >
            <option value={0}>Semua Bagian (1–9)</option>
            {SURVEY_SECTIONS_DATA.map((s) => (
              <option key={s.sectionNumber} value={s.sectionNumber}>
                Bagian {s.sectionNumber}: {s.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleAll(true)}
            className="text-xs text-[#174C3C] hover:underline font-medium"
          >
            Buka Semua
          </button>
          <span className="text-[#E1E5DF]">•</span>
          <button
            type="button"
            onClick={() => toggleAll(false)}
            className="text-xs text-[#737A74] hover:underline font-medium"
          >
            Tutup Semua
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {filteredSections.map((sec) => {
          const isExpanded = expandedSections[sec.sectionNumber] !== false;

          return (
            <div
              key={sec.sectionId}
              className="border border-[#E1E5DF] rounded overflow-hidden"
            >
              {/* Section Header Accordion Button */}
              <button
                type="button"
                onClick={() => toggleSection(sec.sectionNumber)}
                className="w-full flex items-center justify-between p-4 bg-[#F7F7F2]/60 hover:bg-[#F7F7F2] transition-colors text-left"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#174C3C] block">
                    Bagian {sec.sectionNumber}
                  </span>
                  <span className="text-sm font-bold text-[#202522]">
                    {sec.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#737A74]">
                  <span className="text-xs hidden sm:inline">
                    {isExpanded ? "Tutup" : "Lihat"}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Questions in Section */}
              {isExpanded && (
                <div className="p-4 sm:p-5 divide-y divide-[#E1E5DF] space-y-4">
                  {sec.questions.map((q, qIdx) => {
                    return (
                      <div key={q.id} className="pt-4 first:pt-0">
                        <div className="mb-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-[#202522] leading-snug">
                            <span className="text-[#174C3C] mr-1.5">{qIdx + 1}.</span>
                            {q.title}
                          </h4>
                          {q.description && (
                            <p className="text-[11px] text-[#737A74] mt-0.5">
                              {q.description}
                            </p>
                          )}
                        </div>

                        {/* RENDER ANSWER BY TYPE */}
                        {/* Text / Name Input */}
                        {q.type === "text" && (
                          <div className="p-2.5 rounded bg-[#FAF5EB]/50 border border-[#D5A85B]/30 text-xs text-[#202522] font-semibold">
                            {answers[q.id] || <span className="text-[#737A74] italic">Tidak diisi</span>}
                          </div>
                        )}

                        {/* Textarea / Open-ended */}
                        {q.type === "textarea" && (
                          <div className="p-3 rounded bg-[#F7F7F2] border border-[#E1E5DF] text-xs text-[#202522] leading-relaxed whitespace-pre-wrap">
                            {answers[q.id] ? (
                              <p className="italic font-normal">"{answers[q.id]}"</p>
                            ) : (
                              <span className="text-[#737A74] italic">Tidak diisi</span>
                            )}
                          </div>
                        )}

                        {/* Single Choice */}
                        {q.type === "single_choice" && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#174C3C] shrink-0" />
                            <span className="text-xs font-semibold text-[#174C3C] bg-[#EBF2EE] border border-[#174C3C]/20 px-2.5 py-1 rounded">
                              {answers[q.id] || <span className="text-[#737A74] italic">Belum dipilih</span>}
                            </span>
                          </div>
                        )}

                        {/* Multiple Choice */}
                        {q.type === "multiple_choice" && (
                          <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(answers[q.id]) && answers[q.id].length > 0 ? (
                              answers[q.id].map((val: string, vIdx: number) => (
                                <span
                                  key={vIdx}
                                  className="text-[11px] font-medium text-[#202522] bg-[#F7F7F2] border border-[#E1E5DF] px-2.5 py-1 rounded"
                                >
                                  {val}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-[#737A74] italic">Tidak ada opsi dipilih</span>
                            )}
                          </div>
                        )}

                        {/* Likert Matrix */}
                        {q.type === "likert_matrix" && q.statements && (
                          <div className="space-y-2 mt-2">
                            {q.statements.map((st) => {
                              const val = answers[st.id];
                              return (
                                <div
                                  key={st.id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2.5 rounded bg-[#F7F7F2]/60 border border-[#E1E5DF] text-xs"
                                >
                                  <span className="text-[#202522] font-medium sm:max-w-[70%]">
                                    {st.statement}
                                  </span>
                                  <span
                                    className={`self-start sm:self-auto px-2 py-0.5 rounded font-semibold text-[11px] whitespace-nowrap ${
                                      val >= 3
                                        ? "bg-[#EBF2EE] text-[#174C3C] border border-[#174C3C]/20"
                                        : "bg-[#FAF5EB] text-[#B88728] border border-[#D5A85B]/30"
                                    }`}
                                  >
                                    {val ? getLikertLabel(val) : "Belum diisi"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
