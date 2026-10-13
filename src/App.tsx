import { useState, useEffect } from 'react'
import Auth from './screens/Auth'
import Onboarding from './screens/Onboarding'
import HomeApp from './screens/HomeApp'
import AdminDashboard from './screens/admin/AdminDashboard'
import { supabase } from './lib/supabase'
import { getProfile, saveProfile, getOrders, addOrder as apiAddOrder } from './lib/api'
import type { Order } from './data/orders'
import type { Notification } from './data/notifications'

export interface UserProfile {
  name: string
  contactName: string
  phone: string
  location: string
  commodities: string[]
  businessType: string
}

type AppState = 'loading' | 'auth' | 'onboarding' | 'app' | 'admin'

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [adminEmail, setAdminEmail] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) loadUserData()
      else setAppState('auth')
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null); setOrders([]); setNotifications([])
        setAppState('auth')
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const loadUserData = async () => {
    setAppState('loading')
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      setAppState('auth')
      throw error
    }
    const user = data.user
    if (!user) { setAppState('auth'); return }

    // Admin check — add your admin email(s) here
    const ADMIN_EMAILS = ['vyman.huigere@gmail.com']
    if (ADMIN_EMAILS.includes(user.email ?? '')) {
      setAdminEmail(user.email ?? '')
      setAppState('admin')
      return
    }

    const [prof, ords] = await Promise.all([getProfile(), getOrders()])
    setOrders(ords)
    if (prof) { setProfile(prof); setAppState('app') }
    else setAppState('onboarding')
  }

  const handleOnboardingComplete = async (prof: UserProfile) => {
    await saveProfile(prof)
    setProfile(prof)
    setAppState('app')
  }

  const handleProfileUpdate = async (prof: UserProfile) => {
    setProfile(prof)
    await saveProfile(prof)
  }

  const addOrder = async (partial: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const id = `ORD-${String(orders.length + 1).padStart(3, '0')}`
    const order: Order = { ...partial, id, status: 'open', createdAt: new Date().toISOString() }
    setOrders(prev => [order, ...prev])
    pushNotif({
      type: 'order_received',
      title: 'Order Received',
      body: `We got your request for ${partial.quantity}${partial.unit} ${partial.varietyName}. Our team is on it — we'll update you within 24 hrs.`,
      orderId: id,
      forRole: 'buyer',
    })
    await apiAddOrder(order)
  }

  const pushNotif = (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications(prev => [{ ...n, id: `N-${Date.now()}`, createdAt: new Date().toISOString(), read: false }, ...prev])
  }

  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const signOut = () => supabase.auth.signOut()

  if (appState === 'loading') return <Spinner />
  if (appState === 'auth') return <Auth onAuth={loadUserData} />
  if (appState === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} />
  if (appState === 'admin') return <AdminDashboard adminEmail={adminEmail} onSignOut={signOut} />

  return (
    <HomeApp
      profile={profile!}
      onProfileUpdate={handleProfileUpdate}
      orders={orders}
      notifications={notifications}
      onAddOrder={addOrder}
      onMarkRead={markRead}
      onMarkAllRead={markAllRead}
      onSignOut={signOut}
    />
  )
}

function Spinner() {
  return (
    <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-[#f0faf5] rounded-2xl flex items-center justify-center text-2xl">☕</div>
        <div className="w-5 h-5 border-2 border-[#c8ddd4] border-t-[#1b8a5a] rounded-full animate-spin" />
      </div>
    </div>
  )
}
