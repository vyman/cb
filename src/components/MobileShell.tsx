import type { ReactNode } from 'react'

export default function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center p-4">
      <div
        style={{ width: 390, height: 844, borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.22)' }}
        className="relative bg-[#f4f6f5] flex flex-col"
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#f4f6f5] shrink-0">
          <span className="text-xs font-semibold text-gray-900">9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0" y="4" width="3" height="8" rx="1" fill="#1b8a5a" />
              <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="#1b8a5a" />
              <rect x="9" y="0" width="3" height="12" rx="1" fill="#1b8a5a" />
              <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="#ddd" />
            </svg>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M7.5 2C9.4 2 11.1 2.8 12.3 4.1L13.6 2.8C12 1.1 9.9 0 7.5 0C5.1 0 3 1.1 1.4 2.8L2.7 4.1C3.9 2.8 5.6 2 7.5 2Z" fill="#1b8a5a"/>
              <path d="M7.5 5C8.7 5 9.8 5.5 10.6 6.3L11.9 5C10.7 3.8 9.2 3 7.5 3C5.8 3 4.3 3.8 3.1 5L4.4 6.3C5.2 5.5 6.3 5 7.5 5Z" fill="#1b8a5a"/>
              <circle cx="7.5" cy="9" r="1.5" fill="#1b8a5a"/>
            </svg>
            <div className="w-[22px] h-3 border-[1.5px] border-gray-500 rounded-sm relative flex items-center p-[1.5px]">
              <div className="w-[70%] h-full bg-gray-800 rounded-[1.5px]" />
              <div className="w-0.5 h-1.5 bg-gray-500 rounded absolute -right-[3px] top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
