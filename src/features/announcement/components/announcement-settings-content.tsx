"use client"

import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Megaphone, RefreshCw, Save } from "lucide-react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layout/page-container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/utils/error"

import {
  useGetAnnouncementSettingsQuery,
  useUpdateAnnouncementSettingsMutation,
} from "../api/announcement-settings.api"

interface AnnouncementFormValues {
  message: string
  isActive: boolean
}

const breadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Features", href: "/dashboard/features" },
  { label: "Announcement" },
]

export function AnnouncementSettingsContent() {
  const permission = usePermission()
  const canRead = permission.has(Permission.SETTING_READ)
  const canUpdate = permission.has(Permission.SETTING_UPDATE)
  const { data, isLoading, isFetching, error, refetch } =
    useGetAnnouncementSettingsQuery(undefined, { skip: !canRead })
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateAnnouncementSettingsMutation()

  const form = useForm<AnnouncementFormValues>({
    defaultValues: { message: "", isActive: true },
  })
  const message = useWatch({ control: form.control, name: "message" })
  const isActive = useWatch({ control: form.control, name: "isActive" })

  useEffect(() => {
    if (!data) return
    form.reset({ message: data.message, isActive: data.isActive })
  }, [data, form])

  async function onSubmit(values: AnnouncementFormValues) {
    try {
      const saved = await updateSettings({
        message: values.message.trim(),
        isActive: values.isActive,
      }).unwrap()
      form.reset({ message: saved.message, isActive: saved.isActive })
      toast.success("Announcement settings saved")
    } catch (saveError) {
      toast.error(getErrorMessage(saveError) || "Unable to save announcement")
    }
  }

  return (
    <PageContainer
      access={canRead}
      accessFallback={<UnauthorizedContent />}
      title="Announcement Settings"
      breadcrumbs={breadcrumbs}
      pageHeaderAction={
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          Refresh
        </Button>
      }
    >
      <div className="mx-auto w-full max-w-4xl space-y-6 pb-8">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load announcement settings</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
              <span>Announcement settings are temporarily unavailable.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : isLoading || !data ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </CardHeader>
            <CardContent className="space-y-5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Card>
              <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary ring-1 ring-primary/10 sm:size-11">
                  <Megaphone className="size-4 sm:size-5" />
                </span>
                <div className="min-w-0">
                  <CardTitle className="line-clamp-1">
                    Announcement message
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    Keep it concise so it remains readable on mobile screens.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="announcement-message">Message</Label>
                  <Textarea
                    id="announcement-message"
                    maxLength={180}
                    placeholder="e.g. Free delivery on orders over $50"
                    disabled={!canUpdate || isSaving}
                    required
                    {...form.register("message", {
                      required: true,
                      maxLength: 180,
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {message.length}/180 characters
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-sm border p-4">
                  <div className="space-y-1">
                    <Label htmlFor="announcement-active">
                      Show announcement
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Turn this off to hide the announcement bar from visitors.
                    </p>
                  </div>
                  <Switch
                    id="announcement-active"
                    checked={isActive}
                    onCheckedChange={(checked) =>
                      form.setValue("isActive", checked, { shouldDirty: true })
                    }
                    disabled={!canUpdate || isSaving}
                  />
                </div>
              </CardContent>

              {canUpdate && (
                <CardFooter className="flex justify-end p-3">
                  <Button
                    type="submit"
                    disabled={
                      isSaving ||
                      isFetching ||
                      !message.trim() ||
                      !form.formState.isDirty
                    }
                  >
                    <Save className="size-4" />
                    {isSaving ? "Saving..." : "Save announcement"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </form>
        )}
      </div>
    </PageContainer>
  )
}
