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
              className="relative h-11 min-w-0 overflow-hidden px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              {header.isPlaceholder ? null : (
                <table.FlexRender header={header} />
              )}

              {header.column.getCanResize() && (
                <div
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-accent/20 select-none"
                />
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}

      <DataTableFetching colSpan={columnCount} isFetching={isFetching} />
    </TableHeader>
  )
}
