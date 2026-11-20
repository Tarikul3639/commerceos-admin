import type { Metadata } from "next"
import { WishlistsContent } from "@/features/wishlists/components/wishlists-content"

export const metadata: Metadata = {
  title: "Wishlists",
  description: "Review customer saved products.",
}

/** Admin route for the customer wishlist report. */
export default function WishlistsPage() {
  return <WishlistsContent />
}
