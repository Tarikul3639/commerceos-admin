"use client"

import { useState } from "react"
import { siteConfig } from "@/config/site"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  loginSchema,
  LoginFormData,
} from "@/features/auth/schemas/login.schema"

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/layout/logo"
import Link from "next/link"
import { toast } from "sonner"

import { useLoginMutation } from "@/features/auth/auth.api"
import { getErrorMessage } from "@/lib/utils/error"

export function LoginContent() {
  const [showPassword, setShowPassword] = useState(false)

  const [loginMutation, { isError, error, isLoading }] = useLoginMutation()

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await loginMutation(data).unwrap()
      // Handle successful login (e.g., redirect to dashboard)

      toast.success("Login successful! Redirecting to dashboard...")
      // Redirect to dashboard or another page
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-primary/80" />

          <div className="relative z-10 p-10">
            <Logo inverted className="text-primary-foreground" />
          </div>

          <div className="relative z-10 max-w-xl p-10 pb-16">
            <p className="mb-4 text-sm font-medium tracking-widest text-primary-foreground/70 uppercase">
              Business Management
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground xl:text-5xl">
              Manage your commerce business from one place.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-primary-foreground/75">
              Manage products, orders, stock, customers, suppliers, and your
              entire business operation.
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
                Welcome back
              </h2>

              <p className="text-sm text-muted-foreground">
                Sign in to your {siteConfig.name} dashboard
              </p>
            </div>

            {/* Show error */}
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
                <Label htmlFor="email">Email address</Label>

                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="pl-10"
                    required
                  />
                </div>

                {/* Email error */}
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

                {/* Password error */}
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={watch("remember")}
                  onCheckedChange={(checked) =>
                    setValue("remember", checked === true)
                  }
                />

                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-sm font-normal text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !isValid}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <Separator className="flex-1" />

              <span className="text-xs tracking-wider text-muted-foreground uppercase">
                Secure access
              </span>

              <Separator className="flex-1" />
            </div>

            <div className="rounded-lg border bg-muted/40 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Haven&apos;t verified your email yet?{" "}
                <Link
                  href="/verify-email/resend"
                  className="font-medium text-primary hover:underline"
                >
                  Verify your email
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
