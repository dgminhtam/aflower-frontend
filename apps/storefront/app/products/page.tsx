import { getCategoriesTree, getProducts } from "@/lib/api";
import { ProductFilter } from "@/components/products/product-filter";
import { ProductList } from "@/components/products/product-list";
import { ProductSidebar } from "@/components/products/product-sidebar";
import { StorefrontPagination } from "@/components/ui/pagination";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
    title: "Sản phẩm | AFlower",
    description: "Danh sách sản phẩm hoa tươi và quà tặng tại AFlower.",
};

interface ProductsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tất cả sản phẩm</h1>
                    <p className="text-muted-foreground">Khám phá bộ sưu tập hoa tươi và quà tặng độc đáo của chúng tôi.</p>
                </div>

                <Suspense fallback={<ProductsLoading />}>
                    <ProductsContent searchParamsPromise={searchParams} />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

async function ProductsContent({
    searchParamsPromise,
}: {
    searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParamsPromise;
    const { page = '1', size = '12', sort = '', ...searchFields } = resolvedParams;
    const pageIndex = Math.max(0, Number(page) - 1);

    // Fetch products and categories in parallel
    const [productPage, categories] = await Promise.all([
        getProducts({
            ...searchFields,
            page: String(pageIndex),
            size: String(size),
            sort: sort as string,
        }),
        getCategoriesTree(),
    ]);

    // Handle case where API might fail or return null
    if (!productPage) {
        return (
            <div className="py-12 text-center text-red-500">
                Đã xảy ra lỗi khi tải danh sách sản phẩm. Vui lòng thử lại sau.
            </div>
        )
    }

    const categoryList = Array.isArray(categories) ? categories : [];

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 shrink-0">
                <ProductSidebar categories={categoryList} />
            </aside>
            <div className="flex-1">
                <ProductFilter />
                <ProductList productPage={productPage} />

                <div className="mt-8 flex justify-center">
                    <StorefrontPagination
                        totalElements={productPage.totalElements}
                        itemsPerPage={productPage.size}
                    />
                </div>
            </div>
        </div>
    );
}

function ProductsLoading() {
    return (
        <div className="space-y-8">
            {/* Filter Skeleton */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="h-10 bg-gray-200 rounded w-full md:w-1/3 animate-pulse" />
                <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                        <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
