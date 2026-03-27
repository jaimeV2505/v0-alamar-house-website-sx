import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'
import { createBlockSchema, CalendarBlock } from '@/lib/calendar'

export async function GET() {
  try {
    const { data: blocks, error } = await supabase
      .from('calendar_blocks')
      .select('id, start_date, end_date, block_type, notes, reason, booking_request_id, created_at')
      .not('start_date', 'is', null)
      .not('end_date', 'is', null)
      .order('start_date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Error al obtener bloqueos' }, { status: 500 })
    }

    // Filter and normalize blocks
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[v0] CALENDAR POST: Received body:', JSON.stringify(body))
    
    // Validate with Zod
    const parsed = createBlockSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      console.log('[v0] CALENDAR POST: Validation failed:', firstError.message)
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const { start_date, end_date, block_type, notes, booking_request_id } = parsed.data
    console.log('[v0] CALENDAR POST: Validated data:', { start_date, end_date, block_type })

    // Check for overlapping blocks - use a simpler query approach
    const { data: existingBlocks, error: checkError } = await supabase
      .from('calendar_blocks')
      .select('id, start_date, end_date')
      .not('start_date', 'is', null)
      .not('end_date', 'is', null)

    console.log('[v0] CALENDAR POST: All blocks:', existingBlocks?.length, 'checkError:', checkError?.message)

    // Check overlap manually for better reliability
    const hasOverlap = existingBlocks?.some(block => {
      if (!block.start_date || !block.end_date) return false
      const blockStart = new Date(block.start_date)
      const blockEnd = new Date(block.end_date)
      const newStart = new Date(start_date)
      const newEnd = new Date(end_date)
      // Check if ranges overlap
      return newStart <= blockEnd && newEnd >= blockStart
    })

    console.log('[v0] CALENDAR POST: Has overlap:', hasOverlap)

    if (hasOverlap) {
      console.log('[v0] CALENDAR POST: Overlap detected')
      return NextResponse.json(
        { error: 'Ya existe un bloqueo en ese rango de fechas' },
        { status: 409 }
      )
    }

    console.log('[v0] CALENDAR POST: Inserting block...')
    const { data: block, error } = await supabase
      .from('calendar_blocks')
      .insert({
        block_date: start_date, // Required NOT NULL column - use start_date
        start_date,
        end_date,
        block_type,
        notes: notes || null,
        booking_request_id: booking_request_id || null,
      })
      .select()
      .single()

    console.log('[v0] CALENDAR POST: Insert result:', { block, error: error?.message, code: error?.code })

    if (error) {
      console.log('[v0] CALENDAR POST: Insert error details:', JSON.stringify(error))
      return NextResponse.json(
        { error: `Error al crear bloqueo: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('[v0] CALENDAR POST: Block created successfully:', block?.id)
    return NextResponse.json({ block }, { status: 201 })
  } catch (err) {
    console.log('[v0] CALENDAR POST: Catch error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
