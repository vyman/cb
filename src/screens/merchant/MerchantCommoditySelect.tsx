import { COMMODITIES } from '../../data/commodities'

interface Props {
  selected: string[]
  onToggle: (id: string) => void
  onContinue: () => void
}

export default function MerchantCommoditySelect({ selected, onToggle, onContinue }: Props) {
  return (
    <div className="flex flex-col flex-1 px-5 pt-6 pb-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">List Your Stock</h2>
        <p className="text-sm text-[#8a9e96] mt-1">Select the ingredients you supply to buyers</p>
      </div>

      <div className="flex flex-wrap gap-2.5 flex-1">
        {COMMODITIES.map(c => {
          const active = selected.includes(c.id)
          return (
            <button
              key={c.id}
              onClick={() => onToggle(c.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                active ? 'bg-[#1b8a5a] text-white border-[#1b8a5a]' : 'bg-white text-gray-700 border-[#e4eae7]'
              }`}
            >
              <span className="text-base leading-none">{c.icon}</span>
              {c.name}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <p className="text-xs text-[#8a9e96] text-center mb-3">{selected.length} commodities selected</p>
        <button
          onClick={onContinue}
          disabled={selected.length === 0}
          className="w-full bg-[#1b8a5a] disabled:opacity-40 text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 text-base"
        >
          Continue
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M11 5L16 10L11 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
