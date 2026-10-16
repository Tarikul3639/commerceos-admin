"use client"

import { useState } from "react"
import { UAParser } from "ua-parser-js"
import { Check, Copy, Monitor, Smartphone, Tablet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ActivityLogUserAgentProps = {
    userAgent: string | null
}

export function ActivityLogUserAgent({ userAgent }: ActivityLogUserAgentProps) {
    const [copied, setCopied] = useState(false)

    if (!userAgent) {
        return (
            <p className="text-sm text-muted-foreground">No user agent available</p>
        )
    }

    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    const browser = [result.browser.name, result.browser.version]
        .filter(Boolean)
        .join(" ")

    const os = [result.os.name, result.os.version].filter(Boolean).join(" ")

    const deviceType = result.device.type ?? "desktop"

    const DeviceIcon =
        deviceType === "mobile"
            ? Smartphone
            : deviceType === "tablet"
                ? Tablet
                : Monitor

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(userAgent || "")
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border p-3">
                    <p className="mb-1 text-xs text-muted-foreground">Browser</p>
                    <p className="text-sm font-medium">{browser || "Unknown"}</p>
                </div>

                <div className="rounded-md border p-3">
                    <p className="mb-1 text-xs text-muted-foreground">Operating System</p>
                    <p className="text-sm font-medium">{os || "Unknown"}</p>
                </div>

                <div className="rounded-md border p-3">
                    <p className="mb-1 text-xs text-muted-foreground">Device</p>

                    <div className="flex items-center gap-2">
                        <DeviceIcon className="size-4 text-muted-foreground" />
                        <p className="text-sm font-medium capitalize">{deviceType}</p>
                    </div>
                </div>
            </div>

            <details className="group rounded-md border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3">
                    <span className="text-sm font-medium">Raw User-Agent</span>

                    <Badge variant="secondary">View details</Badge>
                </summary>

                <div className="space-y-3 border-t p-3">
                    <p className="font-mono text-xs leading-relaxed break-all text-muted-foreground">
                        {userAgent}
                    </p>

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <Check />
                            ) : (
                                <Copy />
                            )}
                            {copied ? "Copied" : "User-Agent"}
                        </Button>
                    </div>
                </div>
            </details>
        </div>
    )
}
