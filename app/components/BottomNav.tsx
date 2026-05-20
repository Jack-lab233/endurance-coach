"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBolt,
  IconRun,
  IconTrophy,
  IconRobot,
  IconSettings,
} from "@tabler/icons-react";

const navItems = [
  { href: "/", label: "Home", icon: IconBolt },
  { href: "/training", label: "Train", icon: IconRun },
  { href: "/races", label: "Races", icon: IconTrophy },
  { href: "/coach", label: "Coach", icon: IconRobot },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        background: "rgba(10,10,10,0.95)",
        borderTop: "0.5px solid #2a2a2a",
        backdropFilter: "blur(20px)",
      }}
      className="fixed bottom-0 left-0 right-0 z-50 flex"
    >
      <div className="flex w-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 flex-1 py-2 px-1"
              style={{ color: isActive ? "var(--green)" : "var(--text3)" }}
            >
              <Icon size={22} strokeWidth={1.6} />
              <span style={{ fontSize: "10px", letterSpacing: "0.04em", fontWeight: 500 }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}