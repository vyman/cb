import { useState } from 'react'
import type { UserProfile } from '../App'
import { COMMODITIES } from '../data/commodities'
import PriceList from './retailer/PriceList'
import MarketDashboard from './retailer/MarketDashboard'
import MerchantCommoditySelect from './merchant/MerchantCommoditySelect'
import PriceInput from './merchant/PriceInput'
import PublishConfirm from './merchant/PublishConfirm'
import ProfileScreen from './retailer/ProfileScreen'

type Tab = 'prices' | 'market' | 'sell' | 'profile'
type SellStep = 'select' | 'input' | 'confirm'

interface Props {
  profile: UserProfile
  onProfileUpdate: (p: UserProfile) => void
}

export default function HomeApp({ profile, onProfileUpdate }: Props) {
  const [tab, setTab] = useState<Tab>('prices')

  // Merchant flow state
  const [sellStep, setSellStep] = useState<SellStep>('select')
  const [sellCommodities, setSellCommodities] = useState<string[]>(profile.commodities.slice(0, 1))
  const [sellPrices, setSellPrices] = useState<Record<string, Record<string, string>>>({})
  const [sellIdx, setSellIdx] = useState(0)

  const watchedCommodities = COMMODITIES.filter(c => profile.commodities.includes(c.id))
  const sellCommodityData = COMMODITIES.filter(c => sellCommodities.includes(c.id))

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'relative', background: '#f4f6f5', borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.22)', width: 390, height: 844, display: 'flex', flexDirection: 'column' }}>

        {/* Status bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px 4px', background: '#f4f6f5', flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0" y="4" width="3" height="8" rx="1" fill="#1b8a5a" />
              <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="#1b8a5a" />
              <rect x="9" y="0" width="3" height="12" rx="1" fill="#1b8a5a" />
              <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="#ddd" />
            </svg>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M7.5 2C9.4 2 11.1 2.8 12.3 4.1L13.6 2.8C12 1.1 9.9 0 7.5 0C5.1 0 3 1.1 1.4 2.8L2.7 4.1C3.9 2.8 5.6 2 7.5 2Z" fill="#1b8a5a"/>
              <path d="M7.5 5C8.7 5 9.8 5.5 10.6 6.3L11.9 5C10.7 3.8 9.2 3 7.5 3C5.8 3 4.3 3.8 3.1 5L4.4 6.3C5.2 5.5 6.3 5 7.5 5Z" fill="#1b8a5a"/>
              <circle cx="7.5" cy="9" r="1.5" fill="#1b8a5a"/>
            </svg>
            <div style={{ width: 22, height: 12, border: '1.5px solid #555', borderRadius: 3, position: 'relative', display: 'flex', alignItems: 'center', padding: '1.5px' }}>
              <div style={{ width: '70%', height: '100%', background: '#333', borderRadius: 1.5 }} />
              <div style={{ width: 2, height: 6, background: '#555', borderRadius: 1, position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 10px', background: '#fff', borderBottom: '1px solid #e4eae7', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1b8a5a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {profile.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, lineHeight: 1.2 }}>{profile.name}</p>
              <p style={{ fontSize: 11, color: '#8a9e96', margin: 0 }}>{profile.location || 'Location not set'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {profile.isSeller && (
              <span style={{ background: '#f0faf5', border: '1px solid #a6dfbf', borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: '#1b8a5a' }}>
                Seller
              </span>
            )}
            <div style={{ background: '#1b8a5a', color: '#fff', borderRadius: 10, padding: '4px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 9, opacity: 0.7, margin: 0, fontWeight: 500 }}>SEP</p>
              <p style={{ fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1 }}>06</p>
            </div>
          </div>
        </div>

        {/* Sell flow progress */}
        {tab === 'sell' && sellStep !== 'select' && (
          <div style={{ padding: '8px 20px', background: '#fff', borderBottom: '1px solid #e4eae7', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {(['select', 'input', 'confirm'] as SellStep[]).map((s, i) => {
                const labels = ['Select', 'Set Prices', 'Publish']
                const current: number = (sellStep as string) === 'select' ? 0 : sellStep === 'input' ? 1 : 2
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: i < 2 ? 1 : undefined }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: i <= current ? '#1b8a5a' : '#e4eae7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: i <= current ? '#fff' : '#aaa', flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: 10, fontWeight: 500, color: i <= current ? '#1b8a5a' : '#aaa' }}>{labels[i]}</span>
                    {i < 2 && <div style={{ flex: 1, height: 1.5, borderRadius: 99, background: i < current ? '#1b8a5a' : '#e4eae7' }} />}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {tab === 'prices' && <PriceList commodities={watchedCommodities} />}
          {tab === 'market' && <MarketDashboard commodities={watchedCommodities} />}
          {tab === 'profile' && (
            <ProfileScreen
              selectedCommodities={watchedCommodities}
              isSeller={profile.isSeller}
              onEdit={() => setTab('prices')}
              onToggleSeller={() => onProfileUpdate({ ...profile, isSeller: !profile.isSeller })}
            />
          )}
          {tab === 'sell' && (
            <>
              {sellStep === 'select' && (
                <MerchantCommoditySelect
                  selected={sellCommodities}
                  onToggle={id => setSellCommodities(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                  onContinue={() => setSellStep('input')}
                />
              )}
              {sellStep === 'input' && (
                <PriceInput
                  commodities={sellCommodityData}
                  prices={sellPrices}
                  activeIdx={sellIdx}
                  onActiveIdx={setSellIdx}
                  onChange={(cId, vId, val) => setSellPrices(prev => ({ ...prev, [cId]: { ...(prev[cId] ?? {}), [vId]: val } }))}
                  onNext={() => setSellStep('confirm')}
                  onBack={() => setSellStep('select')}
                />
              )}
              {sellStep === 'confirm' && (
                <PublishConfirm
                  commodities={sellCommodityData}
                  prices={sellPrices}
                  onBack={() => setSellStep('input')}
                  onPublish={() => {
                    alert('Prices published! ✅')
                    setSellStep('select')
                    setSellPrices({})
                    setTab('prices')
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Bottom nav */}
        <div style={{ background: '#fff', borderTop: '1px solid #e4eae7', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0 14px', flexShrink: 0 }}>
          <NavBtn label="Prices" active={tab === 'prices'} onClick={() => setTab('prices')}
            icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 9.5L11 3L19 9.5V19C19 19.6 18.6 20 18 20H14V15H8V20H4C3.4 20 3 19.6 3 19V9.5Z" fill={tab==='prices'?'#1b8a5a':'none'} stroke={tab==='prices'?'#1b8a5a':'#8a9e96'} strokeWidth="1.5"/></svg>}
          />
          <NavBtn label="Market" active={tab === 'market'} onClick={() => setTab('market')}
            icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <polyline points="3,16 8,10 12,13 19,5" stroke={tab==='market'?'#1b8a5a':'#8a9e96'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="19" cy="5" r="2" fill={tab==='market'?'#1b8a5a':'#8a9e96'}/>
            </svg>}
          />
          {profile.isSeller && (
            <NavBtn label="Sell" active={tab === 'sell'} onClick={() => setTab('sell')}
              icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="10" width="16" height="9" rx="1.5" fill={tab==='sell'?'#1b8a5a':'none'} stroke={tab==='sell'?'#1b8a5a':'#8a9e96'} strokeWidth="1.5"/>
                <path d="M8 10V7C8 4.8 10 3 11 3C12 3 14 4.8 14 7V10" stroke={tab==='sell'?'#1b8a5a':'#8a9e96'} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>}
              highlight
            />
          )}
          <NavBtn label="Profile" active={tab === 'profile'} onClick={() => setTab('profile')}
            icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="7" r="4" fill={tab==='profile'?'#1b8a5a':'none'} stroke={tab==='profile'?'#1b8a5a':'#8a9e96'} strokeWidth="1.5"/>
              <path d="M3 19C3 15.7 6.6 13 11 13C15.4 13 19 15.7 19 19" stroke={tab==='profile'?'#1b8a5a':'#8a9e96'} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>}
          />
        </div>
      </div>
    </div>
  )
}

function NavBtn({ icon, label, active, onClick, highlight }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; highlight?: boolean }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px', position: 'relative' }}>
      {highlight && !active && (
        <span style={{ position: 'absolute', top: -2, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#1b8a5a', border: '1.5px solid #f4f6f5' }} />
      )}
      {icon}
      <span style={{ fontSize: 10, fontWeight: 500, color: active ? '#1b8a5a' : '#8a9e96' }}>{label}</span>
    </button>
  )
}
