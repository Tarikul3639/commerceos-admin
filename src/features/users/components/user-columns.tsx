import { createColumnHelper } from "@tanstack/react-table"
import { BadgeCheck, ShieldCheck, XCircle } from "lucide-react"

import {
  type DataTableFeatures,
  DataTableColumnHeader,
} from "@/components/data-table"
import { AppImage } from "@/components/media"

import { Badge } from "@/components/ui/badge"
import { User, UserStatus } from "../types/user.types"
import { UserActionsCell } from "./user-actions-cell"

export const columnHelper = createColumnHelper<DataTableFeatures, User>()

export const columns = columnHelper.columns([
  // User
  columnHelper.accessor("name", {
    id: "user",
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="User" />
    ),
    sortFn: "sortFn_text",

    cell: (info) => {
      const user = info.row.original

      return (
        <div className="flex min-w-0 items-center gap-2">
          <AppImage
            name={user.name}
            image={user.avatar}
            className="h-10 w-10 shrink-0 rounded-full"
          />

          <div className="min-w-0">
            <p className="truncate font-medium">{user.name}</p>

            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      )
    },
  }),

  // Role
  columnHelper.accessor("role", {
    id: "role",
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Role" />
    ),
    sortFn: "sortFn_text",

    cell: (info) => {
      const role = info.getValue()

      return (
        <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
          <ShieldCheck />
          {role}
        </Badge>
      )
    },
  }),

  // Phone
  columnHelper.accessor("phone", {
    id: "phone",
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Phone" />
    ),
    sortFn: "sortFn_text",

    cell: (info) => {
      return (
        <span className="text-sm whitespace-nowrap">
          {info.getValue() || "—"}
        </span>
      )
    },
  }),

  // Status
  columnHelper.accessor("status", {
    id: "status",
    header: "Status",
    sortFn: "sortFn_text",

    cell: (info) => {
      const status = info.getValue()

      const statusConfig = {
        [UserStatus.ACTIVE]: {
          label: "Active",
          variant: "default" as const,
        },

        [UserStatus.INACTIVE]: {
          label: "Inactive",
          variant: "secondary" as const,
        },

        [UserStatus.SUSPENDED]: {
          label: "Suspended",
          variant: "destructive" as const,
        },

        [UserStatus.DELETED]: {
          label: "Deleted",
          variant: "destructive" as const,
        },
      }

      const config = statusConfig[status]

      return <Badge variant={config.variant}>{config.label}</Badge>
    },
  }),

  // Verified
  columnHelper.accessor("isVerified", {
    id: "verified",

    header: () => (
      <div className="flex justify-center">
        <span>Verified</span>
      </div>
    ),

    cell: (info) => {
      const isVerified = info.getValue()

      return (
        <div className="flex justify-center">
          {isVerified ? (
            <Badge variant="secondary">
              <BadgeCheck data-icon="inline-start" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline">
              <XCircle />
              <span>Unverified</span>
            </Badge>
          )}
        </div>
      )
    },
  }),

  // Last Login
  columnHelper.accessor("lastLoginAt", {
    id: "last_login",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Login" />
    ),
    size: 25,
    sortFn: "sortFn_datetime",

    cell: (info) => {
      const lastLoginAt = info.getValue()

      return (
        <span className="text-sm whitespace-nowrap">
          {lastLoginAt
            ? new Date(lastLoginAt).toLocaleString("en-BD", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour12: true,
                hour: "numeric",
                minute: "numeric",
              })
            : "—"}
        </span>
      )
    },
  }),

  // Created At
  columnHelper.accessor("createdAt", {
    id: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    size: 20,
    sortFn: "sortFn_datetime",

    cell: (info) => {
      const createdAt = info.getValue()

      return (
        <span className="text-sm whitespace-nowrap">
          {new Date(createdAt).toLocaleDateString("en-BD", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
          })}
        </span>
      )
    },
  }),

  // Actions
  columnHelper.display({
    id: "actions",
    header: () => (
      <div className="flex w-full items-center justify-center">Actions</div>
    ),
    cell: (info) => <UserActionsCell user={info.row.original} />,
  }),
])
