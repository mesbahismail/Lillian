'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, Check, Mail, Pause, Play, Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { DetailData, DetailView } from './widget-details'
import { AnalyticsCharts } from './analytics-charts'
import './workspace-pages.css'

export const workspaceRoutes = { Campaigns: '#/campaigns', Analytics: '#/analytics', Inbox: '#/inbox', Settings: '#/settings' } as const
export type WorkspacePage = keyof typeof workspaceRoutes
export function workspacePageFromHash(): WorkspacePage | null {
  if (typeof window === 'undefined') return null
  return (Object.keys(workspaceRoutes) as WorkspacePage[]).find(page => workspaceRoutes[page] === window.location.hash) ?? null
}
function useSaved<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => { try { const saved = localStorage.getItem(key); return saved ? { ...initial, ...JSON.parse(saved) } : initial } catch { return initial } })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* Local persistence is optional. */ } }, [key, value])
  return [value, setValue] as const
}
function PageFrame({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const main = useRef<HTMLElement>(null)
  useEffect(() => { main.current?.focus() }, [title])
  return <main ref={main} className="workspace-page" aria-label={title} tabIndex={-1}>{actions && <div className="workspace-page-actions">{actions}</div>}{children}</main>
}

type Campaign = { id: number; name: string; channel: string; status: 'Active' | 'Paused' | 'Draft'; visits: number; conversions: number }
const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Autumn collection', channel: 'Meta Ads', status: 'Active', visits: 420, conversions: 12 },
  { id: 2, name: 'Welcome to Lillian', channel: 'Email', status: 'Active', visits: 310, conversions: 8 },
  { id: 3, name: 'Back for something new', channel: 'Social', status: 'Paused', visits: 270, conversions: 4 },
  { id: 4, name: 'November launch', channel: 'Email', status: 'Draft', visits: 0, conversions: 0 },
]
function CampaignsPage({ query }: { query: string }) {
  const [saved, setSaved] = useSaved('lillian-campaigns', { campaigns: initialCampaigns })
  const [filter, setFilter] = useState('All')
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [channel, setChannel] = useState('Email')
  const visible = saved.campaigns.filter(item => (filter === 'All' || item.status === filter) && `${item.name} ${item.channel}`.toLowerCase().includes(query.toLowerCase()))
  return <PageFrame title="Campaigns" actions={<Button className="workspace-action" onClick={() => setCreating(!creating)}><Plus />New campaign</Button>}>
    {creating && <form className="glass campaign-create" onSubmit={event => { event.preventDefault(); if (!name.trim()) return; setSaved({ campaigns: [...saved.campaigns, { id: Date.now(), name: name.trim(), channel, status: 'Draft', visits: 0, conversions: 0 }] }); setName(''); setCreating(false); setFilter('All') }}><label>Campaign name<Input autoFocus required value={name} onChange={event => setName(event.target.value)} placeholder="Name your campaign" maxLength={80} /></label><label>Channel<select value={channel} onChange={event => setChannel(event.target.value)}><option>Email</option><option>Meta Ads</option><option>Social</option></select></label><Button className="workspace-action" type="submit">Create draft</Button><Button variant="ghost" type="button" onClick={() => setCreating(false)}>Cancel</Button></form>}
    <Card className="glass workspace-surface"><div className="page-filter-tabs" role="group" aria-label="Campaign status">{['All', 'Active', 'Paused', 'Draft'].map(status => <Button variant="ghost" key={status} aria-pressed={filter === status} onClick={() => setFilter(status)}>{status}</Button>)}</div><div className="page-table-scroll"><table className="page-table"><thead><tr><th>Campaign</th><th>Channel</th><th>Status</th><th>Visits</th><th>Conversions</th><th><span className="visually-hidden">Actions</span></th></tr></thead><tbody>{visible.map(item => <tr key={item.id}><td>{item.name}</td><td>{item.channel}</td><td><span className="page-status">{item.status}</span></td><td>{item.visits}</td><td>{item.conversions}</td><td><Button variant="ghost" size="icon" aria-label={`${item.status === 'Active' ? 'Pause' : 'Start'} ${item.name}`} onClick={() => setSaved({ campaigns: saved.campaigns.map(campaign => campaign.id === item.id ? { ...campaign, status: campaign.status === 'Active' ? 'Paused' : 'Active' } : campaign) })}>{item.status === 'Active' ? <Pause /> : <Play />}</Button></td></tr>)}</tbody></table>{!visible.length && <p className="workspace-empty">No campaigns match this view.</p>}</div></Card>
  </PageFrame>
}
function AnalyticsPage({ data, onDetails }: { data: Record<DetailView, DetailData>; onDetails: (view: DetailView) => void }) {
  const main = useRef<HTMLElement>(null)
  useEffect(() => { main.current?.focus() }, [])
  return <main ref={main} className="workspace-page analytics-page" aria-label="Analytics" tabIndex={-1}>
    <div className="analytics-metrics">{(['Visits', 'Sign-ins', 'My Funnel'] as const).map(view => <Card className="glass analytics-metric" key={view}><span>{view === 'My Funnel' ? 'Conversion' : view}</span><strong>{data[view].value}</strong><Button variant="ghost" className="round-button" aria-label={`View ${view} details`} onClick={() => onDetails(view)}><ArrowUpRight /></Button></Card>)}</div>
    <AnalyticsCharts data={data} onDetails={onDetails} />
  </main>
}

type Thread = { id: number; name: string; subject: string; unread: boolean; messages: { from: 'customer' | 'you'; text: string }[] }
const initialThreads: Thread[] = [
  { id: 1, name: 'Olivia Rhye', subject: 'A question about my subscription', unread: true, messages: [{ from: 'customer', text: 'Hi! Where can I find my next renewal date?' }] },
  { id: 2, name: 'Lana Steiner', subject: 'Thanks for the update', unread: true, messages: [{ from: 'customer', text: 'The new dashboard looks great. Thank you!' }] },
  { id: 3, name: 'Phoenix Baker', subject: 'Annual plan details', unread: false, messages: [{ from: 'customer', text: 'Could you share what is included in the annual plan?' }] },
]
function InboxPage({ query }: { query: string }) {
  const [saved, setSaved] = useSaved('lillian-inbox', { threads: initialThreads })
  const [selected, setSelected] = useState(1)
  const [reply, setReply] = useState('')
  const thread = saved.threads.find(item => item.id === selected)!
  const visible = saved.threads.filter(item => `${item.name} ${item.subject}`.toLowerCase().includes(query.toLowerCase()))
  return <PageFrame title="Inbox"><Card className="glass inbox-workspace"><div className="inbox-thread-list" aria-label="Conversations">{visible.map(item => <button key={item.id} className={`inbox-thread ${selected === item.id ? 'is-selected' : ''}`} aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setReply(''); setSaved({ threads: saved.threads.map(current => current.id === item.id ? { ...current, unread: false } : current) }) }}><span className="thread-avatar">{item.name.split(' ').map(part => part[0]).join('')}</span><span><strong>{item.name}</strong><small>{item.subject}</small></span>{item.unread && <i aria-label="Unread" />}</button>)}{!visible.length && <p className="workspace-empty">No matching conversations.</p>}</div><section className="inbox-conversation" aria-label={`Conversation with ${thread.name}`}><div className="conversation-heading"><Mail /><div><h2>{thread.name}</h2><p>{thread.subject}</p></div></div><div className="conversation-messages" role="log" aria-live="polite">{thread.messages.map((item, index) => <div className={`conversation-bubble ${item.from === 'you' ? 'from-you' : ''}`} key={index}><span>{item.from === 'you' ? 'You' : thread.name}</span><p>{item.text}</p></div>)}</div><form className="inbox-composer" onSubmit={event => { event.preventDefault(); if (!reply.trim()) return; setSaved({ threads: saved.threads.map(item => item.id === selected ? { ...item, unread: false, messages: [...item.messages, { from: 'you', text: reply.trim() }] } : item) }); setReply('') }}><Input aria-label="Reply to conversation" placeholder="Write a reply…" value={reply} onChange={event => setReply(event.target.value)} maxLength={2000} /><Button type="submit" className="workspace-action" disabled={!reply.trim()}><Send /><span>Send demo reply</span></Button></form></section></Card></PageFrame>
}

const settingsTabs = ['General', 'Team', 'Billing', 'Notifications', 'Integrations', 'Security'] as const
export type SettingsTab = typeof settingsTabs[number]
const defaults = { workspace: 'Lillian Studio', email: 'hello@example.com', timezone: 'Africa/Casablanca', currency: 'USD', plan: 'Pro', cycle: 'Monthly', orderAlerts: true, campaignAlerts: false, weeklyDigest: true, emailIntegration: false, analyticsIntegration: false, session: '7 days' }
function SettingsPage({ initialTab = 'General' }: { initialTab?: SettingsTab }) {
  const [saved, setSaved] = useSaved('lillian-settings', defaults)
  const [draft, setDraft] = useState(saved)
  const [tab, setTab] = useState<SettingsTab>(initialTab)
  const [notice, setNotice] = useState('')
  const [team, setTeam] = useSaved('lillian-team', { members: [{ email: 'owner@example.com', role: 'Owner' }, { email: 'alex@example.com', role: 'Admin' }] })
  const [invite, setInvite] = useState('')
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const check = (key: 'orderAlerts' | 'campaignAlerts' | 'weeklyDigest' | 'emailIntegration' | 'analyticsIntegration', label: string) => <label className="settings-checkbox"><input type="checkbox" checked={draft[key]} onChange={event => { setDraft({ ...draft, [key]: event.target.checked }); setNotice('') }} />{label}</label>
  const select = (key: 'timezone' | 'currency' | 'plan' | 'cycle' | 'session', label: string, options: string[]) => <label className="settings-field">{label}<select value={draft[key]} onChange={event => { setDraft({ ...draft, [key]: event.target.value }); setNotice('') }}>{options.map(option => <option key={option}>{option}</option>)}</select></label>
  return <PageFrame title="Settings"><div className="settings-tabs-layout"><div className="classic-tabs" role="tablist" aria-label="Settings sections">{settingsTabs.map((name, index) => <Button ref={element => { tabs.current[index] = element }} variant="ghost" role="tab" id={`settings-tab-${name}`} aria-controls={`settings-panel-${name}`} aria-selected={tab === name} tabIndex={tab === name ? 0 : -1} key={name} onClick={() => { setTab(name); setNotice('') }} onKeyDown={event => {
    const next = event.key === 'ArrowRight' ? (index + 1) % settingsTabs.length : event.key === 'ArrowLeft' ? (index + settingsTabs.length - 1) % settingsTabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? settingsTabs.length - 1 : -1
    if (next >= 0) { event.preventDefault(); setTab(settingsTabs[next]); tabs.current[next]?.focus() }
  }}>{name}</Button>)}</div>
    <form className="classic-settings-form" onSubmit={event => { event.preventDefault(); setSaved(draft); setNotice('Preferences saved.') }}>
      <section role="tabpanel" id={`settings-panel-${tab}`} aria-labelledby={`settings-tab-${tab}`} className="classic-tab-panel" tabIndex={0}>
        {tab === 'General' && <fieldset><legend>Workspace information</legend><div className="settings-fields"><label className="settings-field">Workspace name<Input required value={draft.workspace} onChange={event => { setDraft({ ...draft, workspace: event.target.value }); setNotice('') }} /></label><label className="settings-field">Contact email<Input required type="email" value={draft.email} onChange={event => { setDraft({ ...draft, email: event.target.value }); setNotice('') }} /></label>{select('timezone', 'Time zone', ['Africa/Casablanca', 'UTC', 'Europe/London', 'America/New_York'])}{select('currency', 'Currency', ['USD', 'EUR', 'MAD', 'GBP'])}</div></fieldset>}
        {tab === 'Team' && <fieldset><legend>Workspace members</legend><table className="page-table"><thead><tr><th>Email</th><th>Role</th></tr></thead><tbody>{team.members.map(member => <tr key={member.email}><td>{member.email}</td><td>{member.role}</td></tr>)}</tbody></table><div className="team-invite"><Input type="email" aria-label="New member email" placeholder="teammate@example.com" value={invite} onChange={event => setInvite(event.target.value)} /><Button type="button" variant="outline" onClick={() => { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.trim())) { setNotice('Enter a valid email address.'); return } if (team.members.some(member => member.email.toLowerCase() === invite.trim().toLowerCase())) { setNotice('This member is already in your workspace.'); return } setTeam({ members: [...team.members, { email: invite.trim(), role: 'Member' }] }); setInvite(''); setNotice('Added to the local team list. No invitation was sent.') }}>Add member</Button></div></fieldset>}
        {tab === 'Billing' && <fieldset><legend>Plan preferences</legend><div className="settings-fields">{select('plan', 'Plan', ['Starter', 'Pro', 'Business'])}{select('cycle', 'Billing cycle', ['Monthly', 'Annual'])}</div><p className="settings-note">Plan previews only. No payment or subscription changes are made.</p></fieldset>}
        {tab === 'Notifications' && <fieldset><legend>Email notifications</legend>{check('orderAlerts', 'New order alerts')}{check('campaignAlerts', 'Campaign activity')}{check('weeklyDigest', 'Weekly performance digest')}</fieldset>}
        {tab === 'Integrations' && <fieldset><legend>Integration preferences</legend>{check('emailIntegration', 'Email platform')}{check('analyticsIntegration', 'Analytics platform')}<p className="settings-note">Demo preferences. No external accounts are connected.</p></fieldset>}
        {tab === 'Security' && <fieldset><legend>Sessions & access</legend>{select('session', 'Preferred session duration', ['1 day', '7 days', '30 days'])}<p className="settings-note">This preference is stored locally. Authentication and access enforcement require a connected backend.</p><div className="security-summary"><span>Workspace role</span><strong>Owner</strong></div></fieldset>}
      </section>
      <div className="settings-footer"><span role="status">{notice}</span><Button variant="outline" type="button" onClick={() => { setDraft(saved); setNotice('Unsaved changes discarded.') }}>Cancel</Button><Button className="workspace-action" type="submit"><Check />Apply</Button></div>
    </form>
  </div></PageFrame>
}

export function WorkspacePages({ page, query, data, onDetails, initialSettingsTab = 'General' }: { page: WorkspacePage; query: string; data: Record<DetailView, DetailData>; onDetails: (view: DetailView) => void; initialSettingsTab?: SettingsTab }) {
  if (page === 'Campaigns') return <CampaignsPage query={query} />
  if (page === 'Analytics') return <AnalyticsPage data={data} onDetails={onDetails} />
  if (page === 'Inbox') return <InboxPage query={query} />
  return <SettingsPage initialTab={initialSettingsTab} />
}
