import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthWrapper from "@/components/AuthWrapper";
import DOMCleaner from "@/components/DOMCleaner";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Metalyz - AI Powered SEO Manager",
  description: "Generate optimized meta tags for your website using AI. Improve your SEO with professional meta titles, descriptions, and keywords.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-900`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div suppressHydrationWarning>
            <DOMCleaner />
            <AuthWrapper>
              {children}
              <Footer />
            </AuthWrapper>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
