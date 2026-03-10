import type { Task, NewTask } from '@/types'

// -- Get --

export async function getTasks(userId: string): Promise<Task[]> {
  const res = await fetch(`/api/tasks?userId=${userId}`)

  if (!res.ok) throw new Error('Failed to fetch tasks')

  return res.json()
}

// -- Create --

export async function createTask(userId: string, task: NewTask): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, userId }),
  })

  if (!res.ok) throw new Error('Failed to create task')

  return res.json()
}

// -- Edit --

export async function updateTask(id: string, changes: Partial<Task>): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  })

  if (!res.ok) throw new Error(`Failed to update task ${id}`)

  return res.json()
}

// -- Delete --

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) throw new Error(`Failed to delete task ${id}`)
}