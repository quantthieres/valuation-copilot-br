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

## Aviso ⚠️

Este projeto é educacional e está em desenvolvimento.

Os dados apresentados atualmente são ilustrativos e podem não refletir informações reais ou atualizadas das empresas.

Nenhuma informação exibida neste projeto deve ser interpretada como recomendação de compra, venda ou manutenção de ativos financeiros.

---

## Autor

Desenvolvido como projeto de estudo em engenharia de software, análise financeira e valuation automatizado.
