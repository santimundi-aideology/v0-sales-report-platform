'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { InsightCategory, UserInsight } from '@/lib/types'

// ─── Anonymous session ID ────────────────────────────────────────────────────
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'ssr'
  const key = 'apcom_insight_session'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

// ─── Context types ────────────────────────────────────────────────────────────
interface SelectedElement {
  selector: string
  text: string
  rect: { x: number; y: number; width: number; height: number }
}

interface InsightContextValue {
  isAnnotating: boolean
  isPanelOpen: boolean
  insights: UserInsight[]
  isLoading: boolean
  selectedElement: SelectedElement | null
  sessionId: string

  toggleAnnotating: () => void
  openPanel: () => void
  closePanel: () => void
  setSelectedElement: (el: SelectedElement | null) => void
  submitInsight: (data: {
    title: string
    note?: string
    category: InsightCategory
  }) => Promise<void>
  updateInsightStatus: (id: string, status: UserInsight['status']) => Promise<void>
  deleteInsight: (id: string) => Promise<void>
  refreshInsights: () => Promise<void>
}

const InsightContext = createContext<InsightContextValue | null>(null)

export function useInsights(): InsightContextValue {
  const ctx = useContext(InsightContext)
  if (!ctx) throw new Error('useInsights must be used inside <InsightProvider>')
  return ctx
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function InsightProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const sessionId = useRef(getOrCreateSessionId()).current

  const [isAnnotating, setIsAnnotating] = useState(false)
  const [isPanelOpen, setIsPanelOpen]   = useState(false)
  const [insights, setInsights]         = useState<UserInsight[]>([])
  const [isLoading, setIsLoading]       = useState(false)
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)

  const fetchInsights = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/insights?pagePath=${encodeURIComponent(pathname)}`)
      if (res.ok) {
        const data = await res.json()
        setInsights(data)
      }
    } finally {
      setIsLoading(false)
    }
  }, [pathname])

  // Reload when page changes or panel opens
  useEffect(() => { fetchInsights() }, [fetchInsights])
  useEffect(() => { if (isPanelOpen) fetchInsights() }, [isPanelOpen, fetchInsights])

  // Escape key exits annotating / clears selection
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedElement) {
          setSelectedElement(null)
        } else if (isAnnotating) {
          setIsAnnotating(false)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isAnnotating, selectedElement])

  const toggleAnnotating = useCallback(() => {
    setIsAnnotating(v => !v)
    setSelectedElement(null)
  }, [])

  const submitInsight = useCallback(async ({
    title,
    note,
    category,
  }: {
    title: string
    note?: string
    category: InsightCategory
  }) => {
    const payload = {
      sessionId,
      pagePath: pathname,
      elementSelector: selectedElement?.selector,
      elementText:     selectedElement?.text,
      elementRect:     selectedElement?.rect,
      category,
      title,
      note,
      metadata: {
        viewportWidth:  window.innerWidth,
        viewportHeight: window.innerHeight,
        userAgent:      navigator.userAgent,
      },
    }

    const res = await fetch('/api/insights', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? 'Failed to save insight')
    }

    const saved: UserInsight = await res.json()
    setInsights(prev => [saved, ...prev])
    setSelectedElement(null)
    setIsAnnotating(false)
  }, [sessionId, pathname, selectedElement])

  const updateInsightStatus = useCallback(async (id: string, status: UserInsight['status']) => {
    const res = await fetch(`/api/insights/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated: UserInsight = await res.json()
      setInsights(prev => prev.map(i => i.id === id ? updated : i))
    }
  }, [])

  const deleteInsight = useCallback(async (id: string) => {
    const res = await fetch(`/api/insights/${id}`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      setInsights(prev => prev.filter(i => i.id !== id))
    }
  }, [])

  return (
    <InsightContext.Provider value={{
      isAnnotating,
      isPanelOpen,
      insights,
      isLoading,
      selectedElement,
      sessionId,
      toggleAnnotating,
      openPanel:          () => setIsPanelOpen(true),
      closePanel:         () => setIsPanelOpen(false),
      setSelectedElement,
      submitInsight,
      updateInsightStatus,
      deleteInsight,
      refreshInsights:    fetchInsights,
    }}>
      {children}
    </InsightContext.Provider>
  )
}
