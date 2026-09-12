import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { registerSchema, type RegisterFormData } from '@/lib/validation/authSchema'
import { hashPassword } from '@/lib/crypto/password'
import { isUsernameTaken, saveRegisteredAccount } from '@/lib/auth/accountStorage'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { useToast } from '@/components/ui/useToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/FormField'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { AlertBanner } from '@/components/ui/AlertBanner'

interface RegisterFormProps {
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  })

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null)

    const username = data.username.trim()

    if (isUsernameTaken(username)) {
      setError('username', {
        type: 'manual',
        message: 'This username is already registered.',
      })
      return
    }

    try {
      saveRegisteredAccount({
        username,
        usernameLower: username.toLowerCase(),
        passwordHash: await hashPassword(data.password),
        createdAt: new Date().toISOString(),
      })

      dispatch(login(username))
      toast(`Account created! Welcome, ${username}!`, 'success')
      navigate('/players')
    } catch {
      setAuthError('An error occurred during registration. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      {authError && <AlertBanner>{authError}</AlertBanner>}

      <FormField htmlFor="register-username" label="Username" error={errors.username?.message}>
        <Input
          id="register-username"
          type="text"
          placeholder="Enter username"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? 'register-username-error' : undefined}
          className="h-10"
          {...register('username')}
        />
      </FormField>

      <FormField htmlFor="register-password" label="Password" error={errors.password?.message}>
        <PasswordInput
          id="register-password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'register-password-error' : undefined}
          className="h-10"
          {...register('password')}
        />
      </FormField>

      <FormField
        htmlFor="register-confirm-password"
        label="Confirm Password"
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="register-confirm-password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword ? 'register-confirm-password-error' : undefined
          }
          className="h-10"
          {...register('confirmPassword')}
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11 text-sm font-semibold mt-2">
        {isSubmitting ? 'Registering...' : 'Create Account'}
      </Button>

      {onSwitchToLogin && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-xs text-primary hover:underline font-medium cursor-pointer"
          >
            Already have an account? Sign in
          </button>
        </div>
      )}
    </form>
  )
}
