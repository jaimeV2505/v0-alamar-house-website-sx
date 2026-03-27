import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] CALENDAR API: Fetching blocks')
    const { data: blocks, error } = await supabase
      .from('calendar_blocks')
      .select('*')
      .order('start_date', { ascending: true })

    if (error) {
      throw error
    }

    console.log('[v0] CALENDAR API: Retrieved', blocks?.length || 0, 'blocks')
    return NextResponse.json({ blocks: blocks || [] })
  } catch (error) {
    console.error('[v0] CALENDAR API: Error fetching blocks:', error)
    return NextResponse.json(
      { error: 'Error al obtener fechas bloqueadas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { start_date, end_date, block_type, notes, booking_request_id } = await request.json()

    console.log('[v0] CALENDAR API: Creating block', { start_date, end_date, block_type })

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: 'start_date y end_date son requeridos' },
        { status: 400 }
      )
    }

    if (new Date(end_date) < new Date(start_date)) {
      return NextResponse.json(
        { error: 'end_date debe ser posterior a start_date' },
        { status: 400 }
      )
    }

    const { data: block, error } = await supabase
      .from('calendar_blocks')
      .insert({
        start_date,
        end_date,
        block_type: block_type || 'private',
        notes: notes || null,
        booking_request_id: booking_request_id || null,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log('[v0] CALENDAR API: Block created successfully:', block.id)
    return NextResponse.json({ block }, { status: 201 })
  } catch (error) {
    console.error('[v0] CALENDAR API: Error creating block:', error)
    return NextResponse.json(
      { error: 'Error al crear bloqueo de fechas' },
      { status: 500 }
    )
  }
}
