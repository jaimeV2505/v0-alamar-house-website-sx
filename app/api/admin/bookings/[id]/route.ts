import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('[v0] BOOKING DETAIL: Fetching booking:', params.id)
    
    const { data: booking, error } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.log('[v0] BOOKING DETAIL: Error from Supabase:', error.message)
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    if (!booking) {
      console.log('[v0] BOOKING DETAIL: Booking not found')
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    console.log('[v0] BOOKING DETAIL: Retrieved booking successfully')
    return NextResponse.json({ booking })
  } catch (error) {
    console.error('[v0] BOOKING DETAIL ERROR:', error)
    return NextResponse.json(
      { error: 'Error al obtener reserva' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('[v0] BOOKING UPDATE: Updating booking:', params.id)
    
    const { status, admin_notes } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Estado requerido' },
        { status: 400 }
      )
    }

    const { data: booking, error } = await supabase
      .from('booking_requests')
      .update({
        status,
        admin_notes: admin_notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.log('[v0] BOOKING UPDATE: Error from Supabase:', error.message)
      return NextResponse.json(
        { error: 'Error al actualizar reserva' },
        { status: 500 }
      )
    }

    if (!booking) {
      console.log('[v0] BOOKING UPDATE: Booking not found after update')
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    console.log('[v0] BOOKING UPDATE: Updated successfully')
    return NextResponse.json({ booking })
  } catch (error) {
    console.error('[v0] BOOKING UPDATE ERROR:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
