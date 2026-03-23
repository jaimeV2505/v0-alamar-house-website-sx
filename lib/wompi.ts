/**
 * Wompi payment integration utilities
 * Handles checkout creation and webhook validation
 * All sensitive keys should be in environment variables
 */

const WOMPI_API_BASE = 'https://gql.wombipay.com/graphql'
const WOMPI_CHECKOUT_BASE = process.env.WOMPI_ENV === 'sandbox' 
  ? 'https://checkout.wompi.co/sandbox'
  : 'https://checkout.wompi.co'

/**
 * Creates a Wompi checkout session for the reservation
 * Requires env vars: WOMPI_PUBLIC_KEY, WOMPI_PRIVATE_KEY
 */
export async function createWompiCheckout(reservationData: {
  fullName: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  nights: number
  totalAmount: number
  pricePerNight: number
  guests: number
  message?: string
}) {
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY
  const privateKey = process.env.WOMPI_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    throw new Error('Missing Wompi API keys in environment variables')
  }

  // Generate a unique reference for this reservation
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  const reference = `ALAMAR-${timestamp}-${random}`

  // Amount in cents for Wompi (COP is already in whole units)
  const amountInCents = Math.round(reservationData.totalAmount * 100)

  // TODO: Store reservation data in database with reference
  console.log('[v0] Creating Wompi checkout for reference:', reference)
  console.log('[v0] Amount:', reservationData.totalAmount, 'COP')

  // Create checkout URL with reference and amount
  const checkoutParams = new URLSearchParams({
    public_key: publicKey,
    amount_in_cents: String(amountInCents),
    currency: 'COP',
    reference: reference,
    redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pago/resultado?reference=${reference}`,
    customer_email: reservationData.email,
    customer_phone_number: reservationData.phone,
    customer_full_name: reservationData.fullName,
  })

  const checkoutUrl = `${WOMPI_CHECKOUT_BASE}?${checkoutParams.toString()}`

  return {
    reference,
    checkoutUrl,
    amount: reservationData.totalAmount,
    reservation: {
      fullName: reservationData.fullName,
      email: reservationData.email,
      phone: reservationData.phone,
      checkIn: reservationData.checkIn,
      checkOut: reservationData.checkOut,
      nights: reservationData.nights,
      guests: reservationData.guests,
      message: reservationData.message || '',
    },
  }
}

/**
 * Validates webhook signature from Wompi
 * Wompi sends a signature header for verification
 */
export async function validateWebhookSignature(
  eventBody: string,
  signature: string | undefined
): Promise<boolean> {
  const eventsKey = process.env.WOMPI_EVENTS_KEY

  if (!eventsKey || !signature) {
    console.warn('[v0] Missing events key or signature')
    return false
  }

  // TODO: Implement proper HMAC signature validation
  // For sandbox testing, accept all events
  if (process.env.WOMPI_ENV === 'sandbox') {
    return true
  }

  // In production, validate the signature properly
  // This is a placeholder - implement with crypto module
  console.log('[v0] Signature validation not fully implemented')
  return true
}

/**
 * Parses and validates a Wompi webhook event
 */
export interface WompiWebhookEvent {
  event: string
  data: {
    transaction: {
      id: string
      reference: string
      status: 'APPROVED' | 'PENDING' | 'DECLINED' | 'ERROR'
      amount_in_cents: number
      payment_method: string
      created_at: string
      [key: string]: any
    }
    [key: string]: any
  }
  [key: string]: any
}

export function parseWompiEvent(body: any): WompiWebhookEvent | null {
  try {
    if (!body.data?.transaction?.reference) {
      console.warn('[v0] Invalid Wompi event structure')
      return null
    }
    return body as WompiWebhookEvent
  } catch (error) {
    console.error('[v0] Error parsing Wompi event:', error)
    return null
  }
}

/**
 * Handles a Wompi transaction status update
 * TODO: Connect to database to update reservation status
 */
export async function handleTransactionUpdate(event: WompiWebhookEvent) {
  const { reference, status, id } = event.data.transaction

  console.log('[v0] Transaction update:', {
    reference,
    status,
    id,
    timestamp: new Date().toISOString(),
  })

  // TODO: Database operation example:
  // const reservation = await db.reservation.findUnique({ where: { reference } })
  // await db.reservation.update({
  //   where: { reference },
  //   data: { paymentStatus: status, wompiTransactionId: id }
  // })

  switch (status) {
    case 'APPROVED':
      console.log('[v0] Payment approved for reservation:', reference)
      // Send confirmation email, create booking, etc.
      break
    case 'PENDING':
      console.log('[v0] Payment pending for reservation:', reference)
      // Send pending notification
      break
    case 'DECLINED':
      console.log('[v0] Payment declined for reservation:', reference)
      // Send declined notification, allow retry
      break
    case 'ERROR':
      console.log('[v0] Payment error for reservation:', reference)
      // Send error notification, allow retry
      break
  }

  return { success: true, reference, status }
}

/**
 * Gets the payment status for a reservation
 * TODO: Query database for reservation status
 */
export async function getPaymentStatus(reference: string) {
  console.log('[v0] Getting payment status for reference:', reference)

  // TODO: Database query example:
  // const reservation = await db.reservation.findUnique({
  //   where: { reference },
  //   select: { paymentStatus: true, wompiTransactionId: true }
  // })

  // For now, return placeholder
  return {
    reference,
    status: 'pending',
    transactionId: null,
  }
}
