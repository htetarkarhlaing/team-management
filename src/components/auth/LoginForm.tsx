import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { loginSchema, type LoginFormData } from '@/lib/validation/authSchema'
import { verifyPassword } from '@/lib/crypto/password'
import { findAccountByUsername } from '@/lib/auth/accountStorage'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { useToast } from '@/components/ui/useToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/FormField'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { AlertBanner } from '@/components/ui/AlertBanner'

interface LoginFormProps {
  onSwitchToRegister?: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null)

    const account = findAccountByUsername(data.username)
    if (!account) {
      setAuthError('No account found with this username. Please register.')
      return
    }

    if (!(await verifyPassword(data.password, account.passwordHash))) {
      setAuthError('Incorrect password. Please try again.')
      return
    }

    dispatch(login(account.username))
    toast(`Welcome back, ${account.username}!`, 'success')
    navigate('/players')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      {authError && <AlertBanner>{authError}</AlertBanner>}

      <FormField htmlFor="login-username" label="Username" error={errors.username?.message}>
        <Input
          id="login-username"
          type="text"
          placeholder="Enter username"
          autoFocus
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? 'login-username-error' : undefined}
          className="h-10"
          {...register('username')}
        />
      </FormField>

      <FormField htmlFor="login-password" label="Password" error={errors.password?.message}>
        <PasswordInput
          id="login-password"
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          className="h-10"
          {...register('password')}
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11 text-sm font-semibold mt-2">
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>

      {onSwitchToRegister && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-xs text-primary hover:underline font-medium cursor-pointer"
          >
            Don't have an account? Create one
          </button>
        </div>
      )}
    </form>
  )
}
