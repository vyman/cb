import { useState } from 'react'
import MobileShell from '../components/MobileShell'
import MerchantCommoditySelect from './merchant/MerchantCommoditySelect'
import PriceInput from './merchant/PriceInput'
import PublishConfirm from './merchant/PublishConfirm'
import { COMMODITIES } from '../data/commodities'

type MerchantScreen = 'select' | 'prices' | 'confirm'

interface Props {
  onBack: () => void
}

export default function MerchantApp({ onBack }: Props) {
  const [screen, setScreen] = useState<MerchantScreen>('select')
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>(['coffee'])
  const [prices, setPrices] = useState<Record<string, Record<string, string>>>({})
  const [activeCommodityIdx, setActiveCommodityIdx] = useState(0)

  const selectedData = COMMODITIES.filter(c => selectedCommodities.includes(c.id))

  const handlePriceChange = (commodityId: string, varietyId: string, value: string) => {
    setPrices(prev => ({
      ...prev,
      [commodityId]: { ...(prev[commodityId] ?? {}), [varietyId]: value }
    }))
  }

  return (
    <MobileShell>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-[#e4eae7]">
        <button
          onClick={screen === 'select' ? onBack : () => {
            if (screen === 'prices') setScreen('select')
            else setScreen('prices')
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0faf5]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="#1b8a5a" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#166f48] flex items-center justify-center">
            <span className="text-white text-xs font-bold">MN</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 leading-tight">Merchant Name</p>
            <p className="text-[10px] text-[#8a9e96]">Seller</p>
          </div>
        </div>
        <div className="bg-[#1b8a5a] text-white rounded-lg px-2.5 py-1 text-center">
          <p className="text-[10px] font-medium opacity-70">SEP</p>
          <p className="text-sm font-bold leading-tight">06</p>
        </div>
      </div>

      {/* Progress bar */}
      {screen !== 'select' && (
        <div className="px-5 py-2 bg-white border-b border-[#e4eae7]">
          <div className="flex items-center gap-2">
            {['Select', 'Set Prices', 'Publish'].map((s, i) => {
              const step = screen === 'prices' ? 1 : 2
              return (
                <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    i <= step ? 'bg-[#1b8a5a] text-white' : 'bg-[#e4eae7] text-[#8a9e96]'
                  }`}>{i + 1}</div>
                  <span className={`text-[10px] font-medium ${i <= step ? 'text-[#1b8a5a]' : 'text-[#8a9e96]'}`}>{s}</span>
                  {i < 2 && <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-[#1b8a5a]' : 'bg-[#e4eae7]'}`} />}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {screen === 'select' && (
        <MerchantCommoditySelect
          selected={selectedCommodities}
          onToggle={(id) => setSelectedCommodities(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
          )}
          onContinue={() => setScreen('prices')}
        />
      )}

      {screen === 'prices' && (
        <PriceInput
          commodities={selectedData}
          prices={prices}
          activeIdx={activeCommodityIdx}
          onActiveIdx={setActiveCommodityIdx}
          onChange={handlePriceChange}
          onNext={() => setScreen('confirm')}
          onBack={() => setScreen('select')}
        />
      )}

      {screen === 'confirm' && (
        <PublishConfirm
          commodities={selectedData}
          prices={prices}
          onBack={() => setScreen('prices')}
          onPublish={() => {
            alert('Prices published successfully! ✅')
            setScreen('select')
            setPrices({})
          }}
        />
      )}
    </MobileShell>
  )
}
