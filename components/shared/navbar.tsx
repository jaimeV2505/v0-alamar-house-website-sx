'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/#experiencia', label: 'Experiencia' },
  { href: '/#galeria', label: 'Galería' },
  { href: '/#amenidades', label: 'Amenidades' },
  { href: '/#precios', label: 'Precios' },
  { href: '/#faqs', label: 'FAQs' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAFAF8]/95 backdrop-blur-md shadow-sm border-b border-[#E8E3D8]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between h-18 py-4">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span
            className={`font-serif text-xl font-bold tracking-wide transition-colors duration-300 ${
              scrolled ? 'text-[#1B4D5C]' : 'text-white'
            }`}
          >
            ALAMAR
          </span>
          <span
            className={`font-sans text-xs tracking-[0.25em] uppercase transition-colors duration-300 ${
              scrolled ? 'text-[#D4A574]' : 'text-[#D4A574]'
            }`}
          >
            HOUSE
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-sm tracking-wide transition-colors duration-300 hover:text-[#D4A574] ${
                scrolled ? 'text-[#2C2C2C]' : 'text-white/90'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/reserva"
            className="bg-[#1B4D5C] text-white font-sans text-sm px-6 py-2.5 rounded-sm tracking-wide hover:bg-[#2A6B7E] transition-colors duration-300"
          >
            Reservar ahora
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden p-2 transition-colors ${
            scrolled ? 'text-[#2C2C2C]' : 'text-white'
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FAFAF8] border-t border-[#E8E3D8] px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-base text-[#2C2C2C] hover:text-[#1B4D5C] transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reserva"
            className="mt-2 bg-[#1B4D5C] text-white font-sans text-sm px-6 py-3 rounded-sm tracking-wide text-center hover:bg-[#2A6B7E] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Reservar ahora
          </Link>
        </div>
      )}
    </header>
  )
}
