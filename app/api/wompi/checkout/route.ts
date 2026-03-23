import { NextRequest, NextResponse } from 'next/server'
import { generateReference, toCents, buildCheckoutUrl } from '@/lib/wompi'
import { calculatePrice } from '@/lib/pricing'

/**
 * POST /api/wompi/checkout
 * Validates the reservation, calculates the price server-side,
 * generates a Wompi hosted-checkout redirect URL, and returns it.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, phone, checkIn, checkOut, guests, message } = body

    if (!fullName || !email || !phone || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben completarse.' },
        { status: 400 }
      )
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: 'La fecha de salida debe ser posterior a la llegada.' },
        { status: 400 }
      )
    }

    // Always calculate price server-side — never trust a client-supplied amount
    const pricing = calculatePrice(new Date(checkIn), new Date(checkOut))

    if (pricing.nights < 1) {
      return NextResponse.json(
        { error: 'La reserva debe ser de al menos 1 noche.' },
        { status: 400 }
      )
    }

    const reference = generateReference()
    const amountInCents = toCents(pricing.totalEstimated)

    const redirectUrl = buildCheckoutUrl({
      fullName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      message,
      amountInCents,
      reference,
    })

    return NextResponse.json({ redirectUrl, reference })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno del servidor.'
    console.error('[wompi/checkout]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
