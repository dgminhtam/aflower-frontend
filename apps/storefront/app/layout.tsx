import { Quicksand } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { CartProvider } from "@/components/cart/cart-context"
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/themes'
import { viVN } from '@clerk/localizations'

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
})

import { Header } from "@/components/layout/header"

// ... imports

import { StorefrontBreadcrumb } from "@/components/storefront-breadcrumb"

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      localization={viVN}
      appearance={{
        theme: shadcn,
      }}
    >
      <html lang="vi" suppressHydrationWarning>
        <body
          className={`${quicksand.variable} font-sans antialiased `}
        >
          <Providers>
            <CartProvider>
              <Header />
              <StorefrontBreadcrumb />
              {children}
            </CartProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
