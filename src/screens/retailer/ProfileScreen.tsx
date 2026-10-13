import { useState } from 'react'
import { COMMODITIES } from '../../data/commodities'
import type { Commodity } from '../../data/commodities'
import type { UserProfile } from '../../App'

interface Props {
  profile: UserProfile
  selectedCommodities: Commodity[]
  isSeller: boolean
  onEdit: (updated: UserProfile) => void
  onToggleSeller: () => void
  onSignOut: () => void
}

const BUSINESS_TYPE_ICONS: Record<string, string> = {
  Café: '☕', Restaurant: '🍽️', Roastery: '🫘', Bakery: '🥐',
  Hotel: '🏨', Bar: '🍸', Catering: '🥘', Retailer: '🛒',
}

export default function ProfileScreen({ profile, selectedCommodities, onEdit, onSignOut }: Props) {
  const [editingWatchlist, setEditingWatchlist] = useState(false)
  const [draft, setDraft] = useState<string[]>(profile.commodities)
  const icon = BUSINESS_TYPE_ICONS[profile.businessType] ?? '🏪'

  const toggle = (id: string) =>
    setDraft(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const saveWatchlist = () => {
    onEdit({ ...profile, commodities: draft })
    setEditingWatchlist(false)
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-8 lg:py-7">
      <div className="max-w-5xl mx-auto space-y-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
      {/* Business card */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-[#eef2ef] shadow-sm flex items-center gap-4 lg:col-span-2">
        <div className="w-14 h-14 rounded-2xl bg-[#1b8a5a] flex items-center justify-center text-2xl">{icon}</div>
        <div>
          <p className="text-base font-bold text-gray-900">{profile.name}</p>
          {profile.contactName && <p className="text-xs text-[#8a9e96]">{profile.contactName}</p>}
          <div className="flex items-center gap-2 mt-1">
            {profile.businessType && (
              <span className="text-[10px] font-semibold bg-[#f0faf5] text-[#1b8a5a] px-2 py-0.5 rounded-full border border-[#a6dfbf]">
                {profile.businessType}
              </span>
            )}
            {profile.location && (
              <span className="text-[10px] text-[#8a9e96]">📍 {profile.location}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sourcing watchlist */}
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-[#eef2ef] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-900">Sourcing Watchlist</p>
          {!editingWatchlist
            ? <button onClick={() => { setDraft(profile.commodities); setEditingWatchlist(true) }} className="text-[10px] text-[#1b8a5a] font-semibold">Edit</button>
            : <div className="flex gap-2">
                <button onClick={() => setEditingWatchlist(false)} className="text-[10px] text-[#8a9e96] font-semibold">Cancel</button>
                <button onClick={saveWatchlist} disabled={draft.length === 0} className="text-[10px] text-[#1b8a5a] font-bold disabled:opacity-40">Save</button>
              </div>
          }
        </div>
        {!editingWatchlist ? (
          <div className="flex flex-wrap gap-2">
            {selectedCommodities.map(c => (
              <span key={c.id} className="flex items-center gap-1 bg-[#f0faf5] text-[#1b8a5a] text-xs font-medium px-3 py-1.5 rounded-full border border-[#a6dfbf]">
                <span>{c.icon}</span> {c.name}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {COMMODITIES.map(c => {
              const on = draft.includes(c.id)
              return (
                <button key={c.id} onClick={() => toggle(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    on ? 'bg-[#1b8a5a] text-white border-[#1b8a5a]' : 'bg-white text-gray-600 border-[#e4eae7]'
                  }`}>
                  <span>{c.icon}</span>{c.name}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-3.5 border border-[#eef2ef] shadow-sm">
          <p className="text-[10px] text-[#8a9e96] uppercase tracking-wider">Tracking</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{selectedCommodities.length}</p>
          <p className="text-[10px] text-[#8a9e96]">ingredients</p>
        </div>
        <div className="bg-white rounded-2xl p-3.5 border border-[#eef2ef] shadow-sm">
          <p className="text-[10px] text-[#8a9e96] uppercase tracking-wider">Grades</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{selectedCommodities.reduce((a, c) => a + c.varieties.length, 0)}</p>
          <p className="text-[10px] text-[#8a9e96]">monitored</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-[#eef2ef] shadow-sm">
        <p className="text-xs font-bold text-gray-900 mb-3">How SourceTrade Works</p>
        <div className="space-y-3">
          {[
            ['📋', 'Place an order', 'Specify grade, quantity & delivery date'],
            ['🔍', 'We source it', 'Our team finds verified supply from trusted channels'],
            ['🔬', 'We test quality', 'Lab-verified before it leaves the source'],
            ['🚚', 'We deliver', 'To your door. You pay only on confirmation'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="flex items-start gap-3">
              <span className="text-base mt-0.5">{icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-900">{title}</p>
                <p className="text-[10px] text-[#8a9e96]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f0faf5] rounded-2xl p-4 border border-[#a6dfbf] text-center lg:col-span-2">
        <p className="text-xs text-[#1b8a5a] font-medium">SourceTrade · Quality guaranteed · Pay on confirmation</p>
      </div>

      <button onClick={onSignOut}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#e4eae7] text-[#8a9e96] text-sm font-semibold bg-white lg:col-span-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="#8a9e96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Sign Out
      </button>
      </div>
    </div>
  )
}
