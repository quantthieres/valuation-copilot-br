export interface B3Company {
  ticker: string;
  companyName: string;
  tradingName: string;
  sector: string;
  subsector: string;
  hasMockData: boolean;
}

export const B3_UNIVERSE: B3Company[] = [
  // Bens de Capital
  { ticker: "WEGE3",  companyName: "WEG S.A.",                                             tradingName: "WEG",           sector: "Bens de Capital",       subsector: "Motores e Geradores",         hasMockData: true  },
  { ticker: "EMBR3",  companyName: "Embraer S.A.",                                          tradingName: "Embraer",        sector: "Bens de Capital",       subsector: "Aeronáutico",                 hasMockData: false },
  { ticker: "TUPY3",  companyName: "Tupy S.A.",                                             tradingName: "Tupy",           sector: "Bens de Capital",       subsector: "Autopeças",                   hasMockData: false },
  { ticker: "FRAS3",  companyName: "Frasle Mobility S.A.",                                  tradingName: "Frasle",         sector: "Bens de Capital",       subsector: "Autopeças",                   hasMockData: false },
  { ticker: "MYPK3",  companyName: "Iochpe-Maxion S.A.",                                   tradingName: "Iochpe-Maxion",  sector: "Bens de Capital",       subsector: "Autopeças",                   hasMockData: false },

  // Petróleo, Gás e Biocombustíveis
  { ticker: "PETR4",  companyName: "Petróleo Brasileiro S.A.",                              tradingName: "Petrobras PN",   sector: "Petróleo e Gás",        subsector: "Exploração e Refino",         hasMockData: false },
  { ticker: "PETR3",  companyName: "Petróleo Brasileiro S.A.",                              tradingName: "Petrobras ON",   sector: "Petróleo e Gás",        subsector: "Exploração e Refino",         hasMockData: false },
  { ticker: "PRIO3",  companyName: "PRIO S.A.",                                             tradingName: "PRIO",           sector: "Petróleo e Gás",        subsector: "Exploração e Produção",       hasMockData: false },
  { ticker: "VBBR3",  companyName: "Vibra Energia S.A.",                                   tradingName: "Vibra",          sector: "Petróleo e Gás",        subsector: "Distribuição de Combustíveis",hasMockData: false },
  { ticker: "RAIZ4",  companyName: "Raízen S.A.",                                           tradingName: "Raízen",         sector: "Petróleo e Gás",        subsector: "Biocombustíveis",             hasMockData: false },

  // Mineração
  { ticker: "VALE3",  companyName: "Vale S.A.",                                             tradingName: "Vale",           sector: "Mineração",             subsector: "Minério de Ferro",            hasMockData: false },

  // Siderurgia e Metalurgia
  { ticker: "GGBR4",  companyName: "Gerdau S.A.",                                           tradingName: "Gerdau",         sector: "Siderurgia e Metalurgia",subsector: "Aços Longos",               hasMockData: false },
  { ticker: "CSNA3",  companyName: "Companhia Siderúrgica Nacional",                        tradingName: "CSN",            sector: "Siderurgia e Metalurgia",subsector: "Aços Planos",               hasMockData: false },
  { ticker: "USIM5",  companyName: "Usiminas S.A.",                                         tradingName: "Usiminas",       sector: "Siderurgia e Metalurgia",subsector: "Aços Planos",               hasMockData: false },
  { ticker: "GOAU4",  companyName: "Metalúrgica Gerdau S.A.",                               tradingName: "Gerdau Met",     sector: "Siderurgia e Metalurgia",subsector: "Holding Industrial",        hasMockData: false },

  // Papel e Celulose
  { ticker: "SUZB3",  companyName: "Suzano S.A.",                                           tradingName: "Suzano",         sector: "Papel e Celulose",      subsector: "Celulose",                    hasMockData: false },
  { ticker: "KLBN11", companyName: "Klabin S.A.",                                           tradingName: "Klabin",         sector: "Papel e Celulose",      subsector: "Papel e Embalagens",          hasMockData: false },

  // Energia Elétrica
  { ticker: "EGIE3",  companyName: "Engie Brasil Energia S.A.",                             tradingName: "Engie Brasil",   sector: "Energia Elétrica",      subsector: "Geração de Energia",          hasMockData: true  },
  { ticker: "CPFE3",  companyName: "CPFL Energia S.A.",                                    tradingName: "CPFL Energia",   sector: "Energia Elétrica",      subsector: "Distribuição de Energia",     hasMockData: true  },
  { ticker: "ELET3",  companyName: "Centrais Elétricas Brasileiras S.A.",                   tradingName: "Eletrobras ON",  sector: "Energia Elétrica",      subsector: "Geração e Transmissão",       hasMockData: false },
  { ticker: "EQTL3",  companyName: "Equatorial Energia S.A.",                               tradingName: "Equatorial",     sector: "Energia Elétrica",      subsector: "Distribuição de Energia",     hasMockData: false },
  { ticker: "ENEV3",  companyName: "Eneva S.A.",                                            tradingName: "Eneva",          sector: "Energia Elétrica",      subsector: "Geração Termelétrica",        hasMockData: false },
  { ticker: "CMIG4",  companyName: "CEMIG – Companhia Energética de Minas Gerais",          tradingName: "CEMIG",          sector: "Energia Elétrica",      subsector: "Geração e Distribuição",      hasMockData: false },
  { ticker: "CPLE6",  companyName: "COPEL – Companhia Paranaense de Energia",               tradingName: "Copel",          sector: "Energia Elétrica",      subsector: "Geração e Distribuição",      hasMockData: false },
  { ticker: "ALUP11", companyName: "Alupar Investimento S.A.",                              tradingName: "Alupar",         sector: "Energia Elétrica",      subsector: "Transmissão de Energia",      hasMockData: false },
  { ticker: "TAEE11", companyName: "Taesa – Transmissora Aliança de Energia Elétrica S.A.", tradingName: "Taesa",          sector: "Energia Elétrica",      subsector: "Transmissão de Energia",      hasMockData: false },
  { ticker: "TRPL4",  companyName: "CTEEP – Cia. de Transmissão de Energia Elétrica Paulista", tradingName: "ISA CTEEP",  sector: "Energia Elétrica",      subsector: "Transmissão de Energia",      hasMockData: false },

  // Saneamento
  { ticker: "SBSP3",  companyName: "Sabesp – Cia. de Saneamento Básico do Estado de SP",   tradingName: "Sabesp",         sector: "Saneamento",            subsector: "Água e Esgoto",               hasMockData: false },

  // Telecomunicações
  { ticker: "VIVT3",  companyName: "Telefônica Brasil S.A.",                                tradingName: "Vivo",           sector: "Telecomunicações",      subsector: "Telefonia Fixa e Móvel",      hasMockData: true  },
  { ticker: "TIMS3",  companyName: "TIM S.A.",                                              tradingName: "TIM",            sector: "Telecomunicações",      subsector: "Telefonia Móvel",             hasMockData: false },

  // Bebidas
  { ticker: "ABEV3",  companyName: "Ambev S.A.",                                            tradingName: "Ambev",          sector: "Bebidas",               subsector: "Cervejas e Bebidas",          hasMockData: true  },

  // Alimentos
  { ticker: "BRFS3",  companyName: "BRF S.A.",                                              tradingName: "BRF",            sector: "Alimentos",             subsector: "Carnes e Derivados",          hasMockData: false },
  { ticker: "JBSS3",  companyName: "JBS S.A.",                                              tradingName: "JBS",            sector: "Alimentos",             subsector: "Carnes e Derivados",          hasMockData: false },
  { ticker: "MRFG3",  companyName: "Marfrig Global Foods S.A.",                             tradingName: "Marfrig",        sector: "Alimentos",             subsector: "Carnes e Derivados",          hasMockData: false },
  { ticker: "SMTO3",  companyName: "São Martinho S.A.",                                     tradingName: "São Martinho",   sector: "Alimentos",             subsector: "Açúcar e Álcool",             hasMockData: false },

  // Transporte e Logística
  { ticker: "RENT3",  companyName: "Localiza Rent a Car S.A.",                              tradingName: "Localiza",       sector: "Transporte",            subsector: "Locação de Veículos",         hasMockData: false },
  { ticker: "RAIL3",  companyName: "Rumo S.A.",                                             tradingName: "Rumo",           sector: "Transporte",            subsector: "Transporte Ferroviário",      hasMockData: false },

  // Construção Civil
  { ticker: "CYRE3",  companyName: "Cyrela Brazil Realty S.A.",                             tradingName: "Cyrela",         sector: "Construção Civil",      subsector: "Incorporação Imobiliária",    hasMockData: false },
  { ticker: "MRVE3",  companyName: "MRV Engenharia e Participações S.A.",                   tradingName: "MRV",            sector: "Construção Civil",      subsector: "Incorporação Imobiliária",    hasMockData: false },

  // Imóveis Comerciais
  { ticker: "MULT3",  companyName: "Multiplan Empreendimentos Imobiliários S.A.",           tradingName: "Multiplan",      sector: "Imóveis Comerciais",    subsector: "Shopping Centers",            hasMockData: false },

  // Bancário
  { ticker: "BBAS3",  companyName: "Banco do Brasil S.A.",                                  tradingName: "Banco do Brasil",sector: "Bancário",              subsector: "Banco Múltiplo",              hasMockData: false },
  { ticker: "ITUB4",  companyName: "Itaú Unibanco Holding S.A.",                            tradingName: "Itaú Unibanco",  sector: "Bancário",              subsector: "Banco Múltiplo",              hasMockData: false },
  { ticker: "BBDC4",  companyName: "Banco Bradesco S.A.",                                   tradingName: "Bradesco",       sector: "Bancário",              subsector: "Banco Múltiplo",              hasMockData: false },

  // Financeiro
  { ticker: "B3SA3",  companyName: "B3 S.A. – Brasil, Bolsa, Balcão",                      tradingName: "B3",             sector: "Financeiro",            subsector: "Bolsa de Valores",            hasMockData: false },

  // Saúde
  { ticker: "HAPV3",  companyName: "Hapvida Participações e Investimentos S.A.",            tradingName: "Hapvida",        sector: "Saúde",                 subsector: "Planos de Saúde",             hasMockData: false },
  { ticker: "RADL3",  companyName: "Raia Drogasil S.A.",                                    tradingName: "RD Saúde",       sector: "Saúde",                 subsector: "Farmácias e Drogarias",       hasMockData: false },
  { ticker: "HYPE3",  companyName: "Hypera S.A.",                                           tradingName: "Hypera Pharma",  sector: "Saúde",                 subsector: "Medicamentos",                hasMockData: false },

  // Varejo
  { ticker: "LREN3",  companyName: "Lojas Renner S.A.",                                     tradingName: "Renner",         sector: "Varejo",                subsector: "Vestuário",                   hasMockData: false },
  { ticker: "ASAI3",  companyName: "Assaí Atacadista S.A.",                                 tradingName: "Assaí",          sector: "Varejo",                subsector: "Atacado Alimentar",           hasMockData: false },

  // Consumo Pessoal
  { ticker: "NTCO3",  companyName: "Natura & Co Holding S.A.",                              tradingName: "Natura &Co",     sector: "Consumo Pessoal",       subsector: "Cosméticos e Higiene",        hasMockData: false },
];
