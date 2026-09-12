import { forwardRef } from 'react'
import type { IconSvgElement } from '@hugeicons/react'
import { Icon } from '@/components/ui/icon'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface IconInputProps extends InputProps {
  icon: IconSvgElement
}

export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  function IconInput({ icon, className, ...props }, ref) {
    return (
      <div className="relative">
        <Icon
          icon={icon}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        />
        <Input
          {...props}
          ref={ref}
          className={cn('h-11 pl-10 pr-3.5 rounded-xl bg-background', className)}
        />
      </div>
    )
  }
)
