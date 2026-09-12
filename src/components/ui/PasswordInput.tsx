import { forwardRef, useState } from 'react'
import { ViewIcon, ViewOffSlashIcon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  function PasswordInput({ className, ...props }, ref) {
    const [isVisible, setIsVisible] = useState(false)

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={isVisible ? 'text' : 'password'}
          className={cn('pr-10', className)}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md cursor-pointer"
        >
          <Icon icon={isVisible ? ViewOffSlashIcon : ViewIcon} className="h-4 w-4" />
        </button>
      </div>
    )
  }
)
