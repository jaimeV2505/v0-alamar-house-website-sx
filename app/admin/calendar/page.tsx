'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Eye, List } from 'lucide-react'
import Link from 'next/link'
import { CalendarGrid } from '@/components/admin/calendar-grid'
import { BlocksList } from '@/components/admin/blocks-list'
import { CalendarBlock } from '@/lib/calendar'

type ViewMode = 'grid' | 'list'

export default function AdminCalendarPage() {
  const [blocks, setBlocks] = useState<CalendarBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchBlocks()
  }, [])

  async function fetchBlocks() {
    try {
      const res = await fetch('/api/admin/calendar')
      if (!res.ok) return
      const data = await res.json()
      setBlocks(data.blocks || [])
    } catch {
      // Network error - keep empty blocks
    } finally {
      setLoading(false)
    }
  }

  async function handleAddBlock(startDate: string, endDate: string, blockType: string, notes: string) {
    try {
      const payload: Record<string, string> = {
        start_date: startDate,
        end_date: endDate,
        block_type: blockType,
      }
      if (notes && notes.trim()) {
        payload.notes = notes.trim()
      }
      
      const res = await fetch('/api/admin/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      
      if (!res.ok) {
        alert(data.error || 'Error al crear bloqueo')
        return
      }
      
      // Refresh the entire list to ensure sync
      await fetchBlocks()
    } catch {
      alert('Error de conexión al crear bloqueo')
    }
  }

  async function handleDeleteBlock(blockId: string) {
    if (!confirm('¿Eliminar este bloqueo de fechas?')) return

    setDeleting(blockId)
    try {
      const res = await fetch(`/api/admin/calendar/${blockId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')
      setBlocks(blocks.filter((b) => b.id !== blockId))
    } catch {
      alert('Error al eliminar bloqueo')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-8">
        {/* Back button */}
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[#1B4D5C] hover:text-[#2A6B7E] mb-8">
          <ChevronLeft size={20} />
          <span className="font-sans text-sm">Volver</span>
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#2C2C2C] mb-2">Gestión de calendario</h1>
            <p className="font-sans text-sm text-[#888880]">Bloquea rangos de fechas no disponibles</p>
          </div>

          {/* View toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-sans text-sm font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#1B4D5C] text-white'
                  : 'bg-white border border-[#E8E3D8] text-[#2C2C2C] hover:bg-[#F5F0E8]'
              }`}
            >
              <Eye size={16} />
              Calendario
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-sans text-sm font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#1B4D5C] text-white'
                  : 'bg-white border border-[#E8E3D8] text-[#2C2C2C] hover:bg-[#F5F0E8]'
              }`}
            >
              <List size={16} />
              Lista
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-[#888880]">Cargando calendario...</p>
          </div>
        ) : viewMode === 'grid' ? (
          <CalendarGrid blocks={blocks} onAddBlock={handleAddBlock} onDeleteBlock={handleDeleteBlock} isLoading={!!deleting} />
        ) : (
          <BlocksList blocks={blocks} onDelete={handleDeleteBlock} isLoading={!!deleting} />
        )}
      </div>
    </div>
  )
}
