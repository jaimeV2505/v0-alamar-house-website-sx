'use client'

import { useState } from 'react'
import { X, ZoomIn } from 'lucide-react'

const galleryImages = [
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-vogXatJj9UKprZOYTZvsHMcZ3sqxsR.jpeg',
    alt: 'Vista exterior de ALAMAR BEACH HOUSE con piscina y palmeras',
    caption: 'Exterior y piscina',
    cols: 'col-span-2 md:col-span-1',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-Xzrjd6WGSHkuDWGQSRL1aPRgywvrOL.jpeg',
    alt: 'Patio trasero con piscina, mesa y sillas azules',
    caption: 'Terraza y piscina',
    cols: 'col-span-2 md:col-span-1',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-U1ooPrRFOCTalxpsiFlomEyMhXXOg7.jpeg',
    alt: 'Vista trasera de la villa con jardín tropical',
    caption: 'Jardín tropical',
    cols: 'col-span-2',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-kanXNwk7op5iMrgctUKalqax97xoBj.jpeg',
    alt: 'Sala principal con sillones blancos y piso de mosaico',
    caption: 'Sala principal',
    cols: 'col-span-2 md:col-span-1',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-P4TVF0iWeRWIXl8scCht5mGujJRMwF.jpeg',
    alt: 'Sala con doble altura y vista a la piscina',
    caption: 'Living room',
    cols: 'col-span-2 md:col-span-1',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-RCGO1unE80MAytmga5ur9XCC2Va5V8.jpeg',
    alt: 'Sala interior luminosa con vistas tropicales',
    caption: 'Interior luminoso',
    cols: 'col-span-2 md:col-span-1',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-O636JYphV7LfpzuG5ecI0z98j7UHCd.jpeg',
    alt: 'Sala con doble altura, escalera y diseño moderno',
    caption: 'Diseño de doble altura',
    cols: 'col-span-2 md:col-span-1',
  },
]

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section id="galeria" className="bg-[#F5F0E8] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#D4A574]" />
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
                Galería
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] font-bold text-balance">
              Cada espacio, un cuadro
            </h2>
          </div>
          <p className="font-sans text-sm text-[#666666] max-w-xs leading-relaxed">
            Diseño tropical, luz natural y detalles de lujo en cada rincón de ALAMAR BEACH HOUSE.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              className={`${img.cols} relative group overflow-hidden rounded-lg aspect-[4/3] cursor-pointer`}
              onClick={() => setLightbox(i)}
              aria-label={`Ver imagen: ${img.caption}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#1B4D5C]/0 group-hover:bg-[#1B4D5C]/40 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn
                  size={28}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-sans text-sm text-white">{img.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar"
            onClick={() => setLightbox(null)}
          >
            <X size={32} />
          </button>
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[lightbox].src}
              alt={galleryImages[lightbox].alt}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="mt-4 font-sans text-sm text-white/60 text-center">
              {galleryImages[lightbox].caption}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
