import { z } from 'zod'

// Block reason types with consistent colors across admin and public
export const BLOCK_REASONS = {
  confirmed: {
    label: 'Reserva confirmada',
    color: '#6B9C85',
    bgClass: 'bg-[#6B9C85]',
    textClass: 'text-[#6B9C85]',
    bgLightClass: 'bg-[#6B9C85]/10',
  },
  maintenance: {
    label: 'Mantenimiento',
    color: '#F39C12',
    bgClass: 'bg-[#F39C12]',
    textClass: 'text-[#F39C12]',
    bgLightClass: 'bg-[#F39C12]/10',
  },
  cleaning: {
    label: 'Limpieza',
    color: '#3498DB',
    bgClass: 'bg-[#3498DB]',
    textClass: 'text-[#3498DB]',
    bgLightClass: 'bg-[#3498DB]/10',
  },
  private: {
    label: 'Uso privado',
    color: '#D97373',
    bgClass: 'bg-[#D97373]',
    textClass: 'text-[#D97373]',
    bgLightClass: 'bg-[#D97373]/10',
  },
  unavailable: {
    label: 'No disponible',
    color: '#888880',
    bgClass: 'bg-[#888880]',
    textClass: 'text-[#888880]',
    bgLightClass: 'bg-[#888880]/10',
  },
} as const

export type BlockReason = keyof typeof BLOCK_REASONS

export const DEFAULT_BLOCK_REASON: BlockReason = 'unavailable'

// Get reason info with fallback
export function getBlockReasonInfo(reason: string | null | undefined) {
  if (!reason) {
    return BLOCK_REASONS[DEFAULT_BLOCK_REASON]
  }
  // Force lowercase to handle case mismatches
  const normalizedReason = String(reason).toLowerCase().trim()
  if (normalizedReason in BLOCK_REASONS) {
    return BLOCK_REASONS[normalizedReason as BlockReason]
  }
  return BLOCK_REASONS[DEFAULT_BLOCK_REASON]
}

// Zod schema for creating a calendar block
export const createBlockSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  block_type: z.enum(['confirmed', 'maintenance', 'cleaning', 'private', 'unavailable']).default('unavailable'),
  notes: z.string().max(500).optional().nullable(),
  booking_request_id: z.string().uuid().optional().nullable(),
}).refine(
  (data) => new Date(data.end_date) >= new Date(data.start_date),
  { message: 'La fecha de fin debe ser igual o posterior a la fecha de inicio', path: ['end_date'] }
)

export type CreateBlockInput = z.infer<typeof createBlockSchema>

// Calendar block from database
export interface CalendarBlock {
  id: string
  start_date: string
  end_date: string
  block_type: BlockReason
  notes: string | null
  reason: string | null
  booking_request_id: string | null
  created_at: string
}

// Parse YYYY-MM-DD string to Date without timezone issues
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day) // month is 0-indexed
}

// Format Date to YYYY-MM-DD without timezone issues
function formatLocalDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Helper to check if a date falls within a block
export function isDateInBlock(dateStr: string, block: CalendarBlock): boolean {
  if (!block.start_date || !block.end_date) return false
  // Compare strings directly - YYYY-MM-DD format is lexicographically sortable
  return dateStr >= block.start_date && dateStr <= block.end_date
}

// Helper to get all dates in a range
export function getDatesInRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const current = parseLocalDate(startDate)
  const end = parseLocalDate(endDate)
  
  while (current <= end) {
    dates.push(formatLocalDate(current))
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

// Helper to format date range for display
export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseLocalDate(startDate)
  const end = parseLocalDate(endDate)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  
  if (startDate === endDate) {
    return start.toLocaleDateString('es-CO', { ...options, year: 'numeric' })
  }
  
  const startStr = start.toLocaleDateString('es-CO', options)
  const endStr = end.toLocaleDateString('es-CO', { ...options, year: 'numeric' })
  return `${startStr} - ${endStr}`
}

// Calculate number of nights (days in the block)
export function calculateNights(startDate: string, endDate: string): number {
  const start = parseLocalDate(startDate)
  const end = parseLocalDate(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}
