import React from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export default function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>{title}</div>
          {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div style={styles.body}>{children}</div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
    overflow: "hidden", marginBottom: 14,
  },
  header: {
    display: "flex" as const, alignItems: "flex-start" as const, justifyContent: "space-between" as const,
    padding: "14px 18px 10px", borderBottom: "1px solid #f1f5f9", gap: 12,
  },
  title: { fontSize: 13, fontWeight: 650, color: "#0f172a", letterSpacing: "-0.2px" },
  subtitle: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  body: { padding: "14px 18px" },
};
