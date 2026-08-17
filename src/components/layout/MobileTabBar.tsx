"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";

const tabs = [
  { href: "/dashboard", label: "Home", icon: "layout-dashboard" as const },
  { href: "/products", label: "Tovarlar", icon: "package" as const },
  { href: "/sales", label: "Sotuv", icon: "shopping-cart" as const },
  { href: "/debts", label: "Qarzlar", icon: "receipt" as const },
];

export function MobileTabBar({ onMore }: { onMore: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e2e8f0] bg-white pb-[max(12px,env(safe-area-inset-bottom))] md:hidden">
      <div className="flex h-[52px] items-start justify-between px-[12px] pt-[8px]">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex w-[64px] flex-col items-center gap-[4px]"
            >
              <span
                className={`flex size-[20px] items-center justify-center overflow-clip ${
                  active ? "icon-on-light-active" : "icon-on-light"
                }`}
              >
                <Icon name={tab.icon} size={20} alt="" />
              </span>
              <span
                className={`text-[10px] leading-[12px] ${
                  active ? "font-semibold text-[#2563eb]" : "text-[#64748b]"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onMore}
          className="flex w-[64px] flex-col items-center gap-[4px]"
        >
          <span className="flex size-[20px] items-center justify-center overflow-clip">
            <Icon name="menu" size={20} alt="" />
          </span>
          <span className="text-[10px] leading-[12px] text-[#64748b]">Ko&apos;proq</span>
        </button>
      </div>
    </nav>
  );
}
