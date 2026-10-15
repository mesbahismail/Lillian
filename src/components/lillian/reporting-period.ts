export type ReportingPeriod = { label: string; from: Date; to: Date; days: number }
export const periodPresets = ['Today', 'Last 24 hours', 'Yesterday', 'Last week', 'Last 7 days', 'This month', 'Last month', 'Last 30 days'] as const
export type PeriodPreset = typeof periodPresets[number]

export function reportingToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Casablanca', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(now)
  const part = (type: string) => Number(parts.find(item => item.type === type)?.value)
  return new Date(part('year'), part('month') - 1, part('day'), 12)
}
const shiftDay = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12)
export function customPeriod(from: Date, to: Date): ReportingPeriod {
  const dayNumber = (date: Date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
  return { label: 'Custom range', from, to, days: Math.round(dayNumber(to) - dayNumber(from)) + 1 }
}
export function presetPeriod(label: PeriodPreset, now = new Date()): ReportingPeriod {
  const today = reportingToday(now)
  let from = today
  let to = today
  if (label === 'Last 24 hours') return { label, from: new Date(now.getTime() - 86400000), to: now, days: 1 }
  if (label === 'Yesterday') from = to = shiftDay(today, -1)
  if (label === 'Last week') {
    const monday = shiftDay(today, -((today.getDay() + 6) % 7))
    from = shiftDay(monday, -7)
    to = shiftDay(monday, -1)
  }
  if (label === 'Last 7 days') from = shiftDay(today, -6)
  if (label === 'Last 30 days') from = shiftDay(today, -29)
  if (label === 'This month') from = new Date(today.getFullYear(), today.getMonth(), 1, 12)
  if (label === 'Last month') {
    from = new Date(today.getFullYear(), today.getMonth() - 1, 1, 12)
    to = new Date(today.getFullYear(), today.getMonth(), 0, 12)
  }
  return { ...customPeriod(from, to), label }
}
export function formatPeriod(period: Pick<ReportingPeriod, 'from' | 'to' | 'label'>, includeYear = false) {
  const formatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', ...(includeYear ? { year: 'numeric' } : {}), ...(period.label === 'Last 24 hours' ? { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca' } : {}) })
  const from = formatter.format(period.from)
  const to = formatter.format(period.to)
  return from === to ? from : `${from} – ${to}`
}
