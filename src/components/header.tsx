
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold hidden md:block">نظام محاسبي للمقهى</h1>
      <div className="flex items-center gap-4 ml-auto">
         <div className="flex items-center gap-2 text-sm">
            <label htmlFor="branchSelector" className="font-medium text-muted-foreground">الفرع المحدد:</label>
            <Select dir="rtl" defaultValue="main_branch">
              <SelectTrigger id="branchSelector" className="w-[180px]">
                <SelectValue placeholder="اختر الفرع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main_branch">الفرع الرئيسي</SelectItem>
                <SelectItem value="airport_branch">فرع المطار</SelectItem>
                <SelectItem value="mall_branch">فرع المول</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>
    </header>
  );
}
