import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sensor Brand AI",
  description: "Customer opinion intelligence for modern brands.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
