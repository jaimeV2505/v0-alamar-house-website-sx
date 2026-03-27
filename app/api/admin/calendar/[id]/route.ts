import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('[v0] CALENDAR API: Deleting block:', params.id)
    
    const { error } = await supabase
      .from('calendar_blocks')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    console.log('[v0] CALENDAR API: Block deleted successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] CALENDAR API: Error deleting block:', error)
    return NextResponse.json(
      { error: 'Error al eliminar bloqueo' },
      { status: 500 }
    )
  }
}
