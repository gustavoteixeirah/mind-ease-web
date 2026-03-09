import type { UserRecord } from './user'
import type { DailyEnergy } from './energy'
import type { Task } from './task'

// mirrors the shape of the .json file exactly
export interface Database {
  users: UserRecord[]
  dailyEnergy: DailyEnergy[]
  tasks: Task[]
}