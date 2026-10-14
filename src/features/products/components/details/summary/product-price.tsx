import type { ProductDetails } from "../../../types/product-details.types"

interface ProductPriceProps {
  product: ProductDetails
}

export function ProductPrice({ product }: ProductPriceProps) {
  const originalPrice = Number(product.sellingPrice)

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="text-2xl font-semibold tracking-tight">
          ৳{originalPrice.toFixed(2)}
        </p>
      </div>

      <p className="ml-1 text-xs text-muted-foreground">
        Cost: ৳{Number(product.purchasePrice).toFixed(2)}
      </p>
    </div>
  )
}