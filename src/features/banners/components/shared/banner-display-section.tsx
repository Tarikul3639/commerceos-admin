import { Controller, type Control } from "react-hook-form"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import type { BannerFormValues } from "../../schemas/banner.schema"

interface BannerDisplaySectionProps {
  control: Control<BannerFormValues>
}

export function BannerDisplaySection({ control }: BannerDisplaySectionProps) {
  return (
    <>
      <Controller
        name="openInNewTab"
        control={control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <div className="flex-1">
              <FieldLabel htmlFor="banner-new-tab">
                Open link in new tab
              </FieldLabel>
              <FieldDescription>
                Open the banner destination in a new tab.
              </FieldDescription>
            </div>
            <Switch
              id="banner-new-tab"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </Field>
        )}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <div className="flex-1">
              <FieldLabel htmlFor="banner-active">Active</FieldLabel>
              <FieldDescription>
                Inactive banners are hidden from the storefront.
              </FieldDescription>
            </div>
            <Switch
              id="banner-active"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </Field>
        )}
      />
    </>
  )
}
