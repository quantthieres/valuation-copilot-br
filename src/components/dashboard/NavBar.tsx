"use client";

import React from "react";

const NAV_LINKS = ["Painel", "Metodologia", "Sobre"];

export default function NavBar() {
  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logo}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#2563eb"/>
          <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#2563eb" opacity="0.5"/>
          <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#2563eb" opacity="0.5"/>
          <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#2563eb" opacity="0.3"/>
        </svg>
        <span style={styles.logoText}>Valuation Copilot</span>
      </div>

      {/* Search — main action */}
      <div style={styles.searchWrap}>
        <svg style={styles.searchIcon} width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="#64748b" strokeWidth="1.5"/>
          <path d="M10.5 10.5L14 14" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          style={styles.search}
          placeholder="Buscar ticker ou empresa... Ex: WEGE3, PETR4, VALE3"
        />
        <kbd style={styles.kbdHint}>⌘K</kbd>
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
    gap: 8,
    flexShrink: 0,
  },
  logoText: {
    color: "#f1f5f9",
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: "-0.3px",
    whiteSpace: "nowrap",
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
