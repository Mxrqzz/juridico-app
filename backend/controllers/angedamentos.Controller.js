const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/agendamentos.json');

// Função para ler os agendamentos do arquivo JSON
function loadData() {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw);
}

// Lista agendamentos com filtros e paginação
exports.getAll = (req, res) => {
    try{
        let data = loadData();

        const{ search, status, tipo, realizado } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        // filtro de busca por texto
        if (search) {
            const q = search.toLowerCase();
            data = data.filter(a =>
            (a.cliente && a.cliente.toLowerCase().includes(q)) ||
            (a.advogado && a.advogado.toLowerCase().includes(q)) ||
            (a.cpf && a.cpf.includes(q)) ||
            (a.organizacao && a.organizacao.toLowerCase().includes(q))
            );
        }
        // filtros especificos
        if (status && status !== 'todos') {
            data = data.filter(a => a.status === status);
        }
        if (tipo && tipo !== 'todos') {
            data = data.filter(a => a.tipo === tipo);
        }
        if (realizado && realizado !== 'todos') {
            data = data.filter(a => a.realizado === realizado);
        }

        // paginação
        const total = data.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const items = data.slice(start, start + limit);

        res.json({
            success: true,
            data: items,
            pagination: { total, page, limit, totalPages }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
};

exports.getMetricas = (req, res) => {
    try {
        const data = loadData();

        const total = data.length;
        const realizados = data.filter(a => a.realizado === 'Sim').length;
        const naoRealizados = data.filter(a => a.realizado === 'Não').length;

        // Agrupo agendamentos por mes
        const porMes = {};
        data.forEach(a => {
            if (a.data) {
                const mes = a.data.substring(0, 7); // apenas ano e mes
                porMes[mes] = (porMes[mes] || 0) + 1;
            }
        });

        const evolucaoMensal = Object.entries(porMes)
        .sort((a, b) => a[0].localeCompare(b[0])) // ordena por mes
        .map(([mes, quantidade]) => ({ mes, quantidade }));

        //Agrupa por status
        const porStatus = {};
        data.forEach(a => {
            const s = a.status || 'Indefinido';
            porStatus[s] = (porStatus[s] || 0) + 1;
        });

        const distribuicaoStatus = Object.entries(porStatus)
        .map(([name, value]) => ({ name, value }));

        const distribuicaoRealizado = [
            { name: 'Realizado', value: realizados },
            { name: 'Não Realizado', value: naoRealizados },
        ];

        res.json({
            success: true,
            data: {
                total,
                realizados,
                naoRealizados,
                evolucaoMensal,
                distribuicaoStatus,
                distribuicaoRealizado
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
};

// Exporta os dados filtrados em CSV
exports.exportar = (req, res) => {
    try {
        let data = loadData();

        const { search, status, tipo, realizado } = req.query;

        if (search) {
            const q = search.toLowerCase();
            data = data.filter(a =>
                (a.cliente && a.cliente.toLowerCase().includes(q)) ||
                (a.advogado && a.advogado.toLowerCase().includes(q)) ||
                (a.cpf && a.cpf.includes(q)) ||
                (a.organizacao && a.organizacao.toLowerCase().includes(q))
            );
        }
        if (status && status !== 'todos') {data = data.filter(a => a.status === status);}
        if (tipo && tipo !== 'todos') {data = data.filter(a => a.tipo === tipo);}
        if (realizado && realizado !== 'todos') {data = data.filter(a => a.realizado === realizado);}

        // Monta o arquivo CSV
        const headers = ['ID', 'Data', 'Hora Início', 'Hora Fim', 'CPF', 'Cliente', 'Organização', 'Advogado', 'Realizado', 'tipo', 'status'];
        const rows = data.map(a => [
            a.id, a.data, a.hora_inicio, a.hora_fim, a.cpf, a.cliente, a.organizacao, a.advogado, a.realizado, a.tipo, a.status
        ]);

        const csv = [headers, ...rows]
        .map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=agendamentos.csv');
        res.send('\uFEFF' + csv);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao exportar' });
    }
};

