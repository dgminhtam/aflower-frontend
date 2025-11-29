import { ProductDetail } from "@/components/products/product-detail";
import { getProductBySku } from "@/lib/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductPageProps {
    params: Promise<{
        sku: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    try {
        const { sku } = await params;
        const product = await getProductBySku(sku);
        if (!product) {
            return {
                title: "Sản phẩm không tồn tại",
            };
        }
        return {
            title: `${product.name} | Aflower`,
            description: product.description,
            openGraph: {
                images: [product.image?.urlLarge || ""],
            },
        };
    } catch (error) {
        return {
            title: "Lỗi tải sản phẩm",
        };
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    let product;
    try {
        const { sku } = await params;
        product = await getProductBySku(sku);
    } catch (error) {
        console.error("Error fetching product:", error);
    }

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ProductDetail product={product} />
        </div>
    );
}
