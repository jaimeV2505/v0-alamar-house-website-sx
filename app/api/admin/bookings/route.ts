import { NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET() {
  try {
    const { data: bookings, error } = await supabase
      .from('booking_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ bookings: bookings || [] })
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener reservas' },
      { status: 500 }
    )
  }
}
