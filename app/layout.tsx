import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import FloatingAction from "./components/FloatingAction";

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