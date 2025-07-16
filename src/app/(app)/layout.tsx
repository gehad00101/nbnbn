
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ReceiptText,
  Warehouse,
  BarChart4,
  Users,
  Building,
  Landmark,
  UserCircle,
  Settings,
  LogOut,
  UserCog,
  FileText,
  Network,
  BookText
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/logo";
import { Header } from "@/components/header";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BranchGuard } from "@/components/branch-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  if (loading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar side="right">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="text-xl font-bold text-sidebar-foreground">
              المحاسب الذكي
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard" isActive>
                <LayoutDashboard />
                الرئيسية
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/sales">
                <FileText />
                المبيعات
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/invoices">
                <ReceiptText />
                الفواتير
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/expenses">
                <ReceiptText />
                المصروفات
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/journal-entries">
                <BookText />
                القيود اليومية
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/inventory">
                <Warehouse />
                المخزون
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/chart-of-accounts">
                <Network />
                شجرة الحسابات
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/employees">
                <Users />
                الموظفين
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/branches">
                <Building />
                الفروع
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/reports">
                <BarChart4 />
                التقارير
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/bank">
                <Landmark />
                البنك
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/users">
                <UserCog />
                إدارة المستخدمين
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 w-full p-2 cursor-pointer hover:bg-sidebar-accent rounded-md">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photoURL ?? `https://placehold.co/100x100.png`} alt={user?.displayName ?? "User"} data-ai-hint="person portrait" />
                  <AvatarFallback>{getInitials(user?.displayName ?? "User")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-right">
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {user?.displayName ?? "مستخدم"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>الإعدادات</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
           </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
         <BranchGuard>
          {(branchId) => children}
        </BranchGuard>
      </SidebarInset>
    </SidebarProvider>
  );
}
