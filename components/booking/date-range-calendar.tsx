'use client'
// Calendar component for date range selection
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
  const [todayStr, setTodayStr] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    setTodayStr(`${y}-${m}-${d}`)
    setMounted(true)
  }, [])

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const toDateStr = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const displayDate = (str: string): string => {
    const [y, m, d] = str.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const nightsCount = (start: string, end: string): number => {
    const [y1, m1, d1] = start.split('-').map(Number)
    const [y2, m2, d2] = end.split('-').map(Number)
    const s = new Date(y1, m1 - 1, d1)
    const e = new Date(y2, m2 - 1, d2)
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
  }

  const inRange = (str: string) => checkIn && checkOut && str >= checkIn && str <= checkOut
  const isBlocked = (str: string) => unavailableDates.has(str)
  const isPast = (str: string) => todayStr && str < todayStr

  const handleClick = (day: number) => {
    const clicked = toDateStr(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (isPast(clicked) || isBlocked(clicked)) return

    if (!checkIn || (checkIn && checkOut)) {
      onCheckInChange(clicked)
      onCheckOutChange('')
    } else {
      if (clicked < checkIn) {
        onCheckInChange(clicked)
      } else {
        onCheckOutChange(clicked)
      }
    }
  }

  const monthLabel = currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-[#1B4D5C]" />
        <h4 className="font-sans font-semibold text-[#2C2C2C]">Calendario de disponibilidad</h4>
        {isLoading && <span className="ml-auto font-sans text-xs text-[#888880] animate-pulse">Cargando...</span>}
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
          <h3 className="font-serif text-lg font-bold text-[#2C2C2C] text-center flex-1 capitalize">{monthLabel}</h3>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 bg-[#F5F0E8] hover:bg-[#E8E3D8] rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-[#1B4D5C]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-3">
          {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((name) => (
            <div key={name} className="h-8 flex items-center justify-center font-sans text-xs font-bold text-[#1B4D5C] uppercase">
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} className="h-11" />

            if (!mounted) {
              return (
                <div key={`l-${day}`} className="h-11 rounded-lg border border-[#E8E3D8] bg-[#F5F0E8] animate-pulse flex items-center justify-center font-sans text-sm text-[#888880]">
                  {day}
                </div>
              )
            }

            const ds = toDateStr(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const blocked = isBlocked(ds)
            const past = isPast(ds)
            const unavail = blocked || past
            const sel = inRange(ds)
            const start = checkIn === ds
            const end = checkOut === ds

            let bg = 'bg-white hover:bg-[#F5F0E8]'
            let txt = 'text-[#2C2C2C]'
            let bdr = 'border-[#E8E3D8]'
            let ex = ''

            if (unavail) {
              bg = 'bg-[#D97373]/10'
              txt = 'text-[#D97373] line-through'
              bdr = 'border-[#D97373]/30'
            } else if (start || end) {
              bg = 'bg-[#1B4D5C]'
              txt = 'text-white'
              ex = 'ring-2 ring-[#1B4D5C]/30 ring-offset-1'
            } else if (sel) {
              bg = 'bg-[#1B4D5C]/10'
              bdr = 'border-[#1B4D5C]'
              txt = 'text-[#1B4D5C] font-semibold'
            }

            return (
              <button
                key={`d-${day}`}
                type="button"
                onClick={() => handleClick(day)}
                disabled={unavail}
                className={`h-11 rounded-lg border font-sans text-sm font-medium transition-all duration-200 ${bg} ${txt} ${bdr} ${ex} ${unavail ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
              <span className="font-sans font-semibold text-[#1B4D5C]">{checkIn ? displayDate(checkIn) : '---'}</span>
            </div>
            <div className="text-[#D4A574] font-bold text-lg">→</div>
            <div className="flex flex-col text-right">
              <span className="font-sans text-xs text-[#888880] uppercase tracking-wide">Salida</span>
              <span className="font-sans font-semibold text-[#1B4D5C]">{checkOut ? displayDate(checkOut) : '---'}</span>
            </div>
          </div>
          {checkIn && checkOut && (
            <p className="mt-2 text-center font-sans text-sm text-[#6B9C85] font-medium">{nightsCount(checkIn, checkOut)} noches</p>
          )}
        </div>
      )}

      {!checkIn && !checkOut && (
        <p className="mt-4 font-sans text-sm text-[#888880] text-center">Haz clic en una fecha para seleccionar tu llegada</p>
      )}
    </div>
  )
}
