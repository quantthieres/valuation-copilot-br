export default function RecalcToast({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, background: "#0f172a",
      color: "#f1f5f9", fontSize: 12, fontWeight: 600, padding: "8px 14px",
      borderRadius: 8, display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 4px 20px rgba(0,0,0,.25)", zIndex: 1000,
    }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }}></div>
      Valuation atualizado
    </div>
  );
}
