export type EnergyLevel = 'calmo' | 'presente' | 'focado'

export interface DailyEnergy {
  userId: string
  date: string // ISO date string, e.g. "2026-02-27"
  level: EnergyLevel
}