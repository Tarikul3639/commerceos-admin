import type { PaginatedResponse } from "@/types/pagination"

export type EmailStatus = "PENDING" | "SENT" | "FAILED"

export interface EmailLog {
  id: string
  to: string
  subject: string
  preview: string
  status: EmailStatus
  attemptCount: number
  sentAt: string | null
  entityType: string | null
  entityId: string | null
  triggeredById: string | null
  createdAt: string
  updatedAt: string
}

export interface EmailLogQuery {
  page?: number
  limit?: number
  search?: string
  status?: EmailStatus
  fromDate?: string
  toDate?: string
}

export type EmailLogsResponse = PaginatedResponse<EmailLog>
