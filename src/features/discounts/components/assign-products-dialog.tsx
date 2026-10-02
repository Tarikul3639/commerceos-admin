"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { toast } from "sonner"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useGetProductsQuery } from "@/features/products/api/product.api"
import { getErrorMessage } from "@/lib/utils/error"
import { cn } from "@/lib/utils"

import { useAssignProductDiscountMutation } from "../api/discount.api"

interface AssignProductsDialogProps {
  discountId: string
}

export function AssignProductsDialog({
  discountId,
}: AssignProductsDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [search, setSearch] = useState("")

  const { data, isLoading: isProductsLoading } = useGetProductsQuery({
    search: search || undefined,
    isActive: true,
    page: 1,
    limit: 20,
  })

  const [assignProducts, { isLoading: isAssigning }] =
    useAssignProductDiscountMutation()

  const products = data?.data ?? []

  useEffect(() => {
    if (!open) {
      setSelectedProducts([])
      setSearch("")
      setPopoverOpen(false)
    }
  }, [open])

  const toggleProduct = (productId: string) => {
    setSelectedProducts((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    )
  }

  const handleSubmit = async () => {
    if (!selectedProducts.length) {
      toast.error("Please select at least one product")
      return
    }

    try {
      await assignProducts({
        discountId,
        data: {
          productIds: selectedProducts,
        },
      }).unwrap()

      toast.success("Products assigned successfully")
      setOpen(false)
    } catch (error) {
      toast.error("Failed to assign products", {
        description: getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Assign Products
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Products</DialogTitle>

          <DialogDescription>
            Select products to assign to this discount.
          </DialogDescription>
        </DialogHeader>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={popoverOpen}
              className="w-full justify-between"
            >
              {selectedProducts.length
                ? `${selectedProducts.length} product${
                    selectedProducts.length > 1 ? "s" : ""
                  } selected`
                : "Select products"}

              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search products..."
                value={search}
                onValueChange={setSearch}
              />

              <CommandList>
                <CommandEmpty>
                  {isProductsLoading
                    ? "Loading products..."
                    : "No products found."}
                </CommandEmpty>

                <CommandGroup>
                  {products.map((product) => {
                    const selected = selectedProducts.includes(product.id)

                    return (
                      <CommandItem
                        key={product.id}
                        value={product.id}
                        onSelect={() => toggleProduct(product.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            selected ? "opacity-100" : "opacity-0"
                          )}
                        />

                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>

                          <span className="text-xs text-muted-foreground">
                            {product.id}
                          </span>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isAssigning || !selectedProducts.length}
          >
            {isAssigning ? "Assigning..." : "Assign Products"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
