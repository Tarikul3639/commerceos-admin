import { Role } from "@/config/roles.config"

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export enum UserSortBy {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  NAME = "name",
  EMAIL = "email",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  publicId: string | null
  role: Role
  status: UserStatus
  isVerified: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface UserListResponse {
  data: User[]
  meta: PaginationMeta
}

export interface CreateUserPayload {
  name: string
  email: string
  phone?: string
  avatar?: string
  publicId?: string
  role: Role
}

export interface UpdateUserPayload {
  name?: string | null
  email?: string
  phone?: string | null
  avatar?: string | null
  publicId?: string | null
  role?: Role | null
}

export interface UpdateUserStatusPayload {
  status: UserStatus
}

export interface UserQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: UserStatus
  sortBy?: UserSortBy
  sortOrder?: SortOrder
}
