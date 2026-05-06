// TODO: Next step — download annual DFP CSV files from CVM Dados Abertos:
//   https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/
// Files follow the pattern: dfp_cia_aberta_DRE_con_YYYY.csv
// Each file contains all companies for a given year and statement type.
// Parse with a streaming CSV parser and filter by CD_CVM (cvmCode).

import type { CvmCompany } from "./types";
import type { NormalizedFinancials } from "./types";
import { getCvmCompanyByTicker } from "./company-map";

/**
 * Returns the CVM registration entry for a ticker, or null if not in the map.
 * Does not perform any network request — uses the static manual map.
 */
export function getCvmCompany(ticker: string): CvmCompany | null {
  return getCvmCompanyByTicker(ticker);
}

/**
 * Returns normalized annual financials for a ticker.
 *
 * TODO: Replace this stub with real CVM DFP parsing:
 *   1. Resolve cvmCode via getCvmCompanyByTicker().
 *   2. If hasCvmMapping is false, return null immediately.
 *   3. Download (or read from cache) the relevant DFP CSV files for the
 *      requested fiscal years from dados.cvm.gov.br.
 *   4. Filter rows by CD_CVM === cvmCode.
 *   5. Pass filtered rows to normalizeCvmRows() from ./normalizer.
 *   6. Return the array of NormalizedFinancials.
 *
 * The function returns null instead of throwing so callers can fall back
 * gracefully to mock data when CVM data is unavailable.
 */
export async function getAnnualFinancialsFromCvm(
  ticker: string,
  _fiscalYears?: number[],
): Promise<NormalizedFinancials[] | null> {
  const company = getCvmCompanyByTicker(ticker);

  if (!company || !company.hasCvmMapping) {
    // No confirmed CVM code — cannot fetch real data yet.
    return null;
  }

  // TODO: implement actual CSV download + parse when hasCvmMapping is true.
  return null;
}
