"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldError, FieldGroup } from "@/components/ui/field"

import { BannerPosition, BannerType } from "../../types/banners.types"
import {
  bannerSchema,
  type BannerFormValues,
} from "../../schemas/banner.schema"
import type { Banner } from "../../types/banners.types"

import { BannerBasicSection } from "./banner-basic-section"
import { BannerDisplaySection } from "./banner-display-section"
import { BannerLinkSection } from "./banner-link-section"
import { BannerMediaSection } from "./banner-media-section"
import { BannerScheduleSection } from "./banner-schedule-section"

interface BannerFormProps {
  banner?: Banner
  onSubmit: (values: BannerFormValues) => void | Promise<void>
  onCancel: () => void
  submitLabel: string
  isLoading?: boolean
}

/** Convert API timestamps into values accepted by datetime-local inputs. */
function toDateTimeInput(value: string | null | undefined) {
  if (!value) return ""
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16)
}

/** Shared create/update form for desktop and optional mobile banner media. */
export function BannerForm({
  banner,
  onSubmit,
  onCancel,
  submitLabel,
  isLoading = false,
}: BannerFormProps) {
  const [isMediaUploading, setIsMediaUploading] = useState(false)
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title ?? "",
      imageUrl: banner?.imageUrl ?? "",
      imagePublicId: banner?.imagePublicId ?? "",
      mobileImageUrl: banner?.mobileImageUrl ?? "",
      mobileImagePublicId: banner?.mobileImagePublicId ?? "",
      type: banner?.type ?? BannerType.PROMOTION,
      position: banner?.position ?? BannerPosition.HOME_TOP,
      link: banner?.link ?? "",
      openInNewTab: banner?.openInNewTab ?? false,
      sortOrder: String(banner?.sortOrder ?? 0),
      isActive: banner?.isActive ?? true,
      startAt: toDateTimeInput(banner?.startAt),
      endAt: toDateTimeInput(banner?.endAt),
    },
  })

  const { isDirty } = form.formState
  const desktopImageUrl = useWatch({ control: form.control, name: "imageUrl" })

  useEffect(() => {
    form.reset({
      title: banner?.title ?? "",
      imageUrl: banner?.imageUrl ?? "",
      imagePublicId: banner?.imagePublicId ?? "",
      mobileImageUrl: banner?.mobileImageUrl ?? "",
      mobileImagePublicId: banner?.mobileImagePublicId ?? "",
      type: banner?.type ?? BannerType.PROMOTION,
      position: banner?.position ?? BannerPosition.HOME_TOP,
      link: banner?.link ?? "",
      openInNewTab: banner?.openInNewTab ?? false,
      sortOrder: String(banner?.sortOrder ?? 0),
      isActive: banner?.isActive ?? true,
      startAt: toDateTimeInput(banner?.startAt),
      endAt: toDateTimeInput(banner?.endAt),
    })
  }, [banner, form])

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-5xl space-y-5"
    >
      <Card>
        <CardHeader>
          <CardTitle>Banner Images</CardTitle>
          <CardDescription>
            Upload one desktop image and an optional phone image. The storefront switches images by screen size.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BannerMediaSection
            form={form}
            onUploadingChange={setIsMediaUploading}
          />
          {form.formState.errors.imageUrl?.message && (
            <FieldError className="mt-3">
              {form.formState.errors.imageUrl.message}
            </FieldError>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
          <CardDescription>
            Configure the banner title, type, position, link, schedule, and display settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <BannerBasicSection control={form.control} />
            <BannerLinkSection control={form.control} />
            <BannerScheduleSection control={form.control} />
            <BannerDisplaySection control={form.control} />
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || isMediaUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isLoading ||
            isMediaUploading ||
            !desktopImageUrl ||
            (Boolean(banner) && !isDirty)
          }
        >
          {isLoading
            ? "Saving..."
            : isMediaUploading
              ? "Uploading..."
              : submitLabel}
        </Button>
      </div>
    </form>
  )
}
