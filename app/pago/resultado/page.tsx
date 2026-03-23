'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import { CheckCircle, AlertCircle, Clock, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PaymentStatus = 'approved' | 'pending' | 'declined' | 'error'

const statusConfig: Record<PaymentStatus, {
  icon: typeof CheckCircle
  title: string
  description: string
  bgColor: string
  borderColor: string
  iconColor: string
}> = {
  approved: {
    icon: CheckCircle,
    title: '¡Reserva confirmada!',
    description:
      'Tu pago ha sido aprobado. Recibirás un email de confirmación en breve con todos los detalles de tu reserva en ALAMAR HOUSE.',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
  },
  pending: {
    icon: Clock,
    title: 'Pago en proceso',
    description:
      'Tu pago está siendo procesado. Recibirás una confirmación en las próximas 24 horas. Si tienes dudas, contáctanos por WhatsApp.',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
  },
  declined: {
    icon: XCircle,
    title: 'Pago rechazado',
    description:
      'Desfortunadamente, tu pago fue rechazado. Por favor, verifica los datos de tu tarjeta o intenta con otro método de pago.',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
  },
  error: {
    icon: AlertCircle,
    title: 'Error en el pago',
    description:
      'Ocurrió un error durante el procesamiento del pago. Por favor, intenta nuevamente o contacta a soporte.',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
  },
}

function PaymentResultContent() {
  const searchParams = useSearchParams()
  const statusParam = (searchParams.get('status') || 'error').toLowerCase() as PaymentStatus
  const reference = searchParams.get('reference')
  const transactionId = searchParams.get('transaction_id')

  // Validate status
  const status: PaymentStatus =
    Object.keys(statusConfig).includes(statusParam) ? statusParam : 'error'

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto">
          {/* Status Card */}
          <div
            className={`${config.bgColor} border-2 ${config.borderColor} rounded-lg p-8 md:p-12 text-center`}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <Icon className={`w-16 h-16 ${config.iconColor}`} />
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {config.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              {config.description}
            </p>

            {/* Reference & Transaction Info */}
            {(reference || transactionId) && (
              <div className="bg-white/50 rounded-lg p-4 mb-8 text-left">
                {reference && (
                  <div className="mb-3">
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                      Referencia de reserva
                    </p>
                    <p className="font-mono text-sm font-semibold text-foreground break-all">
                      {reference}
                    </p>
                  </div>
                )}
                {transactionId && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                      ID de transacción
                    </p>
                    <p className="font-mono text-sm font-semibold text-foreground break-all">
                      {transactionId}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Next Steps */}
            {status === 'approved' && (
              <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 mb-8 text-left">
                <p className="font-semibold text-green-900 mb-2">
                  ¿Qué sucede ahora?
                </p>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>✓ Recibirás un email de confirmación</li>
                  <li>✓ Nuestro equipo validará los detalles de tu reserva</li>
                  <li>✓ Te contactaremos en las próximas 24 horas</li>
                  <li>✓ Tendrás acceso a instrucciones de check-in</li>
                </ul>
              </div>
            )}

            {status === 'pending' && (
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
                <p className="font-semibold text-blue-900 mb-2">
                  Estado de tu pago
                </p>
                <p className="text-sm text-blue-800">
                  Algunos métodos de pago requieren validación adicional. Nos
                  pondremos en contacto tan pronto como se complete el
                  procesamiento.
                </p>
              </div>
            )}

            {(status === 'declined' || status === 'error') && (
              <div className="bg-red-100/50 border border-red-200 rounded-lg p-4 mb-8 text-left">
                <p className="font-semibold text-red-900 mb-2">
                  ¿Necesitas ayuda?
                </p>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Verifica los datos de tu tarjeta</li>
                  <li>• Intenta con otro método de pago</li>
                  <li>• Contacta a tu banco para verificar límites</li>
                  <li>
                    • Envíanos un mensaje por WhatsApp para asistencia urgente
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Volver al inicio
              </Button>
            </Link>

            {(status === 'declined' || status === 'error') && (
              <Link href="/reserva">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Intentar nuevamente
                </Button>
              </Link>
            )}

            <a
              href="https://wa.me/573000000000?text=Hola,%20tengo%20una%20pregunta%20sobre%20mi%20reserva"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                Contactar por WhatsApp
              </Button>
            </a>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-secondary rounded-lg text-center">
            <p className="text-sm text-text-secondary mb-4">
              ¿No recibiste el email de confirmación?
            </p>
            <p className="text-xs text-text-secondary">
              Revisa tu carpeta de spam o contacta a{' '}
              <a
                href="mailto:hola@alamarhouse.co"
                className="text-primary font-semibold hover:underline"
              >
                hola@alamarhouse.co
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-secondary border-2 border-border rounded-lg p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cargando resultado...
            </h1>
            <p className="text-lg text-text-secondary">
              Por favor espera mientras verificamos el estado de tu pago.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function PagoResultado() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentResultContent />
    </Suspense>
  )
}
