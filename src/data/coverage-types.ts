export type CoverageStatus =
  | "valuation_available"
  | "cvm_financials"
  | "quote_only"
  | "sector_specific_model_required"
  | "unavailable";

export type AssetType =
  | "stock"    // ON, PN, or PNA/PNB ordinary/preferred share
  | "unit"     // certificate of deposit (e.g., TAEE11, BPAC11)
  | "fii"      // Fundo de Investimento Imobiliário
  | "etf"      // Exchange Traded Fund
  | "bdr"      // Brazilian Depositary Receipt
  | "unknown";

export interface CoverageBadge {
  label: string;
  bg: string;
  color: string;
}

export const COVERAGE_BADGE: Record<CoverageStatus, CoverageBadge> = {
  valuation_available:            { label: "Valuation",         bg: "#dcfce7", color: "#15803d" },
  cvm_financials:                 { label: "CVM",               bg: "#dbeafe", color: "#1d4ed8" },
  quote_only:                     { label: "Cotação",           bg: "#f1f5f9", color: "#475569" },
  sector_specific_model_required: { label: "Modelo específico", bg: "#fef3c7", color: "#b45309" },
  unavailable:                    { label: "Em breve",          bg: "#f8fafc", color: "#94a3b8" },
};

export const COVERAGE_DESCRIPTION: Record<CoverageStatus, string> = {
  valuation_available:
    "Dados completos disponíveis. Dashboard com DCF, sensibilidade e múltiplos.",
  cvm_financials:
    "Dados CVM disponíveis. Valuation ainda em validação para este ativo.",
  quote_only:
    "Cotação disponível. Dados financeiros e valuation ainda não disponíveis para este ativo.",
  sector_specific_model_required:
    "Este ativo requer uma metodologia específica. O modelo DCF padrão não se aplica a este tipo de ativo.",
  unavailable:
    "Dados completos ainda não disponíveis para este ativo no MVP.",
};
