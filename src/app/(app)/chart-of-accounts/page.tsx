
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';

const professionalChartOfAccounts = [
  { id: '1', name: 'الأصول', type: 'header', parentId: null, children: [
    { id: '10', name: 'الأصول المتداولة', type: 'header', parentId: '1', children: [
      { id: '101', name: '101 - النقدية وما في حكمها', type: 'header', parentId: '10', children: [
        { id: '10101', name: '10101 - صندوق الكاشير', type: 'account', parentId: '101', children: [] },
        { id: '10102', name: '10102 - حساب البنك الرئيسي', type: 'account', parentId: '101', children: [] },
        { id: '10103', name: '10103 - الودائع', type: 'account', parentId: '101', children: [] },
      ]},
      { id: '102', name: '102 - المدينون', type: 'header', parentId: '10', children: [
        { id: '10201', name: '10201 - عملاء البيع الآجل', type: 'account', parentId: '102', children: [] },
        { id: '10202', name: '10202 - سلف الموظفين', type: 'account', parentId: '102', children: [] },
      ]},
      { id: '103', name: '103 - المخزون', type: 'header', parentId: '10', children: [
        { id: '10301', name: '10301 - حبوب القهوة', type: 'account', parentId: '103', children: [] },
        { id: '10302', name: '10302 - الحليب ومنتجات الألبان', type: 'account', parentId: '103', children: [] },
        { id: '10303', name: '10303 - العصائر والمشروبات الأخرى', type: 'account', parentId: '103', children: [] },
        { id: '10304', name: '10304 - السندويشات والمعجنات', type: 'account', parentId: '103', children: [] },
        { id: '10305', name: '10305 - مواد التغليف', type: 'account', parentId: '103', children: [] },
        { id: '10306', name: '10306 - أدوات الاستخدام اليومي', type: 'account', parentId: '103', children: [] },
      ]},
      { id: '104', name: '104 - المصروفات المدفوعة مقدماً', type: 'header', parentId: '10', children: [
        { id: '10401', name: '10401 - إيجار مدفوع مقدماً', type: 'account', parentId: '104', children: [] },
        { id: '10402', name: '10402 - تأمين مدفوع مقدماً', type: 'account', parentId: '104', children: [] },
      ]},
    ]},
    { id: '11', name: 'الأصول غير المتداولة', type: 'header', parentId: '1', children: [
      { id: '110', name: '110 - الأصول الثابتة', type: 'header', parentId: '11', children: [
        { id: '11001', name: '11001 - المعدات والآلات', type: 'account', parentId: '110', children: [] },
        { id: '11002', name: '11002 - الأثاث والديكور', type: 'account', parentId: '110', children: [] },
        { id: '11003', name: '11003 - أجهزة الحاسوب وأنظمة نقاط البيع', type: 'account', parentId: '110', children: [] },
        { id: '11004', name: '11004 - أجهزة التبريد والتجميد', type: 'account', parentId: '110', children: [] },
        { id: '11005', name: '11005 - سيارة توصيل', type: 'account', parentId: '110', children: [] },
        { id: '11006', name: '11006 - تحسينات على الإيجار', type: 'account', parentId: '110', children: [] },
      ]},
      { id: '111', name: '111 - مجمع إهلاك الأصول الثابتة', type: 'header', parentId: '11', children: [
        { id: '11101', name: '11101 - مجمع إهلاك المعدات', type: 'account', parentId: '111', children: [] },
        { id: '11102', name: '11102 - مجمع إهلاك الأثاث', type: 'account', parentId: '111', children: [] },
        { id: '11103', name: '11103 - مجمع إهلاك أجهزة الحاسوب', type: 'account', parentId: '111', children: [] },
        { id: '11104', name: '11104 - مجمع إهلاك أجهزة التبريد', type: 'account', parentId: '111', children: [] },
      ]},
    ]},
  ]},
  { id: '2', name: 'الخصوم', type: 'header', parentId: null, children: [
    { id: '20', name: 'الخصوم المتداولة', type: 'header', parentId: '2', children: [
        { id: '201', name: '201 - الموردون', type: 'header', parentId: '20', children: [
            { id: '20101', name: '20101 - موردي المواد الخام', type: 'account', parentId: '201', children: [] },
            { id: '20102', name: '20102 - موردي الأدوات', type: 'account', parentId: '201', children: [] },
        ]},
        { id: '202', name: '202 - المصروفات المستحقة', type: 'header', parentId: '20', children: [
            { id: '20201', name: '20201 - مصروفات الأجور والرواتب المستحقة', type: 'account', parentId: '202', children: [] },
            { id: '20202', name: '20202 - مصروفات الإيجار المستحقة', type: 'account', parentId: '202', children: [] },
            { id: '20203', name: '20203 - مصروفات المرافق المستحقة', type: 'account', parentId: '202', children: [] },
        ]},
        { id: '203', name: '203 - القروض قصيرة الأجل', type: 'account', parentId: '20', children: [] },
    ]},
    { id: '21', name: 'الخصوم غير المتداولة', type: 'header', parentId: '2', children: [
        { id: '210', name: '210 - القروض طويلة الأجل', type: 'header', parentId: '21', children: [
            { id: '21001', name: '21001 - قرض تمويل المشروع', type: 'account', parentId: '210', children: [] },
        ]},
        { id: '211', name: '211 - سندات الدفع', type: 'account', parentId: '21', children: [] },
    ]},
  ]},
  { id: '3', name: 'حقوق الملكية', type: 'header', parentId: null, children: [
    { id: '301', name: '301 - رأس المال', type: 'header', parentId: '3', children: [
        { id: '30101', name: '30101 - رأس مال الملاك', type: 'account', parentId: '301', children: [] },
        { id: '30102', name: '30102 - مساهمات إضافية', type: 'account', parentId: '301', children: [] },
    ]},
    { id: '302', name: '302 - الأرباح المحتجزة', type: 'account', parentId: '3', children: [] },
    { id: '303', name: '303 - المسحوبات الشخصية', type: 'account', parentId: '3', children: [] },
    { id: '304', name: '304 - صافي الأرباح/الخسائر', type: 'account', parentId: '3', children: [] },
  ]},
  { id: '4', name: 'الإيرادات', type: 'header', parentId: null, children: [
    { id: '401', name: '401 - إيرادات المبيعات', type: 'header', parentId: '4', children: [
        { id: '40101', name: '40101 - مبيعات المشروبات الساخنة', type: 'account', parentId: '401', children: [] },
        { id: '40102', name: '40102 - مبيعات المشروبات الباردة', type: 'account', parentId: '401', children: [] },
        { id: '40103', name: '40103 - مبيعات الأطعمة', type: 'account', parentId: '401', children: [] },
        { id: '40104', name: '40104 - مبيعات منتجات أخرى', type: 'account', parentId: '401', children: [] },
    ]},
    { id: '402', name: '402 - مردودات ومسموحات المبيعات', type: 'account', parentId: '4', children: [] },
  ]},
  { id: '5', name: 'تكلفة المبيعات', type: 'header', parentId: null, children: [
    { id: '501', name: '501 - تكلفة البضاعة المباعة', type: 'header', parentId: '5', children: [
        { id: '50101', name: '50101 - تكلفة حبوب القهوة', type: 'account', parentId: '501', children: [] },
        { id: '50102', name: '50102 - تكلفة الحليب ومنتجات الألبان', type: 'account', parentId: '501', children: [] },
        { id: '50103', name: '50103 - تكلفة المشروبات الأخرى', type: 'account', parentId: '501', children: [] },
        { id: '50104', name: '50104 - تكلفة الأطعمة', type: 'account', parentId: '501', children: [] },
        { id: '50105', name: '50105 - تكلفة مواد التغليف', type: 'account', parentId: '501', children: [] },
    ]},
  ]},
  { id: '6', name: 'المصروفات التشغيلية', type: 'header', parentId: null, children: [
    { id: '601', name: '601 - مصروفات الأجور والرواتب', type: 'header', parentId: '6', children: [
        { id: '60101', name: '60101 - أجور الموظفين', type: 'account', parentId: '601', children: [] },
        { id: '60102', name: '60102 - مزايا الموظفين', type: 'account', parentId: '601', children: [] },
    ]},
    { id: '602', name: '602 - مصروفات الإيجار', type: 'account', parentId: '6', children: [] },
    { id: '603', name: '603 - مصروفات المرافق', type: 'header', parentId: '6', children: [
        { id: '60301', name: '60301 - مصروف الكهرباء', type: 'account', parentId: '603', children: [] },
        { id: '60302', name: '60302 - مصروف الماء', type: 'account', parentId: '603', children: [] },
        { id: '60303', name: '60303 - مصروف الغاز', type: 'account', parentId: '603', children: [] },
    ]},
    { id: '604', name: '604 - مصروفات الصيانة', type: 'account', parentId: '6', children: [] },
    { id: '605', name: '605 - مصروفات التسويق والإعلان', type: 'account', parentId: '6', children: [] },
    { id: '606', name: '606 - مصروفات التأمين', type: 'account', parentId: '6', children: [] },
    { id: '607', 'name': '607 - مصروفات الهاتف والإنترنت', type: 'account', parentId: '6', children: [] },
    { id: '608', name: '608 - مصروفات اللوازم المكتبية', type: 'account', parentId: '6', children: [] },
    { id: '609', name: '609 - مصروفات إهلاك الأصول', type: 'account', parentId: '6', children: [] },
    { id: '610', name: '610 - مصروفات أخرى', type: 'header', parentId: '6', children: [
        { id: '61001', name: '61001 - رسوم بنكية', type: 'account', parentId: '610', children: [] },
        { id: '61002', name: '61002 - رسوم تراخيص وتصاريح', type: 'account', parentId: '610', children: [] },
        { id: '61003', name: '61003 - مصاريف محاسبية وقانونية', type: 'account', parentId: '610', children: [] },
    ]},
  ]},
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
              {professionalChartOfAccounts.map(account => (
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
                    <SelectItem value="10">-- الأصول المتداولة</SelectItem>
                    <SelectItem value="11">-- الأصول غير المتداولة</SelectItem>
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
