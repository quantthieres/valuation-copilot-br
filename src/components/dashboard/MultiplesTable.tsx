import React from "react";
import SectionCard from "./SectionCard";

interface Multiple {
  company: string;
  ticker: string;
  pe: string;
  evEbitda: string;
  evSales: string;
  highlight: boolean;
}

export default function MultiplesTable({ data }: { data: Multiple[] }) {
  return (
    <SectionCard title="Múltiplos Comparáveis" subtitle="Estimativas consenso NTM · Pares B3">
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Empresa</th>
            <th style={{ ...styles.th, textAlign: "right" }}>P/L</th>
            <th style={{ ...styles.th, textAlign: "right" }}>EV/EBITDA</th>
            <th style={{ ...styles.th, textAlign: "right" }}>EV/Sales</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.ticker} style={row.highlight ? styles.highlightRow : {}}>
              <td style={styles.td}>
                <div style={styles.companyCell}>
                  <div style={{
                    ...styles.tickerDot,
                    background: row.highlight ? "#2563eb" : "#e2e8f0",
                    color: row.highlight ? "#fff" : "#64748b",
                  }}>{row.ticker.slice(0, 1)}</div>
                  <div>
                    <div style={{ ...styles.companyName, fontWeight: row.highlight ? 700 : 500 }}>{row.company}</div>
                    <div style={styles.tickerLabel}>{row.ticker}</div>
                  </div>
                </div>
              </td>
              <td style={{ ...styles.tdMono, color: row.highlight ? "#0f172a" : "#374151" }}>{row.pe}</td>
              <td style={{ ...styles.tdMono, color: row.highlight ? "#0f172a" : "#374151" }}>{row.evEbitda}</td>
              <td style={{ ...styles.tdMono, color: row.highlight ? "#0f172a" : "#374151" }}>{row.evSales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}

const styles: Record<string, React.CSSProperties> = {
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th: {
    fontSize: 10, color: "#94a3b8", fontWeight: 600, padding: "0 0 8px",
    textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: "1px solid #e2e8f0",
  },
  td: { padding: "8px 0", verticalAlign: "middle", borderBottom: "1px solid #f8fafc" },
  tdMono: {
    padding: "8px 0", verticalAlign: "middle", textAlign: "right",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500,
    borderBottom: "1px solid #f8fafc",
  },
  highlightRow: { background: "#f8faff" },
  companyCell: { display: "flex", alignItems: "center", gap: 8 },
  tickerDot: {
    width: 26, height: 26, borderRadius: 6, display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700,
  },
  companyName: { fontSize: 12, color: "#0f172a" },
  tickerLabel: { fontSize: 10, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" },
};
