import React from "react";

interface Company {
  name: string;
  ticker: string;
  exchange: string;
  sector: string;
  price: number;
  priceChangePct: number;
  marketCap: string;
  enterpriseValue: string;
  currency: string;
  valuationStatus: string;
  upside: number;
}

export default function CompanyHeader({ company }: { company: Company }) {
  const isUp = company.priceChangePct >= 0;
  return (
    <div style={styles.wrap}>
      <div style={styles.left}>
        <div style={styles.logoBox}>
          <div style={styles.wegLogo}>{company.ticker.slice(0, 3)}</div>
        </div>
        <div>
          <div style={styles.nameRow}>
            <h1 style={styles.name}>{company.name}</h1>
            <span style={styles.exchange}>{company.exchange}: {company.ticker}</span>
            <span style={styles.sector}>{company.sector}</span>
            <span style={styles.valuationBadge}>
              <span style={styles.badgeDot}></span>
              {company.valuationStatus}
            </span>
            <span style={styles.upsideBadge}>+{company.upside}% potencial</span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaItem}>Valor de Mercado <strong>{company.marketCap}</strong></span>
            <span style={styles.metaDivider}>/</span>
            <span style={styles.metaItem}>EV <strong>{company.enterpriseValue}</strong></span>
            <span style={styles.metaDivider}>/</span>
            <span style={styles.metaItem}>Moeda <strong>{company.currency}</strong></span>
          </div>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.priceBlock}>
          <div style={styles.priceLabel}>Preço Atual</div>
          <div style={styles.price}>R$ {company.price.toFixed(2).replace(".", ",")}</div>
          <div style={{ ...styles.priceChange, color: isUp ? "#16a34a" : "#dc2626" }}>
            {isUp ? "▲" : "▼"} {Math.abs(company.priceChangePct).toFixed(2).replace(".", ",")}% hoje
          </div>
        </div>
        <div style={styles.actions}>
          <button style={styles.btnSecondary}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ marginRight: 5 }}>
              <path d="M13 8A5 5 0 113 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M3 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Atualizar Dados
          </button>
          <button style={styles.btnPrimary}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ marginRight: 5 }}>
              <path d="M8 2v8M5 7l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Exportar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 24px", background: "#fff", borderBottom: "1px solid #e2e8f0",
    gap: 16,
  },
  left: { display: "flex", alignItems: "center", gap: 14 },
  logoBox: { flexShrink: 0 },
  wegLogo: {
    width: 36, height: 36, borderRadius: 8, background: "#1e40af",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "-0.5px",
  },
  nameRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 },
  name: { margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px" },
  exchange: {
    fontSize: 12, color: "#64748b", background: "#f1f5f9",
    padding: "2px 7px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace",
  },
  sector: {
    fontSize: 11, color: "#64748b", background: "#f8fafc",
    border: "1px solid #e2e8f0", padding: "2px 7px", borderRadius: 4,
  },
  valuationBadge: {
    display: "flex", alignItems: "center", gap: 4, fontSize: 11,
    color: "#0369a1", background: "#e0f2fe", padding: "2px 8px", borderRadius: 20,
    fontWeight: 600,
  },
  badgeDot: { width: 5, height: 5, borderRadius: "50%", background: "#0369a1", display: "inline-block" },
  upsideBadge: {
    fontSize: 11, color: "#15803d", background: "#dcfce7",
    padding: "2px 8px", borderRadius: 20, fontWeight: 600,
  },
  metaRow: { display: "flex", alignItems: "center", gap: 6 },
  metaItem: { fontSize: 12, color: "#64748b" },
  metaDivider: { color: "#cbd5e1", fontSize: 11 },
  right: { display: "flex", alignItems: "center", gap: 20, flexShrink: 0 },
  priceBlock: { textAlign: "right" },
  priceLabel: { fontSize: 10, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 2 },
  price: {
    fontSize: 26, fontWeight: 700, color: "#0f172a",
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-1px",
  },
  priceChange: { fontSize: 12, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" },
  actions: { display: "flex", gap: 8 },
  btnSecondary: {
    display: "flex", alignItems: "center", fontSize: 12, fontWeight: 500,
    padding: "6px 12px", borderRadius: 7, border: "1px solid #e2e8f0",
    background: "#f8fafc", cursor: "pointer", color: "#374151", fontFamily: "inherit",
  },
  btnPrimary: {
    display: "flex", alignItems: "center", fontSize: 12, fontWeight: 500,
    padding: "6px 12px", borderRadius: 7, border: "none",
    background: "#2563eb", cursor: "pointer", color: "#fff", fontFamily: "inherit",
  },
};
