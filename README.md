<h1 align="center">Valuation Copilot BR</h1>

<p align="center">
  <img src="public/logo/logo-icon.svg" width="80"/>
</p>

Plataforma web para análise financeira e valuation automatizado de empresas brasileiras listadas na B3.

O objetivo do projeto é permitir que o usuário busque uma empresa por ticker ou nome e visualize, em uma interface limpa e profissional, informações financeiras, valuation por DCF, análise de sensibilidade, múltiplos comparáveis e documentos/notícias relevantes.

> Projeto em desenvolvimento. Os dados atuais são ilustrativos e não constituem recomendação de investimento.

---

## Visão Geral

O **Valuation Copilot BR** é um MVP de uma plataforma de equity research automatizada com foco inicial no mercado brasileiro.

A proposta é reduzir o trabalho manual de coleta, organização e análise de dados financeiros, oferecendo uma experiência parecida com uma ferramenta profissional de research, mas mais simples, acessível e focada em usabilidade.

Atualmente, o dashboard usa dados mockados da **WEG S.A. (WEGE3)** e já possui um motor de DCF funcional no frontend.

---

## Funcionalidades atuais

- Dashboard de empresa brasileira listada na B3
- Exemplo inicial com **WEGE3 — WEG S.A.**
- Cards de métricas financeiras
- Gráfico de financeiros históricos
- Modelo de valuation por DCF
- Premissas editáveis:
  - CAGR da receita
  - Margem EBIT
  - Alíquota IR/CS
  - WACC
  - Crescimento terminal
  - Capex / Receita
  - Capital de giro / Receita
- Recalculo dinâmico do valuation
- Cálculo de:
  - Receita projetada
  - EBIT
  - NOPAT
  - D&A
  - Capex
  - Variação de capital de giro
  - Fluxo de caixa livre
  - Valor terminal
  - Valor presente dos fluxos
  - Enterprise Value
  - Equity Value
  - Valor justo por ação
- Tabela de sensibilidade dinâmica
- Múltiplos comparáveis
- Painel de documentos e notícias relevantes
- Interface em português
- Layout responsivo básico
- Projeto migrado para Next.js + TypeScript

---

## Tecnologias

- [Next.js](https://nextjs.org/)
- React
- TypeScript
- CSS inline e CSS global
- SVG puro para gráficos
- Sem dependência externa de gráficos no momento

---

## Estrutura do projeto

```txt
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── dashboard/
│       ├── SectionCard.tsx
│       ├── NavBar.tsx
│       ├── CompanyHeader.tsx
│       ├── MetricsRow.tsx
│       ├── HistoricalChart.tsx
│       ├── DcfSummary.tsx
│       ├── SensitivityTable.tsx
│       ├── AssumptionsPanel.tsx
│       ├── MultiplesTable.tsx
│       ├── NewsPanel.tsx
│       └── RecalcToast.tsx
│
├── data/
│   └── wege3.ts
│
├── lib/
│   ├── formatters.ts
│   └── valuation/
│       └── dcf.ts
│
└── public/
    └── logo/
    ├── logo-full.svg
    ├── logo-icon.svg
    ├── logo-icon-monochrome.svg
    └── favicon.svg
```

---

## Como rodar localmente

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/valuation-copilot-br.git
```

Entre na pasta:

```bash
cd valuation-copilot-br
```

Instale as dependências:

```bash
npm install
```

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

Abra no navegador:

```txt
http://localhost:3000
```

---

## Scripts disponíveis

```bash
npm run dev
```

Roda o projeto em modo desenvolvimento.

```bash
npm run build
```

Gera o build de produção.

```bash
npm run start
```

Roda a aplicação em modo produção após o build.

```bash
npx tsc --noEmit
```

Verifica erros de TypeScript sem gerar arquivos.

---

## Modelo DCF

O motor de DCF está localizado em:

```txt
src/lib/valuation/dcf.ts
```

O modelo calcula:

1. Receita projetada
2. EBIT
3. NOPAT
4. Depreciação e amortização
5. Capex
6. Variação de capital de giro
7. Fluxo de caixa livre
8. Valor presente dos fluxos
9. Valor terminal
10. Valor presente do valor terminal
11. Enterprise Value
12. Equity Value
13. Valor justo por ação

Fórmula simplificada do fluxo de caixa livre:

```txt
FCF = NOPAT + D&A - Capex - ΔCapital de Giro
```

Valor terminal:

```txt
Terminal Value = FCF_final × (1 + g) / (WACC - g)
```

Valor justo por ação:

```txt
Fair Value per Share = Equity Value / Shares Outstanding
```

---

## Status atual do MVP

Concluído:

- [x] Protótipo visual
- [x] Migração para Next.js
- [x] Componentização
- [x] Remoção de dependência de CDN/Babel no browser
- [x] Dados mockados da WEGE3
- [x] DCF funcional
- [x] Sensibilidade dinâmica
- [x] Navbar simplificada
- [x] Build de produção funcionando

Em andamento / próximos passos:

- [ ] Busca funcional por ticker ou nome da empresa
- [ ] Suporte a múltiplas empresas mockadas
- [ ] Refatorar datasets por empresa
- [ ] Integração com dados reais de mercado
- [ ] Integração com dados CVM/B3
- [ ] Exportação de relatório
- [ ] Página de metodologia
- [ ] Deploy na Vercel

---

## Roadmap

### Fase 1: MVP local

- Dashboard de uma empresa
- Dados mockados
- DCF funcional
- Sensibilidade dinâmica
- Interface profissional

### Fase 2: Busca e múltiplas empresas

- Adicionar empresas como EGIE3, CPFE3, ABEV3 e VIVT3
- Criar busca por ticker/nome
- Trocar dados do dashboard ao selecionar empresa

### Fase 3: Dados reais

- Integrar API de cotação
- Integrar dados fundamentalistas
- Adicionar conexão futura com CVM, DFP e ITR

### Fase 4: Research automation

- Filtro de fatos relevantes
- Notícias financeiras
- Exportação de relatório
- Histórico de valuations

---

## CVM data layer

The `src/lib/cvm/` module provides the foundation for ingesting official financial statements from [CVM Dados Abertos](https://dados.cvm.gov.br).

### Architecture

| File | Purpose |
|---|---|
| `src/lib/cvm/types.ts` | Core types: `CvmCompany`, `CvmRegistryCompany`, `RawCvmStatementRow`, `NormalizedFinancials` |
| `src/lib/cvm/company-map.ts` | Verified ticker → CVM registration data (cvmCode + cnpj) for 12 companies |
| `src/lib/cvm/cvm-registry.ts` | Runtime registry fetch, in-memory cache (24 h TTL), name-based matcher |
| `src/lib/cvm/cvm-client.ts` | Public API: `getCvmCompany()`, `getAnnualFinancialsFromCvm()` |
| `src/lib/cvm/normalizer.ts` | Converts raw CVM CSV rows into `NormalizedFinancials` |

### Ticker mapping

The app includes an initial ticker-to-CVM mapping layer based on CVM's official company registry (`cad_cia_aberta.csv`). All 12 companies have been verified and populated with real `cvmCode` and `cnpj` values (`hasCvmMapping: true`):

| Ticker | CVM Code | Company (CVM registry) |
|--------|----------|------------------------|
| WEGE3 | 5410 | WEG SA |
| EGIE3 | 17329 | Engie Brasil Energia S.A. |
| CPFE3 | 18660 | CPFL Energia SA |
| ABEV3 | 23264 | Ambev S.A. |
| VIVT3 | 17671 | Telefônica Brasil S.A. |
| PETR3 / PETR4 | 9512 | Petróleo Brasileiro S.A. — Petrobras |
| VALE3 | 4170 | Vale S.A. |
| SUZB3 | 13986 | Suzano S.A. |
| PRIO3 | 22187 | PRIO S.A. (ex-Petro Rio) |
| ELET3 | 2437 | Axia Energia S.A. (ex-Eletrobras) |
| EQTL3 | 20010 | Equatorial S.A. |

> **ELET3 note:** After privatization in 2022, Centrais Elétricas Brasileiras S.A. (Eletrobras) adopted the legal name "Axia Energia S.A." in the CVM registry. The CNPJ `00.001.180/0001-26` and CVM code `2437` are verified. The B3 ticker and trading name remain ELET3 / ELETROBRAS.

### Runtime registry matching

`src/lib/cvm/cvm-registry.ts` fetches the live CVM registry at request time and attempts to match tickers by normalized company name (accent removal, suffix stripping, uppercase). Results are cached in memory for 24 hours. If the registry is unreachable, the static map is used as fallback.

### API route

```
GET /api/cvm/company/:ticker
```

Returns the CVM company entry plus match metadata:

```json
{
  "company": {
    "ticker": "WEGE3",
    "companyName": "WEG SA",
    "cvmCode": "5410",
    "cnpj": "84.429.695/0001-11",
    "hasCvmMapping": true
  },
  "source": "cvm_registry",
  "matchMethod": "exact_name"
}
```

If the live registry match fails but the static map has a verified entry:

```json
{
  "source": "static_map",
  "matchMethod": "manual_verification"
}
```

### Next step: financial statement parsing

See the **CVM DFP financials** section below.

---

## CVM DFP financials

The app can now fetch and parse real annual financial statements from CVM Dados Abertos. Values are normalized to **BRL billions** and returned per fiscal year.

### Architecture

| File | Purpose |
|---|---|
| `src/lib/cvm/dfp-parser.ts` | Parses a DFP CSV string into `RawCvmStatementRow[]`; handles Latin-1, header-index columns, MIL scale, VERSAO deduplication |
| `src/lib/cvm/dfp-client.ts` | Downloads yearly zip files, extracts target CSVs with `fflate`, assembles and normalizes rows per year |
| `src/lib/cvm/normalizer.ts` | Maps CVM account codes to `NormalizedFinancials` fields; identifies capex by DFC sub-row names |

### API endpoint

```
GET /api/cvm/financials/:ticker
```

Example: `/api/cvm/financials/WEGE3`

```json
{
  "ticker": "WEGE3",
  "source": "cvm_dfp",
  "company": { "ticker": "WEGE3", "companyName": "WEG S.A.", "cvmCode": "5410", "cnpj": "84.429.695/0001-11" },
  "financials": [
    { "fiscalYear": 2020, "revenue": 17.47, "ebit": 2.82, "netIncome": 2.40, "operatingCashFlow": 3.93, "capex": 0.56, "freeCashFlow": 3.37, "cash": 3.89, "totalDebt": 1.69, "netDebt": -2.21 },
    ...
    { "fiscalYear": 2024, "revenue": 37.99, "ebit": 7.69, "netIncome": 6.32, "operatingCashFlow": 7.25, "capex": 1.85, "freeCashFlow": 5.40, "cash": 7.35, "totalDebt": 3.60, "netDebt": -3.75 }
  ]
}
```

### Years supported

Fiscal years **2020 – 2024** (5 annual DFP zips). Configurable via `DFP_YEARS` in `dfp-client.ts`.

### Statement files parsed

Per year (from `dfp_cia_aberta_YYYY.zip`):

| File | Fields extracted |
|---|---|
| `dfp_cia_aberta_DRE_con_YYYY.csv` | revenue (3.01), ebit (3.05), netIncome (3.11) |
| `dfp_cia_aberta_DFC_MI_con_YYYY.csv` | operatingCashFlow (6.01), capex (6.02.xx by name) |
| `dfp_cia_aberta_DFC_MD_con_YYYY.csv` | fallback if DFC_MI not available |
| `dfp_cia_aberta_BPA_con_YYYY.csv` | cash (1.01.01) |
| `dfp_cia_aberta_BPP_con_YYYY.csv` | totalDebt (2.01.04 + 2.02.01) |

### Caching

Two in-memory layers (no disk persistence — server restarts clear cache):

| Level | Key | TTL | Purpose |
|---|---|---|---|
| Zip buffer | `year` | 1 h | Avoids re-downloading the same zip when multiple statement types are needed |
| Filtered rows | `year:stmtType:cvmCode` | 24 h | Parsed+filtered data for a specific company |

### This step replaces mock data?

Not yet. The dashboard still uses mock data. The DFP endpoint is a standalone test route. Dashboard integration (replacing mock datasets with real CVM data) is the next step.

### Known limitations

- **Consolidated only**: only `_con` statement files are fetched (no standalone/individual).
- **Cold start**: first request per year downloads a ~13 MB zip (1–3 s per year on typical connections). Subsequent requests are served from cache.
- **Capex estimation**: identified by DFC sub-row names containing "imobilizado" / "intangível" / "ativo fixo". M&A rows ("empresa", "combinação") are excluded. May miss companies with non-standard naming.
- **Debt scope**: only `2.01.04` (short-term) + `2.02.01` (long-term) loans. Debentures at non-standard accounts are not yet captured.
- **No ITR**: quarterly data is future work.

---

## Market data configuration

The app can optionally fetch real-time quote data from [brapi.dev](https://brapi.dev) and display it in the company header. This is fully optional — without a token the app runs normally using mock price data.

### Local development

1. Copy the example env file:

```bash
cp .env.example .env.local
```

2. Add your token to `.env.local`:

```env
BRAPI_TOKEN=your_brapi_token_here
```

3. Restart the dev server. The company header will show live prices with "Fonte: brapi".

**Never commit `.env.local`** — it is already listed in `.gitignore`.

### Vercel deployment

In your Vercel project, go to:

**Project Settings → Environment Variables**

Add a new variable:

| Name | Value | Environment |
|------|-------|-------------|
| `BRAPI_TOKEN` | your token | Production, Preview, Development |

The token is only used server-side and is never included in the client bundle.

### Fallback behavior

If `BRAPI_TOKEN` is not set or if brapi is unreachable:
- The app falls back silently to mock price data.
- The dashboard remains fully functional.
- The company header shows "Fonte: dados ilustrativos".

### Security

- `BRAPI_TOKEN` is read exclusively in `src/lib/market-data/brapi.ts` (server module) and the API route `src/app/api/market-data/[ticker]/route.ts`.
- The frontend only calls the internal route `/api/market-data/{ticker}` — the real token never reaches the browser.
- **Never use `NEXT_PUBLIC_BRAPI_TOKEN`** — that would expose the token in the client bundle.
- **Never commit `.env.local`** or any file containing a real token.
- If a token is accidentally exposed, rotate it immediately at [brapi.dev](https://brapi.dev) and treat the old key as compromised.

---

## Coverage status

Each asset in the B3 universe carries a `coverageStatus` field that describes what the platform currently supports for it. This drives search dropdown badges and the empty-state experience when a ticker without a full dashboard is selected.

| Status | Badge label | Meaning |
|--------|-------------|---------|
| `valuation_available` | **Valuation** | Full dashboard: DCF, sensitivity table, multiples, historical chart. Mock data validated. |
| `cvm_financials` | **CVM** | Real DFP/CVM annual financials are fetched. Full valuation model is still being validated for this asset. |
| `quote_only` | **Cotação** | No financial statements yet. Live price from brapi is displayed in the empty state. |
| `sector_specific_model_required` | **Modelo específico** | DCF does not apply — asset requires DDM, NAV, or another sector-specific method (banks, insurers, FIIs, ETFs, holdings). |
| `unavailable` | **Em breve** | Asset is in the search universe but no data integration is available yet. |

### Current coverage (approximate)

- 5 assets with `valuation_available`: WEGE3, ABEV3, EGIE3, CPFE3, VIVT3
- 7 assets with `cvm_financials`: PETR3, PETR4, VALE3, SUZB3, PRIO3, ELET3, EQTL3
- ~30 assets with `sector_specific_model_required`: major banks (ITUB4, BBDC4, BBAS3, SANB11), insurers (BBSE3, IRBR3), FIIs (MXRF11, XPML11, HGLG11, …), ETFs (BOVA11, IVVB11, …), and holding companies
- ~130+ assets with `quote_only`: most mid- and large-cap equities, units, and BDRs

### Asset types

The `assetType` field classifies each asset structurally:

| Type | Description |
|------|-------------|
| `stock` | ON or PN ordinary/preferred share |
| `unit` | Certificate of deposit (e.g., TAEE11, BPAC11) |
| `fii` | Fundo de Investimento Imobiliário |
| `etf` | Exchange Traded Fund |
| `bdr` | Brazilian Depositary Receipt |
| `unknown` | Classification pending |

---

## Aviso ⚠️

Este projeto é educacional e está em desenvolvimento.

Os dados apresentados atualmente são ilustrativos e podem não refletir informações reais ou atualizadas das empresas.

Nenhuma informação exibida neste projeto deve ser interpretada como recomendação de compra, venda ou manutenção de ativos financeiros.

---

## Autor

Desenvolvido como projeto de estudo em engenharia de software, análise financeira e valuation automatizado.
