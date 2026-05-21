"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBolt,
  IconRun,
  IconTrophy,
  IconRobot,
  IconUser,
} from "@tabler/icons-react";

const navItems = [
  { href: "/", label: "Home", icon: IconBolt },
  { href: "/training", label: "Train", icon: IconRun },
  { href: "/races", label: "Races", icon: IconTrophy },
  { href: "/coach", label: "Coach", icon: IconRobot },
  { href: "/profile", label: "Profile", icon: IconUser },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav style={{
      background: "rgba(10,10,10,0.95)",
      borderTop: "0.5px solid #2a2a2a",
      backdropFilter: "blur(20px)",
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
    }}>
      <div style={{ display: "flex", maxWidth: "480px", margin: "0 auto", padding: "8px 0" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: "3px", padding: "6px 4px",
              color: isActive ? "var(--green)" : "var(--text3)",
              textDecoration: "none",
            }}>
              <Icon size={22} strokeWidth={1.6} />
              <span style={{ fontSize: "10px", letterSpacing: "0.04em", fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}