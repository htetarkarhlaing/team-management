import { NavLink, useNavigate } from 'react-router-dom'
import type { IconSvgElement } from '@hugeicons/react'
import { Logout01Icon, UserIcon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectUsername } from '@/store/selectors'
import { logout } from '@/store/slices/authSlice'
import { useToast } from '@/components/ui/useToast'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { BrandMark } from '@/components/ui/BrandMark'
import { cn } from '@/lib/utils'
import { ROUTES } from '../routes/paths'

interface NavItem {
  to: string
  label: string
  icon: IconSvgElement
}

const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.players, label: 'Players', icon: UserIcon },
  { to: ROUTES.teams, label: 'Teams', icon: UserGroupIcon },
]

export function AppHeader() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const username = useAppSelector(selectUsername)
  const { toast } = useToast()

  const handleLogout = () => {
    dispatch(logout())
    toast('Logged out', 'info')
    navigate(ROUTES.login)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-6">
          <NavLink to={ROUTES.players} className="flex items-center gap-2.5 shrink-0">
            <BrandMark />
            <span className="font-bold tracking-tight text-foreground text-base hidden sm:inline">
              Team Manager
            </span>
          </NavLink>

          <nav aria-label="Main" className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )
                }
              >
                <Icon icon={item.icon} className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border/80 px-3 py-1.5 rounded-full shadow-2xs">
            <Icon icon={UserIcon} className="h-3.5 w-3.5" />
            <strong className="font-semibold text-foreground truncate max-w-[120px]">
              {username || 'Manager'}
            </strong>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 h-9 rounded-xl px-2.5 sm:px-3 cursor-pointer"
            aria-label="Log out"
          >
            <Icon icon={Logout01Icon} className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
