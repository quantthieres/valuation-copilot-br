import { describe, it, expect } from "vitest";
import {
  isPreliminaryEligible,
  buildPreliminaryCompanyDataFromCvm,
} from "./cvm-valuation-builder";
import type { B3Asset } from "@/data/b3-universe";
import type { NormalizedFinancials } from "./types";
import type { MarketDataQuote } from "@/lib/market-data/types";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const ENTRY: B3Asset = {
  ticker: "PETR4",
  companyName: "Petróleo Brasileiro S.A.",
  tradingName: "Petrobras PN",
  sector: "Petróleo e Gás",
  subsector: "Exploração e Refino",
  assetType: "stock",
  hasMockData: false,
  hasCvmMapping: true,
  coverageStatus: "cvm_financials",
};

const THREE_YEARS: NormalizedFinancials[] = [
  {
    ticker: "PETR4",
    fiscalYear: 2021,
    revenue: 400,
    ebit: 80,
    netIncome: 50,
    operatingCashFlow: 120,
    capex: 60,
    freeCashFlow: 60,
    cash: 50,
    totalDebt: 200,
    netDebt: 150,
  },
  {
    ticker: "PETR4",
    fiscalYear: 2022,
    revenue: 520,
    ebit: 110,
    netIncome: 70,
    operatingCashFlow: 160,
    capex: 80,
    freeCashFlow: 80,
    cash: 60,
    totalDebt: 210,
    netDebt: 150,
  },
  {
    ticker: "PETR4",
    fiscalYear: 2023,
    revenue: 480,
    ebit: 100,
    netIncome: 65,
    operatingCashFlow: 140,
    capex: 70,
    freeCashFlow: 70,
    cash: 55,
    totalDebt: 205,
    netDebt: 150,
  },
];

const QUOTE: MarketDataQuote = {
  ticker: "PETR4",
  price: 38,
  marketCap: 494_000_000_000,
  change: 0.5,
  changePercent: 1.3,
  source: "brapi",
};

function build(
  financials = THREE_YEARS,
  quote: MarketDataQuote | null = QUOTE,
  entry: B3Asset = ENTRY,
) {
  return buildPreliminaryCompanyDataFromCvm({
    b3Entry: entry,
    cvmFinancials: financials,
    marketQuote: quote,
  });
}

// ─── isPreliminaryEligible ────────────────────────────────────────────────────

describe("isPreliminaryEligible", () => {
  it("returns true for a valid CVM stock entry", () => {
    expect(isPreliminaryEligible(ENTRY)).toBe(true);
  });

  it("returns false when hasMockData is true", () => {
    expect(isPreliminaryEligible({ ...ENTRY, hasMockData: true })).toBe(false);
  });

  it("returns false when coverageStatus is not cvm_financials", () => {
    expect(isPreliminaryEligible({ ...ENTRY, coverageStatus: "quote_only" })).toBe(false);
    expect(isPreliminaryEligible({ ...ENTRY, coverageStatus: "valuation_available" })).toBe(false);
  });

  it("returns false when hasCvmMapping is false", () => {
    expect(isPreliminaryEligible({ ...ENTRY, hasCvmMapping: false })).toBe(false);
  });

  it("returns false for bank/FII assetTypes", () => {
    expect(isPreliminaryEligible({ ...ENTRY, assetType: "fii" })).toBe(false);
    expect(isPreliminaryEligible({ ...ENTRY, assetType: "bdr" })).toBe(false);
    expect(isPreliminaryEligible({ ...ENTRY, assetType: "etf" })).toBe(false);
  });

  it("returns true for unit assetType", () => {
    expect(isPreliminaryEligible({ ...ENTRY, assetType: "unit" })).toBe(true);
  });
});

// ─── buildPreliminaryCompanyDataFromCvm ──────────────────────────────────────

describe("buildPreliminaryCompanyDataFromCvm — null cases", () => {
  it("returns null when fewer than 3 years of data", () => {
    expect(build([THREE_YEARS[0]])).toBeNull();
    expect(build([THREE_YEARS[0], THREE_YEARS[1]])).toBeNull();
  });

  it("returns null when latest year has no revenue", () => {
    const noRevenue = THREE_YEARS.map(f =>
      f.fiscalYear === 2023 ? { ...f, revenue: undefined } : f,
    );
    expect(build(noRevenue)).toBeNull();
  });

  it("returns null when marketQuote is null", () => {
    expect(build(THREE_YEARS, null)).toBeNull();
  });

  it("returns null when price is 0", () => {
    expect(build(THREE_YEARS, { ...QUOTE, price: 0 })).toBeNull();
  });

  it("returns null when marketCap is absent", () => {
    const { marketCap: _, ...noMktCap } = QUOTE;
    expect(build(THREE_YEARS, noMktCap as MarketDataQuote)).toBeNull();
  });
});

describe("buildPreliminaryCompanyDataFromCvm — successful build", () => {
  it("returns a non-null CompanyData object", () => {
    expect(build()).not.toBeNull();
  });

  it("sets company.ticker and company.name from B3 entry", () => {
    const result = build()!;
    expect(result.company.ticker).toBe("PETR4");
    expect(result.company.name).toBe("Petróleo Brasileiro S.A.");
  });

  it("sets valuationStatus to Preliminar", () => {
    expect(build()!.company.valuationStatus).toBe("Preliminar");
  });

  it("estimates sharesOutstanding from marketCap / price (in billions)", () => {
    const result = build()!;
    // 494_000_000_000 BRL / 1e9 = 494 B; 494 / 38 ≈ 13.0 B shares
    const expected = 494 / 38;
    expect(result.fundamentals.sharesOutstanding).toBeCloseTo(expected, 2);
  });

  it("sets currentRevenue to latest year revenue", () => {
    expect(build()!.fundamentals.currentRevenue).toBe(480);
  });

  it("sets netDebt from latest year netDebt", () => {
    expect(build()!.fundamentals.netDebt).toBe(150);
  });
});

describe("buildPreliminaryCompanyDataFromCvm — financials order", () => {
  it("returns financials sorted oldest-to-newest (year ascending)", () => {
    // Supply years in reverse order to verify sorting
    const reversed = [...THREE_YEARS].reverse();
    const result = buildPreliminaryCompanyDataFromCvm({
      b3Entry: ENTRY,
      cvmFinancials: reversed,
      marketQuote: QUOTE,
    })!;
    const years = result.financials.map(f => Number(f.year));
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it("financials length equals input length", () => {
    expect(build()!.financials).toHaveLength(THREE_YEARS.length);
  });
});

describe("buildPreliminaryCompanyDataFromCvm — EBIT margin derivation", () => {
  it("derives ebitMargin from latest.ebit / latest.revenue", () => {
    const result = build()!;
    // 2023: ebit=100, revenue=480 → 20.8%
    const expected = parseFloat((100 / 480 * 100).toFixed(1));
    expect(result.defaultAssumptions.ebitMargin).toBeCloseTo(expected, 1);
  });

  it("falls back to 15.0 when ebit is absent", () => {
    const noEbit = THREE_YEARS.map(f =>
      f.fiscalYear === 2023 ? { ...f, ebit: undefined } : f,
    );
    const result = build(noEbit)!;
    expect(result.defaultAssumptions.ebitMargin).toBe(15.0);
  });

  it("falls back to 15.0 when ebit is negative", () => {
    const negEbit = THREE_YEARS.map(f =>
      f.fiscalYear === 2023 ? { ...f, ebit: -20 } : f,
    );
    const result = build(negEbit)!;
    expect(result.defaultAssumptions.ebitMargin).toBe(15.0);
  });
});

describe("buildPreliminaryCompanyDataFromCvm — capexRevenue derivation", () => {
  it("derives capexRevenue from latest.capex / latest.revenue", () => {
    const result = build()!;
    // 2023: capex=70, revenue=480 → 14.6%
    const expected = parseFloat((70 / 480 * 100).toFixed(1));
    expect(result.defaultAssumptions.capexRevenue).toBeCloseTo(expected, 1);
  });

  it("falls back to 4.0 when capex is absent", () => {
    const noCapex = THREE_YEARS.map(f =>
      f.fiscalYear === 2023 ? { ...f, capex: undefined } : f,
    );
    expect(build(noCapex)!.defaultAssumptions.capexRevenue).toBe(4.0);
  });

  it("falls back to 4.0 when capexRevenue exceeds 30%", () => {
    // capex=200 on revenue=480 → 41.7% → capped to default
    const highCapex = THREE_YEARS.map(f =>
      f.fiscalYear === 2023 ? { ...f, capex: 200 } : f,
    );
    expect(build(highCapex)!.defaultAssumptions.capexRevenue).toBe(4.0);
  });
});

describe("buildPreliminaryCompanyDataFromCvm — conservative defaults", () => {
  it("uses revenueCAGR of 5.0", () => {
    expect(build()!.defaultAssumptions.revenueCAGR).toBe(5.0);
  });

  it("uses wacc of 12.0", () => {
    expect(build()!.defaultAssumptions.wacc).toBe(12.0);
  });

  it("uses terminalGrowth of 4.0", () => {
    expect(build()!.defaultAssumptions.terminalGrowth).toBe(4.0);
  });

  it("uses taxRate of 25.0", () => {
    expect(build()!.defaultAssumptions.taxRate).toBe(25.0);
  });
});

describe("buildPreliminaryCompanyDataFromCvm — no fabricated data", () => {
  it("multiples array is empty", () => {
    expect(build()!.multiples).toHaveLength(0);
  });

  it("news array is empty", () => {
    expect(build()!.news).toHaveLength(0);
  });

  it("does not mutate the input financials array", () => {
    const input = THREE_YEARS.map(f => ({ ...f }));
    const inputCopy = input.map(f => ({ ...f }));
    buildPreliminaryCompanyDataFromCvm({ b3Entry: ENTRY, cvmFinancials: input, marketQuote: QUOTE });
    expect(input).toEqual(inputCopy);
  });
});

describe("buildPreliminaryCompanyDataFromCvm — sensitivity ranges", () => {
  it("provides waccVals array", () => {
    const { waccVals } = build()!;
    expect(Array.isArray(waccVals)).toBe(true);
    expect(waccVals!.length).toBeGreaterThan(0);
  });

  it("provides terminalGrowthVals array", () => {
    const { terminalGrowthVals } = build()!;
    expect(Array.isArray(terminalGrowthVals)).toBe(true);
    expect(terminalGrowthVals!.length).toBeGreaterThan(0);
  });
});
