'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, Bell, Check, ChevronLeft, ChevronRight, CircleHelp, CreditCard, House, List, LogOut, Megaphone, MessageCircle, Moon, PieChart, Search, Send, Settings, Sparkles, Sun, UserRound, UsersRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DateRangeDrawer } from './date-range-drawer'
import { TodaySummary } from './today-summary'
import { SourcesChart } from './sources-chart'
import { WidgetDetails, detailRoutes, detailViewFromHash, type DetailData, type DetailView } from './widget-details'
import { presetPeriod } from './reporting-period'
import { WorkspacePages, workspaceRoutes, workspacePageFromHash, type WorkspacePage, type SettingsTab } from './workspace-pages'
import { ProfilePanel, defaultProfile, type DemoProfile } from './profile-tools'
import { OrdersPage } from './orders-page'
import './lillian-dashboard.css'
import './light-surfaces.css'
import './workspace-refinements.css'

const sources = [
  { key: 'gold', label: 'Direct', color: 'var(--chart-1)', points: '0,140 90,107 185,124 280,140 375,117 470,121 565,144 660,175 750,157' },
  { key: 'green', label: 'Direct', color: 'var(--chart-2)', points: '0,90 90,35 185,63 280,90 375,51 470,61 565,98 660,148 750,119' },
  { key: 'blue', label: 'Meta Ads', color: 'var(--chart-3)', points: '0,129 90,61 185,103 280,28 375,140 470,162 565,73 660,19 750,96' },
  { key: 'purple', label: 'Social Media', color: 'var(--chart-4)', points: '0,143 90,167 185,125 280,98 375,89 470,119 565,96 660,151 750,124' },
  { key: 'teal', label: 'SEO', color: 'var(--chart-5)', points: '0,131 90,74 185,110 280,74 375,111 470,81 565,135 660,104 750,149' },
]
const navigation = [ { name: 'Overview', icon: House }, { name: 'Orders', icon: List }, { name: 'Campaigns', icon: Megaphone }, { name: 'Analytics', icon: PieChart }, { name: 'Inbox', icon: MessageCircle }, { name: 'Settings', icon: Settings } ]
const funnelSteps = [
  { label: 'Visitors', users: 1000 },
  { label: 'Engaged', users: 620 },
  { label: 'Sign up', users: 310 },
  { label: 'Checkout', users: 120 },
  { label: 'Subscribed', users: 24 },
]
const conversion = funnelSteps[funnelSteps.length - 1].users / funnelSteps[0].users * 100
const formatPercent = (value: number) => `${Number(value.toFixed(1))}%`
const profileImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#dcead9"/><stop offset="1" stop-color="#b7d0be"/></linearGradient></defs><rect width="80" height="80" fill="url(#bg)"/><path d="M11 80c1-19 12-27 29-27s28 8 29 27" fill="#3d6755"/><path d="M32 49h16v13c-4 5-12 5-16 0" fill="#ca9678"/><ellipse cx="40" cy="34" rx="17" ry="21" fill="#e0b091"/><path d="M23 35c-5-25 10-29 20-27 17 0 20 17 14 28l-3-13c-9 4-19 2-25-3l-6 15" fill="#40382f"/><path d="M32 35h2m13 0h2" stroke="#43382f" stroke-width="2" stroke-linecap="round"/><path d="M36 45q4 3 8 0" fill="none" stroke="#a56e5c" stroke-width="1.5" stroke-linecap="round"/></svg>')}`
type ChatMessage = { role: 'assistant' | 'user'; text: string }

function LilyLogo() {
  const id = useId()
  const gradientId = `${id}-gradient`
  const clipId = `${id}-clip`
  return <svg viewBox="0 0 320 320" fill="none" role="img" aria-label="Lillian logo">
  <g clipPath={`url(#${clipId})`}>
  <path d="M160 0C248.366 0 320 71.6344 320 160C320 248.366 248.366 320 160 320C71.6344 320 0 248.366 0 160C0 71.6344 71.6344 0 160 0ZM160.645 286.866C159.061 294.212 156.637 301.287 153.466 308.001C155.633 308.095 157.811 308.148 160 308.148C163.057 308.148 166.092 308.053 169.103 307.87C165.504 301.233 162.65 294.201 160.645 286.866ZM34.9363 239.444C57.7354 275.26 95.4938 300.622 139.416 306.727C121.729 272.546 82.617 246.802 34.9363 239.444ZM284.968 239.592C237.768 247.129 199.084 272.702 181.481 306.597C224.959 300.282 262.315 275.086 284.968 239.592ZM219.016 171.218C180.622 202.394 162.697 246.522 171.317 285.929C206.706 256.273 223.765 213.413 219.016 171.218ZM101.045 171.215C96.2969 213.41 113.356 256.268 148.744 285.923C157.361 246.518 139.437 202.39 101.045 171.215ZM13.6516 139.511C13.3899 140.434 13.1403 141.361 12.8993 142.292C12.2077 148.098 11.8519 154.007 11.8519 160C11.8519 181.625 16.4895 202.166 24.8177 220.689C54.5386 223.62 83.2931 234.499 106.875 252.891C87.9658 225.941 80.6457 194.782 84.2101 164.705C64.4345 148.481 39.2034 139.9 13.6516 139.511ZM306.348 136.976C280.524 137.271 255 145.939 235.067 162.405C239.293 193.182 232.093 225.239 212.714 252.873C236.412 234.402 265.329 223.506 295.2 220.642C303.515 202.132 308.148 181.608 308.148 160C308.148 152.222 307.547 144.584 306.392 137.13C306.377 137.078 306.363 137.027 306.348 136.976ZM160.162 79.8438C133.645 97.169 113.967 123.047 105.697 153.209C133.543 173.685 153.48 203.098 160.532 236.814C167.532 203.35 187.231 174.124 214.751 153.669C206.556 123.309 186.814 97.2572 160.162 79.8438Z" fillRule="evenodd" clipRule="evenodd" fill={`url(#${gradientId})`}/>
  </g>
  <defs>
  <linearGradient id={gradientId} x1="297.778" y1="-2.00893e-05" x2="-43.1533" y2="144.864" gradientUnits="userSpaceOnUse">
  <stop stopColor="#41DF88"/>
  <stop offset="0.769231" stopColor="#00AE9F"/>
  </linearGradient>
  <clipPath id={clipId}>
  <rect width="320" height="320" fill="white"/>
  </clipPath>
  </defs>
  </svg>
}

export default function LillianDashboard() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return localStorage.getItem('lillian-theme') === 'dark' ? 'dark' : 'light' } catch { return 'light' }
  })
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchTrigger = useRef<HTMLButtonElement>(null)
  const [profile, setProfile] = useState<DemoProfile>(() => { try { const saved = localStorage.getItem('lillian-profile'); return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile } catch { return defaultProfile } })
  const [signedOut, setSignedOut] = useState(false)
  const toolbar = useRef<HTMLElement>(null)
  const profileTrigger = useRef<HTMLButtonElement>(null)
  const notificationsTrigger = useRef<HTMLButtonElement>(null)
  useEffect(() => { try { localStorage.setItem('lillian-profile', JSON.stringify(profile)) } catch { /* Local demo storage is optional. */ } }, [profile])
  useEffect(() => {
    if (!profileOpen && !notificationsOpen) return
    const outside = (event: PointerEvent) => { if (!toolbar.current?.contains(event.target as Node)) { setProfileOpen(false); setNotificationsOpen(false) } }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [profileOpen, notificationsOpen])
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('General')
  const [notificationsRead, setNotificationsRead] = useState(false)
  useEffect(() => { try { localStorage.setItem('lillian-theme', theme) } catch { /* Storage can be unavailable in private embeds. */ } }, [theme])
  const [period, setPeriod] = useState(() => presetPeriod('Today'))
  const range = period.label
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [hidden, setHidden] = useState<string[]>([])
  const [detailView, setDetailView] = useState<DetailView | null>(detailViewFromHash)
  const [workspacePage, setWorkspacePage] = useState<WorkspacePage | null>(workspacePageFromHash)
  const [active, setActive] = useState<string>(() => workspacePageFromHash() ?? detailViewFromHash() ?? 'Overview')
  const searchLabel = active === 'Inbox' ? 'Search chats' : active === 'Overview' ? 'Search orders' : `Search ${active.toLowerCase()}`
  useEffect(() => {
    const syncRoute = () => { const view = detailViewFromHash(); const page = workspacePageFromHash(); setDetailView(view); setWorkspacePage(page); setActive(page ?? view ?? 'Overview'); setPanel('') }
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])
  const navigateDetails = (view: DetailView | null) => {
    setDetailView(view); setWorkspacePage(null); setActive(view ?? 'Overview'); setPanel(''); setProfileOpen(false); setNotificationsOpen(false); setSearchOpen(false); setQuery('')
    window.location.hash = view ? detailRoutes[view] : '#/'
  }
  const navigateWorkspace = (page: WorkspacePage, initialTab: SettingsTab = 'General') => {
    setWorkspacePage(page); setDetailView(null); setActive(page); setPanel(''); setSettingsTab(initialTab); setProfileOpen(false); setNotificationsOpen(false); setSearchOpen(false); setQuery('')
    window.location.hash = workspaceRoutes[page]
  }
  const [panel, setPanel] = useState('')
  const [message, setMessage] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: 'Hi, I’m Lily. Explore your funnel, revenue, or traffic sources with me. What would you like to know?' }])
  const chatEnd = useRef<HTMLDivElement>(null)
  const chatTrigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (chatOpen) chatEnd.current?.scrollIntoView({ block: 'nearest' })
  }, [chatMessages, chatOpen])
  useEffect(() => {
    if (!chatOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setChatOpen(false); chatTrigger.current?.focus() }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [chatOpen])
  const orders = Array.from({ length: 24 }, (_, i) => ({ id: 345 - i, plan: 'Annual', time: '2h ago', amount: '+23.00' }))
  const filtered = orders.filter(order => `Order #${order.id} ${order.plan} ${order.time} ${order.amount}`.toLowerCase().includes(query.toLowerCase()))
  const latestPageCount = Math.max(1, Math.ceil(filtered.length / 5))
  const latestPage = Math.min(page, latestPageCount - 1)
  const latestOrders = filtered.slice(latestPage * 5, latestPage * 5 + 5)
  const amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(340 * period.days)

  const detailData: Record<DetailView, DetailData> = {
    Orders: { value: '$340.00', description: '24 new orders today · +3% growth. Recent transactions are shown below.', columns: ['Order', 'Plan', 'Received', 'Amount'], rows: orders.map(order => [`Order #${order.id}`, order.plan, order.time, order.amount]) },
    Visits: { value: '1,000', description: 'Unique visitors today · +12% growth.', columns: ['Device', 'Visitors', 'Share'], rows: [['Desktop', '640', '64%'], ['Mobile', '310', '31%'], ['Tablet', '50', '5%']] },
    'Sign-ins': { value: '310', description: 'Users signed in today · +8% growth.', columns: ['Method', 'Users', 'Share'], rows: [['Email', '240', '77.4%'], ['Google', '55', '17.7%'], ['Apple', '15', '4.8%']] },
    'My Funnel': { value: formatPercent(conversion), description: 'Visitor-to-subscriber conversion. Retention compares each step with the previous one.', columns: ['Step', 'Users', 'Of visitors', 'Retention'], rows: funnelSteps.map((step, index) => [step.label, step.users.toLocaleString('en-US'), formatPercent(step.users / funnelSteps[0].users * 100), index ? formatPercent(step.users / funnelSteps[index - 1].users * 100) : 'Starting point']) },
    'Top sources': { value: '5 sources', description: 'Acquisition series shown in the dashboard.', columns: ['Source', 'Series', 'Displayed value'], rows: sources.map((source, index) => [source.label, `Series ${index + 1}`, '24%']), note: 'Illustrative values are not an exclusive traffic breakdown.' },
  }

  const sendMessage = (prompt = message) => {
    if (!prompt.trim()) return
    const question = prompt.toLowerCase()
    const answer = /funnel|convert|conversion|drop|step|improve/.test(question)
      ? `Your funnel converts ${formatPercent(conversion)} of visitors: 24 subscribers from 1,000 visitors. Step retention is 62% → 50% → 38.7% → 20%. The biggest relative drop is checkout → subscribed: 96 of 120 users leave (80%). Review payment friction and unexpected costs first. These are sample funnel figures.`
      : /revenue|order|subscription|money/.test(question)
        ? `For ${range.toLowerCase()}, the dashboard shows ${amount} in revenue. Today’s sample activity includes 24 new subscriptions and +3% growth. Use the date selector to compare the demo periods.`
        : /source|traffic|channel|ads/.test(question)
          ? 'The source chart is illustrative. Each legend currently displays 24%, so these values total 120% and cannot represent an exclusive traffic breakdown. Connect measured acquisition data before comparing channel performance. Click a source chip to isolate series.'
          : 'I can explain the sample funnel, summarize revenue for your selected period, or review the source chart. Try “Where do users drop off?” This demo uses local dashboard insights; live AI is not connected.'
    setChatMessages(current => [...current, { role: 'user', text: prompt.trim() }, { role: 'assistant', text: answer }])
    setMessage('')
  }

  if (signedOut) return <div className="lillian-dashboard" data-theme={theme}><Card className="glass demo-signed-out"><div className="lily-logo"><LilyLogo /></div><h1>Demo session ended</h1><p>Your local workspace data is saved.</p><Button onClick={() => { setSignedOut(false); navigateDetails(null) }}>Return to demo</Button></Card></div>

  return (
    <div className="lillian-dashboard" data-theme={theme}>
      <header ref={toolbar} className={`glass top-toolbar ${profileOpen ? 'profile-open' : ''} ${notificationsOpen ? 'notifications-open' : ''} ${searchOpen ? 'search-open' : ''}`} onKeyDown={event => { if (event.key === 'Escape' && (profileOpen || notificationsOpen)) { event.stopPropagation(); if (profileOpen) profileTrigger.current?.focus(); else notificationsTrigger.current?.focus(); setProfileOpen(false); setNotificationsOpen(false) } }}>
        <div className="toolbar-main-row" inert={searchOpen} aria-hidden={searchOpen}>
        <div className="nav-brand"><div className="lily-logo"><LilyLogo /></div><span className="nav-page-name">{active}</span></div>
        <Button ref={searchTrigger} variant="ghost" className="search-launch" aria-label={`Open ${searchLabel.toLowerCase()}`} aria-expanded={searchOpen} aria-controls="navbar-search" onClick={() => { setSearchOpen(true); setProfileOpen(false); setNotificationsOpen(false) }}><Search /><span>{searchLabel}…</span></Button>
        <div className="toolbar-actions"><div className="toolbar-tools">
          <Button ref={notificationsTrigger} variant="ghost" size="icon" className="notification-trigger" aria-label={notificationsRead ? 'Notifications' : 'Notifications, 3 unread'} aria-expanded={notificationsOpen} aria-controls="navbar-activity" onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false) }}><Bell />{!notificationsRead && <span className="unread-dot" />}</Button>
          <span className="toolbar-divider" />
          <Button variant="ghost" size="icon" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} aria-pressed={theme === 'dark'} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon /> : <Sun />}</Button>
        </div>
        <Button ref={profileTrigger} variant="ghost" className="profile-trigger" aria-label="Open profile actions" aria-expanded={profileOpen} aria-controls="profile-actions-grid" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false) }}><img src={profileImage} alt={profile.name} width="48" height="48" /></Button>
        </div>
        </div>
        {searchOpen && <form id="navbar-search" className="navbar-search-mode" role="search" onSubmit={event => event.preventDefault()} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setSearchOpen(false); setQuery(''); window.requestAnimationFrame(() => searchTrigger.current?.focus()) } }}>
          <Search aria-hidden="true" /><Input autoFocus aria-label={searchLabel} placeholder={`${searchLabel}…`} value={query} onChange={event => setQuery(event.target.value)} /><Button variant="ghost" type="button" size="icon" aria-label="Close search" onClick={() => { setSearchOpen(false); setQuery(''); window.requestAnimationFrame(() => searchTrigger.current?.focus()) }}><X /></Button>
        </form>}
        <div className="notification-nav-expansion" inert={!notificationsOpen} aria-hidden={!notificationsOpen}><section className="notification-nav-inner" id="navbar-activity" aria-label="Activity and notifications">
          <div className="navbar-activity-content"><div className="navbar-activity-heading"><h2>Activity</h2>{!notificationsRead && <Button variant="ghost" onClick={() => setNotificationsRead(true)}><Check />Mark all as read</Button>}</div>
            <div className={`navbar-activity-list ${notificationsRead ? 'activity-read' : ''}`}>
              <Button variant="ghost" onClick={() => { navigateDetails('Orders'); setNotificationsRead(true) }}><span className="activity-item-icon"><List /></span><span><strong>New subscriptions</strong><small>24 users subscribed today.</small></span><time>2h ago</time><ArrowUpRight /></Button>
              <Button variant="ghost" onClick={() => { navigateDetails('My Funnel'); setNotificationsRead(true) }}><span className="activity-item-icon"><PieChart /></span><span><strong>Your funnel update</strong><small>Overall conversion is 2.4%.</small></span><time>2h ago</time><ArrowUpRight /></Button>
              <Button variant="ghost" onClick={() => { navigateDetails('Visits'); setNotificationsRead(true) }}><span className="activity-item-icon"><UsersRound /></span><span><strong>Traffic today</strong><small>1,000 visitors explored your site.</small></span><time>3h ago</time><ArrowUpRight /></Button>
            </div>
          </div>
        </section></div>
        <div className="profile-nav-expansion" inert={!profileOpen} aria-hidden={!profileOpen}><div className="profile-nav-expansion-inner"><nav className="profile-actions-grid" id="profile-actions-grid" aria-label="Profile actions">
          <Button variant="ghost" onClick={() => { setProfileOpen(false); setPanel('Edit profile') }}><UserRound /><span>Edit profile</span></Button>
          <Button variant="ghost" onClick={() => navigateWorkspace('Settings', 'Billing')}><CreditCard /><span>Subscription</span></Button>
          <Button variant="ghost" onClick={() => { setProfileOpen(false); setPanel(''); setChatOpen(true) }}><CircleHelp /><span>Help</span></Button>
          <Button variant="ghost" onClick={() => { setProfileOpen(false); setPanel('Switch account') }}><UsersRound /><span>Switch account</span></Button>
          <Button variant="ghost" onClick={() => { setProfileOpen(false); setChatOpen(false); setPanel(''); setQuery(''); setSignedOut(true) }}><LogOut /><span>Logout</span></Button>
        </nav></div></div>
      </header>

      <DateRangeDrawer value={period} onChange={setPeriod} theme={theme} />

      <aside className="glass side-rail"><nav aria-label="Main navigation">
        {navigation.map(({ name, icon: Icon }) => {
          const selected = active === name || (name === 'Analytics' && detailView !== null && detailView !== 'Orders')
          return <Button variant="ghost" className={`rail-button ${selected ? 'is-active' : ''}`} key={name} aria-label={name} title={name} aria-current={selected ? 'page' : undefined} onClick={() => { if (name === 'Overview') navigateDetails(null); else if (name === 'Orders') navigateDetails('Orders'); else navigateWorkspace(name as WorkspacePage) }}><Icon /></Button>
        })}
      </nav></aside>

      <main className="dashboard-columns" hidden={detailView !== null || workspacePage !== null}>
        <div className="dashboard-column left-column">
          <TodaySummary />
          <Card className="glass funnel-card"><div className="card-heading"><div className="funnel-title"><h2>My Funnel</h2><span className="conversion-badge">{formatPercent(conversion)} conversion</span></div><Button className="round-button widget-details-button" aria-label="View funnel details" onClick={() => navigateDetails('My Funnel')}><ArrowUpRight /></Button></div>
            <div className="funnel-chart minimal-funnel" aria-label="User conversion funnel">
              <div className="funnel-process">{funnelSteps.map((step, index) => {
                const percent = step.users / funnelSteps[0].users * 100
                const retention = index === 0 ? null : step.users / funnelSteps[index - 1].users * 100
                return <div className="funnel-step" key={step.label} aria-label={`${step.label}: ${step.users} users, ${formatPercent(percent)} of visitors${retention === null ? '' : `, ${formatPercent(retention)} retained from the previous step`}`}>
                  <div className="step-track" style={{ gridColumn: index + 1 }}><span style={{ height: `${percent}%` }} /></div>
                  <div className="step-summary" style={{ gridColumn: index + 1 }}><strong>{formatPercent(percent)}</strong><span>{step.label}</span><small>{step.users.toLocaleString('en-US')} users</small></div>
                </div>
              })}</div>
            </div>
          </Card>
        </div>
        <div className="dashboard-column right-column">
          <Card className="glass latest-orders"><div className="card-heading"><h2>Latest orders</h2><div className="pagination" role="group" aria-label="Latest orders pages"><Button className="round-button" aria-label="Previous orders" disabled={latestPage === 0} onClick={() => setPage(latestPage - 1)}><ChevronLeft /></Button><Button className="round-button" aria-label="Next orders" disabled={latestPage >= latestPageCount - 1} onClick={() => setPage(latestPage + 1)}><ChevronRight /></Button></div></div>
            <div className="order-table inset-surface" role="table" aria-label="Latest orders"><div role="rowgroup">{latestOrders.map((order, index) => <div className="order-row" role="row" key={index}><span role="cell">Order #{order.id}</span><span role="cell">{order.plan}</span><span role="cell">{order.time}</span><strong role="cell">{order.amount}</strong></div>)}{filtered.length === 0 && <p className="no-orders">No orders match “{query}”.</p>}</div></div>
          </Card>
          <Card className="glass sources-card"><div className="card-heading"><h2>Top sources</h2><Button className="round-button widget-details-button" aria-label="View source details" onClick={() => navigateDetails('Top sources')}><ArrowUpRight /></Button></div>
            <SourcesChart sources={sources} hidden={hidden} onToggle={key => setHidden(current => current.includes(key) ? current.filter(source => source !== key) : [...current, key])} />
          </Card>
        </div>
      </main>
      {workspacePage && <WorkspacePages key={`${workspacePage}-${settingsTab}`} page={workspacePage} query={query} onQueryChange={setQuery} data={detailData} onDetails={navigateDetails} initialSettingsTab={settingsTab} />}
      {detailView === 'Orders' && <OrdersPage query={query} />}
      {detailView && detailView !== 'Orders' && <WidgetDetails view={detailView} data={detailData[detailView]} query={query} onBack={() => navigateDetails(null)} />}
      <Button ref={chatTrigger} className="support-tab" aria-label="Open Lily AI chat" aria-expanded={chatOpen} aria-controls="lily-chat" onClick={() => { setChatOpen(!chatOpen); setPanel('') }}>{chatOpen ? <X /> : <MessageCircle />}</Button>
      {chatOpen && <section id="lily-chat" className="ai-chat-panel glass" role="dialog" aria-label="Lily AI chat">
        <div className="ai-chat-header"><div className="chat-lily"><LilyLogo /></div><div><h2>Lily AI</h2><span>Demo · local insights</span></div><Button variant="ghost" size="icon" aria-label="Close AI chat" onClick={() => { setChatOpen(false); chatTrigger.current?.focus() }}><X /></Button></div>
        <div className="chat-messages" role="log" aria-label="Conversation" aria-live="polite">{chatMessages.map((item, index) => <div key={index} className={`chat-bubble chat-${item.role}`}><span className="chat-author">{item.role === 'assistant' ? 'Lily' : 'You'}</span><p>{item.text}</p></div>)}<div ref={chatEnd} /></div>
        {chatMessages.length === 1 && <div className="chat-suggestions">{['Where do users drop off?', 'Summarize revenue', 'Review traffic sources'].map(prompt => <Button variant="ghost" key={prompt} onClick={() => sendMessage(prompt)}><Sparkles />{prompt}</Button>)}</div>}
        <form className="chat-composer" onSubmit={event => { event.preventDefault(); sendMessage() }}><Input autoFocus aria-label="Message Lily AI" placeholder="Ask about your dashboard…" value={message} onChange={event => setMessage(event.target.value)} maxLength={2000} /><Button type="submit" size="icon" aria-label="Send message" disabled={!message.trim()}><Send /></Button></form>
        <p className="chat-disclaimer">Sample insights. Live AI is not connected.</p>
      </section>}
      {(panel === 'Edit profile' || panel === 'Switch account') && <ProfilePanel key={panel} mode={panel} profile={profile} onSave={setProfile} onClose={() => setPanel('')} />}
      {panel && panel !== 'Edit profile' && panel !== 'Switch account' && <section className="detail-panel glass" aria-label={panel}><div className="panel-heading"><h2>{panel}</h2><Button variant="ghost" size="icon" aria-label="Close panel" onClick={() => setPanel('')}><X /></Button></div>
        <p>{panel === 'Orders' ? '24 new subscriptions · +3% growth' : panel === 'My Funnel' ? `1,000 visitors → 620 engaged → 310 signups → 120 checkouts → 24 subscribers. Overall conversion: ${formatPercent(conversion)}. Checkout retains 20% of users, the largest relative drop in the funnel.` : panel === 'Profile' ? 'Lillian Studio · Demo workspace' : panel === 'Settings' ? 'Dashboard preferences' : `Your ${panel.toLowerCase()} workspace is up to date.`}</p>{panel === 'Settings' && <Button onClick={() => { setPeriod(presetPeriod('Today')); setHidden([]); setQuery(''); setPage(0); setPanel('') }}>Reset dashboard</Button>}
      </section>}
    </div>
  )
}
