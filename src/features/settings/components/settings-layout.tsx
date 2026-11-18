import type { ReactNode } from "react"

export function SettingsLayout({ children }: { children: ReactNode }) {
  return <div className="min-w-0 w-full">{children}</div>
}
