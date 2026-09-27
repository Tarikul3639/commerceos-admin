import type { RecentActivity } from "../dashboard.types"
import { type DataTableFeatures } from "@/components/data-table"
import { AppImage } from "@/components/media"
import { createColumnHelper } from "@tanstack/react-table"

export const columnHelper = createColumnHelper<
  DataTableFeatures,
  RecentActivity
>()

export const columns = columnHelper.columns([
  columnHelper.accessor("description", {
    header: "Activity",
    cell: (info) => {
      const activity = info.row.original

      return (
        <div className="min-w-0">
          <p className="truncate font-medium">
            {activity.description || activity.action}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {activity.module} • {activity.type}
          </p>
        </div>
      )
    },
  }),

  columnHelper.accessor("user", {
    header: "User",
    cell: (info) => {
      const user = info.getValue()

      return user ? (
        <div className="flex min-w-0 gap-1.5">
          <AppImage
            name={user.name || user.email}
            image={user.avatar}
            className="mr-2 h-8 w-8"
          />
          <div>
            <p className="truncate font-medium">{user.name}</p>

            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground">System</span>
      )
    },
  }),

  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
])
