import type { PaginatedResponse } from "@/types/pagination"

export enum BannerType {
  HERO = "HERO",
  PROMOTIONAL = "PROMOTIONAL",
  CATEGORY = "CATEGORY",
}

export enum BannerPosition {
  HOME_TOP = "HOME_TOP",
  HOME_MIDDLE = "HOME_MIDDLE",
  HOME_BOTTOM = "HOME_BOTTOM",
  CATEGORY_TOP = "CATEGORY_TOP",
}

export type Banner = {
  id: string
  title: string | null
  imageUrl: string
  mobileImageUrl: string | null
  type: BannerType
  position: BannerPosition
  link: string | null
  buttonText: string | null
  sortOrder: number
  isActive: boolean
  startAt: string | null
  endAt: string | null
  createdAt: string
  updatedAt: string
}

export type BannersResponse = PaginatedResponse<Banner>

export type CreateBanner = {
  title?: string
  imageUrl: string
  mobileImageUrl?: string
  type: BannerType
  position: BannerPosition
  link?: string
  buttonText?: string
  sortOrder?: number
  isActive?: boolean
  startAt?: string
  endAt?: string
}

export type UpdateBanner = Partial<CreateBanner>

export type BannerQueryParams = {
  page?: number
  limit?: number
  type?: BannerType
  position?: BannerPosition
  isActive?: boolean
}
