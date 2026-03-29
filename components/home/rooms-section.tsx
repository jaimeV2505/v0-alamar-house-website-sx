import { BedDouble, BedSingle, Bath, Users } from 'lucide-react'

const rooms = [
  {
    title: 'Habitación Principal',
    description: 'Suite amplia con cama doble, baño privado, acceso al balcón con vista al mar y aire acondicionado. Incluye cama auxiliar para mayor comodidad.',
    details: ['Cama doble + cama auxiliar', 'Baño privado', 'Vista al océano', 'A/C y ventilador'],
    icon: <BedDouble size={22} className="text-[#1B4D5C]" />,
  },
  {
    title: 'Habitación 2',
    description: 'Habitación cómoda con cama doble, baño privado, ventilación natural y detalles de diseño tropical. Incluye cama auxiliar adicional.',
    details: ['Cama doble + cama auxiliar', 'Baño privado', 'Diseño tropical', 'A/C y ventilador'],
    icon: <BedDouble size={22} className="text-[#1B4D5C]" />,
  },
  {
    title: 'Habitación 3',
    description: 'Espacio acogedor con dos camas sencillas, ideal para niños o grupos. Incluye camas auxiliares para mayor capacidad.',
    details: ['2 camas sencillas + camas auxiliares', 'Baño compartido', 'Ideal para familia', 'A/C y ventilador'],
    icon: <BedSingle size={22} className="text-[#1B4D5C]" />,
  },
  {
    title: 'Habitación 4',
    description: 'Habitación versátil con dos camas sencillas, ideal para familias o grupos. Incluye camas auxiliares para mayor flexibilidad.',
    details: ['2 camas sencillas + camas auxiliares', 'Opción de cuna', 'Espacio familiar', 'A/C y ventilador'],
    icon: <BedSingle size={22} className="text-[#1B4D5C]" />,
  },
]

export default function RoomsSection() {
  return (
    <section className="bg-[#FAFAF8] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#D4A574]" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
              Habitaciones
            </span>
            <div className="w-8 h-px bg-[#D4A574]" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] font-bold text-balance">
            Espacios diseñados<br />para el confort
          </h2>
          <p className="mt-5 font-sans text-base text-[#666666] max-w-xl mx-auto leading-relaxed">
            4 habitaciones, 5 baños y capacidad para hasta 20 personas. La casa perfecta para toda la familia.
          </p>
        </div>

        {/* Capacity summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: <BedDouble size={24} className="text-[#1B4D5C]" />, value: '4', label: 'Habitaciones' },
            { icon: <Bath size={24} className="text-[#1B4D5C]" />, value: '5', label: 'Baños' },
            { icon: <Users size={24} className="text-[#1B4D5C]" />, value: '20', label: 'Personas máx.' },
            { icon: <BedSingle size={24} className="text-[#1B4D5C]" />, value: '8', label: 'Camas totales' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-6 bg-[#F5F0E8] rounded-lg border border-[#E8E3D8] text-center">
              {stat.icon}
              <p className="font-serif text-3xl font-bold text-[#2C2C2C]">{stat.value}</p>
              <p className="font-sans text-sm text-[#666666]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Room cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room, i) => (
            <div
              key={i}
              className="bg-white border border-[#E8E3D8] rounded-lg p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                {room.icon}
                <h3 className="font-serif text-xl text-[#2C2C2C] font-bold">{room.title}</h3>
              </div>
              <p className="font-sans text-sm text-[#666666] leading-relaxed mb-5">
                {room.description}
              </p>
              <ul className="flex flex-wrap gap-2">
                {room.details.map((detail, j) => (
                  <li
                    key={j}
                    className="font-sans text-xs text-[#1B4D5C] bg-[#F5F0E8] px-3 py-1.5 rounded-sm border border-[#E8E3D8]"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sofa beds note */}
        <div className="mt-8 p-6 bg-[#F5F0E8] border border-[#E8E3D8] rounded-lg flex items-start gap-4">
          <div className="w-1 self-stretch bg-[#D4A574] rounded-full shrink-0" />
          <div>
            <p className="font-sans text-sm font-semibold text-[#2C2C2C] mb-1">Capacidad flexible</p>
            <p className="font-sans text-sm text-[#666666] leading-relaxed">
              La casa cuenta con sofás-camas adicionales para ampliar la capacidad hasta 20 personas.
              Además, disponemos de cunas para los más pequeños de la familia.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
