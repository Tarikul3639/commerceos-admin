import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  sortFn_alphanumeric,
  sortFn_text,
  sortFn_datetime,

  columnSizingFeature,
  columnResizingFeature,
} from "@tanstack/react-table"

export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,

  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),

  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),

  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),

  columnSizingFeature,
  columnResizingFeature,

  sortFns: {
    sortFn_text,
    sortFn_datetime,
    sortFn_alphanumeric,
  },
})

export type DataTableFeatures = typeof features
