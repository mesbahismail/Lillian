'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CompactPagination({ page, pageCount, onChange, label }: {
  page: number
  pageCount: number
  onChange: (page: number) => void
  label: string
}) {
  return <nav className="compact-pagination" aria-label={label}>
    <Button variant="ghost" aria-label="Previous page" disabled={page === 0} onClick={() => onChange(page - 1)}><ChevronLeft /></Button>
    {Array.from({ length: pageCount }, (_, index) => <Button variant="ghost" key={index} aria-label={`Page ${index + 1}`} aria-current={page === index ? 'page' : undefined} onClick={() => onChange(index)}>{index + 1}</Button>)}
    <Button variant="ghost" aria-label="Next page" disabled={page >= pageCount - 1} onClick={() => onChange(page + 1)}><ChevronRight /></Button>
  </nav>
}
