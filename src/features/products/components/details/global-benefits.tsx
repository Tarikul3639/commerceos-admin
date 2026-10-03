"use client"

import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react"

const benefits = [
  {
    icon: BadgeCheck,
    title: "100% original",
    description: "Chocolate bar candy canes ice cream toffee cookie halvah.",
  },
  {
    icon: Clock3,
    title: "10 days replacement",
    description: "Marshmallow biscuit donut dragée fruitcake wafer.",
  },
  {
    icon: ShieldCheck,
    title: "Year warranty",
    description: "Cotton candy gingerbread cake I love sugar sweet.",
  },
]

export function GlobalBenefits() {
  return (
    <div className="grid grid-cols-1 gap-8 border-y py-8 sm:grid-cols-3 sm:gap-6">
      {benefits.map((benefit) => {
        const Icon = benefit.icon

        return (
          <div
            key={benefit.title}
            className="flex flex-col items-center text-center"
          >
            <Icon className="mb-4 size-5 text-primary" />
            <h3 className="text-sm font-semibold">{benefit.title}</h3>
            <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
              {benefit.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
