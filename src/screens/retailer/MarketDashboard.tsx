import type { Commodity } from '../../data/commodities'

interface Props {
  commodities: Commodity[]
}

const WEEK_DATA = [62, 58, 65, 70, 68, 74, 72]

export default function MarketDashboard({ commodities }: Props) {
  const allVarieties = commodities.flatMap(c => c.varieties.map(v => ({ ...v, commodity: c.name, icon: c.icon })))
  const gainers = [...allVarieties].sort((a, b) => b.change - a.change).slice(0, 3)
  const losers = [...allVarieties].sort((a, b) => a.change - b.change).slice(0, 3)

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <h2 className="text-base font-bold text-gray-900">Market Overview</h2>

      {/* Sparkline chart */}
      <div className="bg-white rounded-2xl p-4 border border-[#eef2ef] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-gray-900">Weekly Trend</p>
            <p className="text-[10px] text-[#8a9e96]">Composite index</p>
          </div>
          <span className="text-xs font-bold text-[#1b8a5a] bg-[#f0faf5] px-2 py-1 rounded-full">+16.1%</span>
        </div>
        <svg viewBox="0 0 280 60" className="w-full h-14">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b8a5a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#1b8a5a" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const pts = WEEK_DATA.map((v, i) => {
              const x = (i / (WEEK_DATA.length - 1)) * 270 + 5
              const y = 55 - ((v - 55) / 25) * 48
              return `${x},${y}`
            })
            const polyline = pts.join(' ')
            const area = `${pts[0].split(',')[0]},55 ${polyline} ${pts[pts.length - 1].split(',')[0]},55`
            return (
              <>
                <polygon points={area} fill="url(#grad)" />
                <polyline points={polyline} fill="none" stroke="#1b8a5a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                {WEEK_DATA.map((v, i) => {
                  const x = (i / (WEEK_DATA.length - 1)) * 270 + 5
                  const y = 55 - ((v - 55) / 25) * 48
                  return i === WEEK_DATA.length - 1 ? (
                    <circle key={i} cx={x} cy={y} r="4" fill="#1b8a5a" />
                  ) : null
                })}
              </>
            )
          })()}
        </svg>
        <div className="flex justify-between mt-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <span key={d} className="text-[9px] text-[#b0bdb8]">{d}</span>
          ))}
        </div>
      </div>

      {/* Top Gainers */}
      <div className="bg-white rounded-2xl p-4 border border-[#eef2ef] shadow-sm">
        <p className="text-xs font-bold text-gray-900 mb-3">Top Gainers</p>
        <div className="space-y-2.5">
          {gainers.map(v => (
            <div key={v.id} className="flex items-center gap-2">
              <span className="text-lg">{v.icon}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-900">{v.name}</p>
                <p className="text-[10px] text-[#8a9e96]">{v.commodity}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900">₹{v.localPrice}</p>
                <p className="text-[10px] font-semibold text-[#1b8a5a]">+{v.change}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-white rounded-2xl p-4 border border-[#eef2ef] shadow-sm">
        <p className="text-xs font-bold text-gray-900 mb-3">Declining Today</p>
        <div className="space-y-2.5">
          {losers.map(v => (
            <div key={v.id} className="flex items-center gap-2">
              <span className="text-lg">{v.icon}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-900">{v.name}</p>
                <p className="text-[10px] text-[#8a9e96]">{v.commodity}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900">₹{v.localPrice}</p>
                <p className="text-[10px] font-semibold text-red-500">{v.change}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        <StatCard label="Avg Local Price" value="₹842" sub="+3.2% this week" up />
        <StatCard label="Intl Index" value="$1,024" sub="+1.8% this week" up />
        <StatCard label="Varieties Tracked" value={String(allVarieties.length)} sub="across your watchlist" />
        <StatCard label="Price Alerts" value="2" sub="Active alerts" />
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, up }: { label: string; value: string; sub: string; up?: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-3.5 border border-[#eef2ef] shadow-sm">
      <p className="text-[10px] text-[#8a9e96] font-medium uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-gray-900 mt-0.5">{value}</p>
      <p className={`text-[10px] font-medium mt-0.5 ${up ? 'text-[#1b8a5a]' : 'text-[#8a9e96]'}`}>{sub}</p>
    </div>
  )
}
