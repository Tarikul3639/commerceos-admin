import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowRight,
  Folder,
  Package,
  Search,
  ShoppingCart,
  Tag,
  Truck,
  UserRound,
  Users,
} from "lucide-react"

import type { SearchResult } from "@/features/search/types/search.types"

const CATEGORY_ORDER = [
  "Products",
  "Orders",
  "Customers",
  "Users",
  "Suppliers",
  "Brands",
  "Categories",
]

const CATEGORY_ICONS = {
  Products: Package,
  Orders: ShoppingCart,
  Customers: Users,
  Users: UserRound,
  Suppliers: Truck,
  Brands: Tag,
  Categories: Folder,
} as const

interface SearchResultsProps {
  results: SearchResult[]
  onSelect: (result: SearchResult) => void
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  const groups = new Map<string, SearchResult[]>()

  for (const result of results) {
    const items = groups.get(result.category) ?? []
    items.push(result)
    groups.set(result.category, items)
  }

  const orderedGroups = CATEGORY_ORDER.filter((category) =>
    groups.has(category)
  )

  return (
    <>
      {orderedGroups.map((category, index) => (
        <div key={category}>
          {index > 0 && <CommandSeparator />}
          <CommandGroup heading={category}>
            {groups.get(category)?.map((result) => (
              <CommandItem
                key={`${result.category}-${result.id}`}
                value={`${result.category}-${result.id}`}
                onSelect={() => onSelect(result)}
                className="gap-3 py-2.5"
              >
                <Avatar
                  size="lg"
                  className="size-10 rounded-md after:rounded-md"
                >
                  {result.imageUrl && (
                    <AvatarImage
                      src={result.imageUrl}
                      alt=""
                      className="rounded-md"
                    />
                  )}
                  <AvatarFallback className="rounded-md">
                    {(() => {
                      const Icon =
                        CATEGORY_ICONS[
                          result.category as keyof typeof CATEGORY_ICONS
                        ] ?? Search
                      return <Icon className="size-4 text-muted-foreground" />
                    })()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{result.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {result.description}
                  </p>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground sm:size-4" />
              </CommandItem>
            ))}
          </CommandGroup>
        </div>
      ))}
    </>
  )
}
