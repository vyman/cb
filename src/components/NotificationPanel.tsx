import type { Notification } from '../data/notifications'
import { NOTIF_META } from '../data/notifications'

interface Props {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onClose: () => void
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onClose }: Props) {
  const unread = notifications.filter(n => !n.read).length

  return (
    <>
      <div className="absolute inset-0 bg-black/20 z-20" onClick={onClose} />
      <div className="absolute top-0 left-0 right-0 lg:top-20 lg:left-auto lg:right-8 lg:w-96 z-30 bg-white shadow-2xl rounded-b-3xl lg:rounded-2xl overflow-hidden" style={{ maxHeight: '78%' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4eae7]">
          <div>
            <p className="text-sm font-bold text-gray-900">Updates from SourceTrade</p>
            {unread > 0 && <p className="text-[10px] text-[#8a9e96]">{unread} unread</p>}
          </div>
          <div className="flex items-center gap-3">
            {unread > 0 && (
              <button onClick={onMarkAllRead} className="text-[11px] font-semibold text-[#1b8a5a]">Mark all read</button>
            )}
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#f0f4f2] flex items-center justify-center text-[#8a9e96] text-lg leading-none">×</button>
          </div>
        </div>

        {/* Notifications */}
        <div className="overflow-y-auto" style={{ maxHeight: '55vh' }}>
          {notifications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">🔔</p>
              <p className="text-sm font-semibold text-gray-900">All caught up</p>
              <p className="text-xs text-[#8a9e96] mt-1">We'll notify you every time your order status changes</p>
            </div>
          )}

          {notifications.map((n, i) => {
            const meta = NOTIF_META[n.type]
            return (
              <button key={n.id} onClick={() => onMarkRead(n.id)}
                className={`w-full flex items-start gap-3 px-5 py-4 text-left ${!n.read ? 'bg-[#f9fbfa]' : 'bg-white'} ${i > 0 ? 'border-t border-[#f0f4f2]' : ''}`}>
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shrink-0 mt-0.5" style={{ background: meta.bg }}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-xs font-bold truncate ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                    <span className="text-[9px] text-[#b0bdb8] shrink-0">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-[#6a8a7a] leading-relaxed">{n.body}</p>
                  {n.orderId && <p className="text-[10px] font-semibold mt-1" style={{ color: meta.color }}>{n.orderId}</p>}
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[#1b8a5a] shrink-0 mt-2" />}
              </button>
            )
          })}
        </div>

      </div>
    </>
  )
}
