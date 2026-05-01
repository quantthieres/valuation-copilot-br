
// ── Nav + Company Header + Metrics Cards · Português ──────────────────────

const NAV_ITEMS = ["Painel", "Carteira", "Relatórios", "Configurações"];
const TABS = ["Visão Geral", "Financeiros", "Valuation", "Notícias", "Premissas"];

function NavBar({ activeTab, onTabChange }) {
  return (
    <header style={navStyles.header}>
      <div style={navStyles.left}>
        <div style={navStyles.logo}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#2563eb"/>
            <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#2563eb" opacity="0.5"/>
            <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#2563eb" opacity="0.5"/>
            <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#2563eb" opacity="0.3"/>
          </svg>
          <span style={navStyles.logoText}>Valuation Copilot</span>
        </div>
        <nav style={navStyles.navLinks}>
          {NAV_ITEMS.map(item => (
            <a key={item} href="#" style={{
              ...navStyles.navLink,
              ...(item === "Painel" ? navStyles.navLinkActive : {})
            }}>{item}</a>
          ))}
        </nav>
      </div>
      <div style={navStyles.center}>
        <div style={navStyles.searchWrap}>
          <svg style={navStyles.searchIcon} width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="#94a3b8" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input style={navStyles.search} placeholder="Buscar ticker ou empresa…" />
          <kbd style={navStyles.kbdHint}>⌘K</kbd>
        </div>
      </div>
      <div style={navStyles.right}>
        <button style={navStyles.iconBtn}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1a5.5 5.5 0 015.5 5.5c0 2.76-.9 4.36-2.06 5.5H4.56C3.4 10.86 2.5 9.26 2.5 6.5A5.5 5.5 0 018 1z" stroke="#64748b" strokeWidth="1.3"/>
            <path d="M6 12.5c0 1.1.9 2 2 2s2-.9 2-2" stroke="#64748b" strokeWidth="1.3"/>
          </svg>
        </button>
        <div style={navStyles.avatar}>JD</div>
      </div>
    </header>
  );
}

function CompanyHeader({ company }) {
  const isUp = company.priceChangePct >= 0;
  return (
    <div style={headerStyles.wrap}>
      <div style={headerStyles.left}>
        <div style={headerStyles.logoBox}>
          {/* WEG logo placeholder */}
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: "#1e40af",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "-0.5px",
            fontFamily: "'DM Sans', sans-serif",
          }}>WEG</div>
        </div>
        <div>
          <div style={headerStyles.nameRow}>
            <h1 style={headerStyles.name}>{company.name}</h1>
            <span style={headerStyles.exchange}>{company.exchange}: {company.ticker}</span>
            <span style={headerStyles.sector}>{company.sector}</span>
            <span style={headerStyles.valuationBadge}>
              <span style={headerStyles.badgeDot}></span>
              {company.valuationStatus}
            </span>
            <span style={headerStyles.upsideBadge}>+{company.upside}% potencial</span>
          </div>
          <div style={headerStyles.metaRow}>
            <span style={headerStyles.metaItem}>Valor de Mercado <strong>{company.marketCap}</strong></span>
            <span style={headerStyles.metaDivider}>/</span>
            <span style={headerStyles.metaItem}>EV <strong>{company.enterpriseValue}</strong></span>
            <span style={headerStyles.metaDivider}>/</span>
            <span style={headerStyles.metaItem}>Moeda <strong>{company.currency}</strong></span>
          </div>
        </div>
      </div>
      <div style={headerStyles.right}>
        <div style={headerStyles.priceBlock}>
          <div style={headerStyles.priceLabel}>Preço Atual</div>
          <div style={headerStyles.price}>R$ {company.price.toFixed(2).replace(".", ",")}</div>
          <div style={{...headerStyles.priceChange, color: isUp ? "#16a34a" : "#dc2626"}}>
            {isUp ? "▲" : "▼"} {Math.abs(company.priceChangePct).toFixed(2).replace(".", ",")}% hoje
          </div>
        </div>
        <div style={headerStyles.actions}>
          <button style={headerStyles.btnSecondary}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{marginRight:5}}>
              <path d="M13 8A5 5 0 113 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M3 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Atualizar Dados
          </button>
          <button style={headerStyles.btnPrimary}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{marginRight:5}}>
              <path d="M8 2v8M5 7l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Exportar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, suffix }) {
  const hasUp = trend !== null && trend > 0;
  const hasDown = trend !== null && trend < 0;
  return (
    <div style={cardStyles.card}>
      <div style={cardStyles.label}>{label}</div>
      <div style={cardStyles.value}>{value}</div>
      <div style={cardStyles.footer}>
        {trend !== null && (
          <span style={{...cardStyles.trend, color: hasUp ? "#16a34a" : hasDown ? "#dc2626" : "#64748b"}}>
            {hasUp ? "▲" : "▼"} {Math.abs(trend).toFixed(1).replace(".", ",")}%
          </span>
        )}
        <span style={cardStyles.suffix}>{suffix}</span>
      </div>
    </div>
  );
}

function MetricsRow({ metrics }) {
  return (
    <div style={cardStyles.row}>
      {metrics.map(m => <MetricCard key={m.label} {...m} />)}
    </div>
  );
}

function TabBar({ activeTab, onTabChange }) {
  return (
    <div style={tabStyles.bar}>
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            ...tabStyles.tab,
            ...(activeTab === tab ? tabStyles.tabActive : {})
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────

const navStyles = {
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: 52, background: "#0f172a", padding: "0 20px",
    borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 100,
    gap: 16,
  },
  left: { display: "flex", alignItems: "center", gap: 28, flex: "0 0 auto" },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoText: { color: "#f1f5f9", fontWeight: 600, fontSize: 14, letterSpacing: "-0.3px", whiteSpace:"nowrap" },
  navLinks: { display: "flex", gap: 2 },
  navLink: {
    color: "#94a3b8", fontSize: 13, padding: "4px 10px", borderRadius: 6,
    textDecoration: "none", fontWeight: 500, transition: "color .15s",
  },
  navLinkActive: { color: "#f1f5f9", background: "#1e293b" },
  center: { flex: 1, display: "flex", justifyContent: "center", maxWidth: 380, margin: "0 auto" },
  searchWrap: {
    display: "flex", alignItems: "center", gap: 8, background: "#1e293b",
    border: "1px solid #334155", borderRadius: 8, padding: "0 12px", width: "100%", height: 32,
  },
  searchIcon: { flexShrink: 0 },
  search: {
    background: "none", border: "none", outline: "none", color: "#94a3b8",
    fontSize: 13, flex: 1, fontFamily: "inherit",
  },
  kbdHint: {
    background: "#0f172a", border: "1px solid #334155", borderRadius: 4,
    color: "#475569", fontSize: 10, padding: "1px 5px", fontFamily: "inherit",
  },
  right: { display: "flex", alignItems: "center", gap: 12, flex: "0 0 auto" },
  iconBtn: {
    background: "none", border: "1px solid #1e293b", borderRadius: 6,
    cursor: "pointer", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
  },
  avatar: {
    width: 30, height: 30, borderRadius: "50%", background: "#2563eb",
    color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  },
};

const headerStyles = {
  wrap: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 24px", background: "#fff", borderBottom: "1px solid #e2e8f0",
    gap: 16,
  },
  left: { display: "flex", alignItems: "center", gap: 14 },
  logoBox: { flexShrink: 0 },
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
  badgeDot: { width: 5, height: 5, borderRadius: "50%", background: "#0369a1", display:"inline-block" },
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

const cardStyles = {
  row: {
    display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 1,
    background: "#e2e8f0", borderBottom: "1px solid #e2e8f0",
  },
  card: {
    background: "#fff", padding: "14px 18px",
    transition: "background .15s", cursor: "default",
  },
  label: { fontSize: 11, color: "#94a3b8", fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.4px" },
  value: {
    fontSize: 18, fontWeight: 700, color: "#0f172a",
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.5px", marginBottom: 4,
  },
  footer: { display: "flex", alignItems: "center", gap: 6 },
  trend: { fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" },
  suffix: { fontSize: 10, color: "#cbd5e1" },
};

const tabStyles = {
  bar: {
    display: "flex", gap: 0, padding: "0 24px", background: "#fff",
    borderBottom: "1px solid #e2e8f0",
  },
  tab: {
    padding: "10px 16px", fontSize: 13, fontWeight: 500, color: "#64748b",
    background: "none", border: "none", borderBottom: "2px solid transparent",
    cursor: "pointer", fontFamily: "inherit", transition: "color .15s",
    marginBottom: -1,
  },
  tabActive: { color: "#2563eb", borderBottom: "2px solid #2563eb" },
};

Object.assign(window, { NavBar, CompanyHeader, MetricsRow, TabBar });
