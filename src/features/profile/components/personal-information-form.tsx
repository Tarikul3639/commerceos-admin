"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { UserRound } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useUpdateCurrentUserProfileMutation } from "@/features/auth/auth.api"
import type {
  CurrentUserResponse,
  UpdateCurrentUserProfileRequest,
} from "@/features/auth/auth.types"
import { UserAvatarUpload } from "@/features/users/components/user-avatar-upload"
import { getErrorMessage } from "@/lib/utils/error"
import { useAppDispatch } from "@/store/hooks"
import { setUser } from "@/store/slices/auth.slice"

import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profile.schema"

interface PersonalInformationFormProps {
  user: CurrentUserResponse
}

export function PersonalInformationForm({
  user,
}: PersonalInformationFormProps) {
  const dispatch = useAppDispatch()
  const [updateProfile, { isLoading: isSavingProfile }] =
    useUpdateCurrentUserProfileMutation()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      avatar: user.avatar,
      publicId: user.publicId,
    },
  })

  const profileAvatar = useWatch({
    control,
    name: "avatar",
  })

  useEffect(() => {
    reset({
      name: user.name,
      phone: user.phone ?? "",
      avatar: user.avatar,
      publicId: user.publicId,
    })
  }, [user, reset])

  async function onSubmit(values: ProfileFormValues) {
    const payload: UpdateCurrentUserProfileRequest = {
      name: values.name.trim(),
      phone: values.phone.trim() || null,
      avatar: values.avatar,
      publicId: values.publicId,
    }

    try {
      const response = await updateProfile(payload).unwrap()
      dispatch(setUser(response.data))
      reset({
        name: response.data.name,
        phone: response.data.phone ?? "",
        avatar: response.data.avatar,
        publicId: response.data.publicId,
      })
      toast.success("Profile updated successfully")
    } catch (submitError) {
      toast.error(getErrorMessage(submitError) || "Unable to update profile")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserRound className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Personal information</CardTitle>
        </div>
        <CardDescription>
          Update your name, contact number and profile photo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <UserAvatarUpload
            value={profileAvatar ?? ""}
            disabled={isSavingProfile}
            onChange={({ url, publicId }) => {
              setValue("avatar", url || null, {
                shouldDirty: true,
                shouldValidate: true,
              })
              setValue("publicId", publicId || null, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }}
          />

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="profile-name">Full name <span className="text-destructive">*</span></Label>
            <Input
              id="profile-name"
              placeholder="Enter your full name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              disabled={isSavingProfile}
              {...register("name")}
            />
            {errors.name?.message && (
              <p className="text-xs text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">Email address</Label>
            <Input id="profile-email" value={user.email} disabled readOnly />
            <p className="text-xs text-muted-foreground">
              Contact an administrator if your login email needs to change.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-phone">Phone number</Label>
            <Input
              id="profile-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+8801712345678"
              aria-invalid={!!errors.phone}
              disabled={isSavingProfile}
              {...register("phone")}
            />
            {errors.phone?.message && (
              <p className="text-xs text-destructive" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isDirty || isSavingProfile}>
              {isSavingProfile ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
