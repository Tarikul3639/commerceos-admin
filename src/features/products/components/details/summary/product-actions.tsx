"use client"

import { Heart, Plus, Share2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

interface ProductActionsProps {
  disabled?: boolean
  onAddToCart?: () => void
  onBuyNow?: () => void
  onCompare?: () => void
  onFavorite?: () => void
  onShare?: () => void
}

export function ProductActions({
  disabled = false,
  onAddToCart,
  onBuyNow,
  onCompare,
  onFavorite,
  onShare,
}: ProductActionsProps) {
  const isMobile = useIsMobile()
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          size="lg"
          variant="outline"
          disabled={disabled}
          onClick={onAddToCart}
          className="gap-2"
        >
          <ShoppingCart />
          Add to cart
        </Button>

        <Button
          type="button"
          size="lg"
          disabled={disabled}
          onClick={onBuyNow}
          className="gap-2"
        >
          Buy now
        </Button>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={onCompare}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="size-3" />
          Compare
        </button>

        <button
          type="button"
          onClick={onFavorite}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Heart className="size-3" />
          Favorite
        </button>

        <button
          type="button"
          onClick={onShare}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Share2 className="size-3" />
          Share
        </button>
      </div>
    </div>
  )
}
