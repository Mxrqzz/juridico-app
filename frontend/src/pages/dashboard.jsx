import { useMetricas } from "../hooks/useMetricas";
import { KPICard } from "../components/KPICard";
import { GraficoStatus } from "../components/GraficoStatus";
import { GraficoEvolucao } from "../components/GraficoEvolucao";
import { TabelaAgendamentos } from "../components/TabelaAgendamentos";

export function Dashboard() {
  const { metricas, loading, error } = useMetricas();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>⚖️ Painel Jurídico</h1>
        <span className="dashboard-subtitulo">Gestão de Atendimentos</span>
      </header>
      <section className="kpi-grid">
        {loading && <p className="loading">Carregando métricas...</p>}
        {error && <p className="erro">{error}</p>}
        {metricas && (
          <>
            <KPICard
              titulo="Total de Atendimentos"
              valor={metricas.total}
              cor="#4f8ef7"
            />
            <KPICard
              titulo="Realizados"
              valor={metricas.realizados}
              cor="#4CAF50"
            />
            <KPICard
              titulo="Não Realizados"
              valor={metricas.naoRealizados}
              cor="#f44336"
            />
            <KPICard
              titulo="Sem Informação"
              valor={metricas.semInfo}
              cor="#ff9800"
            />
          </>
        )}
      </section>

      <section className="graficos-grid">
        {metricas && (
          <>
            <GraficoEvolucao dados={metricas.evolucaoMensal} />
            <GraficoStatus dados={metricas.distribuicaoRealizado} />
          </>
        )}
      </section>

      <section className="tabela-section">
        <TabelaAgendamentos />
      </section>
    </div>
  );
}
