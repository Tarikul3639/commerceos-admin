"use client"

import { Command } from "cmdk"

import {
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import type { SearchResult } from "@/features/search/types/search.types"

import { SearchEmpty } from "./search-empty"
import { SearchResults } from "./search-results"

interface SearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  query: string
  onQueryChange: (query: string) => void
  isFetching: boolean
  isError: boolean
  results: SearchResult[]
  onSelect: (result: SearchResult) => void
}

export function SearchCommand({
  open,
  onOpenChange,
  query,
  onQueryChange,
  isFetching,
  isError,
  results,
  onSelect,
}: SearchCommandProps) {
  const showEmptyState =
    query.trim().length < 2 || isFetching || isError || results.length === 0

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Global search"
      description="Search records available to your account."
      className="top-[10%] max-w-[95vw] translate-y-0 sm:top-[12%] sm:max-w-xl"
      showCloseButton={false}
    >
      <Command shouldFilter={false} className="rounded-xl">
        <div className="border-b px-2 py-2">
          <CommandInput
            value={query}
            onValueChange={onQueryChange}
            placeholder="Search products, orders, customers..."
            className="h-12"
          />
        </div>
        <CommandList className="max-h-[min(60vh,28rem)] px-2 py-2">
          {showEmptyState ? (
            <SearchEmpty
              query={query}
              isFetching={isFetching}
              isError={isError}
            />
          ) : (
            <SearchResults results={results} onSelect={onSelect} />
          )}
        </CommandList>
        <div className="flex items-center justify-between border-t px-3 py-2 text-[11px] text-muted-foreground">
          <span>Navigate with ↑ ↓ and select with ↵</span>
          <span>ESC to close</span>
        </div>
      </Command>
    </CommandDialog>
  )
}
