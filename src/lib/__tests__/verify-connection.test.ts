import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Live Supabase Database Connection Test", () => {
  it("successfully connects and queries survey_versions seeded row", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pahoyhylfrwmxikasqoi.supabase.co";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable__NSInajiTWZ-0Gv3qAiu3Q_rcSdFB2o";

    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase
      .from("survey_versions")
      .select("version, title, is_active")
      .eq("version", "2026.1");

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data?.length).toBeGreaterThan(0);
    expect(data?.[0].version).toBe("2026.1");
  });
});
