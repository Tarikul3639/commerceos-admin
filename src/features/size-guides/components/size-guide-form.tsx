"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Ruler, Table2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  sizeGuideSchema,
  type SizeGuideFormValues,
} from "../schemas/size-guide.schema"
import type { SizeGuide, SizeGuideRow } from "../types/size-guide.types"

interface SizeGuideFormProps {
  sizeGuide?: SizeGuide
  onSubmit: (data: SizeGuideFormValues) => void | Promise<void>
  onCancel: () => void
  submitLabel?: string
  isLoading?: boolean
}

const defaultColumns = ["Size", "Chest", "Length"]

/** Shared, responsive form for creating and editing size guides. */
export function SizeGuideForm({
  sizeGuide,
  onSubmit,
  onCancel,
  isLoading = false,
}: SizeGuideFormProps) {
  const [tableError, setTableError] = useState<string | null>(null)
  const [columns, setColumns] = useState<string[]>(
    sizeGuide?.columns ?? [...defaultColumns]
  )
  const [rows, setRows] = useState<SizeGuideRow[]>(
    sizeGuide?.rows ?? [
      Object.fromEntries(defaultColumns.map((column) => [column, ""])),
    ]
  )
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SizeGuideFormValues>({
    resolver: zodResolver(sizeGuideSchema),
    defaultValues: {
      name: sizeGuide?.name ?? "",
      description: sizeGuide?.description ?? "",
      unit: sizeGuide?.unit ?? "cm",
    },
  })
  const unit = useWatch({ control, name: "unit" })
  const hasChanges =
    isDirty ||
    JSON.stringify(columns) !==
      JSON.stringify(sizeGuide?.columns ?? defaultColumns) ||
    JSON.stringify(rows) !==
      JSON.stringify(
        sizeGuide?.rows ?? [
          Object.fromEntries(defaultColumns.map((column) => [column, ""])),
        ]
      )

  /** Adds a uniquely named measurement column to the chart. */
  const addColumn = () => {
    let index = columns.length + 1
    let name = `Column ${index}`
    while (columns.includes(name)) name = `Column ${++index}`

    setColumns((current) => [...current, name])
    setRows((current) => current.map((row) => ({ ...row, [name]: "" })))
    setTableError(null)
  }

  /** Removes a measurement column and its values from every size row. */
  const removeColumn = (index: number) => {
    if (columns.length <= 1) return
    const columnToRemove = columns[index]
    setColumns((current) =>
      current.filter((_, columnIndex) => columnIndex !== index)
    )
    setRows((current) =>
      current.map((row) => {
        const nextRow = { ...row }
        delete nextRow[columnToRemove]
        return nextRow
      })
    )
    setTableError(null)
  }

  /** Adds an empty size row using the current measurement columns. */
  const addRow = () => {
    setRows((current) => [
      ...current,
      Object.fromEntries(columns.map((column) => [column, ""])),
    ])
  }

  /** Removes a size row while preserving at least one editable row. */
  const removeRow = (index: number) => {
    if (rows.length <= 1) return
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))
  }

  /** Renames a column while retaining the values already entered in it. */
  const updateColumn = (index: number, value: string) => {
    const oldName = columns[index]
    setColumns((current) =>
      current.map((column, columnIndex) =>
        columnIndex === index ? value : column
      )
    )
    if (oldName !== value) {
      setRows((current) =>
        current.map((row) => {
          const nextRow = { ...row }
          const oldValue = nextRow[oldName] ?? ""
          delete nextRow[oldName]
          nextRow[value] = oldValue
          return nextRow
        })
      )
    }
    setTableError(null)
  }

  /** Updates one measurement cell in the selected size row. */
  const updateCell = (rowIndex: number, column: string, value: string) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex ? { ...row, [column]: value } : row
      )
    )
  }

  /** Validates and normalizes the dynamic measurement chart before saving. */
  const submit = async (values: SizeGuideFormValues) => {
    const normalizedColumns = columns.map((column) => column.trim())
    if (normalizedColumns.some((column) => !column)) {
      setTableError("Column names cannot be empty.")
      return
    }

    const uniqueNames = new Set(
      normalizedColumns.map((column) => column.toLowerCase())
    )
    if (uniqueNames.size !== normalizedColumns.length) {
      setTableError("Column names must be unique.")
      return
    }

    const normalizedRows = rows.map((row) =>
      Object.fromEntries(
        normalizedColumns.map((column, index) => [
          column,
          row[columns[index]] ?? "",
        ])
      )
    )
    const parsed = sizeGuideSchema.safeParse({
      ...values,
      columns: normalizedColumns,
      rows: normalizedRows,
    })

    if (!parsed.success) {
      setTableError(
        parsed.error.issues[0]?.message ?? "Complete the measurement table."
      )
      return
    }

    setTableError(null)
    await onSubmit(parsed.data)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full min-w-0 space-y-6">
      <section className="min-w-0 rounded-xl border bg-card">
        <div className="flex items-center gap-3 border-b px-5 py-4 sm:px-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Ruler className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold">Guide information</h3>
            <p className="text-sm text-muted-foreground">
              Set a recognizable name and measurement unit.
            </p>
          </div>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_250px] sm:p-6">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="size-guide-name">Size guide name <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="size-guide-name"
              {...register("name")}
              placeholder="e.g. Men's Panjabi"
              disabled={isLoading}
            />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>
          <Field data-invalid={!!errors.unit}>
            <FieldLabel>Unit <span className="text-destructive">*</span></FieldLabel>
            <Select
              value={unit}
              onValueChange={(value) =>
                setValue("unit", value as "cm" | "in", {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">Centimeters (cm)</SelectItem>
                <SelectItem value="in">Inches (in)</SelectItem>
              </SelectContent>
            </Select>
            {errors.unit && <FieldError errors={[errors.unit]} />}
          </Field>
          <Field className="sm:col-span-2" data-invalid={!!errors.description}>
            <FieldLabel htmlFor="size-guide-description">
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
            </FieldLabel>
            <Textarea
              id="size-guide-description"
              {...register("description")}
              placeholder="Add guidance to help customers choose the right size."
              rows={3}
              className="resize-y"
              disabled={isLoading}
            />
            {errors.description && <FieldError errors={[errors.description]} />}
          </Field>
        </div>
      </section>

      <section className="min-w-0 rounded-xl border bg-card">
        <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Table2 className="size-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold">Measurement chart</h3>
              <p className="text-sm text-muted-foreground">
                Each row represents a size; columns represent measurements.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={addColumn}
            disabled={isLoading}
          >
            <Plus className="size-4" />
            Add column
          </Button>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="w-full max-w-full overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead className="bg-muted/70">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={`column-${index}`}
                      className="min-w-32 border-b p-2 text-left font-medium"
                    >
                      <div className="flex items-center gap-1">
                        <Input
                          value={column}
                          onChange={(event) =>
                            updateColumn(index, event.target.value)
                          }
                          aria-label={`Column ${index + 1} name`}
                          className="h-9 min-w-0 flex-1 bg-background px-2"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          aria-label={`Remove column ${index + 1}`}
                          onClick={() => removeColumn(index)}
                          disabled={columns.length <= 1 || isLoading}
                        >
                          <Trash2 className="size-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </th>
                  ))}
                  <th className="w-11 border-b p-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b last:border-0">
                    {columns.map((column, columnIndex) => (
                      <td
                        key={`cell-${rowIndex}-${columnIndex}`}
                        className="p-2"
                      >
                        <Input
                          value={String(row[column] ?? "")}
                          onChange={(event) =>
                            updateCell(rowIndex, column, event.target.value)
                          }
                          placeholder={columnIndex === 0 ? "e.g. M" : "—"}
                          aria-label={`Row ${rowIndex + 1}, ${column}`}
                          className="h-9 min-w-0"
                          disabled={isLoading}
                        />
                      </td>
                    ))}
                    <td className="p-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={`Remove row ${rowIndex + 1}`}
                        onClick={() => removeRow(rowIndex)}
                        disabled={rows.length <= 1 || isLoading}
                      >
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {errors.columns && <FieldError errors={[errors.columns]} />}
          {errors.rows && <FieldError errors={[errors.rows]} />}
          {tableError && (
            <p className="text-sm font-medium text-destructive">{tableError}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {rows.length} size{rows.length === 1 ? "" : "s"} ·{" "}
              {columns.length} measurement columns · {unit}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRow}
              disabled={isLoading}
            >
              <Plus className="size-4" />
              Add size row
            </Button>
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 z-10 flex flex-row justify-end gap-2 border-t bg-background/95 py-4 backdrop-blur">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || (!!sizeGuide && !hasChanges)}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
