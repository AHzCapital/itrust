import type { Metadata } from "next";
import "./globals.css";
import "./auth.css";
import "./profile.css";
import SessionProviderWrapper from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Trust.Me — Verified. Valuable. Yours.",
  description: "A premium marketplace for verified assets in Egypt.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><SessionProviderWrapper>{children}</SessionProviderWrapper></body>
    </html>
  );
}
