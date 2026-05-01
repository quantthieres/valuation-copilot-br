import React from "react";
import SectionCard from "./SectionCard";
import type { DcfResult } from "@/lib/valuation/dcf";

export default function DcfSummary({ dcf }: { dcf: DcfResult }) {
  const rangeMin = dcf.valid
    ? parseFloat((Math.min(dcf.bearCase, dcf.currentPrice) * 0.85).toFixed(0))
    : 0;
  const rangeMax = dcf.valid
    ? parseFloat((dcf.bullCase * 1.10).toFixed(0))
    : 1;

  const pct = (v: number) =>
    Math.min(100, Math.max(0, ((v - rangeMin) / (rangeMax - rangeMin)) * 100));

  if (!dcf.valid) {
    return (
      <SectionCard title="Valuation DCF" subtitle="Fluxo de Caixa Descontado · Projeção 10 anos">
        <div style={{ padding: "24px 0", textAlign: "center", color: "#dc2626", fontSize: 13, fontWeight: 500 }}>
          WACC deve ser maior que o crescimento terminal.
        </div>
      </SectionCard>
    );
  }

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
              color: (r as { green?: boolean }).green ? "#16a34a" : (r as { red?: boolean }).red ? "#dc2626" : r.highlight ? "#0f172a" : "#374151",
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
