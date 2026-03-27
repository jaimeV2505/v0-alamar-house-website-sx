'use client'

import { Trash2 } from 'lucide-react'
import { CalendarBlock, getBlockReasonInfo, calculateNights, formatDateRange } from '@/lib/calendar'

interface BlocksListProps {
  blocks: CalendarBlock[]
  onDelete: (id: string) => void
  isLoading?: boolean
}

export function BlocksList({ blocks, onDelete, isLoading }: BlocksListProps) {
  // Filter out blocks with missing dates
  const validBlocks = (blocks || []).filter(b => b?.start_date && b?.end_date)
  
  if (validBlocks.length === 0) {
    return (
      <div className="bg-white border border-[#E8E3D8] rounded-lg p-8 text-center">
        <p className="font-sans text-sm text-[#888880]">No hay bloqueos de fechas. Toda la casa está disponible.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {validBlocks.map((block) => {
        const info = getBlockReasonInfo(block.block_type)
        if (!info) return null
        const nights = calculateNights(block.start_date, block.end_date)
        const dateStr = formatDateRange(block.start_date, block.end_date)

        return (
          <div
            key={block.id}
            className="bg-white border border-[#E8E3D8] rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`font-sans text-xs font-semibold px-2 py-1 rounded-full ${info.bgLightClass} ${info.textClass}`}>
                  {info.label}
                </span>
                <p className="font-sans font-semibold text-[#2C2C2C]">{dateStr}</p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <p className="font-sans text-xs text-[#888880]">{nights} día{nights !== 1 ? 's' : ''}</p>
                {block.notes && <p className="font-sans text-sm text-[#666666]">{block.notes}</p>}
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
