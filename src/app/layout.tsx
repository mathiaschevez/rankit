import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider, SignedOut } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

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
          <Navbar />
          <SignedOut>
            <div className="flex absolute right-0 mr-4">
              <i className='text-xs md:text-sm'>Sign in to vote and create!</i>
            </div>
          </SignedOut>
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
