"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Copy, Check } from "lucide-react";
import { copyChartAsImage } from "@/lib/chart-export";

interface SubmissionSummary {
  score: number;
  category: "RENDAH" | "SEDANG" | "TINGGI";
  csInterest: string;
  primaryTool: string;
}

interface AdminChartsProps {
  submissions: Array<{
    id: string;
    dependency_score: number;
    dependency_category: "RENDAH" | "SEDANG" | "TINGGI";
    answers: {
      cohort_confirmation?: string;
      cohort?: string;
      primary_ai_tool?: string;
      [key: string]: any;
    };
  }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  RENDAH: "#174C3C", // Deep Forest Green
  SEDANG: "#D5A85B", // Amber Gold
  TINGGI: "#B42318", // Dark Crimson
};

export function AdminCharts({ submissions }: AdminChartsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleCopyChart = async (containerId: string, title: string, categoryLabel: string) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const res = await copyChartAsImage({
        containerElement: container,
        title,
        categoryLabel,
        metaText: `Total Responden: ${submissions.length}`,
        filename: containerId,
      });

      if (res === "copied") {
        setCopiedId(containerId);
        setTimeout(() => setCopiedId(null), 2500);
      } else {
        setDownloadedId(containerId);
        setTimeout(() => setDownloadedId(null), 2500);
      }
    } catch (err) {
      console.error("Gagal menyalin grafik:", err);
    }
  };

  if (!submissions || submissions.length === 0) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-8 text-center text-xs text-[#737A74]">
        Belum ada data respons untuk divisualisasikan dalam bentuk grafik.
      </div>
    );
  }

  // 1. Category Distribution Data for Donut Chart
  const categoryCounts = { RENDAH: 0, SEDANG: 0, TINGGI: 0 };
  for (const s of submissions) {
    const cat = s.dependency_category || "SEDANG";
    if (categoryCounts[cat] !== undefined) {
      categoryCounts[cat]++;
    }
  }

  const categoryChartData = [
    { name: "Rendah (0–33.33)", value: categoryCounts.RENDAH, key: "RENDAH", color: CATEGORY_COLORS.RENDAH },
    { name: "Sedang (>33.33–66.67)", value: categoryCounts.SEDANG, key: "SEDANG", color: CATEGORY_COLORS.SEDANG },
    { name: "Tinggi (>66.67–100)", value: categoryCounts.TINGGI, key: "TINGGI", color: CATEGORY_COLORS.TINGGI },
  ].filter((d) => d.value > 0);

  // 2. Primary AI Tool Popularity Data for Bar Chart
  const toolCounts: Record<string, number> = {};
  for (const s of submissions) {
    const tool = s.answers?.primary_ai_tool || "Lainnya";
    toolCounts[tool] = (toolCounts[tool] || 0) + 1;
  }

  const toolChartData = Object.entries(toolCounts)
    .map(([tool, count]) => ({
      name: tool,
      jumlah: count,
      persen: Math.round((count / submissions.length) * 100),
    }))
    .sort((a, b) => b.jumlah - a.jumlah);

  // 3. Average Score by Cohort (Angkatan 60, 61, 62, 63)
  const cohortScores: Record<string, { total: number; count: number }> = {};
  for (const s of submissions) {
    const rawCohort = s.answers?.cohort_confirmation || s.answers?.cohort || "Lainnya";
    const cohortLabel = rawCohort.startsWith("Angkatan") ? rawCohort : `Angkatan ${rawCohort}`;
    if (!cohortScores[cohortLabel]) {
      cohortScores[cohortLabel] = { total: 0, count: 0 };
    }
    cohortScores[cohortLabel].total += Number(s.dependency_score || 0);
    cohortScores[cohortLabel].count += 1;
  }

  const cohortChartData = Object.entries(cohortScores)
    .map(([name, data]) => ({
      name,
      rataRata: Math.round((data.total / data.count) * 10) / 10,
      responden: data.count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // 4. Score Range Histogram (0-20, 21-40, 41-60, 61-80, 81-100)
  const scoreRanges = [
    { range: "0–20", count: 0 },
    { range: "21–40", count: 0 },
    { range: "41–60", count: 0 },
    { range: "61–80", count: 0 },
    { range: "81–100", count: 0 },
  ];

  for (const s of submissions) {
    const score = Number(s.dependency_score || 0);
    if (score <= 20) scoreRanges[0].count++;
    else if (score <= 40) scoreRanges[1].count++;
    else if (score <= 60) scoreRanges[2].count++;
    else if (score <= 80) scoreRanges[3].count++;
    else scoreRanges[4].count++;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Donut Chart - Kategori Ketergantungan */}
        <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522]">
                Proporsi Kategori Ketergantungan
              </h3>
              <p className="text-xs text-[#737A74] mt-0.5">
                Komposisi mahasiswa berdasarkan rentang indeks skor (N = {submissions.length})
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyChart("admin-chart-1", "Proporsi Kategori Ketergantungan", "Overview Evaluasi")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold text-[#174C3C] border border-[#174C3C]/20 bg-[#EBF2EE] hover:bg-[#DCEAE1] transition-all cursor-pointer shrink-0"
              title="Salin grafik sebagai gambar PNG"
            >
              {copiedId === "admin-chart-1" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Tersalin!</span>
                </>
              ) : downloadedId === "admin-chart-1" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Terunduh!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>

          <div id="admin-chart-1" className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryChartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#E1E5DF] shadow-md text-xs">
                          <p className="font-bold text-[#202522]">{data.name}</p>
                          <p className="text-[#636B65] mt-1">
                            <span className="font-semibold text-[#202522]">{data.value}</span> mahasiswa (
                            {Math.round((data.value / submissions.length) * 100)}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-[#202522] font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Bar Chart - Alat AI Paling Populer */}
        <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522]">
                Frekuensi Alat AI Utama
              </h3>
              <p className="text-xs text-[#737A74] mt-0.5">
                Alat kecerdasan buatan yang paling sering diandalkan untuk tugas kuliah
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyChart("admin-chart-2", "Frekuensi Alat AI Utama", "Platform Terpopuler")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold text-[#174C3C] border border-[#174C3C]/20 bg-[#EBF2EE] hover:bg-[#DCEAE1] transition-all cursor-pointer shrink-0"
              title="Salin grafik sebagai gambar PNG"
            >
              {copiedId === "admin-chart-2" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Tersalin!</span>
                </>
              ) : downloadedId === "admin-chart-2" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Terunduh!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>

          <div id="admin-chart-2" className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={toolChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E5DF" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#636B65", fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} tick={{ fill: "#636B65", fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#E1E5DF] shadow-md text-xs">
                          <p className="font-bold text-[#202522]">{data.name}</p>
                          <p className="text-[#174C3C] mt-1">
                            Jumlah: <span className="font-bold">{data.jumlah}</span> mhs ({data.persen}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="jumlah" fill="#174C3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 3: Bar Chart - Distribusi Histogram Rentang Skor */}
        <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522]">
                Sebaran Rentang Skor (Histogram 0–100)
              </h3>
              <p className="text-xs text-[#737A74] mt-0.5">
                Distribusi kepadatan skor indeks ketergantungan mahasiswa
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyChart("admin-chart-3", "Sebaran Rentang Skor (Histogram 0–100)", "Distribusi Skor")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold text-[#174C3C] border border-[#174C3C]/20 bg-[#EBF2EE] hover:bg-[#DCEAE1] transition-all cursor-pointer shrink-0"
              title="Salin grafik sebagai gambar PNG"
            >
              {copiedId === "admin-chart-3" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Tersalin!</span>
                </>
              ) : downloadedId === "admin-chart-3" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Terunduh!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>

          <div id="admin-chart-3" className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreRanges} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E5DF" />
                <XAxis dataKey="range" tick={{ fill: "#636B65", fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#636B65", fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#E1E5DF] shadow-md text-xs">
                          <p className="font-bold text-[#202522]">Rentang Skor: {data.range}</p>
                          <p className="text-[#D5A85B] mt-1">
                            Frekuensi: <span className="font-bold">{data.count}</span> mahasiswa
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#D5A85B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Horizontal / Bar Chart - Rata-rata Skor per Angkatan */}
        <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522]">
                Rata-rata Skor per Angkatan
              </h3>
              <p className="text-xs text-[#737A74] mt-0.5">
                Tingkat ketergantungan AI rata-rata mahasiswa per angkatan (60–63)
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyChart("admin-chart-4", "Rata-rata Skor per Angkatan", "Analisis Angkatan")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold text-[#174C3C] border border-[#174C3C]/20 bg-[#EBF2EE] hover:bg-[#DCEAE1] transition-all cursor-pointer shrink-0"
              title="Salin grafik sebagai gambar PNG"
            >
              {copiedId === "admin-chart-4" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Tersalin!</span>
                </>
              ) : downloadedId === "admin-chart-4" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Terunduh!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#174C3C]" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>

          <div id="admin-chart-4" className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cohortChartData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E1E5DF" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#636B65", fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "#202522", fontSize: 11 }}
                  width={110}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#E1E5DF] shadow-md text-xs">
                          <p className="font-bold text-[#202522]">{data.name}</p>
                          <p className="text-[#174C3C] mt-1">
                            Rata-rata Skor: <span className="font-bold">{data.rataRata}</span> / 100
                          </p>
                          <p className="text-[#737A74] text-[11px]">Jumlah: {data.responden} responden</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rataRata" fill="#174C3C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
