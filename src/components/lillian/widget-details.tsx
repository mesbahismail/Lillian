'use client'

import { useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const detailRoutes = { Orders: '#/orders', Visits: '#/visits', 'Sign-ins': '#/sign-ins', 'My Funnel': '#/funnel', 'Top sources': '#/sources' } as const
export type DetailView = keyof typeof detailRoutes
export function detailViewFromHash(): DetailView | null {
  if (typeof window === 'undefined') return null
  return (Object.keys(detailRoutes) as DetailView[]).find(view => detailRoutes[view] === window.location.hash) ?? null
}
export type DetailData = { value: string; description: string; columns: string[]; rows: string[][]; note?: string }

export function WidgetDetails({ view, data, query, onBack }: { view: DetailView; data: DetailData; query: string; onBack: () => void }) {
  const main = useRef<HTMLElement>(null)
  useEffect(() => { main.current?.focus() }, [view])
  const rows = data.rows.filter(row => row.join(' ').toLowerCase().includes(query.trim().toLowerCase()))
  return <main ref={main} className="widget-details-page" aria-label={view} tabIndex={-1}>
    <Button className="back-to-overview" variant="ghost" onClick={onBack}><ArrowLeft />Back to overview</Button>
    <Card className="glass widget-details-card">
      <div className="widget-details-heading"><strong>{data.value}</strong></div>
      <p className="widget-details-description">{data.description}</p>
      <div className="widget-details-table-wrap"><table className="widget-details-table"><thead><tr>{data.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>{!rows.length && <p className="details-empty">No results match your search.</p>}</div>
      {data.note && <p className="widget-details-note">{data.note}</p>}
    </Card>
  </main>
}
