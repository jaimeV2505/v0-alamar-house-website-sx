import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'
import { createBlockSchema, CalendarBlock } from '@/lib/calendar'

// GET - Fetch all calendar blocks
export async function GET() {
  try {
    const { data: blocks, error } = await supabase
      .from('calendar_blocks')
      .select('id, block_date, start_date, end_date, block_type, notes, reason, booking_request_id, created_at')
      .not('start_date', 'is', null)
      .not('end_date', 'is', null)
      .order('start_date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Error al obtener bloqueos' }, { status: 500 })
    }

    const validBlocks: CalendarBlock[] = (blocks || [])
      .filter(b => b.start_date && b.end_date)
      .map(b => ({
        ...b,
        block_type: b.block_type || b.reason || 'unavailable',
      }))

    return NextResponse.json({ blocks: validBlocks })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST - Create a new calendar block
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const parsed = createBlockSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    const { start_date, end_date, block_type, notes, booking_request_id } = parsed.data

    // Check for overlapping blocks
    const { data: existingBlocks } = await supabase
      .from('calendar_blocks')
      .select('id, start_date, end_date')
      .not('start_date', 'is', null)
      .not('end_date', 'is', null)

    const hasOverlap = existingBlocks?.some(block => {
      if (!block.start_date || !block.end_date) return false
      const blockStart = new Date(block.start_date)
      const blockEnd = new Date(block.end_date)
      const newStart = new Date(start_date)
      const newEnd = new Date(end_date)
      return newStart <= blockEnd && newEnd >= blockStart
    })

    if (hasOverlap) {
      return NextResponse.json(
        { error: 'Ya existe un bloqueo en ese rango de fechas' },
        { status: 409 }
      )
    }

    // Insert with block_date (required NOT NULL field)
    const { data: block, error } = await supabase
      .from('calendar_blocks')
      .insert({
        block_date: start_date,
        start_date: start_date,
        end_date: end_date,
        block_type: block_type,
        notes: notes || null,
        booking_request_id: booking_request_id || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Error al crear bloqueo: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ block }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Delete a calendar block by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blockId = searchParams.get('id')

    if (!blockId) {
      return NextResponse.json(
        { error: 'ID del bloqueo requerido' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('calendar_blocks')
      .delete()
      .eq('id', blockId)

    if (error) {
      return NextResponse.json(
        { error: `Error al eliminar bloqueo: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
