"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SURVEY_SECTIONS_DATA, QuestionDefinition, LikertStatement } from "@/lib/survey-questions";
import { LIKERT_OPTIONS } from "@/lib/survey-schema";
import { submitSurvey } from "@/app/actions/survey";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  ShieldCheck,
  FileText,
} from "lucide-react";

const STORAGE_KEY = "himalkom_survey_draft_2026";

export function SurveyWizard({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  // Current step: 0 to 8 are Sections 1 to 9. Step 9 is Review & Consent.
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setAnswers((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save draft to localStorage on answers change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // Ignore
    }
  }, [answers]);

  // Warn before closing window if partially answered
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(answers).length > 2 && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, isSubmitting]);

  // Instantly scroll to top whenever the wizard step changes
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentStep]);

  const currentSection = SURVEY_SECTIONS_DATA[currentStep];

  // Value setter helper
  const setAnswerValue = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Toggle multiple choice item
  const toggleMultipleChoice = (key: string, optionValue: string) => {
    const currentList: string[] = Array.isArray(answers[key]) ? answers[key] : [];
    const exists = currentList.includes(optionValue);
    const updated = exists ? currentList.filter((v) => v !== optionValue) : [...currentList, optionValue];
    setAnswerValue(key, updated);
  };

  // Section validation before moving to next
  const validateCurrentSection = (): boolean => {
    const currentErrors: Record<string, string> = {};

    if (!currentSection) return true;

    for (const q of currentSection.questions) {
      if (q.type === "likert_matrix" && q.statements) {
        for (const st of q.statements) {
          const val = answers[st.id];
          if (val === undefined || val === null || val === "") {
            currentErrors[st.id] = "Pilih salah satu tingkat persetujuan.";
          }
        }
      } else if (q.type === "multiple_choice") {
        const val = answers[q.id];
        if (!Array.isArray(val) || val.length === 0) {
          currentErrors[q.id] = "Pilih minimal satu opsi jawaban.";
        }
      } else if (q.type === "text") {
        const val = answers[q.id];
        const minChars = q.minChars || 2;
        if (!val || typeof val !== "string" || val.trim().length < minChars) {
          currentErrors[q.id] = `Isian wajib diisi (minimal ${minChars} karakter).`;
        }
      } else if (q.type === "textarea") {
        const val = answers[q.id];
        const minChars = q.minChars || 5;
        if (!val || typeof val !== "string" || val.trim().length < minChars) {
          currentErrors[q.id] = `Isian wajib diisi (minimal ${minChars} karakter).`;
        }
      } else {
        const val = answers[q.id];
        if (!val) {
          currentErrors[q.id] = "Pertanyaan ini wajib dijawab.";
        }
      }
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const isCurrentSectionFilled = (): boolean => {
    if (!currentSection) return true;

    for (const q of currentSection.questions) {
      if (q.type === "likert_matrix" && q.statements) {
        for (const st of q.statements) {
          const val = answers[st.id];
          if (val === undefined || val === null || val === "") {
            return false;
          }
        }
      } else if (q.type === "multiple_choice") {
        const val = answers[q.id];
        if (!Array.isArray(val) || val.length === 0) {
          return false;
        }
      } else if (q.type === "text") {
        const val = answers[q.id];
        const minChars = q.minChars || 2;
        if (!val || typeof val !== "string" || val.trim().length < minChars) {
          return false;
        }
      } else if (q.type === "textarea") {
        const val = answers[q.id];
        const minChars = q.minChars || 5;
        if (!val || typeof val !== "string" || val.trim().length < minChars) {
          return false;
        }
      } else {
        const val = answers[q.id];
        if (!val) {
          return false;
        }
      }
    }

    return true;
  };

  const isSectionFilled = isCurrentSectionFilled();

  const handleNext = () => {
    if (validateCurrentSection()) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setCurrentStep((prev) => prev + 1);
    } else {
      // Scroll to top so respondent immediately sees the first missed question
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setErrors({});
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleFinalSubmit = async () => {
    if (!consentGiven) {
      setSubmitError("Anda harus menyetujui pernyataan persetujuan responden sebelum mengirimkan data.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitSurvey(answers);

      if (res.success && res.submissionId) {
        // Clear local draft upon successful submission
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Ignore
        }
        router.push(`/result/${res.submissionId}`);
      } else {
        setSubmitError(res.error || "Gagal mengirimkan survei. Silakan coba kembali.");
        setIsSubmitting(false);
      }
    } catch {
      setSubmitError("Terjadi gangguan jaringan saat mengirimkan respon. Coba beberapa saat lagi.");
      setIsSubmitting(false);
    }
  };

  const totalSteps = SURVEY_SECTIONS_DATA.length + 1; // 9 sections + 1 review
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress Header */}
      <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#174C3C]">
              Langkah {currentStep + 1} dari {totalSteps}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#202522]">
              {currentStep < SURVEY_SECTIONS_DATA.length
                ? `Bagian ${currentSection.sectionNumber}: ${currentSection.title}`
                : "Tinjauan Akhir & Konfirmasi Pengiriman"}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#737A74]">
            {progressPercent}% Selesai
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E1E5DF] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#174C3C] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      {currentStep < SURVEY_SECTIONS_DATA.length ? (
        <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-4 sm:p-8 shadow-sm space-y-6 sm:space-y-8">
          {currentSection.questions.map((q, idx) => (
            <div key={q.id} className="pt-6 first:pt-0 border-t first:border-t-0 border-[#E1E5DF]">
              <div className="mb-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold text-[#202522] leading-snug">
                    <span className="text-[#174C3C] mr-1.5">{idx + 1}.</span>
                    {q.title}
                  </h3>
                  <span className="text-[11px] text-[#D5A85B] font-medium shrink-0 bg-[#FAF5EB] px-2 py-0.5 rounded">
                    Wajib
                  </span>
                </div>
                {q.description && (
                  <p className="mt-1 text-xs text-[#636B65] leading-relaxed">
                    {q.description}
                  </p>
                )}
                {errors[q.id] && (
                  <p className="mt-2 text-xs text-[#B42318] flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors[q.id]}
                  </p>
                )}
              </div>

              {/* SINGLE CHOICE RENDER */}
              {q.type === "single_choice" && q.options && (
                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#174C3C] bg-[#EBF2EE]/60 text-[#202522] font-medium shadow-xs"
                            : "border-[#E1E5DF] hover:border-[#C4CCC1] bg-[#FFFFFF] text-[#202522]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.value}
                          checked={isSelected}
                          onChange={() => setAnswerValue(q.id, opt.value)}
                          className="mt-0.5 text-[#174C3C] focus:ring-[#174C3C] w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm leading-relaxed">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* MULTIPLE CHOICE RENDER */}
              {q.type === "multiple_choice" && q.options && (
                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const selectedList: string[] = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                    const isChecked = selectedList.includes(opt.value);
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition-all ${
                          isChecked
                            ? "border-[#174C3C] bg-[#EBF2EE]/60 text-[#202522] font-medium shadow-xs"
                            : "border-[#E1E5DF] hover:border-[#C4CCC1] bg-[#FFFFFF] text-[#202522]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name={q.id}
                          value={opt.value}
                          checked={isChecked}
                          onChange={() => toggleMultipleChoice(q.id, opt.value)}
                          className="mt-0.5 rounded text-[#174C3C] focus:ring-[#174C3C] w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm leading-relaxed">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* TEXT INPUT RENDER */}
              {q.type === "text" && (
                <div>
                  <input
                    type="text"
                    placeholder={q.placeholder || "Tuliskan nama lengkap Anda..."}
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswerValue(q.id, e.target.value)}
                    className="w-full p-3.5 bg-[#FFFFFF] border border-[#E1E5DF] rounded text-sm text-[#202522] placeholder:text-[#737A74]/50 focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C] transition-colors"
                  />
                  {q.minChars && (
                    <div className="flex justify-between items-center mt-1 text-[11px] text-[#737A74]">
                      <span>Minimal {q.minChars} karakter</span>
                      <span>{(answers[q.id] || "").length} karakter</span>
                    </div>
                  )}
                </div>
              )}

              {/* TEXTAREA RENDER */}
              {q.type === "textarea" && (
                <div>
                  <textarea
                    rows={4}
                    placeholder={q.placeholder}
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswerValue(q.id, e.target.value)}
                    className="w-full p-3.5 bg-[#FFFFFF] border border-[#E1E5DF] rounded text-sm text-[#202522] placeholder:text-[#737A74]/50 focus:border-[#174C3C] focus:ring-1 focus:ring-[#174C3C] transition-colors"
                  />
                  <div className="flex justify-between items-center mt-1 text-[11px] text-[#737A74]">
                    <span>Minimal {q.minChars || 5} karakter</span>
                    <span>{(answers[q.id] || "").length} karakter</span>
                  </div>
                </div>
              )}

              {/* LIKERT MATRIX RENDER */}
              {q.type === "likert_matrix" && q.statements && (
                <div className="space-y-4">
                  {/* Desktop / Tablet Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#E1E5DF] bg-[#F7F7F2]/80 text-[11px] text-[#737A74] uppercase tracking-wider">
                          <th className="py-3 px-3 font-semibold w-1/2">Pernyataan Sikap</th>
                          {LIKERT_OPTIONS.map((lo) => (
                            <th key={lo.value} className="py-3 px-2 text-center font-semibold">
                              <span>{lo.label}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E1E5DF]">
                        {q.statements.map((st) => {
                          const currentVal = answers[st.id];
                          const hasError = errors[st.id];
                          return (
                            <tr
                              key={st.id}
                              className={`hover:bg-[#FAF5EB]/30 transition-colors ${
                                hasError ? "bg-[#FEE4E2]/20" : ""
                              }`}
                            >
                              <td className="py-3.5 px-3 text-sm text-[#202522] font-medium leading-relaxed">
                                {st.statement}
                                {hasError && (
                                  <span className="block text-[11px] text-[#B42318] font-normal mt-0.5">
                                    {hasError}
                                  </span>
                                )}
                              </td>
                              {LIKERT_OPTIONS.map((lo) => (
                                <td key={lo.value} className="py-3.5 px-2 text-center align-middle">
                                  <label className="flex items-center justify-center p-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={st.id}
                                      value={lo.value}
                                      checked={currentVal === lo.value}
                                      onChange={() => setAnswerValue(st.id, lo.value)}
                                      className="w-4 h-4 text-[#174C3C] focus:ring-[#174C3C] cursor-pointer"
                                    />
                                  </label>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Card View */}
                  <div className="sm:hidden space-y-3">
                    {q.statements.map((st) => {
                      const currentVal = answers[st.id];
                      const hasError = errors[st.id];
                      return (
                        <div
                          key={st.id}
                          className={`p-3.5 rounded border transition-colors ${
                            hasError
                              ? "border-[#B42318]/40 bg-[#FEE4E2]/20"
                              : "border-[#E1E5DF] bg-[#FFFFFF]"
                          }`}
                        >
                          <p className="text-xs font-semibold text-[#202522] leading-relaxed mb-3">
                            {st.statement}
                          </p>
                          {hasError && (
                            <span className="block text-[11px] text-[#B42318] mb-2 font-medium">
                              {hasError}
                            </span>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            {LIKERT_OPTIONS.map((lo) => {
                              const isSelected = currentVal === lo.value;
                              return (
                                <label
                                  key={lo.value}
                                  className={`flex items-center gap-2 p-2.5 rounded border text-xs cursor-pointer transition-all ${
                                    isSelected
                                      ? "border-[#174C3C] bg-[#EBF2EE] text-[#174C3C] font-semibold shadow-xs"
                                      : "border-[#E1E5DF] bg-[#F7F7F2]/50 text-[#636B65]"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`${st.id}-mobile`}
                                    value={lo.value}
                                    checked={isSelected}
                                    onChange={() => setAnswerValue(st.id, lo.value)}
                                    className="w-3.5 h-3.5 text-[#174C3C] focus:ring-[#174C3C]"
                                  />
                                  <span className="leading-tight text-[11px]">{lo.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* STEP 10: REVIEW & CONSENT SCREEN */
        <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#E1E5DF] pb-5">
            <h3 className="text-lg font-bold text-[#202522]">
              Tinjauan Kelengkapan Jawaban
            </h3>
            <p className="mt-1 text-sm text-[#636B65]">
              Seluruh 9 bagian kuesioner telah terisi. Mohon periksa kembali sebelum mengirimkan data resmi Anda.
            </p>
          </div>

          <div className="space-y-3">
            {SURVEY_SECTIONS_DATA.map((sec, idx) => (
              <div
                key={sec.sectionId}
                className="flex items-center justify-between p-3.5 rounded bg-[#F7F7F2] border border-[#E1E5DF] text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#174C3C]" />
                  <span className="font-semibold text-[#202522]">
                    Bagian {sec.sectionNumber}: {sec.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  className="text-xs font-semibold text-[#174C3C] hover:underline"
                >
                  Ubah Jawaban
                </button>
              </div>
            ))}
          </div>

          {/* Consent Checkbox */}
          <div className="pt-4 border-t border-[#E1E5DF]">
            <label className="flex items-start gap-3 p-4 rounded bg-[#FAF5EB] border border-[#D5A85B]/30 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 rounded text-[#174C3C] focus:ring-[#174C3C] w-4 h-4 cursor-pointer"
              />
              <div className="text-xs leading-relaxed text-[#202522]">
                <span className="font-semibold block mb-0.5">
                  Pernyataan Persetujuan Responden (Informed Consent)
                </span>
                Saya menyatakan bahwa seluruh respon yang saya berikan adalah benar dan mencerminkan kebiasaan akademik saya sendiri sebagai mahasiswa Ilmu Komputer IPB University. Saya memahami bahwa data ini dianonimkan untuk kepentingan riset akademik HIMALKOM IPB.
              </div>
            </label>
          </div>

          {submitError && (
            <div className="p-4 rounded bg-[#FEE4E2] border border-[#B42318]/20 flex items-start gap-3 text-xs text-[#B42318]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0 || isSubmitting}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 rounded text-xs sm:text-sm font-semibold text-[#202522] border border-[#E1E5DF] bg-[#FFFFFF] hover:bg-[#F7F7F2] transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Sebelumnya</span>
        </button>

        {currentStep < SURVEY_SECTIONS_DATA.length ? (
          <button
            type="button"
            onClick={handleNext}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isSectionFilled
                ? "bg-[#174C3C] text-white hover:bg-[#123B2F] shadow-sm"
                : "bg-[#E1E5DF] text-[#737A74] border border-[#D5DAD2] hover:bg-[#D8DDD5]"
            }`}
          >
            <span>Lanjutkan</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting || !consentGiven}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#174C3C] text-white px-4 sm:px-7 py-3 rounded text-xs sm:text-sm font-bold hover:bg-[#123B2F] transition-all shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>Kirim Jawaban Resmi</span>
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
