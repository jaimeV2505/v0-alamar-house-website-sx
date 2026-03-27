import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'start_date and end_date are required' },
        { status: 400 }
      )
    }

    // Get confirmed bookings and blocked dates
    const [bookingsRes, blockedRes] = await Promise.all([
      supabase
        .from('booking_requests')
        .select('check_in_date, check_out_date')
        .eq('status', 'confirmed')
        .gte('check_out_date', startDate)
        .lte('check_in_date', endDate),
      supabase
        .from('calendar_blocks')
        .select('block_date')
        .gte('block_date', startDate)
        .lte('block_date', endDate),
    ])

    const unavailableDates = new Set<string>()

    // Add blocked calendar dates
    if (blockedRes.data) {
      blockedRes.data.forEach((block) => {
        unavailableDates.add(block.block_date)
      })
    }

    // Add booked date ranges
    if (bookingsRes.data) {
      bookingsRes.data.forEach((booking) => {
        const current = new Date(booking.check_in_date)
        const end = new Date(booking.check_out_date)

        while (current < end) {
          unavailableDates.add(current.toISOString().split('T')[0])
          current.setDate(current.getDate() + 1)
        }
      })
    }

    return NextResponse.json({
      unavailable_dates: Array.from(unavailableDates).sort(),
    })
  } catch (error) {
    console.error('Availability check error:', error)
    return NextResponse.json(
      { error: 'Error al verificar disponibilidad' },
      { status: 500 }
    )
  }
}
