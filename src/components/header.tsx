
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
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "تم تسجيل الخروج بنجاح." });
      router.push('/login');
    } catch (error) {
      toast({ title: "حدث خطأ أثناء تسجيل الخروج.", variant: "destructive" });
    }
  };

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
        {user && (
          <Button variant="outline" onClick={handleLogout}>
            تسجيل الخروج
          </Button>
        )}
      </div>
    </header>
  );
}
