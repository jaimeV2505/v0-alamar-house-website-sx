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
        .not('start_date', 'is', null)
        .not('end_date', 'is', null)
        .gte('end_date', startDate)
        .lte('start_date', endDate),
    ])

    const unavailableDates = new Set<string>()

    // Helper function to generate dates between start and end (inclusive)
    // Uses string manipulation to avoid timezone issues
    const generateDateRange = (startStr: string, endStr: string, includeEnd = true) => {
      const dates: string[] = []
      const [startYear, startMonth, startDay] = startStr.split('-').map(Number)
      const [endYear, endMonth, endDay] = endStr.split('-').map(Number)
      
      // Create dates in local time (not UTC)
      const current = new Date(startYear, startMonth - 1, startDay)
      const end = new Date(endYear, endMonth - 1, endDay)
      
      while (includeEnd ? current <= end : current < end) {
        const y = current.getFullYear()
        const m = String(current.getMonth() + 1).padStart(2, '0')
        const d = String(current.getDate()).padStart(2, '0')
        dates.push(`${y}-${m}-${d}`)
        current.setDate(current.getDate() + 1)
      }
      return dates
    }

    // Add blocked calendar date ranges
    if (blockedRes.data) {
      blockedRes.data.forEach((block) => {
        if (!block.start_date || !block.end_date) return
        generateDateRange(block.start_date, block.end_date, true).forEach(d => unavailableDates.add(d))
      })
    }

    // Add booked date ranges (check-out day is available for new check-in)
    if (bookingsRes.data) {
      bookingsRes.data.forEach((booking) => {
        generateDateRange(booking.check_in_date, booking.check_out_date, false).forEach(d => unavailableDates.add(d))
      })
    }

    return NextResponse.json({
      unavailable_dates: Array.from(unavailableDates).sort(),
    })
  } catch (error) {
    console.error('Availability API error:', error)
    return NextResponse.json(
      { error: 'Error al verificar disponibilidad' },
      { status: 500 }
    )
  }
}
