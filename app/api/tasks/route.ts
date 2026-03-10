import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb } from '@/utils/db'
import type { Task, NewTask } from '@/types'
import { randomUUID } from 'crypto'

// -- GET /api/tasks?userId=u1 --

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'userId query param is required' },
      { status: 400 }
    )
  }

  try {
    const db = await readDb()
    const tasks = db.tasks.filter((t) => t.userId === userId)
    return NextResponse.json(tasks)
  } catch (err) {
    console.error('[GET /api/tasks]', err)
    return NextResponse.json({ error: 'Failed to read tasks' }, { status: 500 })
  }
}

// -- POST /api/tasks --

export async function POST(req: NextRequest) {
  let body: NewTask & { userId: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.userId || !body.title) {
    return NextResponse.json(
      { error: 'userId and title are required' },
      { status: 400 }
    )
  }

  try {
    const db = await readDb()

    const newTask: Task = {
      id:            randomUUID(),
      userId:        body.userId,
      title:         body.title,
      description:   body.description   ?? null,
      mentalEffort:  body.mentalEffort  ?? undefined,
      when:          body.when          ?? undefined,
      scheduledDate: body.scheduledDate ?? null,
      priority:      body.priority      ?? undefined,
      timeEstimate:  body.timeEstimate  ?? null,
      tags:          body.tags          ?? [],
      subtasks:      body.subtasks      ?? [],
      completed:     false,
      createdAt:     new Date().toISOString(),
    }

    db.tasks.push(newTask)
    await writeDb(db)

    return NextResponse.json(newTask, { status: 201 })
  } catch (err) {
    console.error('[POST /api/tasks]', err)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}