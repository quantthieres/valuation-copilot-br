
// ── Charts: Financeiros Históricos, DCF, Sensibilidade ────────────────────
// Pure SVG — sem dependências externas

function SectionCard({ title, subtitle, children, action }) {
  return (
    <div style={sectionStyles.card}>
      <div style={sectionStyles.header}>
        <div>
          <div style={sectionStyles.title}>{title}</div>
          {subtitle && <div style={sectionStyles.subtitle}>{subtitle}</div>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div style={sectionStyles.body}>{children}</div>
    </div>
  );
}

function HistoricalChart({ data }) {
  const [activeMetric, setActiveMetric] = React.useState("all");
  const W = 560, H = 200, PAD = { top: 10, right: 10, bottom: 28, left: 52 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const metrics = [
    { key: "receita", label: "Receita",              color: "#2563eb" },
    { key: "ebitda",  label: "EBITDA",               color: "#0ea5e9" },
    { key: "fcl",     label: "Fluxo de Caixa Livre", color: "#38bdf8" },
  ];

  const visible = activeMetric === "all"
    ? metrics
    : metrics.filter(m => m.key === activeMetric);

  const allVals = data.flatMap(d => visible.map(m => d[m.key]));
  const maxVal = Math.ceil(Math.max(...allVals) / 10) * 10;

  const xStep = chartW / data.length;
  const barGroupW = xStep * 0.72;
  const barW = barGroupW / visible.length;

  const yTicks = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];
  const y = v => chartH - (v / maxVal) * chartH;

  const toggles = [{ key: "all", label: "Todos" }, ...metrics];

  return (
    <SectionCard
      title="Financeiros Históricos"
      subtitle="BRL Bilhões · AF2020–AF2024"
      action={
        <div style={chartStyles.toggleRow}>
          {toggles.map(t => (
            <button key={t.key} onClick={() => setActiveMetric(t.key)} style={{
              ...chartStyles.toggleBtn,
              ...(activeMetric === t.key ? chartStyles.toggleBtnActive : {})
            }}>{t.label}</button>
          ))}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {yTicks.map((v, i) => (
            <g key={i}>
              <line x1={0} y1={y(v)} x2={chartW} y2={y(v)} stroke="#f1f5f9" strokeWidth={1} />
              <text x={-6} y={y(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8"
                fontFamily="JetBrains Mono, monospace">
                {v === 0 ? "" : `R$${v}B`}
              </text>
            </g>
          ))}
          {data.map((d, di) => {
            const groupX = di * xStep + xStep * 0.14;
            return (
              <g key={d.year}>
                {visible.map((m, mi) => {
                  const bx = groupX + mi * barW;
                  const bh = (d[m.key] / maxVal) * chartH;
                  const by = chartH - bh;
                  return (
                    <rect key={m.key} x={bx} y={by} width={barW - 2} height={bh}
                      fill={m.color} rx={2} opacity={0.9}>
                      <title>{m.label}: R${d[m.key]}B</title>
                    </rect>
                  );
                })}
                <text x={groupX + barGroupW / 2} y={chartH + 16}
                  textAnchor="middle" fontSize={11} fill="#94a3b8">{d.year}</text>
              </g>
            );
          })}
        </g>
      </svg>
      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
        {metrics.filter(m => activeMetric === "all" || m.key === activeMetric).map(m => (
          <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: m.color }}></div>
            <span style={{ fontSize: 11, color: "#64748b" }}>{m.label}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function DCFSummary({ dcf }) {
  const rangeMin = 24;
  const rangeMax = 64;
  const pct = v => Math.min(100, Math.max(0, ((v - rangeMin) / (rangeMax - rangeMin)) * 100));

  const rows = [
    { label: "Valor Intrínseco / Ação", value: `R$ ${dcf.intrinsicValue.toFixed(2).replace(".", ",")}`, highlight: true },
    { label: "Preço de Mercado",        value: `R$ ${dcf.currentPrice.toFixed(2).replace(".", ",")}` },
    { label: "Potencial de Alta",       value: `${dcf.impliedUpside > 0 ? "+" : ""}${dcf.impliedUpside.toString().replace(".", ",")}%`, green: dcf.impliedUpside > 0, red: dcf.impliedUpside < 0 },
    { label: "Valor da Firma (EV)",     value: dcf.enterpriseValue },
    { label: "Valor do Patrimônio",     value: dcf.equityValue },
  ];

  const markers = [
    { label: "Pessimista", value: dcf.bearCase,  color: "#ef4444" },
    { label: "Base",       value: dcf.baseCase,  color: "#2563eb" },
    { label: "Otimista",   value: dcf.bullCase,  color: "#16a34a" },
  ];

  return (
    <SectionCard title="Valuation DCF" subtitle="Fluxo de Caixa Descontado · Projeção 10 anos">
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 0, marginBottom: 18 }}>
        {rows.map((r, i) => (
          <React.Fragment key={r.label}>
            <div style={{
              fontSize: 12, color: "#64748b", padding: "6px 0",
              borderBottom: i < rows.length - 1 ? "1px solid #f1f5f9" : "none",
              fontWeight: r.highlight ? 600 : 400,
            }}>{r.label}</div>
            <div style={{
              fontSize: r.highlight ? 16 : 13,
              fontWeight: r.highlight ? 700 : 600,
              color: r.green ? "#16a34a" : r.red ? "#dc2626" : r.highlight ? "#0f172a" : "#374151",
              fontFamily: "'JetBrains Mono', monospace",
              padding: "6px 0", textAlign: "right",
              borderBottom: i < rows.length - 1 ? "1px solid #f1f5f9" : "none",
            }}>{r.value}</div>
          </React.Fragment>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Faixa de Valuation
        </div>
        <div style={{ position: "relative", height: 48, marginBottom: 4 }}>
          <div style={{
            position: "absolute", top: "50%", left: 0, right: 0, height: 5,
            borderRadius: 4, transform: "translateY(-50%)",
            background: "linear-gradient(to right, #fca5a5 0%, #fde68a 40%, #bbf7d0 100%)",
          }}></div>
          {markers.map(m => (
            <div key={m.label} style={{
              position: "absolute", left: `${pct(m.value)}%`,
              transform: "translateX(-50%)", display: "flex",
              flexDirection: "column", alignItems: "center", top: 0,
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: m.color, marginBottom: 1, whiteSpace: "nowrap" }}>{m.label}</div>
              <div style={{ width: 1.5, height: 14, background: m.color }}></div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: m.color, marginTop: 1 }}>
                R${m.value}
              </div>
            </div>
          ))}
          <div style={{
            position: "absolute", left: `${pct(dcf.currentPrice)}%`,
            transform: "translateX(-50%)", top: "30%", display: "flex",
            flexDirection: "column", alignItems: "center",
          }}>
            <div style={{
              width: 11, height: 11, borderRadius: "50%",
              background: "#0f172a", border: "2px solid #fff",
              boxShadow: "0 0 0 1.5px #0f172a",
            }}></div>
            <div style={{ fontSize: 9, color: "#0f172a", fontWeight: 700, marginTop: 2, whiteSpace: "nowrap" }}>
              Atual R${dcf.currentPrice.toFixed(2).replace(".", ",")}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#94a3b8" }}>R${rangeMin}</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#94a3b8" }}>R${rangeMax}</span>
        </div>
      </div>
    </SectionCard>
  );
}

function SensitivityTable({ waccVals, tgVals, matrix, currentPrice }) {
  const getColor = v => {
    const diff = (v - currentPrice) / currentPrice;
    if (diff > 0.15) return { bg: "#dcfce7", text: "#15803d" };
    if (diff > 0.05) return { bg: "#f0fdf4", text: "#16a34a" };
    if (diff > -0.05) return { bg: "#fff", text: "#374151" };
    if (diff > -0.15) return { bg: "#fff7ed", text: "#c2410c" };
    return { bg: "#fef2f2", text: "#b91c1c" };
  };

  return (
    <SectionCard title="Análise de Sensibilidade" subtitle="Valor justo implícito / ação · WACC vs. Crescimento Terminal">
      <div style={{ overflowX: "auto" }}>
        <table style={sensStyles.table}>
          <thead>
            <tr>
              <th style={sensStyles.cornerTh}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                  <span style={{ color: "#94a3b8" }}>WACC</span>
                  <span style={{ color: "#94a3b8" }}>TC →</span>
                </div>
              </th>
              {tgVals.map(tg => (
                <th key={tg} style={sensStyles.th}>{tg.toFixed(1).replace(".", ",")}%</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {waccVals.map((wacc, wi) => (
              <tr key={wacc}>
                <td style={sensStyles.rowHeader}>{wacc.toFixed(1).replace(".", ",")}%</td>
                {tgVals.map((tg, ti) => {
                  const val = matrix[wi][ti];
                  const { bg, text } = getColor(val);
                  const isBase = wacc === 12.0 && tg === 4.0;
                  return (
                    <td key={ti} style={{
                      ...sensStyles.cell,
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

const sectionStyles = {
  card: {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
    overflow: "hidden", marginBottom: 14,
  },
  header: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    padding: "14px 18px 10px", borderBottom: "1px solid #f1f5f9", gap: 12,
  },
  title: { fontSize: 13, fontWeight: 650, color: "#0f172a", letterSpacing: "-0.2px" },
  subtitle: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  body: { padding: "14px 18px" },
};

const chartStyles = {
  toggleRow: { display: "flex", gap: 2 },
  toggleBtn: {
    fontSize: 11, padding: "3px 8px", borderRadius: 5, border: "1px solid #e2e8f0",
    background: "#f8fafc", cursor: "pointer", color: "#64748b", fontFamily: "inherit",
  },
  toggleBtnActive: { background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", fontWeight: 600 },
};

const sensStyles = {
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

Object.assign(window, { SectionCard, HistoricalChart, DCFSummary, SensitivityTable });
