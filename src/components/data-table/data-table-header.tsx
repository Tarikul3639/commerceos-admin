import { GripVertical } from "lucide-react"
import { type RowData, type ReactTable } from "@tanstack/react-table"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DataTableFeatures } from "./data-table-features"
import { DataTableFetching } from "./data-table-fetching"

interface DataTableHeaderProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>
  isFetching?: boolean
  columnCount: number
}

export function DataTableHeader<TData extends RowData>({
  table,
  isFetching = false,
  columnCount,
}: DataTableHeaderProps<TData>) {
  return (
    <TableHeader className="bg-muted/40">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              style={{ width: `${header.getSize()}px` }}
              className="relative h-11 min-w-0 overflow-hidden bg-accent px-4 text-xs font-semibold tracking-wide text-accent-foreground uppercase"
            >
              {header.isPlaceholder ? null : (
                <table.FlexRender header={header} />
              )}

              {header.column.getCanResize() && (
                <div
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className="absolute top-1/2 right-0 z-10 flex h-6 w-3 -translate-y-1/2 cursor-col-resize items-center justify-center select-none"
                >
                  <GripVertical className="size-3 text-muted-foreground/50" />
                </div>
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}

      <DataTableFetching colSpan={columnCount} isFetching={isFetching} />
    </TableHeader>
  )
}
