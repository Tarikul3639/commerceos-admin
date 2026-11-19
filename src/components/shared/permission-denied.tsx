import { ShieldAlert } from "lucide-react"

export function PermissionDenied() {
  return (
    <div
      role="status"
      className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center"
    >
      <ShieldAlert className="size-8 text-muted-foreground" />
      <h2 className="text-sm font-semibold">Access restricted</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        You do not have permission to view this page. Contact an administrator
        if you think you need access.
      </p>
    </div>
  )
}
