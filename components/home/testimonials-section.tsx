import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'María Fernanda Ospina',
    location: 'Medellín, Colombia',
    quote:
      'ALAMAR BEACH HOUSE superó todas nuestras expectativas. La vista al mar desde el segundo piso, la piscina, el jacuzzi... todo fue perfecto. Ya estamos planeando el regreso con más familia.',
    rating: 5,
    occasion: 'Reunión familiar',
  },
  {
    name: 'Carlos & Daniela Restrepo',
    location: 'Bogotá, Colombia',
    quote:
      'Celebramos nuestro aniversario aquí y fue mágico. El personal fue increíblemente atento, la casa estaba impecable y el desayuno incluido fue un detalle maravilloso. Lo recomendamos sin duda.',
    rating: 5,
    occasion: 'Aniversario de bodas',
  },
  {
    name: 'Familia Rodríguez',
    location: 'Barranquilla, Colombia',
    quote:
      'Llevamos a los niños y a los abuelos y todos quedaron fascinados. La casa tiene espacio para todos, es pet-friendly (fuimos con nuestro perro) y está literalmente frente al mar. Una joya.',
    rating: 5,
    occasion: 'Vacaciones familiares',
  },
  {
    name: 'Grupo de amigos UCO',
    location: 'Cali, Colombia',
    quote:
      'Vinimos 15 amigos y la casa nos quedó perfecta. Cocina amplia, suficientes cuartos, terraza enorme y piscina todo el día. Lo mejor es que también se puede hacer fiesta. ¡Repetimos seguro!',
    rating: 5,
    occasion: 'Celebración grupal',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="text-[#D4A574] fill-[#D4A574]" />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="bg-[#1B4D5C] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#D4A574]" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
              Testimonios
            </span>
            <div className="w-8 h-px bg-[#D4A574]" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-bold text-balance">
            Lo que dicen nuestros huéspedes
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white/8 border border-white/10 rounded-lg p-8 flex flex-col gap-5 hover:bg-white/12 transition-colors duration-300"
            >
              <Stars count={t.rating} />
              <blockquote className="font-serif text-lg text-white/90 leading-relaxed italic">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                <div>
                  <p className="font-sans text-sm font-semibold text-white">{t.name}</p>
                  <p className="font-sans text-xs text-white/50 mt-0.5">{t.location}</p>
                </div>
                <span className="font-sans text-xs text-[#7BA696] bg-[#7BA696]/10 px-3 py-1 rounded-full border border-[#7BA696]/20">
                  {t.occasion}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
