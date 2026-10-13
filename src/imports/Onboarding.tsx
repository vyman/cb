import { useState } from 'react'
import type { UserProfile } from '../App'
import { COMMODITIES } from '../data/commodities'

type Step = 'welcome' | 'register' | 'commodities' | 'seller'

interface Props {
  onComplete: (profile: UserProfile) => void
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('welcome')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [commodities, setCommodities] = useState<string[]>(['coffee'])
  const [isSeller, setIsSeller] = useState(false)

  const toggleCommodity = (id: string) => {
    setCommodities(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const finish = () => {
    onComplete({ name: name.trim() || 'Grower', phone, location, commodities, isSeller })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 28, boxShadow: '0 8px 40px rgba(0,0,0,0.10)', overflow: 'hidden' }}>

        {/* Progress bar */}
        {step !== 'welcome' && (
          <div style={{ height: 3, background: '#f0f4f2' }}>
            <div style={{
              height: '100%',
              background: '#1b8a5a',
              borderRadius: 99,
              width: step === 'register' ? '33%' : step === 'commodities' ? '66%' : '100%',
              transition: 'width 0.4s ease',
            }} />
          </div>
        )}

        {/* ── WELCOME ── */}
        {step === 'welcome' && (
          <div style={{ padding: '48px 32px 40px', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, background: '#f0faf5', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 24px' }}>
              🌿
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: '0 0 10px', letterSpacing: '-0.5px' }}>AgriTrade</h1>
            <p style={{ color: '#8a9e96', fontSize: 15, margin: '0 0 8px', lineHeight: 1.5 }}>
              Live commodity prices — local &amp; international.<br />
              Coffee, pepper, sesame, wheat &amp; more.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '20px 0 32px', flexWrap: 'wrap' }}>
              {['☕ Coffee', '🌶️ Pepper', '🌾 Wheat', '🍫 Cocoa'].map(c => (
                <span key={c} style={{ background: '#f0faf5', color: '#1b8a5a', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 99, border: '1px solid #a6dfbf' }}>{c}</span>
              ))}
            </div>
            <button
              onClick={() => setStep('register')}
              style={{ width: '100%', background: '#1b8a5a', color: '#fff', border: 'none', borderRadius: 16, padding: '16px', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              Get Started
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9H15M10 4L15 9L10 14" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <p style={{ marginTop: 16, color: '#c0cdc7', fontSize: 12 }}>Free to use · No credit card needed</p>
          </div>
        )}

        {/* ── REGISTER ── */}
        {step === 'register' && (
          <div style={{ padding: '32px 28px 28px' }}>
            <button onClick={() => setStep('welcome')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, color: '#8a9e96', fontSize: 13 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="#8a9e96" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Back
            </button>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Tell us about you</h2>
            <p style={{ color: '#8a9e96', fontSize: 14, margin: '0 0 28px' }}>Quick setup — takes under a minute</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Your Name" placeholder="e.g. Rajan Kumar" value={name} onChange={setName} type="text" />
              <Field label="Phone Number" placeholder="e.g. 9876543210" value={phone} onChange={setPhone} type="tel" />
              <Field label="Location / Village" placeholder="e.g. Coorg, Karnataka" value={location} onChange={setLocation} type="text" />
            </div>

            <button
              onClick={() => setStep('commodities')}
              disabled={!name.trim()}
              style={{ marginTop: 28, width: '100%', background: name.trim() ? '#1b8a5a' : '#c8ddd4', color: '#fff', border: 'none', borderRadius: 16, padding: '15px', fontSize: 15, fontWeight: 600, cursor: name.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        )}

        {/* ── COMMODITY SELECTION ── */}
        {step === 'commodities' && (
          <div style={{ padding: '32px 28px 28px' }}>
            <button onClick={() => setStep('register')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, color: '#8a9e96', fontSize: 13 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="#8a9e96" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Back
            </button>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>What do you grow?</h2>
            <p style={{ color: '#8a9e96', fontSize: 14, margin: '0 0 24px' }}>We'll show you daily prices for these commodities</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {COMMODITIES.map(c => {
                const on = commodities.includes(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCommodity(c.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 99, fontSize: 13, fontWeight: 500,
                      border: on ? '1.5px solid #1b8a5a' : '1.5px solid #e4eae7',
                      background: on ? '#1b8a5a' : '#fff',
                      color: on ? '#fff' : '#555',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{c.icon}</span>{c.name}
                  </button>
                )
              })}
            </div>

            <p style={{ marginTop: 16, fontSize: 12, color: '#aab8b3' }}>{commodities.length} selected</p>

            <button
              onClick={() => setStep('seller')}
              disabled={commodities.length === 0}
              style={{ marginTop: 20, width: '100%', background: commodities.length ? '#1b8a5a' : '#c8ddd4', color: '#fff', border: 'none', borderRadius: 16, padding: '15px', fontSize: 15, fontWeight: 600, cursor: commodities.length ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        )}

        {/* ── SELLER OPT-IN ── */}
        {step === 'seller' && (
          <div style={{ padding: '32px 28px 28px' }}>
            <button onClick={() => setStep('commodities')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, color: '#8a9e96', fontSize: 13 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="#8a9e96" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Back
            </button>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Do you sell too?</h2>
            <p style={{ color: '#8a9e96', fontSize: 14, margin: '0 0 28px', lineHeight: 1.5 }}>
              Everyone can browse prices for free.<br />
              Enable selling to list your stock and publish prices.
            </p>

            {/* Buyer card — always on */}
            <div style={{ background: '#f0faf5', border: '1.5px solid #a6dfbf', borderRadius: 18, padding: 20, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>📊</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: '#111', fontSize: 15, margin: 0 }}>Price Viewer</p>
                  <p style={{ color: '#6a9e82', fontSize: 13, margin: '3px 0 0' }}>Browse local &amp; international market rates daily</p>
                </div>
                <div style={{ width: 22, height: 22, background: '#1b8a5a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
              </div>
            </div>

            {/* Seller card — toggle */}
            <button
              onClick={() => setIsSeller(s => !s)}
              style={{
                width: '100%', textAlign: 'left',
                background: isSeller ? '#1b8a5a' : '#fff',
                border: isSeller ? '1.5px solid #1b8a5a' : '1.5px solid #e4eae7',
                borderRadius: 18, padding: 20, marginBottom: 28,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🏪</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: isSeller ? '#fff' : '#111', fontSize: 15, margin: 0 }}>Seller / Trader</p>
                  <p style={{ color: isSeller ? 'rgba(255,255,255,0.75)' : '#8a9e96', fontSize: 13, margin: '3px 0 0' }}>
                    List your stock, set prices, get buyer enquiries
                  </p>
                </div>
                {/* Toggle */}
                <div style={{
                  width: 44, height: 24, borderRadius: 99, flexShrink: 0,
                  background: isSeller ? 'rgba(255,255,255,0.3)' : '#e4eae7',
                  position: 'relative', transition: 'background 0.2s',
                }}>
                  <div style={{
                    position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%',
                    background: '#fff', transition: 'left 0.2s',
                    left: isSeller ? 23 : 3,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                  }} />
                </div>
              </div>
              {!isSeller && (
                <p style={{ margin: '12px 0 0', fontSize: 12, color: '#aab8b3' }}>Tap to enable selling features</p>
              )}
            </button>

            <button
              onClick={finish}
              style={{ width: '100%', background: '#1b8a5a', color: '#fff', border: 'none', borderRadius: 16, padding: '15px', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {isSeller ? 'Start as Buyer + Seller' : 'Start Browsing Prices'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>

            {isSeller && (
              <button onClick={() => { setIsSeller(false); finish() }} style={{ marginTop: 12, width: '100%', background: 'none', border: 'none', color: '#8a9e96', fontSize: 13, cursor: 'pointer' }}>
                Skip — just browse prices
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

function Field({ label, placeholder, value, onChange, type }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; type: string
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6a8a7a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 15,
          border: '1.5px solid #e4eae7', outline: 'none', background: '#f9fbfa',
          color: '#111', fontFamily: 'inherit', boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = '#1b8a5a')}
        onBlur={e => (e.target.style.borderColor = '#e4eae7')}
      />
    </div>
  )
}
