// Server-side only. Do not import from client components.
import type { CvmRegistryCompany, CvmCompany } from "./types";
import { getCvmCompanyByTicker } from "./company-map";

const REGISTRY_URL =
  "https://dados.cvm.gov.br/dados/CIA_ABERTA/CAD/DADOS/cad_cia_aberta.csv";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

let registryCache: CvmRegistryCompany[] | null = null;
let registryCacheLoadedAt: number | null = null;

// ─── Registry fetch ───────────────────────────────────────────────────────────

export async function fetchCvmCompanyRegistry(): Promise<CvmRegistryCompany[]> {
  if (
    registryCache &&
    registryCacheLoadedAt &&
    Date.now() - registryCacheLoadedAt < CACHE_TTL_MS
  ) {
    return registryCache;
  }

  try {
    const res = await fetch(REGISTRY_URL, { cache: "no-store" });
    if (!res.ok) return registryCache ?? [];

    const buffer = await res.arrayBuffer();
    // CVM publishes CSVs in ISO-8859-1 (Latin-1).
    const text = new TextDecoder("latin1").decode(buffer);
    const companies = parseCvmRegistryCsv(text);

    registryCache = companies;
    registryCacheLoadedAt = Date.now();
    return companies;
  } catch {
    return registryCache ?? [];
  }
}

// ─── CSV parser ───────────────────────────────────────────────────────────────

function parseCvmRegistryCsv(text: string): CvmRegistryCompany[] {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(";");
  const idx = {
    cnpj:        headers.indexOf("CNPJ_CIA"),
    social:      headers.indexOf("DENOM_SOCIAL"),
    comercial:   headers.indexOf("DENOM_COMERC"),
    status:      headers.indexOf("SIT"),
    cvmCode:     headers.indexOf("CD_CVM"),
  };

  const results: CvmRegistryCompany[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = line.split(";");
    if (cols.length < 10) continue;

    const status    = cols[idx.status]?.trim();
    const cnpj      = cols[idx.cnpj]?.trim();
    const social    = cols[idx.social]?.trim();
    const comercial = cols[idx.comercial]?.trim() || undefined;
    const cvmCode   = cols[idx.cvmCode]?.trim();

    if (!cnpj || !social || !cvmCode) continue;

    results.push({
      cvmCode,
      cnpj,
      companyName: social,
      tradingName: comercial,
      status,
    });
  }

  return results;
}

// ─── Name normalizer ──────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")     // strip diacritics
    .toUpperCase()
    .replace(/[.\-\/—]/g, " ")           // punctuation → space
    .replace(/\bS\.?\s*A\.?\b/g, "")     // remove S.A. / SA
    .replace(/\bCIA\.?\b/g, "")
    .replace(/\bCOMPANHIA\b/g, "")
    .replace(/\bLTDA\.?\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export type MatchMethod = "exact_name" | "partial_name" | null;

export interface MatchResult {
  registryEntry: CvmRegistryCompany;
  matchMethod: Exclude<MatchMethod, null>;
}

/**
 * Attempts to find a CVM registry entry for a ticker by normalizing and
 * comparing company/trading names from our static map against the registry.
 *
 * Returns null if no confident match is found or if the ticker is unknown.
 */
export async function matchTickerToCvmCompany(
  ticker: string,
): Promise<MatchResult | null> {
  const staticEntry = getCvmCompanyByTicker(ticker);
  if (!staticEntry) return null;

  const registry = await fetchCvmCompanyRegistry();

  const targets = [
    normalize(staticEntry.companyName),
    normalize(staticEntry.tradingName),
  ].filter(t => t.length >= 3);

  // Pass 1: exact match on normalized company name or trading name.
  for (const entry of registry) {
    const candidates = [
      normalize(entry.companyName),
      normalize(entry.tradingName ?? ""),
    ].filter(Boolean);

    for (const c of candidates) {
      for (const t of targets) {
        if (c === t) return { registryEntry: entry, matchMethod: "exact_name" };
      }
    }
  }

  // Pass 2: partial containment match.
  // The shorter string must be ≥ 10 chars to prevent spurious matches
  // on very short tokens like "SA" or "CIA".
  for (const entry of registry) {
    const candidates = [
      normalize(entry.companyName),
      normalize(entry.tradingName ?? ""),
    ].filter(Boolean);

    for (const c of candidates) {
      for (const t of targets) {
        const [shorter, longer] = c.length <= t.length ? [c, t] : [t, c];
        if (shorter.length >= 10 && longer.includes(shorter)) {
          return { registryEntry: entry, matchMethod: "partial_name" };
        }
      }
    }
  }

  return null;
}

/**
 * Returns a CvmCompany populated from the CVM registry (dynamic lookup),
 * or null if no confident match exists.
 */
export async function lookupCvmCompany(ticker: string): Promise<
  | { company: CvmCompany; matchMethod: Exclude<MatchMethod, null> }
  | null
> {
  const staticEntry = getCvmCompanyByTicker(ticker);
  if (!staticEntry) return null;

  const match = await matchTickerToCvmCompany(ticker);
  if (!match) return null;

  const { registryEntry, matchMethod } = match;

  return {
    company: {
      ticker,
      tradingName: staticEntry.tradingName,
      companyName: registryEntry.companyName,
      cvmCode:     registryEntry.cvmCode,
      cnpj:        registryEntry.cnpj,
      sector:      staticEntry.sector,
      hasCvmMapping: true,
    },
    matchMethod,
  };
}
