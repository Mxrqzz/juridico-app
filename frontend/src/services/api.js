import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const getAgendamentos = (params) => api.get("/agendamentos", { params });

export const getMetricas = () => api.get("/agendamentos/metricas");

export const getExportarCSV = (params) =>
  api.get("/agendamentos/exportar", {
    params,
    responseType: "blob",
  });

export default api;
