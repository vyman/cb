type Role = 'retailer' | 'merchant' | null

interface Props {
  onSelect: (role: Role) => void
}

export default function RoleSelect({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-[#1b8a5a] flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 mb-6">
          <span className="text-4xl">🌿</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">AgriTrade</h1>
        <p className="text-white/70 mt-2 text-sm">Live Commodity Exchange Platform</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <p className="text-white/60 text-xs font-medium uppercase tracking-widest text-center mb-6">I am a</p>

        <button
          onClick={() => onSelect('retailer')}
          className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 text-left shadow-lg transition-transform active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-xl bg-[#f0faf5] flex items-center justify-center text-2xl flex-shrink-0">
            🧑‍🌾
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-base">Retailer / Buyer</h2>
            <p className="text-gray-500 text-sm mt-0.5">Browse prices, compare vendors, track market rates daily</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-auto flex-shrink-0">
            <path d="M7 4L13 10L7 16" stroke="#1b8a5a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <button
          onClick={() => onSelect('merchant')}
          className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 text-left shadow-lg transition-transform active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-xl bg-[#f0faf5] flex items-center justify-center text-2xl flex-shrink-0">
            🏪
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-base">Merchant / Seller</h2>
            <p className="text-gray-500 text-sm mt-0.5">List commodities, set prices, publish to the market</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-auto flex-shrink-0">
            <path d="M7 4L13 10L7 16" stroke="#1b8a5a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <p className="text-white/40 text-xs mt-12 text-center">
        Covering coffee, pepper, sesame, wheat &amp; more
      </p>
    </div>
  )
}
