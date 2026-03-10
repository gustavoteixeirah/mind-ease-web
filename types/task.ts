export type MentalEffort = 'leve' | 'normal' | 'exigente'
export type WhenOption = 'agora' | 'hoje' | 'amanha' | 'qualquer' | 'escolher'
export type Priority = 'baixa' | 'normal' | 'alta'

export interface Subtask {
  id: string
  text: string
  completed: boolean
}

export interface Task {
  id: string
  userId: string
  title: string
  when?: WhenOption
  scheduledDate?: string | null // ISO date string, quando when === 'specific'
  mentalEffort?: MentalEffort
  subtasks?: Subtask[]
  priority?: Priority
  timeEstimate?: string | null  
  description?: string | null
  tags?: string[]
  completed?: boolean
  createdAt: string // ISO datetime string
}

export type NewTask = Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed'> & {
  completed?: boolean
}