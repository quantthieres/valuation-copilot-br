"use client";

import { useState, useMemo } from "react";
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
import { getCompanyData, DEFAULT_DATA } from "@/data/companies";
import { B3_UNIVERSE } from "@/data/b3-universe";
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

  const companyData = useMemo(() => getCompanyData(selectedTicker), [selectedTicker]);

  const sensitivityMatrix = useMemo(() => {
    if (!companyData) return [];
    return companyData.waccVals.map(w =>
      companyData.terminalGrowthVals.map(tg => {
        const fv = sensitivityFairValue(assumptions, w, tg, companyData.fundamentals);
        return Math.round(fv);
      })
    );
  }, [assumptions, companyData]);

  function handleAssumptionChange(key: keyof Assumptions, val: number) {
    setAssumptions(prev => ({ ...prev, [key]: val }));
  }

  function handleRecalculate() {
    if (!companyData) return;
    setDcf(recalculateDcf(assumptions, companyData.fundamentals, companyData.company.price));
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  function handleSelectCompany(ticker: string) {
    const data = getCompanyData(ticker);
    setSelected(ticker);
    if (data) {
      const newAssumptions = { ...data.defaultAssumptions };
      setAssumptions(newAssumptions);
      setDcf(recalculateDcf(newAssumptions, data.fundamentals, data.company.price));
    }
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
          <CompanyHeader company={companyData.company} />
          <MetricsRow metrics={companyData.metrics} />

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
                  <HistoricalChart data={companyData.financials} />
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
                <HistoricalChart data={companyData.financials} />
                <div style={{
                  marginTop: 14, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                  padding: "20px 24px", fontSize: 13, color: "#64748b", textAlign: "center",
                }}>
                  Demonstrativos financeiros completos (DRE, Balanço Patrimonial, DFC) em breve.
                </div>
              </div>
            )}

            {activeTab === "Valuation" && sensitivityProps && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 14 }}>
                <div>
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
