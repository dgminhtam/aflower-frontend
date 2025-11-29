import { CategoryGrid } from "@/components/home/category-grid"
import { FeatureBar } from "@/components/home/feature-bar"
import { FlashSaleBanner } from "@/components/home/flash-sale-banner"
import { HeroSection } from "@/components/home/hero-section"
import { ProductSection } from "@/components/home/product-section"
import { Footer } from "@/components/layout/footer"

import { FEATURED_PRODUCTS } from "@/lib/placeholder-data"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">


      <main className="flex-1">
        <HeroSection />
        <FeatureBar />
        <CategoryGrid />
        <FlashSaleBanner />

        <ProductSection
          title="Sản phẩm bán chạy"
          products={FEATURED_PRODUCTS}
          viewAllLink="/products/best-seller"
        />

        <ProductSection
          title="Hoa tươi"
          products={FEATURED_PRODUCTS.slice(0, 4)}
          viewAllLink="/categories/hoa-tuoi"
          background="muted"
        />

        <ProductSection
          title="Bánh kem"
          products={FEATURED_PRODUCTS.slice(0, 4)}
          viewAllLink="/categories/banh-kem"
        />
      </main>

      <Footer />
    </div>
  )
}
