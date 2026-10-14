"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  const [columns, setColumns] = useState(sizeGuide?.columns ?? defaultColumns)
  const [rows, setRows] = useState<SizeGuideRow[]>(
    sizeGuide?.rows ?? [Object.fromEntries(defaultColumns.map((column) => [column, ""]))],
  )
  const { register, handleSubmit, formState: { errors } } =
    useForm<SizeGuideFormValues>({
      resolver: zodResolver(sizeGuideSchema),
      defaultValues: {
        name: sizeGuide?.name ?? "",
        description: sizeGuide?.description ?? "",
        unit: sizeGuide?.unit ?? "cm",
      },
    })

  useEffect(() => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        Object.fromEntries(columns.map((column) => [column, row[column] ?? ""])),
      ),
    )
  }, [columns])

  const addColumn = () => {
    let index = columns.length + 1
    let name = `Column ${index}`
    while (columns.includes(name)) name = `Column ${++index}`
    setColumns([...columns, name])
  }

  const removeColumn = (index: number) => {
    if (columns.length === 1) return
    setColumns(columns.filter((_, columnIndex) => columnIndex !== index))
  }

  const addRow = () =>
    setRows([...rows, Object.fromEntries(columns.map((column) => [column, ""]))])

  const removeRow = (index: number) => {
    if (rows.length === 1) return
    setRows(rows.filter((_, rowIndex) => rowIndex !== index))
  }

  const updateColumn = (index: number, value: string) => {
    const next = [...columns]
    next[index] = value
    setColumns(next)
  }

  const updateCell = (rowIndex: number, column: string, value: string) => {
    setRows((currentRows) =>
      currentRows.map((row, index) =>
        index === rowIndex ? { ...row, [column]: value } : row,
      ),
    )
  }

  const submit = async (values: Omit<SizeGuideFormValues, "columns" | "rows">) => {
    const normalizedColumns = columns.map((column) => column.trim())
    const parsed = sizeGuideSchema.safeParse({
      ...values,
      columns: normalizedColumns,
      rows: rows.map((row) =>
        Object.fromEntries(
          normalizedColumns.map((column, index) => [
            column,
            row[columns[index]] ?? "",
          ]),
        ),
      ),
    })
    if (!parsed.success) {
      setTableError(parsed.error.issues[0]?.message ?? "Complete the measurement table.")
      return
    }
    if (new Set(normalizedColumns).size !== normalizedColumns.length) {
      setTableError("Column names must be unique.")
      return
    }
    setTableError(null)
    await onSubmit(parsed.data)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <Field data-invalid={!!errors.name}>
          <FieldLabel>Name</FieldLabel>
          <Input {...register("name")} placeholder="Panjabi" disabled={isLoading} />
          {errors.name && <FieldError errors={[errors.name]} />}
        </Field>
        <Field data-invalid={!!errors.unit}>
          <FieldLabel>Unit</FieldLabel>
          <Input {...register("unit")} placeholder="cm" disabled={isLoading} />
          {errors.unit && <FieldError errors={[errors.unit]} />}
        </Field>
      </div>

      <Field data-invalid={!!errors.description}>
        <FieldLabel>Description</FieldLabel>
        <Textarea
          {...register("description")}
          placeholder="Men's panjabi size guide"
          rows={2}
          disabled={isLoading}
        />
        {errors.description && <FieldError errors={[errors.description]} />}
      </Field>

      <Field data-invalid={!!errors.columns}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <FieldLabel>Measurements</FieldLabel>
            <FieldDescription>Define the columns and enter values for each size.</FieldDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addColumn} disabled={isLoading}>
            <Plus className="size-4" /> Column
          </Button>
        </div>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b">
                {columns.map((column, index) => (
                  <th key={`${column}-${index}`} className="p-2 text-left font-medium">
                    <div className="flex items-center gap-1">
                      <Input
                        value={column}
                        onChange={(event) => updateColumn(index, event.target.value)}
                        className="h-8 min-w-24"
                        disabled={isLoading}
                        aria-label={`Column ${index + 1} name`}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeColumn(index)} disabled={columns.length === 1 || isLoading}>
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </th>
                ))}
                <th className="w-10 p-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b last:border-0">
                  {columns.map((column) => (
                    <td key={column} className="p-2">
                      <Input
                        value={String(row[column] ?? "")}
                        onChange={(event) => updateCell(rowIndex, column, event.target.value)}
                        placeholder="—"
                        disabled={isLoading}
                      />
                    </td>
                  ))}
                  <td className="p-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(rowIndex)} disabled={rows.length === 1 || isLoading}>
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
        {tableError && <p className="text-sm font-medium text-destructive">{tableError}</p>}
        <Button type="button" variant="outline" size="sm" onClick={addRow} disabled={isLoading}>
          <Plus className="size-4" /> Add size
        </Button>
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? `${submitLabel}ing...` : submitLabel}
        </Button>
      </div>
    </form>
  )
}
