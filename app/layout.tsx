import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import FloatingAction from "./components/FloatingAction";
import Link from "next/link";
import { IconSettings } from "@tabler/icons-react";

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
      <body style={{ background: "#060606", margin: 0, minHeight: "100vh" }}>
        <div style={{
          maxWidth: "480px",
          margin: "0 auto",
          minHeight: "100vh",
          background: "var(--bg)",
          position: "relative",
        }}>
          {/* Global settings button */}
          <Link href="/settings" style={{
            position: "fixed",
            top: "16px",
            right: "calc(50% - 224px)",
            zIndex: 40,
            width: "36px", height: "36px",
            background: "rgba(20,20,20,0.8)",
            backdropFilter: "blur(10px)",
            border: "0.5px solid var(--border)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text2)",
          }}>
            <IconSettings size={18} strokeWidth={1.6} />
          </Link>

          <main style={{ paddingBottom: "72px" }}>
            {children}
          </main>
          <FloatingAction />
          <BottomNav />
        </div>
      </body>
    </html>
  );
}