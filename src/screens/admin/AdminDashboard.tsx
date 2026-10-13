import { useState, useEffect } from 'react'
import { getAllOrders, adminUpdateOrder } from '../../lib/adminApi'
import { STATUS_META, PIPELINE_STEPS, type Order, type OrderStatus } from '../../data/orders'

const SEED_ORDERS: Order[] = [
  { id: 'ORD-001', buyerName: 'Blue Tokai Roasters', businessType: 'Roastery', commodityId: 'coffee', commodityName: 'Coffee', commodityIcon: '☕', varietyName: 'Arabica SCA 85+', grade: 'Specialty', quantity: 50, unit: 'kg', maxBudget: 500, deliveryBy: '2026-10-10', notes: 'Coorg origin, moisture < 12%', status: 'open', createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: 'ORD-002', buyerName: 'Araku Coffee', businessType: 'Café', commodityId: 'cardamom', commodityName: 'Cardamom', commodityIcon: '🫛', varietyName: 'Green Bold', grade: 'AGEB', quantity: 10, unit: 'kg', maxBudget: 1700, deliveryBy: '2026-09-30', notes: 'Lab certificate required. No bleaching.', status: 'sourcing', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'ORD-003', buyerName: 'Dyu Art Café', businessType: 'Café', commodityId: 'vanilla', commodityName: 'Vanilla', commodityIcon: '🌿', varietyName: 'Grade A Pods', grade: 'Gourmet', quantity: 2, unit: 'kg', maxBudget: 4500, deliveryBy: '2026-10-15', notes: 'Madagascar or Kerala preferred.', status: 'testing', quotedPrice: 4200, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 'ORD-004', buyerName: 'The Hole in the Wall', businessType: 'Restaurant', commodityId: 'cocoa', commodityName: 'Cocoa', commodityIcon: '🍫', varietyName: 'Forastero', grade: 'Fine', quantity: 5, unit: 'kg', maxBudget: 800, deliveryBy: '2026-10-05', notes: '', status: 'confirmed', quotedPrice: 750, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
  { id: 'ORD-005', buyerName: 'Brahmin\'s Coffee Bar', businessType: 'Café', commodityId: 'coffee', commodityName: 'Coffee', commodityIcon: '☕', varietyName: 'Robusta Cherry AB', grade: 'Commercial', quantity: 100, unit: 'kg', maxBudget: 160, deliveryBy: '2026-10-20', notes: '', status: 'fulfilled', quotedPrice: 155, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString() },
]

interface Props {
  adminEmail: string
  onSignOut: () => void
}

const STATUS_FLOW: OrderStatus[] = ['open', 'sourcing', 'testing', 'confirmed', 'fulfilled']

const STAT_FILTERS = [
  { key: 'all',       label: 'All Orders',    color: '#1b8a5a', bg: '#f0faf5' },
  { key: 'active',    label: 'Active',        color: '#2563eb', bg: '#eff6ff' },
  { key: 'action',    label: 'Needs Action',  color: '#b45309', bg: '#fefce8' },
  { key: 'fulfilled', label: 'Delivered',     color: '#1b8a5a', bg: '#dcfce7' },
] as const

type StatFilter = typeof STAT_FILTERS[number]['key']

export default function AdminDashboard({ adminEmail, onSignOut }: Props) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatFilter>('all')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selected, setSelected] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)
  const [quotedPrice, setQuotedPrice] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    // Try to fetch real orders from kv_store; merge with seed data (deduped by id)
    const live = await getAllOrders()
    const liveIds = new Set(live.map((o: Order) => o.id))
    const merged = [...live, ...SEED_ORDERS.filter(o => !liveIds.has(o.id))]
    // Apply any local overrides saved this session
    const overrides: Record<string, Partial<Order>> = JSON.parse(localStorage.getItem('admin_overrides') ?? '{}')
    setOrders(merged.map(o => ({ ...o, ...(overrides[o.id] ?? {}) })))
    setLoading(false)
  }

  const applyOverride = (orderId: string, patch: Partial<Order>) => {
    const overrides: Record<string, Partial<Order>> = JSON.parse(localStorage.getItem('admin_overrides') ?? '{}')
    overrides[orderId] = { ...(overrides[orderId] ?? {}), ...patch }
    localStorage.setItem('admin_overrides', JSON.stringify(overrides))
  }

  const advanceStatus = async (order: Order) => {
    const idx = STATUS_FLOW.indexOf(order.status as OrderStatus)
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return
    const next = STATUS_FLOW[idx + 1]
    const patch: Partial<Order> = { status: next }
    if (next === 'confirmed' && quotedPrice) patch.quotedPrice = Number(quotedPrice)
    setUpdating(true)
    await adminUpdateOrder(order.id, patch)
    applyOverride(order.id, patch)
    const updated = { ...order, ...patch } as Order
    setOrders(prev => prev.map(o => o.id === order.id ? updated : o))
    setSelected(updated)
    setUpdating(false)
    setQuotedPrice('')
  }

  const cancelOrder = async (order: Order) => {
    setUpdating(true)
    const patch = { status: 'cancelled' as OrderStatus }
    await adminUpdateOrder(order.id, patch)
    applyOverride(order.id, patch)
    const updated = { ...order, ...patch }
    setOrders(prev => prev.map(o => o.id === order.id ? updated : o))
    setSelected(updated)
    setUpdating(false)
  }

  const total = orders.length
  const active = orders.filter(o => !['fulfilled', 'cancelled'].includes(o.status)).length
  const needsAction = orders.filter(o => o.status === 'confirmed').length
  const delivered = orders.filter(o => o.status === 'fulfilled').length

  const statCounts: Record<StatFilter, number> = { all: total, active, action: needsAction, fulfilled: delivered }

  const displayed = orders.filter(o => {
    if (filter === 'active' && ['fulfilled', 'cancelled'].includes(o.status)) return false
    if (filter === 'action' && o.status !== 'confirmed') return false
    if (filter === 'fulfilled' && o.status !== 'fulfilled') return false
    if (statusFilter !== 'all' && o.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return o.id.toLowerCase().includes(q) ||
        o.buyerName.toLowerCase().includes(q) ||
        o.commodityName.toLowerCase().includes(q) ||
        o.varietyName.toLowerCase().includes(q)
    }
    return true
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-[#e4eae7] px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1b8a5a] rounded-xl flex items-center justify-center text-white text-sm font-bold">S</div>
          <div>
            <span className="text-sm font-bold text-gray-900">SourceTrade</span>
            <span className="ml-2 text-[10px] font-semibold text-[#1b8a5a] bg-[#f0faf5] border border-[#a6dfbf] px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={load} className="text-[11px] text-[#8a9e96] font-medium flex items-center gap-1.5 hover:text-gray-700">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 6.5A5 5 0 112.5 3.5M2.5 1v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Refresh
          </button>
          <div className="text-[11px] text-[#8a9e96]">{adminEmail}</div>
          <button onClick={onSignOut} className="text-[11px] font-semibold text-[#8a9e96] hover:text-gray-700 flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M5 11.5H2.5a1 1 0 01-1-1V2.5a1 1 0 011-1H5M9 9.5l2.5-3L9 3.5M11.5 6.5H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            {STAT_FILTERS.map(s => (
              <button key={s.key} onClick={() => setFilter(s.key)}
                className={`rounded-2xl p-4 text-left border-2 transition-all ${filter === s.key ? 'border-[#1b8a5a] shadow-md' : 'border-transparent bg-white shadow-sm hover:shadow-md'}`}
                style={{ background: filter === s.key ? s.bg : 'white' }}>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{statCounts[s.key]}</p>
                <p className="text-xs text-[#8a9e96] font-medium mt-0.5">{s.label}</p>
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="#8a9e96" strokeWidth="1.4"/><path d="M10 10l2.5 2.5" stroke="#8a9e96" strokeWidth="1.4" strokeLinecap="round"/></svg>
              <input placeholder="Search orders, buyers, ingredients…" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded-xl text-sm border border-[#e4eae7] bg-white focus:border-[#1b8a5a] focus:outline-none" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {([['all', 'All'], ['open', 'Received'], ['sourcing', 'Sourcing'], ['testing', 'Testing'], ['confirmed', 'Confirmed'], ['fulfilled', 'Delivered'], ['cancelled', 'Cancelled']] as [OrderStatus | 'all', string][]).map(([s, label]) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusFilter === s ? 'bg-[#1b8a5a] text-white border-[#1b8a5a]' : 'bg-white text-[#8a9e96] border-[#e4eae7] hover:border-[#1b8a5a]'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#c8ddd4] border-t-[#1b8a5a] rounded-full animate-spin" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-3xl mb-3">📋</p>
              <p className="text-sm font-semibold text-gray-900">No orders found</p>
              <p className="text-xs text-[#8a9e96] mt-1">Orders placed by buyers will appear here</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#eef2ef] shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f0f4f2]">
                    {['Order', 'Buyer', 'Commodity', 'Qty', 'Budget', 'Deliver By', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[#8a9e96] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((order, i) => {
                    const meta = STATUS_META[order.status]
                    const isTerminal = order.status === 'fulfilled' || order.status === 'cancelled'
                    const nextIdx = STATUS_FLOW.indexOf(order.status as OrderStatus)
                    const nextLabel = !isTerminal && nextIdx >= 0 ? STATUS_META[STATUS_FLOW[nextIdx + 1]]?.label : null
                    return (
                      <tr key={order.id}
                        onClick={() => setSelected(order)}
                        className={`border-b border-[#f9fbfa] cursor-pointer hover:bg-[#f9fbfa] transition-colors ${i === displayed.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-bold text-gray-900">{order.id}</p>
                          <p className="text-[10px] text-[#8a9e96]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-semibold text-gray-900">{order.buyerName}</p>
                          <p className="text-[10px] text-[#8a9e96]">{order.businessType}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">{order.commodityIcon}</span>
                            <div>
                              <p className="text-xs font-semibold text-gray-900">{order.varietyName}</p>
                              <span className="text-[9px] font-bold bg-[#f0faf5] text-[#1b8a5a] px-1.5 py-0.5 rounded">{order.grade}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-gray-900">{order.quantity} {order.unit}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-gray-900">≤ ₹{order.maxBudget}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-700">{new Date(order.deliveryBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                        <td className="px-4 py-3.5">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
                        </td>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          {nextLabel && !isTerminal && (
                            order.status === 'testing' ? (
                              <button
                                onClick={() => setSelected(order)}
                                className="text-[10px] font-semibold text-[#7c3aed] bg-[#f5f3ff] px-2.5 py-1 rounded-full border border-[#c4b5fd] hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed] transition-all cursor-pointer"
                              >
                                → {nextLabel} ✏️
                              </button>
                            ) : (
                              <button
                                onClick={() => advanceStatus(order)}
                                disabled={updating}
                                className="text-[10px] font-semibold text-[#1b8a5a] bg-[#f0faf5] px-2.5 py-1 rounded-full border border-[#a6dfbf] hover:bg-[#1b8a5a] hover:text-white hover:border-[#1b8a5a] transition-all disabled:opacity-40 cursor-pointer"
                              >
                                → {nextLabel}
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* Detail panel */}
        {selected && (
          <aside className="w-[360px] bg-white border-l border-[#e4eae7] flex flex-col shrink-0 overflow-y-auto">
            <div className="px-5 py-4 border-b border-[#f0f4f2] flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">Order Detail</p>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-full bg-[#f0f4f2] flex items-center justify-center text-[#8a9e96] text-lg leading-none">×</button>
            </div>

            <div className="flex-1 px-5 py-5 space-y-5">
              {/* Header */}
              <div className="flex items-start gap-3">
                <span className="text-3xl">{selected.commodityIcon}</span>
                <div>
                  <p className="text-base font-bold text-gray-900">{selected.varietyName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold bg-[#f0faf5] text-[#1b8a5a] px-2 py-0.5 rounded">{selected.grade}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: STATUS_META[selected.status].color, background: STATUS_META[selected.status].bg }}>{STATUS_META[selected.status].label}</span>
                  </div>
                </div>
              </div>

              {/* Pipeline */}
              {selected.status !== 'cancelled' && (
                <div>
                  <p className="text-[10px] font-bold text-[#8a9e96] uppercase tracking-wider mb-2">Pipeline</p>
                  <div className="flex items-center gap-0.5">
                    {PIPELINE_STEPS.map((s, i) => {
                      const step = STATUS_META[selected.status].step
                      const filled = step > i + 1
                      const active = step === i + 1
                      return (
                        <div key={s} className="flex items-center gap-0.5 flex-1 last:flex-none">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${filled ? 'bg-[#1b8a5a] text-white' : active ? 'bg-[#1b8a5a] text-white ring-2 ring-[#a6dfbf]' : 'bg-[#e4eae7] text-[#aaa]'}`}>
                            {filled ? '✓' : i + 1}
                          </div>
                          {i < PIPELINE_STEPS.length - 1 && (
                            <div className={`flex-1 h-[2px] rounded-full ${filled ? 'bg-[#1b8a5a]' : 'bg-[#e4eae7]'}`} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    {PIPELINE_STEPS.map(s => <span key={s} className="text-[8px] text-[#aaa]">{s}</span>)}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="bg-[#f9fbfa] rounded-2xl p-4 space-y-2.5">
                <Row label="Order ID" value={selected.id} />
                <Row label="Buyer" value={selected.buyerName} />
                <Row label="Business" value={selected.businessType || '—'} />
                <Row label="Quantity" value={`${selected.quantity} ${selected.unit}`} />
                <Row label="Max Budget" value={`₹${selected.maxBudget} / ${selected.unit}`} />
                {selected.quotedPrice && <Row label="Quoted" value={`₹${selected.quotedPrice} / ${selected.unit}`} accent />}
                <Row label="Deliver By" value={new Date(selected.deliveryBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
                {selected.notes && <Row label="Notes" value={selected.notes} />}
              </div>

              {/* Actions */}
              {selected.status !== 'fulfilled' && selected.status !== 'cancelled' && (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-[#8a9e96] uppercase tracking-wider">Update Status</p>

                  {selected.status === 'open' && (
                    <ActionBtn label="Mark as Sourcing" icon="🔍" onClick={() => advanceStatus(selected)} loading={updating} />
                  )}
                  {selected.status === 'sourcing' && (
                    <ActionBtn label="Mark as Testing" icon="🔬" onClick={() => advanceStatus(selected)} loading={updating} />
                  )}
                  {selected.status === 'testing' && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-[#6a8a7a] mb-1 uppercase tracking-wider">Quoted Price (₹ / {selected.unit})</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8a9e96]">₹</span>
                          <input type="number" placeholder={String(selected.maxBudget)} value={quotedPrice} onChange={e => setQuotedPrice(e.target.value)}
                            className="w-full pl-7 pr-3 py-2.5 rounded-xl text-sm border border-[#e4eae7] bg-[#f9fbfa] focus:border-[#1b8a5a] focus:outline-none" />
                        </div>
                      </div>
                      <ActionBtn label="Confirm Quality & Price" icon="✅" onClick={() => advanceStatus(selected)} loading={updating} disabled={!quotedPrice} />
                    </div>
                  )}
                  {selected.status === 'confirmed' && (
                    <ActionBtn label="Mark as Delivered" icon="🚚" onClick={() => advanceStatus(selected)} loading={updating} />
                  )}

                  <button onClick={() => cancelOrder(selected)} disabled={updating}
                    className="w-full py-2.5 rounded-xl border border-[#e4eae7] text-xs font-semibold text-[#8a9e96] hover:border-red-200 hover:text-red-500 transition-colors">
                    Cancel Order
                  </button>
                </div>
              )}

              {selected.status === 'fulfilled' && (
                <div className="bg-[#dcfce7] rounded-2xl p-4 flex items-center gap-2">
                  <span>🎉</span>
                  <p className="text-xs font-semibold text-[#1b8a5a]">Order delivered successfully</p>
                </div>
              )}
              {selected.status === 'cancelled' && (
                <div className="bg-[#f3f4f6] rounded-2xl p-4 flex items-center gap-2">
                  <span>❌</span>
                  <p className="text-xs font-semibold text-[#6b7280]">Order was cancelled</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p className="text-[10px] text-[#8a9e96] font-medium shrink-0">{label}</p>
      <p className={`text-xs font-semibold text-right ${accent ? 'text-[#1b8a5a]' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}

function ActionBtn({ label, icon, onClick, loading, disabled }: { label: string; icon: string; onClick: () => void; loading?: boolean; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading || disabled}
      className="w-full bg-[#1b8a5a] disabled:opacity-40 text-white rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-2">
      {loading ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <span>{icon}</span>}
      {label}
    </button>
  )
}
