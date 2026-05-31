import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useESGReports } from '@/hooks/useESGReports';

const tooltipStyle = {
  contentStyle: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--bg-raised)',
    borderRadius: 6,
    fontSize: 12,
    color: 'var(--text-hi)',
  },
};

export function ESGCharts() {
  const { latest: ESG_DATA } = useESGReports();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Weekly incidents area chart */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 20,
                    border: '1px solid var(--bg-raised)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)',
                      marginBottom: 16 }}>
          Incidentes por Semana
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={ESG_DATA.weeklyIncidents}>
            <defs>
              <linearGradient id="wkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="oklch(65% 0.17 220)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="oklch(65% 0.17 220)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" stroke="var(--text-ghost)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-ghost)" tick={{ fontSize: 11 }} width={24} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="count" stroke="oklch(65% 0.17 220)"
                  fill="url(#wkGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly fire foci bar chart */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 20,
                    border: '1px solid var(--bg-raised)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)',
                      marginBottom: 16 }}>
          Focos de Calor por Mês (INPE/simulado)
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ESG_DATA.monthlyFoci}>
            <XAxis dataKey="month" stroke="var(--text-ghost)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-ghost)" tick={{ fontSize: 11 }} width={24} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="foci" fill="oklch(58% 0.22 25)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
