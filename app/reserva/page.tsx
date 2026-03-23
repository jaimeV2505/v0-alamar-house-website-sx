'use client'

import { useState } from 'react'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import { ReservationForm } from '@/components/booking/reservation-form'
import { SummaryPanel } from '@/components/booking/summary-panel'
import { calculatePrice, calculateNights } from '@/lib/pricing'
import { useRouter } from 'next/navigation'

export default function ReservaPage() {
  const router = useRouter()
  const [pricing, setPricing] = useState({
    nights: 0,
    pricePerNight: 0,
    total: 0,
    isHighSeason: false,
    seasonLabel: 'Temporada regular',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handlePricingChange = (dates: { checkIn: Date; checkOut: Date }) => {
    const result = calculatePrice(dates.checkIn, dates.checkOut)
    setPricing({
      nights: result.nights,
      pricePerNight: result.pricePerNight,
      total: result.totalEstimated,
      isHighSeason: result.isHighSeason,
      seasonLabel: result.seasonLabel,
    })
  }

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      // Send form data to create a checkout session with Wompi
      const response = await fetch('/api/wompi/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nights: pricing.nights,
          totalAmount: pricing.total,
          pricePerNight: pricing.pricePerNight,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('[v0] Checkout error:', error)
        throw new Error(error.message || 'Error creating checkout')
      }

      const { checkoutUrl } = await response.json()
      console.log('[v0] Redirecting to checkout:', checkoutUrl)
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('[v0] Submission error:', error)
      alert('Error al procesar la reserva. Por favor intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              Reserva ALAMAR HOUSE
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              Completa el formulario y procede al pago de forma segura. Nuestro equipo
              confirmará tu reserva en las próximas 24 horas.
            </p>
          </div>

          {/* Booking Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form (2 columns on large screens) */}
            <div className="lg:col-span-2">
              <ReservationForm
                onPricingChange={handlePricingChange}
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
              />
            </div>

            {/* Summary Panel (1 column on large screens, sticky) */}
            <div className="lg:col-span-1">
              <SummaryPanel
                nights={pricing.nights}
                pricePerNight={pricing.pricePerNight}
                total={pricing.total}
                isHighSeason={pricing.isHighSeason}
                seasonLabel={pricing.seasonLabel}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
