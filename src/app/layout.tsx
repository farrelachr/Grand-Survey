import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grand Survey HIMALKOM 2026 — AI Dependency Survey Platform",
  description: "Analisis Ketergantungan Mahasiswa Program Studi Ilmu Komputer IPB University Angkatan 62 terhadap Artificial Intelligence dalam Pembelajaran dan Aktivitas Akademik.",
  keywords: ["HIMALKOM", "IPB University", "Grand Survey 2026", "Ilmu Komputer", "AI Dependency", "Artificial Intelligence"],
  authors: [{ name: "HIMALKOM IPB University" }],
  icons: {
    icon: "/rnt-logo.png",
    shortcut: "/rnt-logo.png",
    apple: "/rnt-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#174C3C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#F7F7F2] text-[#202522]">
        {children}
      </body>
    </html>
  );
}
