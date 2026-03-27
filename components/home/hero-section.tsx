import Link from 'next/link'
import { MapPin, ChevronDown, BedDouble, Waves } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-vogXatJj9UKprZOYTZvsHMcZ3sqxsR.jpeg"
          alt="ALAMAR BEACH HOUSE — Vista exterior con piscina y palmeras"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D5C]/80 via-[#1B4D5C]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-28 pb-24">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-[#D4A574]" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
              Playa Blanca, San Antero
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight text-balance mb-6">
            Descubre un refugio donde el mar, la calma y el confort se unen
          </h1>

          {/* Subheadline */}
          <p className="font-sans text-lg md:text-xl text-white/85 leading-relaxed mb-10 max-w-xl">
            Una experiencia VIP de descanso, compartir y recordar — a 30 metros del mar Caribe.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/reserva"
              className="bg-[#D4A574] text-[#2C2C2C] font-sans font-semibold text-sm px-8 py-4 rounded-sm tracking-wide hover:bg-[#c2935f] transition-colors duration-300"
            >
              Reservar ahora
            </Link>
            <a
              href="#experiencia"
              className="flex items-center gap-2 font-sans text-sm text-white/80 hover:text-white transition-colors group"
            >
              <span>Ver la experiencia</span>
              <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Floating Info Card */}
        <div className="mt-16 md:mt-0 md:absolute md:bottom-16 md:right-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 max-w-xs">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={14} className="text-[#D4A574]" />
            <span className="font-sans text-xs text-white/90 tracking-wide">
              Playa Blanca, San Antero, Córdoba
            </span>
          </div>
          <div className="w-full h-px bg-white/15 mb-4" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Waves size={15} className="text-[#7BA696] shrink-0" />
              <span className="font-sans text-sm text-white/85">30 metros de la playa</span>
            </div>
            <div className="flex items-center gap-3">
              <BedDouble size={15} className="text-[#7BA696] shrink-0" />
              <span className="font-sans text-sm text-white/85">4 Habitaciones · Piscina · Jacuzzi</span>
            </div>
          </div>
          <div className="w-full h-px bg-white/15 mt-4 mb-4" />
          <p className="font-serif text-lg text-white font-bold">
            Desde 2.000.000 COP
          </p>
          <p className="font-sans text-xs text-white/60 mt-0.5">por noche</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#experiencia"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
        aria-label="Desplazarse hacia abajo"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/40" />
        <ChevronDown size={16} />
      </a>
    </section>
  )
}
