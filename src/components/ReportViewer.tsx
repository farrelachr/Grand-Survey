"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AnalyzedQuestionItem } from "@/lib/question-analytics";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Printer,
  ArrowLeft,
  BarChart3,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { copyChartAsImage } from "@/lib/chart-export";

interface ReportViewerProps {
  items: AnalyzedQuestionItem[];
  totalRespondents: number;
}

export function ReportViewer({ items, totalRespondents }: ReportViewerProps) {
  const [selectedSection, setSelectedSection] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleCopyChart = async (item: AnalyzedQuestionItem) => {
    const container = document.getElementById(`chart-card-${item.id}`);
    if (!container) return;

    try {
      const res = await copyChartAsImage({
        containerElement: container,
        title: item.title,
        categoryLabel: `No. ${item.index} • Bagian ${item.sectionNumber}: ${item.sectionTitle}`,
        metaText:
          item.mean !== undefined
            ? `Rata-rata: ${item.mean.toFixed(2)} / 4.00 (N = ${item.totalAnswered})`
            : `Total Responden: ${item.totalAnswered}`,
        filename: `q-${item.index}-${item.id}`,
      });

      if (res === "copied") {
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2500);
      } else {
        setDownloadedId(item.id);
        setTimeout(() => setDownloadedId(null), 2500);
      }
    } catch (err) {
      console.error("Gagal menyalin grafik:", err);
    }
  };

  const sectionOptions = useMemo(() => {
    const opts = [{ value: 0, label: `Semua Bagian (${items.length} Pertanyaan Teranalisis)` }];
    const counts: Record<number, { title: string; count: number }> = {};
    for (const item of items) {
      if (!counts[item.sectionNumber]) {
        counts[item.sectionNumber] = { title: item.sectionTitle, count: 0 };
      }
      counts[item.sectionNumber].count++;
    }
    for (const [numStr, data] of Object.entries(counts)) {
      const num = Number(numStr);
      opts.push({
        value: num,
        label: `Bagian ${num}: ${data.title} (${data.count})`,
      });
    }
    return opts;
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSection = selectedSection === 0 || item.sectionNumber === selectedSection;
      const matchSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSection && matchSearch;
    });
  }, [items, selectedSection, searchQuery]);

  // Reset page when filters change
  const handleSectionChange = (section: number) => {
    setSelectedSection(section);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = filteredItems.slice(startIndex, startIndex + pageSize);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E1E5DF] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#174C3C] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Panel Admin</span>
              </Link>
              <span className="text-[#C4CCC1]">|</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D5A85B]">
                Laporan Komprehensif
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202522]">
              Laporan Grafik Lengkap per Pertanyaan
            </h1>
            <p className="text-xs text-[#737A74] mt-1">
              Visualisasi agregat 54 pertanyaan non-essay • Berbasis data riil {totalRespondents} responden
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#202522] bg-[#FFFFFF] border border-[#E1E5DF] rounded hover:bg-[#F7F7F2] transition-colors self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-[#174C3C]" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Section filter */}
          <div className="sm:col-span-5 relative">
            <label className="block text-[11px] font-semibold text-[#737A74] uppercase tracking-wider mb-1">
              Filter Berdasarkan Bagian
            </label>
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => handleSectionChange(Number(e.target.value))}
                className="w-full pl-3 pr-8 py-2 bg-[#F7F7F2] border border-[#E1E5DF] rounded text-xs text-[#202522] focus:border-[#174C3C] cursor-pointer"
              >
                {sectionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search box */}
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-semibold text-[#737A74] uppercase tracking-wider mb-1">
              Cari Kata Kunci Pertanyaan
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#737A74] pointer-events-none" />
              <input
                type="text"
                placeholder="Cari pertanyaan (misal: 'debugging', 'copilot')..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-[#F7F7F2] border border-[#E1E5DF] rounded text-xs text-[#202522] focus:border-[#174C3C]"
              />
            </div>
          </div>

          {/* Page size selector */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-[#737A74] uppercase tracking-wider mb-1">
              Item / Hal
            </label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full py-2 px-2.5 bg-[#F7F7F2] border border-[#E1E5DF] rounded text-xs text-[#202522] focus:border-[#174C3C] cursor-pointer"
            >
              <option value={4}>4 chart</option>
              <option value={6}>6 chart</option>
              <option value={10}>10 chart</option>
              <option value={54}>Semua (54)</option>
            </select>
          </div>
        </div>

        {/* Counter Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#737A74] pt-3 border-t border-[#E1E5DF]">
          <span>
            Menampilkan <strong className="text-[#202522]">{totalItems > 0 ? startIndex + 1 : 0}</strong>–
            <strong className="text-[#202522]">{Math.min(startIndex + pageSize, totalItems)}</strong> dari{" "}
            <strong className="text-[#202522]">{totalItems}</strong> pertanyaan
          </span>
          <span>
            Halaman <strong className="text-[#202522]">{currentPage}</strong> dari{" "}
            <strong className="text-[#202522]">{totalPages}</strong>
          </span>
        </div>
      </div>

      {/* Question Chart Cards Grid */}
      {currentItems.length > 0 ? (
        <div className="space-y-6">
          {currentItems.map((item) => {
            const chartHeight = Math.max(200, item.chartData.length * 48);

            return (
              <div
                key={item.id}
                className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-6 shadow-sm hover:border-[#C4CCC1] transition-all"
              >
                {/* Question Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#E1E5DF] pb-4 mb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-[#174C3C] bg-[#EBF2EE] px-2 py-0.5 rounded">
                        No. {item.index}
                      </span>
                      <span className="text-[11px] font-semibold text-[#737A74] uppercase tracking-wider">
                        Bagian {item.sectionNumber}: {item.sectionTitle}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF5EB] text-[#B88728] font-semibold uppercase">
                        {item.type === "likert"
                          ? "Skala Likert (1–4)"
                          : item.type === "multiple_choice"
                          ? "Pilihan Ganda"
                          : "Pilihan Tunggal"}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-[#202522] leading-snug pt-1">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="text-xs text-[#636B65] leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    {item.mean !== undefined && (
                      <div className="text-right bg-[#F7F7F2] p-2 rounded border border-[#E1E5DF]">
                        <span className="text-[10px] uppercase font-semibold text-[#737A74] block">
                          Rata-rata Skor
                        </span>
                        <span className="text-base font-black text-[#174C3C]">
                          {item.mean.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-[#737A74] font-medium ml-1">/ 4.00</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopyChart(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold text-[#174C3C] border border-[#174C3C]/20 bg-[#EBF2EE] hover:bg-[#DCEAE1] transition-all cursor-pointer shadow-2xs"
                      title="Salin grafik sebagai gambar PNG ke clipboard"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#174C3C]" />
                          <span>Tersalin!</span>
                        </>
                      ) : downloadedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#174C3C]" />
                          <span>Terunduh!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#174C3C]" />
                          <span>Salin Grafik</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Question Horizontal Bar Chart */}
                <div id={`chart-card-${item.id}`} style={{ height: `${chartHeight}px` }} className="w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={item.chartData}
                      layout="vertical"
                      margin={{ top: 8, right: 30, left: 10, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E1E5DF" />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fill: "#636B65", fontSize: 11 }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        interval={0}
                        tick={{ fill: "#202522", fontSize: 11 }}
                        width={210}
                        tickFormatter={(val: string) => {
                          if (!val) return "";
                          return val.length > 28 ? `${val.slice(0, 26)}…` : val;
                        }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-[#FFFFFF] p-2.5 rounded border border-[#E1E5DF] shadow-md text-xs max-w-sm">
                                <p className="font-bold text-[#202522] leading-snug">{data.name}</p>
                                <p className="text-[#174C3C] mt-1.5 font-semibold">
                                  {data.count} responden ({data.percentage}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {item.chartData.map((entry, index) => {
                          // Accent colors for Likert or alternating green/gold
                          let barColor = "#174C3C";
                          if (item.type === "likert") {
                            const colors = ["#2A6F5B", "#4A8F7B", "#D5A85B", "#B42318"];
                            barColor = colors[index % colors.length];
                          } else if (index % 2 === 1) {
                            barColor = "#D5A85B";
                          }
                          return <Cell key={`cell-${index}`} fill={barColor} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Clear, Complete Legend Breakdown Below Chart */}
                <div className="mt-5 pt-4 border-t border-[#E1E5DF] grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {item.chartData.map((cd, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 p-2.5 rounded bg-[#F7F7F2] border border-[#E1E5DF]"
                    >
                      <span className="font-medium text-[#202522] leading-snug">
                        {cd.name}
                      </span>
                      <div className="shrink-0 flex items-center gap-1.5 font-bold text-[#174C3C] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E1E5DF]">
                        <span>{cd.count}</span>
                        <span className="text-[10px] text-[#737A74] font-normal">({cd.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-12 text-center text-xs text-[#737A74]">
          Tidak ditemukan pertanyaan yang cocok dengan filter atau kata kunci pencarian.
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-[#FFFFFF] border border-[#E1E5DF] rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-4 py-2 rounded text-xs font-semibold text-[#202522] border border-[#E1E5DF] bg-[#FFFFFF] hover:bg-[#F7F7F2] disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Only display first, last, and window around current page
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded text-xs font-semibold flex items-center justify-center transition-colors ${
                      currentPage === pageNum
                        ? "bg-[#174C3C] text-white shadow-xs"
                        : "border border-[#E1E5DF] text-[#202522] hover:bg-[#F7F7F2]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                return (
                  <span key={pageNum} className="text-xs text-[#737A74] px-1">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-4 py-2 rounded text-xs font-semibold text-[#202522] border border-[#E1E5DF] bg-[#FFFFFF] hover:bg-[#F7F7F2] disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
