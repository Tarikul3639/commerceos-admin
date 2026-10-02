import { env } from "@/config/env"

export const siteConfig = {
  name: env.appName,
  description:
    "CommerceOS business management platform for products, orders, stock, customers, and suppliers.",
  url: env.apiUrl,
} as const
