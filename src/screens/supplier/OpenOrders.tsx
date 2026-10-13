import { useState } from 'react'
import type { Order } from '../../data/orders'
import { STATUS_META } from '../../data/orders'
import OrderDetail from './OrderDetail'

interface Props {
  orders: Order[]
  onRespond: (orderId: string, action: 'accept' | 'decline', quote?: number, note?: string) => void
}

type Filter = 'open' | 'accepted' | 'all'

export default function OpenOrders({ orders, onRespond }: Props) {
  const [filter, setFilter] = useState<Filter>('open')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = orders.filter(o => {
    if (filter === 'open') return o.status === 'open'
    if (filter === 'accepted') return o.status === 'accepted' || o.status === 'testing' || o.status === 'fulfilled'
    return true
  })

  const openCount = orders.filter(o => o.status === 'open').length
  const selected = orders.find(o => o.id === selectedId)

  if (selected) {
    return (
      <OrderDetail
        order={selected}
        onBack={() => setSelectedId(null)}
        onRespond={(action, quote, note) => {
          onRespond(selected.id, action, quote, note)
          setSelectedId(null)
        }}
      />
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">Buyer Requests</h2>
        <p className="text-[10px] text-[#8a9e96]">{openCount} new {openCount === 1 ? 'request' : 'requests'} waiting for your response</p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4">
        {([['open', 'New Requests'], ['accepted', 'My Orders'], ['all', 'All']] as [Filter, string][]).map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f ? 'bg-[#1b8a5a] text-white border-[#1b8a5a]' : 'bg-white text-[#6a8a7a] border-[#e4eae7]'
            }`}
          >
            {label}
            {f === 'open' && openCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {openCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14">
          <p className="text-4xl mb-3">{filter === 'open' ? '📭' : '📦'}</p>
          <p className="text-sm font-bold text-gray-900 mb-1">
            {filter === 'open' ? 'No new requests' : 'No orders here'}
          </p>
          <p className="text-xs text-[#8a9e96]">Check back soon — we'll notify you when buyers post orders matching your commodities.</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(order => {
          const meta = STATUS_META[order.status]
          const isNew = order.status === 'open'
          return (
            <button
              key={order.id}
              onClick={() => setSelectedId(order.id)}
              className={`w-full text-left bg-white rounded-2xl border shadow-sm overflow-hidden transition-all active:scale-[0.99] ${
                isNew ? 'border-amber-300 ring-1 ring-amber-200' : 'border-[#eef2ef]'
              }`}
            >
              {isNew && (
                <div className="bg-amber-50 px-4 py-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-amber-700">New Request — Tap to respond</p>
                </div>
              )}

              <div className="px-4 pt-3 pb-3 flex items-start gap-3">
                <span className="text-2xl">{order.commodityIcon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{order.varietyName}</p>
                    <span className="text-[9px] font-bold bg-[#f0faf5] text-[#1b8a5a] px-1.5 py-0.5 rounded">{order.grade}</span>
                  </div>
                  <p className="text-[10px] text-[#8a9e96] mt-0.5">{order.buyerName} · {order.businessType}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0" style={{ color: meta.color, background: meta.bg }}>
                  {meta.label}
                </span>
              </div>

              <div className="flex items-center gap-4 px-4 py-3 bg-[#f9fbfa] border-t border-[#f0f4f2]">
                <Stat label="Need" value={`${order.quantity} ${order.unit}`} />
                <div className="w-px h-6 bg-[#e4eae7]" />
                <Stat label="Budget" value={`≤ ₹${order.maxBudget}/${order.unit}`} accent={isNew} />
                <div className="w-px h-6 bg-[#e4eae7]" />
                <Stat label="By" value={new Date(order.deliveryBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
                <div className="ml-auto">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="#8a9e96" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[9px] text-[#8a9e96] uppercase tracking-wider">{label}</p>
      <p className={`text-xs font-bold ${accent ? 'text-[#1b8a5a]' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}
