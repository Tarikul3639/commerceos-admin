import { Controller, type Control } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { BannerFormValues } from "../../schemas/banner.schema"

interface BannerScheduleSectionProps {
  control: Control<BannerFormValues>
}

export function BannerScheduleSection({ control }: BannerScheduleSectionProps) {
  return (
    <>
      <Controller
        name="sortOrder"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="banner-sort-order">Sort order</FieldLabel>
            <Input
              {...field}
              id="banner-sort-order"
              type="number"
              min="0"
              step="1"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="startAt"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="banner-start-at">Start date</FieldLabel>
              <Input {...field} id="banner-start-at" type="datetime-local" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="endAt"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="banner-end-at">End date</FieldLabel>
              <Input {...field} id="banner-end-at" type="datetime-local" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </>
  )
}
