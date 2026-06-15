import { useState, useEffect } from 'react';
import { getAgendamentos } from '../services/api';

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordenacao, setOrdenacao] = useState({ campo: '', direcao: 'asc' });

  const [filters, setFilters] = useState({
    search: '',
    status: 'todos',
    tipo: 'todos',
    realizado: 'todos',
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status !== 'todos') params.status = filters.status;
    if (filters.tipo !== 'todos') params.tipo = filters.tipo;
    if (filters.realizado !== 'todos') params.realizado = filters.realizado;
    params.page = filters.page;
    params.limit = filters.limit;

    getAgendamentos(params)
      .then((res) => {
        setAgendamentos(res.data.data);
        setPagination(res.data.pagination);
        setError(null);
      })
      .catch(() => setError('Erro ao carregar agendamentos.'))
      .finally(() => setLoading(false));
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const ordenar = (lista) => {
    if (!ordenacao.campo) return lista;
    return [...lista].sort((a, b) => {
      const valA = a[ordenacao.campo] ?? '';
      const valB = b[ordenacao.campo] ?? '';
      if (valA < valB) return ordenacao.direcao === 'asc' ? -1 : 1;
      if (valA > valB) return ordenacao.direcao === 'asc' ? 1 : -1;
      return 0;
    });
  };

  return { agendamentos: ordenar(agendamentos), pagination, loading, error, filters, updateFilter, ordenacao, setOrdenacao };
}