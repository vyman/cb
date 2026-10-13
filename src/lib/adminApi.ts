import { supabase } from './supabase'
import type { Order } from '../data/orders'

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return (data ?? []).map(dbToOrder)
}

export async function adminUpdateOrder(orderId: string, patch: Partial<Order>): Promise<void> {
  const out: Record<string, unknown> = {}
  if (patch.status !== undefined) out.status = patch.status
  if (patch.quotedPrice !== undefined) out.quoted_price = patch.quotedPrice
  if (patch.estimatedDelivery !== undefined) out.estimated_delivery = patch.estimatedDelivery
  await supabase.from('orders').update(out).eq('id', orderId)
}

function dbToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    buyerName: row.buyer_name as string,
    businessType: row.business_type as string,
    commodityId: row.commodity_id as string,
    commodityName: row.commodity_name as string,
    commodityIcon: row.commodity_icon as string,
    varietyName: row.variety_name as string,
    grade: row.grade as string,
    quantity: Number(row.quantity),
    unit: row.unit as string,
    maxBudget: Number(row.max_budget),
    deliveryBy: row.delivery_by as string,
    notes: row.notes as string,
    status: row.status as Order['status'],
    quotedPrice: row.quoted_price ? Number(row.quoted_price) : undefined,
    estimatedDelivery: row.estimated_delivery as string | undefined,
    createdAt: row.created_at as string,
  }
}
