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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    setTodayStr(`${year}-${month}-${day}`)
    setMounted(true)
  }, [])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateString = (year: number, month: number, day: number): string => {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  const formatDisplayDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const calculateNights = (start: string, end: string): number => {
    const [y1, m1, d1] = start.split('-').map(Number)
    const [y2, m2, d2] = end.split('-').map(Number)
    const startDate = new Date(y1, m1 - 1, d1)
    const endDate = new Date(y2, m2 - 1, d2)
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  const isDateInRange = (dateStr: string): boolean => {
    if (!checkIn || !checkOut) return false
    return dateStr >= checkIn && dateStr <= checkOut
  }

  const isDateBlocked = (dateStr: string): boolean => {
    return unavailableDates.has(dateStr)
  }

  const isDateDisabled = (dateStr: string): boolean => {
    if (!todayStr) return false
    return dateStr < todayStr
  }

  const handleDateClick = (day: number) => {
    const clickedDate = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (isDateDisabled(clickedDate) || isDateBlocked(clickedDate)) return

    if (!checkIn || (checkIn && checkOut)) {
      onCheckInChange(clickedDate)
      onCheckOutChange('')
    } else if (checkIn && !checkOut) {
      if (clickedDate < checkIn) {
        onCheckInChange(clickedDate)
      } else {
        onCheckOutChange(clickedDate)
      }
    }
  }

  const monthName = currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-[#1B4D5C]" />
        <h4 className="font-sans font-semibold text-[#2C2C2C]">Calendario de disponibilidad</h4>
        {isLoading && (
          <span className="ml-auto font-sans text-xs text-[#888880] animate-pulse">Cargando...</span>
        )}
      </div>

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

      <div className="bg-white border border-[#E8E3D8] rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 bg-[#F5F0E8] hover:bg-[#E8E3D8] rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-[#1B4D5C]" />
          </button>
          <h3 className="font-serif text-lg font-bold text-[#2C2C2C] text-center flex-1 capitalize">{monthName}</h3>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 bg-[#F5F0E8] hover:bg-[#E8E3D8] rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-[#1B4D5C]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-3">
          {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((dayName) => (
            <div key={dayName} className="h-8 flex items-center justify-center font-sans text-xs font-bold text-[#1B4D5C] uppercase">
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-11" />
            }

            if (!mounted) {
              return (
                <div
                  key={`loading-${day}`}
                  className="h-11 rounded-lg border border-[#E8E3D8] bg-[#F5F0E8] animate-pulse flex items-center justify-center font-sans text-sm text-[#888880]"
                >
                  {day}
                </div>
              )
            }

            const cellDate = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const blocked = isDateBlocked(cellDate)
            const disabled = isDateDisabled(cellDate)
            const selected = isDateInRange(cellDate)
            const isStart = checkIn === cellDate
            const isEnd = checkOut === cellDate
            const unavailable = blocked || disabled

            let bg = 'bg-white hover:bg-[#F5F0E8]'
            let text = 'text-[#2C2C2C]'
            let border = 'border-[#E8E3D8]'
            let extra = ''

            if (unavailable) {
              bg = 'bg-[#D97373]/10'
              text = 'text-[#D97373] line-through'
              border = 'border-[#D97373]/30'
            } else if (isStart || isEnd) {
              bg = 'bg-[#1B4D5C]'
              text = 'text-white'
              extra = 'ring-2 ring-[#1B4D5C]/30 ring-offset-1'
            } else if (selected) {
              bg = 'bg-[#1B4D5C]/10'
              border = 'border-[#1B4D5C]'
              text = 'text-[#1B4D5C] font-semibold'
            }

            return (
              <button
                key={`day-${day}`}
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={unavailable}
                className={`h-11 rounded-lg border font-sans text-sm font-medium transition-all duration-200 ${bg} ${text} ${border} ${extra} ${unavailable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {(checkIn || checkOut) && (
        <div className="mt-4 bg-[#1B4D5C]/5 border border-[#1B4D5C]/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-sans text-xs text-[#888880] uppercase tracking-wide">Llegada</span>
              <span className="font-sans font-semibold text-[#1B4D5C]">
                {checkIn ? formatDisplayDate(checkIn) : '---'}
              </span>
            </div>
            <div className="text-[#D4A574] font-bold text-lg">→</div>
            <div className="flex flex-col text-right">
              <span className="font-sans text-xs text-[#888880] uppercase tracking-wide">Salida</span>
              <span className="font-sans font-semibold text-[#1B4D5C]">
                {checkOut ? formatDisplayDate(checkOut) : '---'}
              </span>
            </div>
          </div>
          {checkIn && checkOut && (
            <p className="mt-2 text-center font-sans text-sm text-[#6B9C85] font-medium">
              {calculateNights(checkIn, checkOut)} noches
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
