import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function LineChartPanel({ data, dataKey = 'value', labelKey = 'label' }) {
  if (!data?.length) {
    return <p className="ec-chart-empty">Sin datos para el periodo</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#2e7d32"
          strokeWidth={2.5}
          dot={{ fill: '#2e7d32', r: 4 }}
          activeDot={{ r: 6, fill: '#66bb6a' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}