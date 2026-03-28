'use client'

import Link from 'next/link'
import { CheckCircle, Clock, XCircle, AlertTriangle, Home, RefreshCcw } from 'lucide-react'
import type { TransactionStatus } from '@/lib/wompi'

interface Props {
  status: TransactionStatus | string
  reference: string | null
  transactionId: string | null
}

const STATES: Record<
  string,
  {
    icon: React.ReactNode
    bg: string
    border: string
    iconColor: string
    heading: string
    body: string
    ctaLabel: string
    ctaHref: string
    secondaryLabel?: string
    secondaryHref?: string
  }
> = {
  APPROVED: {
    icon: <CheckCircle size={48} strokeWidth={1.5} />,
    bg: 'bg-[#7BA696]/10',
    border: 'border-[#7BA696]/25',
    iconColor: 'text-[#7BA696]',
    heading: '¡Reserva confirmada!',
    body: 'Tu pago fue aprobado. En los próximos minutos recibirás un correo con los detalles de tu estadía en ALAMAR BEACH HOUSE. ¡Te esperamos!',
    ctaLabel: 'Volver al inicio',
    ctaHref: '/',
  },
  PENDING: {
    icon: <Clock size={48} strokeWidth={1.5} />,
    bg: 'bg-[#D4A574]/10',
    border: 'border-[#D4A574]/25',
    iconColor: 'text-[#D4A574]',
    heading: 'Pago en proceso',
    body: 'Tu transacción está siendo verificada. Esto puede tomar unos minutos. Te notificaremos por correo en cuanto se confirme el pago.',
    ctaLabel: 'Volver al inicio',
    ctaHref: '/',
    secondaryLabel: 'Contactar por WhatsApp',
    secondaryHref: 'https://wa.me/573015670089',
  },
  DECLINED: {
    icon: <XCircle size={48} strokeWidth={1.5} />,
    bg: 'bg-[#D97373]/10',
    border: 'border-[#D97373]/25',
    iconColor: 'text-[#D97373]',
    heading: 'Pago rechazado',
    body: 'Tu transacción fue rechazada por el banco. Por favor verifica los datos de tu tarjeta e inténtalo de nuevo, o elige otro método de pago.',
    ctaLabel: 'Intentar de nuevo',
    ctaHref: '/reserva',
    secondaryLabel: 'Contactar soporte',
    secondaryHref: 'https://wa.me/573015670089',
  },
  ERROR: {
    icon: <AlertTriangle size={48} strokeWidth={1.5} />,
    bg: 'bg-[#D97373]/10',
    border: 'border-[#D97373]/25',
    iconColor: 'text-[#D97373]',
    heading: 'Error en el pago',
    body: 'Ocurrió un error inesperado al procesar tu pago. No se realizó ningún cargo. Por favor inténtalo de nuevo o contáctanos.',
    ctaLabel: 'Intentar de nuevo',
    ctaHref: '/reserva',
    secondaryLabel: 'Contactar soporte',
    secondaryHref: 'https://wa.me/573015670089',
  },
}

const FALLBACK = STATES.PENDING

export default function PaymentResult({ status, reference, transactionId }: Props) {
  const state = STATES[status] ?? FALLBACK

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg">
        {/* Status card */}
        <div className={`${state.bg} ${state.border} border rounded-xl p-10 flex flex-col items-center text-center gap-6`}>
          {/* Icon */}
          <div className={state.iconColor}>{state.icon}</div>

          {/* Heading */}
          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-3xl font-bold text-[#2C2C2C]">{state.heading}</h1>
            <p className="font-sans text-sm text-[#666666] leading-relaxed max-w-sm">{state.body}</p>
          </div>

          {/* Reference info */}
          {reference && (
            <div className="w-full bg-white/60 rounded-lg px-5 py-4 flex flex-col gap-2 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="font-sans text-xs text-[#888880] uppercase tracking-wide">Referencia</span>
                <span className="font-mono text-xs font-semibold text-[#2C2C2C] break-all">{reference}</span>
              </div>
              {transactionId && (
                <div className="flex items-center justify-between gap-4">
                  <span className="font-sans text-xs text-[#888880] uppercase tracking-wide">Transacción</span>
                  <span className="font-mono text-xs font-semibold text-[#2C2C2C] break-all">{transactionId}</span>
                </div>
              )}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href={state.ctaHref}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1B4D5C] text-white font-sans font-semibold text-sm px-6 py-3.5 rounded-sm hover:bg-[#2A6B7E] transition-colors duration-300"
            >
              {state.ctaHref === '/reserva' ? (
                <><RefreshCcw size={15} />  {state.ctaLabel}</>
              ) : (
                <><Home size={15} />  {state.ctaLabel}</>
              )}
            </Link>
            {state.secondaryLabel && state.secondaryHref && (
              <a
                href={state.secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#E8E3D8] text-[#2C2C2C] font-sans font-semibold text-sm px-6 py-3.5 rounded-sm hover:bg-[#F5F0E8] transition-colors duration-300"
              >
                {state.secondaryLabel}
              </a>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 font-sans text-xs text-[#888880] text-center leading-relaxed">
          ¿Tienes dudas? Escríbenos al{' '}
          <a
            href="https://wa.me/573015670089"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1B4D5C] font-semibold hover:underline"
          >
            WhatsApp
          </a>{' '}
          o al correo{' '}
          <a href="mailto:hola@alamarhouse.co" className="text-[#1B4D5C] font-semibold hover:underline">
            hola@alamarhouse.co
          </a>
        </p>
      </div>
    </div>
  )
}
