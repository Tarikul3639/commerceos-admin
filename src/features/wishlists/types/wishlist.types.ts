export interface WishlistCustomer {
  id: string
  name: string
  email: string
  phone: string | null
}

export interface WishlistProduct {
  id: string
  name: string
  price: string
  imageUrl: string | null
  isAvailable: boolean
}

export interface WishlistItem {
  id: string
  productId: string
  createdAt: string
  product: WishlistProduct
}

export interface CustomerWishlist {
  id: string
  customerId: string
  customer: WishlistCustomer
  items: WishlistItem[]
  itemCount: number
  createdAt: string
  updatedAt: string
}

export interface WishlistQueryParams {
  page?: number
  limit?: number
  search?: string
}

export interface WishlistsResponse {
  data: CustomerWishlist[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
