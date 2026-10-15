"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
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

export function SizeGuideForm({
  sizeGuide,
  onSubmit,
  onCancel,
  submitLabel = "Save",
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
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SizeGuideFormValues>({
    resolver: zodResolver(sizeGuideSchema),
    defaultValues: {
      name: sizeGuide?.name ?? "",
      description: sizeGuide?.description ?? "",
      unit: sizeGuide?.unit ?? "cm",
    },
  })

  const unit = watch("unit")

  const addColumn = () => {
    let index = columns.length + 1
    let name = `Column ${index}`

    while (columns.includes(name)) {
      name = `Column ${++index}`
    }

    setColumns((current) => [...current, name])
    setRows((current) => current.map((row) => ({ ...row, [name]: "" })))
    setTableError(null)
  }

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

  const addRow = () => {
    setRows((current) => [
      ...current,
      Object.fromEntries(columns.map((column) => [column, ""])),
    ])
  }

  const removeRow = (index: number) => {
    if (rows.length <= 1) return

    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))
  }

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

  const updateCell = (rowIndex: number, column: string, value: string) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex ? { ...row, [column]: value } : row
      )
    )
  }

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
    <form
      onSubmit={handleSubmit(submit)}
      className="flex min-h-0 flex-col gap-4"
    >
      {/* Basic information */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_110px]">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="size-guide-name">Name</FieldLabel>
          <Input
            id="size-guide-name"
            {...register("name")}
            placeholder="Panjabi"
            disabled={isLoading}
          />
          {errors.name && <FieldError errors={[errors.name]} />}
        </Field>

        <Field data-invalid={!!errors.unit}>
          <FieldLabel>Unit</FieldLabel>
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
              <SelectItem value="cm">cm</SelectItem>
              <SelectItem value="in">in</SelectItem>
            </SelectContent>
          </Select>
          {errors.unit && <FieldError errors={[errors.unit]} />}
        </Field>
      </div>

      <Field data-invalid={!!errors.description}>
        <FieldLabel htmlFor="size-guide-description">Description</FieldLabel>
        <Textarea
          id="size-guide-description"
          {...register("description")}
          placeholder="Men's panjabi size guide"
          rows={2}
          className="resize-y"
          disabled={isLoading}
        />
        {errors.description && <FieldError errors={[errors.description]} />}
      </Field>

      {/* Measurements */}
      <Field>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <FieldLabel>Measurements</FieldLabel>
            <FieldDescription>
              Define columns and enter measurements for each size.
            </FieldDescription>
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
            Column
          </Button>
        </div>

        <div className="w-full max-w-full overflow-x-auto rounded-md border">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead className="bg-muted">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={`column-${index}`}
                    className="min-w-28 border-b p-2 text-left font-medium"
                  >
                    <div className="flex items-center gap-1">
                      <Input
                        value={column}
                        onChange={(event) =>
                          updateColumn(index, event.target.value)
                        }
                        aria-label={`Column ${index + 1} name`}
                        className="h-8 min-w-0 flex-1 bg-background px-2"
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

                <th className="w-10 border-b p-2" />
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b last:border-0">
                  {columns.map((column, columnIndex) => (
                    <td key={`cell-${rowIndex}-${columnIndex}`} className="p-2">
                      <Input
                        value={String(row[column] ?? "")}
                        onChange={(event) =>
                          updateCell(rowIndex, column, event.target.value)
                        }
                        placeholder="—"
                        aria-label={`Row ${rowIndex + 1}, ${column}`}
                        className="h-8 min-w-0"
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

        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={isLoading}
          >
            <Plus className="size-4" />
            Add size
          </Button>
        </div>
      </Field>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
