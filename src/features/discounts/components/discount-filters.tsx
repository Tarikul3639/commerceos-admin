"use client"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { DiscountType } from "../types/discount.types"

interface DiscountFiltersProps {
  isActive?: boolean
  type?: DiscountType
  onIsActiveChange: (value: boolean | undefined) => void
  onTypeChange: (value: DiscountType | undefined) => void
}

export function DiscountFilters({
  isActive,
  type,
  onIsActiveChange,
  onTypeChange,
}: DiscountFiltersProps) {
  const hasFilters = isActive !== undefined || type !== undefined

  const handleReset = () => {
    onIsActiveChange(undefined)
    onTypeChange(undefined)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={type ?? "all"}
        onValueChange={(value) =>
          onTypeChange(value === "all" ? undefined : (value as DiscountType))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Discount Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>

          <SelectItem value={DiscountType.PERCENTAGE}>Percentage</SelectItem>

          <SelectItem value={DiscountType.FIXED}>Fixed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={isActive === undefined ? "all" : String(isActive)}
        onValueChange={(value) =>
          onIsActiveChange(value === "all" ? undefined : value === "true")
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>

          <SelectItem value="true">Active</SelectItem>

          <SelectItem value="false">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="xs"
          onClick={handleReset}
          className="hover:text-destructive"
        >
          <X className="size-4" />
          Reset
        </Button>
      )}
    </div>
  )
}
