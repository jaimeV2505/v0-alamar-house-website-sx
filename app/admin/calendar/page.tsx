'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface CalendarBlock {
  id: string
  block_date: string
  reason: string
  created_at: string
}

export default function AdminCalendarPage() {
  const [blocks, setBlocks] = useState<CalendarBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [newBlockDate, setNewBlockDate] = useState('')
  const [newBlockReason, setNewBlockReason] = useState('unavailable')
  const [adding, setAdding] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchBlocks()
  }, [])

  async function fetchBlocks() {
    try {
      const res = await fetch('/api/admin/calendar')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setBlocks(data.blocks || [])
    } catch (err) {
      console.error('Error fetching calendar blocks:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddBlock(e: React.FormEvent) {
    e.preventDefault()
    if (!newBlockDate) return

    setAdding(true)
    try {
      const res = await fetch('/api/admin/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_date: newBlockDate,
          reason: newBlockReason,
        }),
      })

      if (!res.ok) throw new Error('Failed to add block')
      const data = await res.json()
      setBlocks([...blocks, data.block])
      setNewBlockDate('')
      setNewBlockReason('unavailable')
    } catch (err) {
      console.error('Error adding block:', err)
      alert('Error al añadir fecha bloqueada')
    } finally {
      setAdding(false)
    }
  }

  async function handleDeleteBlock(blockId: string) {
    if (!confirm('¿Eliminar esta fecha bloqueada?')) return

    try {
      const res = await fetch(`/api/admin/calendar/${blockId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')
      setBlocks(blocks.filter((b) => b.id !== blockId))
    } catch (err) {
      console.error('Error deleting block:', err)
      alert('Error al eliminar fecha bloqueada')
    }
  }

  const upcomingBlocks = blocks
    .filter((b) => b.block_date >= today)
    .sort((a, b) => a.block_date.localeCompare(b.block_date))

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 py-8">
        {/* Back button */}
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[#1B4D5C] hover:text-[#2A6B7E] mb-8">
          <ChevronLeft size={20} />
          <span className="font-sans text-sm">Volver</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-[#2C2C2C] mb-2">Calendario</h1>
          <p className="font-sans text-sm text-[#888880]">Bloquea fechas no disponibles</p>
        </div>

        {/* Add block form */}
        <div className="bg-white rounded-lg border border-[#E8E3D8] p-6 mb-8">
          <h2 className="font-serif text-lg font-bold text-[#2C2C2C] mb-4 flex items-center gap-2">
            <Plus size={20} />
            Bloquear fecha
          </h2>

          <form onSubmit={handleAddBlock} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide block mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={newBlockDate}
                onChange={(e) => setNewBlockDate(e.target.value)}
                min={today}
                className="w-full font-sans text-sm border border-[#E8E3D8] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1B4D5C]"
                required
              />
            </div>

            <div className="flex-1">
              <label className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide block mb-2">
                Razón
              </label>
              <select
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                className="w-full font-sans text-sm border border-[#E8E3D8] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1B4D5C]"
              >
                <option value="unavailable">No disponible</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="cleaning">Limpieza</option>
                <option value="private">Uso privado</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={adding || !newBlockDate}
              className="font-sans text-sm font-semibold px-6 py-3 bg-[#1B4D5C] text-white rounded-lg hover:bg-[#2A6B7E] transition-colors disabled:opacity-50 self-end whitespace-nowrap"
            >
              {adding ? 'Añadiendo...' : 'Bloquear'}
            </button>
          </form>
        </div>

        {/* Blocked dates list */}
        {loading ? (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-[#888880]">Cargando...</p>
          </div>
        ) : upcomingBlocks.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E8E3D8] p-8 text-center">
            <p className="font-sans text-sm text-[#888880]">No hay fechas bloqueadas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBlocks.map((block) => (
              <div key={block.id} className="bg-white rounded-lg border border-[#E8E3D8] p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-serif text-lg font-bold text-[#2C2C2C]">
                    {new Date(block.block_date).toLocaleDateString('es-CO', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="font-sans text-sm text-[#888880] capitalize mt-1">{block.reason}</p>
                </div>

                <button
                  onClick={() => handleDeleteBlock(block.id)}
                  className="p-2 text-[#D97373] hover:bg-[#D97373]/10 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
