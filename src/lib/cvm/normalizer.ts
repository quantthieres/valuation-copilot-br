// CVM DFP account code reference (consolidated statements):
//
//   DRE   3.01  Receita de Venda de Bens e/ou Serviços
//         3.05  Resultado Antes do Resultado Financeiro e dos Tributos (EBIT)
//         3.11  Lucro/Prejuízo Consolidado do Período
//
//   DFC_MI / DFC_MD
//         6.01         Caixa Líquido Atividades Operacionais
//         6.02.xx      Individual investing items (capex identified by name)
//
//   BPA   1.01.01      Caixa e Equivalentes de Caixa
//
//   BPP   2.01.04      Empréstimos e Financiamentos (curto prazo)
//         2.02.01      Empréstimos e Financiamentos (longo prazo)
//
// Values fed into this module must already be in actual BRL (not thousands).
// The dfp-parser.ts converts MIL-scale values before passing them here.
// Divide by 1_000_000_000 to arrive at BRL billions.

import type { RawCvmStatementRow, NormalizedFinancials } from "./types";

const BILLION = 1_000_000_000;

function sumByCode(
  rows: RawCvmStatementRow[],
  code: string,
  statement: string,
): number | undefined {
  const matches = rows.filter(
    r => r.accountCode === code && r.statementType === statement,
  );
  if (matches.length === 0) return undefined;
  return matches.reduce((acc, r) => acc + r.value, 0) / BILLION;
}

// Keywords that identify capex rows in the DFC investing section.
const CAPEX_INCLUDE = [
  "imobilizado",
  "intangível",
  "intangivel",
  "ativo fixo",
  "ativo imobilizado",
  "ativo intangível",
];

// Rows whose names contain any of these phrases are NOT capex even if
// they also match a CAPEX_INCLUDE term (e.g. "Aquisição de empresa").
const CAPEX_EXCLUDE = [
  "empresa",
  "combinação",
  "participação",
  "alienação",
  "venda de ativo",
  "recebimento",
];

function extractCapex(rows: RawCvmStatementRow[]): number | undefined {
  for (const stmt of ["DFC_MI", "DFC_MD"]) {
    const candidates = rows.filter(r => {
      if (r.statementType !== stmt) return false;
      if (!r.accountCode.startsWith("6.02")) return false;
      const name = r.accountName.toLowerCase();
      return (
        CAPEX_INCLUDE.some(kw => name.includes(kw)) &&
        !CAPEX_EXCLUDE.some(kw => name.includes(kw))
      );
    });

    if (candidates.length > 0) {
      // Investing outflows are negative in CVM; return as a positive number.
      const total = candidates.reduce((acc, r) => acc + r.value, 0);
      return Math.abs(total) / BILLION;
    }
  }
  return undefined;
}

/**
 * Converts an array of raw CVM statement rows (all from the same ticker and
 * fiscal year) into a NormalizedFinancials record.
 *
 * Row values must already be in actual BRL (dfp-parser handles the MIL scale
 * conversion before rows reach this function).
 */
export function normalizeCvmRows(
  ticker: string,
  fiscalYear: number,
  rows: RawCvmStatementRow[],
): NormalizedFinancials {
  const revenue           = sumByCode(rows, "3.01", "DRE");
  const ebit              = sumByCode(rows, "3.05", "DRE");
  const netIncome         = sumByCode(rows, "3.11", "DRE");
  const operatingCashFlow = sumByCode(rows, "6.01", "DFC_MI")
                         ?? sumByCode(rows, "6.01", "DFC_MD");
  const cash              = sumByCode(rows, "1.01.01", "BPA");

  // Debt: short-term + long-term loans and financing (standard CVM positions).
  const debtShort = sumByCode(rows, "2.01.04", "BPP");
  const debtLong  = sumByCode(rows, "2.02.01", "BPP");
  const totalDebt =
    debtShort !== undefined || debtLong !== undefined
      ? (debtShort ?? 0) + (debtLong ?? 0)
      : undefined;

  const capex        = extractCapex(rows);
  const freeCashFlow =
    operatingCashFlow !== undefined && capex !== undefined
      ? operatingCashFlow - capex
      : undefined;
  const netDebt =
    totalDebt !== undefined && cash !== undefined
      ? totalDebt - cash
      : undefined;

  return {
    ticker,
    fiscalYear,
    revenue,
    ebit,
    netIncome,
    operatingCashFlow,
    capex,
    freeCashFlow,
    cash,
    totalDebt,
    netDebt,
  };
}
