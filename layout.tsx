import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
