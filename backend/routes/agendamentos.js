const express = require("express");
const router = express.Router();
const controller = require("../controllers/agendamentosController");

// Rota para métricas do dashboard
router.get("/metricas", controller.getMetricas);

// rota para exportar CSV
router.get("/exportar", controller.exportar);

// Rota principal - lista agendamentos com filtros e paginação
router.get("/", controller.getAll);

module.exports = router;
