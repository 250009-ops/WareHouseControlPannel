"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import { useAuth } from "@/lib/auth";

const items = [
  { href: "/dashboard", label: "Bosh sahifa", icon: "layout-dashboard" as const },
  { href: "/products", label: "Tovarlar", icon: "package" as const },
  { href: "/sales", label: "Sotuv", icon: "shopping-cart" as const },
  { href: "/debts", label: "Qarzlar", icon: "receipt" as const },
  { href: "/reports", label: "Hisobotlar", icon: "bar-chart-2" as const },
  { href: "/settings", label: "Sozlamalar", icon: "settings" as const },
];

export function Sidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      <button
        type="button"
        aria-label="Menyuni yopish"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[rgba(15,23,42,0.6)] xl:hidden ${
          open ? "block" : "hidden"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] shrink-0 flex-col justify-between bg-[#0f172a] px-[16px] py-[24px] transition-transform duration-200 xl:static xl:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex w-full flex-col items-start gap-[32px]">
          <div className="flex w-full items-center justify-between pl-[8px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px] bg-[#2563eb]">
                <Icon name="warehouse-sm" size={24} alt="" />
              </div>
              <div className="flex flex-col items-start leading-normal whitespace-nowrap">
                <p className="font-[family-name:var(--font-epilogue)] text-[18px] font-bold text-[#f8fafc]">
                  Ombor Nazorati
                </p>
                <p className="text-[11px] text-[#94a3b8]">Boshqaruv tizimi</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-[32px] items-center justify-center rounded-[8px] bg-[#f1f5f9] xl:hidden"
              aria-label="Yopish"
            >
              <Icon name="x" size={14} alt="" />
            </button>
          </div>
          <nav className="flex w-full flex-col items-start gap-[4px]">
            {items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href === "/settings" && pathname.startsWith("/admins"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex w-full items-center gap-[12px] rounded-[8px] px-[16px] py-[12px] ${
                    active
                      ? "border-l-4 border-[#2563eb] bg-[#1e293b]"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <Icon name={item.icon} size={20} alt="" />
                  <span
                    className={`text-[14px] whitespace-nowrap ${
                      active ? "font-semibold text-[#f8fafc]" : "text-[#94a3b8]"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="w-full border-t border-[#334155] pt-[16px]">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex w-full items-center gap-[12px] px-[8px]"
          >
            <img
              src={user?.avatar ?? "/assets/avatars/akbar.png"}
              alt=""
              width={40}
              height={40}
              className="size-[40px] rounded-[20px] object-cover"
            />
            <div className="flex min-w-px flex-1 flex-col gap-[2px] leading-normal">
              <p className="w-full overflow-hidden text-[14px] font-semibold text-ellipsis text-[#f8fafc]">
                {user?.name ?? "Akbar Aliyev"}
              </p>
              <p className="w-full overflow-hidden text-[11px] text-ellipsis text-[#94a3b8]">
                {user?.role ?? "Super Admin"}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
