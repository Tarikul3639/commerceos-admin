"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { KeyRound, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useChangePasswordMutation } from "@/features/auth/auth.api"
import { getErrorMessage } from "@/lib/utils/error"

import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/profile.schema"

export function ChangePasswordForm() {
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: ChangePasswordFormValues) {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap()
      reset()
      toast.success("Password changed successfully")
    } catch (submitError) {
      toast.error(getErrorMessage(submitError) || "Unable to change password")
    }
  }

  const fields = [
    {
      name: "currentPassword",
      label: "Current password",
      autoComplete: "current-password",
    },
    {
      name: "newPassword",
      label: "New password",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "Confirm new password",
      autoComplete: "new-password",
    },
  ] as const

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Change password</CardTitle>
        </div>
        <CardDescription>
          Use your current password to set a new password for this account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                type="password"
                autoComplete={field.autoComplete}
                aria-invalid={!!errors[field.name]}
                disabled={isChangingPassword}
                {...register(field.name)}
              />
              {errors[field.name]?.message && (
                <p className="text-xs text-destructive" role="alert">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}

          <Alert>
            <ShieldCheck className="size-4" />
            <AlertTitle>Account security</AlertTitle>
            <AlertDescription>
              After a successful password change, all existing refresh
              sessions are revoked.
            </AlertDescription>
          </Alert>

          {isValid && (
            <div className="flex justify-end">
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating..." : "Update password"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
