import type { ReactNode } from "react"

export function SettingsLayout({ children }: { children: ReactNode }) {
  return <div className="w-full min-w-0">{children}</div>
}
