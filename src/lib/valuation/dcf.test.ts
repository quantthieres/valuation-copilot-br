import { describe, it, expect } from "vitest";
import { recalculateDcf, sensitivityFairValue } from "./dcf";
import type { CompanyFundamentals, Assumptions } from "@/data/companies/types";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const BASE_FUNDAMENTALS: CompanyFundamentals = {
  currentRevenue:    30,   // R$ 30B
  sharesOutstanding: 6,    // 6B shares outstanding
  netDebt:          -3,    // R$ -3B (net cash position)
  projectionYears:  10,
  daPercentRevenue:  5,    // 5% D&A / revenue
};

const BASE_ASSUMPTIONS: Assumptions = {
  revenueCAGR:    10,   // 10% growth
  ebitMargin:     20,   // 20% EBIT margin
  taxRate:        25,   // 25% effective tax rate
  wacc:           12,   // 12% discount rate
  terminalGrowth:  4,   // 4% perpetual growth
  capexRevenue:    4,   // 4% capex / revenue
  nwcChange:       1,   // 1% working capital / revenue increment
};

const CURRENT_PRICE = 35;

// ─── recalculateDcf ───────────────────────────────────────────────────────────

describe("recalculateDcf", () => {
  it("returns valid: true for normal assumptions", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.valid).toBe(true);
  });

  it("returns intrinsicValue greater than zero", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.intrinsicValue).toBeGreaterThan(0);
  });

  it("returns projectedCashFlows length equal to projectionYears", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.projectedCashFlows).toHaveLength(BASE_FUNDAMENTALS.projectionYears);
  });

  it("returns enterpriseValue as a formatted R$ string", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    // e.g. "R$ 45,6B" — Brazilian decimal separator
    expect(result.enterpriseValue).toMatch(/^R\$ [\d,]+B$/);
  });

  it("returns equityValue as a formatted R$ string", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.equityValue).toMatch(/^R\$ [\d,]+B$/);
  });

  it("includes currentPrice in result unchanged", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.currentPrice).toBe(CURRENT_PRICE);
  });

  it("returns positive terminalValue", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.terminalValue).toBeGreaterThan(0);
  });

  it("pvTerminalValue is less than terminalValue (discounted)", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.pvTerminalValue).toBeLessThan(result.terminalValue);
  });

  it("bearCase is less than baseCase", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.bearCase).toBeLessThan(result.baseCase);
  });

  it("bullCase is greater than baseCase", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.bullCase).toBeGreaterThan(result.baseCase);
  });

  it("each projected year fcf is positive given normal assumptions", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    for (const yr of result.projectedCashFlows) {
      expect(yr.fcf).toBeGreaterThan(0);
    }
  });

  it("projected revenues grow monotonically under positive CAGR", () => {
    const result = recalculateDcf(BASE_ASSUMPTIONS, BASE_FUNDAMENTALS, CURRENT_PRICE);
    const revenues = result.projectedCashFlows.map(y => y.revenue);
    for (let i = 1; i < revenues.length; i++) {
      expect(revenues[i]).toBeGreaterThan(revenues[i - 1]);
    }
  });

  // ── invalid guard (wacc <= terminal growth) ────────────────────────────────

  it("returns valid: false when wacc equals terminal growth", () => {
    const bad = { ...BASE_ASSUMPTIONS, wacc: 4, terminalGrowth: 4 };
    const result = recalculateDcf(bad, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.valid).toBe(false);
  });

  it("returns valid: false when wacc is less than terminal growth", () => {
    const bad = { ...BASE_ASSUMPTIONS, wacc: 3, terminalGrowth: 4 };
    const result = recalculateDcf(bad, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.valid).toBe(false);
  });

  it("returns empty projectedCashFlows when invalid", () => {
    const bad = { ...BASE_ASSUMPTIONS, wacc: 4, terminalGrowth: 4 };
    const result = recalculateDcf(bad, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.projectedCashFlows).toHaveLength(0);
  });

  it("returns zero intrinsicValue when invalid", () => {
    const bad = { ...BASE_ASSUMPTIONS, wacc: 4, terminalGrowth: 4 };
    const result = recalculateDcf(bad, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.intrinsicValue).toBe(0);
  });

  it("returns '—' enterpriseValue when invalid", () => {
    const bad = { ...BASE_ASSUMPTIONS, wacc: 4, terminalGrowth: 4 };
    const result = recalculateDcf(bad, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(result.enterpriseValue).toBe("—");
  });

  // ── monotonicity ───────────────────────────────────────────────────────────

  it("higher WACC produces lower intrinsic value", () => {
    const lowWacc  = recalculateDcf({ ...BASE_ASSUMPTIONS, wacc: 10 }, BASE_FUNDAMENTALS, CURRENT_PRICE);
    const highWacc = recalculateDcf({ ...BASE_ASSUMPTIONS, wacc: 14 }, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(lowWacc.intrinsicValue).toBeGreaterThan(highWacc.intrinsicValue);
  });

  it("higher revenue CAGR produces higher intrinsic value", () => {
    const lowGrowth  = recalculateDcf({ ...BASE_ASSUMPTIONS, revenueCAGR: 6 },  BASE_FUNDAMENTALS, CURRENT_PRICE);
    const highGrowth = recalculateDcf({ ...BASE_ASSUMPTIONS, revenueCAGR: 14 }, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(highGrowth.intrinsicValue).toBeGreaterThan(lowGrowth.intrinsicValue);
  });

  it("higher EBIT margin produces higher intrinsic value", () => {
    const lowMargin  = recalculateDcf({ ...BASE_ASSUMPTIONS, ebitMargin: 12 }, BASE_FUNDAMENTALS, CURRENT_PRICE);
    const highMargin = recalculateDcf({ ...BASE_ASSUMPTIONS, ebitMargin: 28 }, BASE_FUNDAMENTALS, CURRENT_PRICE);
    expect(highMargin.intrinsicValue).toBeGreaterThan(lowMargin.intrinsicValue);
  });
});

// ─── sensitivityFairValue ─────────────────────────────────────────────────────

describe("sensitivityFairValue", () => {
  it("returns a number for a valid wacc / tg pair", () => {
    const fv = sensitivityFairValue(BASE_ASSUMPTIONS, 12, 4, BASE_FUNDAMENTALS);
    expect(typeof fv).toBe("number");
  });

  it("returns a positive value for normal assumptions", () => {
    const fv = sensitivityFairValue(BASE_ASSUMPTIONS, 12, 4, BASE_FUNDAMENTALS);
    expect(fv).toBeGreaterThan(0);
  });

  it("returns 0 when overrideWacc equals overrideTg", () => {
    const fv = sensitivityFairValue(BASE_ASSUMPTIONS, 4, 4, BASE_FUNDAMENTALS);
    expect(fv).toBe(0);
  });

  it("returns 0 when overrideWacc is less than overrideTg", () => {
    const fv = sensitivityFairValue(BASE_ASSUMPTIONS, 3, 5, BASE_FUNDAMENTALS);
    expect(fv).toBe(0);
  });

  it("lower override WACC produces higher fair value", () => {
    const fvLow  = sensitivityFairValue(BASE_ASSUMPTIONS, 10, 4, BASE_FUNDAMENTALS);
    const fvHigh = sensitivityFairValue(BASE_ASSUMPTIONS, 14, 4, BASE_FUNDAMENTALS);
    expect(fvLow).toBeGreaterThan(fvHigh);
  });

  it("higher override terminal growth produces higher fair value", () => {
    const fvLow  = sensitivityFairValue(BASE_ASSUMPTIONS, 12, 2, BASE_FUNDAMENTALS);
    const fvHigh = sensitivityFairValue(BASE_ASSUMPTIONS, 12, 5, BASE_FUNDAMENTALS);
    expect(fvHigh).toBeGreaterThan(fvLow);
  });

  it("result is rounded to 2 decimal places", () => {
    const fv = sensitivityFairValue(BASE_ASSUMPTIONS, 12, 4, BASE_FUNDAMENTALS);
    const decimals = fv.toString().split(".")[1]?.length ?? 0;
    expect(decimals).toBeLessThanOrEqual(2);
  });
});
