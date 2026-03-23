import { NextRequest, NextResponse } from 'next/server'
import { createWompiCheckout } from '@/lib/wompi'

/**
 * POST /api/wompi/checkout
 * Creates a Wompi checkout session for a reservation
 * 
 * Request body:
 * {
 *   fullName: string
 *   email: string
 *   phone: string
 *   checkIn: string (ISO date)
 *   checkOut: string (ISO date)
 *   nights: number
 *   totalAmount: number (COP)
 *   pricePerNight: number
 *   guests: number
 *   message?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Checkout request received')

    // Parse request body
    const body = await request.json()

    // Validate required fields
    const required = [
      'fullName',
      'email',
      'phone',
      'checkIn',
      'checkOut',
      'nights',
      'totalAmount',
      'pricePerNight',
      'guests',
    ]

    for (const field of required) {
      if (!body[field]) {
        console.log(`[v0] Missing required field: ${field}`)
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate dates
    const checkIn = new Date(body.checkIn)
    const checkOut = new Date(body.checkOut)
    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      )
    }

    // Validate amount
    if (body.totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    console.log('[v0] Validation passed, creating checkout...')

    // Create Wompi checkout
    const checkoutData = await createWompiCheckout({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      nights: body.nights,
      totalAmount: body.totalAmount,
      pricePerNight: body.pricePerNight,
      guests: body.guests,
      message: body.message,
    })

    console.log('[v0] Checkout created:', checkoutData.reference)

    return NextResponse.json(
      {
        success: true,
        reference: checkoutData.reference,
        checkoutUrl: checkoutData.checkoutUrl,
        amount: checkoutData.amount,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Checkout error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
