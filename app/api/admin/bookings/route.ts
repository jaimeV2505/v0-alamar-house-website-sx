import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] BOOKINGS LIST: Fetching all bookings')
    
    const { data: bookings, error } = await supabase
      .from('booking_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.log('[v0] BOOKINGS LIST: Error from Supabase:', error.message)
      throw error
    }

    console.log('[v0] BOOKINGS LIST: Retrieved', bookings?.length || 0, 'bookings')
    return NextResponse.json({ bookings: bookings || [] })
  } catch (error) {
    console.error('[v0] BOOKINGS LIST ERROR:', error)
    return NextResponse.json(
      { error: 'Error al obtener reservas' },
      { status: 500 }
    )
  }
}
