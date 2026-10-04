import { Controller, type Control } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { BannerFormValues } from "../../schemas/banner.schema"

interface BannerLinkSectionProps {
  control: Control<BannerFormValues>
}

export function BannerLinkSection({ control }: BannerLinkSectionProps) {
  return (
    <>
      <Controller
        name="link"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="banner-link">Link</FieldLabel>
            <Input {...field} id="banner-link" placeholder="e.g. https://commerceos.com/products" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="buttonText"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="banner-button-text">Button text</FieldLabel>
            <Input {...field} id="banner-button-text" placeholder="Shop now" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  )
}
