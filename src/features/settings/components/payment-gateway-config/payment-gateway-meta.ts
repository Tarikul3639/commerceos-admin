
import {
    Banknote,
    CreditCard,
    Smartphone,
    Wallet,
    type LucideIcon,
} from "lucide-react"

import type {
    PaymentGatewayMode,
    PaymentProvider,
} from "../../types/payment-gateway-config.types"



export const providerMeta = {
    MANUAL: {
        label: "Manual Payment",
        description: "Accept payments manually",
        icon: Banknote,
        iconClass: "text-amber-600",
        iconBgClass: "bg-amber-100 dark:bg-amber-950",
        cardBgClass:
            "bg-gradient-to-br from-card to-amber-500/50 dark:to-amber-950/30",
    },
    STRIPE: {
        label: "Stripe",
        description: "International card payments",
        icon: CreditCard,
        iconClass: "text-violet-600",
        iconBgClass: "bg-violet-100 dark:bg-violet-950",
        cardBgClass:
            "bg-gradient-to-br from-card to-violet-500/50 dark:to-violet-950/30",
    },
    SSL_COMMERZ: {
        label: "SSL Commerz",
        description: "Bangladesh online payments",
        icon: CreditCard,
        iconClass: "text-blue-600",
        iconBgClass: "bg-blue-100 dark:bg-blue-950",
        cardBgClass:
            "bg-gradient-to-br from-card to-blue-500/50 dark:to-blue-950/30",
    },
    BKASH: {
        label: "bKash",
        description: "Mobile financial services",
        icon: Smartphone,
        iconClass: "text-pink-600",
        iconBgClass: "bg-pink-100 dark:bg-pink-950",
        cardBgClass:
            "bg-gradient-to-br from-card to-pink-500/50 dark:to-pink-950/30",
    },
    NAGAD: {
        label: "Nagad",
        description: "Mobile financial services",
        icon: Smartphone,
        iconClass: "text-orange-600",
        iconBgClass: "bg-orange-100 dark:bg-orange-950",
        cardBgClass:
            "bg-gradient-to-br from-card to-orange-500/50 dark:to-orange-950/30",
    },
    ROCKET: {
        label: "Rocket",
        description: "Mobile banking payments",
        icon: Wallet,
        iconClass: "text-purple-600",
        iconBgClass: "bg-purple-100 dark:bg-purple-950",
        cardBgClass:
            "bg-gradient-to-br from-card to-purple-500/50 dark:to-purple-950/30",
    },
} as const



export const providerOptions = (
    Object.keys(providerMeta) as PaymentProvider[]
).map((value) => ({ value, ...providerMeta[value] }))

export const modeMeta: Record<
    PaymentGatewayMode,
    { label: string; description: string }
> = {
    TEST: {
        label: "Test",
        description: "Sandbox, no real money.",
    },
    LIVE: {
        label: "Live",
        description: "Real customer payments.",
    },
}
