"use client"

import { CircleAlert, type LucideIcon } from "lucide-react"

import { TableCell, TableRow } from "@/components/ui/table"

interface DataTableErrorProps {
  /** Number of columns the error state should span. */
  colSpan: number

  /** Error object from the data fetching operation. */
  error?: unknown

  /** Error state message. */
  errorText?: string

  /** Error state icon component. */
  errorIcon?: LucideIcon
}

function getErrorMessage(error: unknown): string | undefined {
  if (!error) {
    return undefined
  }

  if (typeof error === "string") {
    return error
  }

  if (typeof error === "object" && error !== null) {
    const data = "data" in error ? error.data : undefined

    if (typeof data === "object" && data !== null && "message" in data) {
      const message = data.message

      if (typeof message === "string") {
        return message
      }

      if (Array.isArray(message)) {
        return message.join(", ")
      }
    }

    if ("message" in error && typeof error.message === "string") {
      return error.message
    }
  }

  return undefined
}

/** Renders an error table state. */
export function DataTableError({
  colSpan,
  error,
  errorText = "Failed to load data.",
  errorIcon: ErrorIcon = CircleAlert,
}: DataTableErrorProps) {
  const message = getErrorMessage(error) ?? errorText

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="p-0">
        <div className="flex min-h-45 flex-col items-center justify-center gap-2 text-muted-foreground sm:min-h-64">
          <ErrorIcon className="size-8" />

          <p className="text-sm">{message}</p>
        </div>
      </TableCell>
    </TableRow>
  )
}
