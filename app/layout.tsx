import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trust.Me — Verified. Valuable. Yours.",
  description: "A premium marketplace for verified assets in Egypt.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
