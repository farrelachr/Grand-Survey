"use client";

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
      cs_interest?: string;
      primary_ai_tool?: string;
    };
  }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  RENDAH: "#174C3C", // Deep Forest Green
  SEDANG: "#D5A85B", // Amber Gold
  TINGGI: "#B42318", // Dark Crimson
};

export function AdminCharts({ submissions }: AdminChartsProps) {
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

  // 3. Average Score by CS Interest
  const interestScores: Record<string, { total: number; count: number }> = {};
  for (const s of submissions) {
    const interest = s.answers?.cs_interest || "Belum Menentukan";
    const shortInterest = interest.split("&")[0].trim().replace("Development", "Dev");
    if (!interestScores[shortInterest]) {
      interestScores[shortInterest] = { total: 0, count: 0 };
    }
    interestScores[shortInterest].total += Number(s.dependency_score || 0);
    interestScores[shortInterest].count += 1;
  }

  const interestChartData = Object.entries(interestScores).map(([name, data]) => ({
    name,
    rataRata: Math.round((data.total / data.count) * 10) / 10,
    responden: data.count,
  }));

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
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522]">
              Proporsi Kategori Ketergantungan
            </h3>
            <p className="text-xs text-[#737A74] mt-0.5">
              Komposisi mahasiswa berdasarkan rentang indeks skor (N = {submissions.length})
            </p>
          </div>

          <div className="h-64 w-full">
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
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522]">
              Frekuensi Alat AI Utama
            </h3>
            <p className="text-xs text-[#737A74] mt-0.5">
              Alat kecerdasan buatan yang paling sering diandalkan untuk tugas kuliah
            </p>
          </div>

          <div className="h-64 w-full">
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
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522]">
              Sebaran Rentang Skor (Histogram 0–100)
            </h3>
            <p className="text-xs text-[#737A74] mt-0.5">
              Distribusi kepadatan skor indeks ketergantungan mahasiswa
            </p>
          </div>

          <div className="h-64 w-full">
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

        {/* CHART 4: Horizontal / Bar Chart - Rata-rata Skor per Peminatan */}
        <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522]">
              Rata-rata Skor per Bidang Minat
            </h3>
            <p className="text-xs text-[#737A74] mt-0.5">
              Tingkat ketergantungan AI rata-rata berdasarkan peminatan CS
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={interestChartData}
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
