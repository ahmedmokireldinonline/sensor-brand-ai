import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sensor Brand AI — Customer opinion intelligence",
  description: "Understand what customers mean, not just what they say.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
