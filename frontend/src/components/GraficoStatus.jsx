import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CORES = ['#4f8ef7', '#f7a44f', '#f74f4f', '#4ff7a4', '#a44ff7'];

export function GraficoStatus({ dados }) {
  if (!dados || dados.length === 0) return <p className="sem-dados">Sem dados</p>;

  return (
    <div className="grafico-card">
      <h3>Distribuição por Status</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={dados} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
            {dados.map((_, i) => (
              <Cell key={i} fill={CORES[i % CORES.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}