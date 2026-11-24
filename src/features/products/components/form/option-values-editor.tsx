"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Palette, Plus, X } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ProductOptionValue } from "../../types/product-option.types"

type Props = {
  values: ProductOptionValue[]
  colorOption: boolean
  disabled: boolean
  onChange: (values: ProductOptionValue[]) => void
  error?: string
}

export function OptionValuesEditor({
  values,
  colorOption,
  disabled,
  onChange,
  error,
}: Props) {
  const [newValue, setNewValue] = useState("")
  const [newColorCode, setNewColorCode] = useState("#000000")

  const addValue = () => {
    const label = newValue.trim()
    if (!label) {
      toast.error("Enter an option value first")
      return
    }

    if (
      values.some(
        (value) => value.label.trim().toLowerCase() === label.toLowerCase()
      )
    ) {
      toast.error("This value already exists")
      return
    }

    onChange([
      ...values,
      {
        id: uuidv4(),
        label,
        ...(colorOption ? { colorCode: newColorCode } : {}),
      },
    ])
    setNewValue("")
  }

  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel>Values</FieldLabel>
        <span className="text-xs text-muted-foreground">
          {values.length} added
        </span>
      </div>

      <div className="flex min-h-20 flex-wrap content-start gap-2 rounded-lg border bg-muted/10 p-3">
        {values.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add the available values for this option.
          </p>
        ) : (
          values.map((value) => (
            <Badge
              key={value.id}
              variant="outline"
              className="h-8 gap-2 rounded-full bg-background px-2.5 font-normal"
            >
              {value.colorCode && (
                <span
                  className="size-4 shrink-0 rounded-full border"
                  style={{ backgroundColor: value.colorCode }}
                />
              )}
              {value.label}
              <button
                type="button"
                aria-label={`Remove ${value.label}`}
                disabled={disabled}
                onClick={() =>
                  onChange(values.filter((item) => item.id !== value.id))
                }
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap items-center gap-2">
        {colorOption && (
          <>
            <label
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border bg-background"
              title="Choose color"
            >
              <input
                type="color"
                aria-label="Choose option color"
                value={newColorCode}
                disabled={disabled}
                onChange={(event) => setNewColorCode(event.target.value)}
                className="size-7 cursor-pointer border-0 bg-transparent p-0"
              />
            </label>
            <Input
              aria-label="HEX color code"
              value={newColorCode}
              onChange={(event) => setNewColorCode(event.target.value)}
              placeholder="#000000"
              className="w-28"
              disabled={disabled}
            />
          </>
        )}

        <Input
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addValue()
            }
          }}
          placeholder={
            colorOption ? "e.g. Black, Navy" : "e.g. S, M, 128GB, 23"
          }
          className="min-w-0 flex-1"
          disabled={disabled}
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addValue}
          disabled={disabled || !newValue.trim()}
          aria-label="Add value"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {colorOption && (
        <FieldDescription className="flex items-center gap-1">
          <Palette className="size-3.5" />
          Choose a color or enter its HEX code for each value.
        </FieldDescription>
      )}
    </Field>
  )
}
