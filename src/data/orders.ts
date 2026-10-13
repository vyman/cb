export type OrderStatus =
  | 'open'       // received by platform, sourcing in progress
  | 'sourcing'   // team actively sourcing from channels
  | 'testing'    // sample received, quality check underway
  | 'confirmed'  // test passed, awaiting payment confirmation
  | 'fulfilled'  // delivered
  | 'cancelled'  // cancelled by buyer or platform

export interface Order {
  id: string
  buyerName: string
  businessType: string
  commodityId: string
  commodityName: string
  commodityIcon: string
  varietyName: string
  grade: string
  quantity: number
  unit: string
  maxBudget: number
  deliveryBy: string
  notes: string
  status: OrderStatus
  quotedPrice?: number     // price platform confirmed
  estimatedDelivery?: string
  createdAt: string
}

export const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; step: number; platformNote: string }> = {
  open:      { label: 'Received',   color: '#b45309', bg: '#fefce8', step: 1, platformNote: 'We received your order and our team is reviewing it.' },
  sourcing:  { label: 'Sourcing',   color: '#2563eb', bg: '#eff6ff', step: 2, platformNote: 'We\'re actively sourcing this from our network.' },
  testing:   { label: 'Testing',    color: '#7c3aed', bg: '#f5f3ff', step: 3, platformNote: 'Sample received. Quality check underway — results in 24–48 hrs.' },
  confirmed: { label: 'Confirmed',  color: '#1b8a5a', bg: '#f0faf5', step: 4, platformNote: 'Quality verified. Awaiting your payment to dispatch.' },
  fulfilled: { label: 'Delivered',  color: '#1b8a5a', bg: '#dcfce7', step: 5, platformNote: 'Order delivered. Thank you for using SourceTrade!' },
  cancelled: { label: 'Cancelled',  color: '#6b7280', bg: '#f3f4f6', step: 0, platformNote: 'This order was cancelled.' },
}

export const PIPELINE_STEPS = ['Received', 'Sourcing', 'Testing', 'Confirmed', 'Delivered']

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    buyerName: 'Blue Tokai Roasters',
    businessType: 'Roastery',
    commodityId: 'coffee',
    commodityName: 'Coffee',
    commodityIcon: '☕',
    varietyName: 'Arabica SCA 85+',
    grade: 'Specialty',
    quantity: 50,
    unit: 'kg',
    maxBudget: 500,
    deliveryBy: '2026-10-05',
    notes: 'Prefer Coorg or Chikmagalur origin. Moisture < 12%.',
    status: 'open',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'ORD-002',
    buyerName: 'Blue Tokai Roasters',
    businessType: 'Roastery',
    commodityId: 'cardamom',
    commodityName: 'Cardamom',
    commodityIcon: '🫛',
    varietyName: 'Green Bold',
    grade: 'AGEB',
    quantity: 10,
    unit: 'kg',
    maxBudget: 1700,
    deliveryBy: '2026-09-30',
    notes: 'Need lab certificate. No bleaching.',
    status: 'sourcing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'ORD-003',
    buyerName: 'Blue Tokai Roasters',
    businessType: 'Roastery',
    commodityId: 'vanilla',
    commodityName: 'Vanilla',
    commodityIcon: '🌿',
    varietyName: 'Grade A Pods',
    grade: 'Gourmet',
    quantity: 2,
    unit: 'kg',
    maxBudget: 4500,
    deliveryBy: '2026-10-10',
    notes: 'Madagascar or Kerala origin preferred.',
    status: 'testing',
    quotedPrice: 4200,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
]
