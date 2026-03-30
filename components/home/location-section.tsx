import { MapPin, Navigation, Waves, TreePalm } from 'lucide-react'
import { WatermarkWave } from '@/components/shared/watermarks'

export default function LocationSection() {
  return (
    <section className="relative grain-overlay bg-[#FAFAF8] py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <WatermarkWave position="left" opacity={0.09} />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#D4A574]" />
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
                Ubicación
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] font-bold text-balance leading-tight mb-6">
              A 30 metros del Caribe colombiano
            </h2>
            <p className="font-sans text-base text-[#666666] leading-relaxed mb-8">
              ALAMAR BEACH HOUSE está ubicada en Playa Blanca, uno de los destinos costeros más exclusivos de la Costa Caribe colombiana. A pasos del mar, rodeada de naturaleza tropical y con acceso directo a la playa.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              {[
                {
                  icon: <MapPin size={16} className="text-[#1B4D5C]" />,
                  label: 'Dirección',
                  value: 'CL 1 3-153, Playa Blanca, San Antero, Córdoba, Colombia',
                },
                {
                  icon: <Waves size={16} className="text-[#1B4D5C]" />,
                  label: 'Distancia al mar',
                  value: '30 metros del océano Caribe',
                },
                {
                  icon: <Navigation size={16} className="text-[#1B4D5C]" />,
                  label: 'Vistas',
                  value: 'Vista panorámica al mar desde los pisos 2 y 3',
                },
                {
                  icon: <TreePalm size={16} className="text-[#1B4D5C]" />,
                  label: 'Entorno',
                  value: 'Rodeada de palmeras tropicales y naturaleza exuberante',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#F5F0E8] border border-[#E8E3D8] shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-sans text-xs text-[#888880] uppercase tracking-wide mb-0.5">{item.label}</p>
                    <p className="font-sans text-sm text-[#2C2C2C]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://maps.google.com/?q=Playa+Blanca+San+Antero+Cordoba+Colombia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm text-[#1B4D5C] border border-[#1B4D5C] px-6 py-3 rounded-sm hover:bg-[#1B4D5C] hover:text-white transition-colors"
            >
              <Navigation size={14} />
              Ver en Google Maps
            </a>
          </div>

          {/* Map placeholder */}
          <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-[#E8E3D8]">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-U1ooPrRFOCTalxpsiFlomEyMhXXOg7.jpeg"
              alt="Vista exterior de ALAMAR BEACH HOUSE en Playa Blanca, San Antero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B4D5C]/60 to-transparent flex items-end p-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-[#D4A574]" />
                  <span className="font-sans text-xs text-white/80 tracking-wide">Playa Blanca, San Antero</span>
                </div>
                <p className="font-serif text-xl text-white font-bold">ALAMAR BEACH HOUSE</p>
                <p className="font-sans text-sm text-white/70">Costa Caribe Colombiana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
