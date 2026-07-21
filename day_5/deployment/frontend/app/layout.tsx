import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NUST Loan Eligibility Explorer",
  description: "Interactive Day 5 model deployment practical for the Namibia University of Science and Technology",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
