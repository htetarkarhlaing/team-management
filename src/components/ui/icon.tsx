import * as React from 'react'
import { HugeiconsIcon, type HugeiconsProps, type IconSvgElement } from '@hugeicons/react'
import { cn } from '@/lib/utils'

export interface IconProps extends Omit<HugeiconsProps, 'icon'> {
  icon: IconSvgElement
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon, size = 16, strokeWidth = 1.5, className, ...props }, ref) => {
    return (
      <HugeiconsIcon
        ref={ref}
        icon={icon}
        size={size}
        strokeWidth={strokeWidth}
        className={cn('shrink-0', className)}
        {...props}
      />
    )
  }
)
Icon.displayName = 'Icon'

export { HugeiconsIcon }
