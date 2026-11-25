import { CommandEmpty } from "@/components/ui/command"
import { Command as CommandIcon, Loader2, Search } from "lucide-react"

interface SearchEmptyProps {
  query: string
  isFetching: boolean
  isError: boolean
}

export function SearchEmpty({ query, isFetching, isError }: SearchEmptyProps) {
  if (isFetching) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Searching...
      </div>
    )
  }

  if (isError) {
    return (
      <CommandEmpty>Unable to search right now. Please try again.</CommandEmpty>
    )
  }

  if (query.trim().length < 2) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <Search className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">Search your workspace</p>
        <p className="text-xs text-muted-foreground">
          Type at least 2 characters to search records.
        </p>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <CommandIcon className="size-3.5" />
          <span>Use Ctrl/⌘ K anytime</span>
        </div>
      </div>
    )
  }

  return <CommandEmpty>No results found for “{query.trim()}”.</CommandEmpty>
}
