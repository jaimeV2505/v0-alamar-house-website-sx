import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guest_name, guest_email, guest_phone, check_in_date, check_out_date, number_of_guests, special_requests } = body

    // Validation
    if (!guest_name || !guest_email || !guest_phone || !check_in_date || !check_out_date || !number_of_guests) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben ser completados' },
        { status: 400 }
      )
    }

    const checkIn = new Date(check_in_date)
    const checkOut = new Date(check_out_date)

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: 'La fecha de salida debe ser posterior a la fecha de entrada' },
        { status: 400 }
      )
    }

    if (number_of_guests < 1 || number_of_guests > 12) {
      return NextResponse.json(
        { error: 'El número de huéspedes debe estar entre 1 y 12' },
        { status: 400 }
      )
    }

    // Check for calendar blocks
    const { data: blockedDates } = await supabase
      .from('calendar_blocks')
      .select('block_date')
      .gte('block_date', check_in_date)
      .lt('block_date', check_out_date)

    if (blockedDates && blockedDates.length > 0) {
      return NextResponse.json(
        { error: 'Una o más fechas solicitadas no están disponibles' },
        { status: 409 }
      )
    }

    // Create booking request
    const { data: booking, error } = await supabase
      .from('booking_requests')
      .insert({
        guest_name,
        guest_email,
        guest_phone,
        check_in_date,
        check_out_date,
        number_of_guests,
        special_requests: special_requests || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Error al crear la reserva' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Reserva solicitada exitosamente',
        booking_id: booking.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
