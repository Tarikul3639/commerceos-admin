"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { useLazyGlobalSearchQuery } from "@/features/search/api/search.api"
import type { SearchResult } from "@/features/search/types/search.types"

import { SearchCommand } from "./search-command"

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_DELAY = 250

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [search, { data, isFetching, isError }] = useLazyGlobalSearchQuery()
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestQuery = useRef("")

  const openSearch = useCallback(() => setOpen(true), [])
  const closeSearch = useCallback(() => {
    setOpen(false)
    setQuery("")
    latestQuery.current = ""
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    const onOpenSearch = () => openSearch()

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("commerceos:open-search", onOpenSearch)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("commerceos:open-search", onOpenSearch)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [openSearch])

  useEffect(() => {
    const term = query.trim()

    if (!open || term.length < MIN_QUERY_LENGTH) return

    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(() => {
      if (latestQuery.current !== term) {
        latestQuery.current = term
        void search(term)
      }
    }, DEBOUNCE_DELAY)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [open, query, search])

  const handleSelect = (result: SearchResult) => {
    closeSearch()
    router.push(result.href)
  }

  return (
    <SearchCommand
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? openSearch() : closeSearch())}
      query={query}
      onQueryChange={setQuery}
      isFetching={isFetching}
      isError={isError}
      results={data?.data ?? []}
      onSelect={handleSelect}
    />
  )
}
