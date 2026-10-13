import { supabase } from './supabase'
import type { Order } from '../data/orders'
import type { UserProfile } from '../App'

// ── Profiles ──────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  if (!data) return null
  return {
    name: data.name,
    contactName: data.contact_name,
    phone: data.phone,
    location: data.location,
    commodities: data.commodities ?? [],
    businessType: data.business_type,
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('profiles').upsert({
    id: user.id,
    name: profile.name,
    contact_name: profile.contactName,
    phone: profile.phone,
    location: profile.location,
    commodities: profile.commodities,
    business_type: profile.businessType,
  })
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return (data ?? []).map(dbToOrder)
}

export async function addOrder(order: Order): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('orders').insert(orderToDb(order, user.id, user.email ?? ''))
}

export async function updateOrderStatus(orderId: string, patch: Partial<Order>): Promise<void> {
  await supabase.from('orders').update(patchToDb(patch)).eq('id', orderId)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function orderToDb(order: Order, userId: string, email: string) {
  return {
    id: order.id,
    user_id: userId,
    buyer_email: email,
    buyer_name: order.buyerName,
    business_type: order.businessType,
    commodity_id: order.commodityId,
    commodity_name: order.commodityName,
    commodity_icon: order.commodityIcon,
    variety_name: order.varietyName,
    grade: order.grade,
    quantity: order.quantity,
    unit: order.unit,
    max_budget: order.maxBudget,
    delivery_by: order.deliveryBy,
    notes: order.notes,
    status: order.status,
    quoted_price: order.quotedPrice ?? null,
    created_at: order.createdAt,
  }
}

function patchToDb(patch: Partial<Order>) {
  const out: Record<string, unknown> = {}
  if (patch.status !== undefined) out.status = patch.status
  if (patch.quotedPrice !== undefined) out.quoted_price = patch.quotedPrice
  if (patch.estimatedDelivery !== undefined) out.estimated_delivery = patch.estimatedDelivery
  return out
}
