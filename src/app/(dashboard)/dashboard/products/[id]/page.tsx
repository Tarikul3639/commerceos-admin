import { ProductDetailsContent } from "@/features/products/components/details/product-details-content"

interface ProductDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params

  return <ProductDetailsContent productId={id} />
}
