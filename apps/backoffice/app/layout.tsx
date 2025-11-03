import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from "@/components/providers";
import "@workspace/ui/globals.css";

// TẤT CẢ IMPORT MỚI
import { AppSidebar } from "@/components/app-sidebar"; // <-- Sidebar
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"; // <-- Giả định đã được hoist vào @aflower/ui
import { Separator } from "@workspace/ui/components/separator"; // <-- Separator
import {
  SidebarInset,
  SidebarProvider, // <-- Sidebar Provider
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"; // <-- Giả định đã được hoist vào @aflower/ui


const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider> 
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}