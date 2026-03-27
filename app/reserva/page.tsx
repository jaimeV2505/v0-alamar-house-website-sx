'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import ReservationForm from '@/components/booking/reservation-form'
import SummaryPanel from '@/components/booking/summary-panel'

interface ReservationData {
  checkIn: string
  checkOut: string
  guests: string
}

export default function ReservaPage() {
  const [reservationData, setReservationData] = useState<ReservationData>({
    checkIn: '',
    checkOut: '',
    guests: '',
  })

  return (
    <>
      <Navbar />
      <main className="bg-[#FAFAF8] min-h-screen">
        {/* Page header */}
        <div className="bg-[#1B4D5C] pt-28 pb-14 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6">
              <Link href="/" className="font-sans text-xs text-white/60 hover:text-white/90 transition-colors">
                Inicio
              </Link>
              <ChevronRight size={12} className="text-white/40" />
              <span className="font-sans text-xs text-white/90">Reservar</span>
            </nav>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-[#D4A574]" />
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
                Reserva online
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold text-balance">
              Solicita tu estadía<br />en ALAMAR HOUSE
            </h1>
            <p className="mt-4 font-sans text-base text-white/70 max-w-xl leading-relaxed">
              Completa el formulario para solicitar tu reserva. Nos pondremos en contacto vía correo y WhatsApp para confirmar disponibilidad.
            </p>
          </div>
        </div>

        {/* Form + Summary */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            <div>
              <div className="mb-8">
                <h2 className="font-serif text-2xl text-[#2C2C2C] font-bold mb-2">
                  Datos de tu reserva
                </h2>
                <p className="font-sans text-sm text-[#666666]">
                  Todos los campos marcados con <span className="text-[#D97373]">*</span> son obligatorios.
                </p>
              </div>
              <div className="bg-white border border-[#E8E3D8] rounded-lg p-8">
              <ReservationForm onReservationChange={setReservationData} />
            </div>
            </div>
            <div>
              <SummaryPanel reservationData={reservationData} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
