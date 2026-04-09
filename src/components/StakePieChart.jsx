import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#06b6d4', '#a855f7', '#f59e0b', '#22c55e', '#ef4444', '#ec4899', '#3b82f6'];

export default function StakePieChart({ contributions, investments, size = 280 }) {
  // Build pie data from contributions + investors
  const contribData = contributions.map((c, i) => ({
    name: c.role || `Contributor ${i + 1}`,
    value: c.stakePercent || 0,
    type: 'contributor',
  }));

  const investorData = investments.map(inv => ({
    name: 'Investor',
    value: inv.stakePercent || 0,
    type: 'investor',
  }));

  const data = [...contribData, ...investorData].filter(d => d.value > 0);

  // Group by type for summary
  const totalContributor = contribData.reduce((s, d) => s + d.value, 0);
  const totalInvestor = investorData.reduce((s, d) => s + d.value, 0);
  const unallocated = Math.max(0, 100 - totalContributor - totalInvestor);

  const summaryData = [
    { name: 'Contributors', value: totalContributor, color: '#6366f1' },
    { name: 'Investors', value: totalInvestor, color: '#f59e0b' },
  ];
  if (unallocated > 0) {
    summaryData.push({ name: 'Unallocated', value: unallocated, color: '#1e293b' });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg px-3 py-2">
          <p className="text-sm font-medium text-slate-200">{payload[0].name}</p>
          <p className="text-sm text-brand-400 font-bold">{payload[0].value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={size}>
        <PieChart>
          {/* Outer ring — detailed */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={size / 2 - 10}
            innerRadius={size / 2 - 40}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(0 0 4px rgba(99,102,241,0.3))' }} />
            ))}
          </Pie>
          {/* Inner ring — summary */}
          <Pie
            data={summaryData}
            cx="50%"
            cy="50%"
            outerRadius={size / 2 - 48}
            innerRadius={size / 2 - 68}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {summaryData.map((entry, index) => (
              <Cell key={index} fill={entry.color} opacity={0.6} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {summaryData.filter(d => d.value > 0).map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-slate-400">{d.name}</span>
            <span className="text-xs font-bold text-slate-300">{d.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
