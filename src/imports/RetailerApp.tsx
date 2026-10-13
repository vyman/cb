import { useState } from 'react'
import MobileShell from '../components/MobileShell'
import BottomNav from '../components/BottomNav'
import CommoditySelect from './retailer/CommoditySelect'
import PriceList from './retailer/PriceList'
import MarketDashboard from './retailer/MarketDashboard'
import ProfileScreen from './retailer/ProfileScreen'
import { COMMODITIES } from '../data/commodities'

type RetailerScreen = 'select' | 'prices' | 'home' | 'market' | 'profile'

interface Props {
  onBack: () => void
}

export default function RetailerApp({ onBack }: Props) {
  const [screen, setScreen] = useState<RetailerScreen>('select')
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>(['coffee'])
  const [activeTab, setActiveTab] = useState<'home' | 'market' | 'profile'>('home')

  const handleContinue = () => {
    setScreen('prices')
    setActiveTab('home')
  }

  const handleTabChange = (tab: 'home' | 'market' | 'profile') => {
    setActiveTab(tab)
    if (tab === 'home') setScreen('prices')
    else if (tab === 'market') setScreen('market')
    else setScreen('profile')
  }

  const selectedCommodityData = COMMODITIES.filter(c => selectedCommodities.includes(c.id))

  return (
    <MobileShell>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-[#e4eae7]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0faf5]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="#1b8a5a" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1b8a5a] flex items-center justify-center">
            <span className="text-white text-xs font-bold">RN</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 leading-tight">Retailer Name</p>
            <p className="text-[10px] text-[#8a9e96]">Buyer</p>
          </div>
        </div>
        <div className="bg-[#1b8a5a] text-white rounded-lg px-2.5 py-1 text-center">
          <p className="text-[10px] font-medium opacity-70">SEP</p>
          <p className="text-sm font-bold leading-tight">06</p>
        </div>
      </div>

      {screen === 'select' && (
        <CommoditySelect
          selected={selectedCommodities}
          onToggle={(id) => {
            setSelectedCommodities(prev =>
              prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
            )
          }}
          onContinue={handleContinue}
        />
      )}

      {screen !== 'select' && (
        <>
          {screen === 'prices' && (
            <PriceList commodities={selectedCommodityData} />
          )}
          {screen === 'market' && (
            <MarketDashboard commodities={selectedCommodityData} />
          )}
          {screen === 'profile' && (
            <ProfileScreen selectedCommodities={selectedCommodityData} isSeller={false} onEdit={() => setScreen('select')} onToggleSeller={() => {}} />
          )}
          <BottomNav active={activeTab} onChange={handleTabChange} />
        </>
      )}
    </MobileShell>
  )
}
