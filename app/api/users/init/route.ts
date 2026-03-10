import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/utils/users'
import { getOrCreateUser } from '@/utils/db'

export async function POST() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await getOrCreateUser(userId)
  return NextResponse.json(user)
}