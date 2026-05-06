// ─── CVM company identity ─────────────────────────────────────────────────────

export interface CvmCompany {
  ticker: string;
  tradingName: string;
  companyName: string;
  /** CVM registration code (Código CVM). Undefined until verified against CVM Dados Abertos. */
  cvmCode?: string;
  /** CNPJ of the listed entity. Undefined until verified. */
  cnpj?: string;
  sector?: string;
  /** True only when cvmCode is confirmed and CVM data can be fetched. */
  hasCvmMapping: boolean;
}

// ─── CVM open-data company registry row ──────────────────────────────────────

/**
 * One entry from the CVM Cias Abertas Informação Cadastral registry.
 * Source: https://dados.cvm.gov.br/dados/CIA_ABERTA/CAD/DADOS/cad_cia_aberta.csv
 */
export interface CvmRegistryCompany {
  cvmCode: string;
  cnpj: string;
  companyName: string;
  tradingName?: string;
  /** "ATIVO" | "CANCELADA" | … as published by CVM */
  status?: string;
  /** Full row as key→value map for debugging */
  raw?: Record<string, string>;
}

// ─── Raw CVM statement row ────────────────────────────────────────────────────

/**
 * Represents one row from a CVM DFP/ITR CSV file (dados.cvm.gov.br).
 * Column names follow the CVM Dados Abertos schema for DFP_cia_aberta.
 */
export interface RawCvmStatementRow {
  cvmCode: string;
  companyName: string;
  /** e.g. "BPA", "BPP", "DRE", "DFC_MI", "DFC_MD", "DVA" */
  statementType: string;
  /** Hierarchical account code, e.g. "3.01", "3.05", "6.01" */
  accountCode: string;
  /** Human-readable account name in Portuguese */
  accountName: string;
  /** ISO date string of the period end, e.g. "2024-12-31" */
  periodEndDate: string;
  fiscalYear: number;
  /** Value in the reporting currency (BRL), as published by CVM */
  value: number;
}

// ─── Normalized financials ────────────────────────────────────────────────────

/**
 * Normalized annual financial data extracted from CVM statements.
 * All monetary values are in BRL billions unless noted otherwise.
 */
export interface NormalizedFinancials {
  ticker: string;
  fiscalYear: number;
  /** Receita de Venda de Bens e/ou Serviços (DRE 3.01) */
  revenue?: number;
  /** Resultado Antes do Resultado Financeiro e dos Tributos (DRE 3.05) */
  ebit?: number;
  /** Lucro/Prejuízo Consolidado do Período (DRE 3.11) */
  netIncome?: number;
  /** Caixa Líquido Atividades Operacionais (DFC 6.01) */
  operatingCashFlow?: number;
  /** Aquisição de Imobilizado/Intangível (DFC investing section) */
  capex?: number;
  /** operatingCashFlow - capex */
  freeCashFlow?: number;
  /** Caixa e Equivalentes de Caixa (BP Ativo 1.01.01) */
  cash?: number;
  /** Empréstimos e Financiamentos, curto e longo prazo */
  totalDebt?: number;
  /** totalDebt - cash */
  netDebt?: number;
}
