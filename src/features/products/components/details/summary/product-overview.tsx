import { Badge } from "@/components/ui/badge"
import type { ProductDetails } from "../../../types/product-details.types"
import { ProductPrice } from "./product-price"

interface ProductOverviewProps {
  product: ProductDetails
}

export function ProductOverview({ product }: ProductOverviewProps) {
  const hasVariants = product.variants.length > 0
  const quantity = product.variants.reduce((total, variant) => {
    if (variant.isActive && !variant.deletedAt) {
      return total + variant.stock
    }
    return total
  }, 0)

  return (
    <div className="flex flex-col gap-2">
      {hasVariants && quantity > 0 ? (
        <span className="text-xs font-medium text-green-500 uppercase">
          In Stock: {quantity}
        </span>
      ) : hasVariants ? (
        <span className="text-xs font-medium text-destructive uppercase">
          Out of Stock
        </span>
      ) : (
        <span className="text-xs font-medium text-muted-foreground uppercase">
          No variant inventory
        </span>
      )}

      <h5 className="text-lg font-semibold tracking-tight">{product.name}</h5>

      <ProductPrice product={product} />

      <p className="text-sm text-muted-foreground">{product.subDescription}</p>
    </div>
  )
}
