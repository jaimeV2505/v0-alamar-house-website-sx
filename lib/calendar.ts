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
  if (!reason || !(reason in BLOCK_REASONS)) {
    return BLOCK_REASONS[DEFAULT_BLOCK_REASON]
  }
  return BLOCK_REASONS[reason as BlockReason]
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

// Helper to check if a date falls within a block
export function isDateInBlock(dateStr: string, block: CalendarBlock): boolean {
  if (!block.start_date || !block.end_date) return false
  const date = new Date(dateStr)
  const start = new Date(block.start_date)
  const end = new Date(block.end_date)
  return date >= start && date <= end
}

// Helper to get all dates in a range
export function getDatesInRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

// Helper to format date range for display
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  
  if (startDate === endDate) {
    return start.toLocaleDateString('es-CO', { ...options, year: 'numeric' })
  }
  
  const startStr = start.toLocaleDateString('es-CO', options)
  const endStr = end.toLocaleDateString('es-CO', { ...options, year: 'numeric' })
  return `${startStr} - ${endStr}`
}

// Calculate number of nights
export function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}
