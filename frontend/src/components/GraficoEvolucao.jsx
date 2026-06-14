import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

export function GraficoEvolucao({ dados }) {
  if (!dados || dados.length === 0) return <p className="sem-dados">Sem dados</p>;

  return (
    <div className="grafico-card">
      <h3>Evolução Mensal de Atendimentos</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="quantidade" stroke="#4f8ef7" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}