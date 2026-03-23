import { Check, Calendar, TrendingUp, Lock } from 'lucide-react'
import { PricingResult, formatCOP } from '@/lib/pricing'

interface Props {
  pricing: PricingResult | null
}

export default function SummaryPanel({ pricing }: Props) {
  return (
    <div className="sticky top-24 flex flex-col gap-6">
      {/* Property card */}
      <div className="rounded-lg overflow-hidden border border-[#E8E3D8]">
        <div className="relative h-44">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-vogXatJj9UKprZOYTZvsHMcZ3sqxsR.jpeg"
            alt="ALAMAR HOUSE exterior con piscina"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4D5C]/70 to-transparent flex items-end p-5">
            <div>
              <p className="font-serif text-lg text-white font-bold">ALAMAR HOUSE</p>
              <p className="font-sans text-xs text-white/70">Playa Blanca, San Antero · Colombia</p>
            </div>
          </div>
        </div>
        <div className="bg-white px-5 py-4 flex items-center justify-between border-t border-[#E8E3D8]">
          {[
            { value: '4', label: 'Hab.' },
            { value: '5', label: 'Baños' },
            { value: '20', label: 'Pers.' },
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

        {pricing ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#F5F0E8] shrink-0">
                <Calendar size={15} className="text-[#1B4D5C]" />
              </div>
              <div className="flex-1">
                <p className="font-sans text-xs text-[#888880]">Duración</p>
                <p className="font-sans text-sm font-semibold text-[#2C2C2C]">
                  {pricing.nights} {pricing.nights === 1 ? 'noche' : 'noches'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#F5F0E8] shrink-0">
                <TrendingUp size={15} className="text-[#1B4D5C]" />
              </div>
              <div className="flex-1">
                <p className="font-sans text-xs text-[#888880]">Tarifa</p>
                <div className="flex items-center gap-2">
                  <p className="font-sans text-sm font-semibold text-[#2C2C2C]">
                    {pricing.seasonLabel}
                  </p>
                  {pricing.isHighSeason && (
                    <span className="font-sans text-xs bg-[#D4A574]/15 text-[#D4A574] px-2 py-0.5 rounded-full border border-[#D4A574]/20">
                      Alta
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-[#E8E3D8]" />
            <p className="font-sans text-sm text-[#666666]">{pricing.breakdown}</p>

            <div className="flex flex-col gap-2 bg-[#F5F0E8] rounded-md p-3">
              {['Limpieza incluida', 'Desayuno y almuerzo', 'Personal de apoyo'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={12} className="text-[#7BA696] shrink-0" />
                  <span className="font-sans text-xs text-[#666666]">{item}</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-[#E8E3D8]" />
            <div className="flex items-center justify-between">
              <p className="font-sans text-sm font-semibold text-[#2C2C2C]">Total estimado</p>
              <p className="font-serif text-xl font-bold text-[#1B4D5C]">
                {formatCOP(pricing.totalEstimated)}
              </p>
            </div>
            <p className="font-sans text-xs text-[#888880]">
              Monto en COP. Se confirma al completar el formulario.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F0E8]">
              <Calendar size={18} className="text-[#888880]" />
            </div>
            <p className="font-sans text-sm text-[#888880] leading-relaxed">
              Selecciona tus fechas para ver el precio estimado de tu estadía.
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
        <p className="font-sans text-xs text-[#888880]">Pago seguro procesado por Wompi</p>
      </div>
    </div>
  )
}
