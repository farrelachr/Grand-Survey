"use server";

import { createClient } from "@/lib/supabase/server";
import { validateStudentEmail } from "@/lib/auth-validation";
import { redirect } from "next/navigation";

export async function sendOtpOrMagicLink(email: string) {
  // Validate email domain on server
  const validation = validateStudentEmail(email);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error || "Alamat email tidak memenuhi kriteria institusi IPB University.",
    };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email: validation.normalizedEmail,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("Supabase OTP error:", error);
    // Generic safe error message
    return {
      success: false,
      error: "Gagal mengirimkan tautan verifikasi. Pastikan email Anda benar dan coba lagi nanti.",
    };
  }

  return {
    success: true,
    message: "Tautan verifikasi telah dikirimkan ke email IPB Anda. Silakan periksa kotak masuk atau spam.",
  };
}

export async function verifyOtp(email: string, token: string) {
  const validation = validateStudentEmail(email);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error || "Format email tidak valid.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: validation.normalizedEmail,
    token,
    type: "email",
  });

  if (error) {
    return {
      success: false,
      error: "Kode OTP tidak valid atau telah kedaluwarsa. Silakan minta kode baru.",
    };
  }

  return {
    success: true,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
