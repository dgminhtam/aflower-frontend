import { Quicksand } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/themes'
import { viVN } from '@clerk/localizations'

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
})

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
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
