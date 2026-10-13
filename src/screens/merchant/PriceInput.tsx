import type { Commodity } from '../../data/commodities'

interface Props {
  commodities: Commodity[]
  prices: Record<string, Record<string, string>>
  activeIdx: number
  onActiveIdx: (i: number) => void
  onChange: (cId: string, vId: string, val: string) => void
  onNext: () => void
  onBack: () => void
}

export default function PriceInput({ commodities, prices, activeIdx, onActiveIdx, onChange, onNext, onBack }: Props) {
  const commodity = commodities[activeIdx]
  if (!commodity) return null

  const allFilled = commodities.every(c =>
    c.varieties.every(v => prices[c.id]?.[v.id]?.trim())
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Commodity tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto shrink-0 bg-white border-b border-[#e4eae7]">
        {commodities.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onActiveIdx(i)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition-all ${
              i === activeIdx ? 'bg-[#1b8a5a] text-white border-[#1b8a5a]' : 'bg-white text-gray-600 border-[#e4eae7]'
            }`}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h3 className="text-base font-bold text-gray-900 mb-1">{commodity.name} Prices</h3>
        <p className="text-xs text-[#8a9e96] mb-4">Enter your selling price per unit</p>

        <div className="space-y-3">
          {commodity.varieties.map(v => (
            <div key={v.id} className="bg-white rounded-2xl p-4 border border-[#eef2ef] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-gray-900">{v.name}</p>
                  <p className="text-[10px] text-[#8a9e96]">Market rate: ₹{v.localPrice}/{v.unit}</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8a9e96]">₹</span>
                <input
                  type="number"
                  placeholder={String(v.localPrice)}
                  value={prices[commodity.id]?.[v.id] ?? ''}
                  onChange={e => onChange(commodity.id, v.id, e.target.value)}
                  className="w-full pl-8 pr-16 py-3 border border-[#e4eae7] rounded-xl text-sm font-semibold text-gray-900 bg-[#f9fbfa] focus:border-[#1b8a5a] focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8a9e96] font-medium">/{v.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 bg-white border-t border-[#e4eae7] flex gap-3 shrink-0">
        <button onClick={onBack} className="flex-1 bg-[#f0faf5] text-[#1b8a5a] font-semibold rounded-2xl py-3.5 text-sm">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!allFilled}
          className="flex-2 flex-[2] bg-[#1b8a5a] disabled:opacity-40 text-white font-semibold rounded-2xl py-3.5 text-sm flex items-center justify-center gap-2"
        >
          Review & Publish
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
