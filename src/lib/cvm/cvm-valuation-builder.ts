import type { NormalizedFinancials } from "./types";
import type { B3Asset } from "@/data/b3-universe";
import type { MarketDataQuote } from "@/lib/market-data/types";
import type {
  CompanyData,
  CompanyProfile,
  CompanyFundamentals,
  Assumptions,
  MetricItem,
} from "@/data/companies/types";
import { cvmFinancialsToDashboardFinancials } from "./transformers";

export interface PreliminaryBuilderParams {
  b3Entry:       B3Asset;
  cvmFinancials: NormalizedFinancials[];
  marketQuote:   MarketDataQuote | null;
}

// ─── Eligibility ──────────────────────────────────────────────────────────────

/** True when this B3 entry can attempt a preliminary CVM-driven valuation. */
export function isPreliminaryEligible(b3Entry: B3Asset): boolean {
  return (
    !b3Entry.hasMockData &&
    b3Entry.coverageStatus === "cvm_financials" &&
    b3Entry.hasCvmMapping &&
    (b3Entry.assetType === "stock" || b3Entry.assetType === "unit")
  );
}

/**
 * Returns null when the financials are usable for preliminary valuation,
 * or a human-readable reason string when they are not.
 *
 * Exported so the audit script and tests can reuse it directly.
 */
export function dataEligibilityReason(financials: NormalizedFinancials[]): string | null {
  if (financials.length < 3) {
    return `only ${financials.length} year(s) of data`;
  }

  const latest = [...financials].sort((a, b) => b.fiscalYear - a.fiscalYear)[0];

  if (latest.revenue === undefined) return "latest revenue missing";
  if (latest.revenue <= 0)          return "latest revenue <= 0";

  // All non-revenue key fields are zero or absent — data looks malformed
  const otherMetrics = [
    latest.ebit, latest.netIncome, latest.operatingCashFlow,
    latest.capex, latest.freeCashFlow, latest.netDebt,
  ];
  if (otherMetrics.every(v => v === undefined || v === 0)) {
    return "all latest metrics are zero";
  }

  // At least one income/CF metric must be non-zero for DCF assumptions
  const hasUsable =
    (latest.ebit              !== undefined && latest.ebit              !== 0) ||
    (latest.netIncome         !== undefined && latest.netIncome         !== 0) ||
    (latest.operatingCashFlow !== undefined && latest.operatingCashFlow !== 0) ||
    (latest.freeCashFlow      !== undefined && latest.freeCashFlow      !== 0);

  if (!hasUsable) return "no usable income/cash-flow metric";

  return null;
}

// ─── Formatting ───────────────────────────────────────────────────────────────

function fmtB(v: number): string {
  return `R$ ${v.toFixed(1).replace(".", ",")}B`;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

/**
 * Attempts to build a CompanyData object from CVM DFP annual financials.
 *
 * Returns null when:
 * - fewer than 3 fiscal years of data
 * - latest revenue is missing or <= 0
 * - all key metrics are zero (malformed data)
 * - no usable income/CF metric exists for DCF assumptions
 * - marketCap or price are unavailable (cannot estimate sharesOutstanding)
 *
 * The result is labelled "Preliminar" and carries conservative default
 * assumptions. It must not be treated as fully validated research data.
 */
export function buildPreliminaryCompanyDataFromCvm(
  params: PreliminaryBuilderParams,
): CompanyData | null {
  const { b3Entry, cvmFinancials, marketQuote } = params;

  if (dataEligibilityReason(cvmFinancials) !== null) return null;

  const sorted = [...cvmFinancials].sort((a, b) => b.fiscalYear - a.fiscalYear);
  const latest = sorted[0];

  // Shares must be estimable from brapi market cap and price.
  const price        = marketQuote?.price ?? 0;
  const marketCapRaw = marketQuote?.marketCap; // BRL (not billions)

  if (!marketCapRaw || price <= 0) return null;

  const marketCapB   = marketCapRaw / 1_000_000_000;
  const sharesOut    = marketCapB / price;        // billions of shares
  const netDebt      = latest.netDebt ?? 0;
  const evB          = marketCapB + netDebt;

  // ── Company profile ──────────────────────────────────────────────────────────
  const company: CompanyProfile = {
    name:            b3Entry.companyName,
    ticker:          b3Entry.ticker,
    exchange:        "B3",
    sector:          b3Entry.sector,
    price,
    priceChange:     marketQuote?.change         ?? 0,
    priceChangePct:  marketQuote?.changePercent  ?? 0,
    marketCap:       fmtB(marketCapB),
    enterpriseValue: fmtB(evB),
    currency:        "BRL",
    valuationStatus: "Preliminar",
    upside:          0, // updated by page.tsx after DCF
  };

  // ── Historical financials (sorted oldest→newest for chart) ────────────────
  const financials = cvmFinancialsToDashboardFinancials(cvmFinancials);

  // ── Metrics ───────────────────────────────────────────────────────────────
  const metrics: MetricItem[] = [];

  if (latest.revenue !== undefined) {
    metrics.push({ label: "Receita",         value: fmtB(latest.revenue),        trend: 0, suffix: "último ano" });
  }
  if (latest.ebit !== undefined && latest.revenue) {
    const margin = (latest.ebit / latest.revenue * 100).toFixed(1);
    metrics.push({ label: "Margem EBIT",     value: `${margin}%`,                trend: 0, suffix: "último ano" });
  }
  if (latest.freeCashFlow !== undefined) {
    metrics.push({ label: "FCL",             value: fmtB(latest.freeCashFlow),   trend: 0, suffix: "último ano" });
  }
  if (latest.netDebt !== undefined) {
    metrics.push({ label: "Dívida Líquida",  value: fmtB(latest.netDebt),        trend: 0, suffix: "último ano" });
  }
  metrics.push(   { label: "Valor de Mercado", value: fmtB(marketCapB),          trend: 0, suffix: "brapi"      });
  if (latest.netIncome && latest.netIncome > 0) {
    const pe = (marketCapB / latest.netIncome).toFixed(1);
    metrics.push({ label: "P/L",             value: `${pe}x`,                    trend: 0, suffix: "estimado"   });
  }
  if (latest.ebit && latest.ebit > 0) {
    const evEbit = (evB / latest.ebit).toFixed(1);
    metrics.push({ label: "EV/EBIT",         value: `${evEbit}x`,                trend: 0, suffix: "estimado"   });
  }

  // ── Fundamentals ──────────────────────────────────────────────────────────
  const fundamentals: CompanyFundamentals = {
    currentRevenue:   latest.revenue!,
    sharesOutstanding: sharesOut,
    netDebt,
    projectionYears:  10,
    daPercentRevenue:  2.5, // TODO: derive from DFC when CVM provides explicit D&A line
  };

  // ── Default assumptions (conservative) ───────────────────────────────────
  const rawEbitMargin =
    latest.ebit !== undefined && latest.revenue
      ? parseFloat((latest.ebit / latest.revenue * 100).toFixed(1))
      : null;
  // Fall back to 15 % if EBIT is absent or the company is loss-making
  const ebitMargin = rawEbitMargin !== null && rawEbitMargin > 0 ? rawEbitMargin : 15.0;

  const rawCapex =
    latest.capex !== undefined && latest.revenue && latest.capex > 0
      ? parseFloat((latest.capex / latest.revenue * 100).toFixed(1))
      : null;
  // Cap at 30 % to avoid extreme values from non-standard DFC rows
  const capexRevenue = rawCapex !== null && rawCapex < 30 ? rawCapex : 4.0;

  const defaultAssumptions: Assumptions = {
    revenueCAGR:    5.0,
    ebitMargin,
    taxRate:        25.0,
    wacc:           12.0,
    terminalGrowth:  4.0,
    capexRevenue,
    nwcChange:       1.0,
  };

  return {
    company,
    metrics,
    financials,
    fundamentals,
    defaultAssumptions,
    multiples: [], // no fabricated peer multiples
    news:      [],
    waccVals:           [11.0, 11.5, 12.0, 12.5, 13.0],
    terminalGrowthVals: [3.0,  3.5,  4.0,  4.5],
  };
}
