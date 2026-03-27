'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Copy, MessageCircle, Calendar, CheckCircle, Clock, XCircle, MoreVertical } from 'lucide-react'
import Link from 'next/link'

interface BookingRequest {
  id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in_date: string
  check_out_date: string
  number_of_guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  admin_notes?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      const res = await fetch('/api/admin/bookings')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const filteredBookings = bookings.filter((b) => filter === 'all' || b.status === filter)

  const handleCopyPhoneLink = (phone: string, bookingId: string) => {
    const whatsappLink = `https://wa.me/${phone.replace(/\D/g, '')}`
    navigator.clipboard.writeText(whatsappLink)
    setCopied(bookingId)
    setTimeout(() => setCopied(null), 2000)
  }

  const statusCounts = {
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  const statusColors = {
    pending: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: Clock },
    confirmed: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle },
    cancelled: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: XCircle },
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E3D8] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex flex-col leading-none">
            <span className="font-serif text-2xl font-bold text-[#1B4D5C]">ALAMAR</span>
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-[#D4A574]">Admin</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/admin/calendar"
              className="font-sans text-sm text-[#2C2C2C] hover:text-[#1B4D5C] transition-colors flex items-center gap-2"
            >
              <Calendar size={18} />
              Calendario
            </Link>
            <button
              onClick={handleLogout}
              className="font-sans text-sm text-[#D97373] hover:text-[#B85858] transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              Salir
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-[#2C2C2C] mb-2">Reservas</h1>
          <p className="font-sans text-sm text-[#888880]">Gestiona las solicitudes de reserva</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-[#E8E3D8] p-6 mb-8">
          <div className="flex flex-wrap gap-3 mb-4">
            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-sans text-sm px-4 py-2 rounded-lg transition-colors ${
                  filter === f
                    ? 'bg-[#1B4D5C] text-white'
                    : 'bg-[#F5F0E8] text-[#2C2C2C] hover:bg-[#E8E3D8]'
                }`}
              >
                {f === 'all'
                  ? `Todas (${bookings.length})`
                  : f === 'pending'
                    ? `Pendientes (${statusCounts.pending})`
                    : f === 'confirmed'
                      ? `Confirmadas (${statusCounts.confirmed})`
                      : `Canceladas (${statusCounts.cancelled})`}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-[#888880]">Cargando...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E8E3D8] p-8 text-center">
            <p className="font-sans text-sm text-[#888880]">No hay reservas para mostrar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusInfo = statusColors[booking.status]
              const StatusIcon = statusInfo.icon

              return (
                <div
                  key={booking.id}
                  className={`${statusInfo.bg} border ${statusInfo.border} rounded-lg p-6 flex items-start justify-between hover:shadow-md transition-shadow`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <StatusIcon className={`w-5 h-5 ${statusInfo.text}`} />
                      <h3 className="font-serif text-lg font-bold text-[#2C2C2C]">{booking.guest_name}</h3>
                      <span className={`font-sans text-xs px-3 py-1 rounded-full ${statusInfo.text} bg-white/50 font-medium`}>
                        {booking.status === 'pending' ? 'Pendiente' : booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="font-sans text-xs text-[#666666] uppercase tracking-wide mb-1">Llegada</p>
                        <p className="font-sans font-semibold text-[#2C2C2C]">
                          {new Date(booking.check_in_date).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-xs text-[#666666] uppercase tracking-wide mb-1">Salida</p>
                        <p className="font-sans font-semibold text-[#2C2C2C]">
                          {new Date(booking.check_out_date).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-xs text-[#666666] uppercase tracking-wide mb-1">Huéspedes</p>
                        <p className="font-sans font-semibold text-[#2C2C2C]">{booking.number_of_guests}</p>
                      </div>
                      <div>
                        <p className="font-sans text-xs text-[#666666] uppercase tracking-wide mb-1">Noches</p>
                        <p className="font-sans font-semibold text-[#2C2C2C]">
                          {Math.ceil((new Date(booking.check_out_date).getTime() - new Date(booking.check_in_date).getTime()) / (1000 * 60 * 60 * 24))}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCopyPhoneLink(booking.guest_phone, booking.id)}
                        className="font-sans text-sm flex items-center gap-1 px-3 py-1 rounded-md bg-white/30 hover:bg-white/50 transition-colors"
                        title="Copiar enlace de WhatsApp"
                      >
                        <Copy size={14} />
                        {copied === booking.id ? 'Copiado' : 'Copiar link'}
                      </button>
                      <a
                        href={`https://wa.me/${booking.guest_phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-sans text-sm flex items-center gap-1 px-3 py-1 rounded-md ${statusInfo.text} hover:opacity-75 transition-opacity`}
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </a>
                      <a href={`mailto:${booking.guest_email}`} className={`font-sans text-sm ${statusInfo.text} hover:underline`}>
                        {booking.guest_email}
                      </a>
                    </div>
                  </div>

                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="font-sans text-sm font-semibold text-[#1B4D5C] hover:text-[#2A6B7E] ml-6 whitespace-nowrap"
                  >
                    Ver detalles →
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
