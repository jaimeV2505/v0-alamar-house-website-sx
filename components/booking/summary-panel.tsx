import { Check, Calendar, TrendingUp, Lock } from 'lucide-react'

interface ReservationData {
  checkIn: string
  checkOut: string
  guests: string
}

interface Props {
  reservationData?: ReservationData
}

function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function formatDateRange(checkIn: string, checkOut: string): string {
  if (!checkIn || !checkOut) return ''
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const startStr = start.toLocaleDateString('es-CO', options).replace('.', '')
  const endStr = end.toLocaleDateString('es-CO', options).replace('.', '')
  return `${startStr} → ${endStr}`
}

export default function SummaryPanel({ reservationData }: Props) {
  const nights = reservationData ? calculateNights(reservationData.checkIn, reservationData.checkOut) : 0
  const dateRange = reservationData ? formatDateRange(reservationData.checkIn, reservationData.checkOut) : ''
  const hasReservationData = reservationData?.checkIn && reservationData?.checkOut && reservationData?.guests
  return (
    <div className="sticky top-24 flex flex-col gap-6">
      {/* Property card */}
      <div className="rounded-lg overflow-hidden border border-[#E8E3D8]">
        <div className="relative h-44">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-vogXatJj9UKprZOYTZvsHMcZ3sqxsR.jpeg"
            alt="ALAMAR BEACH HOUSE exterior con piscina"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4D5C]/70 to-transparent flex items-end p-5">
            <div>
              <p className="font-serif text-lg text-white font-bold">ALAMAR BEACH HOUSE</p>
              <p className="font-sans text-xs text-white/70">Playa Blanca, San Antero · Colombia</p>
            </div>
          </div>
        </div>
        <div className="bg-white px-5 py-4 flex items-center justify-between border-t border-[#E8E3D8]">
          {[
            { value: '4', label: 'Hab.' },
            { value: '5', label: 'Baños' },
            { value: '12', label: 'Pers.' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="font-serif text-lg font-bold text-[#1B4D5C]">{item.value}</span>
              <span className="font-sans text-xs text-[#888880]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing summary */}
      <div className="bg-white border border-[#E8E3D8] rounded-lg p-6 flex flex-col gap-4">
        <p className="font-sans text-xs font-semibold uppercase tracking-wide text-[#888880]">
          Resumen de tu reserva
        </p>

        {hasReservationData ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#F5F0E8] shrink-0">
                <Calendar size={15} className="text-[#1B4D5C]" />
              </div>
              <div className="flex-1">
                <p className="font-sans text-xs text-[#888880]">Fechas</p>
                <p className="font-sans text-sm font-semibold text-[#2C2C2C]">
                  {nights} {nights === 1 ? 'noche' : 'noches'} · {dateRange}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#F5F0E8] shrink-0">
                <TrendingUp size={15} className="text-[#1B4D5C]" />
              </div>
              <div className="flex-1">
                <p className="font-sans text-xs text-[#888880]">Huéspedes</p>
                <p className="font-sans text-sm font-semibold text-[#2C2C2C]">
                  {reservationData?.guests} {reservationData?.guests === '1' ? 'persona' : 'personas'}
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-[#E8E3D8]" />

            <div className="flex flex-col gap-2 bg-[#F5F0E8] rounded-md p-3">
              {['Limpieza incluida', 'Personal de apoyo para aseo', 'Apoyo en cocina con víveres del huésped'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={12} className="text-[#7BA696] shrink-0" />
                  <span className="font-sans text-xs text-[#666666]">{item}</span>
                </div>
              ))}
            </div>

            <p className="font-sans text-xs text-[#888880] text-center py-2">
              El precio se confirmará después de enviar el formulario.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F0E8]">
              <Calendar size={18} className="text-[#888880]" />
            </div>
            <p className="font-sans text-sm text-[#888880] leading-relaxed">
              Selecciona tus fechas y número de huéspedes para ver el resumen.
            </p>
          </div>
        )}
      </div>

      {/* Need help */}
      <div className="bg-[#1B4D5C]/5 border border-[#1B4D5C]/15 rounded-lg p-5 flex flex-col gap-2">
        <p className="font-sans text-sm font-semibold text-[#1B4D5C]">¿Necesitas ayuda?</p>
        <p className="font-sans text-xs text-[#666666] leading-relaxed">
          Contáctanos por WhatsApp y te asesoramos con tu reserva personalmente.
        </p>
        <a
          href="https://wa.me/573000000000?text=Hola,%20necesito%20ayuda%20para%20reservar%20ALAMAR%20HOUSE"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs font-semibold text-[#1B4D5C] hover:underline mt-1"
        >
          Abrir WhatsApp &rarr;
        </a>
      </div>

      <div className="flex items-center gap-2 justify-center">
        <Lock size={12} className="text-[#888880]" />
        <p className="font-sans text-xs text-[#888880]">Reserva sin costo · Confirmación por WhatsApp</p>
      </div>
    </div>
  )
}
