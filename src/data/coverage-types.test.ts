import { describe, it, expect } from "vitest";
import { COVERAGE_BADGE, COVERAGE_DESCRIPTION, type CoverageStatus } from "./coverage-types";

const ALL_STATUSES: CoverageStatus[] = [
  "valuation_available",
  "cvm_financials",
  "quote_only",
  "sector_specific_model_required",
  "unavailable",
];

// ─── COVERAGE_BADGE ───────────────────────────────────────────────────────────

describe("COVERAGE_BADGE", () => {
  it("has an entry for every CoverageStatus", () => {
    for (const status of ALL_STATUSES) {
      expect(COVERAGE_BADGE[status]).toBeDefined();
    }
  });

  it("every badge has a non-empty label string", () => {
    for (const status of ALL_STATUSES) {
      expect(typeof COVERAGE_BADGE[status].label).toBe("string");
      expect(COVERAGE_BADGE[status].label.length).toBeGreaterThan(0);
    }
  });

  it("every badge has a bg color string", () => {
    for (const status of ALL_STATUSES) {
      expect(typeof COVERAGE_BADGE[status].bg).toBe("string");
      expect(COVERAGE_BADGE[status].bg.length).toBeGreaterThan(0);
    }
  });

  it("every badge has a text color string", () => {
    for (const status of ALL_STATUSES) {
      expect(typeof COVERAGE_BADGE[status].color).toBe("string");
      expect(COVERAGE_BADGE[status].color.length).toBeGreaterThan(0);
    }
  });

  it("all badge labels are distinct", () => {
    const labels = ALL_STATUSES.map(s => COVERAGE_BADGE[s].label);
    const unique  = new Set(labels);
    expect(unique.size).toBe(labels.length);
  });

  it("valuation_available label is 'Valuation'", () => {
    expect(COVERAGE_BADGE["valuation_available"].label).toBe("Valuation");
  });

  it("cvm_financials label is 'CVM'", () => {
    expect(COVERAGE_BADGE["cvm_financials"].label).toBe("CVM");
  });

  it("quote_only label is 'Cotação'", () => {
    expect(COVERAGE_BADGE["quote_only"].label).toBe("Cotação");
  });

  it("sector_specific_model_required label is 'Modelo específico'", () => {
    expect(COVERAGE_BADGE["sector_specific_model_required"].label).toBe("Modelo específico");
  });

  it("unavailable label is 'Em breve'", () => {
    expect(COVERAGE_BADGE["unavailable"].label).toBe("Em breve");
  });
});

// ─── COVERAGE_DESCRIPTION ─────────────────────────────────────────────────────

describe("COVERAGE_DESCRIPTION", () => {
  it("has an entry for every CoverageStatus", () => {
    for (const status of ALL_STATUSES) {
      expect(COVERAGE_DESCRIPTION[status]).toBeDefined();
    }
  });

  it("every description is a non-empty string", () => {
    for (const status of ALL_STATUSES) {
      expect(typeof COVERAGE_DESCRIPTION[status]).toBe("string");
      expect(COVERAGE_DESCRIPTION[status].length).toBeGreaterThan(0);
    }
  });

  it("all descriptions are distinct", () => {
    const descs  = ALL_STATUSES.map(s => COVERAGE_DESCRIPTION[s]);
    const unique = new Set(descs);
    expect(unique.size).toBe(descs.length);
  });
});
