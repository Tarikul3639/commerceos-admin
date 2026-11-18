export interface CartCustomer {
  id: string
  name: string
  email: string
  phone: string | null
}

export interface CartProduct {
  id: string
  name: string
  price: string
  imageUrl: string | null
}

export interface CartVariant {
  id: string
  sku: string
  title: string | null
  stock: number
}

export interface CartItem {
  id: string
  quantity: number
  productId: string
  variantId: string | null
  product: CartProduct
  variant: CartVariant | null
}

export interface CustomerCart {
  id: string
  customerId: string
  customer: CartCustomer
  items: CartItem[]
  itemCount: number
  totalQuantity: number
  estimatedValue: string
  createdAt: string
  updatedAt: string
}

export interface CartQueryParams {
  page?: number
  limit?: number
  search?: string
}

export interface CartsResponse {
  data: CustomerCart[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
