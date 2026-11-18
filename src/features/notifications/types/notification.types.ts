export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  link: string | null
  entityType: string | null
  entityId: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface NotificationQueryParams {
  page?: number
  limit?: number
  type?: NotificationType
  isRead?: "true" | "false"
}

export interface NotificationsResponse {
  data: Notification[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    unreadCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface MarkAllNotificationsReadResponse {
  updatedCount: number
}
