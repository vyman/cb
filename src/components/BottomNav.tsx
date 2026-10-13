type Tab = 'home' | 'market' | 'profile'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <div className="bg-white border-t border-[#e4eae7] flex items-center justify-around px-2 py-2.5 pb-4 shrink-0">
      <NavBtn
        label="Prices"
        active={active === 'home'}
        onClick={() => onChange('home')}
        icon={
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3 9.5L11 3L19 9.5V19C19 19.6 18.6 20 18 20H14V15H8V20H4C3.4 20 3 19.6 3 19V9.5Z"
              fill={active === 'home' ? '#1b8a5a' : 'none'}
              stroke={active === 'home' ? '#1b8a5a' : '#8a9e96'}
              strokeWidth="1.5"
            />
          </svg>
        }
      />
      <NavBtn
        label="Market"
        active={active === 'market'}
        onClick={() => onChange('market')}
        icon={
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polyline points="3,16 8,10 12,13 19,5" stroke={active === 'market' ? '#1b8a5a' : '#8a9e96'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="19" cy="5" r="2" fill={active === 'market' ? '#1b8a5a' : '#8a9e96'}/>
          </svg>
        }
      />
      <NavBtn
        label="Profile"
        active={active === 'profile'}
        onClick={() => onChange('profile')}
        icon={
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="7" r="4" fill={active === 'profile' ? '#1b8a5a' : 'none'} stroke={active === 'profile' ? '#1b8a5a' : '#8a9e96'} strokeWidth="1.5"/>
            <path d="M3 19C3 15.7 6.6 13 11 13C15.4 13 19 15.7 19 19" stroke={active === 'profile' ? '#1b8a5a' : '#8a9e96'} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        }
      />
    </div>
  )
}

function NavBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer px-3">
      {icon}
      <span className="text-[10px] font-medium" style={{ color: active ? '#1b8a5a' : '#8a9e96' }}>{label}</span>
    </button>
  )
}
