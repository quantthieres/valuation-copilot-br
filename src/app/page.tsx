"use client";

import { useState, useMemo, useEffect } from "react";
import NavBar from "@/components/dashboard/NavBar";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import MetricsRow from "@/components/dashboard/MetricsRow";
import HistoricalChart from "@/components/dashboard/HistoricalChart";
import DcfSummary from "@/components/dashboard/DcfSummary";
import SensitivityTable from "@/components/dashboard/SensitivityTable";
import AssumptionsPanel from "@/components/dashboard/AssumptionsPanel";
import MultiplesTable from "@/components/dashboard/MultiplesTable";
import NewsPanel from "@/components/dashboard/NewsPanel";
import RecalcToast from "@/components/dashboard/RecalcToast";
import DcfProjectionTable from "@/components/dashboard/DcfProjectionTable";
import CvmFinancialsTable from "@/components/dashboard/CvmFinancialsTable";
import DataSourceNotice from "@/components/dashboard/DataSourceNotice";
import { cvmFinancialsToDashboardFinancials, buildCvmFundamentalsFromFinancials } from "@/lib/cvm/transformers";
import type { NormalizedFinancials } from "@/lib/cvm/types";
import { getCompanyData, DEFAULT_DATA } from "@/data/companies";
import { B3_UNIVERSE } from "@/data/b3-universe";
import type { MarketDataQuote } from "@/lib/market-data/types";
import {
  recalculateDcf, sensitivityFairValue,
  type Assumptions, type DcfResult,
} from "@/lib/valuation/dcf";

const TABS = ["Visão Geral", "Financeiros", "Valuation", "Notícias", "Premissas"];

function TabBar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (t: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 0, padding: "0 24px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            padding: "10px 16px", fontSize: 13, fontWeight: 500,
            color: activeTab === tab ? "#2563eb" : "#64748b",
            background: "none", border: "none",
            borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent",
            cursor: "pointer", fontFamily: "inherit", marginBottom: -1,
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function EmptyStateView({ ticker, companyName }: { ticker: string; companyName: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "72px 24px", textAlign: "center",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, marginBottom: 20,
      }}>
        📊
      </div>
      <div style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
        padding: "36px 48px", maxWidth: 520,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          display: "inline-block", background: "#f1f5f9", color: "#475569",
          fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
          fontFamily: "'JetBrains Mono', monospace", marginBottom: 16,
          letterSpacing: "0.5px",
        }}>
          {ticker}
        </div>
        <h2 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
          {companyName}
        </h2>
        <p style={{ margin: "0 0 8px", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
          Dados completos ainda não disponíveis para este ativo no MVP.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
          Este ticker já está no universo de busca. A integração de dados financeiros será
          adicionada nas próximas etapas.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab]       = useState("Visão Geral");
  const [selectedTicker, setSelected]   = useState("WEGE3");
  const [assumptions, setAssumptions]   = useState<Assumptions>(() => ({ ...DEFAULT_DATA.defaultAssumptions }));
  const [toastVisible, setToastVisible] = useState(false);
  const [dcf, setDcf]                   = useState<DcfResult>(() =>
    recalculateDcf(DEFAULT_DATA.defaultAssumptions, DEFAULT_DATA.fundamentals, DEFAULT_DATA.company.price)
  );
  const [marketQuote, setMarketQuote]     = useState<MarketDataQuote | null>(null);
  const [quoteLoading, setQuoteLoading]   = useState(false);
  const [financialSource, setFinancialSource] = useState<"mock" | "cvm">("mock");
  const [cvmFinancials, setCvmFinancials] = useState<NormalizedFinancials[] | null>(null);
  const [cvmLoading, setCvmLoading]       = useState(false);

  const companyData = useMemo(() => getCompanyData(selectedTicker), [selectedTicker]);

  const activeFundamentals = useMemo(() => {
    if (financialSource === "cvm" && cvmFinancials && cvmFinancials.length > 0 && companyData) {
      return buildCvmFundamentalsFromFinancials(cvmFinancials, companyData.fundamentals);
    }
    return companyData?.fundamentals ?? DEFAULT_DATA.fundamentals;
  }, [financialSource, cvmFinancials, companyData]);

  const activeFinancials = useMemo(() => {
    if (financialSource === "cvm" && cvmFinancials && cvmFinancials.length > 0) {
      return cvmFinancialsToDashboardFinancials(cvmFinancials);
    }
    return companyData?.financials ?? [];
  }, [financialSource, cvmFinancials, companyData]);

  const activeMetrics = useMemo(() => {
    if (!companyData) return [];
    if (financialSource !== "cvm" || !cvmFinancials || cvmFinancials.length === 0) {
      return companyData.metrics;
    }
    const latest = [...cvmFinancials].sort((a, b) => b.fiscalYear - a.fiscalYear)[0];
    return companyData.metrics.map(m => {
      if (m.label === "Receita" && latest.revenue !== undefined) {
        return { ...m, value: `R$ ${latest.revenue.toFixed(1).replace(".", ",")}B` };
      }
      if (m.label === "Fluxo de Caixa Livre" && latest.freeCashFlow !== undefined) {
        return { ...m, value: `R$ ${Math.abs(latest.freeCashFlow).toFixed(1).replace(".", ",")}B` };
      }
      return m;
    });
  }, [financialSource, cvmFinancials, companyData]);

  // Fetch real market quote whenever the selected ticker changes.
  // Falls back silently to mock data if the API is unavailable or returns null.
  useEffect(() => {
    if (!getCompanyData(selectedTicker)) {
      setMarketQuote(null);
      setQuoteLoading(false);
      return;
    }

    let cancelled = false;
    setMarketQuote(null);
    setQuoteLoading(true);

    fetch(`/api/market-data/${encodeURIComponent(selectedTicker)}`)
      .then(res => res.json())
      .then((body: { quote: MarketDataQuote | null }) => {
        if (!cancelled) setMarketQuote(body.quote ?? null);
      })
      .catch(() => { /* network error — keep mock data */ })
      .finally(() => { if (!cancelled) setQuoteLoading(false); });

    return () => { cancelled = true; };
  }, [selectedTicker]);

  // Recalculate DCF when CVM data arrives or source resets
  useEffect(() => {
    if (financialSource !== "cvm" || !companyData || cvmFinancials === null) return;
    const fundamentals = cvmFinancials.length > 0
      ? buildCvmFundamentalsFromFinancials(cvmFinancials, companyData.fundamentals)
      : companyData.fundamentals;
    setDcf(recalculateDcf(assumptions, fundamentals, companyData.company.price));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvmFinancials, financialSource]);

  const sensitivityMatrix = useMemo(() => {
    if (!companyData) return [];
    return companyData.waccVals.map(w =>
      companyData.terminalGrowthVals.map(tg => {
        const fv = sensitivityFairValue(assumptions, w, tg, activeFundamentals);
        return Math.round(fv);
      })
    );
  }, [assumptions, companyData, activeFundamentals]);

  function handleAssumptionChange(key: keyof Assumptions, val: number) {
    setAssumptions(prev => ({ ...prev, [key]: val }));
  }

  function handleRecalculate() {
    if (!companyData) return;
    setDcf(recalculateDcf(assumptions, activeFundamentals, companyData.company.price));
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  function handleSelectCompany(ticker: string) {
    const data = getCompanyData(ticker);
    setSelected(ticker);
    setFinancialSource("mock");
    setCvmFinancials(null);
    if (data) {
      const newAssumptions = { ...data.defaultAssumptions };
      setAssumptions(newAssumptions);
      setDcf(recalculateDcf(newAssumptions, data.fundamentals, data.company.price));
    }
  }

  function handleSourceChange(source: "mock" | "cvm") {
    setFinancialSource(source);
    if (source === "mock") {
      setCvmFinancials(null);
      if (companyData) {
        setDcf(recalculateDcf(assumptions, companyData.fundamentals, companyData.company.price));
      }
      return;
    }
    setCvmFinancials(null);
    setCvmLoading(true);
    fetch(`/api/cvm/financials/${encodeURIComponent(selectedTicker)}`)
      .then(res => res.json())
      .then((body: { financials: NormalizedFinancials[]; error?: string }) => {
        setCvmFinancials(body.financials ?? []);
      })
      .catch(() => { setCvmFinancials([]); })
      .finally(() => { setCvmLoading(false); });
  }

  const b3Entry = useMemo(
    () => B3_UNIVERSE.find(c => c.ticker === selectedTicker),
    [selectedTicker]
  );

  const sensitivityProps = companyData ? {
    waccVals:     companyData.waccVals,
    tgVals:       companyData.terminalGrowthVals,
    matrix:       sensitivityMatrix,
    currentPrice: companyData.company.price,
    currentWacc:  assumptions.wacc,
    currentTg:    assumptions.terminalGrowth,
  } : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <NavBar onSelectCompany={handleSelectCompany} selectedTicker={selectedTicker} />

      {companyData ? (
        <>
          <CompanyHeader
            company={companyData.company}
            quote={marketQuote}
            quoteLoading={quoteLoading}
            exportUrl={`/relatorio/${selectedTicker}?source=${financialSource}`}
          />
          <MetricsRow metrics={activeMetrics} />

          <div style={{
            padding: "5px 24px",
            background: "#fff",
            borderBottom: "1px solid #f1f5f9",
            fontSize: 11,
            color: "#94a3b8",
            textAlign: "center" as const,
          }}>
            Dados ilustrativos para demonstração. Não constitui recomendação de investimento.
          </div>

          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

          <div style={{ padding: "18px 24px" }}>
            {activeTab === "Visão Geral" && (
              <div
                className="main-grid"
                style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 14, alignItems: "start" }}
              >
                <div>
                  <HistoricalChart data={activeFinancials} />
                  <DcfSummary dcf={dcf} />
                  {sensitivityProps && <SensitivityTable {...sensitivityProps} />}
                </div>
                <div>
                  <AssumptionsPanel
                    assumptions={assumptions}
                    onChange={handleAssumptionChange}
                    onRecalculate={handleRecalculate}
                  />
                  <MultiplesTable data={companyData.multiples} />
                  <NewsPanel news={companyData.news} />
                </div>
              </div>
            )}

            {activeTab === "Financeiros" && (
              <div style={{ maxWidth: 900 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                    Fonte dos financeiros:
                  </span>
                  <div style={{ display: "flex", border: "1px solid #e2e8f0", borderRadius: 6, overflow: "hidden" }}>
                    {(["mock", "cvm"] as const).map((src, i) => (
                      <button
                        key={src}
                        onClick={() => handleSourceChange(src)}
                        style={{
                          padding: "5px 12px", fontSize: 12, fontWeight: 500,
                          background: financialSource === src ? "#2563eb" : "#fff",
                          color: financialSource === src ? "#fff" : "#64748b",
                          border: "none", cursor: "pointer", fontFamily: "inherit",
                          borderRight: i === 0 ? "1px solid #e2e8f0" : "none",
                          transition: "background 0.15s, color 0.15s",
                        }}
                      >
                        {src === "mock" ? "Dados mockados" : "Dados CVM"}
                      </button>
                    ))}
                  </div>
                  {financialSource === "cvm" && cvmLoading && (
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Carregando...</span>
                  )}
                  {financialSource === "cvm" && !cvmLoading && cvmFinancials !== null && cvmFinancials.length === 0 && (
                    <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 500 }}>
                      Dados CVM ainda não disponíveis para este ticker. Usando dados mockados.
                    </span>
                  )}
                </div>
                {!cvmLoading && (
                  <DataSourceNotice
                    sourceMode={financialSource}
                    hasCvmData={cvmFinancials !== null && cvmFinancials.length > 0}
                    quoteSource={marketQuote?.source ?? null}
                  />
                )}
                <HistoricalChart data={activeFinancials} />
                <CvmFinancialsTable ticker={selectedTicker} enabled={true} />
                <div style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                  padding: "14px 18px", fontSize: 12, color: "#94a3b8", lineHeight: 1.6,
                }}>
                  Os dados CVM exibidos acima vêm da DFP anual consolidada e ainda estão em validação. O dashboard principal continuará usando dados mockados até a normalização ser validada.
                </div>
              </div>
            )}

            {activeTab === "Valuation" && sensitivityProps && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 14 }}>
                <div>
                  {financialSource === "cvm" && cvmFinancials && cvmFinancials.length > 0 && (
                    <div style={{
                      fontSize: 11, color: "#1d4ed8", background: "#eff6ff",
                      border: "1px solid #bfdbfe", borderRadius: 6,
                      padding: "5px 10px", marginBottom: 12,
                    }}>
                      Valuation usando fundamentos derivados da DFP/CVM.
                    </div>
                  )}
                  <DcfSummary dcf={dcf} />
                  <SensitivityTable {...sensitivityProps} />
                  <DcfProjectionTable
                    projectedCashFlows={dcf.projectedCashFlows}
                    terminalValue={dcf.terminalValue}
                    pvTerminalValue={dcf.pvTerminalValue}
                  />
                </div>
                <div>
                  <AssumptionsPanel
                    assumptions={assumptions}
                    onChange={handleAssumptionChange}
                    onRecalculate={handleRecalculate}
                  />
                </div>
              </div>
            )}

            {activeTab === "Notícias" && (
              <div style={{ maxWidth: 700 }}>
                <NewsPanel news={companyData.news} />
              </div>
            )}

            {activeTab === "Premissas" && (
              <div style={{ maxWidth: 500 }}>
                <AssumptionsPanel
                  assumptions={assumptions}
                  onChange={handleAssumptionChange}
                  onRecalculate={handleRecalculate}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <EmptyStateView
          ticker={selectedTicker}
          companyName={b3Entry?.companyName ?? selectedTicker}
        />
      )}

      <RecalcToast visible={toastVisible} />
    </div>
  );
}
