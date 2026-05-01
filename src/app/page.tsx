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
import {
  COMPANY, METRICS, FINANCIALS,
  WACC_VALS, TG_VALS,
  DEFAULT_ASSUMPTIONS, MULTIPLES, NEWS,
} from "@/data/wege3";
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

export default function Home() {
  const [activeTab, setActiveTab]     = useState("Visão Geral");
  const [assumptions, setAssumptions] = useState<Assumptions>({ ...DEFAULT_ASSUMPTIONS });
  const [toastVisible, setToastVisible] = useState(false);
  const [dcf, setDcf] = useState<DcfResult>(() => recalculateDcf({ ...DEFAULT_ASSUMPTIONS }));

  // Sensitivity matrix recomputed whenever assumptions change
  const sensitivityMatrix = useMemo(() =>
    WACC_VALS.map(w =>
      TG_VALS.map(tg => {
        const fv = sensitivityFairValue(assumptions, w, tg);
        return Math.round(fv);
      })
    ),
    [assumptions]
  );

  const handleAssumptionChange = (key: keyof Assumptions, val: number) => {
    setAssumptions(prev => ({ ...prev, [key]: val }));
  };

  const handleRecalculate = () => {
    setDcf(recalculateDcf(assumptions));
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const sensitivityProps = {
    waccVals: WACC_VALS,
    tgVals: TG_VALS,
    matrix: sensitivityMatrix,
    currentPrice: COMPANY.price,
    currentWacc: assumptions.wacc,
    currentTg: assumptions.terminalGrowth,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <NavBar />
      <CompanyHeader company={COMPANY} />
      <MetricsRow metrics={METRICS} />

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
              <HistoricalChart data={FINANCIALS} />
              <DcfSummary dcf={dcf} />
              <SensitivityTable {...sensitivityProps} />
            </div>
            <div>
              <AssumptionsPanel assumptions={assumptions} onChange={handleAssumptionChange} onRecalculate={handleRecalculate} />
              <MultiplesTable data={MULTIPLES} />
              <NewsPanel news={NEWS} />
            </div>
          </div>
        )}

        {activeTab === "Financeiros" && (
          <div style={{ maxWidth: 900 }}>
            <HistoricalChart data={FINANCIALS} />
            <div style={{
              marginTop: 14, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
              padding: "20px 24px", fontSize: 13, color: "#64748b", textAlign: "center",
            }}>
              Demonstrativos financeiros completos (DRE, Balanço Patrimonial, DFC) em breve.
            </div>
          </div>
        )}

        {activeTab === "Valuation" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 14 }}>
            <div>
              <DcfSummary dcf={dcf} />
              <SensitivityTable {...sensitivityProps} />
            </div>
            <div>
              <AssumptionsPanel assumptions={assumptions} onChange={handleAssumptionChange} onRecalculate={handleRecalculate} />
            </div>
          </div>
        )}

        {activeTab === "Notícias" && (
          <div style={{ maxWidth: 700 }}>
            <NewsPanel news={NEWS} />
          </div>
        )}

        {activeTab === "Premissas" && (
          <div style={{ maxWidth: 500 }}>
            <AssumptionsPanel assumptions={assumptions} onChange={handleAssumptionChange} onRecalculate={handleRecalculate} />
          </div>
        )}
      </div>

      <RecalcToast visible={toastVisible} />
    </div>
  );
}
