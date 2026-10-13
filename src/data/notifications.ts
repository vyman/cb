export type NotifType =
  | 'order_received'
  | 'sourcing_started'
  | 'testing_started'
  | 'order_confirmed'
  | 'order_fulfilled'
  | 'order_cancelled'
  | 'price_alert'

export interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  orderId?: string
  createdAt: string
  read: boolean
  forRole: 'buyer'
}

export const NOTIF_META: Record<NotifType, { icon: string; color: string; bg: string }> = {
  order_received:  { icon: '📋', color: '#b45309', bg: '#fefce8' },
  sourcing_started:{ icon: '🔍', color: '#2563eb', bg: '#eff6ff' },
  testing_started: { icon: '🔬', color: '#7c3aed', bg: '#f5f3ff' },
  order_confirmed: { icon: '✅', color: '#1b8a5a', bg: '#f0faf5' },
  order_fulfilled: { icon: '🎉', color: '#1b8a5a', bg: '#dcfce7' },
  order_cancelled: { icon: '❌', color: '#6b7280', bg: '#f3f4f6' },
  price_alert:     { icon: '📈', color: '#b45309', bg: '#fefce8' },
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'N-001',
    type: 'sourcing_started',
    title: 'We\'re on it — Sourcing Started',
    body: 'Our team is sourcing your cardamom order (ORD-002). We\'ll confirm a price and delivery date within 12 hrs.',
    orderId: 'ORD-002',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    read: false,
    forRole: 'buyer',
  },
  {
    id: 'N-002',
    type: 'testing_started',
    title: 'Quality Check Underway',
    body: 'We received a vanilla batch for ORD-003. Lab testing in progress — results within 24–48 hrs. We\'ll notify you immediately.',
    orderId: 'ORD-003',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    read: false,
    forRole: 'buyer',
  },
  {
    id: 'N-003',
    type: 'order_received',
    title: 'Order Received',
    body: 'We got your Arabica SCA 85+ request (ORD-001). Our sourcing team will reach out if we need clarification.',
    orderId: 'ORD-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    read: true,
    forRole: 'buyer',
  },
]
