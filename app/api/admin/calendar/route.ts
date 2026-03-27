import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] CALENDAR API: Fetching blocks')
    const { data: blocks, error } = await supabase
      .from('calendar_blocks')
      .select('id, start_date, end_date, block_type, notes, reason, booking_request_id, created_at')
      .not('start_date', 'is', null)
      .not('end_date', 'is', null)
      .order('start_date', { ascending: true })

    if (error) {
      console.error('[v0] CALENDAR API: Supabase error:', error.message)
      throw error
    }

    // Filter out any blocks with invalid dates
    const validBlocks = (blocks || []).filter(b => b.start_date && b.end_date)
    
    console.log('[v0] CALENDAR API: Retrieved', validBlocks.length, 'valid blocks')
    return NextResponse.json({ blocks: validBlocks })
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
    // Check if service role key is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[v0] CALENDAR API: SUPABASE_SERVICE_ROLE_KEY not configured')
      return NextResponse.json(
        { error: 'Configuración de servidor incompleta' },
        { status: 500 }
      )
    }
    
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
      console.error('[v0] CALENDAR API: Supabase insert error:', error.message, error.code)
      return NextResponse.json(
        { error: `Error de base de datos: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('[v0] CALENDAR API: Block created successfully:', block?.id)
    return NextResponse.json({ block }, { status: 201 })
  } catch (error) {
    console.error('[v0] CALENDAR API: Error creating block:', error)
    return NextResponse.json(
      { error: 'Error al crear bloqueo de fechas' },
      { status: 500 }
    )
  }
}
