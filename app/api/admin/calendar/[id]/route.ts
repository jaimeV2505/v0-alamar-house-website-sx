import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: blockId } = await params
    
    const { error } = await supabase
      .from('calendar_blocks')
      .delete()
      .eq('id', blockId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Error al eliminar bloqueo' },
      { status: 500 }
    )
  }
}
