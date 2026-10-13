import { useState } from 'react'
import type { UserProfile } from '../App'
import type { Order } from '../data/orders'
import type { Notification } from '../data/notifications'
import { COMMODITIES } from '../data/commodities'
import PriceList from './retailer/PriceList'
import ProfileScreen from './retailer/ProfileScreen'
import MyOrders from './buyer/MyOrders'
import PlaceOrder from './buyer/PlaceOrder'
import NotificationPanel from '../components/NotificationPanel'

type Tab = 'prices' | 'orders' | 'profile'

interface Props {
  profile: UserProfile
  onProfileUpdate: (p: UserProfile) => void
  orders: Order[]
  notifications: Notification[]
  onAddOrder: (o: Omit<Order, 'id' | 'createdAt' | 'status'>) => void
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onSignOut: () => void
}

export default function HomeApp({ profile, onProfileUpdate, orders, notifications, onAddOrder, onMarkRead, onMarkAllRead, onSignOut }: Props) {
  const [tab, setTab] = useState<Tab>('orders')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)

  const watchedCommodities = COMMODITIES.filter(c => profile.commodities.includes(c.id))
  const today = new Date()
  const unreadCount = notifications.filter(n => !n.read).length

  const switchTab = (t: Tab) => { setTab(t); setPlacingOrder(false); setShowNotifs(false) }
  const pageTitle = placingOrder ? 'Place an order' : tab === 'orders' ? 'My orders' : tab === 'prices' ? 'Market prices' : 'Business profile'

  return (
    <div className="min-h-screen bg-[#f4f6f5] lg:flex">
      <aside className="hidden lg:flex w-64 xl:w-72 min-h-screen bg-[#103d2c] text-white flex-col shrink-0">
        <div className="px-7 py-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">☕</div>
            <div>
              <p className="text-lg font-bold tracking-tight">SourceTrade</p>
              <p className="text-[11px] text-white/55">Quality sourcing, simplified</p>
            </div>
          </div>
        </div>
        <nav className="px-4 py-7 space-y-2" aria-label="Primary navigation">
          <DesktopNavBtn label="Orders" active={tab === 'orders'} onClick={() => switchTab('orders')}
            badge={orders.filter(o => o.status === 'confirmed').length || undefined}
            icon={<OrdersIcon active={tab === 'orders'} />} />
          <DesktopNavBtn label="Market prices" active={tab === 'prices'} onClick={() => switchTab('prices')}
            icon={<PricesIcon active={tab === 'prices'} />} />
          <DesktopNavBtn label="Business profile" active={tab === 'profile'} onClick={() => switchTab('profile')}
            icon={<ProfileIcon active={tab === 'profile'} />} />
        </nav>
        <div className="mt-auto p-5">
          <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#39a877] flex items-center justify-center text-xs font-bold">
                {profile.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{profile.name}</p>
                <p className="text-[11px] text-white/55 truncate">{profile.businessType || 'SourceTrade buyer'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="relative flex flex-col min-h-screen lg:h-screen lg:min-w-0 lg:flex-1">
        {/* Status bar */}
        <div className="flex lg:hidden items-center justify-between px-6 pt-2.5 pb-1 bg-[#f4f6f5] shrink-0">
          <span className="text-xs font-semibold text-gray-900">9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0" y="4" width="3" height="8" rx="1" fill="#1b8a5a"/>
              <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="#1b8a5a"/>
              <rect x="9" y="0" width="3" height="12" rx="1" fill="#1b8a5a"/>
              <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="#ddd"/>
            </svg>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M7.5 2C9.4 2 11.1 2.8 12.3 4.1L13.6 2.8C12 1.1 9.9 0 7.5 0 5.1 0 3 1.1 1.4 2.8L2.7 4.1C3.9 2.8 5.6 2 7.5 2Z" fill="#1b8a5a"/>
              <path d="M7.5 5C8.7 5 9.8 5.5 10.6 6.3L11.9 5C10.7 3.8 9.2 3 7.5 3 5.8 3 4.3 3.8 3.1 5L4.4 6.3C5.2 5.5 6.3 5 7.5 5Z" fill="#1b8a5a"/>
              <circle cx="7.5" cy="9" r="1.5" fill="#1b8a5a"/>
            </svg>
            <div className="w-[22px] h-3 border-[1.5px] border-gray-500 rounded-sm relative flex items-center p-[1.5px]">
              <div className="w-[70%] h-full bg-gray-800 rounded-[1.5px]"/>
              <div className="w-0.5 h-1.5 bg-gray-500 rounded absolute -right-[3px] top-1/2 -translate-y-1/2"/>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2.5 lg:px-8 lg:py-5 bg-white border-b border-[#e4eae7] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="lg:hidden w-9 h-9 rounded-full bg-[#1b8a5a] flex items-center justify-center text-xs font-bold text-white">
              {profile.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="lg:hidden">
              <p className="text-[13px] font-semibold text-gray-900 leading-tight">{profile.name}</p>
              <p className="text-[11px] text-[#8a9e96]">{profile.businessType || 'SourceTrade'}</p>
            </div>
            <div className="hidden lg:block">
              <p className="text-xl font-bold text-gray-900 tracking-tight">{pageTitle}</p>
              <p className="text-xs text-[#8a9e96] mt-0.5">
                {placingOrder ? 'Tell us what you need and we’ll handle the sourcing.' : `Welcome back, ${profile.contactName || profile.name}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Bell */}
            <button onClick={() => setShowNotifs(v => !v)}
              className="relative w-9 h-9 rounded-full bg-[#f0f4f2] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2C9 2 5 4 5 9V13L3 14V15H15V14L13 13V9C13 4 9 2 9 2Z"
                  fill={showNotifs ? '#1b8a5a' : 'none'} stroke={showNotifs ? '#1b8a5a' : '#555'} strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M7.5 15.5C7.5 16.3 8.2 17 9 17C9.8 17 10.5 16.3 10.5 15.5" stroke={showNotifs ? '#1b8a5a' : '#555'} strokeWidth="1.4"/>
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#1b8a5a] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="bg-[#1b8a5a] text-white rounded-[10px] px-2.5 py-1 lg:px-3 lg:py-1.5 text-center">
              <p className="text-[9px] opacity-70 font-medium">{today.toLocaleString('en', { month: 'short' }).toUpperCase()}</p>
              <p className="text-sm font-bold leading-tight">{today.getDate()}</p>
            </div>
          </div>
        </div>

        {/* Notification overlay */}
        {showNotifs && (
          <NotificationPanel
            notifications={notifications}
            onMarkRead={onMarkRead}
            onMarkAllRead={onMarkAllRead}
            onClose={() => setShowNotifs(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col min-h-0">
          {tab === 'prices' && <PriceList commodities={watchedCommodities} />}
          {tab === 'orders' && (
            placingOrder
              ? <PlaceOrder profile={profile} onSubmit={o => { onAddOrder(o); setPlacingOrder(false) }} onCancel={() => setPlacingOrder(false)} />
              : <MyOrders orders={orders} onNew={() => setPlacingOrder(true)} />
          )}
          {tab === 'profile' && (
            <ProfileScreen
              profile={profile}
              selectedCommodities={watchedCommodities}
              isSeller={false}
              onEdit={onProfileUpdate}
              onToggleSeller={() => {}}
              onSignOut={onSignOut}
            />
          )}
        </main>

        {/* Bottom nav — Orders first as primary action */}
        <div className="lg:hidden bg-white border-t border-[#e4eae7] flex items-center justify-around py-2.5 pb-3.5 shrink-0">
          <NavBtn label="Orders" active={tab === 'orders'} onClick={() => switchTab('orders')}
            badge={orders.filter(o => o.status === 'confirmed').length || undefined}
            icon={<OrdersIcon active={tab === 'orders'} />}
          />
          <NavBtn label="Prices" active={tab === 'prices'} onClick={() => switchTab('prices')}
            icon={<PricesIcon active={tab === 'prices'} />}
          />
          <NavBtn label="Profile" active={tab === 'profile'} onClick={() => switchTab('profile')}
            icon={<ProfileIcon active={tab === 'profile'} />}
          />
        </div>
      </div>
    </div>
  )
}

function DesktopNavBtn({ icon, label, active, onClick, badge }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: number
}) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
      active ? 'bg-white text-[#103d2c]' : 'text-white/65 hover:bg-white/5 hover:text-white'
    }`}>
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#39a877] text-white text-[10px] flex items-center justify-center">{badge}</span>}
    </button>
  )
}

function NavBtn({ icon, label, active, onClick, badge }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: number
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer px-6 relative">
      {badge !== undefined && (
        <span className="absolute -top-0.5 right-3 min-w-[14px] h-3.5 bg-[#1b8a5a] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1">
          {badge}
        </span>
      )}
      {icon}
      <span className="text-[10px] font-medium" style={{ color: active ? '#1b8a5a' : '#8a9e96' }}>{label}</span>
    </button>
  )
}

function OrdersIcon({ active }: { active: boolean }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="3" width="14" height="16" rx="2" fill={active?'#1b8a5a':'none'} stroke={active?'#1b8a5a':'currentColor'} strokeWidth="1.5"/><path d="M8 8H14M8 12H12" stroke={active?'white':'currentColor'} strokeWidth="1.5" strokeLinecap="round"/></svg>
}

function PricesIcon({ active }: { active: boolean }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 9.5L11 3L19 9.5V19C19 19.6 18.6 20 18 20H14V15H8V20H4C3.4 20 3 19.6 3 19V9.5Z" fill={active?'#1b8a5a':'none'} stroke={active?'#1b8a5a':'currentColor'} strokeWidth="1.5"/></svg>
}

function ProfileIcon({ active }: { active: boolean }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="7" r="4" fill={active?'#1b8a5a':'none'} stroke={active?'#1b8a5a':'currentColor'} strokeWidth="1.5"/><path d="M3 19C3 15.7 6.6 13 11 13C15.4 13 19 15.7 19 19" stroke={active?'#1b8a5a':'currentColor'} strokeWidth="1.5" strokeLinecap="round"/></svg>
}
