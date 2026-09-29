export interface ProductCategory {
    id: string
    name: string
    slug: string
}

export interface ProductBrand {
    id: string
    name: string
    slug: string
}

export interface Product {
    id: string
    name: string
    slug: string
    description: string | null
    thumbnail: string | null
    isActive: boolean
    category: ProductCategory
    brand: ProductBrand | null
    variantCount: number
    createdAt: string
    updatedAt: string
}

export interface ProductImage {
    id: string
    imageUrl: string
    publicId: string
    sortOrder: number
    createdAt: string
    updatedAt: string
}

export interface VariantAttribute {
    attributeId: string
    attributeName: string
    attributeValueId: string
    attributeValue: string
}

export interface ProductVariant {
    id: string
    sku: string
    barcode: string | null
    purchasePrice: string
    sellingPrice: string
    image: string | null
    publicId: string | null
    isActive: boolean
    attributes: VariantAttribute[]
    createdAt: string
    updatedAt: string
}

export interface ProductDetails extends Product {
    images: ProductImage[]
    variants: ProductVariant[]
}

export interface ProductQueryParams {
    search?: string
    categoryId?: string
    brandId?: string
    isActive?: string
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

export interface ProductResponse {
    data: Product
}

export interface ProductDetailsResponse {
    data: ProductDetails
}

export interface CreateProductRequest {
    name: string
    description?: string
    categoryId: string
    brandId?: string
    thumbnail?: string
    publicId?: string
    isActive?: boolean
}

export interface UpdateProductRequest {
    name?: string
    description?: string | null
    categoryId?: string
    brandId?: string | null
    thumbnail?: string | null
    publicId?: string | null
    isActive?: boolean
}

export interface AddProductImageRequest {
    imageUrl: string
    publicId: string
    sortOrder?: number
}

export interface UpdateProductImageRequest {
    imageUrl?: string
    publicId?: string
    sortOrder?: number
}

export interface CreateProductVariantRequest {
    sku: string
    barcode?: string
    purchasePrice: number
    sellingPrice: number
    image?: string
    publicId?: string
    isActive?: boolean
    attributeValueIds?: string[]
}

export interface UpdateProductVariantRequest {
    sku?: string
    barcode?: string | null
    purchasePrice?: number
    sellingPrice?: number
    image?: string | null
    publicId?: string | null
    isActive?: boolean
    attributeValueIds?: string[]
}