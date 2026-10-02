"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { AlertCircle, ArrowLeft, ExternalLink, Pencil } from "lucide-react"

import { AppImage } from "@/components/media"
import { PageContainer } from "@/components/layout/page-container"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useGetProductDetailsQuery } from "../../api/product.api"

export function ProductDetailsContent() {
  const params = useParams()
  const productId = params.id as string
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductDetailsQuery(productId)

  if (isLoading) {
    return (
      <PageContainer
        title="Product details"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
          { label: "Product details" },
        ]}
      >
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
      </PageContainer>
    )
  }

  if (isError || !product) {
    return (
      <PageContainer
        title="Product details"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
          { label: "Product details" },
        ]}
      >
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Unable to load product</AlertTitle>
          <AlertDescription>
            The product could not be found or loaded.
          </AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  const images = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
  const colors = Array.isArray(product.colors) ? product.colors : []

  return (
    <PageContainer
      title={product.name}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Products", href: "/dashboard/products" },
        { label: product.name },
      ]}
      pageHeaderAction={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/products">
              <ArrowLeft />
              Products
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Pencil />
              Edit product
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Product images</CardTitle>
            <CardDescription>
              {images.length} image{images.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {images.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {images.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <AppImage
                      image={image.imageUrl}
                      name={product.name}
                      className="aspect-square w-full rounded-lg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Sort order: {image.sortOrder}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No product images have been added.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info label="SKU" value={product.sku} />
              <Info label="Barcode" value={product.barcode || "—"} />
              <Info label="Slug" value={product.slug} />
              <Info label="Category" value={product.category.name} />
              <Info label="Brand" value={product.brand?.name || "—"} />
              <Info
                label="Purchase price"
                value={`৳${Number(product.purchasePrice).toLocaleString("en-BD")}`}
              />
              <Info
                label="Selling price"
                value={`৳${Number(product.sellingPrice).toLocaleString("en-BD")}`}
              />
              <Info
                label="Stock"
                value={product.stock.toLocaleString("en-BD")}
              />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Info
                label="Sizes"
                value={product.sizes.length ? product.sizes.join(", ") : "—"}
              />
              <Info
                label="Created"
                value={new Date(product.createdAt).toLocaleString()}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">
                {product.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {colors.length ? (
                colors.map((color, index) => {
                  if (!color || typeof color !== "object") return null
                  const item = color as { name?: string; hex?: string }
                  return (
                    <div
                      key={`${item.hex ?? "color"}-${index}`}
                      className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
                    >
                      <span
                        className="size-4 rounded-full border"
                        style={{ backgroundColor: item.hex ?? "transparent" }}
                      />
                      {item.name ?? item.hex ?? "Color"}
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No colors configured.
                </p>
              )}
            </CardContent>
          </Card>

          {product.brand?.website && (
            <Button variant="link" asChild className="px-0">
              <a href={product.brand.website} target="_blank" rel="noreferrer">
                Brand website <ExternalLink className="size-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium break-words">{value}</p>
    </div>
  )
}
