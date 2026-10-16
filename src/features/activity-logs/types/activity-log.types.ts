import type { PaginatedResponse } from "@/types/pagination"

export const activityTypes = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "PASSWORD_CHANGE",
  "STATUS_CHANGE",
  "APPROVE",
  "REJECT",
  "COMPLETE",
  "CANCEL",
  "OTHER",
] as const

export const activityModules = [
  "AUTH",
  "USER",
  "ROLE",
  "PERMISSION",
  "PRODUCT",
  "CATEGORY",
  "BRAND",
  "SUPPLIER",
  "WAREHOUSE",
  "INVENTORY",
  "PURCHASE",
  "STOCK_TRANSFER",
  "STOCK_MOVEMENT",
  "DISCOUNT",
  "CUSTOMER",
  "CART",
  "ORDER",
  "PAYMENT",
  "ORDER_RETURN",
  "PURCHASE_RETURN",
  "EMPLOYEE",
  "SETTINGS",
  "NOTIFICATION",
  "OTHER",
] as const

export type ActivityType = (typeof activityTypes)[number]
export type ActivityModule = (typeof activityModules)[number]

export type ActivityLogUser = {
  id: string
  name: string | null
  email: string
}

export type ActivityLog = {
  id: string
  type: string
  module: string
  action: string
  description: string | null
  entityType: string | null
  entityId: string | null
  oldValue: unknown
  newValue: unknown
  ipAddress: string | null
  userAgent: string | null
  userId: string | null
  user: ActivityLogUser | null
  createdAt: string
}

export type ActivityLogQuery = {
  page?: number
  limit?: number
  search?: string
  type?: ActivityType
  module?: ActivityModule
  action?: string
  entityType?: string
  entityId?: string
  userId?: string
  fromDate?: string
  toDate?: string
}

export type ActivityLogsResponse = PaginatedResponse<ActivityLog>
