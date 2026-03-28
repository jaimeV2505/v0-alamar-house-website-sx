import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: bookingId } = await params
    
    const { data: booking, error } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ booking })
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener reserva' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: bookingId } = await params
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
      .eq('id', bookingId)
      .select()
      .single()

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Error al actualizar reserva' },
        { status: 500 }
      )
    }

    // If status changed to cancelled or rejected, remove associated calendar block
    if (status === 'cancelled' || status === 'rejected') {
      await supabase
        .from('calendar_blocks')
        .delete()
        .eq('booking_request_id', bookingId)
    }

    return NextResponse.json({ booking })
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: bookingId } = await params

    // First delete associated calendar blocks
    await supabase
      .from('calendar_blocks')
      .delete()
      .eq('booking_request_id', bookingId)

    // Then delete the booking
    const { error } = await supabase
      .from('booking_requests')
      .delete()
      .eq('id', bookingId)

    if (error) {
      return NextResponse.json(
        { error: 'Error al eliminar reserva' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
