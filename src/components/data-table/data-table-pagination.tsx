import { type ReactTable, RowData } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type { DataTableFeatures } from "./data-table-features"

interface DataTablePaginationProps<TData extends RowData> {
  /** Provides the table instance used to control pagination. */
  table: ReactTable<DataTableFeatures, TData>
}

/** Renders responsive pagination controls for the DataTable. */
export function DataTablePagination<TData extends RowData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <TooltipProvider>
      <div className="flex w-full items-center justify-between gap-2 px-2 py-3">
        {/* Left Side */}
        <div className="flex min-w-0 items-center">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Page size label */}
            <p className="hidden text-sm font-medium sm:block">Rows per page</p>

            {/* Page size */}
            <Select
              value={table.state.pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageIndex(0) // Reset to first page when page size changes
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={table.state.pagination.pageSize} />
              </SelectTrigger>

              <SelectContent side="top" className="p-1">
                <SelectGroup>
                  <SelectLabel>Select page size</SelectLabel>

                  <SelectSeparator />

                  {[5, 10, 20, 30, 40, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          {/* Current page */}
          <div className="shrink-0 text-xs font-medium sm:w-[100px] sm:text-center sm:text-sm">
            Page {table.state.pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          {/* Navigation */}
          <div className="flex shrink-0 items-center gap-1">
            {/* First page */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft />

                  <span className="sr-only">Go to first page</span>
                </Button>
              </TooltipTrigger>

              <TooltipContent>Go to first page</TooltipContent>
            </Tooltip>

            {/* Previous page */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft />

                  <span className="sr-only">Go to previous page</span>
                </Button>
              </TooltipTrigger>

              <TooltipContent>Go to previous page</TooltipContent>
            </Tooltip>

            {/* Next page */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight />

                  <span className="sr-only">Go to next page</span>
                </Button>
              </TooltipTrigger>

              <TooltipContent>Go to next page</TooltipContent>
            </Tooltip>

            {/* Last page */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanLastPage()}
                >
                  <ChevronsRight />

                  <span className="sr-only">Go to last page</span>
                </Button>
              </TooltipTrigger>

              <TooltipContent>Go to last page</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
