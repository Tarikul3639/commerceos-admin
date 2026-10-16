import { useState } from "react"
import { Check, Copy, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { valueToPrettyJson, valueToText } from "../../utils/activity-log.utils"

type ActivityLogRawPanelProps = {
    title: string
    value: unknown
}

export function ActivityLogRawPanel({
    title,
    value,
}: ActivityLogRawPanelProps) {
    const [copied, setCopied] = useState(false)

    const content =
        value === null || value === undefined ? "No data" : valueToPrettyJson(value)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(valueToText(value))
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className="min-w-0 overflow-hidden rounded-md border">
            <div className="flex items-center justify-between gap-2 border-b bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-2">
                    <Code2 className="text-muted-foreground" />
                    <h4 className="text-xs font-semibold">{title}</h4>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCopy}
                    disabled={value === null || value === undefined}
                >
                    {copied ? (
                        <Check className="size-3" />
                    ) : (
                        <Copy className="size-3" />
                    )}
                    {copied ? "Copied" : "Copy"}
                </Button>
            </div>

            <pre className="max-h-80 overflow-auto p-3 text-xs leading-relaxed">
                <code className="wrap-break-word whitespace-pre-wrap">{content}</code>
            </pre>
        </div>
    )
}
