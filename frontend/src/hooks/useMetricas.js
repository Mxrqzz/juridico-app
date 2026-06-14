import { useState, useEffect } from "react";
import { getMetricas } from "../services/api";

export function useMetricas() {
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMetricas()
      .then((res) => {
        setMetricas(res.data.data);
        setError(null);
      })
      .catch(() => setError("Erro ao carregar métricas."))
      .finally(() => setLoading(false));
  }, []);

  return { metricas, loading, error };
}
