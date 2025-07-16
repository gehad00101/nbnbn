
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranch } from "@/context/BranchContext";
import { Spinner } from "./spinner";

export function Header() {
  const { branches, selectedBranch, selectBranch, loading } = useBranch();

  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold hidden md:block">المحاسب الذكي</h1>
      <div className="flex items-center gap-4 ml-auto">
         <div className="flex items-center gap-2 text-sm">
            <label htmlFor="branchSelector" className="font-medium text-muted-foreground">الفرع المحدد:</label>
            <Select dir="rtl" onValueChange={selectBranch} value={selectedBranch?.id || ''} disabled={loading || branches.length === 0}>
              <SelectTrigger id="branchSelector" className="w-[180px]">
                {loading ? <Spinner className="h-4 w-4" /> : <SelectValue placeholder="اختر الفرع" />}
              </SelectTrigger>
              <SelectContent>
                {branches.length > 0 ? (
                  branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-branch" disabled>لا توجد فروع</SelectItem>
                )}
              </SelectContent>
            </Select>
        </div>
      </div>
    </header>
  );
}
