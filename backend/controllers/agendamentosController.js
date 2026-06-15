const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/agendamentos.json");

function loadData() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  const json = JSON.parse(raw);
  const lista = json.Agendamentos || json;

  return lista.map((a) => ({
    id: a["Código do agendamento"],
    data: a["Data do agendamento"]
      ? a["Data do agendamento"].substring(0, 10)
      : null,
    hora_inicio: a["Hora início"],
    hora_fim: a["Hora fim"],
    cpf: a["CPF do assistido"],
    cliente: a["Nome do assistido"],
    organizacao: a["Organização"],
    servico: a["Serviço"],
    local: a["Local"],
    advogado: a["Responsável pelo agendamento"],
    realizado: a["Agendamento realizado"],
    tipo: a["Tipo"],
    status: a["Status"],
  }));
}

exports.getAll = (req, res) => {
  try {
    if (req.query.page && isNaN(parseInt(req.query.page))) {
      return res.status(400).json({ success: false, message: 'Parâmetro page inválido.' });
    }
    if (req.query.limit && isNaN(parseInt(req.query.limit))) {
      return res.status(400).json({ success: false, message: 'Parâmetro limit inválido.' });
    }

    let data = loadData();
    const { search, status, tipo, realizado } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (a) =>
          (a.cliente && a.cliente.toLowerCase().includes(q)) ||
          (a.advogado && a.advogado.toLowerCase().includes(q)) ||
          (a.cpf && a.cpf.includes(q)) ||
          (a.organizacao && a.organizacao.toLowerCase().includes(q)),
      );
    }
    if (status && status !== 'todos') data = data.filter((a) => a.status === status);
    if (tipo && tipo !== 'todos') data = data.filter((a) => a.tipo === tipo);
    if (realizado && realizado !== 'todos') data = data.filter((a) => a.realizado === realizado);

    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = data.slice(start, start + limit);

    res.json({
      success: true,
      data: items,
      pagination: { total, page, limit, totalPages },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};
exports.getMetricas = (req, res) => {
  try {
    const data = loadData();

    const total = data.length;
    const realizados = data.filter((a) => a.realizado === "Sim").length;
    const naoRealizados = data.filter((a) => a.realizado === "Não").length;
    const semInfo = data.filter((a) => !a.realizado).length;
    const receitaTotal = data.reduce((acc, a) => acc + (a.receita || 0), 0);

    const porMes = {};
    data.forEach((a) => {
      if (a.data) {
        const mes = a.data.substring(0, 7);
        porMes[mes] = (porMes[mes] || 0) + 1;
      }
    });

    const evolucaoMensal = Object.entries(porMes)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([mes, quantidade]) => ({ mes, quantidade }));

    const porStatus = {};
    data.forEach((a) => {
      const s = a.status || "Indefinido";
      porStatus[s] = (porStatus[s] || 0) + 1;
    });

    const distribuicaoStatus = Object.entries(porStatus).map(
      ([name, value]) => ({ name, value }),
    );

    const distribuicaoRealizado = [
      { name: "Realizado", value: realizados },
      { name: "Não Realizado", value: naoRealizados },
      { name: "Sem informação", value: semInfo },
    ];

    res.json({
      success: true,
      data: {
        total,
        realizados,
        naoRealizados,
        semInfo,
        evolucaoMensal,
        distribuicaoStatus,
        distribuicaoRealizado,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor" });
  }
};

exports.exportar = (req, res) => {
  try {
    let data = loadData();
    const { search, status, tipo, realizado } = req.query;

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (a) =>
          (a.cliente && a.cliente.toLowerCase().includes(q)) ||
          (a.advogado && a.advogado.toLowerCase().includes(q)) ||
          (a.cpf && a.cpf.includes(q)) ||
          (a.organizacao && a.organizacao.toLowerCase().includes(q)),
      );
    }
    if (status && status !== "todos")
      data = data.filter((a) => a.status === status);
    if (tipo && tipo !== "todos") data = data.filter((a) => a.tipo === tipo);
    if (realizado && realizado !== "todos")
      data = data.filter((a) => a.realizado === realizado);

    const headers = [
      "ID",
      "Data",
      "Hora Início",
      "Hora Fim",
      "CPF",
      "Cliente",
      "Organização",
      "Advogado",
      "Realizado",
      "Tipo",
      "Status",
    ];
    const rows = data.map((a) => [
      a.id,
      a.data,
      a.hora_inicio,
      a.hora_fim,
      a.cpf,
      a.cliente,
      a.organizacao,
      a.advogado,
      a.realizado,
      a.tipo,
      a.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=agendamentos.csv",
    );
    res.send("\uFEFF" + csv);
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao exportar" });
  }
};
