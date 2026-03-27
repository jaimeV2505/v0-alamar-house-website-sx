import {
  Waves,
  Droplets,
  Wifi,
  Wind,
  Fan,
  UtensilsCrossed,
  Sofa,
  Eye,
  PawPrint,
  PartyPopper,
  Sun,
  Flame,
} from 'lucide-react'

const amenities = [
  {
    icon: <Waves size={22} />,
    title: 'Piscina privada',
    description: 'Piscina exclusiva con vista al jardín tropical para refrescarte todo el día.',
  },
  {
    icon: <Droplets size={22} />,
    title: 'Jacuzzi',
    description: 'Jacuzzi privado en la habitación principal con hidromasaje bajo las estrellas del Caribe.',
  },
  {
    icon: <Sun size={22} />,
    title: 'Terraza y hamacas',
    description: 'Terrazas amplias con hamacas para disfrutar la brisa y el sonido del mar.',
  },
  {
    icon: <Eye size={22} />,
    title: 'Vista al océano',
    description: 'Vistas panorámicas al mar Caribe desde los pisos 2 y 3 de la villa.',
  },
  {
    icon: <Wifi size={22} />,
    title: 'WiFi de alta velocidad',
    description: 'Conexión estable para trabajar, hacer videollamadas o simplemente conectarte.',
  },
  {
    icon: <Wind size={22} />,
    title: 'Aire acondicionado',
    description: 'A/C en todas las habitaciones para noches frescas y descansadas.',
  },
  {
    icon: <Fan size={22} />,
    title: 'Ventiladores de techo',
    description: 'Ventiladores en cada espacio para una circulación de aire natural y constante.',
  },
  {
    icon: <UtensilsCrossed size={22} />,
    title: 'Cocina equipada',
    description: 'Cocina totalmente equipada con todo lo necesario para preparar tus platos favoritos.',
  },
  {
    icon: <Sofa size={22} />,
    title: 'Sofás-camas',
    description: 'Sofás-camas adicionales para ampliar la capacidad hasta 12 personas cómodamente.',
  },
  {
    icon: <PawPrint size={22} />,
    title: 'Pet-friendly',
    description: 'Tus mascotas son bienvenidas. Disfruten todos juntos de este paraíso tropical.',
  },
  {
    icon: <PartyPopper size={22} />,
    title: 'Eventos y fiestas',
    description: 'Espacio perfecto para celebraciones privadas, reuniones familiares y eventos especiales.',
  },
  {
    icon: <Flame size={22} />,
    title: 'Zona BBQ',
    description: 'Área de parrilla con todo lo necesario para una tarde de asado junto al mar.',
  },
]

export default function AmenitiesSection() {
  return (
    <section id="amenidades" className="bg-[#F5F0E8] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#D4A574]" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
              Amenidades
            </span>
            <div className="w-8 h-px bg-[#D4A574]" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] font-bold text-balance">
            Todo lo que necesitas,<br />nada que te sobre
          </h2>
          <p className="mt-5 font-sans text-base text-[#666666] max-w-xl mx-auto leading-relaxed">
            ALAMAR BEACH HOUSE viene equipado con todo lo esencial para vivir unas vacaciones perfectas, sin preocupaciones.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {amenities.map((amenity, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-6 bg-white rounded-lg border border-[#E8E3D8] hover:border-[#1B4D5C]/30 hover:shadow-sm transition-all duration-300 group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#F5F0E8] text-[#1B4D5C] group-hover:bg-[#1B4D5C] group-hover:text-white transition-colors duration-300">
                {amenity.icon}
              </div>
              <p className="font-sans text-sm font-semibold text-[#2C2C2C]">{amenity.title}</p>
              <p className="font-sans text-xs text-[#666666] leading-relaxed">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
