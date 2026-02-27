export type MentalEffort = 'leve' | 'normal' | 'exigente'
export type WhenOption = 'agora' | 'hoje' | 'amanha' | 'qualquer-dia' | 'especifico'
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
  description: string | null
  mentalEffort: MentalEffort
  when: WhenOption
  scheduledDate: string | null // ISO date string, only set when when === 'specific'
  priority: Priority
  timeEstimate: number | null  // em minutos
  tags: string[]
  subtasks: Subtask[]
  completed: boolean
  createdAt: string // ISO datetime string
}

export type NewTask = Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed'> & {
  completed?: boolean
}