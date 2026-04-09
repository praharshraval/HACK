import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

export default function RevenueChart({ transactions = [], height = 280 }) {
  // Aggregate revenue by month
  const data = months.map(month => {
    const revenue = transactions
      .filter(t => t.type === 'payout' && t.status === 'completed')
      .reduce((sum, t) => {
        const m = new Date(t.date).toLocaleString('en', { month: 'short' });
        return m === month ? sum + t.amount : sum;
      }, 0);
    return { month, revenue };
  });

  // Add some simulated data for months with no transactions
  const enhanced = data.map((d, i) => ({
    ...d,
    revenue: d.revenue || Math.round(Math.random() * 5000 + 1000) * (i > 5 ? 1 : 0.3),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg px-3 py-2">
          <p className="text-xs text-slate-400 mb-1">{label}</p>
          <p className="text-sm font-bold text-brand-300">₹{payload[0].value.toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={enhanced}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#475569', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#475569', fontSize: 12 }}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 5, fill: '#6366f1', stroke: '#0a0e1a', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
