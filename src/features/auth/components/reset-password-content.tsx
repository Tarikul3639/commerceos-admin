"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react"

import { siteConfig } from "@/config/site"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/features/auth/schemas/reset-password.schema"

import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { useResetPasswordMutation } from "@/features/auth/auth.api"
import { getErrorMessage } from "@/lib/utils/error"

export function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetToken = searchParams.get("token")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [resetPasswordMutation, { isError, error, isLoading }] =
    useResetPasswordMutation()

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (!isValid || data.password !== data.confirmPassword || !resetToken) {
      return
    }

    try {
      await resetPasswordMutation({
        token: resetToken,
        password: data.password,
      }).unwrap()

      toast.success("Password reset successful! Redirecting to login...")
      router.push("/login")
    } catch (error) {
      console.error("Reset password request failed:", error)
    }
  }
  return (
    <main className="min-h-svh bg-background">
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-primary/80" />

          <div className="relative z-10 p-10">
            <Logo inverted />
          </div>

          <div className="relative z-10 max-w-xl p-10 pb-16">
            <p className="mb-4 text-sm font-medium tracking-widest text-primary-foreground/70 uppercase">
              Password Reset
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground xl:text-5xl">
              Create a new secure password.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-primary-foreground/75">
              Choose a strong password to keep your {siteConfig.name} account
              secure and protected.
            </p>
          </div>

          <div className="relative z-10 p-10 text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>
        </div>

        <div className="flex min-h-svh items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Reset your password
              </h2>

              <p className="text-sm leading-6 text-muted-foreground">
                Enter your new password below. Make sure it&apos;s strong and
                secure.
              </p>
            </div>

            {isError && (
              <div
                role="alert"
                className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {getErrorMessage(error)}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>

                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    className="pr-10 pl-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>

                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    className="pr-10 pl-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {/* Error of confirm  password */}
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading ? "Resetting..." : "Reset password"}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <Separator className="flex-1" />

              <span className="text-xs tracking-wider text-muted-foreground uppercase">
                Secure recovery
              </span>

              <Separator className="flex-1" />
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft className="size-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
