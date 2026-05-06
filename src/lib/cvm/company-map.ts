// All cvmCode and cnpj values below were verified against the CVM Cias Abertas
// Informação Cadastral registry (cad_cia_aberta.csv) on 2026-05-05.
// Source: https://dados.cvm.gov.br/dados/CIA_ABERTA/CAD/DADOS/cad_cia_aberta.csv
import type { CvmCompany } from "./types";

const CVM_COMPANY_MAP: Record<string, CvmCompany> = {
  WEGE3: {
    ticker: "WEGE3",
    tradingName: "WEG",
    companyName: "WEG S.A.",
    cvmCode: "5410",
    cnpj: "84.429.695/0001-11",
    sector: "Bens Industriais",
    hasCvmMapping: true,
  },
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
  ABEV3: {
    ticker: "ABEV3",
    tradingName: "AMBEV S/A",
    companyName: "Ambev S.A.",
    cvmCode: "23264",
    cnpj: "07.526.557/0001-00",
    sector: "Consumo Não Cíclico",
    hasCvmMapping: true,
  },
  VIVT3: {
    ticker: "VIVT3",
    tradingName: "TELEF BRASIL",
    companyName: "Telefônica Brasil S.A.",
    cvmCode: "17671",
    cnpj: "02.558.157/0001-62",
    sector: "Comunicações",
    hasCvmMapping: true,
  },
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
  VALE3: {
    ticker: "VALE3",
    tradingName: "VALE",
    companyName: "Vale S.A.",
    cvmCode: "4170",
    cnpj: "33.592.510/0001-54",
    sector: "Materiais Básicos",
    hasCvmMapping: true,
  },
  SUZB3: {
    ticker: "SUZB3",
    tradingName: "SUZANO S.A.",
    companyName: "Suzano S.A.",
    cvmCode: "13986",
    cnpj: "16.404.287/0001-55",
    sector: "Materiais Básicos",
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
  // The CVM registry (as of 2026-05-05) lists this entity under "AXIA ENERGIA S.A."
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
};

export function getCvmCompanyByTicker(ticker: string): CvmCompany | null {
  return CVM_COMPANY_MAP[ticker.toUpperCase()] ?? null;
}

export { CVM_COMPANY_MAP };
