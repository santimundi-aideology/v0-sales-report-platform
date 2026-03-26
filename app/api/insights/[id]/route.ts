import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import type { InsightStatus } from '@/lib/types'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const updates: Record<string, unknown> = {}
  if (body.status !== undefined)   updates.status = body.status as InsightStatus
  if (body.title !== undefined)    updates.title  = body.title
  if (body.body !== undefined)     updates.body   = body.body
  if (body.category !== undefined) updates.category = body.category

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const db = createServerSupabase()
  const { data, error } = await db
    .from('user_insights')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Insight not found' }, { status: 404 })
  }

  const row = data as Record<string, unknown>
  return NextResponse.json({
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
  })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const db = createServerSupabase()
  const { error } = await db
    .from('user_insights')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
