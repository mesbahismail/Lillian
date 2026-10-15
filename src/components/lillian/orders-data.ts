import { reportingToday } from './reporting-period'

export type Order = {
  id: number
  customer: string
  email: string
  plan: 'Annual' | 'Monthly'
  createdAt: number
  status: 'Paid' | 'Refunded'
  value: number
  refund: number
  cost: number
}
export type OrderSort = 'id' | 'customer' | 'plan' | 'createdAt' | 'status' | 'value'
export type OrderStatus = 'All' | Order['status']

// Local demo amounts are stored in cents, including the cost used for profit.
export function createDemoOrders(today = reportingToday()): Order[] {
  const customers = ['Olivia Martin', 'Jackson Lee', 'Sofia Davis', 'Noah Williams', 'Emma Wilson', 'Liam Brown', 'Amelia Garcia', 'Lucas Miller', 'Mia Anderson', 'Ethan Thomas', 'Isabella Moore', 'Oliver Taylor', 'Ava Jackson', 'James White', 'Charlotte Harris', 'Henry Clark', 'Harper Lewis', 'Leo Robinson', 'Evelyn Walker', 'Jack Hall', 'Abigail Allen', 'Daniel Young', 'Ella King', 'William Wright']
  const values = [...Array<number>(6).fill(2300), ...Array<number>(4).fill(1900), ...Array<number>(7).fill(1200), ...Array<number>(7).fill(600)]
  return customers.map((customer, index) => ({
    id: 345 - index,
    customer,
    email: `${customer.toLowerCase().replace(' ', '.')}@example.com`,
    plan: index < 10 ? 'Annual' : 'Monthly',
    createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 30 - index * 30).getTime(),
    status: index > 21 ? 'Refunded' : 'Paid',
    value: values[index],
    refund: index > 21 ? values[index] : 0,
    cost: values[index] / 4,
  }))
}

export function filterOrders(orders: Order[], query: string, status: OrderStatus) {
  const term = query.trim().toLowerCase()
  return orders.filter(order => (status === 'All' || order.status === status) &&
    `${order.id} ${order.customer} ${order.email} ${order.plan} ${order.status} ${(order.value / 100).toFixed(2)}`.toLowerCase().includes(term))
}

export function sortOrders(orders: Order[], key: OrderSort, direction: 'asc' | 'desc') {
  return [...orders].sort((a, b) => {
    const left = a[key]
    const right = b[key]
    const result = typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right))
    return (result || a.id - b.id) * (direction === 'asc' ? 1 : -1)
  })
}

export function orderTotals(orders: Order[]) {
  return orders.reduce((totals, order) => ({
    count: totals.count + 1,
    value: totals.value + order.value,
    refunds: totals.refunds + order.refund,
    profit: totals.profit + order.value - order.refund - order.cost,
  }), { count: 0, value: 0, refunds: 0, profit: 0 })
}

export const orderCurrency = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
