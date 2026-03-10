import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb } from '@/utils/db'
import type { Task } from '@/types'

type RouteParams = { params: Promise<{ id: string }> }

// --- PATCH /api/tasks/[id] ---

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  let changes: Partial<Task>

  try {
    changes = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Prevent overwriting immutable fields via a patch
  const { id: _id, userId: _userId, createdAt: _createdAt, ...safeChanges } = changes as Task

  try {
    const db = await readDb()
    const index = db.tasks.findIndex((t) => t.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const updatedTask: Task = { ...db.tasks[index], ...safeChanges }
    db.tasks[index] = updatedTask

    await writeDb(db)

    return NextResponse.json(updatedTask)
  } catch (err) {
    console.error(`[PATCH /api/tasks/${id}]`, err)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// --- DELETE /api/tasks/[id] ---

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const db = await readDb()
    const index = db.tasks.findIndex((t) => t.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    db.tasks.splice(index, 1)
    await writeDb(db)

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error(`[DELETE /api/tasks/${id}]`, err)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}