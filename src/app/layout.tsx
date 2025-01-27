import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "Rankit",
  description: "Rank all kinds of things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="dark">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
