'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChartGrid } from './chart-grid'
import { chartCounts, chartTimes, parseChartPoints } from './chart-data'

type Source = { key: string; label: string; color: string; points: string }
export function SourcesChart({ sources, hidden, onToggle }: { sources: Source[]; hidden: string[]; onToggle: (key: string) => void }) {
  const [hover, setHover] = useState<{ key: string; index: number } | null>(null)
  const [badgeHover, setBadgeHover] = useState<string | null>(null)
  const visible = sources.filter(source => !hidden.includes(source.key))
  const activeKey = hover?.key ?? badgeHover
  const active = sources.find(source => source.key === hover?.key)
  const point = active && hover ? parseChartPoints(active.points)[hover.index] : null
  const ordered = [sources[2], sources[1], sources[3], sources[0], sources[4]].filter(source => !hidden.includes(source.key))

  return <>
    <div className="sources-chart interactive-chart">
      <svg viewBox="0 0 750 210" preserveAspectRatio="none" role="img" aria-label="Acquisition sources. Hover for visits, or use left and right arrows for time and up and down for source." tabIndex={0} onPointerMove={event => {
        if (!visible.length) return
        const bounds = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width * 750
        const y = (event.clientY - bounds.top) / bounds.height * 210
        const index = Math.min(8, Math.max(0, Math.round(x / 750 * 8)))
        const nearest = visible.reduce((best, source) => Math.abs(parseChartPoints(source.points)[index].y - y) < Math.abs(parseChartPoints(best.points)[index].y - y) ? source : best)
        setHover({ key: nearest.key, index }); setBadgeHover(null)
      }} onPointerLeave={() => setHover(null)} onFocus={() => { if (visible[0]) setHover({ key: visible[0].key, index: 4 }) }} onBlur={() => setHover(null)} onKeyDown={event => {
        if (!visible.length || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape'].includes(event.key)) return
        event.preventDefault()
        if (event.key === 'Escape') { setHover(null); return }
        const sourceIndex = Math.max(0, visible.findIndex(source => source.key === hover?.key))
        const nextSource = event.key === 'ArrowUp' ? (sourceIndex + visible.length - 1) % visible.length : event.key === 'ArrowDown' ? (sourceIndex + 1) % visible.length : sourceIndex
        setHover({ key: visible[nextSource].key, index: Math.min(8, Math.max(0, (hover?.index ?? 4) + (event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0))) })
      }}>
        <defs>{sources.map(source => <linearGradient key={source.key} id={`lillian-${source.key}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={source.color} className="source-gradient-stop" stopOpacity={activeKey === source.key ? .6 : .36} /><stop offset="60%" stopColor={source.color} className="source-gradient-stop" stopOpacity={activeKey === source.key ? .25 : .12} /><stop offset="100%" stopColor={source.color} stopOpacity="0" /></linearGradient>)}</defs>
        <ChartGrid />
        {ordered.map(source => <polygon className="source-area" key={source.key} points={`0,210 ${source.points} 750,210`} fill={`url(#lillian-${source.key})`} opacity={activeKey && activeKey !== source.key ? .15 : 1} />)}
        {point && active && <><line className="chart-hover-guide" x1={point.x} x2={point.x} y1="0" y2="210" vectorEffect="non-scaling-stroke" /><ellipse cx={point.x} cy={point.y} rx="4" ry="4" fill={active.color} stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" /></>}
      </svg>
      {point && active && hover && <div className="chart-hover-tooltip" role="status" style={{ left: `${Math.min(78, Math.max(22, point.x / 750 * 100))}%` }}><span><i style={{ background: active.color }} />{active.label} · {chartTimes[hover.index]}</span><strong>{chartCounts(active.points, 210, 240)[hover.index]} visits</strong></div>}
    </div>
    <div className="source-legend">{sources.map(source => <Button className={`source-chip ${hidden.includes(source.key) ? 'is-muted' : ''} ${activeKey && activeKey !== source.key ? 'source-chip-dimmed' : ''}`} key={source.key} aria-pressed={!hidden.includes(source.key)} onPointerEnter={() => { if (!hidden.includes(source.key)) { setBadgeHover(source.key); setHover(null) } }} onPointerLeave={() => setBadgeHover(null)} onFocus={() => { if (!hidden.includes(source.key)) setBadgeHover(source.key) }} onBlur={() => setBadgeHover(null)} onClick={() => { onToggle(source.key); setBadgeHover(null); setHover(null) }}><i style={{ background: source.color }} /><span>{source.label} <strong style={{ color: source.color }}>24%</strong></span></Button>)}</div>
  </>
}
