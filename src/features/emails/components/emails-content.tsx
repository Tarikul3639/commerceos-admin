"use client"

import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"

import { useGetEmailLogsQuery } from "../api/emails.api"
import type { EmailStatus } from "../types/email.types"
import { emailColumns } from "./emails-columns"

export function EmailsContent() {
  const permission = usePermission()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<EmailStatus | "ALL">("ALL")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, isFetching, isError, error } = useGetEmailLogsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    status: status === "ALL" ? undefined : status,
  })

  const resetPage = () =>
    setPagination((current) => ({ ...current, pageIndex: 0 }))

  return (
    <PageContainer
      access={permission.has(Permission.EMAIL_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Emails"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Emails" },
      ]}
      infoContent={
        <p className="text-sm text-muted-foreground">
          Review transactional email delivery history. Retry is unavailable
          because the system does not retain a safe, replayable template
          payload.
        </p>
      }
    >
      <DataTable
        title="Email delivery logs"
        description="Newest emails first. Search by recipient, subject or related entity."
        columns={emailColumns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isFetching={isFetching && !isLoading}
        isError={isError}
        error={error}
        emptyText="No email logs match the selected filters."
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value)
            resetPage()
          },
          placeholder: "Search recipient or subject...",
        }}
        toolbarFilters={
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as EmailStatus | "ALL")
              resetPage()
            }}
          >
            <SelectTrigger
              className="w-full sm:w-[140px]"
              aria-label="Filter by email status"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        }
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        totalRows={data?.meta.total ?? 0}
      />
    </PageContainer>
  )
}
