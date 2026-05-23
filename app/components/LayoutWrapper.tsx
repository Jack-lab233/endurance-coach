"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconSettings } from "@tabler/icons-react";
import BottomNav from "./BottomNav";
import FloatingAction from "./FloatingAction";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/auth" || pathname?.startsWith("/onboarding");

  return (
    <>
      {/* Settings gear — hidden on auth and onboarding */}
      {!isAuth && (
        <Link href="/settings" style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 40,
          width: "36px", height: "36px",
          background: "rgba(20,20,20,0.8)",
          backdropFilter: "blur(10px)",
          border: "0.5px solid var(--border)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text2)",
          textDecoration: "none",
        }}>
          <IconSettings size={18} strokeWidth={1.6} />
        </Link>
      )}

      <main style={{ paddingBottom: isAuth ? "0" : "72px" }}>
        {children}
      </main>

      {!isAuth && <FloatingAction />}
      {!isAuth && <BottomNav />}
    </>
  );
}