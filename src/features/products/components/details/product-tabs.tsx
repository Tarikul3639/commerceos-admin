"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"

import type { ProductDetails } from "../../types/product.types"
import { ProductDescription } from "./product-description"
import { ProductReviews } from "./product-reviews"

interface ProductTabsProps {
    product: ProductDetails
}

const reviewData = {
    average: 4.5,
    count: 24,
    reviews: [
        {
            id: "review-1",
            rating: 5,
            comment:
                "Really good quality product. The material feels premium and the fitting is perfect.",
            customerId: "customer-1",
            avatarUrl: null,
            createdAt: "2026-09-28T10:30:00.000Z",
        },
        {
            id: "review-2",
            rating: 5,
            comment:
                "Very comfortable and exactly as shown in the product images. Definitely satisfied with the purchase. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            customerId: "customer-2",
            avatarUrl: null,
            createdAt: "2026-09-24T14:20:00.000Z",
        },
        {
            id: "review-3",
            rating: 4,
            comment:
                "Good product overall. Quality is nice, although the delivery took a little longer than expected.",
            customerId: "customer-3",
            avatarUrl: null,
            createdAt: "2026-09-20T09:15:00.000Z",
        },
        {
            id: "review-4",
            rating: 4,
            comment:
                "The product looks great and the size was accurate. Happy with the purchase.",
            customerId: "customer-4",
            avatarUrl: null,
            createdAt: "2026-09-17T16:45:00.000Z",
        },
        {
            id: "review-5",
            rating: 3,
            comment:
                "Quality is decent for the price. The product is good but could be improved slightly.",
            customerId: "customer-5",
            avatarUrl: null,
            createdAt: "2026-09-12T11:10:00.000Z",
        },
    ],
}

export function ProductTabs({ product }: ProductTabsProps) {
    return (
        <Card>
            <Tabs defaultValue="description">
                <CardHeader className="pb-0 px-3 flex w-full justify-center sm:justify-start">
                    <TabsList className="h-9 rounded-md bg-muted p-1">
                        <TabsTrigger
                            value="description"
                            className="px-4 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            Description
                        </TabsTrigger>

                        <TabsTrigger
                            value="reviews"
                            className="px-4 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            Reviews ({product.rating.count})
                        </TabsTrigger>
                    </TabsList>
                </CardHeader>

                <CardContent className="p-1">
                    <TabsContent
                        value="description"
                        className="mt-0"
                    >
                        <ProductDescription
                            description={product.description}
                        />
                    </TabsContent>

                    <TabsContent
                        value="reviews"
                        className="mt-0"
                    >
                        <ProductReviews
                            reviews={reviewData.reviews}
                            average={reviewData.average}
                            count={reviewData.count}
                        />
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    )
}