/**
 * Development-only script: checks which tickers with hasCvmMapping=true
 * return ≥3 years of CVM DFP financials via the local API endpoint.
 *
 * Usage:
 *   npx tsx scripts/check-cvm-financials.ts [BASE_URL]
 *
 * BASE_URL defaults to http://localhost:3000
 *
 * This script is NOT imported by any production code and does NOT affect the build.
 */

import { B3_UNIVERSE } from "../src/data/b3-universe";

const BASE_URL = process.argv[2] ?? "http://localhost:3000";

interface FinancialsResponse {
  ticker: string;
  source: string;
  error?: string;
  financials: unknown[];
}

async function checkTicker(ticker: string): Promise<{
  ticker: string;
  years: number;
  ok: boolean;
  error?: string;
}> {
  try {
    const url = `${BASE_URL}/api/cvm/financials/${ticker}`;
    const res = await fetch(url);
    if (!res.ok) {
      return { ticker, years: 0, ok: false, error: `HTTP ${res.status}` };
    }
    const body = (await res.json()) as FinancialsResponse;
    if (body.error) {
      return { ticker, years: 0, ok: false, error: body.error };
    }
    const years = Array.isArray(body.financials) ? body.financials.length : 0;
    return { ticker, years, ok: years >= 3 };
  } catch (err) {
    return { ticker, years: 0, ok: false, error: String(err) };
  }
}

async function main() {
  const mapped = B3_UNIVERSE.filter(a => a.hasCvmMapping);

  console.log(`\nChecking ${mapped.length} tickers with hasCvmMapping=true`);
  console.log(`Base URL: ${BASE_URL}\n`);
  console.log("Ticker  | Years | Status  | Notes");
  console.log("--------|-------|---------|----------------------------------------------");

  let pass = 0;
  let fail = 0;

  for (const asset of mapped) {
    const result = await checkTicker(asset.ticker);
    const status = result.ok ? "✓ ok" : "✗ fail";
    const note   = result.error ?? (result.years < 3 ? `only ${result.years} year(s)` : "");
    const yr     = result.years > 0 ? String(result.years) : "—";
    console.log(`${asset.ticker.padEnd(7)} | ${yr.padEnd(5)} | ${status.padEnd(7)} | ${note}`);
    if (result.ok) pass++; else fail++;
  }

  console.log(`\nResult: ${pass} pass / ${fail} fail out of ${mapped.length} mapped tickers\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
