
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';

// Demo data for chart of accounts
const initialAccounts = [
  { id: '1', name: 'الأصول', type: 'header', parentId: null, children: [
    { id: '11', name: 'الأصول المتداولة', type: 'header', parentId: '1', children: [
      { id: '111', name: 'النقدية وما في حكمها', type: 'account', parentId: '11', children: [] },
      { id: '112', name: 'حسابات مدينة', type: 'account', parentId: '11', children: [] },
    ]},
    { id: '12', name: 'الأصول الثابتة', type: 'header', parentId: '1', children: [
      { id: '121', name: 'المباني', type: 'account', parentId: '12', children: [] },
      { id: '122', name: 'المعدات', type: 'account', parentId: '12', children: [] },
    ]},
  ]},
  { id: '2', name: 'الخصوم', type: 'header', parentId: null, children: [
    { id: '21', name: 'الخصوم المتداولة', type: 'header', parentId: '2', children: [
      { id: '211', name: 'حسابات دائنة', type: 'account', parentId: '21', children: [] },
    ]},
  ]},
  { id: '3', name: 'حقوق الملكية', type: 'header', parentId: null, children: [] },
  { id: '4', name: 'الإيرادات', type: 'header', parentId: null, children: [] },
  { id: '5', name: 'المصروفات', type: 'header', parentId: null, children: [] },
];

const AccountRow = ({ account, level = 0 }: { account: any, level?: number }) => {
  const [isOpen, setIsOpen] = useState(true);

  const hasChildren = account.children && account.children.length > 0;

  return (
    <>
      <div className={cn(
        "flex items-center justify-between p-2 rounded-md hover:bg-muted/50",
        account.type === 'header' ? 'bg-secondary' : ''
      )} style={{ marginRight: `${level * 2}rem` }}>
        <div className="flex items-center gap-2">
          {hasChildren && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          {!hasChildren && <div className="w-6 h-6" />} {/* Placeholder for alignment */}
          <span className={cn(account.type === 'header' ? "font-bold" : "")}>{account.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="flex flex-col">
          {account.children.map((child: any) => (
            <AccountRow key={child.id} account={child} level={level + 1} />
          ))}
        </div>
      )}
    </>
  );
};

export default function ChartOfAccountsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="شجرة الحسابات" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>قائمة الحسابات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {initialAccounts.map(account => (
                <AccountRow key={account.id} account={account} />
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>إضافة حساب جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-muted-foreground mb-1">اسم الحساب</label>
                <Input id="accountName" placeholder="مثال: نقدية بالصندوق" />
              </div>
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-muted-foreground mb-1">نوع الحساب</label>
                <Select dir="rtl">
                  <SelectTrigger id="accountType">
                    <SelectValue placeholder="اختر نوع الحساب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">رئيسي</SelectItem>
                    <SelectItem value="account">فرعي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="parentAccount" className="block text-sm font-medium text-muted-foreground mb-1">الحساب الرئيسي (الأب)</label>
                <Select dir="rtl">
                  <SelectTrigger id="parentAccount">
                    <SelectValue placeholder="اختر الحساب الأب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">الأصول</SelectItem>
                    <SelectItem value="11">-- الأصول المتداولة</SelectItem>
                    <SelectItem value="12">-- الأصول الثابتة</SelectItem>
                    <SelectItem value="2">الخصوم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة حساب
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
