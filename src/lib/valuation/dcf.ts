import type { CompanyFundamentals, Assumptions } from "@/data/companies/types";

export type { Assumptions } from "@/data/companies/types";

export interface ProjectedYear {
  year:      number;
  revenue:   number;
  ebit:      number;
  nopat:     number;
  da:        number;
  capex:     number;
  deltaNwc:  number;
  fcf:       number;
  pvFcf:     number;
}

export interface DcfResult {
  intrinsicValue:       number;
  currentPrice:         number;
  impliedUpside:        number;
  enterpriseValue:      string;
  equityValue:          string;
  terminalValue:        number;
  pvTerminalValue:      number;
  projectedCashFlows:   ProjectedYear[];
  bearCase:             number;
  baseCase:             number;
  bullCase:             number;
  valid:                boolean;
}

// ─── Core engine ─────────────────────────────────────────────────────────────

function fairValuePerShare(
  assumptions: Assumptions,
  fundamentals: CompanyFundamentals,
): number | null {
  const g      = assumptions.revenueCAGR    / 100;
  const ebitM  = assumptions.ebitMargin     / 100;
  const t      = assumptions.taxRate        / 100;
  const wacc   = assumptions.wacc           / 100;
  const tg     = assumptions.terminalGrowth / 100;
  const capex  = assumptions.capexRevenue   / 100;
  const nwcPct = assumptions.nwcChange      / 100;
  const daPct  = fundamentals.daPercentRevenue / 100;

  if (wacc <= tg) return null;

  let prevRevenue = fundamentals.currentRevenue;
  let sumPvFcf    = 0;
  let lastFcf     = 0;

  for (let i = 1; i <= fundamentals.projectionYears; i++) {
    const revenue  = prevRevenue * (1 + g);
    const nopat    = revenue * ebitM * (1 - t);
    const da       = revenue * daPct;
    const capexAmt = revenue * capex;
    const deltaNwc = (revenue - prevRevenue) * nwcPct;
    const fcf      = nopat + da - capexAmt - deltaNwc;

    sumPvFcf   += fcf / Math.pow(1 + wacc, i);
    lastFcf     = fcf;
    prevRevenue = revenue;
  }

  const tv   = lastFcf * (1 + tg) / (wacc - tg);
  const pvTv = tv / Math.pow(1 + wacc, fundamentals.projectionYears);
  const ev   = sumPvFcf + pvTv;
  const equity = ev - fundamentals.netDebt;

  return equity / fundamentals.sharesOutstanding;
}

// ─── Full result (with projected schedule + scenarios) ───────────────────────

export function recalculateDcf(
  assumptions: Assumptions,
  fundamentals: CompanyFundamentals,
  currentPrice: number,
): DcfResult {
  const g      = assumptions.revenueCAGR    / 100;
  const ebitM  = assumptions.ebitMargin     / 100;
  const t      = assumptions.taxRate        / 100;
  const wacc   = assumptions.wacc           / 100;
  const tg     = assumptions.terminalGrowth / 100;
  const capex  = assumptions.capexRevenue   / 100;
  const nwcPct = assumptions.nwcChange      / 100;
  const daPct  = fundamentals.daPercentRevenue / 100;

  if (wacc <= tg) {
    return {
      intrinsicValue: 0, currentPrice, impliedUpside: 0,
      enterpriseValue: "—", equityValue: "—",
      terminalValue: 0, pvTerminalValue: 0,
      projectedCashFlows: [],
      bearCase: 0, baseCase: 0, bullCase: 0,
      valid: false,
    };
  }

  const years: ProjectedYear[] = [];
  let prevRevenue = fundamentals.currentRevenue;
  let sumPvFcf    = 0;

  for (let i = 1; i <= fundamentals.projectionYears; i++) {
    const revenue  = prevRevenue * (1 + g);
    const ebit     = revenue * ebitM;
    const nopat    = ebit * (1 - t);
    const da       = revenue * daPct;
    const capexAmt = revenue * capex;
    const deltaNwc = (revenue - prevRevenue) * nwcPct;
    const fcf      = nopat + da - capexAmt - deltaNwc;
    const pvFcf    = fcf / Math.pow(1 + wacc, i);

    years.push({ year: i, revenue, ebit, nopat, da, capex: capexAmt, deltaNwc, fcf, pvFcf });
    sumPvFcf   += pvFcf;
    prevRevenue = revenue;
  }

  const lastFcf         = years[years.length - 1].fcf;
  const terminalValue   = lastFcf * (1 + tg) / (wacc - tg);
  const pvTerminalValue = terminalValue / Math.pow(1 + wacc, fundamentals.projectionYears);

  const ev        = sumPvFcf + pvTerminalValue;
  const equityVal = ev - fundamentals.netDebt;
  const fairValue = equityVal / fundamentals.sharesOutstanding;
  const upside    = ((fairValue / currentPrice) - 1) * 100;

  const bearFv = fairValuePerShare(
    { ...assumptions, wacc: assumptions.wacc + 2, revenueCAGR: assumptions.revenueCAGR - 3, ebitMargin: assumptions.ebitMargin - 2 },
    fundamentals,
  ) ?? fairValue * 0.72;

  const bullFv = fairValuePerShare(
    { ...assumptions, wacc: assumptions.wacc - 2, revenueCAGR: assumptions.revenueCAGR + 3, ebitMargin: assumptions.ebitMargin + 2 },
    fundamentals,
  ) ?? fairValue * 1.32;

  const fmt = (v: number) => `R$ ${v.toFixed(1).replace(".", ",")}B`;

  return {
    intrinsicValue:     parseFloat(fairValue.toFixed(2)),
    currentPrice,
    impliedUpside:      parseFloat(upside.toFixed(1)),
    enterpriseValue:    fmt(ev),
    equityValue:        fmt(equityVal),
    terminalValue:      parseFloat(terminalValue.toFixed(1)),
    pvTerminalValue:    parseFloat(pvTerminalValue.toFixed(1)),
    projectedCashFlows: years,
    bearCase:           parseFloat(Math.max(0, bearFv).toFixed(2)),
    baseCase:           parseFloat(fairValue.toFixed(2)),
    bullCase:           parseFloat(bullFv.toFixed(2)),
    valid:              true,
  };
}

// ─── Sensitivity helper (one number, fast) ───────────────────────────────────

export function sensitivityFairValue(
  assumptions: Assumptions,
  overrideWacc: number,
  overrideTg: number,
  fundamentals: CompanyFundamentals,
): number {
  const fv = fairValuePerShare(
    { ...assumptions, wacc: overrideWacc, terminalGrowth: overrideTg },
    fundamentals,
  );
  return fv !== null ? parseFloat(fv.toFixed(2)) : 0;
}
