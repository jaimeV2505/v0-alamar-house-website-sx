import { NextRequest, NextResponse } from 'next/server'
import {
  validateWebhookSignature,
  parseWompiEvent,
  handleTransactionUpdate,
} from '@/lib/wompi'

/**
 * POST /api/wompi/webhook
 * Receives payment status updates from Wompi
 * Wompi sends webhook events for transaction status changes
 * 
 * Configure in Wompi dashboard:
 * Webhook URL: https://yourdomain.com/api/wompi/webhook
 * Events: transaction.updated, transaction.completed, etc.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Webhook received from Wompi')

    // Get signature header
    const signature = request.headers.get('x-wompi-signature')

    // Read body
    const rawBody = await request.text()
    const body = JSON.parse(rawBody)

    console.log('[v0] Webhook event:', body.event)

    // Validate signature
    const isValid = await validateWebhookSignature(rawBody, signature)
    if (!isValid) {
      console.warn('[v0] Invalid webhook signature')
      // Still process in sandbox mode
      if (process.env.WOMPI_ENV !== 'sandbox') {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    // Parse event
    const event = parseWompiEvent(body)
    if (!event) {
      console.warn('[v0] Failed to parse Wompi event')
      return NextResponse.json(
        { error: 'Invalid event format' },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.event) {
      case 'transaction.updated':
      case 'transaction.completed':
        console.log('[v0] Processing transaction update')
        const result = await handleTransactionUpdate(event)
        return NextResponse.json(result, { status: 200 })

      default:
        console.log('[v0] Unhandled event type:', event.event)
        // Still return 200 to acknowledge receipt
        return NextResponse.json(
          { received: true, event: event.event },
          { status: 200 }
        )
    }
  } catch (error) {
    console.error('[v0] Webhook error:', error)

    // Always return 200 to prevent Wompi retries on processing errors
    // In production, implement proper error logging and alerting
    return NextResponse.json(
      { received: true, error: 'Processing error' },
      { status: 200 }
    )
  }
}

/**
 * GET /api/wompi/webhook
 * For testing/verification from Wompi dashboard
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Wompi webhook endpoint is active',
      environment: process.env.WOMPI_ENV || 'development',
    },
    { status: 200 }
  )
}
