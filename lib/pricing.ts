/**
 * Pricing logic for ALAMAR HOUSE reservations.
 * Rates are in Colombian Pesos (COP).
 */

export const RATES = {
  regular: {
    min: 2_000_000,
    max: 3_000_000,
    label: 'Temporada regular',
  },
  high: {
    price: 3_500_000,
    label: 'Temporada alta',
  },
}

/**
 * High season date ranges.
 * Add or adjust as needed for each year.
 */
const HIGH_SEASON_RANGES = [
  // Semana Santa (approximate)
  { start: new Date('2025-04-13'), end: new Date('2025-04-20') },
  { start: new Date('2026-03-29'), end: new Date('2026-04-05') },
  // Mid-year vacations (Colombia)
  { start: new Date('2025-06-20'), end: new Date('2025-07-20') },
  { start: new Date('2026-06-20'), end: new Date('2026-07-20') },
  // Christmas & New Year
  { start: new Date('2025-12-20'), end: new Date('2026-01-05') },
  { start: new Date('2026-12-20'), end: new Date('2027-01-05') },
]

/**
 * Returns true if the given date falls within any high season range.
 */
export function isHighSeason(date: Date): boolean {
  return HIGH_SEASON_RANGES.some(
    (range) => date >= range.start && date <= range.end
  )
}

/**
 * Calculates the number of nights between two dates.
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / msPerDay)
  return Math.max(0, nights)
}

export interface PricingResult {
  nights: number
  pricePerNight: number
  totalEstimated: number
  isHighSeason: boolean
  seasonLabel: string
  breakdown: string
}

/**
 * Calculates pricing for a reservation.
 * Uses the check-in date to determine the season.
 */
export function calculatePrice(checkIn: Date, checkOut: Date): PricingResult {
  const nights = calculateNights(checkIn, checkOut)
  const highSeason = isHighSeason(checkIn)
  const pricePerNight = highSeason ? RATES.high.price : RATES.regular.min
  const totalEstimated = nights * pricePerNight

  return {
    nights,
    pricePerNight,
    totalEstimated,
    isHighSeason: highSeason,
    seasonLabel: highSeason ? RATES.high.label : RATES.regular.label,
    breakdown: `${nights} noche${nights !== 1 ? 's' : ''} × ${formatCOP(pricePerNight)}`,
  }
}

/**
 * Formats a number as Colombian Peso currency string.
 */
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
