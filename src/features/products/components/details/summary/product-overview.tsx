import { Badge } from "@/components/ui/badge"
import { Rating } from "@/components/shared/rating"
import type { ProductDetails } from "../../../types/product.types"
import { ProductPrice } from "./product-price"

interface ProductOverviewProps {
  product: ProductDetails
}

export function ProductOverview({ product }: ProductOverviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant={product.isActive ? "default" : "secondary"}>
          {product.isActive ? "Active" : "Inactive"}
        </Badge>

        {product.deletedAt && <Badge variant="destructive">Deleted</Badge>}
      </div>

      {product.stock > 0 ? (
        <span className="text-xs font-medium text-green-500 uppercase">
          In Stock: {product.stock}
        </span>
      ) : (
        <span className="text-xs font-medium text-destructive uppercase">
          Out of Stock
        </span>
      )}

      <h5 className="text-lg font-semibold tracking-tight">{product.name}</h5>

      <Rating
        value={product.rating.average}
        count={product.rating.count}
        size="md"
      />

      <ProductPrice product={product} />

      <p className="text-sm text-muted-foreground">{product.subDescription}</p>
    </div>
  )
}
