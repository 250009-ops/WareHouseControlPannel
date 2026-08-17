"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileTabBar } from "./MobileTabBar";
import { useRequireAuth } from "@/lib/auth";

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: (search: string) => React.ReactNode;
}) {
  const { ready, user } = useRequireAuth();
  const [search, setSearch] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] text-[#64748b]">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start overflow-hidden bg-[#f1f5f9]">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col self-stretch">
        <Topbar
          title={title}
          search={search}
          onSearch={setSearch}
          onMenu={() => setNavOpen(true)}
        />
        <div className="min-h-0 flex-1 overflow-auto pb-[72px] md:pb-0">
          {children(search)}
        </div>
        <MobileTabBar onMore={() => setNavOpen(true)} />
      </div>
    </div>
  );
}
