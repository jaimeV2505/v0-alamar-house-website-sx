'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CheckCircle, Clock, XCircle, MessageSquare, Calendar } from 'lucide-react'

interface BookingRequest {
  id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in_date: string
  check_out_date: string
  number_of_guests: number
  special_requests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  admin_notes?: string
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<BookingRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending')
  const [blockingDates, setBlockingDates] = useState(false)

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  async function fetchBooking() {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setBooking(data.booking)
      setAdminNotes(data.booking?.admin_notes || '')
      setStatus(data.booking?.status || 'pending')
    } catch (err) {
      console.error('Error fetching booking:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(newStatus: 'pending' | 'confirmed' | 'cancelled') {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, admin_notes: adminNotes }),
      })

      if (!res.ok) throw new Error('Failed to update')
      const data = await res.json()
      setBooking(data.booking)
      setStatus(data.booking.status)
    } catch (err) {
      console.error('Error updating booking:', err)
      alert('Error al actualizar la reserva')
    } finally {
      setUpdating(false)
    }
  }

  async function handleSaveNotes() {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes, status }),
      })

      if (!res.ok) throw new Error('Failed to update')
      const data = await res.json()
      setBooking(data.booking)
    } catch (err) {
      console.error('Error updating notes:', err)
      alert('Error al guardar notas')
    } finally {
      setUpdating(false)
    }
  }

  async function handleBlockDates() {
    if (!booking || !confirm('¿Bloquear estas fechas en el calendario?')) return

    setBlockingDates(true)
    try {
      const res = await fetch('/api/admin/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_date: booking.check_in_date,
          end_date: booking.check_out_date,
          block_type: 'confirmed',
          notes: `Reserva de ${booking.guest_name}`,
          booking_request_id: bookingId,
        }),
      })

      if (!res.ok) throw new Error('Failed to block dates')
      alert('Fechas bloqueadas correctamente')
    } catch (err) {
      console.error('Error blocking dates:', err)
      alert('Error al bloquear fechas')
    } finally {
      setBlockingDates(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] p-6 flex items-center justify-center">
        <p className="font-sans text-sm text-[#888880]">Cargando...</p>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] p-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-[#1B4D5C] hover:text-[#2A6B7E] mb-8">
          <ChevronLeft size={20} />
          <span className="font-sans text-sm">Volver</span>
        </Link>
        <p className="font-sans text-sm text-[#888880]">Reserva no encontrada</p>
      </div>
    )
  }

  const statusColors = {
    pending: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: Clock },
    confirmed: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle },
    cancelled: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: XCircle },
  }

  const statusInfo = statusColors[status]
  const StatusIcon = statusInfo.icon
  const nights = Math.ceil((new Date(booking.check_out_date).getTime() - new Date(booking.check_in_date).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 py-8">
        {/* Back button */}
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[#1B4D5C] hover:text-[#2A6B7E] mb-8">
          <ChevronLeft size={20} />
          <span className="font-sans text-sm">Volver a reservas</span>
        </Link>

        {/* Main card */}
        <div className={`${statusInfo.bg} border ${statusInfo.border} rounded-lg p-8 mb-8`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusIcon className={`w-6 h-6 ${statusInfo.text}`} />
                <h1 className="font-serif text-3xl font-bold text-[#2C2C2C]">{booking.guest_name}</h1>
              </div>
              <p className="font-sans text-sm text-[#666666]">
                Creada el {new Date(booking.created_at).toLocaleDateString('es-CO', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Status selector */}
            <div className="flex gap-2">
              {(['pending', 'confirmed', 'cancelled'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating}
                  className={`font-sans text-xs px-3 py-2 rounded-lg transition-colors font-medium ${
                    status === s
                      ? 'bg-white text-[#1B4D5C] border-2 border-[#1B4D5C]'
                      : 'bg-white/50 text-[#666666] hover:bg-white disabled:opacity-50'
                  }`}
                >
                  {s === 'pending' ? 'Pendiente' : s === 'confirmed' ? 'Confirmar' : 'Cancelar'}
                </button>
              ))}
            </div>
          </div>

          {/* Guest info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="font-sans text-xs text-[#666666] uppercase tracking-wide mb-2">Correo</p>
              <a href={`mailto:${booking.guest_email}`} className="font-sans font-semibold text-[#1B4D5C] hover:underline">
                {booking.guest_email}
              </a>
            </div>
            <div>
              <p className="font-sans text-xs text-[#666666] uppercase tracking-wide mb-2">WhatsApp</p>
              <a
                href={`https://wa.me/${booking.guest_phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-semibold text-[#1B4D5C] hover:underline flex items-center gap-1"
              >
                {booking.guest_phone}
              </a>
            </div>
            <div>
              <p className="font-sans text-xs text-[#666666] uppercase tracking-wide mb-2">Huéspedes</p>
              <p className="font-sans font-semibold text-[#2C2C2C]">{booking.number_of_guests}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/50">
            <div>
              <p className="font-sans text-xs text-[#666666] uppercase tracking-wide mb-2">Llegada</p>
              <p className="font-serif text-lg font-bold text-[#2C2C2C]">
                {new Date(booking.check_in_date).toLocaleDateString('es-CO', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="font-sans text-xs text-[#666666] uppercase tracking-wide mb-2">Salida</p>
              <p className="font-serif text-lg font-bold text-[#2C2C2C]">
                {new Date(booking.check_out_date).toLocaleDateString('es-CO', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="font-sans text-xs text-[#666666] uppercase tracking-wide mb-2">Noches</p>
              <p className="font-serif text-lg font-bold text-[#2C2C2C]">{nights}</p>
            </div>
          </div>

          {/* Block dates button */}
          {status === 'confirmed' && (
            <button
              onClick={handleBlockDates}
              disabled={blockingDates}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#1B4D5C]/10 text-[#1B4D5C] rounded-lg hover:bg-[#1B4D5C]/20 transition-colors font-sans text-sm font-semibold disabled:opacity-50"
            >
              <Calendar size={16} />
              {blockingDates ? 'Bloqueando...' : 'Bloquear estas fechas'}
            </button>
          )}
        </div>

        {/* Special requests */}
        {booking.special_requests && (
          <div className="bg-white rounded-lg border border-[#E8E3D8] p-6 mb-8">
            <h3 className="font-serif text-lg font-bold text-[#2C2C2C] mb-3 flex items-center gap-2">
              <MessageSquare size={20} />
              Solicitudes especiales
            </h3>
            <p className="font-sans text-sm text-[#2C2C2C] whitespace-pre-wrap">{booking.special_requests}</p>
          </div>
        )}

        {/* Admin notes */}
        <div className="bg-white rounded-lg border border-[#E8E3D8] p-6">
          <h3 className="font-serif text-lg font-bold text-[#2C2C2C] mb-3">Notas internas</h3>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={5}
            placeholder="Añade notas sobre esta reserva..."
            className="w-full font-sans text-sm border border-[#E8E3D8] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1B4D5C] focus:border-transparent resize-none"
          />
          <button
            onClick={handleSaveNotes}
            disabled={updating}
            className="mt-4 font-sans text-sm font-semibold px-6 py-2 bg-[#1B4D5C] text-white rounded-lg hover:bg-[#2A6B7E] transition-colors disabled:opacity-50"
          >
            {updating ? 'Guardando...' : 'Guardar notas'}
          </button>
        </div>
      </div>
    </div>
  )
}
