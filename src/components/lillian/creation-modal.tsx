'use client'

import { useEffect, useId, useRef, type FormEventHandler, type ReactNode, type RefObject } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CreationModal({ title, submitLabel, onSubmit, onClose, returnFocusRef, children, disabled = false }: {
  title: string
  submitLabel: string
  onSubmit: FormEventHandler<HTMLFormElement>
  onClose: () => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
  children: ReactNode
  disabled?: boolean
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const element = dialog.current!
    const trigger = returnFocusRef.current
    element.showModal()
    return () => {
      element.close()
      if (trigger?.isConnected) trigger.focus()
    }
  }, [returnFocusRef])

  return <dialog ref={dialog} className="creation-modal" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose() }}>
    <header className="creation-modal-heading"><h2 id={titleId}>{title}</h2><Button type="button" variant="ghost" size="icon" className="creation-modal-close" aria-label={`Close ${title.toLowerCase()}`} onClick={onClose}><X /></Button></header>
    <form onSubmit={onSubmit}>
      <div className="creation-modal-fields">{children}</div>
      <footer className="creation-modal-footer"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button className="workspace-action" type="submit" disabled={disabled}>{submitLabel}</Button></footer>
    </form>
  </dialog>
}
