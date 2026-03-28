'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, ExternalLink, Calendar } from 'lucide-react'
import { DateRangeCalendar } from './date-range-calendar'

interface FormData {
  fullName: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: string
  message: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  checkIn?: string
  checkOut?: string
  guests?: string
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.fullName.trim()) errors.fullName = 'El nombre es obligatorio.'
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Ingresa un correo electrónico válido.'
  if (!data.phone.trim() || data.phone.trim().length < 7)
    errors.phone = 'Ingresa un número de teléfono válido.'
  if (!data.checkIn) errors.checkIn = 'Selecciona la fecha de llegada.'
  if (!data.checkOut) errors.checkOut = 'Selecciona la fecha de salida.'
  if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn)
    errors.checkOut = 'La salida debe ser posterior a la llegada.'
  if (!data.guests) errors.guests = 'Selecciona el número de huéspedes.'
  return errors
}

interface Props {
  onReservationChange?: (data: { checkIn: string; checkOut: string; guests: string }) => void
}

export default function ReservationForm({ onReservationChange }: Props) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set())
  const [loadingAvailability, setLoadingAvailability] = useState(true)
  const [showCalendar, setShowCalendar] = useState(true)

  // Fetch unavailable dates on mount
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      setLoadingAvailability(true)
      try {
        // Fetch for next 6 months
        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 6)
        
        const res = await fetch(
          `/api/bookings/availability?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`
        )
        if (res.ok) {
          const data = await res.json()
          setUnavailableDates(new Set(data.unavailable_dates || []))
        }
      } catch {
        // Silent fail - empty unavailable dates
      } finally {
        setLoadingAvailability(false)
      }
    }

    fetchUnavailableDates()
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    setFormData(updated)
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    // Notificar cambios en datos de reserva
    if (name === 'checkIn' || name === 'checkOut' || name === 'guests') {
      onReservationChange?.({
        checkIn: name === 'checkIn' ? value : updated.checkIn,
        checkOut: name === 'checkOut' ? value : updated.checkOut,
        guests: name === 'guests' ? value : updated.guests,
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Check if selected dates overlap with unavailable dates
    const hasUnavailableOverlap = () => {
      if (unavailableDates.size === 0) return false
      
      // Generate all dates in the selected range
      const [startYear, startMonth, startDay] = formData.checkIn.split('-').map(Number)
      const [endYear, endMonth, endDay] = formData.checkOut.split('-').map(Number)
      const current = new Date(startYear, startMonth - 1, startDay)
      const end = new Date(endYear, endMonth - 1, endDay)
      
      // Check each date in range (excluding checkout day - guest leaves that day)
      while (current < end) {
        const y = current.getFullYear()
        const m = String(current.getMonth() + 1).padStart(2, '0')
        const d = String(current.getDate()).padStart(2, '0')
        const dateStr = `${y}-${m}-${d}`
        
        if (unavailableDates.has(dateStr)) {
          return true
        }
        current.setDate(current.getDate() + 1)
      }
      return false
    }

    if (hasUnavailableOverlap()) {
      setSubmitError('Una o más fechas seleccionadas no están disponibles. Por favor, elige otras fechas.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/bookings/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: formData.fullName,
          guest_email: formData.email,
          guest_phone: formData.phone,
          check_in_date: formData.checkIn,
          check_out_date: formData.checkOut,
          number_of_guests: parseInt(formData.guests),
          special_requests: formData.message || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la reserva.')
      }

      setSuccessMessage(
        `¡Reserva recibida! Nos pondremos en contacto pronto a ${formData.email} para confirmar. Gracias.`
      )

      // Helper to parse YYYY-MM-DD without timezone issues
      const formatDateForDisplay = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
      }

      // Generate WhatsApp message link
      const checkInDate = formatDateForDisplay(formData.checkIn)
      const checkOutDate = formatDateForDisplay(formData.checkOut)
      const whatsappMessage = `Hola, estoy interesado en reservar ALAMAR BEACH HOUSE del ${checkInDate} al ${checkOutDate} para ${formData.guests} ${formData.guests === '1' ? 'persona' : 'personas'}. Mi nombre es ${formData.fullName} y mi correo es ${formData.email}. ${formData.message ? `Notas: ${formData.message}` : ''}`
      const whatsappUrl = `https://wa.me/573000000000?text=${encodeURIComponent(whatsappMessage)}`

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: '',
        message: '',
      })

      // Optionally open WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank')
      }, 1500)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Error inesperado. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBase =
    'w-full font-sans text-sm text-[#2C2C2C] bg-white border rounded-sm px-4 py-3 outline-none transition-colors placeholder:text-[#888880]'
  const inputClass = (field: keyof FormErrors) =>
    `${inputBase} ${errors[field] ? 'border-[#D97373] focus:border-[#D97373]' : 'border-[#E8E3D8] focus:border-[#1B4D5C]'}`

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
          Nombre completo <span className="text-[#D97373]">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Ej. María Fernanda Ospina"
          value={formData.fullName}
          onChange={handleChange}
          className={inputClass('fullName')}
        />
        {errors.fullName && <p className="font-sans text-xs text-[#D97373]">{errors.fullName}</p>}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
            Correo electrónico <span className="text-[#D97373]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            value={formData.email}
            onChange={handleChange}
            className={inputClass('email')}
          />
          {errors.email && <p className="font-sans text-xs text-[#D97373]">{errors.email}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
            Teléfono / WhatsApp <span className="text-[#D97373]">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+57 300 000 0000"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass('phone')}
          />
          {errors.phone && <p className="font-sans text-xs text-[#D97373]">{errors.phone}</p>}
        </div>
      </div>

      {/* Dates with Calendar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
            Selecciona tus fechas <span className="text-[#D97373]">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 font-sans text-xs text-[#1B4D5C] hover:text-[#2A6B7E] transition-colors"
          >
            <Calendar size={14} />
            {showCalendar ? 'Ocultar calendario' : 'Mostrar calendario'}
          </button>
        </div>

        {showCalendar && (
          <DateRangeCalendar
            checkIn={formData.checkIn}
            checkOut={formData.checkOut}
            onCheckInChange={(date) => {
              setFormData((prev) => ({ ...prev, checkIn: date }))
              setErrors((prev) => ({ ...prev, checkIn: undefined }))
              onReservationChange?.({ checkIn: date, checkOut: formData.checkOut, guests: formData.guests })
            }}
            onCheckOutChange={(date) => {
              setFormData((prev) => ({ ...prev, checkOut: date }))
              setErrors((prev) => ({ ...prev, checkOut: undefined }))
              onReservationChange?.({ checkIn: formData.checkIn, checkOut: date, guests: formData.guests })
            }}
            unavailableDates={unavailableDates}
            isLoading={loadingAvailability}
          />
        )}

        {/* Show validation errors for dates */}
        {(errors.checkIn || errors.checkOut) && (
          <div className="flex gap-4">
            {errors.checkIn && <p className="font-sans text-xs text-[#D97373]">{errors.checkIn}</p>}
            {errors.checkOut && <p className="font-sans text-xs text-[#D97373]">{errors.checkOut}</p>}
          </div>
        )}
      </div>

      {/* Guests */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="guests" className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
          Número de huéspedes <span className="text-[#D97373]">*</span>
        </label>
        <select
          id="guests"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          className={`${inputClass('guests')} cursor-pointer`}
        >
          <option value="">Selecciona...</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'persona' : 'personas'}
            </option>
          ))}
        </select>
        {errors.guests && <p className="font-sans text-xs text-[#D97373]">{errors.guests}</p>}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
          Mensaje adicional{' '}
          <span className="font-normal text-[#888880] normal-case tracking-normal">(opcional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Ocasión especial, necesidades particulares, preguntas..."
          value={formData.message}
          onChange={handleChange}
          className={`${inputBase} border-[#E8E3D8] focus:border-[#1B4D5C] resize-none`}
        />
      </div>

      {submitError && (
        <div className="bg-[#D97373]/10 border border-[#D97373]/30 rounded-sm px-4 py-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#D97373] flex-shrink-0 mt-0.5" />
          <p className="font-sans text-sm text-[#D97373]">{submitError}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-[#6B9C85]/10 border border-[#6B9C85] rounded-sm px-4 py-3 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#6B9C85] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-sans text-sm text-[#6B9C85]">{successMessage}</p>
            <p className="font-sans text-xs text-[#6B9C85] mt-2 flex items-center gap-1">
              Te redirigiremos a WhatsApp para confirmar rápidamente...
              <ExternalLink size={12} />
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || loadingAvailability}
        className="w-full bg-[#1B4D5C] text-white font-sans font-semibold text-sm px-8 py-4 rounded-sm tracking-wide hover:bg-[#2A6B7E] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Procesando tu reserva...' : 'Solicitar reserva'}
      </button>

      <p className="font-sans text-xs text-[#888880] text-center leading-relaxed">
        Te contactaremos por correo y WhatsApp para confirmar tu reserva. No hay costo por solicitar.
      </p>
    </form>
  )
}
