
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBranch } from "@/context/BranchContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Header() {
  const { branches, selectedBranch, selectBranch, loading } = useBranch();

  const handleBranchChange = (branchId: string) => {
    selectBranch(branchId);
  }

  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-4 border-b bg-background px-4">
      <div className="lg:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold hidden lg:block">المحاسب الذكي</h1>
      
      <div className="ml-auto flex items-center gap-2">
        {loading ? (
            <div className="w-[180px] h-9 bg-muted rounded-md animate-pulse" />
        ) : (
          branches.length > 0 && selectedBranch && (
            <Select 
              dir="rtl" 
              value={selectedBranch.id} 
              onValueChange={handleBranchChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر الفرع..." />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        )}
      </div>
    </header>
  );
}
