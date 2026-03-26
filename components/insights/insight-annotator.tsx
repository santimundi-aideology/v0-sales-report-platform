'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useInsights } from './insight-provider'
import { INSIGHT_CATEGORY_CONFIG } from '@/lib/types'
import type { InsightCategory } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── CSS path builder ─────────────────────────────────────────────────────────
function getCssPath(el: Element): string {
  const parts: string[] = []
  let node: Element | null = el
  while (node && node !== document.body) {
    let selector = node.tagName.toLowerCase()
    if (node.id) {
      selector += `#${node.id}`
      parts.unshift(selector)
      break
    }
    const siblings = Array.from(node.parentElement?.children ?? []).filter(
      c => c.tagName === node!.tagName
    )
    if (siblings.length > 1) {
      const idx = siblings.indexOf(node) + 1
      selector += `:nth-of-type(${idx})`
    }
    parts.unshift(selector)
    node = node.parentElement
  }
  return parts.join(' > ')
}

// ─── Highlight box ────────────────────────────────────────────────────────────
interface HighlightBoxProps {
  rect: DOMRect
  onClick: () => void
}

function HighlightBox({ rect, onClick }: HighlightBoxProps) {
  const scrollX = window.scrollX
  const scrollY = window.scrollY
  return (
    <div
      data-insight-overlay
      style={{
        position: 'fixed',
        left:     rect.left - 2,
        top:      rect.top  - 2,
        width:    rect.width  + 4,
        height:   rect.height + 4,
        zIndex:   99998,
        pointerEvents: 'none',
        borderRadius: 4,
        border:   '2px solid #2A7DE1',
        background: 'rgba(42, 125, 225, 0.08)',
        boxShadow: '0 0 0 4000px rgba(0,0,0,0.12)',
        transition: 'all 0.1s ease',
      }}
      onClick={onClick}
    />
  )
}

// ─── Category selector chips ──────────────────────────────────────────────────
function CategoryChip({
  cat,
  selected,
  onSelect,
}: {
  cat: InsightCategory
  selected: boolean
  onSelect: () => void
}) {
  const cfg = INSIGHT_CATEGORY_CONFIG[cat]
  return (
    <button
      data-insight-overlay
      onClick={onSelect}
      className={cn(
        'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
        selected ? cfg.color : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
      )}
    >
      {cfg.emoji} {cfg.label}
    </button>
  )
}

// ─── Annotation popover ───────────────────────────────────────────────────────
function AnnotationPopover({
  rect,
  onSubmit,
  onCancel,
}: {
  rect: DOMRect
  onSubmit: (data: { title: string; note?: string; category: InsightCategory }) => Promise<void>
  onCancel: () => void
}) {
  const [title, setTitle]       = useState('')
  const [note, setNote]         = useState('')
  const [category, setCategory] = useState<InsightCategory>('suggestion')
  const [saving, setSaving]     = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => { titleRef.current?.focus() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      await onSubmit({ title: title.trim(), note: note.trim() || undefined, category })
    } finally {
      setSaving(false)
    }
  }

  // Position: prefer below, fall back to above
  const vp = { w: window.innerWidth, h: window.innerHeight }
  const popW = 340
  const popH = 280
  let left = Math.max(8, Math.min(rect.left, vp.w - popW - 8))
  let top  = rect.bottom + 10
  if (top + popH > vp.h - 8) top = rect.top - popH - 10

  return (
    <div
      data-insight-overlay
      style={{
        position: 'fixed',
        left, top,
        width:   popW,
        zIndex:  99999,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 8px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)',
        padding: 16,
        fontFamily: 'var(--font-sans, sans-serif)',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Add annotation</span>
        <button
          data-insight-overlay
          onClick={onCancel}
          style={{ fontSize: 18, lineHeight: 1, color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ×
        </button>
      </div>

      {/* Category */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {(Object.keys(INSIGHT_CATEGORY_CONFIG) as InsightCategory[]).map(cat => (
          <CategoryChip
            key={cat}
            cat={cat}
            selected={category === cat}
            onSelect={() => setCategory(cat)}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          ref={titleRef}
          data-insight-overlay
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Short title (required)"
          required
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '8px 10px',
            border: '1.5px solid #E0E0E0',
            borderRadius: 8,
            fontSize: 13,
            outline: 'none',
            color: '#333',
          }}
          onFocus={e => (e.target.style.borderColor = '#5CB85C')}
          onBlur={e  => (e.target.style.borderColor = '#E0E0E0')}
        />
        <textarea
          data-insight-overlay
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add more detail (optional)…"
          rows={3}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '8px 10px',
            border: '1.5px solid #E0E0E0',
            borderRadius: 8,
            fontSize: 13,
            resize: 'none',
            outline: 'none',
            color: '#333',
          }}
          onFocus={e => (e.target.style.borderColor = '#5CB85C')}
          onBlur={e  => (e.target.style.borderColor = '#E0E0E0')}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            data-insight-overlay
            type="button"
            onClick={onCancel}
            style={{
              padding: '7px 14px',
              border: '1.5px solid #E0E0E0',
              borderRadius: 8,
              background: '#fff',
              fontSize: 13,
              cursor: 'pointer',
              color: '#666',
            }}
          >
            Cancel
          </button>
          <button
            data-insight-overlay
            type="submit"
            disabled={saving || !title.trim()}
            style={{
              padding: '7px 16px',
              border: 'none',
              borderRadius: 8,
              background: saving || !title.trim() ? '#ccc' : '#5CB85C',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: saving || !title.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Main annotator overlay ───────────────────────────────────────────────────
export function InsightAnnotator() {
  const { isAnnotating, selectedElement, setSelectedElement, submitInsight } = useInsights()
  const [hoveredRect, setHoveredRect]  = useState<DOMRect | null>(null)
  const [selectedRect, setSelectedRect] = useState<DOMRect | null>(null)

  const isOverlay = useCallback((el: Element | null): boolean => {
    if (!el) return false
    if (el.hasAttribute('data-insight-overlay')) return true
    return isOverlay(el.parentElement)
  }, [])

  // Hover detection
  useEffect(() => {
    if (!isAnnotating) {
      setHoveredRect(null)
      return
    }

    const onMove = (e: MouseEvent) => {
      const target = e.target as Element
      if (isOverlay(target)) { setHoveredRect(null); return }
      if (selectedElement) return
      const rect = target.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) setHoveredRect(rect)
    }

    const onLeave = () => { if (!selectedElement) setHoveredRect(null) }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [isAnnotating, selectedElement, isOverlay])

  // Click to select
  useEffect(() => {
    if (!isAnnotating) return

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element
      if (isOverlay(target)) return

      e.preventDefault()
      e.stopPropagation()

      const rect = target.getBoundingClientRect()
      setSelectedRect(rect)
      setSelectedElement({
        selector: getCssPath(target),
        text:     (target.textContent ?? '').trim().slice(0, 200),
        rect:     { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      })
      setHoveredRect(null)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [isAnnotating, isOverlay, setSelectedElement])

  // Crosshair cursor
  useEffect(() => {
    if (!isAnnotating) {
      document.body.style.cursor = ''
      return
    }
    document.body.style.cursor = 'crosshair'
    return () => { document.body.style.cursor = '' }
  }, [isAnnotating])

  if (!isAnnotating) return null

  return (
    <>
      {/* Hover highlight */}
      {hoveredRect && !selectedElement && (
        <div
          data-insight-overlay
          style={{
            position: 'fixed',
            left:   hoveredRect.left - 2,
            top:    hoveredRect.top  - 2,
            width:  hoveredRect.width  + 4,
            height: hoveredRect.height + 4,
            zIndex: 99997,
            pointerEvents: 'none',
            borderRadius: 4,
            border:   '2px solid #2A7DE1',
            background: 'rgba(42, 125, 225, 0.06)',
            transition: 'all 0.08s ease',
          }}
        />
      )}

      {/* Selection highlight */}
      {selectedElement && selectedRect && (
        <div
          data-insight-overlay
          style={{
            position: 'fixed',
            left:   selectedRect.left - 2,
            top:    selectedRect.top  - 2,
            width:  selectedRect.width  + 4,
            height: selectedRect.height + 4,
            zIndex: 99997,
            pointerEvents: 'none',
            borderRadius: 4,
            border:   '2px solid #5CB85C',
            background: 'rgba(92, 184, 92, 0.08)',
          }}
        />
      )}

      {/* Annotation popover */}
      {selectedElement && selectedRect && (
        <AnnotationPopover
          rect={selectedRect}
          onSubmit={submitInsight}
          onCancel={() => { setSelectedElement(null); setSelectedRect(null) }}
        />
      )}

      {/* Mode hint bar */}
      {!selectedElement && (
        <div
          data-insight-overlay
          style={{
            position: 'fixed',
            bottom: 72,
            left:   '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            background: '#1A1A1A',
            color: '#fff',
            borderRadius: 999,
            padding: '7px 18px',
            fontSize: 12,
            fontWeight: 500,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}
        >
          Click any element to annotate · <kbd style={{ opacity: 0.7 }}>Esc</kbd> to exit
        </div>
      )}
    </>
  )
}
