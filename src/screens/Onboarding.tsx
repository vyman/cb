import { useState } from 'react'
import type { UserProfile } from '../App'

type Step = 'welcome' | 'register'

const BUSINESS_TYPES = ['Café', 'Restaurant', 'Roastery', 'Bakery', 'Hotel', 'Bar', 'Catering', 'Retailer']

interface Props {
  onComplete: (profile: UserProfile) => void
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('welcome')
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const finish = () => onComplete({
    name: businessName.trim() || name.trim() || 'My Business',
    contactName: name,
    phone,
    location,
    commodities: ['coffee'],
    businessType,
  })

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-[1.75rem] shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden lg:grid lg:grid-cols-[0.85fr_1.15fr]">
        <div className="hidden lg:flex bg-[#103d2c] text-white p-10 flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-xl">☕</div>
            <p className="text-xl font-bold tracking-tight">SourceTrade</p>
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight leading-tight">Your sourcing desk, ready in under a minute.</p>
            <div className="mt-7 space-y-4">
              {[
                ['01', 'Tell us about your business'],
                ['02', 'Choose ingredients to watch'],
                ['03', 'Place and track orders'],
              ].map(([number, label]) => (
                <div key={number} className="flex items-center gap-3 text-sm text-white/75">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">{number}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/40">Quality guaranteed · Pay on confirmation</p>
        </div>
        <div className="relative flex flex-col justify-center">

        {step === 'register' && (
          <div className="h-1 bg-[#f0f4f2] absolute top-0 inset-x-0">
            <div className="h-full bg-[#1b8a5a] rounded-full w-full transition-all duration-400" />
          </div>
        )}

        {/* WELCOME */}
        {step === 'welcome' && (
          <div className="px-8 py-12 lg:px-12 lg:py-16 text-center">
            <div className="w-20 h-20 bg-[#f0faf5] rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">☕</div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">Welcome to SourceTrade</h1>
            <p className="text-[#8a9e96] text-[15px] leading-relaxed mb-2">
              Premium ingredients, delivered to your kitchen.
            </p>
            <p className="text-[#8a9e96] text-[13px] leading-relaxed mb-6">
              Tell us what you need — quality grade, quantity, delivery date. We source it, test it, and deliver it. You focus on the food.
            </p>
            <div className="flex gap-2 justify-center flex-wrap mb-8">
              {['☕ Coffee', '🍵 Tea', '🍫 Cocoa', '🫛 Cardamom', '🌿 Vanilla'].map(c => (
                <span key={c} className="bg-[#f0faf5] text-[#1b8a5a] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#a6dfbf]">{c}</span>
              ))}
            </div>
            <button onClick={() => setStep('register')}
              className="w-full bg-[#1b8a5a] text-white rounded-2xl py-4 text-base font-semibold flex items-center justify-center gap-2">
              Get Started
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9H15M10 4L15 9L10 14" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <p className="mt-4 text-[#c0cdc7] text-xs">Free to sign up · Pay only when you order</p>
          </div>
        )}

        {/* REGISTER */}
        {step === 'register' && (
          <div className="px-7 py-8 lg:px-12 lg:py-10">
            <BackBtn onClick={() => setStep('welcome')} />
            <h2 className="text-[22px] font-bold text-gray-900 mb-1">About your business</h2>
            <p className="text-[#8a9e96] text-sm mb-6">Takes under a minute</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Business Name" placeholder="e.g. The Daily Grind" value={businessName} onChange={setBusinessName} type="text" />
              <Field label="Your Name" placeholder="e.g. Priya Sharma" value={name} onChange={setName} type="text" />
              <Field label="Phone" placeholder="e.g. 9876543210" value={phone} onChange={setPhone} type="tel" />
              <Field label="City" placeholder="e.g. Bengaluru" value={location} onChange={setLocation} type="text" />
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#6a8a7a] mb-2 uppercase tracking-wider">Business Type</label>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_TYPES.map(t => (
                    <button key={t} onClick={() => setBusinessType(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        businessType === t ? 'bg-[#1b8a5a] text-white border-[#1b8a5a]' : 'bg-white text-gray-600 border-[#e4eae7]'
                      }`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={finish} disabled={!businessName.trim()}
              className="mt-7 w-full md:max-w-xs bg-[#1b8a5a] disabled:bg-[#c8ddd4] text-white rounded-2xl py-4 text-[15px] font-semibold flex items-center justify-center gap-2">
              Start Sourcing
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <p className="mt-3 text-center text-[11px] text-[#b0bdb8]">You can add ingredients to track from the app</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-[#8a9e96] text-[13px] mb-5 bg-transparent border-none cursor-pointer">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="#8a9e96" strokeWidth="1.8" strokeLinecap="round"/></svg>
      Back
    </button>
  )
}

function Field({ label, placeholder, value, onChange, type }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; type: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#6a8a7a] mb-1.5 uppercase tracking-wider">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl text-[15px] border border-[#e4eae7] bg-[#f9fbfa] text-gray-900 focus:border-[#1b8a5a] focus:outline-none transition-colors" />
    </div>
  )
}
