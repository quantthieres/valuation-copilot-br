import React from "react";
import SectionCard from "./SectionCard";

interface Props {
  waccVals: number[];
  tgVals: number[];
  matrix: number[][];
  currentPrice: number;
  currentWacc: number;
  currentTg: number;
}

function getColor(v: number, currentPrice: number) {
  const diff = (v - currentPrice) / currentPrice;
  if (diff > 0.15) return { bg: "#dcfce7", text: "#15803d" };
  if (diff > 0.05) return { bg: "#f0fdf4", text: "#16a34a" };
  if (diff > -0.05) return { bg: "#fff", text: "#374151" };
  if (diff > -0.15) return { bg: "#fff7ed", text: "#c2410c" };
  return { bg: "#fef2f2", text: "#b91c1c" };
}

export default function SensitivityTable({ waccVals, tgVals, matrix, currentPrice, currentWacc, currentTg }: Props) {
  return (
    <SectionCard title="Análise de Sensibilidade" subtitle="Valor justo implícito / ação · WACC vs. Crescimento Terminal">
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.cornerTh}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                  <span style={{ color: "#94a3b8" }}>WACC</span>
                  <span style={{ color: "#94a3b8" }}>TC →</span>
                </div>
              </th>
              {tgVals.map(tg => (
                <th key={tg} style={styles.th}>{tg.toFixed(1).replace(".", ",")}%</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {waccVals.map((wacc, wi) => (
              <tr key={wacc}>
                <td style={styles.rowHeader}>{wacc.toFixed(1).replace(".", ",")}%</td>
                {tgVals.map((tg, ti) => {
                  const val = matrix[wi][ti];
                  const { bg, text } = getColor(val, currentPrice);
                  const isBase = Math.abs(wacc - currentWacc) < 0.01 && Math.abs(tg - currentTg) < 0.01;
                  return (
                    <td key={ti} style={{
                      ...styles.cell,
                      background: bg, color: text,
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
            { bg: "#dcfce7", border: "#15803d33", label: ">15% potencial" },
            { bg: "#f0fdf4", border: "#16a34a33", label: "5–15% potencial" },
            { bg: "#fff7ed", border: "#c2410c33", label: "5–15% desconto" },
            { bg: "#fef2f2", border: "#b91c1c33", label: ">15% desconto" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.bg, border: `1px solid ${l.border}` }}></div>
              <span style={{ color: "#64748b" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

const styles: Record<string, React.CSSProperties> = {
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  cornerTh: {
    padding: "6px 10px", background: "#f8fafc", border: "1px solid #e2e8f0",
    fontSize: 10, color: "#64748b", minWidth: 54,
  },
  th: {
    padding: "6px 10px", background: "#f8fafc", border: "1px solid #e2e8f0",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    color: "#374151", textAlign: "center", fontWeight: 600,
  },
  rowHeader: {
    padding: "6px 10px", background: "#f8fafc", border: "1px solid #e2e8f0",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    color: "#374151", fontWeight: 600,
  },
  cell: {
    padding: "6px 10px", border: "1px solid #e2e8f0",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
    textAlign: "center",
  },
};
