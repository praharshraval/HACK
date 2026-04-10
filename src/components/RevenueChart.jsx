import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ transactions = [], height = 280, rangeMonths = 6 }) {
  // Generate exact trailing months locally
  const data = [];
  const currentDate = new Date();
  
  for (let i = rangeMonths - 1; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = d.toLocaleString('en', { month: 'short' });
    
    // Sum exact payout transactions occurring in that specific month and year
    const revenue = transactions
      .filter(t => t.type === 'payout' && t.status === 'completed')
      .reduce((sum, t) => {
        const tDate = new Date(t.date);
        if (tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear()) {
          return sum + t.amount;
        }
        return sum;
      }, 0);
      
    data.push({ month: monthName, revenue });
  }

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
      <AreaChart data={data}>
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
