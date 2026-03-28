'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

interface DateRangeCalendarProps {
  checkIn: string
  checkOut: string
  onCheckInChange: (date: string) => void
  onCheckOutChange: (date: string) => void
  unavailableDates: Set<string>
  isLoading?: boolean
}

export function DateRangeCalendar({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  unavailableDates,
  isLoading = false,
}: DateRangeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [todayStr, setTodayStr] = useState<string>('')

  // Set today's date only on client to avoid hydration mismatch
  useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0])
  }, [])

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
    if (!todayStr) return false // Not yet mounted
    return dateStr < todayStr
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
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-[#1B4D5C]" />
        <h4 className="font-sans font-semibold text-[#2C2C2C]">Calendario de disponibilidad</h4>
        {isLoading && (
          <span className="ml-auto font-sans text-xs text-[#888880] animate-pulse">Cargando...</span>
        )}
      </div>

      {/* Calendar Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs bg-[#F5F0E8] rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white border border-[#E8E3D8]" />
          <span className="text-[#666666]">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1B4D5C]" />
          <span className="text-[#666666]">Tu seleccion</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#D97373]" />
          <span className="text-[#666666]">No disponible</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-[#E8E3D8] rounded-lg p-5 shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 bg-[#F5F0E8] hover:bg-[#E8E3D8] rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-[#1B4D5C]" />
          </button>
          <h3 className="font-serif text-lg font-bold text-[#2C2C2C] text-center flex-1 capitalize">{monthName}</h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 bg-[#F5F0E8] hover:bg-[#E8E3D8] rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-[#1B4D5C]" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center font-sans text-xs font-bold text-[#1B4D5C] uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-11" />
            }

            const dateStr = formatDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
            const isBlocked = isDateBlocked(dateStr)
            const isDisabled = isDateDisabled(dateStr)
            const isSelected = isDateInRange(dateStr)
            const isCheckIn = checkIn === dateStr
            const isCheckOut = checkOut === dateStr

            let bgColor = 'bg-white hover:bg-[#F5F0E8]'
            let textColor = 'text-[#2C2C2C]'
            let cursor = 'cursor-pointer'
            let borderColor = 'border-[#E8E3D8]'
            let extraStyles = ''

            if (isBlocked || isDisabled) {
              bgColor = 'bg-[#D97373]/10'
              textColor = 'text-[#D97373] line-through'
              cursor = 'cursor-not-allowed'
              borderColor = 'border-[#D97373]/30'
            } else if (isCheckIn || isCheckOut) {
              bgColor = 'bg-[#1B4D5C]'
              textColor = 'text-white'
              extraStyles = 'ring-2 ring-[#1B4D5C]/30 ring-offset-1'
            } else if (isSelected) {
              bgColor = 'bg-[#1B4D5C]/10'
              borderColor = 'border-[#1B4D5C]'
              textColor = 'text-[#1B4D5C] font-semibold'
            }

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleDateClick(day)}
                disabled={isBlocked || isDisabled}
                className={`h-11 rounded-lg border font-sans text-sm font-medium transition-all duration-200 ${bgColor} ${textColor} ${cursor} ${borderColor} ${extraStyles}`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Range Summary */}
      {(checkIn || checkOut) && (
        <div className="mt-4 bg-[#1B4D5C]/5 border border-[#1B4D5C]/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-sans text-xs text-[#888880] uppercase tracking-wide">Llegada</span>
              <span className="font-sans font-semibold text-[#1B4D5C]">
                {checkIn ? new Date(checkIn).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) : '---'}
              </span>
            </div>
            <div className="text-[#D4A574] font-bold text-lg">→</div>
            <div className="flex flex-col text-right">
              <span className="font-sans text-xs text-[#888880] uppercase tracking-wide">Salida</span>
              <span className="font-sans font-semibold text-[#1B4D5C]">
                {checkOut ? new Date(checkOut).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) : '---'}
              </span>
            </div>
          </div>
          {checkIn && checkOut && (
            <p className="mt-2 text-center font-sans text-sm text-[#6B9C85] font-medium">
              {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} noches
            </p>
          )}
        </div>
      )}

      {!checkIn && !checkOut && (
        <p className="mt-4 font-sans text-sm text-[#888880] text-center">
          Haz clic en una fecha para seleccionar tu llegada
        </p>
      )}
    </div>
  )
}
