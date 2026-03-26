'use client'

import { useState } from 'react'
import { useInsights } from './insight-provider'
import {
  INSIGHT_CATEGORY_CONFIG,
  INSIGHT_STATUS_CONFIG,
} from '@/lib/types'
import type { UserInsight } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  MessageSquarePlus,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
  RotateCcw,
  X,
  PanelRight,
  Loader2,
  Crosshair,
} from 'lucide-react'

// ─── Scroll to and flash-highlight the annotated element ─────────────────────
async function scrollToAnnotatedElement(selector: string): Promise<boolean> {
  try {
    const el = document.querySelector(selector)
    if (!el) return false

    // Scroll the element into the center of its scroll container
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Wait for the smooth scroll to finish before measuring position
    await new Promise(resolve => setTimeout(resolve, 650))

    // Re-measure after scroll so position: fixed coords are accurate
    const rect = el.getBoundingClientRect()

    const flash = document.createElement('div')
    flash.setAttribute('data-insight-overlay', '')
    Object.assign(flash.style, {
      position:     'fixed',
      left:         `${rect.left - 4}px`,
      top:          `${rect.top  - 4}px`,
      width:        `${rect.width  + 8}px`,
      height:       `${rect.height + 8}px`,
      borderRadius: '6px',
      border:       '2px solid #5CB85C',
      background:   'rgba(92, 184, 92, 0.12)',
      boxShadow:    '0 0 0 4px rgba(92, 184, 92, 0.2)',
      zIndex:       '99996',
      pointerEvents:'none',
      transition:   'opacity 0.4s ease',
    })
    document.body.appendChild(flash)

    // Fade out after 2 s then remove
    setTimeout(() => { flash.style.opacity = '0' }, 1800)
    setTimeout(() => { flash.remove() }, 2300)

    return true
  } catch {
    return false
  }
}

// ─── Individual insight card ──────────────────────────────────────────────────
function InsightCard({ insight }: { insight: UserInsight }) {
  const { updateInsightStatus, deleteInsight } = useInsights()
  const [expanded, setExpanded] = useState(false)
  const [busy, setBusy]         = useState(false)
  const [notFound, setNotFound] = useState(false)

  const catCfg = INSIGHT_CATEGORY_CONFIG[insight.category]
  const stsCfg = INSIGHT_STATUS_CONFIG[insight.status]
  const isOpen = insight.status === 'open' || insight.status === 'in_progress'

  const act = async (fn: () => Promise<void>) => {
    setBusy(true)
    try { await fn() } finally { setBusy(false) }
  }

  const date = new Date(insight.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div
      data-insight-overlay
      className={cn(
        'rounded-lg border bg-white shadow-sm transition-all',
        isOpen ? 'border-l-4 border-l-blue-400' : 'border-l-4 border-l-emerald-400 opacity-75'
      )}
    >
      {/* Header row */}
      <div
        data-insight-overlay
        className="flex items-start gap-2 p-3 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <span className="text-base mt-0.5 select-none">{catCfg.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-tight line-clamp-2">
            {insight.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={cn('text-xs px-1.5 py-0.5 rounded border font-medium', stsCfg.color)}>
              {stsCfg.label}
            </span>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {insight.elementSelector && (
            <button
              data-insight-overlay
              title={notFound ? 'Element not found on page' : 'Jump to annotated element'}
              onClick={e => {
                e.stopPropagation()
                scrollToAnnotatedElement(insight.elementSelector!).then(found => {
                  if (!found) {
                    setNotFound(true)
                    setTimeout(() => setNotFound(false), 2000)
                  }
                })
              }}
              style={{
                background: notFound ? 'rgba(217,83,79,0.1)' : 'rgba(92,184,92,0.1)',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                color: notFound ? '#D9534F' : '#3D8B3D',
                transition: 'all 0.2s ease',
              }}
            >
              <Crosshair size={12} />
            </button>
          )}
          <button
            data-insight-overlay
            className="text-gray-400 hover:text-gray-600"
            onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div data-insight-overlay className="px-3 pb-3 border-t border-gray-100 pt-2 space-y-2">
          {insight.elementText && (
            <p className="text-xs text-gray-500 italic line-clamp-2">
              On: "{insight.elementText}"
            </p>
          )}
          {insight.body && (
            <p className="text-xs text-gray-700 leading-relaxed">{insight.body}</p>
          )}
          {insight.elementSelector && (
            <p className="text-xs font-mono text-gray-400 truncate">{insight.elementSelector}</p>
          )}

          {/* Actions */}
          <div data-insight-overlay className="flex gap-2 pt-1">
            {isOpen ? (
              <button
                data-insight-overlay
                disabled={busy}
                onClick={() => act(() => updateInsightStatus(insight.id, 'resolved'))}
                className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 disabled:opacity-50"
              >
                {busy ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                Resolve
              </button>
            ) : (
              <button
                data-insight-overlay
                disabled={busy}
                onClick={() => act(() => updateInsightStatus(insight.id, 'open'))}
                className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 disabled:opacity-50"
              >
                {busy ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
                Reopen
              </button>
            )}
            <button
              data-insight-overlay
              disabled={busy}
              onClick={() => act(() => deleteInsight(insight.id))}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 disabled:opacity-50 ml-auto"
            >
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Side panel ───────────────────────────────────────────────────────────────
function InsightPanel() {
  const { insights, isLoading, isPanelOpen, closePanel, refreshInsights } = useInsights()
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')

  const filtered = insights.filter(i => {
    if (filter === 'open')     return i.status === 'open' || i.status === 'in_progress'
    if (filter === 'resolved') return i.status === 'resolved'
    return true
  })

  if (!isPanelOpen) return null

  return (
    <div
      data-insight-overlay
      style={{
        position:   'fixed',
        top:         0,
        right:       0,
        bottom:      0,
        width:       360,
        zIndex:      99990,
        display:     'flex',
        flexDirection: 'column',
        background:  '#F8F8F8',
        borderLeft:  '1px solid #E0E0E0',
        boxShadow:  '-8px 0 30px rgba(0,0,0,0.12)',
        fontFamily: 'var(--font-sans, sans-serif)',
      }}
    >
      {/* Panel header */}
      <div
        data-insight-overlay
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid #E0E0E0',
          background: '#fff',
        }}
      >
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
            Page Insights
          </p>
          <p style={{ fontSize: 11, color: '#999', margin: 0 }}>
            {insights.length} annotation{insights.length !== 1 ? 's' : ''} on this page
          </p>
        </div>
        <button
          data-insight-overlay
          onClick={closePanel}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', lineHeight: 1 }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Filter tabs */}
      <div
        data-insight-overlay
        style={{
          display: 'flex',
          gap: 4,
          padding: '10px 16px',
          background: '#fff',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        {(['all', 'open', 'resolved'] as const).map(f => (
          <button
            data-insight-overlay
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '4px 12px',
              borderRadius: 999,
              border: filter === f ? '1.5px solid #5CB85C' : '1.5px solid #E0E0E0',
              background: filter === f ? 'rgba(92,184,92,0.1)' : '#fff',
              color: filter === f ? '#3D8B3D' : '#666',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button
          data-insight-overlay
          onClick={refreshInsights}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
          title="Refresh"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
        </button>
      </div>

      {/* List */}
      <div
        data-insight-overlay
        style={{ flex: 1, overflowY: 'auto', padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {isLoading && filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            <Loader2 size={20} className="animate-spin mx-auto mb-2" />
            <p style={{ fontSize: 13 }}>Loading…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            <MessageSquarePlus size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
            <p style={{ fontSize: 13 }}>No annotations yet</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Click "Annotate" to add one</p>
          </div>
        ) : (
          filtered.map(i => <InsightCard key={i.id} insight={i} />)
        )}
      </div>
    </div>
  )
}

// ─── Floating toggle button ───────────────────────────────────────────────────
export function InsightToggle() {
  const { isAnnotating, isPanelOpen, insights, toggleAnnotating, openPanel, closePanel } = useInsights()
  const openCount = insights.filter(i => i.status === 'open' || i.status === 'in_progress').length

  return (
    <>
      <InsightPanel />

      {/* Floating action buttons */}
      <div
        data-insight-overlay
        style={{
          position:   'fixed',
          bottom:     24,
          right:      isPanelOpen ? 376 : 24,
          zIndex:     99995,
          display:    'flex',
          flexDirection: 'column',
          gap:        8,
          transition: 'right 0.2s ease',
        }}
      >
        {/* View panel button */}
        <button
          data-insight-overlay
          onClick={() => isPanelOpen ? closePanel() : openPanel()}
          title="View annotations"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            border: 'none',
            background: isPanelOpen ? '#E0E0E0' : '#fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <PanelRight size={16} color={isPanelOpen ? '#666' : '#333'} />
          {openCount > 0 && (
            <span
              data-insight-overlay
              style={{
                position: 'absolute',
                top: -4, right: -4,
                background: '#2A7DE1',
                color: '#fff',
                borderRadius: 999,
                fontSize: 9,
                fontWeight: 700,
                minWidth: 16,
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
              }}
            >
              {openCount}
            </span>
          )}
        </button>

        {/* Annotate button */}
        <button
          data-insight-overlay
          onClick={toggleAnnotating}
          title={isAnnotating ? 'Exit annotation mode' : 'Annotate this page'}
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            border: 'none',
            background: isAnnotating ? '#D9534F' : '#5CB85C',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            transform: isAnnotating ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {isAnnotating
            ? <X size={20} color="#fff" />
            : <MessageSquarePlus size={20} color="#fff" />
          }
        </button>
      </div>
    </>
  )
}
