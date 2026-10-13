import type { Commodity } from '../../data/commodities'

interface Props {
  commodities: Commodity[]
  prices: Record<string, Record<string, string>>
  onBack: () => void
  onPublish: () => void
}

export default function PublishConfirm({ commodities, prices, onBack, onPublish }: Props) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900">Review Prices</h3>
          <p className="text-xs text-[#8a9e96] mt-0.5">Confirm before publishing to the market</p>
        </div>

        <div className="space-y-3">
          {commodities.map(c => (
            <div key={c.id} className="bg-white rounded-2xl p-4 border border-[#eef2ef] shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{c.icon}</span>
                <p className="text-sm font-bold text-gray-900">{c.name}</p>
              </div>
              <div className="space-y-2">
                {c.varieties.map(v => {
                  const myPrice = prices[c.id]?.[v.id]
                  const diff = myPrice ? ((Number(myPrice) - v.localPrice) / v.localPrice * 100).toFixed(1) : null
                  return (
                    <div key={v.id} className="flex items-center justify-between py-2 border-t border-[#f0f4f2] first:border-0 first:pt-0">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{v.name}</p>
                        <p className="text-[10px] text-[#8a9e96]">Market: ₹{v.localPrice}/{v.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{myPrice || '—'}</p>
                        {diff && (
                          <p className={`text-[10px] font-semibold ${Number(diff) >= 0 ? 'text-[#1b8a5a]' : 'text-red-500'}`}>
                            {Number(diff) >= 0 ? '+' : ''}{diff}% vs market
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-[#f0faf5] border border-[#a6dfbf] rounded-2xl p-4">
          <p className="text-xs text-[#1b8a5a] font-medium">Your prices will be visible to cafés, restaurants & roasteries on SourceTrade immediately after publishing.</p>
        </div>
      </div>

      <div className="px-4 py-3 bg-white border-t border-[#e4eae7] flex gap-3 shrink-0">
        <button onClick={onBack} className="flex-1 bg-[#f0faf5] text-[#1b8a5a] font-semibold rounded-2xl py-3.5 text-sm">
          Back
        </button>
        <button
          onClick={onPublish}
          className="flex-[2] bg-[#1b8a5a] text-white font-semibold rounded-2xl py-3.5 text-sm flex items-center justify-center gap-2"
        >
          Publish Now
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2V11M4 8L8 12L12 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
