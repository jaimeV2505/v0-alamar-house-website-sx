'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: '¿Cuántas personas puede alojar ALAMAR BEACH HOUSE?',
    a: 'La casa tiene capacidad para hasta 12 personas. Cuenta con 4 habitaciones, sofás-camas adicionales y cunas disponibles para familias con bebés.',
  },
  {
    q: '¿Se permiten mascotas en la propiedad?',
    a: 'Sí, las mascotas son bienvenidas en ALAMAR BEACH HOUSE. Solo te pedimos que las mantengas supervisadas en las áreas de piscina y jardín por seguridad.',
  },
  {
    q: '¿Puedo organizar eventos o fiestas?',
    a: 'Sí, ALAMAR BEACH HOUSE está habilitada para eventos y celebraciones privadas. La terraza, el área de piscina y los espacios internos son perfectos para reuniones. Solo pedimos respetar el descanso de vecinos después de las 11 PM.',
  },
  {
    q: '¿Qué está incluido en la tarifa?',
    a: 'La tarifa incluye limpieza profunda antes de tu llegada, personal de apoyo para aseo durante la estadía, ropa de cama, toallas, WiFi de alta velocidad y parqueadero privado. El personal puede apoyar en la preparación de desayuno y almuerzo únicamente si el huésped suministra los víveres. Las comidas no están incluidas.',
  },
  {
    q: '¿Cuáles son los horarios de check-in y check-out?',
    a: 'El check-in es a partir de las 3:00 PM y el check-out es antes de las 12:00 PM (mediodía). Si necesitas horarios diferentes, podemos coordinarlo con anticipación sujeto a disponibilidad.',
  },
  {
    q: '¿Cómo funciona el proceso de reserva y pago?',
    a: 'Puedes solicitar tu reserva directamente en nuestro sitio web. Nos pondremos en contacto por correo y WhatsApp para confirmar disponibilidad y coordinar el pago. También puedes contactarnos por WhatsApp para asesorarte personalmente.',
  },
  {
    q: '¿Cuál es la política de cancelación?',
    a: 'Aceptamos cancelaciones con hasta 7 días de anticipación para reembolso completo. Cancelaciones con menos de 7 días están sujetas a retención del 50% del valor total. Contáctanos para casos especiales.',
  },
  {
    q: '¿La casa tiene vista al mar desde las habitaciones?',
    a: 'Sí, las habitaciones del piso 2 y 3 tienen vistas panorámicas al océano Caribe. Desde varios espacios de la casa puedes escuchar y ver el mar en todo momento.',
  },
  {
    q: '¿Está disponible todo el año?',
    a: 'ALAMAR BEACH HOUSE está disponible durante todo el año. Las tarifas varían según la temporada (regular o alta). Te recomendamos reservar con anticipación para temporadas de Semana Santa, vacaciones de mitad de año y diciembre.',
  },
]

export default function FaqSection() {
  return (
    <section id="faqs" className="bg-[#FAFAF8] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#D4A574]" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
              Preguntas frecuentes
            </span>
            <div className="w-8 h-px bg-[#D4A574]" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] font-bold text-balance">
            Resolvemos tus dudas
          </h2>
          <p className="mt-5 font-sans text-base text-[#666666] leading-relaxed">
            Si tienes alguna pregunta adicional, no dudes en contactarnos por WhatsApp.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-white border border-[#E8E3D8] rounded-lg px-6 data-[state=open]:border-[#1B4D5C]/30 transition-colors"
            >
              <AccordionTrigger className="font-sans text-sm font-semibold text-[#2C2C2C] hover:text-[#1B4D5C] hover:no-underline py-5 text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-sm text-[#666666] leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
