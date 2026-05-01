
// ── Valuation Copilot · WEGE3 Dados de Exemplo ───────────────────────────

const COMPANY = {
  name: "WEG S.A.",
  ticker: "WEGE3",
  exchange: "B3",
  sector: "Bens de Capital",
  price: 38.54,
  priceChange: +0.42,
  priceChangePct: +1.10,
  marketCap: "R$ 145,3B",
  enterpriseValue: "R$ 148,1B",
  currency: "BRL",
  valuationStatus: "Descontado",
  upside: 11.2,
};

const METRICS = [
  { label: "Receita",                value: "R$ 34,2B",  trend: +12.1, suffix: "TTM" },
  { label: "Margem EBITDA",          value: "22,8%",     trend: +0.4,  suffix: "TTM" },
  { label: "Fluxo de Caixa Livre",   value: "R$ 5,1B",   trend: +15.9, suffix: "TTM" },
  { label: "Dividend Yield",         value: "2,1%",      trend: +0.2,  suffix: "proventos" },
  { label: "P/L",                    value: "32,4x",     trend: -1.8,  suffix: "NTM" },
  { label: "ROE",                    value: "27,4%",     trend: +1.1,  suffix: "ÚLT. 12M" },
];

const FINANCIALS = [
  { year: "2020", receita: 16.7, ebitda: 3.2, fcl: 2.8 },
  { year: "2021", receita: 22.4, ebitda: 4.6, fcl: 3.4 },
  { year: "2022", receita: 27.9, ebitda: 5.8, fcl: 3.9 },
  { year: "2023", receita: 30.8, ebitda: 6.9, fcl: 4.4 },
  { year: "2024", receita: 34.2, ebitda: 7.8, fcl: 5.1 },
];

const DCF = {
  intrinsicValue: 42.80,
  currentPrice:   38.54,
  impliedUpside:  11.2,
  enterpriseValue: "R$ 161,7B",
  equityValue:     "R$ 162,4B",
  bearCase: 31,
  baseCase: 43,
  bullCase: 56,
};

// Sensibilidade: WACC mais alto para Brasil (prêmio de risco)
const WACC_VALS = [11.0, 11.5, 12.0, 12.5, 13.0];
const TG_VALS   = [3.0, 3.5, 4.0, 4.5];
const SENSITIVITY = [
  [52, 57, 62, 69],
  [46, 50, 55, 60],
  [41, 44, 48, 53],
  [37, 40, 43, 47],
  [33, 36, 39, 42],
];

const DEFAULT_ASSUMPTIONS = {
  revenueCAGR:    10.0,
  ebitMargin:     19.5,
  taxRate:        25.0,
  wacc:           12.0,
  terminalGrowth:  4.0,
  capexRevenue:    3.8,
  nwcChange:       1.2,
};

const MULTIPLES = [
  { company: "WEG S.A.",          ticker: "WEGE3",  pe: "32,4x", evEbitda: "28,1x", evSales: "4,3x", highlight: true  },
  { company: "Embraer",           ticker: "EMBR3",  pe: "18,7x", evEbitda: "11,4x", evSales: "1,8x", highlight: false },
  { company: "Tupy",              ticker: "TUPY3",  pe: "10,2x", evEbitda: "6,3x",  evSales: "0,9x", highlight: false },
  { company: "Iochpe-Maxion",     ticker: "MYPK3",  pe: "8,4x",  evEbitda: "5,1x",  evSales: "0,6x", highlight: false },
  { company: "Frasle Mobility",   ticker: "FRAS3",  pe: "14,6x", evEbitda: "9,8x",  evSales: "1,4x", highlight: false },
];

const NEWS = [
  {
    source: "WEG RI",
    date: "28 abr. 2026",
    title: "WEG divulga Resultados do 1T26: Lucro Líquido de R$ 1,42B, crescimento de 19% a/a",
    category: "Resultado",
  },
  {
    source: "CVM / B3",
    date: "22 abr. 2026",
    title: "Fato Relevante: WEG conclui aquisição de fabricante alemã de inversores de frequência por €310M",
    category: "Fato Relevante",
  },
  {
    source: "WEG RI",
    date: "15 abr. 2026",
    title: "Comunicado ao Mercado: Aprovação de JCP e dividendos — R$ 0,18 por ação, pagamento em 20/05",
    category: "Proventos",
  },
  {
    source: "Broadcast",
    date: "09 abr. 2026",
    title: "Copom mantém Selic em 13,25%; analistas revisam múltiplos do setor industrial brasileiro",
    category: "Macro",
  },
];

Object.assign(window, {
  COMPANY, METRICS, FINANCIALS, DCF,
  WACC_VALS, TG_VALS, SENSITIVITY,
  DEFAULT_ASSUMPTIONS, MULTIPLES, NEWS,
});
