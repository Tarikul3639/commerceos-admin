import { type ReactNode } from "react"

import { type ReactTable, type RowData } from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import type { DataTableFeatures } from "./data-table-features"
import { DataTableColumnVisibility } from "./data-table-column-visibility"
import { DataTableSearch } from "./data-table-search"

interface DataTableToolbarProps<TData extends RowData> {
  /** TanStack Table instance. */
  table: ReactTable<DataTableFeatures, TData>

  /** Table title displayed on the left side. */
  title: string

  /** Optional table description. */
  description?: string

  /** Search configuration. */
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
  }

  /** Shows or hides the column visibility button. */
  columnVisibility?: boolean

  /** Custom actions displayed after the fixed controls. */
  actions?: ReactNode

  /** Additional classes for the toolbar container. */
  className?: string
}

/** Renders the reusable table toolbar. */
export function DataTableToolbar<TData extends RowData>({
  table,
  title,
  description,
  search,
  columnVisibility = false,
  actions,
  className,
}: DataTableToolbarProps<TData>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b bg-card p-4",
        "sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      {/* Table information */}
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-foreground">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Table controls */}
      {(actions || search || columnVisibility) && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          {search && (
            <DataTableSearch
              value={search.value}
              onChange={search.onChange}
              placeholder={search.placeholder}
              className={search.className}
            />
          )}

          {/* Column visibility */}
          {columnVisibility && (
            <DataTableColumnVisibility table={table} />
          )}

          {/* Custom actions */}
          {actions}
        </div>
      )}
    </div>
  )
}