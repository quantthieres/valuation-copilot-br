// All cvmCode and cnpj values below were verified against the CVM Cias Abertas
// Informação Cadastral registry (cad_cia_aberta.csv) on 2026-05-07.
// Source: https://dados.cvm.gov.br/dados/CIA_ABERTA/CAD/DADOS/cad_cia_aberta.csv
import type { CvmCompany } from "./types";

const CVM_COMPANY_MAP: Record<string, CvmCompany> = {

  // ── Petróleo, Gás e Biocombustíveis ──────────────────────────────────────────
  PETR4: {
    ticker: "PETR4",
    tradingName: "PETROBRAS",
    companyName: "Petróleo Brasileiro S.A. — Petrobras",
    cvmCode: "9512",
    cnpj: "33.000.167/0001-01",
    sector: "Petróleo, Gás e Biocombustíveis",
    hasCvmMapping: true,
  },
  PETR3: {
    ticker: "PETR3",
    tradingName: "PETROBRAS",
    companyName: "Petróleo Brasileiro S.A. — Petrobras",
    cvmCode: "9512",
    cnpj: "33.000.167/0001-01",
    sector: "Petróleo, Gás e Biocombustíveis",
    hasCvmMapping: true,
  },
  PRIO3: {
    ticker: "PRIO3",
    tradingName: "PRIO",
    companyName: "PRIO S.A.",
    cvmCode: "22187",
    cnpj: "10.629.105/0001-68",
    sector: "Petróleo, Gás e Biocombustíveis",
    hasCvmMapping: true,
  },
  VBBR3: {
    ticker: "VBBR3",
    tradingName: "VIBRA",
    companyName: "Vibra Energia S.A.",
    cvmCode: "24295",
    cnpj: "34.274.233/0001-02",
    sector: "Petróleo, Gás e Biocombustíveis",
    hasCvmMapping: true,
  },
  RAIZ4: {
    ticker: "RAIZ4",
    tradingName: "RAÍZEN",
    // Legal name in CVM registry: RAÍZEN S.A.
    companyName: "Raízen S.A.",
    cvmCode: "25917",
    cnpj: "33.453.598/0001-23",
    sector: "Petróleo, Gás e Biocombustíveis",
    hasCvmMapping: true,
  },

  // ── Mineração e Siderurgia ────────────────────────────────────────────────────
  VALE3: {
    ticker: "VALE3",
    tradingName: "VALE",
    companyName: "Vale S.A.",
    cvmCode: "4170",
    cnpj: "33.592.510/0001-54",
    sector: "Materiais Básicos",
    hasCvmMapping: true,
  },
  GGBR4: {
    ticker: "GGBR4",
    tradingName: "GERDAU PN",
    companyName: "Gerdau S.A.",
    cvmCode: "3980",
    cnpj: "33.611.500/0001-19",
    sector: "Siderurgia",
    hasCvmMapping: true,
  },
  GGBR3: {
    ticker: "GGBR3",
    tradingName: "GERDAU ON",
    companyName: "Gerdau S.A.",
    cvmCode: "3980",
    cnpj: "33.611.500/0001-19",
    sector: "Siderurgia",
    hasCvmMapping: true,
  },
  CSNA3: {
    ticker: "CSNA3",
    tradingName: "CSN",
    // Registry: CIA SIDERURGICA NACIONAL
    companyName: "Companhia Siderúrgica Nacional",
    cvmCode: "4030",
    cnpj: "33.042.730/0001-04",
    sector: "Siderurgia",
    hasCvmMapping: true,
  },

  // ── Papel e Celulose ──────────────────────────────────────────────────────────
  SUZB3: {
    ticker: "SUZB3",
    tradingName: "SUZANO S.A.",
    companyName: "Suzano S.A.",
    cvmCode: "13986",
    cnpj: "16.404.287/0001-55",
    sector: "Materiais Básicos",
    hasCvmMapping: true,
  },
  KLBN11: {
    ticker: "KLBN11",
    tradingName: "KLABIN",
    companyName: "Klabin S.A.",
    cvmCode: "12653",
    cnpj: "89.637.490/0001-45",
    sector: "Papel e Celulose",
    hasCvmMapping: true,
  },

  // ── Bens de Capital ───────────────────────────────────────────────────────────
  WEGE3: {
    ticker: "WEGE3",
    tradingName: "WEG",
    companyName: "WEG S.A.",
    cvmCode: "5410",
    cnpj: "84.429.695/0001-11",
    sector: "Bens Industriais",
    hasCvmMapping: true,
  },
  EMBR3: {
    ticker: "EMBR3",
    tradingName: "EMBRAER",
    companyName: "Embraer S.A.",
    cvmCode: "20087",
    cnpj: "07.689.002/0001-89",
    sector: "Bens de Capital",
    hasCvmMapping: true,
  },
  TUPY3: {
    ticker: "TUPY3",
    tradingName: "TUPY",
    // Registry: TUPY SA
    companyName: "Tupy S.A.",
    cvmCode: "6343",
    cnpj: "84.683.374/0001-49",
    sector: "Bens de Capital",
    hasCvmMapping: true,
  },
  FRAS3: {
    ticker: "FRAS3",
    tradingName: "FRASLE",
    // Registry: FRASLE MOBILITY S.A.
    companyName: "Frasle Mobility S.A.",
    cvmCode: "6211",
    cnpj: "88.610.126/0001-29",
    sector: "Bens de Capital",
    hasCvmMapping: true,
  },

  // ── Energia Elétrica ──────────────────────────────────────────────────────────
  EGIE3: {
    ticker: "EGIE3",
    tradingName: "ENGIE BRASIL",
    companyName: "Engie Brasil Energia S.A.",
    cvmCode: "17329",
    cnpj: "02.474.103/0001-19",
    sector: "Utilidade Pública",
    hasCvmMapping: true,
  },
  CPFE3: {
    ticker: "CPFE3",
    tradingName: "CPFL ENERGIA",
    companyName: "CPFL Energia S.A.",
    cvmCode: "18660",
    cnpj: "02.429.144/0001-93",
    sector: "Utilidade Pública",
    hasCvmMapping: true,
  },
  // The CVM registry (as of 2026-05-07) lists this entity under "AXIA ENERGIA S.A."
  // (the legal name adopted after Eletrobras's privatization in 2022).
  // The CNPJ 00.001.180/0001-26 and CVM code 2437 are verified against the registry.
  // The B3 ticker ELET3 continues to trade under the Eletrobras brand.
  ELET3: {
    ticker: "ELET3",
    tradingName: "ELETROBRAS",
    companyName: "Centrais Elétricas Brasileiras S.A. — Eletrobras",
    cvmCode: "2437",
    cnpj: "00.001.180/0001-26",
    sector: "Utilidade Pública",
    hasCvmMapping: true,
  },
  EQTL3: {
    ticker: "EQTL3",
    tradingName: "EQUATORIAL",
    companyName: "Equatorial Energia S.A.",
    cvmCode: "20010",
    cnpj: "03.220.438/0001-73",
    sector: "Utilidade Pública",
    hasCvmMapping: true,
  },
  ENEV3: {
    ticker: "ENEV3",
    tradingName: "ENEVA",
    // Registry: ENEVA S.A. (formerly MPX Energia S.A.)
    companyName: "Eneva S.A.",
    cvmCode: "21237",
    cnpj: "04.423.567/0001-21",
    sector: "Energia Elétrica",
    hasCvmMapping: true,
  },
  CMIG4: {
    ticker: "CMIG4",
    tradingName: "CEMIG PN",
    // Registry: CIA ENERG MINAS GERAIS - CEMIG
    companyName: "Companhia Energética de Minas Gerais — Cemig",
    cvmCode: "2453",
    cnpj: "17.155.730/0001-64",
    sector: "Energia Elétrica",
    hasCvmMapping: true,
  },
  CMIG3: {
    ticker: "CMIG3",
    tradingName: "CEMIG ON",
    companyName: "Companhia Energética de Minas Gerais — Cemig",
    cvmCode: "2453",
    cnpj: "17.155.730/0001-64",
    sector: "Energia Elétrica",
    hasCvmMapping: true,
  },
  CPLE6: {
    ticker: "CPLE6",
    tradingName: "COPEL PNB",
    // Registry: COMPANHIA PARANAENSE DE ENERGIA COPEL
    companyName: "Companhia Paranaense de Energia — Copel",
    cvmCode: "14311",
    cnpj: "76.483.817/0001-20",
    sector: "Energia Elétrica",
    hasCvmMapping: true,
  },
  CPLE3: {
    ticker: "CPLE3",
    tradingName: "COPEL ON",
    companyName: "Companhia Paranaense de Energia — Copel",
    cvmCode: "14311",
    cnpj: "76.483.817/0001-20",
    sector: "Energia Elétrica",
    hasCvmMapping: true,
  },
  ALUP11: {
    ticker: "ALUP11",
    tradingName: "ALUPAR",
    // Registry: ALUPAR INVESTIMENTO S/A
    companyName: "Alupar Investimento S.A.",
    cvmCode: "21490",
    cnpj: "08.364.948/0001-38",
    sector: "Energia Elétrica",
    hasCvmMapping: true,
  },

  // ── Saneamento ────────────────────────────────────────────────────────────────
  SBSP3: {
    ticker: "SBSP3",
    tradingName: "SABESP",
    // Registry: CIA SANEAMENTO BÁSICO ESTADO SÃO PAULO
    companyName: "Companhia de Saneamento Básico do Estado de São Paulo — Sabesp",
    cvmCode: "14443",
    cnpj: "43.776.517/0001-80",
    sector: "Saneamento",
    hasCvmMapping: true,
  },

  // ── Telecomunicações ──────────────────────────────────────────────────────────
  VIVT3: {
    ticker: "VIVT3",
    tradingName: "TELEF BRASIL",
    companyName: "Telefônica Brasil S.A.",
    cvmCode: "17671",
    cnpj: "02.558.157/0001-62",
    sector: "Comunicações",
    hasCvmMapping: true,
  },
  TIMS3: {
    ticker: "TIMS3",
    tradingName: "TIM",
    // Registry: TIM S.A. (formerly TIM Participações S.A.)
    companyName: "TIM S.A.",
    cvmCode: "24929",
    cnpj: "02.421.421/0001-11",
    sector: "Telecomunicações",
    hasCvmMapping: true,
  },

  // ── Bebidas ───────────────────────────────────────────────────────────────────
  ABEV3: {
    ticker: "ABEV3",
    tradingName: "AMBEV S/A",
    companyName: "Ambev S.A.",
    cvmCode: "23264",
    cnpj: "07.526.557/0001-00",
    sector: "Consumo Não Cíclico",
    hasCvmMapping: true,
  },

  // ── Transporte e Logística ────────────────────────────────────────────────────
  RAIL3: {
    ticker: "RAIL3",
    tradingName: "RUMO",
    // Registry: RUMO S.A. (previously ALL - América Latina Logística S.A.)
    companyName: "Rumo S.A.",
    cvmCode: "17450",
    cnpj: "02.387.241/0001-60",
    sector: "Transporte",
    hasCvmMapping: true,
  },
  RENT3: {
    ticker: "RENT3",
    tradingName: "LOCALIZA",
    // Registry: LOCALIZA RENT A CAR SA
    companyName: "Localiza Rent a Car S.A.",
    cvmCode: "19739",
    cnpj: "16.670.085/0001-55",
    sector: "Transporte",
    hasCvmMapping: true,
  },

  // ── Varejo ────────────────────────────────────────────────────────────────────
  LREN3: {
    ticker: "LREN3",
    tradingName: "RENNER",
    // Registry: LOJAS RENNER SA
    companyName: "Lojas Renner S.A.",
    cvmCode: "8133",
    cnpj: "92.754.738/0001-62",
    sector: "Varejo",
    hasCvmMapping: true,
  },
  ASAI3: {
    ticker: "ASAI3",
    tradingName: "ASSAÍ ATACADISTA",
    // CVM legal entity: SENDAS DISTRIBUIDORA S.A. — operates the Assaí Atacadista brand
    // Spun off from GPA (PCAR3) in 2021 and listed separately as ASAI3.
    companyName: "Sendas Distribuidora S.A.",
    cvmCode: "25372",
    cnpj: "06.057.223/0001-71",
    sector: "Varejo",
    hasCvmMapping: true,
  },

  // ── Saúde ─────────────────────────────────────────────────────────────────────
  RADL3: {
    ticker: "RADL3",
    tradingName: "RD SAÚDE",
    // Registry: RAIA DROGASIL S.A. (merged entity of Droga Raia + Drogasil, 2011)
    companyName: "Raia Drogasil S.A.",
    cvmCode: "5258",
    cnpj: "61.585.865/0001-51",
    sector: "Saúde",
    hasCvmMapping: true,
  },
  HYPE3: {
    ticker: "HYPE3",
    tradingName: "HYPERA PHARMA",
    // Registry: HYPERA S/A (formerly Hypermarcas S.A.)
    companyName: "Hypera S.A.",
    cvmCode: "21431",
    cnpj: "02.932.074/0001-91",
    sector: "Saúde",
    hasCvmMapping: true,
  },
};

export function getCvmCompanyByTicker(ticker: string): CvmCompany | null {
  return CVM_COMPANY_MAP[ticker.toUpperCase()] ?? null;
}

export { CVM_COMPANY_MAP };
