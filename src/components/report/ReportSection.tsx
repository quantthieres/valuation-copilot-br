import React from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function ReportSection({ title, subtitle, children }: Props) {
  return (
    <div className="report-section" style={{
      marginBottom: 18, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden",
    }}>
      <div style={{
        padding: "8px 16px", borderBottom: "1px solid #e8ecf0", background: "#f8fafc",
        display: "flex", alignItems: "baseline", gap: 8,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.6px" }}>
          {title}
        </span>
        {subtitle && (
          <span style={{ fontSize: 10, color: "#94a3b8" }}>{subtitle}</span>
        )}
      </div>
      <div style={{ padding: "14px 16px" }}>{children}</div>
    </div>
  );
}
