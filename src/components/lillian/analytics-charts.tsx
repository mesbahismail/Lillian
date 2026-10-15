'use client'

import { useId, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChartGrid } from './chart-grid'
import { chartCounts, chartTimes, parseChartPoints } from './chart-data'
import type { DetailData, DetailView } from './widget-details'
import './analytics-charts.css'

const palette = ['#4eb43c', '#369fb9', '#b8b64b']
const funnelPalette = ['#b8b64b', '#8abb57', '#4eb43c', '#32b691', '#369fb9']
const timePoints = '0,72 50,58 100,64 150,39 200,47 250,22 300,30 350,10 400,18'
const number = (value: string) => Number(value.replace(/[^0-9.]/g, '')) || 0
function arc(start: number, end: number) {
  const point = (angle: number) => ({ x: 100 + 88 * Math.cos(angle), y: 100 + 88 * Math.sin(angle) })
  const a = point(start), b = point(end)
  return `M100,100 L${a.x},${a.y} A88,88 0 ${end - start > Math.PI ? 1 : 0} 1 ${b.x},${b.y} Z`
}
function ChartHeading({ title, target, onDetails }: { title: string; target: DetailView; onDetails: (view: DetailView) => void }) {
  return <div className="card-heading"><h2>{title}</h2><Button className="round-button widget-details-button" aria-label={`View ${title.toLowerCase()} details`} onClick={() => onDetails(target)}><ArrowUpRight /></Button></div>
}
export function AnalyticsCharts({ data, onDetails }: { data: Record<DetailView, DetailData>; onDetails: (view: DetailView) => void }) {
  const [deviceHover, setDeviceHover] = useState<number | null>(null)
  const [timeHover, setTimeHover] = useState<number | null>(null)
  const fillId = useId()
  const devices = data.Visits.rows.map(row => ({ label: row[0], value: number(row[1]) }))
  const total = devices.reduce((sum, device) => sum + device.value, 0)
  const values = chartCounts(timePoints, 100, total)
  const timePoint = timeHover === null ? null : parseChartPoints(timePoints)[timeHover]
  let angle = -Math.PI / 2

  return <div className="analytics-charts-grid">
    <Card className="glass analytics-chart analytics-pie-card"><ChartHeading title="Visits by device" target="Visits" onDetails={onDetails} />
      <div className="analytics-pie-plot"><svg viewBox="0 0 200 200" role="img" aria-label={`Visits by device: ${devices.map(device => `${device.label} ${device.value}`).join(', ')}`}>
        {devices.map((device, index) => {
          const start = angle
          angle += device.value / (total || 1) * Math.PI * 2
          return <path key={device.label} d={arc(start, angle)} fill={palette[index % palette.length]} opacity={deviceHover === null || deviceHover === index ? .85 : .18} tabIndex={0} onPointerEnter={() => setDeviceHover(index)} onPointerLeave={() => setDeviceHover(null)} onFocus={() => setDeviceHover(index)} onBlur={() => setDeviceHover(null)}><title>{`${device.label}: ${device.value} visits (${Math.round(device.value / (total || 1) * 100)}%)`}</title></path>
        })}
      </svg>{deviceHover !== null && devices[deviceHover] && <div className="chart-hover-tooltip analytics-pie-tooltip" role="status"><span>{devices[deviceHover].label}</span><strong>{devices[deviceHover].value} visits · {Math.round(devices[deviceHover].value / (total || 1) * 100)}%</strong></div>}
      </div>
      <div className="analytics-pie-legend">{devices.map((device, index) => <Button variant="ghost" className="white-layer" key={device.label} onPointerEnter={() => setDeviceHover(index)} onPointerLeave={() => setDeviceHover(null)} onFocus={() => setDeviceHover(index)} onBlur={() => setDeviceHover(null)} aria-label={`${device.label}: ${device.value} visits`} style={{ opacity: deviceHover === null || deviceHover === index ? 1 : .3 }}><i style={{ background: palette[index % palette.length] }} /><span>{device.label}</span><strong>{device.value.toLocaleString('en-US')}</strong></Button>)}</div>
    </Card>
    <Card className="glass analytics-chart analytics-time-card"><ChartHeading title="Visits over time" target="Visits" onDetails={onDetails} />
      <div className="analytics-time-body"><div className="analytics-time-plot interactive-chart"><svg viewBox="0 0 400 100" preserveAspectRatio="none" tabIndex={0} role="img" aria-label="Visits throughout the day. Hover or use arrow keys to inspect." onPointerMove={event => { const bounds = event.currentTarget.getBoundingClientRect(); setTimeHover(Math.min(8, Math.max(0, Math.round((event.clientX - bounds.left) / bounds.width * 8)))) }} onPointerLeave={() => setTimeHover(null)} onFocus={() => setTimeHover(4)} onBlur={() => setTimeHover(null)} onKeyDown={event => { if (event.key === 'Escape') setTimeHover(null); if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setTimeHover(index => Math.min(8, Math.max(0, (index ?? 4) + (event.key === 'ArrowLeft' ? -1 : 1)))) } }}>
        <defs><linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#4eb43c" stopOpacity=".65" /><stop offset="100%" stopColor="#4eb43c" stopOpacity="0" /></linearGradient></defs><ChartGrid /><path d={`M${timePoints.replace(/ /g, ' L')} L400,100 L0,100 Z`} fill={`url(#${fillId})`} />{timePoint && <><line className="chart-hover-guide" x1={timePoint.x} x2={timePoint.x} y1="0" y2="100" vectorEffect="non-scaling-stroke" /><circle cx={timePoint.x} cy={timePoint.y} r="2" fill="#4eb43c" /></>}
      </svg>{timePoint && timeHover !== null && <div className="chart-hover-tooltip" role="status" style={{ left: `${Math.min(78, Math.max(22, timePoint.x / 4))}%` }}><span>{chartTimes[timeHover]}</span><strong>{values[timeHover]} visits</strong></div>}</div><div className="analytics-time-labels"><span>00:00</span><span>12:00</span><span>23:59</span></div></div>
    </Card>
    <Card className="glass analytics-chart analytics-bar-card"><ChartHeading title="Funnel retention" target="My Funnel" onDetails={onDetails} />
      <div className="analytics-bars" role="img" aria-label={`Funnel retention: ${data['My Funnel'].rows.map(row => `${row[0]} ${row[1]} users`).join(', ')}`}>{data['My Funnel'].rows.map((row, index) => <div className="analytics-bar-row" key={row[0]} title={`${row[0]}: ${row[1]} users, ${row[2]} of visitors`}><span>{row[0]}</span><div className="analytics-horizontal-track"><span style={{ width: `${Math.min(100, number(row[2]))}%`, background: funnelPalette[index % funnelPalette.length] }} /></div><strong>{row[1]}</strong></div>)}</div>
    </Card>
  </div>
}
