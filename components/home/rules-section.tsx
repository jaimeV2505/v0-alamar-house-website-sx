import { PawPrint, PartyPopper, ShieldAlert, Clock, Cigarette, Volume2, UtensilsCrossed } from 'lucide-react'

const rules = [
  {
    icon: <PawPrint size={18} />,
    text: 'Se permiten mascotas',
    allowed: true,
  },
  {
    icon: <PartyPopper size={18} />,
    text: 'Se permiten fiestas y eventos privados',
    allowed: true,
  },
  {
    icon: <ShieldAlert size={18} />,
    text: 'Evitar vidrio en el área de la piscina',
    allowed: false,
  },
  {
    icon: <Clock size={18} />,
    text: 'Check-in a partir de las 3:00 PM',
    allowed: null,
  },
  {
    icon: <Clock size={18} />,
    text: 'Check-out antes de las 12:00 PM',
    allowed: null,
  },
  {
    icon: <Cigarette size={18} />,
    text: 'Área de fumado solo en exteriores',
    allowed: null,
  },
  {
    icon: <Volume2 size={18} />,
    text: 'Respeto y control de decibeles en todo momento',
    allowed: null,
  },
  {
    icon: <UtensilsCrossed size={18} />,
    text: 'No incluye comidas. El personal puede apoyar en la preparación de desayuno y almuerzo únicamente si el huésped suministra los víveres',
    allowed: null,
  },
]

export default function RulesSection() {
  return (
    <section className="relative bg-[#F5F0E8] py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Watermark background */}
      <div
        className="pointer-events-none absolute inset-0 bg-center bg-no-repeat bg-cover opacity-[0.06]"
        style={{ backgroundImage: "url('/images/watermark-palms.jpg')" }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start gap-12">
          {/* Header */}
          <div className="md:w-1/3 shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#D4A574]" />
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
                Reglas
              </span>
            </div>
            <h2 className="font-serif text-3xl text-[#2C2C2C] font-bold text-balance leading-snug">
              Reglas de la casa
            </h2>
            <p className="mt-2 font-sans text-sm text-[#D4A574] font-medium italic">
              A 30 metros del Caribe colombiano
            </p>
            <p className="mt-3 font-sans text-sm text-[#666666] leading-relaxed">
              Para garantizar la mejor experiencia de todos nuestros huéspedes, te pedimos respetar estas normas básicas de convivencia.
            </p>
          </div>

          {/* Rules list */}
          <div className="flex-1 flex flex-col gap-3">
            {rules.map((rule, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-[#E8E3D8]"
              >
                <span
                  className={`${rule.allowed === true
                      ? 'text-[#6B9C85]'
                      : rule.allowed === false
                        ? 'text-[#D4A574]'
                        : 'text-[#1B4D5C]'
                    }`}
                >
                  {rule.icon}
                </span>
                <p className="font-sans text-sm text-[#2C2C2C] flex-1">{rule.text}</p>
                {rule.allowed === true && (
                  <span className="font-sans text-xs text-[#6B9C85] bg-[#6B9C85]/10 px-2.5 py-1 rounded-full shrink-0">
                    Permitido
                  </span>
                )}
                {rule.allowed === false && (
                  <span className="font-sans text-xs text-[#D4A574] bg-[#D4A574]/10 px-2.5 py-1 rounded-full shrink-0">
                    Precaución
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
