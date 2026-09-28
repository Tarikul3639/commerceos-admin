import { type LucideIcon } from "lucide-react"

import { type RowData, type ReactTable } from "@tanstack/react-table"

import { TableBody, TableCell, TableRow } from "@/components/ui/table"

import type { DataTableFeatures } from "./data-table-features"

import { DataTableError } from "./data-table-error"
import { DataTableEmpty } from "./data-table-empty"
import { DataTableSkeleton } from "./data-table-skeleton"

interface DataTableBodyProps<TData extends RowData> {
  /** TanStack Table instance. */
  table: ReactTable<DataTableFeatures, TData>

  /** Indicates the initial data loading state. */
  isLoading: boolean

  /** Indicates that an error occurred while fetching data. */
  isError?: boolean

  /** Error object from the data fetching operation. */
  error?: unknown

  /** Number of columns in the table. */
  columnCount: number

  /** Number of skeleton rows. */
  skeletonRows: number

  /** Empty state message. */
  emptyText?: string

  /** Empty state icon. */
  emptyIcon?: LucideIcon
}

/** Renders the table body. */
export function DataTableBody<TData extends RowData>({
  table,
  isLoading,

  isError,
  error,

  columnCount,
  skeletonRows,

  emptyText,
  emptyIcon,
}: DataTableBodyProps<TData>) {
  return (
    <TableBody>
      {isLoading ? (
        <DataTableSkeleton rows={skeletonRows} columns={columnCount} />
      ) : isError ? (
        <DataTableError colSpan={columnCount} error={error} />
      ) : table.getRowModel().rows.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            className="transition-colors hover:bg-muted/40"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                style={{ width: `${cell.column.getSize()}px` }}
                className="min-w-0 overflow-hidden px-4 py-3 align-middle"
              >
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <DataTableEmpty
          colSpan={columnCount}
          emptyText={emptyText}
          emptyIcon={emptyIcon}
        />
      )}
    </TableBody>
  )
}
