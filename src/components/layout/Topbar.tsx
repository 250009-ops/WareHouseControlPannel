"use client";

import { useState } from "react";
import { Icon } from "../Icon";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function Topbar({
  title,
  search,
  onSearch,
  onMenu,
}: {
  title: string;
  search: string;
  onSearch: (value: string) => void;
  onMenu: () => void;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-[60px] w-full shrink-0 items-center justify-between gap-[12px] border-b border-[#e2e8f0] bg-white px-[16px] md:h-[72px] md:px-[24px] xl:px-[32px]">
      <div className="flex min-w-0 items-center gap-[12px]">
        <button
          type="button"
          onClick={onMenu}
          className="flex size-[24px] shrink-0 items-center justify-center overflow-clip xl:hidden"
          aria-label="Menyu"
        >
          <Icon name="menu" size={24} alt="" />
        </button>
        <h1 className="truncate font-[family-name:var(--font-epilogue)] text-[18px] font-bold text-[#1e293b] md:text-[20px]">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-[12px] md:gap-[24px]">
        <label className="hidden items-center gap-[8px] rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] px-[16px] py-[8px] md:flex md:w-[220px] lg:w-[320px]">
          <Icon name="search" size={16} alt="" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Qidirish..."
            className="min-w-px flex-1 bg-transparent text-[14px] text-[#1e293b] outline-none placeholder:text-[#94a3b8]"
          />
        </label>
        <button
          type="button"
          className="relative flex size-[36px] items-center justify-center rounded-[18px] bg-[#f1f5f9] md:size-[40px] md:rounded-[20px]"
        >
          <Icon name="bell" size={20} alt="" />
          <span className="absolute top-[8px] right-[8px] size-[8px] rounded-full bg-[#ef4444] md:top-[10px] md:right-[10px]" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-[8px]"
          >
            <img
              src={user?.avatar ?? "/assets/avatars/akbar-sm.png"}
              alt=""
              width={36}
              height={36}
              className="size-[32px] rounded-[16px] object-cover md:size-[36px] md:rounded-[18px]"
            />
            <div className="hidden flex-col items-start gap-[2px] leading-normal whitespace-nowrap lg:flex">
              <p className="text-[13px] font-semibold text-[#1e293b]">A. Aliyev</p>
              <p className="text-[11px] text-[#64748b]">Admin</p>
            </div>
          </button>
          {open ? (
            <div className="absolute top-[48px] right-0 z-20 w-[180px] rounded-[8px] border border-[#e2e8f0] bg-white p-[8px] shadow-[0px_10px_24px_rgba(0,0,0,0.1)]">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push("/settings");
                }}
                className="w-full rounded-[6px] px-[12px] py-[8px] text-left text-[13px] text-[#1e293b] hover:bg-[#f1f5f9]"
              >
                Sozlamalar
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.replace("/");
                }}
                className="w-full rounded-[6px] px-[12px] py-[8px] text-left text-[13px] text-[#b91c1c] hover:bg-[#fef2f2]"
              >
                Chiqish
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
