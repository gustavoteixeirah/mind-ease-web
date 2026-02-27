export type TextSize = 'compacto' | 'conforto' | 'acessivel'
export type ColorTheme = 'default' | 'roxo' | 'rosa' | 'amarelo' | 'laranja' | 'verde' | 'cinza'
export type FocusMinutes = 25 | 30 | 35
export type ShortBreakMinutes = 2 | 5 | 10
export type LongBreakMinutes = 15
export type TotalCycles = 4

export interface PomodoroPreferences {
  focusMinutes: FocusMinutes
  shortBreakMinutes: ShortBreakMinutes
  longBreakMinutes: LongBreakMinutes
  totalCycles: TotalCycles
}

export interface UserPreferences {
  textSize: TextSize
  colorTheme: ColorTheme
  pomodoro: PomodoroPreferences
}

export interface User {
  id: string
  name: string
  email: string
  preferences: UserPreferences
}