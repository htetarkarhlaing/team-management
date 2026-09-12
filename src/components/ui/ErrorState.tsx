import { AlertCircleIcon, ReloadIcon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Unable to load players',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-lg mx-auto flex flex-col items-center">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-3">
        <Icon icon={AlertCircleIcon} className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-foreground text-base">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="default" size="sm" className="gap-2">
          <Icon icon={ReloadIcon} className="h-3.5 w-3.5" />
          <span>Retry</span>
        </Button>
      )}
    </div>
  )
}
