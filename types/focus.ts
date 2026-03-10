import { Task } from "./task"
import { TotalCycles } from "./user"

export type TimerState =
  | 'idle'
  | 'focusing'
  | 'on_break'
  | 'on_long_rest'
  | 'cycle_done'

export interface FocusOrigin {
  path: '/home' | '/tasks'
  viewedDate: string | null // ISO date string, only set when coming from /tasks
}

export interface FocusSession {
  activeTask: Task | null
  timerState: TimerState
  currentCycle: number
  totalCycles: TotalCycles
  secondsRemaining: number
  origin: FocusOrigin | null
}