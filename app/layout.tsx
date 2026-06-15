import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Komolearn",
  description: "Komolearn Copyrights 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${font.className} antialiased`}>
          <Toaster />
          <ExitModal />
          <HeartsModal />
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
