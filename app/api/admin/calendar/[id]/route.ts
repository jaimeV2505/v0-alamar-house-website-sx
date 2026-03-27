import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase
      .from('calendar_blocks')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting calendar block:', error)
    return NextResponse.json(
      { error: 'Error al eliminar fecha bloqueada' },
      { status: 500 }
    )
  }
}
