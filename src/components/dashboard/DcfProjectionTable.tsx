import React from "react";
import SectionCard from "./SectionCard";
import type { ProjectedYear } from "@/lib/valuation/dcf";

interface Props {
  projectedCashFlows: ProjectedYear[];
  terminalValue:      number;
  pvTerminalValue:    number;
}

function formatBRLBillions(value: number): string {
  const abs = Math.abs(value);
  const str = abs.toFixed(1).replace(".", ",");
  return value < 0 ? `−R$ ${str}B` : `R$ ${str}B`;
}

const HEADERS: { label: string; bold: boolean; align: "center" | "right" }[] = [
  { label: "Ano",       bold: false, align: "center" },
  { label: "Receita",   bold: false, align: "right"  },
  { label: "EBIT",      bold: false, align: "right"  },
  { label: "NOPAT",     bold: false, align: "right"  },
  { label: "D&A",       bold: false, align: "right"  },
  { label: "Capex",     bold: false, align: "right"  },
  { label: "ΔCG",       bold: false, align: "right"  },
  { label: "FCF",       bold: true,  align: "right"  },
  { label: "VP do FCF", bold: true,  align: "right"  },
];

export default function DcfProjectionTable({ projectedCashFlows, terminalValue, pvTerminalValue }: Props) {
  if (!projectedCashFlows.length) {
    return (
      <SectionCard title="Projeção de Fluxo de Caixa" subtitle="Premissas DCF · 10 anos">
        <p style={{ margin: 0, fontSize: 13, color: "#64748b", textAlign: "center", padding: "12px 0" }}>
          Projeção indisponível. Verifique se o WACC é maior que o crescimento terminal.
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Projeção de Fluxo de Caixa"
      subtitle="Premissas DCF · 10 anos · valores em R$ bilhões"
    >
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              {HEADERS.map(h => (
                <th
                  key={h.label}
                  style={{
                    ...styles.th,
                    textAlign: h.align,
                    ...(h.bold ? styles.thHighlight : {}),
                  }}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projectedCashFlows.map((row, idx) => (
              <tr key={row.year} style={{ background: idx % 2 === 0 ? "#fff" : "#fafbfc" }}>
                <td style={styles.tdYear}>{row.year}</td>
                <td style={styles.td}>{formatBRLBillions(row.revenue)}</td>
                <td style={styles.td}>{formatBRLBillions(row.ebit)}</td>
                <td style={styles.td}>{formatBRLBillions(row.nopat)}</td>
                <td style={styles.td}>{formatBRLBillions(row.da)}</td>
                <td style={styles.td}>{formatBRLBillions(row.capex)}</td>
                <td style={styles.td}>{formatBRLBillions(row.deltaNwc)}</td>
                <td style={{ ...styles.td, ...styles.tdHighlight }}>{formatBRLBillions(row.fcf)}</td>
                <td style={{ ...styles.td, ...styles.tdHighlight }}>{formatBRLBillions(row.pvFcf)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>Valor Terminal</span>
          <span style={styles.footerValue}>{formatBRLBillions(terminalValue)}</span>
        </div>
        <div style={styles.footerDivider} />
        <div style={styles.footerItem}>
          <span style={styles.footerLabel}>VP do Valor Terminal</span>
          <span style={styles.footerValue}>{formatBRLBillions(pvTerminalValue)}</span>
        </div>
      </div>
    </SectionCard>
  );
}

const MONO = "'JetBrains Mono', monospace";

const styles: Record<string, React.CSSProperties> = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 12,
    fontFamily: MONO,
    minWidth: 680,
  },
  th: {
    padding: "8px 12px",
    fontSize: 10,
    fontWeight: 600,
    color: "#64748b",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
    fontFamily: "inherit",
  },
  thHighlight: {
    color: "#0f172a",
    background: "#f1f5f9",
  },
  tdYear: {
    padding: "7px 12px",
    textAlign: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
    fontFamily: MONO,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "7px 12px",
    textAlign: "right",
    fontSize: 12,
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
    fontFamily: MONO,
    whiteSpace: "nowrap",
  },
  tdHighlight: {
    fontWeight: 700,
    color: "#0f172a",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid #e2e8f0",
  },
  footerItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  footerLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: 500,
  },
  footerValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    fontFamily: MONO,
  },
  footerDivider: {
    width: 1,
    height: 16,
    background: "#e2e8f0",
    flexShrink: 0,
  },
};
