
"use client"

import DOMPurify from "dompurify"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

interface ProductDescriptionProps {
  description: string | null
  brandName: string | null
  categoryName: string | null
  createdAt: string | Date | null
}

export function ProductDescription({
  description,
  brandName,
  categoryName,
  createdAt,
}: ProductDescriptionProps) {
  const cleanDescription = description
    ? DOMPurify.sanitize(description, {
      USE_PROFILES: {
        html: true,
      },
    })
    : null

  const formattedCreatedAt = createdAt
    ? new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(createdAt))
    : "Not available"

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">
          Product Description
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div className="min-h-20 min-w-0">
          {cleanDescription ? (
            <div
              className="rich-text-content"
              dangerouslySetInnerHTML={{
                __html: cleanDescription,
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No description available.
            </p>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">
            Product Information
          </h3>

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-1/3 bg-muted/50 font-medium">
                    Brand Name
                  </TableCell>
                  <TableCell>
                    {brandName || "Not specified"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="bg-muted/50 font-medium">
                    Category
                  </TableCell>
                  <TableCell>
                    {categoryName || "Not specified"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="bg-muted/50 font-medium">
                    Created At
                  </TableCell>
                  <TableCell>
                    {formattedCreatedAt}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
