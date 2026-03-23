'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculatePrice, PricingResult } from '@/lib/pricing'

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
  onPricingChange: (pricing: PricingResult | null) => void
}

export default function ReservationForm({ onPricingChange }: Props) {
  const router = useRouter()
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    setFormData(updated)
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (
      (name === 'checkIn' || name === 'checkOut') &&
      updated.checkIn &&
      updated.checkOut &&
      updated.checkOut > updated.checkIn
    ) {
      onPricingChange(calculatePrice(new Date(updated.checkIn), new Date(updated.checkOut)))
    } else if (name === 'checkIn' || name === 'checkOut') {
      onPricingChange(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/wompi/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al procesar la reserva.')
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        router.push(`/pago/resultado?status=pending&reference=${data.reference}`)
      }
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

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
          Nombre completo <span className="text-[#D97373]">*</span>
        </label>
        <input
          id="fullName" name="fullName" type="text" autoComplete="name"
          placeholder="Ej. María Fernanda Ospina"
          value={formData.fullName} onChange={handleChange}
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
            id="email" name="email" type="email" autoComplete="email"
            placeholder="tu@correo.com"
            value={formData.email} onChange={handleChange}
            className={inputClass('email')}
          />
          {errors.email && <p className="font-sans text-xs text-[#D97373]">{errors.email}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
            Teléfono / WhatsApp <span className="text-[#D97373]">*</span>
          </label>
          <input
            id="phone" name="phone" type="tel" autoComplete="tel"
            placeholder="+57 300 000 0000"
            value={formData.phone} onChange={handleChange}
            className={inputClass('phone')}
          />
          {errors.phone && <p className="font-sans text-xs text-[#D97373]">{errors.phone}</p>}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="checkIn" className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
            Fecha de llegada <span className="text-[#D97373]">*</span>
          </label>
          <input
            id="checkIn" name="checkIn" type="date" min={today}
            value={formData.checkIn} onChange={handleChange}
            className={inputClass('checkIn')}
          />
          {errors.checkIn && <p className="font-sans text-xs text-[#D97373]">{errors.checkIn}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="checkOut" className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
            Fecha de salida <span className="text-[#D97373]">*</span>
          </label>
          <input
            id="checkOut" name="checkOut" type="date" min={formData.checkIn || today}
            value={formData.checkOut} onChange={handleChange}
            className={inputClass('checkOut')}
          />
          {errors.checkOut && <p className="font-sans text-xs text-[#D97373]">{errors.checkOut}</p>}
        </div>
      </div>

      {/* Guests */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="guests" className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">
          Número de huéspedes <span className="text-[#D97373]">*</span>
        </label>
        <select
          id="guests" name="guests"
          value={formData.guests} onChange={handleChange}
          className={`${inputClass('guests')} cursor-pointer`}
        >
          <option value="">Selecciona...</option>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
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
          id="message" name="message" rows={4}
          placeholder="Ocasión especial, necesidades particulares, preguntas..."
          value={formData.message} onChange={handleChange}
          className={`${inputBase} border-[#E8E3D8] focus:border-[#1B4D5C] resize-none`}
        />
      </div>

      {submitError && (
        <div className="bg-[#D97373]/10 border border-[#D97373]/30 rounded-sm px-4 py-3">
          <p className="font-sans text-sm text-[#D97373]">{submitError}</p>
        </div>
      )}

      <button
        type="submit" disabled={isSubmitting}
        className="w-full bg-[#1B4D5C] text-white font-sans font-semibold text-sm px-8 py-4 rounded-sm tracking-wide hover:bg-[#2A6B7E] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Procesando...' : 'Continuar al pago con Wompi'}
      </button>

      <p className="font-sans text-xs text-[#888880] text-center leading-relaxed">
        Al reservar aceptas nuestras políticas de cancelación. El pago es procesado de forma segura por Wompi.
      </p>
    </form>
  )
}
