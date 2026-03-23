import Link from 'next/link'

export default function FinalCtaSection() {
  return (
    <section className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-Xzrjd6WGSHkuDWGQSRL1aPRgywvrOL.jpeg"
          alt="ALAMAR HOUSE desde el jardín con vista a la piscina"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1B4D5C]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-[#D4A574]" />
          <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
            Tu próxima aventura
          </span>
          <div className="w-12 h-px bg-[#D4A574]" />
        </div>

        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold text-balance leading-tight">
          Vive la experiencia ALAMAR
        </h2>

        <p className="font-sans text-lg text-white/80 leading-relaxed max-w-xl">
          El mar, la piscina, el jacuzzi y la familia — todo en un mismo lugar. ¿A qué esperas para hacer la reserva?
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link
            href="/reserva"
            className="bg-[#D4A574] text-[#2C2C2C] font-sans font-semibold text-sm px-10 py-4 rounded-sm tracking-wide hover:bg-[#c2935f] transition-colors duration-300"
          >
            Reservar ahora
          </Link>
          <a
            href="https://wa.me/573000000000?text=Hola,%20quisiera%20consultar%20disponibilidad%20en%20ALAMAR%20HOUSE"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-white/80 border border-white/30 px-8 py-4 rounded-sm hover:border-white hover:text-white transition-colors"
          >
            Consultar por WhatsApp
          </a>
        </div>

        <p className="font-sans text-xs text-white/40 mt-2">
          Playa Blanca, San Antero · Costa Caribe, Colombia
        </p>
      </div>
    </section>
  )
}
