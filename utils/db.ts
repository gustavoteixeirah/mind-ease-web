import { Task } from "@/types/task";
import { UserRecord } from "@/types/index"
import { promises as fileSystem } from "fs";

import path from 'path'
const FILE_PATH = path.join(process.cwd(), 'app', 'database', 'db.json')

export type Database = {
  tasks: Task[];
  users: UserRecord[];
};

// Read the JSON file and ensure structure exists
export async function readDb(): Promise<Database> {
  try {
    const file = await fileSystem.readFile(FILE_PATH, "utf-8");
    const parsed = JSON.parse(file);
    return {
      tasks: parsed.tasks ?? [],
      users: parsed.users ?? [],  
    };
  } catch (err) {
    return {
      tasks: [],
      users: [],           
    };
  }
}

export async function getOrCreateUser(userId: string): Promise<UserRecord> {
  const db = await readDb()
  const existing = db.users.find((u) => u.id === userId)
  if (existing) return existing

  const newUser: UserRecord = {
    id: userId,
    preferences: {
      textSize: 'conforto',
      colorTheme: 'default',
      pomodoro: {
        focusMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        totalCycles: 4,
      },
    },
  }

  db.users.push(newUser)
  await writeDb(db)
  return newUser
}

// Write to the file (overwrites the whole db)
export async function writeDb(updatedDb: Database): Promise<void> {
  await fileSystem.writeFile(FILE_PATH, JSON.stringify(updatedDb, null, 2));
}
