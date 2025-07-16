
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <div className="lg:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold hidden lg:block">المحاسب الذكي</h1>
    </header>
  );
}
