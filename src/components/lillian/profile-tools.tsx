'use client'

import { useState } from 'react'
import { Check, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export type DemoProfile = { name: string; email: string; account: string }
export const defaultProfile: DemoProfile = { name: 'Alex Morgan', email: 'alex@example.com', account: 'Lillian Studio' }
export function ProfilePanel({ mode, profile, onSave, onClose }: { mode: 'Edit profile' | 'Switch account'; profile: DemoProfile; onSave: (profile: DemoProfile) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(profile)
  return <section className="detail-panel glass profile-tools-panel" aria-label={mode}><div className="panel-heading"><h2>{mode}</h2><Button variant="ghost" size="icon" aria-label="Close profile panel" onClick={onClose}><X /></Button></div>
    {mode === 'Edit profile' ? <form onSubmit={event => { event.preventDefault(); onSave(draft); onClose() }}><label>Name<Input autoFocus required value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} maxLength={80} /></label><label>Email<Input required type="email" value={draft.email} onChange={event => setDraft({ ...draft, email: event.target.value })} /></label><Button type="submit">Save profile</Button></form> : <div className="profile-account-list">{['Lillian Studio', 'Personal workspace'].map(account => <Button variant="ghost" key={account} onClick={() => { onSave({ ...profile, account }); onClose() }}><UserRound /><span>{account}<small>Demo account</small></span>{profile.account === account && <Check />}</Button>)}</div>}
  </section>
}
