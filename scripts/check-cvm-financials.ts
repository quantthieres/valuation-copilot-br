/**
 * Development-only audit script: validates CVM DFP data availability for all
 * tickers with coverageStatus "cvm_financials" or "valuation_available".
 *
 * Usage:
 *   npx tsx scripts/check-cvm-financials.ts [options]
 *
 * Options:
 *   --url URL         Base URL of the running dev server (default: http://localhost:3000)
 *   --ticker TICKER   Audit a single ticker only
 *   --json            Output results as JSON instead of a table
 *
 * Examples:
 *   npx tsx scripts/check-cvm-financials.ts
 *   npx tsx scripts/check-cvm-financials.ts --ticker PETR4
 *   npx tsx scripts/check-cvm-financials.ts --json > audit.json
 *   npx tsx scripts/check-cvm-financials.ts --url http://localhost:3001
 *
 * This script is NOT imported by any production code. It does NOT affect the build.
 * Run with the dev server active: npm run dev
 */

// ─── Relative imports only (no @/ alias needed at runtime) ───────────────────

import { B3_UNIVERSE } from "../src/data/b3-universe";
import { getCvmCompanyByTicker } from "../src/lib/cvm/company-map";
import type { B3Asset } from "../src/data/b3-universe";
import type { CoverageStatus, AssetType } from "../src/data/coverage-types";

// ─── Inline types (avoid @/ alias for tsx runtime compatibility) ──────────────

interface NormalizedFinancials {
  ticker: string;
  fiscalYear: number;
  revenue?: number;
  ebit?: number;
  netIncome?: number;
  operatingCashFlow?: number;
  capex?: number;
  freeCashFlow?: number;
  cash?: number;
  totalDebt?: number;
  netDebt?: number;
}

interface ApiFinancialsResponse {
  ticker: string;
  source: string;
  error?: string;
  company?: {
    cvmCode?: string;
    companyName?: string;
  };
  financials: NormalizedFinancials[];
}

// ─── Eligibility logic (mirrored from cvm-valuation-builder.ts) ──────────────

const PRELIMINARY_STATUSES: CoverageStatus[] = ["cvm_financials"];
const ELIGIBLE_TYPES: AssetType[] = ["stock", "unit"];

function assetEligibilityReason(asset: B3Asset): string | null {
  if (asset.hasMockData)                                    return "has mock data";
  if (!PRELIMINARY_STATUSES.includes(asset.coverageStatus)) return `status is ${asset.coverageStatus}`;
  if (!asset.hasCvmMapping)                                 return "no CVM mapping";
  if (!ELIGIBLE_TYPES.includes(asset.assetType))            return `assetType is ${asset.assetType}`;
  return null;
}

function dataEligibilityReason(financials: NormalizedFinancials[]): string | null {
  if (financials.length < 3) return `only ${financials.length} year(s) of data`;

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

// ─── CLI args ─────────────────────────────────────────────────────────────────

function parseArgs(): { baseUrl: string; singleTicker: string | null; json: boolean } {
  const args = process.argv.slice(2);
  let baseUrl = "http://localhost:3000";
  let singleTicker: string | null = null;
  let json = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--url"    && args[i + 1]) { baseUrl      = args[++i]; continue; }
    if (args[i] === "--ticker" && args[i + 1]) { singleTicker = args[++i].toUpperCase(); continue; }
    if (args[i] === "--json")                  { json = true; continue; }
    // Legacy: bare URL as first positional argument
    if (!args[i].startsWith("--") && i === 0) { baseUrl = args[i]; }
  }

  return { baseUrl, singleTicker, json };
}

// ─── API fetch ────────────────────────────────────────────────────────────────

async function fetchFinancials(
  ticker: string,
  baseUrl: string,
): Promise<{ data: ApiFinancialsResponse | null; error: string | null }> {
  try {
    const res = await fetch(`${baseUrl}/api/cvm/financials/${ticker}`, {
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return { data: null, error: `HTTP ${res.status}` };
    const body = (await res.json()) as ApiFinancialsResponse;
    return { data: body, error: body.error ?? null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { data: null, error: msg.includes("ECONNREFUSED") ? "server not running" : msg };
  }
}

// ─── Audit row ────────────────────────────────────────────────────────────────

interface AuditRow {
  ticker:          string;
  tradingName:     string;
  companyName:     string;
  coverageStatus:  CoverageStatus;
  hasCvmMapping:   boolean;
  cvmCode:         string | null;
  // API results
  fetchError:      string | null;
  yearsReturned:   number;
  latestYear:      number | null;
  revenue:         number | null;
  ebit:            number | null;
  netIncome:       number | null;
  ocf:             number | null;
  capex:           number | null;
  fcf:             number | null;
  netDebt:         number | null;
  // Eligibility
  assetEligible:   boolean;
  assetReason:     string | null;
  dataEligible:    boolean;
  dataReason:      string | null;
  overallEligible: boolean;
  eligibleReason:  string | null;
}

async function auditTicker(asset: B3Asset, baseUrl: string): Promise<AuditRow> {
  const cvmEntry  = getCvmCompanyByTicker(asset.ticker);
  const cvmCode   = cvmEntry?.cvmCode ?? null;

  const assetReason   = assetEligibilityReason(asset);
  const assetEligible = assetReason === null;

  let fetchError:  string | null = null;
  let years: NormalizedFinancials[] = [];
  let latestYear:  number | null    = null;
  let revenue:     number | null    = null;
  let ebit:        number | null    = null;
  let netIncome:   number | null    = null;
  let ocf:         number | null    = null;
  let capex:       number | null    = null;
  let fcf:         number | null    = null;
  let netDebt:     number | null    = null;

  const { data, error } = await fetchFinancials(asset.ticker, baseUrl);
  fetchError = error;

  if (data && Array.isArray(data.financials)) {
    years = data.financials;
    if (years.length > 0) {
      const latest = [...years].sort((a, b) => b.fiscalYear - a.fiscalYear)[0];
      latestYear = latest.fiscalYear;
      revenue    = latest.revenue         ?? null;
      ebit       = latest.ebit            ?? null;
      netIncome  = latest.netIncome       ?? null;
      ocf        = latest.operatingCashFlow ?? null;
      capex      = latest.capex           ?? null;
      fcf        = latest.freeCashFlow    ?? null;
      netDebt    = latest.netDebt         ?? null;
    }
  }

  const dataReason    = dataEligibilityReason(years);
  const dataEl        = dataReason === null;
  const overallEl     = assetEligible && dataEl;
  const eligibleReason: string | null = !assetEligible
    ? assetReason
    : !dataEl
    ? dataReason
    : null;

  return {
    ticker:          asset.ticker,
    tradingName:     asset.tradingName,
    companyName:     asset.companyName,
    coverageStatus:  asset.coverageStatus,
    hasCvmMapping:   asset.hasCvmMapping,
    cvmCode,
    fetchError,
    yearsReturned:   years.length,
    latestYear,
    revenue,
    ebit,
    netIncome,
    ocf,
    capex,
    fcf,
    netDebt,
    assetEligible,
    assetReason,
    dataEligible:    dataEl,
    dataReason,
    overallEligible: overallEl,
    eligibleReason,
  };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

function fmtB(v: number | null): string {
  if (v === null) return "—";
  return v.toFixed(1);
}

function padL(s: string, w: number): string { return s.padStart(w); }
function padR(s: string, w: number): string { return s.padEnd(w);   }

const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM    = "\x1b[2m";
const BOLD   = "\x1b[1m";

function colored(s: string, code: string): string {
  return process.stdout.isTTY ? `${code}${s}${RESET}` : s;
}

// ─── Table output ─────────────────────────────────────────────────────────────

function printTable(rows: AuditRow[]): void {
  //            TICKER  NAME             ST   MAP  CODE   YRS YEAR  REV.B   EBIT.B  NI.B   OCF.B   CAP.B   FCF.B   ND.B   EL  REASON
  const H = `${"TICKER".padEnd(7)}  ${"NAME".padEnd(16)}  ${"ST".padEnd(3)}  ${"MAP".padEnd(3)}  ${"CODE".padEnd(6)}  ${"YRS".padStart(3)}  ${"YEAR".padStart(4)}  ${"REV.B".padStart(7)}  ${"EBIT.B".padStart(7)}  ${"NI.B".padStart(7)}  ${"OCF.B".padStart(7)}  ${"CAP.B".padStart(6)}  ${"FCF.B".padStart(7)}  ${"ND.B".padStart(7)}  EL  REASON`;
  const SEP = "─".repeat(H.length + 2);

  console.log();
  console.log(colored(H, BOLD));
  console.log(SEP);

  for (const r of rows) {
    const st   = r.coverageStatus === "cvm_financials" ? "cvm" : "val";
    const map  = r.hasCvmMapping ? "Y" : "N";
    const code = r.cvmCode ?? "—";
    const yrs  = r.yearsReturned > 0 ? String(r.yearsReturned) : "—";
    const yr   = r.latestYear    ? String(r.latestYear)    : "—";

    let el: string;
    if (r.coverageStatus === "valuation_available") {
      el = colored("VA", DIM);
    } else if (r.fetchError) {
      el = colored("ERR", YELLOW);
    } else if (r.overallEligible) {
      el = colored("✓", GREEN);
    } else {
      el = colored("✗", RED);
    }

    const reason = r.fetchError
      ? (r.fetchError.length > 50 ? r.fetchError.slice(0, 47) + "…" : r.fetchError)
      : r.eligibleReason ?? "";

    const name = r.tradingName.length > 16 ? r.tradingName.slice(0, 15) + "…" : r.tradingName;

    console.log(
      `${padR(r.ticker, 7)}  ${padR(name, 16)}  ${padR(st, 3)}  ${padR(map, 3)}  ${padR(code, 6)}  ` +
      `${padL(yrs, 3)}  ${padL(yr, 4)}  ` +
      `${padL(fmtB(r.revenue), 7)}  ${padL(fmtB(r.ebit), 7)}  ${padL(fmtB(r.netIncome), 7)}  ` +
      `${padL(fmtB(r.ocf), 7)}  ${padL(fmtB(r.capex), 6)}  ${padL(fmtB(r.fcf), 7)}  ${padL(fmtB(r.netDebt), 7)}  ` +
      `${el.padEnd(2)}  ${reason}`,
    );
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────

interface Summary {
  totalChecked:       number;
  withCvmMapping:     number;
  withAnyData:        number;
  withThreePlusYears: number;
  eligible:           number;
  notEligible:        number;
  errors:             number;
}

function buildSummary(rows: AuditRow[]): Summary {
  return {
    totalChecked:       rows.length,
    withCvmMapping:     rows.filter(r => r.hasCvmMapping).length,
    withAnyData:        rows.filter(r => r.yearsReturned > 0).length,
    withThreePlusYears: rows.filter(r => r.yearsReturned >= 3).length,
    eligible:           rows.filter(r => r.overallEligible).length,
    notEligible:        rows.filter(r => !r.overallEligible && !r.fetchError && r.coverageStatus === "cvm_financials").length,
    errors:             rows.filter(r => r.fetchError !== null).length,
  };
}

function printSummary(summary: Summary): void {
  console.log();
  console.log(colored("── Summary ──────────────────────────────────", BOLD));
  console.log(`  Total checked          : ${summary.totalChecked}`);
  console.log(`  With CVM mapping       : ${summary.withCvmMapping}`);
  console.log(`  With any data returned : ${summary.withAnyData}`);
  console.log(`  With ≥ 3 years         : ${summary.withThreePlusYears}`);
  console.log(`  Eligible for prelim.   : ${colored(String(summary.eligible), GREEN)}`);
  console.log(`  Not eligible           : ${colored(String(summary.notEligible), RED)}`);
  console.log(`  Fetch errors           : ${summary.errors > 0 ? colored(String(summary.errors), YELLOW) : "0"}`);
  console.log();
}

// ─── Ineligible detail block ──────────────────────────────────────────────────

function printIneligibleDetail(rows: AuditRow[]): void {
  const ineligible = rows.filter(
    r => !r.overallEligible && !r.fetchError && r.coverageStatus === "cvm_financials",
  );
  if (ineligible.length === 0) return;

  console.log(colored("── Not eligible (cvm_financials) ────────────", BOLD));
  for (const r of ineligible) {
    const reason = r.eligibleReason ?? "unknown";
    console.log(`  ${padR(r.ticker, 7)}  ${colored(reason, RED)}`);
  }
  console.log();
}

// ─── JSON output ──────────────────────────────────────────────────────────────

function outputJson(rows: AuditRow[], summary: Summary): void {
  const output = {
    generatedAt: new Date().toISOString(),
    summary,
    rows: rows.map(r => ({
      ticker:          r.ticker,
      tradingName:     r.tradingName,
      companyName:     r.companyName,
      coverageStatus:  r.coverageStatus,
      hasCvmMapping:   r.hasCvmMapping,
      cvmCode:         r.cvmCode,
      fetchError:      r.fetchError,
      yearsReturned:   r.yearsReturned,
      latestYear:      r.latestYear,
      latestRevenue:   r.revenue,
      latestEbit:      r.ebit,
      latestNetIncome: r.netIncome,
      latestOcf:       r.ocf,
      latestCapex:     r.capex,
      latestFcf:       r.fcf,
      latestNetDebt:   r.netDebt,
      assetEligible:   r.assetEligible,
      assetReason:     r.assetReason,
      dataEligible:    r.dataEligible,
      dataReason:      r.dataReason,
      overallEligible: r.overallEligible,
      eligibleReason:  r.eligibleReason,
    })),
  };
  console.log(JSON.stringify(output, null, 2));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { baseUrl, singleTicker, json } = parseArgs();

  const TARGET_STATUSES: CoverageStatus[] = ["cvm_financials", "valuation_available"];

  let assets = B3_UNIVERSE.filter(a => TARGET_STATUSES.includes(a.coverageStatus));

  if (singleTicker) {
    const found = assets.find(a => a.ticker === singleTicker);
    if (!found) {
      console.error(`Ticker ${singleTicker} not found or not in cvm_financials/valuation_available.`);
      process.exit(1);
    }
    assets = [found];
  }

  if (!json) {
    console.log();
    console.log(colored("CVM Financials Audit", BOLD));
    console.log(`Base URL  : ${baseUrl}`);
    console.log(`Checking  : ${assets.length} ticker(s)`);
    console.log(`Statuses  : cvm_financials + valuation_available`);
    console.log(
      `Note      : All monetary values in BRL billions (R$B). ` +
      `Eligibility = preliminary CVM valuation flow.`,
    );
  }

  // Sequential fetch to avoid hammering the dev server
  const rows: AuditRow[] = [];
  for (const asset of assets) {
    if (!json) process.stdout.write(`  Fetching ${asset.ticker}…\r`);
    const row = await auditTicker(asset, baseUrl);
    rows.push(row);
  }

  if (!json) process.stdout.write(" ".repeat(40) + "\r");

  const summary = buildSummary(rows);

  if (json) {
    outputJson(rows, summary);
    return;
  }

  printTable(rows);
  printSummary(summary);
  printIneligibleDetail(rows);
}

main().catch(err => {
  console.error("Fatal:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
