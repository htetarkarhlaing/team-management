import { useState, useCallback, type ReactNode } from 'react'
import { CheckmarkCircle02Icon, AlertCircleIcon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { createId } from '@/lib/id'
import { ToastContext, type Toast, type ToastType } from './useToast'

const TOAST_DURATION_MS = 3500

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = createId('toast')
      setToasts((previous) => [...previous, { id, message, type }])

      setTimeout(() => removeToast(id), TOAST_DURATION_MS)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-2 duration-200',
              t.type === 'success' && 'bg-card text-foreground border-emerald-500/30 shadow-emerald-500/5',
              t.type === 'error' && 'bg-card text-destructive border-destructive/30 shadow-destructive/5',
              t.type === 'info' && 'bg-card text-foreground border-border shadow-black/5'
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {t.type === 'success' && (
                <Icon icon={CheckmarkCircle02Icon} className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
              {t.type === 'error' && (
                <Icon icon={AlertCircleIcon} className="h-4 w-4 text-destructive shrink-0" />
              )}
              <span className="truncate">{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Dismiss notification"
            >
              <Icon icon={Cancel01Icon} className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
