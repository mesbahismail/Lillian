'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createDemoOrders, filterOrders, orderCurrency, orderTotals, sortOrders, type OrderSort, type OrderStatus } from './orders-data'
import './orders-page.css'

const columns: { key: OrderSort; label: string }[] = [
  { key: 'id', label: 'Order' }, { key: 'customer', label: 'Customer' },
  { key: 'plan', label: 'Plan' }, { key: 'createdAt', label: 'Date' },
  { key: 'status', label: 'Status' }, { key: 'value', label: 'Value' },
]
const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export function OrdersPage({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  const [orders] = useState(createDemoOrders)
  const [status, setStatus] = useState<OrderStatus>('All')
  const [sort, setSort] = useState<{ key: OrderSort; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' })
  const [pagination, setPagination] = useState({ page: 0, query: '', status: 'All' as OrderStatus, size: 8 })
  const [pageSize, setPageSize] = useState(8)
  const filtered = useMemo(() => filterOrders(orders, query, status), [orders, query, status])
  const sorted = useMemo(() => sortOrders(filtered, sort.key, sort.direction), [filtered, sort])
  const totals = orderTotals(filtered)
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const page = pagination.query === query && pagination.status === status && pagination.size === pageSize ? Math.min(pagination.page, pageCount - 1) : 0
  const start = page * pageSize
  const visible = sorted.slice(start, start + pageSize)
  const metrics = [
    { label: 'Order count', value: totals.count.toLocaleString(), caption: 'Total orders' },
    { label: 'Orders value', value: orderCurrency(totals.value), caption: 'Before refunds' },
    { label: 'Refunds', value: orderCurrency(totals.refunds), caption: `${filtered.filter(order => order.refund > 0).length} refunded orders` },
    { label: 'Profit', value: orderCurrency(totals.profit), caption: 'After refunds & costs' },
  ]
  function changeSort(key: OrderSort) {
    setSort(current => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))
    setPagination({ page: 0, query, status, size: pageSize })
  }
  function changePage(next: number) { setPagination({ page: next, query, status, size: pageSize }) }

  return <main className="workspace-page orders-page" aria-label="Orders">
    <div className="orders-metrics">
      {metrics.map(metric => <Card className="glass orders-metric" key={metric.label}>
        <div className="card-heading"><h2>{metric.label}</h2></div>
        <strong>{metric.value}</strong><span>{metric.caption}</span>
      </Card>)}
    </div>
    <Card className="glass orders-list-widget">
      <div className="card-heading"><h2>Orders</h2><span className="orders-result-count">{filtered.length} orders</span></div>
      <div className="orders-controls">
        <div className="page-filter-tabs" aria-label="Filter orders by status">
          {(['All', 'Paid', 'Refunded'] as const).map(value => <Button variant="ghost" key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>{value}</Button>)}
        </div>
        <div className="orders-search white-layer"><Search aria-hidden="true" /><Input aria-label="Search orders" value={query} placeholder="Search orders" onChange={event => onQueryChange(event.target.value)} />{query && <Button variant="ghost" size="icon-xs" aria-label="Clear order search" onClick={() => onQueryChange('')}><X /></Button>}</div>
      </div>
      <div className="orders-table-scroll" tabIndex={0} role="region" aria-label="Orders table">
        <table className="orders-data-table">
          <thead><tr>{columns.map(column => <th key={column.key} scope="col" aria-sort={sort.key === column.key ? sort.direction === 'asc' ? 'ascending' : 'descending' : 'none'}><Button variant="ghost" onClick={() => changeSort(column.key)}>{column.label}{sort.key !== column.key ? <ArrowUpDown /> : sort.direction === 'asc' ? <ArrowUp /> : <ArrowDown />}</Button></th>)}</tr></thead>
          <tbody>{visible.map(order => <tr key={order.id}>
            <td><span className="orders-id">#{order.id}</span></td>
            <td><span className="orders-customer">{order.customer}</span><span className="orders-email">{order.email}</span></td>
            <td>{order.plan}</td><td><time dateTime={new Date(order.createdAt).toISOString()}>{dateFormatter.format(order.createdAt)}</time></td>
            <td><span className={`orders-status white-layer ${order.status.toLowerCase()}`}><i aria-hidden="true" />{order.status}</span></td>
            <td className="orders-value">{orderCurrency(order.value)}{order.refund > 0 && <span className="orders-refund">−{orderCurrency(order.refund)} refunded</span>}</td>
          </tr>)}{visible.length === 0 && <tr><td colSpan={6} className="orders-empty">No orders match your search or filter.</td></tr>}</tbody>
        </table>
      </div>
      <footer className="orders-table-footer">
        <span aria-live="polite">{sorted.length ? `${start + 1}–${Math.min(start + pageSize, sorted.length)} of ${sorted.length}` : '0 orders'}</span>
        <label>Rows <select aria-label="Orders per page" value={pageSize} onChange={event => setPageSize(Number(event.target.value))}><option value={8}>8</option><option value={12}>12</option><option value={24}>24</option></select></label>
        <div className="orders-pagination"><Button className="round-button" variant="ghost" size="icon-sm" aria-label="Previous orders page" disabled={page === 0} onClick={() => changePage(page - 1)}><ChevronLeft /></Button><span>{page + 1} / {pageCount}</span><Button className="round-button" variant="ghost" size="icon-sm" aria-label="Next orders page" disabled={page >= pageCount - 1} onClick={() => changePage(page + 1)}><ChevronRight /></Button></div>
      </footer>
    </Card>
    <p className="orders-demo-note">Demo orders · Profit = order value − refunds − recorded costs.</p>
  </main>
}
