import type { User } from './user'
// import type { DailyEnergy } from './energy'
import type { Task } from './task'

// mirrors the shape of the .json file exactly
export interface Database {
  users: User[]
//   dailyEnergy: DailyEnergy[]
  tasks: Task[]
}