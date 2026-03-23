import crypto from 'crypto'

/**
 * Wompi sandbox integration helpers for ALAMAR HOUSE.
 *
 * Required environment variables (set in Vercel project settings or .env.local):
 *   NEXT_PUBLIC_WOMPI_PUBLIC_KEY  — Public key (safe to expose client-side)
 *   WOMPI_PRIVATE_KEY             — Private key (server-side only, never expose)
 *   WOMPI_INTEGRITY_KEY           — Integrity key for signature generation
 *   WOMPI_EVENTS_KEY              — Events key for webhook signature validation
 *   WOMPI_ENV                     — "sandbox" | "production"
 *   NEXT_PUBLIC_BASE_URL          — Base URL of the deployed site (e.g. https://alamarhouse.co)
 *
 * To go live: set WOMPI_ENV=production and replace all sandbox keys with production keys.
 */

export const WOMPI_ENV = process.env.WOMPI_ENV ?? 'sandbox'

export interface ReservationPayload {
  fullName: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: string
  message?: string
  amountInCents: number
  reference: string
}

/**
 * Generates a unique reservation reference in the format ALAMAR-{timestamp}-{random}.
 */
export function generateReference(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `ALAMAR-${timestamp}-${random}`
}

/**
 * Converts a COP amount to centavos (Wompi requires amounts in the smallest unit).
 */
export function toCents(amountCOP: number): number {
  return amountCOP * 100
}

/**
 * Generates the Wompi integrity signature required for the hosted checkout widget.
 * Formula: SHA256( reference + amountInCents + currency + integrityKey )
 * See: https://docs.wompi.co/docs/en/widget-checkout-web#integrity
 */
export function generateIntegritySignature(
  reference: string,
  amountInCents: number,
  currency: string = 'COP'
): string {
  const integrityKey = process.env.WOMPI_INTEGRITY_KEY
  if (!integrityKey) {
    throw new Error('WOMPI_INTEGRITY_KEY is not set. Add it to your environment variables.')
  }
  const stringToHash = `${reference}${amountInCents}${currency}${integrityKey}`
  return crypto.createHash('sha256').update(stringToHash).digest('hex')
}

/**
 * Validates an incoming Wompi webhook event signature.
 * Formula: SHA256( timestamp + transactionId + status + eventsKey )
 * See: https://docs.wompi.co/docs/en/eventos
 */
export function validateWebhookSignature(
  checksum: string,
  transactionId: string,
  status: string,
  timestamp: number
): boolean {
  const eventsKey = process.env.WOMPI_EVENTS_KEY
  if (!eventsKey) return false
  const stringToHash = `${timestamp}${transactionId}${status}${eventsKey}`
  const computed = crypto.createHash('sha256').update(stringToHash).digest('hex')
  return computed === checksum
}

/**
 * Builds the Wompi hosted checkout redirect URL with all required parameters.
 * The user is sent here to complete payment on Wompi's secure hosted page.
 */
export function buildCheckoutUrl(payload: ReservationPayload): string {
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY
  if (!publicKey) {
    throw new Error('NEXT_PUBLIC_WOMPI_PUBLIC_KEY is not set. Add it to your environment variables.')
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const redirectUrl = `${baseUrl}/pago/resultado`
  const signature = generateIntegritySignature(payload.reference, payload.amountInCents)

  const params = new URLSearchParams({
    'public-key': publicKey,
    currency: 'COP',
    'amount-in-cents': payload.amountInCents.toString(),
    reference: payload.reference,
    'signature:integrity': signature,
    'customer-data:email': payload.email,
    'customer-data:full-name': payload.fullName,
    'customer-data:phone-number': payload.phone,
    'redirect-url': redirectUrl,
  })

  return `https://checkout.wompi.co/p/?${params.toString()}`
}

/**
 * Wompi transaction status as returned in webhook events and query params.
 */
export type TransactionStatus = 'APPROVED' | 'PENDING' | 'DECLINED' | 'ERROR'

/**
 * Shape of a Wompi webhook event body.
 */
export interface WompiWebhookEvent {
  event: string
  data: {
    transaction: {
      id: string
      reference: string
      status: TransactionStatus
      amount_in_cents: number
      created_at: string
      [key: string]: unknown
    }
  }
  sent_at: string
  timestamp: number
  signature: {
    checksum: string
    properties: string[]
  }
}

