"use client"

import { SlidersHorizontal, ChevronsUpDown } from "lucide-react"
import { type RowData, type ReactTable } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { DataTableFeatures } from "./data-table-features"

interface DataTableColumnVisibilityProps<TData extends RowData> {
  /** TanStack Table instance. */
  table: ReactTable<DataTableFeatures, TData>

  /** Optional button label. */
  label?: string

  /** Additional button classes. */
  className?: string
}

/** Renders a reusable column visibility control. */
export function DataTableColumnVisibility<TData extends RowData>({
  table,
  label = "View",
  className,
}: DataTableColumnVisibilityProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="outline" className={className}>
          <SlidersHorizontal />

          <span>{label}</span>

          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 p-1">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>

        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            // Find the column header text.
            const columnHeader =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                onSelect={(event) => event.preventDefault()}
              >
                {columnHeader}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
