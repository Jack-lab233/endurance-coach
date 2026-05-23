"use client";
import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import FloatingAction from "./FloatingAction";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/auth" || pathname?.startsWith("/onboarding");

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <main style={{ paddingBottom: "72px" }}>
        {children}
      </main>
      <FloatingAction />
      <BottomNav />
    </>
  );
}