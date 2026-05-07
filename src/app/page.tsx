"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
import { buildPreliminaryCompanyDataFromCvm, isPreliminaryEligible } from "@/lib/cvm/cvm-valuation-builder";
import type { NormalizedFinancials } from "@/lib/cvm/types";
import { getCompanyData, DEFAULT_DATA } from "@/data/companies";
import { B3_UNIVERSE } from "@/data/b3-universe";
import type { MarketDataQuote } from "@/lib/market-data/types";
import { COVERAGE_BADGE, COVERAGE_DESCRIPTION, type CoverageStatus } from "@/data/coverage-types";
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

function EmptyStateView({
  ticker,
  companyName,
  coverageStatus,
  quote,
  quoteLoading,
}: {
  ticker: string;
  companyName: string;
  coverageStatus?: CoverageStatus;
  quote?: MarketDataQuote | null;
  quoteLoading?: boolean;
}) {
  const status = coverageStatus ?? "unavailable";
  const badge = COVERAGE_BADGE[status];
  const description = COVERAGE_DESCRIPTION[status];
  const showQuote = status === "quote_only" && quote != null && !quoteLoading;
  const isUp = (quote?.changePercent ?? 0) >= 0;

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
        padding: "36px 48px", maxWidth: 540,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <div style={{
            background: "#f1f5f9", color: "#475569",
            fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px",
          }}>
            {ticker}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
            background: badge.bg, color: badge.color,
          }}>
            {badge.label}
          </div>
        </div>

        <h2 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
          {companyName}
        </h2>

        <p style={{ margin: "0 0 8px", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
          {description}
        </p>

        {status === "cvm_financials" && (
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
            Os dados financeiros reais da DFP/CVM já estão integrados. O dashboard completo com DCF será habilitado após validação do modelo.
          </p>
        )}

        {status === "sector_specific_model_required" && (
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
            Bancos, seguradoras, FIIs e holdings requerem modelos baseados em dividendos (DDM), ROE implícito ou NAV, que estão em desenvolvimento.
          </p>
        )}

        {status === "unavailable" && (
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
            Este ticker já está no universo de busca. A integração de dados financeiros será adicionada nas próximas etapas.
          </p>
        )}

        {showQuote && (
          <div style={{
            marginTop: 20, padding: "14px 20px",
            background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10,
          }}>
            <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>
              Cotação atual · Fonte: brapi
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-1px" }}>
              R$ {quote!.price.toFixed(2).replace(".", ",")}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: isUp ? "#16a34a" : "#dc2626", fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>
              {isUp ? "▲" : "▼"} {Math.abs(quote!.changePercent ?? 0).toFixed(2).replace(".", ",")}% hoje
            </div>
          </div>
        )}

        {quoteLoading && status === "quote_only" && (
          <div style={{ marginTop: 16, fontSize: 12, color: "#94a3b8" }}>
            Buscando cotação...
          </div>
        )}
      </div>
    </div>
  );
}

function PreliminaryLoadingView({ ticker }: { ticker: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "72px 24px",
    }}>
      <div style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
        padding: "36px 48px", maxWidth: 400, textAlign: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.7px",
          textTransform: "uppercase" as const, color: "#94a3b8", marginBottom: 12,
        }}>
          Buscando dados CVM
        </div>
        <div style={{ fontSize: 14, color: "#374151" }}>
          Carregando demonstrações financeiras para <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>{ticker}</strong>...
        </div>
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
  const [marketQuote, setMarketQuote]       = useState<MarketDataQuote | null>(null);
  const [quoteLoading, setQuoteLoading]     = useState(false);
  const [financialSource, setFinancialSource] = useState<"mock" | "cvm">("mock");
  const [cvmFinancials, setCvmFinancials]   = useState<NormalizedFinancials[] | null>(null);
  const [cvmLoading, setCvmLoading]         = useState(false);

  // ── Preliminary CVM valuation state (for companies without mock data) ──────
  const [preliminaryCvmFinancials, setPreliminaryCvmFinancials] =
    useState<NormalizedFinancials[] | null>(null);
  const [preliminaryLoading, setPreliminaryLoading] = useState(false);
  // Tracks the last ticker for which we initialised assumptions from preliminary data.
  // Prevents re-initialising every time the memo recomputes (e.g. when marketQuote updates).
  const preliminaryInitRef = useRef<string | null>(null);

  // ── Memos ─────────────────────────────────────────────────────────────────
  const companyData = useMemo(() => getCompanyData(selectedTicker), [selectedTicker]);

  const b3Entry = useMemo(
    () => B3_UNIVERSE.find(c => c.ticker === selectedTicker),
    [selectedTicker],
  );

  // Build preliminary data once CVM financials AND brapi quote are both available.
  const preliminaryData = useMemo(() => {
    if (companyData || !preliminaryCvmFinancials) return null;
    if (!b3Entry) return null;
    return buildPreliminaryCompanyDataFromCvm({
      b3Entry,
      cvmFinancials: preliminaryCvmFinancials,
      marketQuote,
    });
  }, [companyData, preliminaryCvmFinancials, marketQuote, b3Entry]);

  // Unified data source used by all dashboard components.
  const effectiveCompanyData = companyData ?? preliminaryData;
  const isPreliminary = !companyData && preliminaryData !== null;

  const activeFundamentals = useMemo(() => {
    if (financialSource === "cvm" && cvmFinancials && cvmFinancials.length > 0 && companyData) {
      return buildCvmFundamentalsFromFinancials(cvmFinancials, companyData.fundamentals);
    }
    return effectiveCompanyData?.fundamentals ?? DEFAULT_DATA.fundamentals;
  }, [financialSource, cvmFinancials, companyData, effectiveCompanyData]);

  const activeFinancials = useMemo(() => {
    if (financialSource === "cvm" && cvmFinancials && cvmFinancials.length > 0) {
      return cvmFinancialsToDashboardFinancials(cvmFinancials);
    }
    return effectiveCompanyData?.financials ?? [];
  }, [financialSource, cvmFinancials, effectiveCompanyData]);

  const activeMetrics = useMemo(() => {
    if (!effectiveCompanyData) return [];
    // CVM metric override applies only for mock companies with CVM toggle active.
    if (companyData && financialSource === "cvm" && cvmFinancials && cvmFinancials.length > 0) {
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
    }
    return effectiveCompanyData.metrics;
  }, [financialSource, cvmFinancials, companyData, effectiveCompanyData]);

  const sensitivityMatrix = useMemo(() => {
    if (!effectiveCompanyData) return [];
    return effectiveCompanyData.waccVals.map(w =>
      effectiveCompanyData.terminalGrowthVals.map(tg => {
        const fv = sensitivityFairValue(assumptions, w, tg, activeFundamentals);
        return Math.round(fv);
      }),
    );
  }, [assumptions, effectiveCompanyData, activeFundamentals]);

  // ── Effects ───────────────────────────────────────────────────────────────

  // Fetch brapi quote for every selected ticker.
  useEffect(() => {
    let cancelled = false;
    setMarketQuote(null);
    setQuoteLoading(true);

    fetch(`/api/market-data/${encodeURIComponent(selectedTicker)}`)
      .then(res => res.json())
      .then((body: { quote: MarketDataQuote | null }) => {
        if (!cancelled) setMarketQuote(body.quote ?? null);
      })
      .catch(() => { /* keep null */ })
      .finally(() => { if (!cancelled) setQuoteLoading(false); });

    return () => { cancelled = true; };
  }, [selectedTicker]);

  // Fetch CVM financials for mock-company CVM-mode toggle.
  // (Preliminary CVM fetch is handled in the effect below.)
  useEffect(() => {
    if (financialSource !== "cvm" || !companyData || cvmFinancials === null) return;
    const fundamentals = cvmFinancials.length > 0
      ? buildCvmFundamentalsFromFinancials(cvmFinancials, companyData.fundamentals)
      : companyData.fundamentals;
    setDcf(recalculateDcf(assumptions, fundamentals, companyData.company.price));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvmFinancials, financialSource]);

  // Fetch CVM financials for eligible tickers that have no mock data.
  useEffect(() => {
    if (companyData || !b3Entry || !isPreliminaryEligible(b3Entry)) {
      setPreliminaryCvmFinancials(null);
      setPreliminaryLoading(false);
      return;
    }

    let cancelled = false;
    setPreliminaryCvmFinancials(null);
    setPreliminaryLoading(true);

    fetch(`/api/cvm/financials/${encodeURIComponent(selectedTicker)}`)
      .then(res => res.json())
      .then((body: { financials: NormalizedFinancials[] }) => {
        if (!cancelled) setPreliminaryCvmFinancials(body.financials ?? []);
      })
      .catch(() => { if (!cancelled) setPreliminaryCvmFinancials([]); })
      .finally(() => { if (!cancelled) setPreliminaryLoading(false); });

    return () => { cancelled = true; };
  }, [selectedTicker, companyData, b3Entry]);

  // Initialise assumptions and DCF once when preliminary data first becomes available.
  useEffect(() => {
    if (!preliminaryData || preliminaryInitRef.current === selectedTicker) return;
    preliminaryInitRef.current = selectedTicker;
    const p = preliminaryData.company.price;
    setAssumptions({ ...preliminaryData.defaultAssumptions });
    setDcf(recalculateDcf(preliminaryData.defaultAssumptions, preliminaryData.fundamentals, p));
  }, [preliminaryData, selectedTicker]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleAssumptionChange(key: keyof Assumptions, val: number) {
    setAssumptions(prev => ({ ...prev, [key]: val }));
  }

  function handleRecalculate() {
    if (!effectiveCompanyData) return;
    setDcf(recalculateDcf(assumptions, activeFundamentals, effectiveCompanyData.company.price));
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  function handleSelectCompany(ticker: string) {
    const data = getCompanyData(ticker);
    setSelected(ticker);
    setFinancialSource("mock");
    setCvmFinancials(null);
    setPreliminaryCvmFinancials(null);
    preliminaryInitRef.current = null;
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

  // ── Derived props ─────────────────────────────────────────────────────────

  const sensitivityProps = effectiveCompanyData ? {
    waccVals:     effectiveCompanyData.waccVals,
    tgVals:       effectiveCompanyData.terminalGrowthVals,
    matrix:       sensitivityMatrix,
    currentPrice: marketQuote?.price ?? effectiveCompanyData.company.price,
    currentWacc:  assumptions.wacc,
    currentTg:    assumptions.terminalGrowth,
  } : null;

  // Show loading spinner while fetching preliminary CVM data or brapi quote
  // for eligible tickers (prevents flash from empty-state → dashboard).
  const showPreliminaryLoading =
    !effectiveCompanyData &&
    b3Entry !== undefined &&
    isPreliminaryEligible(b3Entry) &&
    (preliminaryLoading || quoteLoading);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <NavBar onSelectCompany={handleSelectCompany} selectedTicker={selectedTicker} />

      {effectiveCompanyData ? (
        <>
          <CompanyHeader
            company={effectiveCompanyData.company}
            quote={marketQuote}
            quoteLoading={quoteLoading}
            exportUrl={!isPreliminary
              ? `/relatorio/${selectedTicker}?source=${financialSource}`
              : undefined}
          />
          <MetricsRow metrics={activeMetrics} />

          {/* Preliminary banner replaces the mock-data disclaimer */}
          {isPreliminary ? (
            <div style={{
              padding: "7px 24px", background: "#faf5ff",
              borderBottom: "1px solid #ddd6fe",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
                textTransform: "uppercase" as const,
                color: "#7c3aed", background: "#ede9fe",
                padding: "2px 7px", borderRadius: 4,
              }}>
                Preliminar
              </span>
              <span style={{ fontSize: 12, color: "#6d28d9" }}>
                Valuation preliminar com dados CVM. Os dados vêm da DFP anual consolidada e ainda estão em validação.
              </span>
            </div>
          ) : (
            <div style={{
              padding: "5px 24px", background: "#fff",
              borderBottom: "1px solid #f1f5f9",
              fontSize: 11, color: "#94a3b8", textAlign: "center" as const,
            }}>
              Dados ilustrativos para demonstração. Não constitui recomendação de investimento.
            </div>
          )}

          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

          <div style={{ padding: "18px 24px" }}>

            {/* ── Visão Geral ───────────────────────────────────────────── */}
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
                  <MultiplesTable data={effectiveCompanyData.multiples} />
                  <NewsPanel news={effectiveCompanyData.news} />
                </div>
              </div>
            )}

            {/* ── Financeiros ───────────────────────────────────────────── */}
            {activeTab === "Financeiros" && (
              <div style={{ maxWidth: 900 }}>
                {/* Source toggle — only for mock companies */}
                {!isPreliminary && (
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
                )}

                {isPreliminary ? (
                  <DataSourceNotice
                    sourceMode="preliminary_cvm"
                    quoteSource={marketQuote?.source ?? null}
                  />
                ) : (
                  !cvmLoading && (
                    <DataSourceNotice
                      sourceMode={financialSource}
                      hasCvmData={cvmFinancials !== null && cvmFinancials.length > 0}
                      quoteSource={marketQuote?.source ?? null}
                    />
                  )
                )}

                <HistoricalChart data={activeFinancials} />
                <CvmFinancialsTable ticker={selectedTicker} enabled={true} />

                {!isPreliminary && (
                  <div style={{
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                    padding: "14px 18px", fontSize: 12, color: "#94a3b8", lineHeight: 1.6,
                  }}>
                    Os dados CVM exibidos acima vêm da DFP anual consolidada e ainda estão em validação. O dashboard principal continuará usando dados mockados até a normalização ser validada.
                  </div>
                )}
              </div>
            )}

            {/* ── Valuation ─────────────────────────────────────────────── */}
            {activeTab === "Valuation" && sensitivityProps && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 14 }}>
                <div>
                  {isPreliminary && (
                    <div style={{
                      fontSize: 11, color: "#5b21b6", background: "#faf5ff",
                      border: "1px solid #ddd6fe", borderRadius: 6,
                      padding: "5px 10px", marginBottom: 12,
                    }}>
                      Valuation preliminar com dados CVM. Premissas são estimativas conservadoras e ainda não foram validadas.
                    </div>
                  )}
                  {!isPreliminary && financialSource === "cvm" && cvmFinancials && cvmFinancials.length > 0 && (
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

            {/* ── Notícias ──────────────────────────────────────────────── */}
            {activeTab === "Notícias" && (
              <div style={{ maxWidth: 700 }}>
                <NewsPanel news={effectiveCompanyData.news} />
              </div>
            )}

            {/* ── Premissas ─────────────────────────────────────────────── */}
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
      ) : showPreliminaryLoading ? (
        <PreliminaryLoadingView ticker={selectedTicker} />
      ) : (
        <EmptyStateView
          ticker={selectedTicker}
          companyName={b3Entry?.companyName ?? selectedTicker}
          coverageStatus={b3Entry?.coverageStatus}
          quote={marketQuote}
          quoteLoading={quoteLoading}
        />
      )}

      <RecalcToast visible={toastVisible} />
    </div>
  );
}
