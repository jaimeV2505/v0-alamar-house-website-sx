import { Leaf, Users, Eye, Star } from 'lucide-react'

const experiences = [
  {
    icon: <Leaf size={20} className="text-[#7BA696]" />,
    tag: 'Tranquilidad',
    title: 'Desconéctate de la rutina',
    body: 'Déjate envolver por el ritmo suave del Caribe. Hamacas sobre el mar, brisa salada y el sonido constante de las olas — aquí el tiempo se mueve diferente.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-P4TVF0iWeRWIXl8scCht5mGujJRMwF.jpeg',
    imageAlt: 'Sala principal con vista a la piscina y jardín tropical',
    reverse: false,
  },
  {
    icon: <Users size={20} className="text-[#7BA696]" />,
    tag: 'Unión familiar',
    title: 'Crea recuerdos inolvidables',
    body: 'Con capacidad para hasta 20 personas, ALAMAR HOUSE es el escenario perfecto para reunir a quienes más quieres. Espacios amplios, cocina equipada y ambiente de celebración.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-kanXNwk7op5iMrgctUKalqax97xoBj.jpeg',
    imageAlt: 'Sala luminosa con diseño moderno y acceso al jardín',
    reverse: true,
  },
  {
    icon: <Eye size={20} className="text-[#7BA696]" />,
    tag: 'Mar y naturaleza',
    title: 'Vista y sonido del océano',
    body: 'Despierta cada mañana con el mar frente a ti. Desde los pisos 2 y 3 tendrás vistas panorámicas al océano Caribe, convirtiendo cada amanecer en un momento único.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-RCGO1unE80MAytmga5ur9XCC2Va5V8.jpeg',
    imageAlt: 'Sala interior con doble altura y vistas tropicales',
    reverse: false,
  },
  {
    icon: <Star size={20} className="text-[#7BA696]" />,
    tag: 'Confort de lujo',
    title: 'Lujo accesible y cálido',
    body: 'Cada detalle fue pensado para tu bienestar: aire acondicionado, WiFi de alta velocidad, cocina completamente equipada, personal de apoyo y servicio de limpieza incluido.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-O636JYphV7LfpzuG5ecI0z98j7UHCd.jpeg',
    imageAlt: 'Sala principal con diseño de doble altura y escalera',
    reverse: true,
  },
]

export default function ExperienceSection() {
  return (
    <section id="experiencia" className="bg-[#FAFAF8] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#D4A574]" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A574]">
              La experiencia
            </span>
            <div className="w-8 h-px bg-[#D4A574]" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] font-bold text-balance">
            Más que una casa,<br />un estilo de vida
          </h2>
          <p className="mt-5 font-sans text-base text-[#666666] max-w-xl mx-auto leading-relaxed">
            ALAMAR HOUSE redefine el concepto de vacaciones en la costa colombiana.
            Cada rincón fue diseñado para inspirar calma, alegría y conexión.
          </p>
        </div>

        {/* Experience rows */}
        <div className="flex flex-col gap-24">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`flex flex-col ${exp.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 rounded-lg overflow-hidden aspect-[4/3]">
                <img
                  src={exp.image}
                  alt={exp.imageAlt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2 flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  {exp.icon}
                  <span className="font-sans text-xs tracking-[0.25em] uppercase text-[#7BA696] font-semibold">
                    {exp.tag}
                  </span>
                </div>
                <h3 className="font-serif text-3xl md:text-4xl text-[#2C2C2C] font-bold leading-tight text-balance">
                  {exp.title}
                </h3>
                <p className="font-sans text-base text-[#666666] leading-relaxed">
                  {exp.body}
                </p>
                <div className="w-12 h-0.5 bg-[#D4A574] mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
