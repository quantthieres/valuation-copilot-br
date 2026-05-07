import { describe, it, expect } from "vitest";
import { normalizeCvmRows } from "./normalizer";
import type { RawCvmStatementRow } from "./types";

// ─── Fixture helpers ──────────────────────────────────────────────────────────

const BILLION = 1_000_000_000;

/** Build a single RawCvmStatementRow. valueBillions is in R$ billions; the
 *  helper multiplies to actual BRL before passing to normalizeCvmRows, matching
 *  the contract that dfp-parser.ts provides pre-scaled rows. */
function row(
  accountCode:   string,
  accountName:   string,
  statementType: string,
  valueBillions: number,
): RawCvmStatementRow {
  return {
    cvmCode:       "5410",
    companyName:   "TEST SA",
    statementType,
    accountCode,
    accountName,
    periodEndDate: "2023-12-31",
    fiscalYear:    2023,
    value:         valueBillions * BILLION,
  };
}

const TICKER      = "TEST3";
const FISCAL_YEAR = 2023;

// ─── Basic field mapping ──────────────────────────────────────────────────────

describe("normalizeCvmRows — basic field mapping", () => {
  it("preserves ticker in result", () => {
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, []);
    expect(result.ticker).toBe(TICKER);
  });

  it("preserves fiscalYear in result", () => {
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, []);
    expect(result.fiscalYear).toBe(FISCAL_YEAR);
  });

  it("maps 3.01 DRE to revenue in billions", () => {
    const rows = [row("3.01", "Receita de Venda de Bens e/ou Serviços", "DRE", 30)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.revenue).toBeCloseTo(30, 5);
  });

  it("maps 3.05 DRE to ebit in billions", () => {
    const rows = [row("3.05", "Resultado Antes do Resultado Financeiro e dos Tributos", "DRE", 6)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.ebit).toBeCloseTo(6, 5);
  });

  it("maps 3.11 DRE to netIncome in billions", () => {
    const rows = [row("3.11", "Lucro/Prejuízo Consolidado do Período", "DRE", 4.5)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.netIncome).toBeCloseTo(4.5, 5);
  });

  it("maps 6.01 DFC_MI to operatingCashFlow in billions", () => {
    const rows = [row("6.01", "Caixa Líquido Atividades Operacionais", "DFC_MI", 7)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.operatingCashFlow).toBeCloseTo(7, 5);
  });

  it("falls back to DFC_MD for operatingCashFlow when DFC_MI absent", () => {
    const rows = [row("6.01", "Caixa Líquido Atividades Operacionais", "DFC_MD", 5)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.operatingCashFlow).toBeCloseTo(5, 5);
  });

  it("prefers DFC_MI over DFC_MD for operatingCashFlow", () => {
    const rows = [
      row("6.01", "Caixa Líquido Atividades Operacionais", "DFC_MI", 7),
      row("6.01", "Caixa Líquido Atividades Operacionais", "DFC_MD", 5),
    ];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.operatingCashFlow).toBeCloseTo(7, 5);
  });

  it("maps 1.01.01 BPA to cash in billions", () => {
    const rows = [row("1.01.01", "Caixa e Equivalentes de Caixa", "BPA", 8)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.cash).toBeCloseTo(8, 5);
  });
});

// ─── Debt aggregation ─────────────────────────────────────────────────────────

describe("normalizeCvmRows — debt aggregation", () => {
  it("sums 2.01.04 and 2.02.01 BPP into totalDebt", () => {
    const rows = [
      row("2.01.04", "Empréstimos e Financiamentos CP", "BPP", 1),
      row("2.02.01", "Empréstimos e Financiamentos LP", "BPP", 3),
    ];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.totalDebt).toBeCloseTo(4, 5);
  });

  it("uses only short-term debt when long-term is absent", () => {
    const rows = [row("2.01.04", "Empréstimos CP", "BPP", 1)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.totalDebt).toBeCloseTo(1, 5);
  });

  it("uses only long-term debt when short-term is absent", () => {
    const rows = [row("2.02.01", "Empréstimos LP", "BPP", 3)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.totalDebt).toBeCloseTo(3, 5);
  });
});

// ─── Derived fields ───────────────────────────────────────────────────────────

describe("normalizeCvmRows — derived fields", () => {
  it("computes freeCashFlow = operatingCashFlow - capex", () => {
    const rows = [
      row("6.01",   "Caixa Líquido Atividades Operacionais", "DFC_MI",  7),
      row("6.02.01", "Aquisição de Imobilizado",              "DFC_MI", -2),
    ];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.capex).toBeCloseTo(2, 5);              // stored as positive
    expect(result.freeCashFlow).toBeCloseTo(5, 5);       // 7 - 2
  });

  it("computes netDebt = totalDebt - cash (positive when leveraged)", () => {
    const rows = [
      row("2.01.04", "Empréstimos CP", "BPP", 1),
      row("2.02.01", "Empréstimos LP", "BPP", 3),
      row("1.01.01", "Caixa",          "BPA", 2),
    ];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.netDebt).toBeCloseTo(2, 5);  // 4 - 2 = 2
  });

  it("computes netDebt as negative when net cash (cash > debt)", () => {
    const rows = [
      row("2.01.04", "Empréstimos CP", "BPP", 1),
      row("2.02.01", "Empréstimos LP", "BPP", 3),
      row("1.01.01", "Caixa",          "BPA", 8),
    ];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.netDebt).toBeCloseTo(-4, 5);  // 4 - 8 = -4
  });

  it("returns undefined freeCashFlow when capex row is absent", () => {
    const rows = [row("6.01", "Caixa Líquido", "DFC_MI", 7)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.freeCashFlow).toBeUndefined();
  });

  it("returns undefined freeCashFlow when operatingCashFlow is absent", () => {
    const rows = [row("6.02.01", "Aquisição de Imobilizado", "DFC_MI", -2)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.freeCashFlow).toBeUndefined();
  });

  it("returns undefined netDebt when cash is absent", () => {
    const rows = [row("2.02.01", "Empréstimos LP", "BPP", 3)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.netDebt).toBeUndefined();
  });

  it("returns undefined netDebt when totalDebt is absent", () => {
    const rows = [row("1.01.01", "Caixa", "BPA", 8)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.netDebt).toBeUndefined();
  });
});

// ─── Capex extraction ─────────────────────────────────────────────────────────

describe("normalizeCvmRows — capex extraction", () => {
  it("identifies capex by 'imobilizado' keyword in 6.02 DFC_MI", () => {
    const rows = [row("6.02.01", "Aquisição de Ativo Imobilizado", "DFC_MI", -1.5)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.capex).toBeCloseTo(1.5, 5);
  });

  it("identifies capex by 'intangível' keyword in 6.02 DFC_MI", () => {
    const rows = [row("6.02.02", "Aquisição de Ativo Intangível", "DFC_MI", -0.5)];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.capex).toBeCloseTo(0.5, 5);
  });

  it("excludes rows containing 'empresa' keyword (M&A)", () => {
    const rows = [
      row("6.01",   "Caixa Líquido",            "DFC_MI",  7),
      row("6.02.01", "Aquisição de empresa",     "DFC_MI", -5),  // excluded
      row("6.02.02", "Aquisição de Imobilizado", "DFC_MI", -2),  // included
    ];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.capex).toBeCloseTo(2, 5);
    expect(result.freeCashFlow).toBeCloseTo(5, 5);
  });

  it("excludes rows containing 'alienação' keyword (asset disposal proceeds)", () => {
    const rows = [
      row("6.01",   "Caixa Líquido",                     "DFC_MI", 7),
      row("6.02.01", "Alienação de Ativo Imobilizado",    "DFC_MI", 1),   // proceeds, excluded
      row("6.02.02", "Aquisição de Imobilizado",          "DFC_MI", -2),  // included
    ];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.capex).toBeCloseTo(2, 5);
  });

  it("falls back to DFC_MD for capex when DFC_MI has no capex rows", () => {
    const rows = [
      row("6.01",   "Caixa Líquido",            "DFC_MI",  7),
      row("6.02.01", "Aquisição de Imobilizado", "DFC_MD", -2),
    ];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.capex).toBeCloseTo(2, 5);
  });

  it("sums multiple capex rows", () => {
    const rows = [
      row("6.01",   "Caixa Líquido",            "DFC_MI",  7),
      row("6.02.01", "Aquisição de Imobilizado", "DFC_MI", -1.5),
      row("6.02.02", "Aquisição de Intangível",  "DFC_MI", -0.5),
    ];
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, rows);
    expect(result.capex).toBeCloseTo(2, 5);
    expect(result.freeCashFlow).toBeCloseTo(5, 5);
  });
});

// ─── Empty input ──────────────────────────────────────────────────────────────

describe("normalizeCvmRows — empty rows", () => {
  it("returns undefined for all monetary fields when rows is empty", () => {
    const result = normalizeCvmRows(TICKER, FISCAL_YEAR, []);
    expect(result.revenue).toBeUndefined();
    expect(result.ebit).toBeUndefined();
    expect(result.netIncome).toBeUndefined();
    expect(result.operatingCashFlow).toBeUndefined();
    expect(result.cash).toBeUndefined();
    expect(result.capex).toBeUndefined();
    expect(result.freeCashFlow).toBeUndefined();
    expect(result.totalDebt).toBeUndefined();
    expect(result.netDebt).toBeUndefined();
  });
});
