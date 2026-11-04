'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, Check, Pause, Play, Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { DetailData, DetailView } from './widget-details'
import { AnalyticsCharts } from './analytics-charts'
import { CreationModal } from './creation-modal'
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
  const addButton = useRef<HTMLButtonElement>(null)
  const visible = saved.campaigns.filter(item => (filter === 'All' || item.status === filter) && `${item.name} ${item.channel}`.toLowerCase().includes(query.toLowerCase()))
  return <PageFrame title="Campaigns">
    {creating && <CreationModal title="New campaign" submitLabel="Create draft" returnFocusRef={addButton} onClose={() => setCreating(false)} disabled={!name.trim()} onSubmit={event => {
      event.preventDefault()
      if (!name.trim()) return
      setSaved({ campaigns: [...saved.campaigns, { id: Date.now(), name: name.trim(), channel, status: 'Draft', visits: 0, conversions: 0 }] })
      setName(''); setCreating(false); setFilter('All')
    }}>
      <label>Campaign name<Input autoFocus required value={name} onChange={event => setName(event.target.value)} placeholder="Name your campaign" maxLength={80} /></label>
      <label>Channel<select value={channel} onChange={event => setChannel(event.target.value)}><option>Email</option><option>Meta Ads</option><option>Social</option></select></label>
    </CreationModal>}
    <div className="settings-tabs-layout"><div className="classic-tabs filter-tabs" role="group" aria-label="Campaign status">{['All', 'Active', 'Paused', 'Draft'].map(status => <Button variant="ghost" key={status} aria-pressed={filter === status} onClick={() => setFilter(status)}><span>{status}</span></Button>)}</div><Card className="glass workspace-surface tabbed-panel campaign-surface"><div className="page-table-scroll"><table className="page-table"><thead><tr><th>Campaign</th><th>Channel</th><th>Status</th><th>Visits</th><th>Conversions</th><th><span className="visually-hidden">Actions</span></th></tr></thead><tbody>{visible.map(item => <tr key={item.id}><td>{item.name}</td><td>{item.channel}</td><td><span className="page-status">{item.status}</span></td><td>{item.visits}</td><td>{item.conversions}</td><td><Button variant="ghost" size="icon" aria-label={`${item.status === 'Active' ? 'Pause' : 'Start'} ${item.name}`} onClick={() => setSaved({ campaigns: saved.campaigns.map(campaign => campaign.id === item.id ? { ...campaign, status: campaign.status === 'Active' ? 'Paused' : 'Active' } : campaign) })}>{item.status === 'Active' ? <Pause /> : <Play />}</Button></td></tr>)}</tbody></table>{!visible.length && <p className="workspace-empty">No campaigns match this view.</p>}</div><footer className="campaign-footer"><Button ref={addButton} className="workspace-action campaign-add-button" size="icon" aria-label="New campaign" title="New campaign" aria-expanded={creating} aria-haspopup="dialog" onClick={() => { setName(''); setChannel('Email'); setCreating(true) }}><Plus /></Button></footer></Card></div>
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
function InboxPage({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  const [saved, setSaved] = useSaved('lillian-inbox', { threads: initialThreads })
  const [selected, setSelected] = useState(1)
  const [reply, setReply] = useState('')
  const [creating, setCreating] = useState(false)
  const [contact, setContact] = useState('')
  const [subject, setSubject] = useState('')
  const addButton = useRef<HTMLButtonElement>(null)
  const thread = saved.threads.find(item => item.id === selected) ?? saved.threads[0]
  const visible = saved.threads.filter(item => `${item.name} ${item.subject} ${item.messages.map(message => message.text).join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  const cancelCreate = () => setCreating(false)
  return <PageFrame title="Inbox"><Card className="glass inbox-workspace">
    <aside className="inbox-sidebar" aria-label="Conversations">
      <div className="inbox-thread-list">
        {visible.map(item => <button key={item.id} className={`inbox-thread ${selected === item.id ? 'is-selected' : ''}`} aria-pressed={selected === item.id} onClick={() => {
          setSelected(item.id); setReply(''); setCreating(false)
          setSaved({ threads: saved.threads.map(current => current.id === item.id ? { ...current, unread: false } : current) })
        }}><span className="thread-avatar">{item.name.split(' ').map(part => part[0]).join('')}</span><span><strong>{item.name}</strong><small>{item.subject}</small></span>{item.unread && <i aria-label="Unread" />}</button>)}
        {!visible.length && <p className="workspace-empty">No chats match your search.</p>}
      </div>
      <footer className="inbox-sidebar-footer"><Button ref={addButton} className="workspace-action campaign-add-button" size="icon" aria-label="New conversation" title="New conversation" aria-haspopup="dialog" aria-expanded={creating} onClick={() => { setCreating(true); setContact(''); setSubject('') }}><Plus /></Button></footer>
    </aside>
    {creating && <CreationModal title="New conversation" submitLabel="Create conversation" returnFocusRef={addButton} onClose={cancelCreate} disabled={!contact.trim() || !subject.trim()} onSubmit={event => {
      event.preventDefault()
      if (!contact.trim() || !subject.trim()) return
      const id = Math.max(0, ...saved.threads.map(item => item.id)) + 1
      setSaved({ threads: [...saved.threads, { id, name: contact.trim(), subject: subject.trim(), unread: false, messages: [] }] })
      setSelected(id); setReply(''); setCreating(false); onQueryChange('')
    }}>
      <label>Contact name<Input autoFocus required value={contact} onChange={event => setContact(event.target.value)} placeholder="Who is this conversation with?" maxLength={80} /></label>
      <label>Subject<Input required value={subject} onChange={event => setSubject(event.target.value)} placeholder="What is it about?" maxLength={120} /></label>
    </CreationModal>}
    <section className="inbox-conversation" aria-label={`Conversation with ${thread.name}`}>
      <div className="conversation-heading"><span className="conversation-avatar" role="img" aria-label={`${thread.name} avatar placeholder`}>{thread.name.split(' ').map(part => part[0]).join('')}</span><div><h2>{thread.name}</h2><p>{thread.subject}</p></div></div>
      <div className="conversation-messages" role="log" aria-live="polite">
        {!thread.messages.length && <p className="workspace-empty">Start the conversation with a message.</p>}
        {thread.messages.map((item, index) => <div className={`conversation-bubble ${item.from === 'you' ? 'from-you' : ''}`} key={index}><span>{item.from === 'you' ? 'You' : thread.name}</span><p>{item.text}</p></div>)}
      </div>
      <form className="inbox-composer" onSubmit={event => { event.preventDefault(); if (!reply.trim()) return; setSaved({ threads: saved.threads.map(item => item.id === selected ? { ...item, unread: false, messages: [...item.messages, { from: 'you', text: reply.trim() }] } : item) }); setReply('') }}><Input aria-label="Reply to conversation" placeholder="Write a reply…" value={reply} onChange={event => setReply(event.target.value)} maxLength={2000} /><Button type="submit" className="workspace-action" disabled={!reply.trim()}><Send /><span>Send demo reply</span></Button></form>
    </section>
  </Card></PageFrame>
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
  }}><span>{name}</span></Button>)}</div>
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

export function WorkspacePages({ page, query, onQueryChange, data, onDetails, initialSettingsTab = 'General' }: { page: WorkspacePage; query: string; onQueryChange: (value: string) => void; data: Record<DetailView, DetailData>; onDetails: (view: DetailView) => void; initialSettingsTab?: SettingsTab }) {
  if (page === 'Campaigns') return <CampaignsPage query={query} />
  if (page === 'Analytics') return <AnalyticsPage data={data} onDetails={onDetails} />
  if (page === 'Inbox') return <InboxPage query={query} onQueryChange={onQueryChange} />
  return <SettingsPage initialTab={initialSettingsTab} />
}
