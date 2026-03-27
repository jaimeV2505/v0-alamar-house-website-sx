import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    console.log('[v0] AVAILABILITY: Checking dates', { startDate, endDate })

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'start_date and end_date are required' },
        { status: 400 }
      )
    }

    // Get confirmed bookings and blocked date ranges
    const [bookingsRes, blockedRes] = await Promise.all([
      supabase
        .from('booking_requests')
        .select('check_in_date, check_out_date')
        .eq('status', 'confirmed')
        .gte('check_out_date', startDate)
        .lte('check_in_date', endDate),
      supabase
        .from('calendar_blocks')
        .select('start_date, end_date')
        .gte('end_date', startDate)
        .lte('start_date', endDate),
    ])

    const unavailableDates = new Set<string>()

    // Add blocked calendar date ranges
    if (blockedRes.data) {
      console.log('[v0] AVAILABILITY: Found', blockedRes.data.length, 'blocked ranges')
      blockedRes.data.forEach((block) => {
        // Skip blocks without valid dates
        if (!block.start_date || !block.end_date) return
        
        const current = new Date(block.start_date)
        const end = new Date(block.end_date)

        while (current <= end) {
          unavailableDates.add(current.toISOString().split('T')[0])
          current.setDate(current.getDate() + 1)
        }
      })
    }

    // Add booked date ranges
    if (bookingsRes.data) {
      console.log('[v0] AVAILABILITY: Found', bookingsRes.data.length, 'confirmed bookings')
      bookingsRes.data.forEach((booking) => {
        const current = new Date(booking.check_in_date)
        const end = new Date(booking.check_out_date)

        while (current < end) {
          unavailableDates.add(current.toISOString().split('T')[0])
          current.setDate(current.getDate() + 1)
        }
      })
    }

    console.log('[v0] AVAILABILITY: Total unavailable dates:', unavailableDates.size)
    return NextResponse.json({
      unavailable_dates: Array.from(unavailableDates).sort(),
    })
  } catch (error) {
    console.error('[v0] AVAILABILITY ERROR:', error)
    return NextResponse.json(
      { error: 'Error al verificar disponibilidad' },
      { status: 500 }
    )
  }
}
