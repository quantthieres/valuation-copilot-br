"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getCompanyData } from "@/data/companies";
import { recalculateDcf, sensitivityFairValue } from "@/lib/valuation/dcf";
import type { ProjectedYear } from "@/lib/valuation/dcf";
import { buildCvmFundamentalsFromFinancials } from "@/lib/cvm/transformers";
import type { NormalizedFinancials } from "@/lib/cvm/types";
import type { MarketDataQuote } from "@/lib/market-data/types";
import ReportHeader from "@/components/report/ReportHeader";
import ReportSection from "@/components/report/ReportSection";
import ReportMetricGrid from "@/components/report/ReportMetricGrid";
import ReportPrintButton from "@/components/report/ReportPrintButton";

const MONO = "'JetBrains Mono', 'Courier New', monospace";

// ─── formatting helpers ───────────────────────────────────────────────────────

function fmtBRL(v: number): string {
  const abs = Math.abs(v);
  return (v < 0 ? "−R$ " : "R$ ") + abs.toFixed(1).replace(".", ",") + "B";
}

function fmtPct(v: number): string {
  return v.toFixed(1).replace(".", ",") + "%";
}

// ─── inline tables ────────────────────────────────────────────────────────────

function DcfTable({ rows, terminalValue, pvTerminalValue }: {
  rows: ProjectedYear[];
  terminalValue: number;
  pvTerminalValue: number;
}) {
  const heads = ["Ano", "Receita", "EBIT", "NOPAT", "D&A", "Capex", "ΔCG", "FCF", "VP FCF"];
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: MONO }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {heads.map((h, i) => (
              <th key={h} style={{
                padding: "6px 10px",
                textAlign: i === 0 ? "center" : "right",
                color: "#64748b", fontWeight: 600,
                borderBottom: "1px solid #e2e8f0",
                fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3px",
                whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const highlight = idx === rows.length - 1;
            const bg = idx % 2 === 0 ? "#fff" : "#fafbfc";
            const tdBase: React.CSSProperties = {
              padding: "5px 10px", textAlign: "right",
              color: "#374151", borderBottom: "1px solid #f1f5f9",
              whiteSpace: "nowrap",
            };
            return (
              <tr key={row.year} style={{ background: bg }}>
                <td style={{ ...tdBase, textAlign: "center", fontWeight: 700, color: "#475569" }}>{row.year}</td>
                <td style={tdBase}>{fmtBRL(row.revenue)}</td>
                <td style={tdBase}>{fmtBRL(row.ebit)}</td>
                <td style={tdBase}>{fmtBRL(row.nopat)}</td>
                <td style={tdBase}>{fmtBRL(row.da)}</td>
                <td style={tdBase}>{fmtBRL(row.capex)}</td>
                <td style={tdBase}>{fmtBRL(row.deltaNwc)}</td>
                <td style={{ ...tdBase, fontWeight: 700, color: highlight ? "#1d4ed8" : "#0f172a" }}>{fmtBRL(row.fcf)}</td>
                <td style={{ ...tdBase, fontWeight: 700, color: highlight ? "#1d4ed8" : "#0f172a" }}>{fmtBRL(row.pvFcf)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: 24, marginTop: 12, paddingTop: 10, borderTop: "1px solid #e2e8f0" }}>
        <span style={{ fontSize: 11, color: "#64748b" }}>
          Valor Terminal:{" "}
          <strong style={{ color: "#0f172a", fontFamily: MONO }}>{fmtBRL(terminalValue)}</strong>
        </span>
        <span style={{ fontSize: 11, color: "#64748b" }}>
          VP do Valor Terminal:{" "}
          <strong style={{ color: "#0f172a", fontFamily: MONO }}>{fmtBRL(pvTerminalValue)}</strong>
        </span>
      </div>
    </div>
  );
}

function SensTable({ waccVals, tgVals, matrix, currentPrice, currentWacc, currentTg }: {
  waccVals: number[];
  tgVals: number[];
  matrix: number[][];
  currentPrice: number;
  currentWacc: number;
  currentTg: number;
}) {
  function cellColor(v: number) {
    const d = (v - currentPrice) / currentPrice;
    if (d > 0.15)  return { bg: "#dcfce7", text: "#15803d" };
    if (d > 0.05)  return { bg: "#f0fdf4", text: "#16a34a" };
    if (d > -0.05) return { bg: "#fff",    text: "#374151" };
    if (d > -0.15) return { bg: "#fff7ed", text: "#c2410c" };
    return           { bg: "#fef2f2", text: "#b91c1c" };
  }

  const cellBase: React.CSSProperties = {
    padding: "5px 10px", border: "1px solid #e2e8f0",
    fontFamily: MONO, fontSize: 11, textAlign: "center",
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", fontSize: 11, fontFamily: MONO }}>
        <thead>
          <tr>
            <th style={{ ...cellBase, background: "#f8fafc", fontSize: 9, color: "#94a3b8", textAlign: "left" }}>
              WACC ↓ / TC →
            </th>
            {tgVals.map(tg => (
              <th key={tg} style={{ ...cellBase, background: "#f8fafc", fontWeight: 600, color: "#374151" }}>
                {tg.toFixed(1).replace(".", ",")}%
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {waccVals.map((wacc, wi) => (
            <tr key={wacc}>
              <td style={{ ...cellBase, background: "#f8fafc", fontWeight: 600, color: "#374151", textAlign: "left" }}>
                {wacc.toFixed(1).replace(".", ",")}%
              </td>
              {tgVals.map((tg, ti) => {
                const val = matrix[wi][ti];
                const { bg, text } = cellColor(val);
                const isBase = Math.abs(wacc - currentWacc) < 0.01 && Math.abs(tg - currentTg) < 0.01;
                return (
                  <td key={ti} style={{
                    ...cellBase, background: bg, color: text,
                    fontWeight: isBase ? 700 : 500,
                    outline: isBase ? "1.5px solid #2563eb" : "none",
                    outlineOffset: "-1px",
                  }}>
                    R${val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
        {[
          { bg: "#dcfce7", label: ">15% potencial" },
          { bg: "#f0fdf4", label: "5–15% potencial" },
          { bg: "#fff7ed", label: "5–15% desconto" },
          { bg: "#fef2f2", label: ">15% desconto" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#64748b" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.bg, border: "1px solid #e2e8f0" }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── print styles ─────────────────────────────────────────────────────────────

const PRINT_CSS = `
  @media print {
    .no-print { display: none !important; }
    body { background: #fff !important; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .report-page { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; padding: 0 !important; }
    .report-section { page-break-inside: avoid; }
    table { page-break-inside: avoid; }
  }
  @page { size: A4; margin: 18mm 14mm; }
`;

// ─── main component ───────────────────────────────────────────────────────────

interface Props {
  ticker: string;
  source: string;
}

export default function ReportPageClient({ ticker, source }: Props) {
  const sourceMode = source === "cvm" ? "cvm" : "mock";
  const companyData = useMemo(() => getCompanyData(ticker), [ticker]);

  const [marketQuote, setMarketQuote]   = useState<MarketDataQuote | null>(null);
  const [cvmFinancials, setCvmFinancials] = useState<NormalizedFinancials[] | null>(null);
  const [cvmUnavailable, setCvmUnavailable] = useState(false);
  const [loading, setLoading]             = useState(true);
  const [generatedAt]                     = useState(() =>
    new Date().toLocaleString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  );

  useEffect(() => {
    const fetches: Promise<void>[] = [];

    if (companyData) {
      fetches.push(
        fetch(`/api/market-data/${encodeURIComponent(ticker)}`)
          .then(r => r.json())
          .then((body: { quote: MarketDataQuote | null }) => setMarketQuote(body.quote ?? null))
          .catch(() => {})
      );
    }

    if (sourceMode === "cvm") {
      fetches.push(
        fetch(`/api/cvm/financials/${encodeURIComponent(ticker)}`)
          .then(r => r.json())
          .then((body: { financials: NormalizedFinancials[]; error?: string }) => {
            if (body.financials?.length > 0) {
              setCvmFinancials(body.financials);
            } else {
              setCvmUnavailable(true);
            }
          })
          .catch(() => setCvmUnavailable(true))
      );
    }

    Promise.all(fetches).finally(() => setLoading(false));
  }, [ticker, sourceMode, companyData]);

  const activeFundamentals = useMemo(() => {
    if (!companyData) return null;
    if (sourceMode === "cvm" && cvmFinancials && cvmFinancials.length > 0) {
      return buildCvmFundamentalsFromFinancials(cvmFinancials, companyData.fundamentals);
    }
    return companyData.fundamentals;
  }, [sourceMode, cvmFinancials, companyData]);

  const dcf = useMemo(() => {
    if (!companyData || !activeFundamentals) return null;
    const price = marketQuote?.price ?? companyData.company.price;
    return recalculateDcf(companyData.defaultAssumptions, activeFundamentals, price);
  }, [companyData, activeFundamentals, marketQuote]);

  const sensitivityMatrix = useMemo(() => {
    if (!companyData || !activeFundamentals) return [];
    return companyData.waccVals.map(w =>
      companyData.terminalGrowthVals.map(tg =>
        Math.round(sensitivityFairValue(companyData.defaultAssumptions, w, tg, activeFundamentals))
      )
    );
  }, [companyData, activeFundamentals]);

  // ── early returns (after all hooks) ──────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ fontSize: 14, color: "#64748b" }}>Gerando relatório...</div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", gap: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>Ticker não encontrado</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>Dados completos não disponíveis para {ticker} no MVP.</div>
        <Link href="/" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none" }}>← Voltar ao dashboard</Link>
      </div>
    );
  }

  // ── derived values ────────────────────────────────────────────────────────────

  const company        = companyData.company;
  const assumptions    = companyData.defaultAssumptions;
  const displayPrice   = marketQuote?.price        ?? company.price;
  const displayChange  = marketQuote?.changePercent ?? company.priceChangePct;
  const quoteSource    = marketQuote?.source        ?? null;
  const effectiveSource: "mock" | "cvm" = (sourceMode === "cvm" && !cvmUnavailable) ? "cvm" : "mock";

  const snapshotItems = [
    { label: "Preço Atual", value: `R$ ${displayPrice.toFixed(2).replace(".", ",")}`, note: quoteSource === "brapi" ? "brapi" : "ilustrativo" },
    { label: "Variação Diária", value: `${displayChange >= 0 ? "+" : ""}${displayChange.toFixed(2).replace(".", ",")}%` },
    { label: "Valor de Mercado", value: company.marketCap },
    { label: "Enterprise Value", value: company.enterpriseValue },
    { label: "Moeda", value: company.currency },
    { label: "Setor", value: company.sector },
  ];

  const metricItems = companyData.metrics.map(m => ({
    label: m.label, value: m.value, note: m.suffix,
  }));

  const valuationItems = dcf ? [
    { label: "Valor Intrínseco / Ação", value: `R$ ${dcf.intrinsicValue.toFixed(2).replace(".", ",")}` },
    { label: "Preço Atual",             value: `R$ ${dcf.currentPrice.toFixed(2).replace(".", ",")}` },
    { label: "Potencial de Alta",       value: `${dcf.impliedUpside >= 0 ? "+" : ""}${dcf.impliedUpside.toFixed(1).replace(".", ",")}%` },
    { label: "Enterprise Value",        value: dcf.enterpriseValue },
    { label: "Equity Value",            value: dcf.equityValue },
    { label: "Valor Terminal",          value: fmtBRL(dcf.terminalValue) },
    { label: "VP Valor Terminal",       value: fmtBRL(dcf.pvTerminalValue) },
    { label: "Cenário Bear",            value: `R$ ${dcf.bearCase.toFixed(2).replace(".", ",")}` },
    { label: "Cenário Bull",            value: `R$ ${dcf.bullCase.toFixed(2).replace(".", ",")}` },
  ] : [];

  const assumptionItems = [
    { label: "CAGR Receita",         value: fmtPct(assumptions.revenueCAGR) },
    { label: "Margem EBIT",          value: fmtPct(assumptions.ebitMargin) },
    { label: "Alíquota IR/CS",       value: fmtPct(assumptions.taxRate) },
    { label: "WACC",                 value: fmtPct(assumptions.wacc) },
    { label: "Crescimento Terminal", value: fmtPct(assumptions.terminalGrowth) },
    { label: "Capex / Receita",      value: fmtPct(assumptions.capexRevenue) },
    { label: "ΔCG / Receita",        value: fmtPct(assumptions.nwcChange) },
  ];

  const dataSourceNote = effectiveSource === "cvm"
    ? "Este relatório usa dados extraídos da DFP anual consolidada da CVM. Alguns campos, como Capex, FCF e dívida líquida, são normalizados ou calculados a partir das demonstrações. EBITDA pode usar EBIT como proxy quando D&A não estiver disponível."
    : "Este relatório usa dados ilustrativos para demonstração.";

  // ── render ────────────────────────────────────────────────────────────────────

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "24px 16px" }}>

        {/* Top bar — hidden in print */}
        <div className="no-print" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          maxWidth: 900, margin: "0 auto 20px",
        }}>
          <Link href="/" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
            ← Voltar ao Dashboard
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              {effectiveSource === "cvm" ? "Modo CVM" : "Dados mockados"}
            </span>
            <ReportPrintButton />
          </div>
        </div>

        {/* Report body */}
        <div className="report-page" style={{
          maxWidth: 900, margin: "0 auto", background: "#fff",
          borderRadius: 10, padding: "36px 44px",
          boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
        }}>

          <ReportHeader
            company={company}
            source={effectiveSource}
            quoteSource={quoteSource}
            generatedAt={generatedAt}
          />

          {/* CVM fallback notice */}
          {sourceMode === "cvm" && cvmUnavailable && (
            <div style={{
              background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6,
              padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#b45309",
            }}>
              Dados CVM não disponíveis para {ticker}. Este relatório usa dados ilustrativos como fallback.
            </div>
          )}

          <ReportSection title="Informações da Empresa">
            <ReportMetricGrid items={snapshotItems} columns={3} />
          </ReportSection>

          <ReportSection title="Indicadores-Chave">
            <ReportMetricGrid items={metricItems} columns={3} />
          </ReportSection>

          {dcf && (
            <ReportSection title="Resumo do Valuation" subtitle="DCF · premissas-padrão">
              <ReportMetricGrid items={valuationItems} columns={3} />
            </ReportSection>
          )}

          <ReportSection title="Premissas DCF">
            <ReportMetricGrid items={assumptionItems} columns={4} />
          </ReportSection>

          {dcf && dcf.valid && dcf.projectedCashFlows.length > 0 && (
            <ReportSection title="Projeção de Fluxo de Caixa" subtitle="10 anos · valores em R$ bilhões">
              <DcfTable
                rows={dcf.projectedCashFlows}
                terminalValue={dcf.terminalValue}
                pvTerminalValue={dcf.pvTerminalValue}
              />
            </ReportSection>
          )}

          {sensitivityMatrix.length > 0 && (
            <ReportSection title="Análise de Sensibilidade" subtitle="Valor justo / ação · WACC vs. Crescimento Terminal">
              <SensTable
                waccVals={companyData.waccVals}
                tgVals={companyData.terminalGrowthVals}
                matrix={sensitivityMatrix}
                currentPrice={displayPrice}
                currentWacc={assumptions.wacc}
                currentTg={assumptions.terminalGrowth}
              />
            </ReportSection>
          )}

          <ReportSection title="Nota sobre os Dados">
            <p style={{ margin: 0, fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>
              {dataSourceNote}
            </p>
          </ReportSection>

          {/* Disclaimer */}
          <div style={{
            marginTop: 24, paddingTop: 16, borderTop: "1px solid #e2e8f0",
            fontSize: 11, color: "#94a3b8", lineHeight: 1.8,
          }}>
            <strong style={{ display: "block", marginBottom: 3, color: "#64748b", fontWeight: 600 }}>
              Aviso Legal
            </strong>
            Este relatório tem finalidade educacional e demonstrativa. As informações apresentadas não
            constituem recomendação de investimento, oferta de compra ou venda de valores mobiliários,
            nem substituem análise profissional independente.
          </div>
        </div>
      </div>
    </>
  );
}
