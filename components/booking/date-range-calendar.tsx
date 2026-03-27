'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BLOCK_REASONS } from '@/lib/calendar'

interface DateRangeCalendarProps {
  checkIn: string
  checkOut: string
  onCheckInChange: (date: string) => void
  onCheckOutChange: (date: string) => void
  unavailableDates: Set<string>
  minDate?: string
}

export function DateRangeCalendar({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  unavailableDates,
  minDate = new Date().toISOString().split('T')[0],
}: DateRangeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const today = new Date()
  const minDateObj = new Date(minDate)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateInRange = (dateStr: string): boolean => {
    if (!checkIn || !checkOut) return false
    const date = new Date(dateStr)
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return date >= start && date <= end
  }

  const isDateBlocked = (dateStr: string): boolean => {
    return unavailableDates.has(dateStr)
  }

  const isDateDisabled = (dateStr: string): boolean => {
    const date = new Date(dateStr)
    return date < minDateObj
  }

  const handleDateClick = (day: number) => {
    const dateStr = formatDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))

    if (isDateDisabled(dateStr) || isDateBlocked(dateStr)) return

    if (!checkIn || (checkIn && checkOut)) {
      onCheckInChange(dateStr)
      onCheckOutChange('')
    } else if (checkIn && !checkOut) {
      const checkInDate = new Date(checkIn)
      const selectedDate = new Date(dateStr)

      if (selectedDate < checkInDate) {
        onCheckInChange(dateStr)
      } else {
        onCheckOutChange(dateStr)
      }
    }
  }

  const monthName = currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div className="w-full">
      {/* Calendar Legend */}
      <div className="mb-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${BLOCK_REASONS.confirmed.bgClass}`} />
          <span className="text-[#666666]">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1B4D5C]" />
          <span className="text-[#666666]">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${BLOCK_REASONS.private.bgClass}`} />
          <span className="text-[#666666]">No disponible</span>
        </div>
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
              return <div key={`empty-${idx}`} className="h-10" />
            }

            const dateStr = formatDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
            const isBlocked = isDateBlocked(dateStr)
            const isDisabled = isDateDisabled(dateStr)
            const isSelected = isDateInRange(dateStr)
            const isCheckIn = checkIn === dateStr
            const isCheckOut = checkOut === dateStr

            let bgColor = 'bg-white'
            let textColor = 'text-[#2C2C2C]'
            let cursor = 'cursor-pointer'
            let borderColor = 'border-[#E8E3D8]'

            if (isBlocked || isDisabled) {
              bgColor = 'bg-[#F5F0E8]'
              textColor = 'text-[#D97373]'
              cursor = 'cursor-not-allowed'
            } else if (isCheckIn || isCheckOut) {
              bgColor = 'bg-[#1B4D5C]'
              textColor = 'text-white'
            } else if (isSelected) {
              bgColor = 'bg-[#D4A574]/20'
              borderColor = 'border-[#D4A574]'
            }

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleDateClick(day)}
                disabled={isBlocked || isDisabled}
                className={`h-10 rounded-md border font-sans text-sm font-medium transition-colors ${bgColor} ${textColor} ${cursor} ${borderColor} border hover:opacity-80 disabled:hover:opacity-100`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Info */}
      <p className="mt-4 font-sans text-xs text-[#888880] text-center">
        {checkIn && checkOut
          ? `${new Date(checkIn).toLocaleDateString('es-CO')} → ${new Date(checkOut).toLocaleDateString('es-CO')}`
          : 'Selecciona el rango de fechas'}
      </p>
    </div>
  )
}
