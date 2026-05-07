"use client";

export default function ReportPrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 18px", background: "#0f172a", color: "#fff",
        border: "none", borderRadius: 7, fontSize: 13, fontWeight: 500,
        cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.1px",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 5V3h6v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M5 11v2h6v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      Imprimir / Salvar PDF
    </button>
  );
}
