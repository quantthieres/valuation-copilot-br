"use client";

import React from "react";
import SectionCard from "./SectionCard";
import type { Assumptions } from "@/lib/valuation/dcf";

interface Props {
  assumptions: Assumptions;
  onChange: (key: keyof Assumptions, val: number) => void;
  onRecalculate: () => void;
}

const FIELDS: { key: keyof Assumptions; label: string; suffix: string; min: number; max: number; step: number }[] = [
  { key: "revenueCAGR",    label: "CAGR Receita",        suffix: "%", min: 0,  max: 20, step: 0.1  },
  { key: "ebitMargin",     label: "Margem EBIT",          suffix: "%", min: 10, max: 50, step: 0.5  },
  { key: "taxRate",        label: "Alíquota IR/CS",       suffix: "%", min: 10, max: 40, step: 0.5  },
  { key: "wacc",           label: "WACC",                 suffix: "%", min: 8,  max: 20, step: 0.5  },
  { key: "terminalGrowth", label: "Crescimento Terminal", suffix: "%", min: 1,  max: 7,  step: 0.25 },
  { key: "capexRevenue",   label: "Capex / Receita",      suffix: "%", min: 0,  max: 10, step: 0.1  },
  { key: "nwcChange",      label: "ΔCG / Receita",        suffix: "%", min: 0,  max: 5,  step: 0.1  },
];

export default function AssumptionsPanel({ assumptions, onChange, onRecalculate }: Props) {
  return (
    <SectionCard title="Premissas DCF" subtitle="Edite para recalcular o valuation">
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {FIELDS.map(f => (
          <div key={f.key}>
            <div style={styles.fieldLabel}>{f.label}</div>
            <div style={styles.inputRow}>
              <input
                type="range"
                min={f.min} max={f.max} step={f.step}
                value={assumptions[f.key]}
                onChange={e => onChange(f.key, parseFloat(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.valueBox}>
                <span style={styles.valueText}>{assumptions[f.key].toFixed(1)}{f.suffix}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onRecalculate} style={styles.recalcBtn}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
          <path d="M13 8A5 5 0 113 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Recalcular Valuation
      </button>
    </SectionCard>
  );
}

const styles: Record<string, React.CSSProperties> = {
  fieldLabel: { fontSize: 11, color: "#64748b", marginBottom: 4, fontWeight: 500 },
  inputRow: { display: "flex", alignItems: "center", gap: 10 },
  slider: { flex: 1, accentColor: "#2563eb", cursor: "pointer", height: 3 },
  valueBox: {
    minWidth: 52, background: "#f8fafc", border: "1px solid #e2e8f0",
    borderRadius: 5, padding: "2px 7px", textAlign: "right",
  },
  valueText: { fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#0f172a" },
  recalcBtn: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 600, padding: "9px 0", borderRadius: 8,
    border: "none", background: "#2563eb", color: "#fff",
    cursor: "pointer", fontFamily: "inherit", gap: 2,
  },
};
