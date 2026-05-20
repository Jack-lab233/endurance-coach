import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "./components/BottomNav";

export const metadata: Metadata = {
  title: "EnduranceCoach",
  description: "Your AI training partner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "var(--bg)", margin: 0 }}>
        <main style={{ paddingBottom: "80px", minHeight: "100vh" }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}