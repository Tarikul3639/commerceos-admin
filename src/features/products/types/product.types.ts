export interface ProductCategory {
  id: string
  name: string
  slug: string
}

export interface ProductBrand {
  id: string
  name: string
  slug: string
  website: string | null
}

export interface ProductColor {
  name: string
  hex: string
}

export interface ProductImageResponseDto {
  id: string
  imageUrl: string
  publicId: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface AddProductImageDto {
  id?: string
  imageUrl: string
  publicId: string
  sortOrder?: number
}

export interface UpdateProductImageDto {
  id?: string
  imageUrl?: string
  publicId?: string
  sortOrder?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  sku: string
  barcode: string | null
  purchasePrice: string
  sellingPrice: string
  stock: number
  colors: ProductColor[] | null
  sizes: string[]
  isActive: boolean
  deletedAt: string | null
  category: ProductCategory
  brand: ProductBrand | null
  image?: string | null
  createdAt: string
  updatedAt: string
}

export interface ProductDetails extends Product {
  images: ProductImageResponseDto[]
  discounts?: unknown[]
}

export interface ProductQueryParams {
  search?: string
  categoryId?: string
  brandId?: string
  isActive?: boolean
  page?: number
  limit?: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ProductsResponse {
  data: Product[]
  meta: PaginationMeta
}

export interface CreateProductRequest {
  name: string
  slug: string
  sku: string
  barcode?: string
  description?: string
  purchasePrice: number
  sellingPrice: number
  stock?: number
  sizes?: string[]
  colors?: ProductColor[]
  categoryId: string
  brandId?: string
  publicId?: string
  images?: AddProductImageDto[]
  isActive?: boolean
}

export interface UpdateProductRequest {
  name?: string
  slug?: string
  categoryId?: string
  brandId?: string | null
  description?: string | null
  sku?: string
  barcode?: string | null
  purchasePrice?: number
  sellingPrice?: number
  stock?: number
  sizes?: string[]
  colors?: ProductColor[]
  publicId?: string | null
  images?: UpdateProductImageDto[]
  imageIdsToDelete?: string[]
  isActive?: boolean
}
