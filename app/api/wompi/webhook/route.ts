import { NextRequest, NextResponse } from 'next/server'
import { validateWebhookSignature, WompiWebhookEvent } from '@/lib/wompi'

/**
 * POST /api/wompi/webhook
 * Receives Wompi server-to-server transaction status events.
 *
 * Configure this URL in your Wompi dashboard under:
 *   Developers → Webhooks → https://yourdomain.co/api/wompi/webhook
 */
export async function POST(req: NextRequest) {
  try {
    const body: WompiWebhookEvent = await req.json()
    const { event, data, timestamp, signature } = body
    const transaction = data?.transaction

    if (!transaction?.id || !transaction?.status || !signature?.checksum) {
      return NextResponse.json({ error: 'Invalid event payload.' }, { status: 400 })
    }

    const isValid = validateWebhookSignature(
      signature.checksum,
      transaction.id,
      transaction.status,
      timestamp
    )

    if (!isValid && process.env.WOMPI_ENV === 'production') {
      console.warn('[wompi/webhook] Invalid signature — rejecting event.')
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
    }

    const { reference, status, id: transactionId } = transaction
    console.log('[wompi/webhook]', { event, reference, status, transactionId })

    // TODO: Update reservation status in your database here.
    // Example (Neon / Supabase / Prisma):
    //
    // await db.reservation.update({
    //   where: { reference },
    //   data: { paymentStatus: status, wompiTransactionId: transactionId },
    // })
    //
    // if (status === 'APPROVED') {
    //   await sendConfirmationEmail({ reference, ...transaction })
    // }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error processing webhook.'
    console.error('[wompi/webhook]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/** GET — health check for Wompi dashboard verification */
export async function GET() {
  return NextResponse.json({
    active: true,
    environment: process.env.WOMPI_ENV ?? 'sandbox',
  })
}
