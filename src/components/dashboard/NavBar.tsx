"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { B3_UNIVERSE, type B3Company } from "@/data/b3-universe";

const NAV_LINKS = ["Painel", "Metodologia", "Sobre"];

interface NavBarProps {
  onSelectCompany: (ticker: string) => void;
  selectedTicker: string;
}

export default function NavBar({ onSelectCompany, selectedTicker }: NavBarProps) {
  const [query, setQuery]   = useState("");
  const [open, setOpen]     = useState(false);
  const wrapRef             = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return B3_UNIVERSE.filter(c =>
      c.ticker.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.tradingName.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q) ||
      c.subsector.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleSelect(company: B3Company) {
    onSelectCompany(company.ticker);
    setQuery(company.ticker);
    setOpen(false);
  }

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logo}>
        <img
          src="/logo/logo-full.svg"
          alt="Valuation Copilot BR"
          style={styles.logoImg}
        />
      </div>

      {/* Search */}
      <div ref={wrapRef} style={styles.searchWrap}>
        <svg style={styles.searchIcon} width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="#64748b" strokeWidth="1.5"/>
          <path d="M10.5 10.5L14 14" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          style={styles.search}
          value={query}
          placeholder="Buscar ticker ou empresa... Ex: WEGE3, PETR4, VALE3"
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (query) setOpen(true); }}
        />
        {query ? (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            style={styles.clearBtn}
            aria-label="Limpar busca"
          >
            ×
          </button>
        ) : (
          <kbd style={styles.kbdHint}>⌘K</kbd>
        )}

        {/* Dropdown */}
        {open && suggestions.length > 0 && (
          <div style={styles.dropdown}>
            {suggestions.map(c => (
              <button
                key={c.ticker}
                onClick={() => handleSelect(c)}
                style={{
                  ...styles.dropdownItem,
                  background: c.ticker === selectedTicker ? "#f0f9ff" : "transparent",
                }}
              >
                <div style={styles.dropdownLeft}>
                  <span style={styles.dropdownTicker}>{c.ticker}</span>
                  <span style={styles.dropdownName}>{c.tradingName}</span>
                </div>
                <div style={styles.dropdownRight}>
                  <span style={styles.dropdownSector}>{c.sector}</span>
                  <span style={{
                    ...styles.dropdownBadge,
                    background: c.hasMockData ? "#dcfce7" : "#f1f5f9",
                    color:      c.hasMockData ? "#15803d" : "#64748b",
                  }}>
                    {c.hasMockData ? "Disponível" : "Em breve"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Static nav links */}
      <nav style={styles.navLinks}>
        {NAV_LINKS.map((item, i) => (
          <a
            key={item}
            href="#"
            style={{ ...styles.navLink, ...(i === 0 ? styles.navLinkActive : {}) }}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    height: 52,
    background: "#0f172a",
    padding: "0 24px",
    borderBottom: "1px solid #1e293b",
    position: "sticky",
    top: 0,
    zIndex: 100,
    gap: 20,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  logoImg: {
    height: 28,
    width: "auto",
    display: "block",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "0 14px",
    flex: 1,
    maxWidth: 540,
    height: 36,
    margin: "0 auto",
    position: "relative",
  },
  searchIcon: { flexShrink: 0 },
  search: {
    background: "none",
    border: "none",
    outline: "none",
    color: "#cbd5e1",
    fontSize: 13,
    flex: 1,
    fontFamily: "inherit",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#475569",
    fontSize: 18,
    cursor: "pointer",
    padding: "0 2px",
    lineHeight: 1,
    flexShrink: 0,
    fontFamily: "inherit",
  },
  kbdHint: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 4,
    color: "#475569",
    fontSize: 10,
    padding: "1px 5px",
    fontFamily: "inherit",
    flexShrink: 0,
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
    zIndex: 200,
    overflow: "hidden",
    maxHeight: 368,
    overflowY: "auto",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "10px 14px",
    border: "none",
    borderBottom: "1px solid #f1f5f9",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    gap: 12,
  },
  dropdownLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  dropdownTicker: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    fontFamily: "'JetBrains Mono', monospace",
    flexShrink: 0,
    minWidth: 56,
  },
  dropdownName: {
    fontSize: 12,
    color: "#64748b",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  dropdownRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  dropdownSector: {
    fontSize: 11,
    color: "#94a3b8",
    whiteSpace: "nowrap",
  },
  dropdownBadge: {
    fontSize: 10,
    fontWeight: 600,
    padding: "2px 7px",
    borderRadius: 20,
    whiteSpace: "nowrap",
  },
  navLinks: {
    display: "flex",
    gap: 2,
    flexShrink: 0,
  },
  navLink: {
    color: "#94a3b8",
    fontSize: 13,
    padding: "4px 10px",
    borderRadius: 6,
    textDecoration: "none",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  navLinkActive: {
    color: "#f1f5f9",
    background: "#1e293b",
  },
};
