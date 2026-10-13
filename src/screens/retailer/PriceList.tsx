import { useState, useMemo } from 'react'
import type { Commodity } from '../../data/commodities'

interface Props {
  commodities: Commodity[]
}

type SortMode = 'default' | 'gainers' | 'losers' | 'price-asc' | 'price-desc'

const SORT_CHIPS: { id: SortMode; label: string }[] = [
  { id: 'gainers', label: '▲ Gainers' },
  { id: 'losers', label: '▼ Losers' },
  { id: 'price-desc', label: '₹ High → Low' },
  { id: 'price-asc', label: '₹ Low → High' },
]

export default function PriceList({ commodities }: Props) {
  const [expanded, setExpanded] = useState<string | null>(commodities[0]?.id ?? null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('default')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    let list = q
      ? commodities.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.varieties.some(v => v.name.toLowerCase().includes(q) || v.grade?.toLowerCase().includes(q))
        )
      : [...commodities]

    if (sort === 'gainers') list = list.sort((a, b) => b.varieties[0].change - a.varieties[0].change)
    else if (sort === 'losers') list = list.sort((a, b) => a.varieties[0].change - b.varieties[0].change)
    else if (sort === 'price-desc') list = list.sort((a, b) => b.varieties[0].localPrice - a.varieties[0].localPrice)
    else if (sort === 'price-asc') list = list.sort((a, b) => a.varieties[0].localPrice - b.varieties[0].localPrice)

    return list
  }, [commodities, query, sort])

  const toggleSort = (id: SortMode) => setSort(prev => prev === id ? 'default' : id)

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Sticky search + filter */}
      <div className="px-4 pt-4 pb-2 lg:px-8 lg:pt-7 lg:pb-3 space-y-2.5 bg-[#f4f6f5] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto space-y-2.5">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="#8a9e96" strokeWidth="1.6"/>
            <path d="M10.5 10.5L13.5 13.5" stroke="#8a9e96" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search ingredients, grades…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-[#e4eae7] text-sm text-gray-900 placeholder-[#b0bdb8] focus:border-[#1b8a5a] focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a9e96] text-base leading-none">×</button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {SORT_CHIPS.map(chip => (
            <button
              key={chip.id}
              onClick={() => toggleSort(chip.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                sort === chip.id ? 'bg-[#1b8a5a] text-white border-[#1b8a5a]' : 'bg-white text-[#6a8a7a] border-[#e4eae7]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 lg:px-8 lg:pb-8 max-w-[77rem] mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Ingredient Prices</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1b8a5a] animate-pulse" />
            <span className="text-[10px] text-[#1b8a5a] font-semibold">Live</span>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-14">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm font-semibold text-gray-900">No results for "{query}"</p>
            <p className="text-xs text-[#8a9e96] mt-1">Try a grade name, variety, or clear the search</p>
          </div>
        )}

        <div className="grid xl:grid-cols-2 gap-3 lg:gap-4 mt-3 items-start">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#eef2ef]">
            <button
              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
            >
              <span className="text-2xl">{c.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{highlight(c.name, query)}</p>
                <p className="text-[10px] text-[#8a9e96]">{c.varieties.length} grades available</p>
              </div>
              <div className="text-right mr-2">
                <p className="text-sm font-bold text-gray-900">₹{c.varieties[0].localPrice}</p>
                <p className="text-[10px] text-[#8a9e96]">/{c.varieties[0].unit}</p>
              </div>
              <TrendBadge change={c.varieties[0].change} />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className={`transition-transform duration-200 ${expanded === c.id ? 'rotate-180' : ''}`}>
                <path d="M4 6L8 10L12 6" stroke="#8a9e96" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>

            {expanded === c.id && (
              <div className="border-t border-[#f0f4f2]">
                <div className="flex items-center px-4 py-2 bg-[#f9fbfa]">
                  <span className="flex-1 text-[10px] text-[#8a9e96] font-medium uppercase tracking-wider">Grade / Variety</span>
                  <span className="w-20 text-[10px] text-[#8a9e96] font-medium uppercase tracking-wider text-right">Local</span>
                  <span className="w-20 text-[10px] text-[#8a9e96] font-medium uppercase tracking-wider text-right">Intl</span>
                  <span className="w-12 text-[10px] text-[#8a9e96] font-medium uppercase tracking-wider text-right">Chg</span>
                </div>
                {c.varieties.map((v, i) => (
                  <div key={v.id} className={`flex items-center px-4 py-3 gap-2 ${i > 0 ? 'border-t border-[#f0f4f2]' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{highlight(v.name, query)}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {v.grade && (
                          <span className="text-[9px] font-bold bg-[#f0faf5] text-[#1b8a5a] px-1.5 py-0.5 rounded border border-[#c8f0dc]">
                            {v.grade}
                          </span>
                        )}
                        <span className="text-[10px] text-[#8a9e96]">per {v.unit}</span>
                      </div>
                    </div>
                    <span className="w-20 text-xs font-bold text-gray-900 text-right shrink-0">₹{v.localPrice}</span>
                    <span className="w-20 text-xs text-[#8a9e96] text-right shrink-0">${v.intlPrice}</span>
                    <span className={`w-12 text-xs font-semibold text-right shrink-0 ${v.change >= 0 ? 'text-[#1b8a5a]' : 'text-red-500'}`}>
                      {v.change >= 0 ? '+' : ''}{v.change}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

function TrendBadge({ change }: { change: number }) {
  const up = change >= 0
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${up ? 'bg-[#f0faf5] text-[#1b8a5a]' : 'bg-red-50 text-red-500'}`}>
      {up ? '▲' : '▼'} {Math.abs(change)}%
    </span>
  )
}

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#c8f0dc] text-[#1b8a5a] rounded px-0.5 not-italic font-bold">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}
