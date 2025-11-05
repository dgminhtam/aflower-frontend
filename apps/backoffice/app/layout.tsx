import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import "@workspace/ui/globals.css";

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
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
        >
          <Auth0Provider>
            <Providers>{children}</Providers>
          </Auth0Provider>
        </body>
      </html>
  );
}