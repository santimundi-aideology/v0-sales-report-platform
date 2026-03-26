export type InsightCategory = 'suggestion' | 'correction' | 'question' | 'praise' | 'bug_report'
export type InsightStatus = 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'dismissed'

export interface UserInsight {
  id: string
  sessionId: string
  pagePath: string
  elementSelector?: string
  elementText?: string
  elementRect?: { x: number; y: number; width: number; height: number }
  category: InsightCategory
  status: InsightStatus
  title: string
  body?: string
  screenshotUrl?: string
  metadata?: Record<string, unknown>
  userName?: string
  userEmail?: string
  createdAt: string
  updatedAt: string
}

export const INSIGHT_CATEGORY_CONFIG: Record<
  InsightCategory,
  { label: string; color: string; emoji: string }
> = {
  suggestion: { label: 'Suggestion', color: 'text-blue-600 bg-blue-50 border-blue-200', emoji: '💡' },
  correction:  { label: 'Correction', color: 'text-amber-600 bg-amber-50 border-amber-200', emoji: '✏️' },
  question:    { label: 'Question', color: 'text-purple-600 bg-purple-50 border-purple-200', emoji: '❓' },
  praise:      { label: 'Praise', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', emoji: '👏' },
  bug_report:  { label: 'Bug Report', color: 'text-rose-600 bg-rose-50 border-rose-200', emoji: '🐛' },
}

export const INSIGHT_STATUS_CONFIG: Record<
  InsightStatus,
  { label: string; color: string }
> = {
  open:         { label: 'Open',         color: 'text-blue-700 bg-blue-100 border-blue-300' },
  acknowledged: { label: 'Acknowledged', color: 'text-gray-700 bg-gray-100 border-gray-300' },
  in_progress:  { label: 'In Progress',  color: 'text-amber-700 bg-amber-100 border-amber-300' },
  resolved:     { label: 'Resolved',     color: 'text-emerald-700 bg-emerald-100 border-emerald-300' },
  dismissed:    { label: 'Dismissed',    color: 'text-rose-700 bg-rose-100 border-rose-300' },
}
