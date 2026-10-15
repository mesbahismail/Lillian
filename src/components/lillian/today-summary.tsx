'use client'

import { useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChartGrid } from './chart-grid'
import { chartCounts, chartTimes, parseChartPoints } from './chart-data'

const slides = [
  { label: 'Orders', value: '$340.00', detail: '24 new orders', growth: '+3%', points: '0,70 50,64 100,69 150,47 200,53 250,35 300,42 350,19 400,27' },
  { label: 'Visits', value: '1,000', detail: 'Unique visitors today', growth: '+12%', points: '0,72 50,58 100,64 150,39 200,47 250,22 300,30 350,10 400,18' },
  { label: 'Sign-ins', value: '310', detail: 'Users signed in today', growth: '+8%', points: '0,74 50,68 100,57 150,63 200,45 250,49 300,30 350,35 400,15' },
] as const

export function TodaySummary() {
  const [current, setCurrent] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const move = (direction: number) => { setHoverIndex(null); setCurrent(value => (value + direction + slides.length) % slides.length) }
  const hoverPoint = hoverIndex === null ? null : parseChartPoints(slides[current].points)[hoverIndex]
  const hoverValue = hoverIndex === null ? 0 : chartCounts(slides[current].points, 100, current === 0 ? 34000 : current === 1 ? 1000 : 310)[hoverIndex]

  return <Card className="glass orders-today today-summary">
    <div className="card-heading summary-heading"><h1>Today’s summary</h1></div>
    <section className="summary-carousel" aria-label="Today’s business summary" aria-roledescription="carousel" tabIndex={0} onKeyDown={event => {
      if (event.target !== event.currentTarget) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1) }
    }} onTouchStart={event => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }} onTouchEnd={event => {
      if (!touchStart.current) return
      const dx = event.changedTouches[0].clientX - touchStart.current.x
      const dy = event.changedTouches[0].clientY - touchStart.current.y
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1)
      touchStart.current = null
    }}>
      <div className="summary-slide-window">
        {slides.map((slide, index) => {
          const offset = (index - current + slides.length + 1) % slides.length - 1
          return <div className={`summary-slide ${index === current ? 'summary-slide-active' : ''}`} key={slide.label} style={{ transform: `translateX(${offset * 60}%) scale(${offset === 0 ? 1 : 0.78})` }} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${slide.label}`} aria-hidden={index !== current}>
            <span className="summary-metric-label">{slide.label}</span>
            <p className="revenue-number">{slide.value}</p>
            <p className="summary-description">{slide.detail}<span><ArrowUpRight />{slide.growth}</span></p>
          </div>
        })}
      </div>
      <span className="summary-edge summary-edge-left" aria-hidden="true" /><span className="summary-edge summary-edge-right" aria-hidden="true" />
      <Button variant="ghost" className="summary-arrow summary-arrow-left" aria-label={`Previous summary: ${slides[(current + 2) % slides.length].label}`} onClick={() => move(-1)}><ChevronLeft /></Button>
      <Button variant="ghost" className="summary-arrow summary-arrow-right" aria-label={`Next summary: ${slides[(current + 1) % slides.length].label}`} onClick={() => move(1)}><ChevronRight /></Button>
    </section>
    <div className="summary-dots" role="group" aria-label="Select summary metric">{slides.map((slide, index) => <Button variant="ghost" key={slide.label} className="summary-dot-button" aria-label={`Show ${slide.label}`} aria-pressed={current === index} onClick={() => { setCurrent(index); setHoverIndex(null) }}><span /></Button>)}</div>
    <div className="summary-sparkline interactive-chart">
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" role="img" tabIndex={0} aria-label={`${slides[current].label} trend for today. Hover or use left and right arrow keys for details.`} onPointerMove={event => {
        const bounds = event.currentTarget.getBoundingClientRect()
        setHoverIndex(Math.min(8, Math.max(0, Math.round((event.clientX - bounds.left) / bounds.width * 8))))
      }} onPointerLeave={() => setHoverIndex(null)} onFocus={() => setHoverIndex(4)} onBlur={() => setHoverIndex(null)} onKeyDown={event => {
        if (event.key === 'Escape') setHoverIndex(null)
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setHoverIndex(index => Math.min(8, Math.max(0, (index ?? 4) + (event.key === 'ArrowLeft' ? -1 : 1)))) }
      }}><defs><linearGradient id="summary-trend-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4eb43c" stopOpacity="1" /><stop offset="100%" stopColor="#4eb43c" stopOpacity="0" /></linearGradient></defs><ChartGrid /><path d={`M${slides[current].points.replace(/ /g, ' L')} L400,100 L0,100 Z`} fill="url(#summary-trend-fill)" />{hoverPoint && <><line className="chart-hover-guide" x1={hoverPoint.x} x2={hoverPoint.x} y1="0" y2="100" vectorEffect="non-scaling-stroke" /><circle cx={hoverPoint.x} cy={hoverPoint.y} r="2" fill="#629d56" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" /></>}</svg>
      {hoverPoint && hoverIndex !== null && <div className="chart-hover-tooltip" role="status" style={{ left: `${Math.min(78, Math.max(22, hoverPoint.x / 400 * 100))}%` }}><span>{slides[current].label} · {chartTimes[hoverIndex]}</span><strong>{current === 0 ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(hoverValue / 100) : `${hoverValue} ${current === 1 ? 'visits' : 'sign-ins'}`}</strong></div>}
    </div>
    <p className="summary-live-status" role="status" aria-live="polite">{slides[current].label}: {slides[current].value}. {slides[current].detail}.</p>
  </Card>
}
