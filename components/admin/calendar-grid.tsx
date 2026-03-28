'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react'
import { CalendarBlock, BLOCK_REASONS, getBlockReasonInfo, BlockReason, calculateNights, formatDateRange } from '@/lib/calendar'

interface CalendarGridProps {
  blocks: CalendarBlock[]
  onAddBlock: (startDate: string, endDate: string, blockType: string, notes: string) => void
  onDeleteBlock: (id: string) => void
  isLoading?: boolean
}

export function CalendarGrid({ blocks, onAddBlock, onDeleteBlock, isLoading }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null)
  const [showBlockForm, setShowBlockForm] = useState(false)
  const [blockType, setBlockType] = useState<BlockReason>('private')
  const [notes, setNotes] = useState('')

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // Format date to YYYY-MM-DD without timezone conversion
  const formatDateString = (year: number, month: number, day: number): string => {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  // Parse YYYY-MM-DD for display without timezone issues
  const parseLocalDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const isDateBlocked = (dateStr: string): CalendarBlock | null => {
    if (!blocks || !Array.isArray(blocks)) return null
    
    // Compare strings directly - YYYY-MM-DD is lexicographically sortable
    return blocks.find((b) => {
      if (!b || !b.start_date || !b.end_date) return false
      return dateStr >= b.start_date && dateStr <= b.end_date
    }) || null
  }

  const handleDateClick = (day: number) => {
    const dateStr = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    
    if (!selectedRange) {
      setSelectedRange({ start: dateStr, end: dateStr })
    } else {
      // Compare strings directly - YYYY-MM-DD is sortable
      if (dateStr < selectedRange.start) {
        setSelectedRange({ start: dateStr, end: selectedRange.end })
      } else if (dateStr > selectedRange.end) {
        setSelectedRange({ start: selectedRange.start, end: dateStr })
      } else {
        setSelectedRange(null)
      }
    }
  }

  const handleConfirmBlock = () => {
    if (selectedRange) {
      onAddBlock(selectedRange.start, selectedRange.end, blockType, notes)
      setSelectedRange(null)
      setShowBlockForm(false)
      setBlockType('private')
      setNotes('')
    }
  }

  const monthName = currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div className="w-full space-y-6">
      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(BLOCK_REASONS).map(([key, info]) => (
          <div key={key} className="flex items-center gap-2 p-2 bg-[#F5F0E8] rounded-md">
            <div className={`w-3 h-3 rounded-full ${info.bgClass}`} />
            <span className="font-sans text-xs text-[#666666]">{info.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white border border-[#E8E3D8] rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-[#F5F0E8] rounded-md transition-colors"
          >
            <ChevronLeft size={18} className="text-[#1B4D5C]" />
          </button>
          <h3 className="font-sans font-semibold text-[#2C2C2C] text-center flex-1 capitalize">{monthName}</h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-[#F5F0E8] rounded-md transition-colors"
          >
            <ChevronRight size={18} className="text-[#1B4D5C]" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center font-sans text-xs font-semibold text-[#888880]">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-12" />
            }

            const dateStr = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const blockedInfo = isDateBlocked(dateStr)
            const isSelected = selectedRange && dateStr >= selectedRange.start && dateStr <= selectedRange.end
            const reasonInfo = blockedInfo ? getBlockReasonInfo(blockedInfo.block_type) : null

            return (
              <div key={`day-${day}`} className="relative h-12">
                <button
                  onClick={() => handleDateClick(day)}
                  className={`w-full h-full rounded-md border font-sans text-xs font-medium transition-colors ${
                    blockedInfo
                      ? `${reasonInfo?.bgClass} text-white border-transparent cursor-not-allowed`
                      : isSelected
                        ? 'bg-[#D4A574]/20 border-[#D4A574]'
                        : 'bg-white border-[#E8E3D8] hover:border-[#D4A574]'
                  }`}
                  disabled={isLoading}
                >
                  {day}
                </button>
                {blockedInfo && (
                  <button
                    onClick={() => onDeleteBlock(blockedInfo.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Eliminar bloqueo"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Block Form */}
      {selectedRange && (
        <div className="bg-[#F5F0E8] border border-[#E8E3D8] rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-sans text-sm font-semibold text-[#2C2C2C]">
                {parseLocalDate(selectedRange.start).toLocaleDateString('es-CO')} →{' '}
                {parseLocalDate(selectedRange.end).toLocaleDateString('es-CO')}
              </p>
              <p className="font-sans text-xs text-[#888880] mt-1">
                {Math.ceil((parseLocalDate(selectedRange.end).getTime() - parseLocalDate(selectedRange.start).getTime()) / (1000 * 60 * 60 * 24)) + 1} día(s)
              </p>
            </div>
            <button
              onClick={() => setSelectedRange(null)}
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <X size={18} className="text-[#888880]" />
            </button>
          </div>

          {!showBlockForm ? (
            <button
              onClick={() => setShowBlockForm(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#1B4D5C] text-white font-sans text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#2A6B7E] transition-colors"
            >
              <Plus size={16} />
              Crear bloqueo
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide block mb-2">
                  Tipo de bloqueo
                </label>
                <select
                  value={blockType}
                  onChange={(e) => setBlockType(e.target.value as any)}
                  className="w-full font-sans text-sm px-3 py-2 border border-[#E8E3D8] rounded-md focus:border-[#1B4D5C] outline-none"
                >
                  <option value="private">Privado</option>
                  <option value="confirmed">Reserva confirmada</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="cleaning">Limpieza</option>
                </select>
              </div>

              <div>
                <label className="font-sans text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide block mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Reserva de familia García..."
                  rows={2}
                  className="w-full font-sans text-sm px-3 py-2 border border-[#E8E3D8] rounded-md focus:border-[#1B4D5C] outline-none resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleConfirmBlock}
                  disabled={isLoading}
                  className="flex-1 bg-[#1B4D5C] text-white font-sans text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#2A6B7E] transition-colors disabled:opacity-60"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => {
                    setShowBlockForm(false)
                    setNotes('')
                    setBlockType('private')
                  }}
                  className="flex-1 bg-white text-[#2C2C2C] font-sans text-sm font-semibold px-4 py-2 rounded-md border border-[#E8E3D8] hover:bg-[#F5F0E8] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
