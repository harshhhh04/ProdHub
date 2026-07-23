import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store/useStore";

export const metadata: Metadata = {
  title: "Engineering OS | Personal Productivity System",
  description: "High-performance personal operating system designed for embedded systems engineering, placement preparation, and deep work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen font-sans antialiased selection:bg-emerald-500 selection:text-black">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
