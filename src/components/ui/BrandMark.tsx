import { cn } from '@/lib/utils'

interface BrandMarkProps {
  size?: 'sm' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 rounded-xl text-sm font-extrabold shadow-xs',
  lg: 'h-12 w-12 rounded-2xl text-xl font-black shadow-lg shadow-primary/25',
} as const

export function BrandMark({ size = 'sm', className }: BrandMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-primary text-primary-foreground flex items-center justify-center shrink-0',
        SIZE_CLASSES[size],
        className
      )}
    >
      TM
    </div>
  )
}
