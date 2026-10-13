import { useState } from 'react'
import type { Order } from '../../data/orders'
import { STATUS_META } from '../../data/orders'

interface Props {
  order: Order
  onBack: () => void
  onRespond: (action: 'accept' | 'decline', quote?: number, note?: string) => void
}

export default function OrderDetail({ order, onBack, onRespond }: Props) {
  const [quote, setQuote] = useState('')
  const [note, setNote] = useState('')
  const [confirming, setConfirming] = useState<'accept' | 'decline' | null>(null)

  const meta = STATUS_META[order.status]
  const canRespond = order.status === 'open'
  const margin = quote ? (((Number(quote) - order.maxBudget) / order.maxBudget) * 100).toFixed(1) : null
  const withinBudget = quote ? Number(quote) <= order.maxBudget : false

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-white border-b border-[#e4eae7] shrink-0 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0faf5]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="#1b8a5a" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{order.id}</p>
          <p className="text-[10px] text-[#8a9e96]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ color: meta.color, background: meta.bg }}>
          {meta.label}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Commodity */}
        <div className="bg-white rounded-2xl border border-[#eef2ef] shadow-sm overflow-hidden">
          <div className="bg-[#f0faf5] px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{order.commodityIcon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{order.varietyName}</p>
              <span className="text-[9px] font-bold bg-[#1b8a5a] text-white px-2 py-0.5 rounded-full">{order.grade}</span>
            </div>
          </div>
          <div className="divide-y divide-[#f0f4f2]">
            <Row label="Quantity Required" value={`${order.quantity} ${order.unit}`} />
            <Row label="Buyer's Max Budget" value={`₹${order.maxBudget} / ${order.unit}`} highlight />
            <Row label="Total Order Value" value={`₹${(order.quantity * order.maxBudget).toLocaleString('en-IN')}`} />
            <Row label="Deliver By" value={new Date(order.deliveryBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
          </div>
        </div>

        {/* Buyer info */}
        <div className="bg-white rounded-2xl border border-[#eef2ef] shadow-sm p-4">
          <p className="text-[10px] text-[#8a9e96] uppercase tracking-wider mb-2">Buyer</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f0faf5] flex items-center justify-center text-base">
              {order.businessType === 'Roastery' ? '🫘' : order.businessType === 'Restaurant' ? '🍽️' : '☕'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{order.buyerName}</p>
              <p className="text-xs text-[#8a9e96]">{order.businessType}</p>
            </div>
          </div>
          {order.notes && (
            <div className="mt-3 pt-3 border-t border-[#f0f4f2]">
              <p className="text-[10px] text-[#8a9e96] uppercase tracking-wider mb-1">Quality Requirements</p>
              <p className="text-xs text-gray-700 leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Platform note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex gap-2">
            <span className="text-base">🔒</span>
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-bold">Escrow protected.</span> Buyer pays SourceTrade. We test your batch for quality. Payment released after confirmation. Our commission is deducted at settlement.
            </p>
          </div>
        </div>

        {/* Already responded */}
        {!canRespond && order.supplierQuote && (
          <div className="bg-white rounded-2xl border border-[#eef2ef] shadow-sm p-4">
            <p className="text-[10px] text-[#8a9e96] uppercase tracking-wider mb-2">Your Response</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Quoted Price</p>
              <p className="text-sm font-bold text-[#1b8a5a]">₹{order.supplierQuote} / {order.unit}</p>
            </div>
            {order.supplierNote && <p className="text-xs text-[#8a9e96] mt-2">{order.supplierNote}</p>}
          </div>
        )}

        {/* Respond form */}
        {canRespond && !confirming && (
          <div className="bg-white rounded-2xl border border-[#eef2ef] shadow-sm p-4 space-y-4">
            <p className="text-sm font-bold text-gray-900">Your Quote</p>

            <div>
              <label className="block text-xs font-semibold text-[#6a8a7a] mb-1.5 uppercase tracking-wider">
                Your Price (₹ per {order.unit})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8a9e96]">₹</span>
                <input
                  type="number"
                  placeholder={String(order.maxBudget)}
                  value={quote}
                  onChange={e => setQuote(e.target.value)}
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl text-[15px] border border-[#e4eae7] bg-[#f9fbfa] text-gray-900 focus:border-[#1b8a5a] focus:outline-none"
                />
              </div>
              {quote && (
                <p className={`text-[10px] mt-1 font-semibold ${withinBudget ? 'text-[#1b8a5a]' : 'text-amber-600'}`}>
                  {withinBudget
                    ? `✓ Within buyer's budget (${Math.abs(Number(margin))}% below max)`
                    : `⚠ ${Math.abs(Number(margin))}% above buyer's budget — may not be accepted`}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6a8a7a] mb-1.5 uppercase tracking-wider">
                Note to Buyer <span className="text-[#b0bdb8] normal-case font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="e.g. Can deliver by Oct 3. Certificate available. Coorg estate."
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm border border-[#e4eae7] bg-[#f9fbfa] text-gray-900 focus:border-[#1b8a5a] focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* Decline confirm */}
        {confirming === 'decline' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm font-bold text-red-800 mb-1">Decline this order?</p>
            <p className="text-xs text-red-700 mb-4">The buyer will be notified and the order will go back to open market.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(null)} className="flex-1 bg-white border border-red-200 text-red-700 font-semibold rounded-xl py-3 text-sm">Cancel</button>
              <button onClick={() => onRespond('decline')} className="flex-[2] bg-red-600 text-white font-semibold rounded-xl py-3 text-sm">Yes, Decline</button>
            </div>
          </div>
        )}
      </div>

      {/* CTA footer */}
      {canRespond && !confirming && (
        <div className="px-5 py-3 bg-white border-t border-[#e4eae7] shrink-0 flex gap-3">
          <button
            onClick={() => setConfirming('decline')}
            className="flex-1 bg-red-50 text-red-600 font-semibold rounded-2xl py-3.5 text-sm border border-red-200"
          >
            Decline
          </button>
          <button
            onClick={() => onRespond('accept', Number(quote), note)}
            disabled={!quote}
            className="flex-[2] bg-[#1b8a5a] disabled:opacity-40 text-white font-semibold rounded-2xl py-3.5 text-sm flex items-center justify-center gap-2"
          >
            Accept & Quote
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-[11px] text-[#8a9e96] font-medium">{label}</p>
      <p className={`text-sm font-bold ${highlight ? 'text-[#1b8a5a]' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}
