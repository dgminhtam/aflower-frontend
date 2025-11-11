import { Be_Vietnam_Pro } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from "@/components/providers";
import "@workspace/ui/globals.css";
import { shadcn } from '@clerk/themes';
import { viVN } from '@clerk/localizations';
import { Toaster } from "@workspace/ui/components/sonner"

const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={viVN}
      appearance={{
        theme: shadcn,
      }}
    >
      <html lang="vi" className={`${fontSans.variable} ${fontMono.variable}`} suppressHydrationWarning>
        <body className="font-sans antialiased">
          <Providers>{children}</Providers>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
