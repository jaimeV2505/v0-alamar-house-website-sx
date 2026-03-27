import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { data: blocks, error } = await supabase
      .from('calendar_blocks')
      .select('*')
      .order('block_date', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({ blocks: blocks || [] })
  } catch (error) {
    console.error('Error fetching calendar blocks:', error)
    return NextResponse.json(
      { error: 'Error al obtener fechas bloqueadas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { block_date, reason } = await request.json()

    if (!block_date) {
      return NextResponse.json(
        { error: 'block_date es requerido' },
        { status: 400 }
      )
    }

    const { data: block, error } = await supabase
      .from('calendar_blocks')
      .insert({
        block_date,
        reason: reason || 'unavailable',
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ block }, { status: 201 })
  } catch (error) {
    console.error('Error creating calendar block:', error)
    return NextResponse.json(
      { error: 'Error al crear fecha bloqueada' },
      { status: 500 }
    )
  }
}
