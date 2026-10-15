'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { CalendarCheck, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { customPeriod, formatPeriod, periodPresets, presetPeriod, reportingToday, type ReportingPeriod } from './reporting-period'
import './date-range-drawer.css'

type Props = { value: ReportingPeriod; onChange: (value: ReportingPeriod) => void; theme: 'light' | 'dark' }

export function DateRangeDrawer({ value, onChange, theme }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>({ from: value.from, to: value.to })
  const [draftLabel, setDraftLabel] = useState(value.label)
  const [month, setMonth] = useState(() => new Date(value.from.getFullYear(), value.from.getMonth() - 1, 1))
  const bookmark = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [geometry, setGeometry] = useState({ width: 0, height: 0, tabWidth: 0, neck: 0 })
  const expansion = useRef<HTMLDivElement>(null)
  const regionId = useId()
  useEffect(() => {
    const element = bookmark.current
    if (!element) return
    const measure = () => {
      const width = element.offsetWidth
      const height = element.offsetHeight
      const tabWidth = trigger.current?.offsetWidth ?? width
      const neck = expansion.current?.offsetTop ?? 0
      setGeometry(previous => previous.width === width && previous.height === height && previous.tabWidth === tabWidth && previous.neck === neck ? previous : { width, height, tabWidth, neck })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    if (trigger.current) observer.observe(trigger.current)
    return () => observer.disconnect()
  }, [])
  const showMonth = (date: Date) => setMonth(new Date(date.getFullYear(), date.getMonth() - 1, 1))
  const { width: w, height: h, tabWidth, neck } = geometry
  const headerHeight = trigger.current?.offsetHeight ?? 0
  const shoulder = Math.max(1, w - tabWidth)
  const left = open ? 1 : shoulder
  const bottom = open ? h : headerHeight
  const join = open ? neck : 1
  const radius = open ? Math.max(0, Math.min(24, Math.max(0, neck - headerHeight), (h - neck) / 2, shoulder / 2)) : 0
  const bottomRadius = Math.max(0, Math.min(24, open ? (h - neck) / 2 : headerHeight / 2))
  // Identical path commands let the browser interpolate the surface without layout work.
  const outline = `M ${shoulder} 1 H ${w - 1} V ${bottom - bottomRadius} Q ${w - 1} ${bottom - 1} ${w - bottomRadius} ${bottom - 1} H ${left + bottomRadius} Q ${left} ${bottom - 1} ${left} ${bottom - bottomRadius} V ${join + radius} Q ${left} ${join} ${left + radius} ${join} H ${shoulder - radius} Q ${shoulder} ${join} ${shoulder} ${join - radius} Z`
  const today = reportingToday()
  const complete = !!draft?.from && !!draft.to
  const close = () => { setOpen(false); trigger.current?.focus() }
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!bookmark.current?.contains(event.target as Node)) setOpen(false) }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current?.focus() }
    }
    document.addEventListener('pointerdown', outside)
    bookmark.current?.addEventListener('keydown', escape)
    const element = bookmark.current
    return () => { document.removeEventListener('pointerdown', outside); element?.removeEventListener('keydown', escape) }
  }, [open])
  const apply = () => {
    if (!draft?.from || !draft.to) return
    const selected = periodPresets.find(preset => preset === draftLabel)
    onChange(selected ? presetPeriod(selected) : customPeriod(draft.from, draft.to))
    close()
  }

  return <div ref={bookmark} className={`calendar-bookmark calendar-bookmark-layout ${open ? 'calendar-bookmark-open' : ''}`} data-theme={theme}>
    {w > 0 && h > 0 && <><div className="calendar-connected-surface" style={{ clipPath: `path('${outline}')` }} aria-hidden="true" />
    <svg className="calendar-connected-outline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true"><path d={outline} style={{ d: `path("${outline}")` }} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg></>}
    <Button ref={trigger} variant="ghost" className="date-selector" aria-expanded={open} aria-controls={regionId} aria-label={`Reporting period: ${value.label}, ${formatPeriod(value, true)}`} onClick={() => {
      if (!open) { setDraft({ from: value.from, to: value.to }); setDraftLabel(value.label); setMonth(new Date(value.from.getFullYear(), value.from.getMonth() - 1, 1)) }
      setOpen(!open)
    }}><CalendarCheck /><span className="date-trigger-copy"><strong>{value.label}</strong><span>{formatPeriod(value)}</span></span><ChevronDown className="calendar-bookmark-chevron" /></Button>
    <div ref={expansion} className="calendar-expansion" inert={!open} aria-hidden={!open}>
      <section id={regionId} className="calendar-expansion-inner" aria-label="Select reporting period">
        <div className="calendar-bookmark-scroll">
          <div className="date-presets" role="group" aria-label="Preset periods">{periodPresets.map(preset => <Button variant="ghost" className="date-preset" key={preset} aria-pressed={draftLabel === preset} onClick={() => {
            const next = presetPeriod(preset)
            setDraftLabel(preset); setDraft({ from: next.from, to: next.to }); showMonth(next.from)
          }}><span>{preset}</span>{draftLabel === preset && <Check />}</Button>)}</div>
          <div className="custom-calendar"><div className="calendar-section-heading"><h3>Custom period</h3><Button variant="ghost" onClick={() => { setDraft(undefined); setDraftLabel('Custom range') }}>Clear</Button></div>
            <DayPicker mode="range" selected={draft} onSelect={next => { setDraft(next); setDraftLabel('Custom range') }} month={month} onMonthChange={setMonth} numberOfMonths={2} weekStartsOn={1} showOutsideDays fixedWeeks today={today} disabled={{ after: today }} endMonth={today} captionLayout="dropdown" startMonth={new Date(2000, 0, 1)} navLayout="around" />
            <p className="date-selection-hint" aria-live="polite">{draft?.from ? draft.to ? formatPeriod({ label: draftLabel, from: draft.from, to: draft.to }, true) : `${formatPeriod({ label: draftLabel, from: draft.from, to: draft.from }, true)} — Select an end date` : 'Select a start date, then an end date.'}</p>
          </div>
        </div>
        <div className="calendar-bookmark-footer"><Button variant="ghost" onClick={close}>Cancel</Button><Button className="apply-period" disabled={!complete} onClick={apply}>Apply period</Button></div>
      </section>
    </div>
  </div>
}
