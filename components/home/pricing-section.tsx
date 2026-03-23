import Link from 'next/link'
import { Check, Star } from 'lucide-react'

const included = [
  'Limpieza profunda incluida',
  'Desayuno y almuerzo',
  'Personal de apoyo',
  'Ropa de cama y toallas',
  'WiFi de alta velocidad',
  'Parqueadero privado',
]

export default function PricingSection() {
  return (
    <section id="precios" className="bg-[#FAFAF8] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#D4A574]" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
              Tarifas
            </span>
            <div className="w-8 h-px bg-[#D4A574]" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] font-bold text-balance">
            Una inversión en recuerdos
          </h2>
          <p className="mt-5 font-sans text-base text-[#666666] max-w-xl mx-auto leading-relaxed">
            Tarifas transparentes, sin sorpresas. Todo lo que necesitas para unas vacaciones perfectas está incluido.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Regular */}
          <div className="bg-white border border-[#E8E3D8] rounded-lg p-8 flex flex-col gap-6">
            <div>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-[#7BA696] font-semibold mb-2">
                Temporada regular
              </p>
              <p className="font-serif text-4xl font-bold text-[#2C2C2C]">
                2 – 3M
              </p>
              <p className="font-sans text-sm text-[#666666] mt-1">COP por noche</p>
            </div>
            <p className="font-sans text-sm text-[#666666] leading-relaxed border-t border-[#E8E3D8] pt-5">
              Disponible durante la mayoría del año. Perfecta para escapadas de fin de semana o vacaciones tranquilas.
            </p>
            <Link
              href="/reserva"
              className="mt-auto text-center bg-[#F5F0E8] text-[#1B4D5C] font-sans text-sm font-semibold px-6 py-3 rounded-sm border border-[#E8E3D8] hover:bg-[#E8E3D8] transition-colors"
            >
              Consultar disponibilidad
            </Link>
          </div>

          {/* High season */}
          <div className="bg-[#1B4D5C] rounded-lg p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#D4A574] px-4 py-1.5 rounded-bl-lg">
              <div className="flex items-center gap-1">
                <Star size={11} className="text-white fill-white" />
                <span className="font-sans text-xs text-white font-semibold">Temporada alta</span>
              </div>
            </div>
            <div>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-[#7BA696] font-semibold mb-2">
                Temporada alta
              </p>
              <p className="font-serif text-4xl font-bold text-white">
                3.5M
              </p>
              <p className="font-sans text-sm text-white/60 mt-1">COP por noche</p>
            </div>
            <p className="font-sans text-sm text-white/70 leading-relaxed border-t border-white/15 pt-5">
              Semana Santa, vacaciones de mitad de año, Navidad y temporada alta de playa. Reserva con anticipación.
            </p>
            <Link
              href="/reserva"
              className="mt-auto text-center bg-[#D4A574] text-[#2C2C2C] font-sans text-sm font-semibold px-6 py-3 rounded-sm hover:bg-[#c2935f] transition-colors"
            >
              Reservar ahora
            </Link>
          </div>
        </div>

        {/* What's included */}
        <div className="mt-14 max-w-3xl mx-auto">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-center text-[#666666] mb-6">
            Incluido en todas las tarifas
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {included.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check size={14} className="text-[#7BA696] shrink-0" />
                <span className="font-sans text-sm text-[#2C2C2C]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
