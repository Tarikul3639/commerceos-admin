import { CheckCircle2, CreditCard, PauseCircle, Radio } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PaymentMethodsOverviewProps {
  total: number
  enabled: number
  live: number
}

export function PaymentMethodsOverview({
  total,
  enabled,
  live,
}: PaymentMethodsOverviewProps) {
  const stats = [
    {
      label: "Configured",
      value: total,
      icon: CreditCard,
      description: "Providers in your system",
      tone: "bg-muted text-muted-foreground",
    },
    {
      label: "Enabled",
      value: enabled,
      icon: CheckCircle2,
      description: "Available at checkout",
      tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Disabled",
      value: total - enabled,
      icon: PauseCircle,
      description: "Currently unavailable",
      tone: "bg-muted text-muted-foreground",
    },
    {
      label: "Live mode",
      value: live,
      icon: Radio,
      description: "Taking real payments",
      tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.label} className="min-w-0 gap-0 p-1! shadow-sm">
            <CardContent className="min-w-0 gap-0 p-3 sm:p-4">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg sm:size-8",
                    stat.tone
                  )}
                >
                  <Icon className="size-3.5 sm:size-4" />
                </span>

                <dt className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </dt>
              </div>

              <dd className="mt-3 text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
                {stat.value}
              </dd>

              <p className="mt-1 truncate text-[11px] text-muted-foreground sm:text-xs">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </dl>
  )
}
