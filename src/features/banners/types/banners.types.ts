import type { PaginatedResponse } from "@/types/pagination"

export enum BannerType {
  PROMOTION = "PROMOTION",
  OFFER = "OFFER",
  PRODUCT = "PRODUCT",
  CATEGORY = "CATEGORY",
  CUSTOM = "CUSTOM",
}

export enum BannerPosition {
  HOME_TOP = "HOME_TOP",
  HOME_MIDDLE = "HOME_MIDDLE",
  HOME_BOTTOM = "HOME_BOTTOM",
  CATEGORY_TOP = "CATEGORY_TOP",
  CATEGORY_MIDDLE = "CATEGORY_MIDDLE",
  PRODUCT_TOP = "PRODUCT_TOP",
  PRODUCT_MIDDLE = "PRODUCT_MIDDLE",
  SHOP_TOP = "SHOP_TOP",
  SHOP_MIDDLE = "SHOP_MIDDLE",
  SIDEBAR = "SIDEBAR",
}

export type BannerActor = {
  id: string
  name: string
  email: string
}

export type Banner = {
  id: string
  title: string | null
  imageUrl: string
  imagePublicId: string
  mobileImageUrl: string | null
  mobileImagePublicId: string | null
  type: BannerType
  position: BannerPosition
  link: string | null
  buttonText: string | null
  openInNewTab: boolean
  sortOrder: number
  isActive: boolean
  startAt: string | null
  endAt: string | null
  createdById: string | null
  updatedById: string | null
  createdBy: BannerActor | null
  updatedBy: BannerActor | null
  createdAt: string
  updatedAt: string
}

export type BannersResponse = PaginatedResponse<Banner>

export type CreateBanner = {
  title?: string
  imageUrl: string
  imagePublicId: string
  mobileImageUrl?: string
  mobileImagePublicId?: string
  type: BannerType
  position: BannerPosition
  link?: string
  buttonText?: string
  openInNewTab?: boolean
  sortOrder?: number
  isActive?: boolean
  startAt?: string
  endAt?: string
}

export type UpdateBanner = {
  title?: string | null
  imageUrl?: string
  imagePublicId?: string
  mobileImageUrl?: string | null
  mobileImagePublicId?: string | null
  type?: BannerType
  position?: BannerPosition
  link?: string | null
  buttonText?: string | null
  openInNewTab?: boolean
  sortOrder?: number
  isActive?: boolean
  startAt?: string | null
  endAt?: string | null
}

export type BannerQueryParams = {
  page?: number
  limit?: number
  search?: string
  type?: BannerType
  position?: BannerPosition
  isActive?: boolean
}
