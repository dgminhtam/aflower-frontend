import { Product } from "@/app/lib/products/definitions";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
    product: Product
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "PUBLISHED":
            return "bg-green-500/10 text-green-700 dark:text-green-400"
        case "DRAFT":
            return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
        default:
            return ""
    }
}

export function ProductCard({ product }: ProductCardProps) {
    return (
    <Card key={product.id}
        className="border-border bg-card overflow-hidden hover:shadow-lg transition-shadow p-4">
        <div className="relative h-48 w-full overflow-hidden bg-muted rounded-lg">
            <Image
                src={product.image?.urlMedium || "/placeholder.webp"}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform"
            />
        </div>
        <div className="p-2">
            <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{product.category?.name}</p>

            <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">${product.price?.toFixed(2)}</span>
                <Badge variant="secondary" className={`capitalize ${getStatusColor(product.status)}`}>
                    {product.status}
                </Badge>
            </div>

            <div className="mb-4 text-sm">
                <span className="text-muted-foreground">Giá gốc: ${product.originPrice?.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-border"
                    title="Edit"
                >
                    <Edit2 className="h-4 w-4" />
                    Edit
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-10 p-0 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    </Card>)
}