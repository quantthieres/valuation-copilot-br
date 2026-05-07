"use client";

import { useEffect, useState } from "react";
import SectionCard from "./SectionCard";
import type { NormalizedFinancials } from "@/lib/cvm/types";

interface CvmApiResponse {
  ticker: string;
  source: string;
  error?: string;
  financials: NormalizedFinancials[];
}

interface Props {
  ticker: string;
  enabled: boolean;
}

function fmtBRL(val: number | undefined): string {
  if (val === undefined || val === null) return "—";
  const abs = Math.abs(val);
  const formatted = abs.toFixed(1).replace(".", ",");
  return val < 0 ? `R$ -${formatted}B` : `R$ ${formatted}B`;
}

const COLS: { label: string; key: keyof NormalizedFinancials }[] = [
  { label: "Ano",           key: "fiscalYear" },
  { label: "Receita",       key: "revenue" },
  { label: "EBIT",          key: "ebit" },
  { label: "Lucro Líquido", key: "netIncome" },
  { label: "CFO",           key: "operatingCashFlow" },
  { label: "Capex",         key: "capex" },
  { label: "FCF",           key: "freeCashFlow" },
  { label: "Caixa",         key: "cash" },
  { label: "Dívida Total",  key: "totalDebt" },
  { label: "Dívida Líquida",key: "netDebt" },
];

export default function CvmFinancialsTable({ ticker, enabled }: Props) {
  const [data, setData]       = useState<NormalizedFinancials[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setData(null);
    setError(null);
    setLoading(true);

    fetch(`/api/cvm/financials/${encodeURIComponent(ticker)}`)
      .then(res => res.json())
      .then((body: CvmApiResponse) => {
        if (cancelled) return;
        if (body.error) {
          setData([]);
        } else {
          setData(body.financials ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Erro ao buscar dados CVM.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [ticker, enabled]);

  let content: React.ReactNode;

  if (!enabled) {
    content = null;
  } else if (loading) {
    content = (
      <div style={styles.state}>Carregando dados CVM...</div>
    );
  } else if (error) {
    content = (
      <div style={{ ...styles.state, color: "#ef4444" }}>{error}</div>
    );
  } else if (!data || data.length === 0) {
    content = (
      <div style={styles.state}>
        Dados CVM ainda não disponíveis para este ticker.
      </div>
    );
  } else {
    content = (
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              {COLS.map(col => (
                <th key={col.key} style={col.key === "fiscalYear" ? styles.thYear : styles.th}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.fiscalYear} style={styles.tr}>
                {COLS.map(col => (
                  <td
                    key={col.key}
                    style={col.key === "fiscalYear" ? styles.tdYear : styles.td}
                  >
                    {col.key === "fiscalYear"
                      ? row.fiscalYear
                      : fmtBRL(row[col.key] as number | undefined)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!enabled) return null;

  return (
    <SectionCard
      title="Dados CVM — DFP Anual"
      subtitle={`Fonte: CVM Dados Abertos · ${ticker}`}
    >
      {content}
    </SectionCard>
  );
}

const styles = {
  state: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center" as const,
    padding: "20px 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 12,
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  },
  th: {
    textAlign: "right" as const,
    padding: "6px 10px",
    color: "#64748b",
    fontWeight: 600,
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap" as const,
  },
  thYear: {
    textAlign: "left" as const,
    padding: "6px 10px",
    color: "#64748b",
    fontWeight: 600,
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap" as const,
  },
  td: {
    textAlign: "right" as const,
    padding: "6px 10px",
    color: "#0f172a",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap" as const,
  },
  tdYear: {
    textAlign: "left" as const,
    padding: "6px 10px",
    color: "#475569",
    fontWeight: 600,
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap" as const,
  },
  tr: {
    transition: "background 0.1s",
  },
};
