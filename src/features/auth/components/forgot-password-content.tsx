"use client"

import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { siteConfig } from "@/config/site"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/features/auth/schemas/forgot-password.schema"

import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

import { useForgotPasswordMutation } from "@/features/auth/auth.api"
import { getErrorMessage } from "@/lib/utils/error"

export function ForgotPasswordContent() {
  const [forgotPassword, { isError, error, isSuccess, isLoading }] =
    useForgotPasswordMutation()

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      await forgotPassword(data).unwrap()
      // Handle successful password reset request (e.g., show success message)
      toast.success(
        "Password reset link sent! Please check your email for further instructions."
      )
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Forgot password request failed:", error)
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
              Account Recovery
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground xl:text-5xl">
              Get back into your {siteConfig.name} account.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-primary-foreground/75">
              Enter your account email and we&apos;ll send you instructions to
              securely reset your password.
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
                Forgot your password?
              </h2>

              <p className="text-sm leading-6 text-muted-foreground">
                Enter the email address associated with your account and
                we&apos;ll send you a password reset link.
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
                <Label htmlFor="email">Email address <span className="text-destructive">*</span></Label>

                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="pl-10"
                  />
                </div>

                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                disabled={isLoading || !isValid || isSuccess}
                type="submit"
                className={
                  isSuccess
                    ? "w-full bg-green-600 hover:bg-green-600"
                    : "w-full"
                }
              >
                {isLoading
                  ? "Sending..."
                  : isSuccess
                    ? "Reset link sent"
                    : "Send reset link"}
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
