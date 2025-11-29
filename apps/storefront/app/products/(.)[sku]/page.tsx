import { getProductBySku } from "@/lib/api";
import { ProductModal } from "./product-modal";

interface ProductPageProps {
    params: Promise<{
        sku: string;
    }>;
}

export default async function InterceptedProductPage({ params }: ProductPageProps) {
    const { sku } = await params;
    const product = await getProductBySku(sku);

    if (!product) {
        return null;
    }

    return <ProductModal product={product} />;
}
