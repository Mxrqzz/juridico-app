export function KPICard({ titulo, valor, cor }) {
  return (
    <div className="kpi-card" style={{ borderTop: `4px solid ${cor}` }}>
      <span className="kpi-titulo">{titulo}</span>
      <span className="kpi-valor">{valor}</span>
    </div>
  );
}