
// ── Right Panel: Assumptions, Multiples, News ─────────────────────────────

const CATEGORY_COLORS = {
  "Resultado":       { bg: "#eff6ff", text: "#1d4ed8" },
  "Fato Relevante":  { bg: "#fef3c7", text: "#92400e" },
  "Comunicado":      { bg: "#f0fdf4", text: "#166534" },
  "Proventos":       { bg: "#fdf4ff", text: "#7e22ce" },
  "Macro":           { bg: "#f5f3ff", text: "#6d28d9" },
  "Regulação":       { bg: "#fff7ed", text: "#c2410c" },
};

// ── Assumptions Panel ────────────────────────────────────────────────────
function AssumptionsPanel({ assumptions, onChange, onRecalculate }) {
  const fields = [
    { key: "revenueCAGR",    label: "CAGR Receita",        suffix: "%", min: 0,  max: 20,  step: 0.1 },
    { key: "ebitMargin",     label: "Margem EBIT",          suffix: "%", min: 10, max: 50,  step: 0.5 },
    { key: "taxRate",        label: "Alíquota IR/CS",       suffix: "%", min: 10, max: 40,  step: 0.5 },
    { key: "wacc",           label: "WACC",                 suffix: "%", min: 8,  max: 20,  step: 0.5 },
    { key: "terminalGrowth", label: "Crescimento Terminal", suffix: "%", min: 1,  max: 7,   step: 0.25 },
    { key: "capexRevenue",   label: "Capex / Receita",      suffix: "%", min: 0,  max: 10,  step: 0.1 },
    { key: "nwcChange",      label: "ΔCG / Receita",        suffix: "%", min: 0,  max: 5,   step: 0.1 },
  ];

  return (
    <SectionCard title="Premissas DCF" subtitle="Edite para recalcular o valuation">
      <div style={assumpStyles.grid}>
        {fields.map(f => (
          <div key={f.key} style={assumpStyles.row}>
            <div style={assumpStyles.fieldLabel}>{f.label}</div>
            <div style={assumpStyles.inputRow}>
              <input
                type="range"
                min={f.min} max={f.max} step={f.step}
                value={assumptions[f.key]}
                onChange={e => onChange(f.key, parseFloat(e.target.value))}
                style={assumpStyles.slider}
              />
              <div style={assumpStyles.valueBox}>
                <span style={assumpStyles.valueText}>{assumptions[f.key].toFixed(1)}{f.suffix}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onRecalculate} style={assumpStyles.recalcBtn}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
          <path d="M13 8A5 5 0 113 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Recalcular Valuation
      </button>
    </SectionCard>
  );
}

// ── Multiples Table ──────────────────────────────────────────────────────
function MultiplesTable({ data }) {
  return (
    <SectionCard title="Múltiplos Comparáveis" subtitle="Estimativas consenso NTM · Pares B3">
      <table style={multiplesStyles.table}>
        <thead>
          <tr>
            <th style={multiplesStyles.th}>Empresa</th>
            <th style={{ ...multiplesStyles.th, textAlign: "right" }}>P/L</th>
            <th style={{ ...multiplesStyles.th, textAlign: "right" }}>EV/EBITDA</th>
            <th style={{ ...multiplesStyles.th, textAlign: "right" }}>EV/Sales</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.ticker} style={row.highlight ? multiplesStyles.highlightRow : {}}>
              <td style={multiplesStyles.td}>
                <div style={multiplesStyles.companyCell}>
                  <div style={{
                    ...multiplesStyles.tickerDot,
                    background: row.highlight ? "#2563eb" : "#e2e8f0",
                    color: row.highlight ? "#fff" : "#64748b",
                  }}>{row.ticker.slice(0,1)}</div>
                  <div>
                    <div style={{ ...multiplesStyles.companyName, fontWeight: row.highlight ? 700 : 500 }}>
                      {row.company}
                    </div>
                    <div style={multiplesStyles.tickerLabel}>{row.ticker}</div>
                  </div>
                </div>
              </td>
              <td style={{ ...multiplesStyles.tdMono, color: row.highlight ? "#0f172a" : "#374151" }}>{row.pe}</td>
              <td style={{ ...multiplesStyles.tdMono, color: row.highlight ? "#0f172a" : "#374151" }}>{row.evEbitda}</td>
              <td style={{ ...multiplesStyles.tdMono, color: row.highlight ? "#0f172a" : "#374151" }}>{row.evSales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}

// ── News Panel ────────────────────────────────────────────────────────────
function NewsPanel({ news }) {
  return (
    <SectionCard title="Documentos e Notícias Relevantes" subtitle="WEGE3 · Documentos CVM, fatos relevantes e notícias">
      <div style={newsStyles.list}>
        {news.map((item, i) => {
          const colors = CATEGORY_COLORS[item.category] || { bg: "#f1f5f9", text: "#374151" };
          return (
            <div key={i} style={{ ...newsStyles.item, borderBottom: i < news.length - 1 ? "1px solid #f1f5f9" : "none" }}>
              <div style={newsStyles.topRow}>
                <span style={newsStyles.source}>{item.source}</span>
                <span style={newsStyles.dot}>·</span>
                <span style={newsStyles.date}>{item.date}</span>
                <span style={{ ...newsStyles.badge, background: colors.bg, color: colors.text }}>
                  {item.category}
                </span>
              </div>
              <div style={newsStyles.title}>{item.title}</div>
              <a href="#" style={newsStyles.readMore}>Ler documento →</a>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ── Recalculation Flash ──────────────────────────────────────────────────
function RecalcToast({ visible }) {
  if (!visible) return null;
  return (
    <div style={toastStyles.wrap}>
      <div style={toastStyles.dot}></div>
      Valuation atualizado
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────

const assumpStyles = {
  grid: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 },
  row: {},
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

const multiplesStyles = {
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

const newsStyles = {
  list: { display: "flex", flexDirection: "column" },
  item: { padding: "10px 0" },
  topRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 5 },
  source: { fontSize: 11, fontWeight: 600, color: "#374151" },
  dot: { color: "#cbd5e1", fontSize: 10 },
  date: { fontSize: 11, color: "#94a3b8" },
  badge: {
    fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 20, marginLeft: "auto",
  },
  title: { fontSize: 13, color: "#0f172a", lineHeight: 1.45, fontWeight: 500, marginBottom: 4 },
  readMore: { fontSize: 11, color: "#2563eb", textDecoration: "none", fontWeight: 500 },
};

const toastStyles = {
  wrap: {
    position: "fixed", bottom: 24, right: 24, background: "#0f172a",
    color: "#f1f5f9", fontSize: 12, fontWeight: 600, padding: "8px 14px",
    borderRadius: 8, display: "flex", alignItems: "center", gap: 8,
    boxShadow: "0 4px 20px rgba(0,0,0,.25)", zIndex: 1000,
  },
  dot: { width: 7, height: 7, borderRadius: "50%", background: "#4ade80" },
};

Object.assign(window, { AssumptionsPanel, MultiplesTable, NewsPanel, RecalcToast });
