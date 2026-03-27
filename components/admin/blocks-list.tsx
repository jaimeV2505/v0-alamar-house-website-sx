'use client'

import { Trash2, Edit2 } from 'lucide-react'

interface BlockedDate {
  id: string
  start_date: string
  end_date: string
  block_type: 'confirmed' | 'maintenance' | 'cleaning' | 'private'
  reason?: string
  created_at: string
}

interface BlocksListProps {
  blocks: BlockedDate[]
  onDelete: (id: string) => void
  isLoading?: boolean
}

const BLOCK_TYPE_INFO = {
  confirmed: { color: 'text-[#6B9C85]', bg: 'bg-[#6B9C85]/10', label: 'Reserva confirmada' },
  maintenance: { color: 'text-[#F39C12]', bg: 'bg-[#F39C12]/10', label: 'Mantenimiento' },
  cleaning: { color: 'text-[#3498DB]', bg: 'bg-[#3498DB]/10', label: 'Limpieza' },
  private: { color: 'text-[#D97373]', bg: 'bg-[#D97373]/10', label: 'Privado' },
}

export function BlocksList({ blocks, onDelete, isLoading }: BlocksListProps) {
  if (blocks.length === 0) {
    return (
      <div className="bg-white border border-[#E8E3D8] rounded-lg p-8 text-center">
        <p className="font-sans text-sm text-[#888880]">No hay bloqueos de fechas. Toda la casa está disponible.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {blocks.map((block) => {
        const info = BLOCK_TYPE_INFO[block.block_type]
        const startDate = new Date(block.start_date)
        const endDate = new Date(block.end_date)
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

        return (
          <div
            key={block.id}
            className="bg-white border border-[#E8E3D8] rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`font-sans text-xs font-semibold px-2 py-1 rounded-full ${info.bg} ${info.color}`}>
                  {info.label}
                </span>
                <p className="font-sans font-semibold text-[#2C2C2C]">
                  {startDate.toLocaleDateString('es-CO')} → {endDate.toLocaleDateString('es-CO')}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <p className="font-sans text-xs text-[#888880]">{nights} días</p>
                {block.reason && <p className="font-sans text-sm text-[#666666]">{block.reason}</p>}
                <p className="font-sans text-xs text-[#AAAAAA]">
                  {new Date(block.created_at).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={() => onDelete(block.id)}
              disabled={isLoading}
              className="ml-4 p-2 text-[#D97373] hover:bg-[#D97373]/10 rounded-md transition-colors disabled:opacity-50"
              title="Eliminar bloqueo"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
