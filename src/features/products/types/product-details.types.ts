import type { ProductImage } from "./product-image.types"
import type { ProductOptionType } from "./product-option.types"
import type { ProductStatus, RelationSummary } from "./product.types"

// Product size guide
export interface ProductSizeGuide extends RelationSummary {
    description: string | null
    unit: string
    columns: string[]
    rows: Record<string, string | number>[]
}

// Product option value
export interface ProductOptionValue {
    id: string
    value: string
    colorHex: string | null
}

// Product option
export interface ProductOption {
    id: string
    name: string
    type: ProductOptionType
    values: ProductOptionValue[]
}

// Product variant option
export interface ProductVariantOption {
    id: string
    optionId: string
}

// Product variant
export interface ProductVariant {
    id: string
    title: string | null
    sku: string
    barcode: string | null
    stock: number
    isActive: boolean
    deletedAt: string | null
    options: ProductVariantOption[]
    createdAt: string
    updatedAt: string
}

// Product details
export interface ProductDetails {
    id: string
    name: string
    subDescription: string | null
    description: string | null
    purchasePrice: string
    sellingPrice: string
    status: ProductStatus

    categoryId: string
    category: RelationSummary

    brandId: string | null
    brand: RelationSummary | null

    sizeGuideId: string | null
    sizeGuide: ProductSizeGuide | null

    images: ProductImage[]
    options: ProductOption[]
    variants: ProductVariant[]

    deletedAt: string | null
    createdAt: string
    updatedAt: string
}