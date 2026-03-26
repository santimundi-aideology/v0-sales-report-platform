import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import type { InsightCategory, InsightStatus } from '@/lib/types'

function toClient(row: Record<string, unknown>) {
  return {
    id:              row.id,
    sessionId:       row.session_id,
    pagePath:        row.page_path,
    elementSelector: row.element_selector,
    elementText:     row.element_text,
    elementRect:     row.element_rect,
    category:        row.category,
    status:          row.status,
    title:           row.title,
    body:            row.body,
    screenshotUrl:   row.screenshot_url,
    metadata:        row.metadata,
    userName:        row.user_name,
    userEmail:       row.user_email,
    createdAt:       row.created_at,
    updatedAt:       row.updated_at,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pagePath = searchParams.get('pagePath')

  const db = createServerSupabase()
  let query = db.from('user_insights').select('*').order('created_at', { ascending: false })

  if (pagePath) {
    query = query.eq('page_path', pagePath)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json((data ?? []).map(toClient))
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const {
    sessionId,
    pagePath,
    elementSelector,
    elementText,
    elementRect,
    category = 'suggestion' as InsightCategory,
    title,
    note: body_text,
    metadata,
    userName,
    userEmail,
  } = body

  if (!sessionId || !pagePath || !title) {
    return NextResponse.json({ error: 'sessionId, pagePath, and title are required' }, { status: 400 })
  }

  const db = createServerSupabase()
  const { data, error } = await db
    .from('user_insights')
    .insert({
      session_id:       sessionId,
      page_path:        pagePath,
      element_selector: elementSelector ?? null,
      element_text:     elementText ?? null,
      element_rect:     elementRect ?? null,
      category,
      status:           'open' as InsightStatus,
      title,
      body:             body_text ?? null,
      metadata:         metadata ?? {},
      user_name:        userName ?? null,
      user_email:       userEmail ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(toClient(data as Record<string, unknown>), { status: 201 })
}
