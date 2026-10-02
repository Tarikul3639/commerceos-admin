import { Geist_Mono, Inter, Geist } from "next/font/google"

import "./globals.css"
import { StoreProvider } from "@/store/providers"
import { ThemeProvider } from "@/components/theme-provider"
import { ImageViewerProvider } from "@/components/image-viewer"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { cn } from "@/lib/utils"
import { Metadata } from "next"

const geistMonoGeistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geist-mono",
})

const geistGeist = Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: "CommerceOS",
  description: "A modern e-commerce platform built with Next.js and Prisma.",
  keywords: ["Next.js", "Prisma", "E-commerce", "CommerceOS"],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com",
    title: "CommerceOS",
    description: "A modern e-commerce platform built with Next.js and Prisma.",
    siteName: "CommerceOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "CommerceOS",
    description: "A modern e-commerce platform built with Next.js and Prisma.",
    images: ["https://yourwebsite.com/og-image.png"],
    creator: "@yourtwitterhandle",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        inter.variable,
        geistGeist.variable,
        geistMonoGeistMono.variable
      )}
    >
      <body>
        <NuqsAdapter>
          <ThemeProvider>
            <StoreProvider>
              <ImageViewerProvider>{children}</ImageViewerProvider>
            </StoreProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
