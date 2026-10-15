'use client'

import { useState } from 'react'
import { ArrowUpRight, CalendarCheck, Check, ChevronDown, ChevronLeft, ChevronRight, House, Inbox, LayoutGrid, List, ListFilter, Megaphone, MessageCircle, PieChart, Search, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import './lillian-dashboard.css'

const sources = [
  { key: 'gold', label: 'Direct', color: '#aaa021', points: '0,140 90,107 185,124 280,140 375,117 470,121 565,144 660,175 750,157' },
  { key: 'green', label: 'Direct', color: '#4eb442', points: '0,90 90,35 185,63 280,90 375,51 470,61 565,98 660,148 750,119' },
  { key: 'blue', label: 'Meta Ads', color: '#109dca', points: '0,129 90,61 185,103 280,28 375,140 470,162 565,73 660,19 750,96' },
  { key: 'purple', label: 'Social Media', color: '#554ce2', points: '0,143 90,167 185,125 280,98 375,89 470,119 565,96 660,151 750,124' },
  { key: 'teal', label: 'SEO', color: '#15b38b', points: '0,131 90,74 185,110 280,74 375,111 470,81 565,135 660,104 750,149' },
]
const navigation = [ { name: 'Overview', icon: House }, { name: 'Orders', icon: List }, { name: 'Campaigns', icon: Megaphone }, { name: 'Applications', icon: LayoutGrid }, { name: 'Inbox', icon: Inbox }, { name: 'Settings', icon: Settings } ]
const ranges = ['Today', 'Last 7 days', 'Last 30 days']

export default function LillianDashboard() {
  const [range, setRange] = useState('Today')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [hidden, setHidden] = useState<string[]>([])
  const [active, setActive] = useState('Overview')
  const [panel, setPanel] = useState('')
  const [metric, setMetric] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const orders = Array.from({ length: 4 }, (_, i) => ({ id: page === 0 ? 345 : 345 - page * 4 - i, plan: 'Annual', time: '2h ago', amount: '+23.00' }))
  const filtered = orders.filter(order => `Order #${order.id} ${order.plan} ${order.time} ${order.amount}`.toLowerCase().includes(query.toLowerCase()))
  const amount = range === 'Today' ? '$340.00' : range === 'Last 7 days' ? '$2,380.00' : '$10,200.00'

  return (
    <div className="lillian-dashboard">
      <header className="glass top-toolbar">
        <div className="brand-placeholder" aria-label="Lillian"><span /><i /></div>
        <label className="search-field"><Search /><Input aria-label="Search orders" placeholder="Search" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <div className="toolbar-tools">
          <Button variant="ghost" size="icon" aria-label="Show all orders" onClick={() => { setQuery(''); setPage(0); setPanel('Orders') }}><ListFilter /></Button>
          <span className="toolbar-divider" />
          <Button variant="ghost" size="icon" aria-label="Dashboard preferences" onClick={() => setPanel('Settings')}><ListFilter /></Button>
        </div>
        <Button className="profile-placeholder" aria-label="Open profile" onClick={() => setPanel('Profile')} />
      </header>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="glass date-selector" />}>
          <CalendarCheck /><span><strong>{range}</strong> {range === 'Today' ? '24 Oct' : '24 Oct'}</span><ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {ranges.map(value => <DropdownMenuItem key={value} onClick={() => setRange(value)}>{value}{range === value && <Check />}</DropdownMenuItem>)}
        </DropdownMenuContent>
      </DropdownMenu>

      <aside className="glass side-rail"><nav aria-label="Main navigation">
        {navigation.map(({ name, icon: Icon }) => <Button variant="ghost" className={`rail-button ${active === name ? 'is-active' : ''}`} key={name} aria-label={name} aria-current={active === name ? 'page' : undefined} onClick={() => { setActive(name); setPanel(name === 'Overview' ? '' : name) }}><Icon /></Button>)}
      </nav></aside>

      <main className="dashboard-columns">
        <div className="dashboard-column left-column">
          <Card className="glass orders-today">
            <div className="card-heading"><h1>Orders today</h1><Button variant="ghost" size="icon" aria-label="Order details" onClick={() => setPanel('Orders')}><ListFilter /></Button></div>
            <div className="revenue-line"><div><p className="revenue-number">{amount}</p><p className="subscriptions">+24 New subscriptions <span><ArrowUpRight /> +3%</span></p></div>
              <div className="metric-buttons"><Button className="round-button" aria-label="Show revenue breakdown" onClick={() => setMetric(metric === 'revenue' ? '' : 'revenue')}><PieChart /></Button><Button className="round-button" aria-label="Show subscription breakdown" onClick={() => setMetric(metric === 'subscriptions' ? '' : 'subscriptions')}><PieChart /></Button></div>
            </div>
            <div className="empty-chart inset-surface" aria-label="Orders chart placeholder">{metric && <div className="metric-details"><PieChart /><strong>{metric === 'revenue' ? amount : '24 new subscriptions'}</strong><span>{metric === 'revenue' ? 'Revenue for the selected period' : 'Subscriptions increased by 3%'}</span></div>}</div>
          </Card>
          <Card className="glass funnel-card"><div className="card-heading"><h2>My Funnel</h2><Button variant="ghost" size="icon" aria-label="Funnel details" onClick={() => setPanel('My Funnel')}><ListFilter /></Button></div>
            <div className="funnel-chart inset-surface" role="img" aria-label="Seven equal funnel bars, each at 75 percent">{Array.from({ length: 7 }, (_, index) => <div className="funnel-day" key={index}><div className="bar-track"><span /></div><span>MON</span></div>)}</div>
          </Card>
        </div>
        <div className="dashboard-column right-column">
          <Card className="glass latest-orders"><div className="card-heading"><h2>Latest orders</h2><div className="pagination"><Button className="round-button" aria-label="Previous orders" onClick={() => setPage(Math.max(0, page - 1))}><ChevronLeft /></Button><Button className="round-button" aria-label="Next orders" onClick={() => setPage(page + 1)}><ChevronRight /></Button></div></div>
            <div className="order-table inset-surface" role="table" aria-label="Latest orders"><div role="rowgroup">{filtered.map((order, index) => <div className="order-row" role="row" key={index}><span role="cell">Order #{order.id}</span><span role="cell">{order.plan}</span><span role="cell">{order.time}</span><strong role="cell">{order.amount}</strong></div>)}{filtered.length === 0 && <p className="no-orders">No orders match “{query}”.</p>}</div></div>
          </Card>
          <Card className="glass sources-card"><div className="card-heading"><h2>Top sources</h2><Button variant="ghost" size="icon" aria-label="Reset source filters" onClick={() => setHidden([])}><ListFilter /></Button></div>
            <div className="sources-chart"><svg viewBox="0 0 750 210" preserveAspectRatio="none" role="img" aria-label="Acquisition sources area chart"><defs>{sources.map(source => <linearGradient key={source.key} id={`lillian-${source.key}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={source.key === 'purple' ? '#24ac8b' : source.color} stopOpacity="0.55" /><stop offset="78%" stopColor={source.key === 'purple' ? '#24ac8b' : source.color} stopOpacity="0.35" /><stop offset="100%" stopColor={source.color} stopOpacity="0" /></linearGradient>)}</defs><g stroke="#c9cecc" strokeWidth="1">{[0, 88, 184, 280, 376, 472, 568, 664, 749].map(x => <line key={x} x1={x} y1="0" x2={x} y2="210" />)}</g>{[sources[2], sources[1], sources[3], sources[0], sources[4]].filter(source => !hidden.includes(source.key)).map(source => <polygon key={source.key} points={`0,210 ${source.points} 750,210`} fill={`url(#lillian-${source.key})`} />)}</svg></div>
            <div className="source-legend">{sources.map(source => <Button className={`source-chip ${hidden.includes(source.key) ? 'is-muted' : ''}`} key={source.key} aria-pressed={!hidden.includes(source.key)} onClick={() => setHidden(current => current.includes(source.key) ? current.filter(key => key !== source.key) : [...current, source.key])}><i style={{ background: source.color }} /><span>{source.label} <strong style={{ color: source.color }}>24%</strong></span></Button>)}</div>
          </Card>
        </div>
      </main>
      <Button className="support-tab" aria-label="Open support chat" onClick={() => { setPanel(panel === 'Support' ? '' : 'Support'); setSent(false) }}><MessageCircle /></Button>
      {panel && <section className="detail-panel glass" aria-label={panel}><div className="panel-heading"><h2>{panel}</h2><Button variant="ghost" size="icon" aria-label="Close panel" onClick={() => setPanel('')}><X /></Button></div>
        {panel === 'Support' ? <form onSubmit={event => { event.preventDefault(); if (message.trim()) { setSent(true); setMessage('') } }}><p>{sent ? 'Thanks! Your demo message has been received.' : 'How can we help you today?'}</p><Input aria-label="Your message" placeholder="Write a message…" value={message} onChange={event => setMessage(event.target.value)} /><Button type="submit">Send message</Button></form> : <><p>{panel === 'Orders' ? '24 new subscriptions · +3% growth' : panel === 'My Funnel' ? 'Monday conversion: 75% across all seven stages.' : panel === 'Profile' ? 'Lillian Studio · Demo workspace' : panel === 'Settings' ? 'Dashboard preferences' : `Your ${panel.toLowerCase()} workspace is up to date.`}</p>{panel === 'Settings' && <Button onClick={() => { setRange('Today'); setHidden([]); setQuery(''); setPage(0); setMetric(''); setPanel('') }}>Reset dashboard</Button>}</>}
      </section>}
    </div>
  )
}
