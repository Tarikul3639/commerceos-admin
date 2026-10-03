"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useGetProductsQuery } from "@/features/products/api/product.api"
import type { Product } from "@/features/products/types/product.types"
import type { DiscountProduct } from "../types/discount.types"
import { cn } from "@/lib/utils"

interface Props {
  value: string
  onChange: (value: string) => void
  currentProductId?: string
  selectedProduct?: DiscountProduct
  disabled?: boolean
}

export function DiscountProductSelector({
  value,
  onChange,
  currentProductId,
  selectedProduct,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const { data, isLoading, isError } = useGetProductsQuery({
    search: search || undefined,
    page: 1,
    limit: 100,
  })

  const products = (data?.data ?? []).filter(
    (product: Product) =>
      !product.deletedAt &&
      (!product.discount || product.id === currentProductId)
  )

  const label = products.find((product) => product.id === value)

  const selectedName = label
    ? `${label.name} · ${label.sku}`
    : selectedProduct?.id === value
      ? `${selectedProduct.name} · ${selectedProduct.sku}`
      : "Choose a product"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{selectedName}</span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-0"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search products by name or SKU..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            <CommandEmpty>
              {isLoading
                ? "Loading products..."
                : isError
                  ? "Could not load products."
                  : "No eligible products found."}
            </CommandEmpty>

            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={`${product.name} ${product.sku}`}
                  onSelect={() => {
                    onChange(product.id)
                    setOpen(false)
                  }}
                  className="gap-3"
                >
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        —
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {product.sku}
                    </p>
                  </div>

                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      value === product.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
