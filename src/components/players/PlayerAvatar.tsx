import { useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { UserIcon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

const avatarVariants = cva(
  'rounded-full flex items-center justify-center text-white shrink-0 select-none shadow-xs font-semibold',
  {
    variants: {
      size: {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm font-bold',
        lg: 'w-14 h-14 text-base font-bold',
        xl: 'w-16 h-16 text-lg font-bold',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const ICON_SIZES: Record<NonNullable<VariantProps<typeof avatarVariants>['size']>, number> = {
  sm: 14,
  md: 18,
  lg: 22,
  xl: 26,
}

export interface PlayerAvatarProps extends VariantProps<typeof avatarVariants> {
  id?: number
  name: string
  className?: string
}

const AVATAR_COLORS = [
  '#1a73e8', 
  '#e52592', 
  '#12b5cb', 
  '#e37400', 
  '#9334e6', 
  '#0d652d', 
  '#d93025', 
  '#f29900', 
  '#188038', 
  '#a142f4', 
  '#e8710a', 
  '#007b83', 
]

function hashString(value: string): number {
  let hash = 0

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash)
}

function getInitials(name: string): string | null {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return null
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function PlayerAvatar({ id, name, size = 'md', className }: PlayerAvatarProps) {
  const resolvedSize = size ?? 'md'
  const initials = useMemo(() => getInitials(name), [name])

  const backgroundColor = useMemo(() => {
    const seed = id ?? hashString(name)
    return AVATAR_COLORS[seed % AVATAR_COLORS.length]
  }, [id, name])

  return (
    <div
      className={cn(avatarVariants({ size: resolvedSize }), className)}
      style={{ backgroundColor }}
      title={name}
      aria-label={name}
    >
      {initials ? (
        <span className="tracking-normal leading-none uppercase">{initials}</span>
      ) : (
        <Icon icon={UserIcon} size={ICON_SIZES[resolvedSize]} className="text-white/90" />
      )}
    </div>
  )
}

