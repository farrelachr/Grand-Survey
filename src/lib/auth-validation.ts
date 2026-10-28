/**
 * Server-side domain and email validation for IPB University students.
 */

export function getAllowedEmailDomains(): string[] {
  const envVal = process.env.ALLOWED_EMAIL_DOMAINS || "apps.ipb.ac.id,ipb.ac.id";
  return envVal
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

export interface EmailValidationResult {
  isValid: boolean;
  normalizedEmail: string;
  domain: string;
  error?: string;
}

/**
 * Validates that an email has valid syntax and strictly belongs to an allowed IPB domain.
 * Guards against tricks such as subdomains (attacker.apps.ipb.ac.id.evil.com) and embedded usernames.
 */
export function validateStudentEmail(email: string): EmailValidationResult {
  if (!email || typeof email !== "string") {
    return {
      isValid: false,
      normalizedEmail: "",
      domain: "",
      error: "Alamat email tidak boleh kosong.",
    };
  }

  const trimmed = email.trim().toLowerCase();

  // Clean standard email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      normalizedEmail: trimmed,
      domain: "",
      error: "Format alamat email tidak valid.",
    };
  }

  const parts = trimmed.split("@");
  if (parts.length !== 2) {
    return {
      isValid: false,
      normalizedEmail: trimmed,
      domain: "",
      error: "Format alamat email tidak valid.",
    };
  }

  const domain = parts[1].toLowerCase();
  const allowedDomains = getAllowedEmailDomains();

  const isAllowed = allowedDomains.includes(domain);

  if (!isAllowed) {
    return {
      isValid: false,
      normalizedEmail: trimmed,
      domain,
      error: `Domain email @${domain} tidak diizinkan. Gunakan email resmi IPB University (@apps.ipb.ac.id atau @ipb.ac.id).`,
    };
  }

  return {
    isValid: true,
    normalizedEmail: trimmed,
    domain,
  };
}

/**
 * Checks whether an email is an authorized administrator.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
  const allowedAdmins = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return allowedAdmins.includes(email.trim().toLowerCase());
}
