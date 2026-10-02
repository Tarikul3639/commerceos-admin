import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  type ColumnDef,
  type ColumnVisibilityState,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  useTable,
} from "@tanstack/react-table"

import { Table } from "@/components/ui/table"

import { features, type DataTableFeatures } from "./data-table-features"
import { DataTableBody } from "./data-table-body"
import { DataTableHeader } from "./data-table-header"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData extends RowData> {
  /** Optional className for the table container. */
  className?: string

  /** Defines the table columns. */
  columns: ColumnDef<DataTableFeatures, TData>[]

  /** Contains the table data. */
  data: TData[]

  /** Optional table title. */
  title?: string

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

  /** Custom toolbar actions. */
  toolbarActions?: React.ReactNode

  /** Custom toolbar filters. */
  toolbarFilters?: React.ReactNode

  /** Toolbar className. */
  toolbarClassName?: string

  /** Optional controlled pagination state. */
  pagination?: PaginationState

  /** Optional controlled pagination updater. */
  onPaginationChange?: OnChangeFn<PaginationState>

  /** Enables server-side pagination. */
  manualPagination?: boolean

  /** Shows or hides the pagination. */
  showPagination?: boolean

  /** Total number of rows available on the server. */
  totalRows?: number

  /** Indicates the initial data loading state. */
  isLoading?: boolean

  /** Indicates that existing data is being refreshed. */
  isFetching?: boolean

  /** Indicates that an error occurred while fetching data. */
  isError?: boolean

  /** Error object from the data fetching operation. */
  error?: unknown

  /** Initial column visibility state. */
  initialColumnVisibility?: ColumnVisibilityState

  /** Empty state message. */
  emptyText?: string

  /** Empty state icon. */
  emptyIcon?: LucideIcon
}

/** Generic reusable data table component. */
export function DataTable<TData extends RowData>({
  className,
  columns,
  data,
  title = "Data Table",
  description,
  search,

  columnVisibility = false,
  initialColumnVisibility,

  toolbarFilters,
  toolbarActions,
  toolbarClassName,

  pagination: controlledPagination,
  onPaginationChange: controlledOnPaginationChange,
  totalRows,
  showPagination = true,
  manualPagination = false,

  isLoading = false,
  isFetching = false,

  isError = false,
  error,

  emptyText,
  emptyIcon,
}: DataTableProps<TData>) {
  // Internal pagination state for uncontrolled tables.
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: 10,
    }
  )

  // Uses controlled pagination when provided,
  // otherwise falls back to internal state.
  const pagination = controlledPagination ?? internalPagination

  const onPaginationChange =
    controlledOnPaginationChange ?? setInternalPagination

  // Creates the TanStack Table instance.
  const table = useTable({
    features,
    data,
    columns,

    state: {
      pagination,
      globalFilter: search?.value,
    },

    initialState: {
      columnVisibility: initialColumnVisibility,
    },

    columnResizeMode: "onChange",

    onPaginationChange,
    onGlobalFilterChange: search?.onChange,

    manualPagination,
    rowCount: manualPagination ? totalRows : undefined,
  })

  // Number of currently visible columns.
  const visibleColumnCount = table.getVisibleLeafColumns().length

  return (
    <div
      className={cn(
        "mt-3 flex h-full min-w-0 flex-col overflow-hidden rounded-lg bg-card shadow-sm ring ring-foreground/8",
        className
      )}
    >
      {/* Table Toolbar */}
      <DataTableToolbar
        table={table}
        title={title}
        description={description}
        search={search}
        className={toolbarClassName}
        columnVisibility={columnVisibility}
        actions={toolbarActions}
        filters={toolbarFilters}
      />

      {/* Table */}
      <div className="flex min-h-0 flex-1 flex-col overflow-x-auto">
        <Table
          className="h-full min-w-full table-fixed"
          style={{
            width: `${table.getTotalSize()}px`,
          }}
        >
          <DataTableHeader
            table={table}
            columnCount={visibleColumnCount}
            isFetching={isFetching && !isLoading}
          />

          <DataTableBody
            table={table}
            isLoading={isLoading}
            isError={isError}
            error={error}
            columnCount={visibleColumnCount}
            skeletonRows={pagination.pageSize}
            emptyText={emptyText}
            emptyIcon={emptyIcon}
          />
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && !isLoading && data.length > 0 && (
        <div className="mt-auto border-t px-2">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  )
}
