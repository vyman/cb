import type { Order } from '../../data/orders'
import { STATUS_META, PIPELINE_STEPS } from '../../data/orders'

interface Props {
  orders: Order[]
  onNew: () => void
}

export default function MyOrders({ orders, onNew }: Props) {
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const active = sorted.filter(o => o.status !== 'fulfilled' && o.status !== 'cancelled')
  const past = sorted.filter(o => o.status === 'fulfilled' || o.status === 'cancelled')

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-8 lg:py-7">
      <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base lg:text-lg font-bold text-gray-900">Order overview</h2>
          <p className="text-[10px] lg:text-xs text-[#8a9e96] mt-0.5">{active.length} active · {past.length} completed</p>
        </div>
        <button onClick={onNew}
          className="flex items-center gap-1.5 bg-[#1b8a5a] text-white text-xs font-semibold px-3.5 py-2 rounded-full">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1V11M1 6H11" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          New Order
        </button>
      </div>

      {sorted.length === 0 && (
        <div className="py-8">
          <div className="text-center mb-8">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-sm font-bold text-gray-900 mb-1">No orders yet</p>
            <p className="text-xs text-[#8a9e96] mb-5">Place your first sourcing request — we'll handle the rest.</p>
            <button onClick={onNew} className="bg-[#1b8a5a] text-white text-sm font-semibold px-6 py-3 rounded-2xl">
              Place an Order
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-[#eef2ef] p-4">
            <p className="text-[10px] font-bold text-[#8a9e96] uppercase tracking-wider mb-3">How it works</p>
            <div className="space-y-3">
              {[
                ['📋', 'You place an order', 'Grade, quantity & delivery date'],
                ['🔍', 'We source it', 'From verified channels in our network'],
                ['🔬', 'We test quality', 'Lab-checked before it leaves the source'],
                ['✅', 'You approve & pay', 'Only when the price suits you'],
                ['🚚', 'We deliver', 'To your door'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-base mt-0.5 w-5 text-center shrink-0">{icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{title}</p>
                    <p className="text-[10px] text-[#8a9e96]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="grid xl:grid-cols-2 gap-3 lg:gap-4 mb-6">
          {active.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      )}

      {past.length > 0 && (
        <>
          <p className="text-[10px] font-semibold text-[#8a9e96] uppercase tracking-wider mb-2">Past Orders</p>
          <div className="grid xl:grid-cols-2 gap-3 lg:gap-4">
            {past.map(order => <OrderCard key={order.id} order={order} muted />)}
          </div>
        </>
      )}
      </div>
    </div>
  )
}

function OrderCard({ order, muted }: { order: Order; muted?: boolean }) {
  const meta = STATUS_META[order.status]
  const isTerminal = order.status === 'fulfilled' || order.status === 'cancelled'

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${muted ? 'opacity-70 border-[#eef2ef]' : 'border-[#eef2ef]'}`}>
      {/* Top */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        <span className="text-2xl">{order.commodityIcon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-gray-900">{order.varietyName}</p>
            <span className="text-[9px] font-bold bg-[#f0faf5] text-[#1b8a5a] px-1.5 py-0.5 rounded">{order.grade}</span>
          </div>
          <p className="text-[10px] text-[#8a9e96] mt-0.5">{order.id} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0" style={{ color: meta.color, background: meta.bg }}>
          {meta.label}
        </span>
      </div>

      {/* Pipeline */}
      {!isTerminal && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-0.5">
            {PIPELINE_STEPS.map((s, i) => {
              const filled = meta.step > i + 1
              const active = meta.step === i + 1
              return (
                <div key={s} className="flex items-center gap-0.5 flex-1 last:flex-none">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 transition-all ${
                    filled ? 'bg-[#1b8a5a] text-white' : active ? 'bg-[#1b8a5a] text-white ring-2 ring-[#a6dfbf]' : 'bg-[#e4eae7] text-[#aaa]'
                  }`}>
                    {filled ? '✓' : i + 1}
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className={`flex-1 h-[2px] rounded-full ${filled ? 'bg-[#1b8a5a]' : 'bg-[#e4eae7]'}`} />
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-[10px] text-[#8a9e96] mt-2 leading-relaxed">{meta.platformNote}</p>
        </div>
      )}

      {/* Details row */}
      <div className="flex items-center gap-4 px-4 py-3 bg-[#f9fbfa] border-t border-[#f0f4f2]">
        <Stat label="Qty" value={`${order.quantity} ${order.unit}`} />
        <div className="w-px h-5 bg-[#e4eae7]" />
        <Stat label="Budget" value={`≤ ₹${order.maxBudget}/${order.unit}`} />
        <div className="w-px h-5 bg-[#e4eae7]" />
        <Stat label="By" value={new Date(order.deliveryBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
        {order.quotedPrice && (
          <>
            <div className="w-px h-5 bg-[#e4eae7]" />
            <Stat label="Quoted" value={`₹${order.quotedPrice}/${order.unit}`} accent />
          </>
        )}
      </div>

      {/* Status-specific banners */}
      {order.status === 'testing' && (
        <div className="px-4 py-3 bg-[#f5f3ff] border-t border-[#f0f4f2] flex items-center gap-2">
          <span>🔬</span>
          <p className="text-[11px] text-[#7c3aed] font-medium">Lab testing in progress — we'll notify you within 24–48 hrs</p>
        </div>
      )}
      {order.status === 'confirmed' && (
        <div className="px-4 py-3 bg-[#f0faf5] border-t border-[#f0f4f2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <p className="text-[11px] text-[#1b8a5a] font-medium">Quality verified — confirm payment to dispatch</p>
          </div>
          <button className="bg-[#1b8a5a] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">Pay Now</button>
        </div>
      )}
      {order.status === 'fulfilled' && (
        <div className="px-4 py-3 bg-[#dcfce7] border-t border-[#f0f4f2] flex items-center gap-2">
          <span>🎉</span>
          <p className="text-[11px] text-[#1b8a5a] font-medium">Delivered! We hope you loved the quality.</p>
        </div>
      )}
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
