import { useState } from 'react'
import { COMMODITIES } from '../../data/commodities'
import type { Order } from '../../data/orders'
import type { UserProfile } from '../../App'

type Step = 'commodity' | 'details'

interface Props {
  profile: UserProfile
  onSubmit: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void
  onCancel: () => void
}

export default function PlaceOrder({ profile, onSubmit, onCancel }: Props) {
  const [step, setStep] = useState<Step>('commodity')
  const [commodityId, setCommodityId] = useState('')
  const [varietyIdx, setVarietyIdx] = useState(0)
  const [quantity, setQuantity] = useState('')
  const [maxBudget, setMaxBudget] = useState('')
  const [deliveryBy, setDeliveryBy] = useState('')
  const [notes, setNotes] = useState('')

  const watchedCommodities = COMMODITIES.filter(c => profile.commodities.includes(c.id))
  const selectedCommodity = COMMODITIES.find(c => c.id === commodityId)
  const selectedVariety = selectedCommodity?.varieties[varietyIdx]

  const handleSubmit = () => {
    if (!selectedCommodity || !selectedVariety) return
    onSubmit({
      buyerName: profile.name,
      businessType: profile.businessType,
      commodityId: selectedCommodity.id,
      commodityName: selectedCommodity.name,
      commodityIcon: selectedCommodity.icon,
      varietyName: selectedVariety.name,
      grade: selectedVariety.grade ?? '',
      quantity: Number(quantity),
      unit: selectedVariety.unit,
      maxBudget: Number(maxBudget),
      deliveryBy,
      notes,
    })
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-3 pb-2 lg:px-8 lg:py-4 bg-white border-b border-[#e4eae7] shrink-0">
        <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={step === 'details' ? () => setStep('commodity') : onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0faf5] shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="#1b8a5a" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">New Order Request</p>
            <p className="text-[10px] text-[#8a9e96]">Step {step === 'commodity' ? 1 : 2} of 2 — {step === 'commodity' ? 'Pick ingredient & grade' : 'Quantity & delivery'}</p>
          </div>
        </div>
        <div className="mt-2.5 h-[3px] bg-[#f0f4f2] rounded-full">
          <div className="h-full bg-[#1b8a5a] rounded-full transition-all duration-300"
            style={{ width: step === 'commodity' ? '50%' : '100%' }} />
        </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 lg:px-8 lg:py-7">
        <div className="max-w-4xl mx-auto">

        {/* STEP 1 — COMMODITY */}
        {step === 'commodity' && (
          <div className="space-y-5">
            <div>
              <p className="text-base font-bold text-gray-900 mb-1">What do you need?</p>
              <p className="text-xs text-[#8a9e96]">Select from your sourcing watchlist</p>
            </div>

            <div className="grid md:grid-cols-2 gap-2.5">
              {watchedCommodities.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setCommodityId(c.id); setVarietyIdx(0) }}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-[1.5px] text-left transition-all ${
                    commodityId === c.id ? 'border-[#1b8a5a] bg-[#f0faf5]' : 'border-[#e4eae7] bg-white'
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{c.name}</p>
                    <p className="text-[10px] text-[#8a9e96]">{c.varieties.length} grades available</p>
                  </div>
                  {commodityId === c.id && (
                    <div className="w-5 h-5 rounded-full bg-[#1b8a5a] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Grade picker */}
            {selectedCommodity && (
              <div>
                <p className="text-xs font-bold text-[#6a8a7a] uppercase tracking-wider mb-2">Select Grade</p>
                <div className="grid md:grid-cols-2 gap-2">
                  {selectedCommodity.varieties.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setVarietyIdx(i)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border-[1.5px] text-left transition-all ${
                        varietyIdx === i ? 'border-[#1b8a5a] bg-[#f0faf5]' : 'border-[#e4eae7] bg-white'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{v.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {v.grade && <span className="text-[9px] font-bold bg-[#e8f5ee] text-[#1b8a5a] px-1.5 py-0.5 rounded">{v.grade}</span>}
                          <span className="text-[10px] text-[#8a9e96]">Market: ₹{v.localPrice}/{v.unit}</span>
                        </div>
                      </div>
                      {varietyIdx === i && (
                        <div className="w-4 h-4 rounded-full bg-[#1b8a5a] flex items-center justify-center shrink-0">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4L3.2 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — DETAILS */}
        {step === 'details' && selectedVariety && (
          <div className="space-y-4 max-w-2xl">
            <div className="bg-[#f0faf5] border border-[#a6dfbf] rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">{selectedCommodity?.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedVariety.name}</p>
                {selectedVariety.grade && <span className="text-[9px] font-bold bg-[#1b8a5a] text-white px-2 py-0.5 rounded-full">{selectedVariety.grade}</span>}
              </div>
            </div>

            <Field label={`Quantity (${selectedVariety.unit})`} placeholder="e.g. 50" value={quantity} onChange={setQuantity} type="number" />

            <div>
              <label className="block text-xs font-semibold text-[#6a8a7a] mb-1 uppercase tracking-wider">
                Pay up to (₹ per {selectedVariety.unit})
              </label>
              <p className="text-[10px] text-[#8a9e96] mb-1.5">Market today: <span className="font-semibold text-gray-700">₹{selectedVariety.localPrice}/{selectedVariety.unit}</span></p>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8a9e96]">₹</span>
                <input
                  type="number"
                  placeholder={String(selectedVariety.localPrice)}
                  value={maxBudget}
                  onChange={e => setMaxBudget(e.target.value)}
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl text-[15px] border border-[#e4eae7] bg-[#f9fbfa] text-gray-900 focus:border-[#1b8a5a] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6a8a7a] mb-1.5 uppercase tracking-wider">Deliver By</label>
              <input
                type="date"
                value={deliveryBy}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDeliveryBy(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-[15px] border border-[#e4eae7] bg-[#f9fbfa] text-gray-900 focus:border-[#1b8a5a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6a8a7a] mb-1.5 uppercase tracking-wider">Quality Notes <span className="text-[#b0bdb8] normal-case font-normal">(optional)</span></label>
              <textarea
                placeholder="e.g. moisture < 12%, Coorg origin, no bleaching..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm border border-[#e4eae7] bg-[#f9fbfa] text-gray-900 focus:border-[#1b8a5a] focus:outline-none resize-none"
              />
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3 lg:px-8 lg:py-4 bg-white border-t border-[#e4eae7] shrink-0 flex gap-3 lg:justify-end">
        {step === 'details' && (
          <button onClick={() => setStep('commodity')}
            className="flex-1 lg:flex-none lg:w-32 bg-[#f0faf5] text-[#1b8a5a] font-semibold rounded-2xl py-3.5 text-sm">
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (step === 'commodity' && commodityId) setStep('details')
            else if (step === 'details') handleSubmit()
          }}
          disabled={
            (step === 'commodity' && !commodityId) ||
            (step === 'details' && (!quantity || !maxBudget || !deliveryBy))
          }
          className="flex-[2] lg:flex-none lg:w-52 bg-[#1b8a5a] disabled:opacity-40 text-white font-semibold rounded-2xl py-3.5 text-sm flex items-center justify-center gap-2"
        >
          {step === 'details' ? 'Submit Request' : 'Continue'}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  )
}

function Field({ label, placeholder, value, onChange, type }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; type: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#6a8a7a] mb-1.5 uppercase tracking-wider">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl text-[15px] border border-[#e4eae7] bg-[#f9fbfa] text-gray-900 focus:border-[#1b8a5a] focus:outline-none" />
    </div>
  )
}
