import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, MessageCircle, Music } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1B4D5C] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-serif text-2xl font-bold tracking-wide">ALAMAR</p>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-[#D4A574]"> BEACH HOUSE</p>
            </div>
            <p className="font-sans text-sm text-white/70 leading-relaxed max-w-xs">
              Una villa boutique de lujo a 30 metros del mar en Playa Blanca, San Antero. Tu refugio tropical está esperando.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 hover:border-[#D4A574] hover:text-[#D4A574] transition-colors"
                aria-label="Instagram de ALAMAR BEACH HOUSE"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 hover:border-[#D4A574] hover:text-[#D4A574] transition-colors"
                aria-label="TikTok de ALAMAR BEACH HOUSE"
              >
                <Music size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#D4A574] font-semibold">Navegación</p>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/#experiencia', label: 'Experiencia' },
                { href: '/#galeria', label: 'Galería' },
                { href: '/#amenidades', label: 'Amenidades' },
                { href: '/#precios', label: 'Precios' },
                { href: '/#faqs', label: 'Preguntas frecuentes' },
                { href: '/reserva', label: 'Reservar ahora' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#D4A574] font-semibold">Contacto</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 text-sm text-white/70">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#7BA696]" />
                <span>CL 1 3-153, Playa Blanca,<br />San Antero, Córdoba, Colombia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Phone size={15} className="shrink-0 text-[#7BA696]" />
                <a href="tel:+573015670089" className="hover:text-white transition-colors">
                  +57 301 567 0089
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Mail size={15} className="shrink-0 text-[#7BA696]" />
                <a href="mailto:hola@alamarhouse.co" className="hover:text-white transition-colors">
                  hola@alamarhouse.co
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/40">
            © {new Date().getFullYear()} ALAMAR BEACH HOUSE. Todos los derechos reservados.
          </p>
          <p className="font-sans text-xs text-white/40">
            Playa Blanca, San Antero, Córdoba, Colombia
          </p>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/573015670089?text=Hola,%20estoy%20interesado%20en%20reservar%20ALAMAR%20HOUSE"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={26} className="text-white fill-white" />
      </a>
    </footer>
  )
}
