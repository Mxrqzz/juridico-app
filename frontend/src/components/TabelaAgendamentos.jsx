import { useRef } from "react";
import { useAgendamentos } from "../hooks/useAgendamentos";
import { getExportarCSV } from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function TabelaAgendamentos() {
  const { agendamentos, pagination, loading, error, filters, updateFilter } =
    useAgendamentos();
  const searchTimer = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      updateFilter("search", val);
    }, 500);
  };

  const exportarCSV = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status !== "todos") params.status = filters.status;
      if (filters.tipo !== "todos") params.tipo = filters.tipo;
      if (filters.realizado !== "todos") params.realizado = filters.realizado;

      const res = await getExportarCSV(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "agendamentos.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Erro ao exportar CSV.");
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Relatório de Agendamentos", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [
        ["ID", "Data", "Hora", "Cliente", "Advogado", "Realizado", "Status"],
      ],
      body: agendamentos.map((a) => [
        a.id,
        a.data ?? "-",
        `${a.hora_inicio ?? "-"} - ${a.hora_fim ?? "-"}`,
        a.cliente ?? "-",
        a.advogado ?? "-",
        a.realizado ?? "-",
        a.status ?? "-",
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 142, 247] },
    });

    doc.save("agendamentos.pdf");
  };

  return (
    <div className="tabela-container">
      <div className="tabela-header">
        <h3>Agendamentos</h3>
        <div className="tabela-acoes">
          <button className="btn btn-secondary" onClick={exportarCSV}>
            Exportar CSV
          </button>
          <button className="btn btn-secondary" onClick={exportarPDF}>
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="filtros">
        <input
          className="input-busca"
          type="text"
          placeholder="Buscar por cliente, advogado, CPF ou organização..."
          onChange={handleSearchChange}
        />
        <select
          onChange={(e) => updateFilter("realizado", e.target.value)}
          value={filters.realizado}
        >
          <option value="todos">Todos os realizados</option>
          <option value="Sim">Realizado</option>
          <option value="Não">Não Realizado</option>
        </select>
        <select
          onChange={(e) => updateFilter("tipo", e.target.value)}
          value={filters.tipo}
        >
          <option value="todos">Todos os tipos</option>
          <option value="Online">Online</option>
          <option value="Presencial">Presencial</option>
        </select>
        <select
          onChange={(e) => updateFilter("status", e.target.value)}
          value={filters.status}
        >
          <option value="todos">Todos os status</option>
          <option value="Válido">Válido</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {loading && <p className="loading">Carregando...</p>}
      {error && <p className="erro">{error}</p>}

      {!loading && !error && (
        <>
          <div className="tabela-scroll">
            <table className="tabela">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>CPF</th>
                  <th>Advogado</th>
                  <th>Realizado</th>
                  <th>Tipo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="sem-dados">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  agendamentos.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.data ?? "-"}</td>
                      <td>
                        {a.hora_inicio} - {a.hora_fim}
                      </td>
                      <td>{a.cliente}</td>
                      <td>{a.cpf}</td>
                      <td>{a.advogado}</td>
                      <td>
                        <span
                          className={`badge ${a.realizado === "Sim" ? "badge-sim" : a.realizado === "Não" ? "badge-nao" : "badge-vazio"}`}
                        >
                          {a.realizado ?? "N/A"}
                        </span>
                      </td>
                      <td>{a.tipo}</td>
                      <td>
                        <span
                          className={`badge ${a.status === "Válido" ? "badge-sim" : "badge-nao"}`}
                        >
                          {a.status ?? "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="paginacao">
            <span>{pagination.total} registros</span>
            <div className="paginacao-btns">
              <button
                className="btn btn-sm"
                disabled={pagination.page <= 1}
                onClick={() => updateFilter("page", pagination.page - 1)}
              >
                ← Anterior
              </button>
              <span>
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                className="btn btn-sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => updateFilter("page", pagination.page + 1)}
              >
                Próxima →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
