import React from "react";
import { ArchetypeProfile } from "@/lib/scoring";

interface PersonalityCardProps {
  archetype: ArchetypeProfile;
  score: number;
  category: string;
}

export function PersonalityCard({ archetype, score, category }: PersonalityCardProps) {
  const metrics = archetype.metrics || {
    debuggingAutonomy: 75,
    criticalVerification: 80,
    dependencyScore: score,
  };

  // Render tech insignia emblem based on archetype
  const renderInsignia = () => {
    switch (archetype.insigniaType) {
      case "prism":
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="32,6 56,19 56,45 32,58 8,45 8,19" stroke="#174C3C" strokeWidth="2.5" fill="#EBF2EE" fillOpacity="0.6" />
            <polygon points="32,15 48,24 48,40 32,49 16,40 16,24" stroke="#D5A85B" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="4" fill="#174C3C" />
            <line x1="32" y1="6" x2="32" y2="28" stroke="#174C3C" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="8" y1="45" x2="28" y2="34" stroke="#D5A85B" strokeWidth="1.5" />
            <line x1="56" y1="45" x2="36" y2="34" stroke="#D5A85B" strokeWidth="1.5" />
          </svg>
        );
      case "dialectic":
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="32" r="14" stroke="#175CD3" strokeWidth="2" fill="#EFF8FF" fillOpacity="0.7" />
            <circle cx="40" cy="32" r="14" stroke="#174C3C" strokeWidth="2" fill="#EBF2EE" fillOpacity="0.5" />
            <path d="M28 24C30.5 26.5 32 29 32 32C32 35 30.5 37.5 28 40" stroke="#D5A85B" strokeWidth="2" />
            <path d="M36 24C33.5 26.5 32 29 32 32C32 35 33.5 37.5 36 40" stroke="#D5A85B" strokeWidth="2" />
            <circle cx="24" cy="32" r="3" fill="#175CD3" />
            <circle cx="40" cy="32" r="3" fill="#174C3C" />
          </svg>
        );
      case "pulse":
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="24" stroke="#D5A85B" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="32" cy="32" r="18" stroke="#B88728" strokeWidth="2" fill="#FAF5EB" fillOpacity="0.6" />
            <path d="M16 32H25L28 20L36 44L39 32H48" stroke="#B88728" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="32" r="3" fill="#B42318" />
          </svg>
        );
      case "automaton":
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="16" width="32" height="32" rx="4" stroke="#B42318" strokeWidth="2" fill="#FEE4E2" fillOpacity="0.6" />
            <rect x="24" y="24" width="16" height="16" rx="2" stroke="#B42318" strokeWidth="1.5" fill="#FFFFFF" />
            <line x1="16" y1="24" x2="8" y2="24" stroke="#B42318" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="40" x2="8" y2="40" stroke="#B42318" strokeWidth="2" strokeLinecap="round" />
            <line x1="48" y1="24" x2="56" y2="24" stroke="#B42318" strokeWidth="2" strokeLinecap="round" />
            <line x1="48" y1="40" x2="56" y2="40" stroke="#B42318" strokeWidth="2" strokeLinecap="round" />
            <line x1="32" y1="16" x2="32" y2="8" stroke="#B42318" strokeWidth="2" strokeLinecap="round" />
            <line x1="32" y1="48" x2="32" y2="56" stroke="#B42318" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "terminal":
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="12" width="44" height="40" rx="4" stroke="#5925DC" strokeWidth="2" fill="#F4F3FF" fillOpacity="0.6" />
            <line x1="10" y1="22" x2="54" y2="22" stroke="#5925DC" strokeWidth="1.5" />
            <circle cx="16" cy="17" r="1.5" fill="#5925DC" />
            <circle cx="21" cy="17" r="1.5" fill="#5925DC" />
            <circle cx="26" cy="17" r="1.5" fill="#5925DC" />
            <path d="M18 30L26 36L18 42" stroke="#5925DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="30" y1="42" x2="42" y2="42" stroke="#5925DC" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case "compass":
      default:
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="24" stroke="#115E59" strokeWidth="2" fill="#F0FDF9" fillOpacity="0.6" />
            <circle cx="32" cy="32" r="17" stroke="#D5A85B" strokeWidth="1" strokeDasharray="2 2" />
            <polygon points="32,16 36,32 32,48 28,32" stroke="#115E59" strokeWidth="1.5" fill="#115E59" fillOpacity="0.2" />
            <polygon points="16,32 32,36 48,32 32,28" stroke="#D5A85B" strokeWidth="1.5" fill="#D5A85B" fillOpacity="0.4" />
            <circle cx="32" cy="32" r="2.5" fill="#115E59" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Outer Card Frame */}
      <div className="relative bg-[#FFFFFF] border-2 border-[#E1E5DF] rounded-2xl p-4 sm:p-5 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Subtle Decorative Background Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#174C3C_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

        {/* Inner Card Border with Corner Marks */}
        <div className="relative border border-[#D5A85B]/40 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center bg-gradient-to-b from-[#FFFFFF] via-[#FAFDFB] to-[#F7F7F2]/60">
          {/* 4 Corner Geometric Crosses */}
          <span className="absolute -top-1.5 -left-1.5 text-[11px] font-mono text-[#D5A85B] leading-none select-none">
            +
          </span>
          <span className="absolute -top-1.5 -right-1.5 text-[11px] font-mono text-[#D5A85B] leading-none select-none">
            +
          </span>
          <span className="absolute -bottom-1.5 -left-1.5 text-[11px] font-mono text-[#D5A85B] leading-none select-none">
            +
          </span>
          <span className="absolute -bottom-1.5 -right-1.5 text-[11px] font-mono text-[#D5A85B] leading-none select-none">
            +
          </span>

          {/* Top Series Header */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-[#E1E5DF] text-[10px] sm:text-[11px] tracking-wider uppercase font-bold text-[#737A74]">
            <span className="text-[#174C3C]">HIMALKOM • AI RESEARCH</span>
            <span className="font-mono text-[#B88728]">{archetype.editionNo}</span>
          </div>

          {/* Insignia Emblem Container */}
          <div className="my-5 relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#FFFFFF] border-2 border-[#E1E5DF] shadow-inner flex items-center justify-center relative">
              <div className="absolute inset-1 rounded-full border border-dashed border-[#D5A85B]/50" />
              {renderInsignia()}
            </div>
          </div>

          {/* Persona Titles */}
          <div className="space-y-1 mb-3">
            <span className="text-[11px] font-semibold text-[#B88728] uppercase tracking-widest block">
              {archetype.subtitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#202522]">
              {archetype.name}
            </h2>
          </div>

          {/* Tagline */}
          <p className="text-xs sm:text-sm font-medium text-[#174C3C] italic mb-3 px-2">
            &ldquo;{archetype.tagline}&rdquo;
          </p>

          {/* Friendly Interpretation */}
          <p className="text-xs text-[#525B54] leading-relaxed mb-4 max-w-xs">
            {archetype.description}
          </p>

          {/* Characteristic Chips */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-5 w-full">
            {archetype.characteristics.map((c, idx) => (
              <span
                key={idx}
                className="text-[10px] sm:text-[11px] font-medium bg-[#FFFFFF] text-[#202522] border border-[#E1E5DF] px-2.5 py-0.5 rounded-full shadow-2xs"
              >
                {c}
              </span>
            ))}
          </div>

          {/* 3 Metrics Progress Bars */}
          <div className="w-full pt-4 border-t border-[#E1E5DF] space-y-2.5 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A74] block text-center mb-1">
              Metrik Profil Responden
            </span>

            {/* Metric 1: Debugging */}
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-1">
                <span className="text-[#202522]">Kemandirian Debugging</span>
                <span className="font-mono font-bold text-[#174C3C]">
                  {metrics.debuggingAutonomy}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E1E5DF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#174C3C] rounded-full transition-all duration-700"
                  style={{ width: `${metrics.debuggingAutonomy}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Verification */}
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-1">
                <span className="text-[#202522]">Ketajaman Verifikasi</span>
                <span className="font-mono font-bold text-[#B88728]">
                  {metrics.criticalVerification}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E1E5DF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D5A85B] rounded-full transition-all duration-700"
                  style={{ width: `${metrics.criticalVerification}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Score */}
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-1">
                <span className="text-[#202522]">Skor Ketergantungan AI</span>
                <span className="font-mono font-bold text-[#202522]">
                  {score.toFixed(1)} / 100 ({category})
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E1E5DF] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    category === "RENDAH"
                      ? "bg-[#174C3C]"
                      : category === "SEDANG"
                      ? "bg-[#D5A85B]"
                      : "bg-[#B42318]"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card Bottom Stamp */}
          <div className="w-full pt-4 mt-3 border-t border-[#E1E5DF] flex items-center justify-between text-[9px] text-[#737A74] tracking-wider uppercase font-semibold">
            <span>GRAND SURVEY ILKOM IPB</span>
            <span className="text-[#174C3C] font-bold">VERIFIED PROFILE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
