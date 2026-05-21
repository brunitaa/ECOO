import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#2e7d32', '#66bb6a', '#a5d6a7', '#29b6f6', '#fbc02d'];

export default function BarChartPanel({ data, dataKey = 'value', labelKey = 'label', color }) {
  if (!data?.length) {
    return <p className="ec-chart-empty">Sin datos para el periodo</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={labelKey} tick={{ fontSize: 11, fill: '#7a9485' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#7a9485' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: '1px solid var(--ec-border)',
            fontSize: 12,
          }}
        />
        <Bar dataKey={dataKey} fill={color || COLORS[0]} radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}