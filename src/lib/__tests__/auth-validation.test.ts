import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { validateStudentEmail, isAdminEmail } from "../auth-validation";

describe("Email & Domain Validation - Security Tests", () => {
  const originalEnv = process.env.ALLOWED_EMAIL_DOMAINS;
  const originalAdminEnv = process.env.ADMIN_EMAILS;

  beforeEach(() => {
    process.env.ALLOWED_EMAIL_DOMAINS = "apps.ipb.ac.id,ipb.ac.id";
    process.env.ADMIN_EMAILS = "admin.himalkom@apps.ipb.ac.id,ketua@ipb.ac.id";
  });

  afterEach(() => {
    process.env.ALLOWED_EMAIL_DOMAINS = originalEnv;
    process.env.ADMIN_EMAILS = originalAdminEnv;
  });

  it("accepts valid student IPB emails", () => {
    const res1 = validateStudentEmail("mahasiswa62@apps.ipb.ac.id");
    expect(res1.isValid).toBe(true);
    expect(res1.domain).toBe("apps.ipb.ac.id");

    const res2 = validateStudentEmail("dosen.cs@ipb.ac.id");
    expect(res2.isValid).toBe(true);
    expect(res2.domain).toBe("ipb.ac.id");
  });

  it("normalizes uppercase and trims whitespace in emails", () => {
    const res = validateStudentEmail("  STUDENT_62@APPS.IPB.AC.ID  ");
    expect(res.isValid).toBe(true);
    expect(res.normalizedEmail).toBe("student_62@apps.ipb.ac.id");
  });

  it("strictly rejects unapproved public domains (e.g. gmail, yahoo)", () => {
    const res1 = validateStudentEmail("student@gmail.com");
    expect(res1.isValid).toBe(false);
    expect(res1.error).toContain("tidak diizinkan");

    const res2 = validateStudentEmail("attacker@yahoo.co.id");
    expect(res2.isValid).toBe(false);
  });

  it("strictly rejects deceptive domain spoofing attacks", () => {
    // Suffix attack
    const res1 = validateStudentEmail("victim@apps.ipb.ac.id.attacker.com");
    expect(res1.isValid).toBe(false);

    // Prefix attack
    const res2 = validateStudentEmail("victim@fakeapps.ipb.ac.id");
    expect(res2.isValid).toBe(false);

    // Embedded in user part
    const res3 = validateStudentEmail("apps.ipb.ac.id@evil.com");
    expect(res3.isValid).toBe(false);

    // Subdomain not in allowlist
    const res4 = validateStudentEmail("user@subdomain.apps.ipb.ac.id");
    expect(res4.isValid).toBe(false);
  });

  it("rejects invalid, empty, or malformed email syntax", () => {
    expect(validateStudentEmail("").isValid).toBe(false);
    expect(validateStudentEmail("plainaddress").isValid).toBe(false);
    expect(validateStudentEmail("missingdomain@").isValid).toBe(false);
    expect(validateStudentEmail("@apps.ipb.ac.id").isValid).toBe(false);
    expect(validateStudentEmail("two@@apps.ipb.ac.id").isValid).toBe(false);
  });

  it("correctly identifies authorized administrators", () => {
    expect(isAdminEmail("admin.himalkom@apps.ipb.ac.id")).toBe(true);
    expect(isAdminEmail("ketua@ipb.ac.id")).toBe(true);
    expect(isAdminEmail("regular.student@apps.ipb.ac.id")).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });
});
