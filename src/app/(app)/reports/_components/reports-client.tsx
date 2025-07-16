
'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown } from "lucide-react";
import { SalesChart } from "@/components/sales-chart";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AmiriFont } from '@/lib/fonts/Amiri-Regular-normal.js';
import type { Sale } from "@/firebase/services/salesService";
import type { Expense } from "@/firebase/services/expensesService";

interface ReportsClientPageProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  invoiceCount: number;
  sales: Sale[];
  expenses: Expense[];
  chartData: { month: string; sales: number }[];
}

export function ReportsClientPage({
  totalRevenue,
  totalExpenses,
  netProfit,
  invoiceCount,
  sales,
  expenses,
  chartData,
}: ReportsClientPageProps) {

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.addFileToVFS('Amiri-Regular.ttf', AmiriFont);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');

    doc.setR2L(true);

    doc.setFontSize(22);
    doc.text("تقرير الأداء المالي", 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, 105, 30, { align: 'center' });

    doc.autoTable({
        startY: 40,
        body: [
            [`إجمالي الإيرادات: ${totalRevenue.toFixed(2)} ريال`],
            [`إجمالي المصروفات: ${totalExpenses.toFixed(2)} ريال`],
            [`صافي الربح: ${netProfit.toFixed(2)} ريال`],
            [`عدد الفواتير: ${invoiceCount}`],
        ],
        theme: 'plain',
        styles: { font: 'Amiri', halign: 'right', fontSize: 14 },
    });


    let lastY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(16);
    doc.text("سجل المبيعات", 200, lastY, { align: 'right' });
    lastY += 5;
    
    (doc as any).autoTable({
      startY: lastY,
      head: [['المبلغ', 'الحالة', 'العميل', 'التاريخ', 'الفاتورة']],
      body: sales.map(s => [
          `${s.amount.toFixed(2)} ريال`,
          s.status === 'paid' ? 'مدفوعة' : 'مستحقة',
          s.customerName,
          s.date,
          `INV-${s.id.slice(0, 6).toUpperCase()}`
        ]),
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        font: 'Amiri',
        halign: 'center'
      },
      bodyStyles: {
        font: 'Amiri',
        halign: 'right'
      },
    });

    lastY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(16);
    doc.text("سجل المصروفات", 200, lastY, { align: 'right' });
    lastY += 5;

    (doc as any).autoTable({
      startY: lastY,
      head: [['المبلغ', 'الفئة', 'الوصف', 'التاريخ']],
      body: expenses.map(e => [
          `${e.amount.toFixed(2)} ريال`,
           e.category,
           e.description,
           e.date
        ]),
      theme: 'grid',
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        font: 'Amiri',
        halign: 'center'
      },
      bodyStyles: {
        font: 'Amiri',
        halign: 'right'
      },
    });


    doc.save(`report-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="التقارير">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="reportPeriod" className="text-sm font-medium">
              الفترة الزمنية:
            </label>
            <Select dir="rtl" defaultValue="monthly">
              <SelectTrigger id="reportPeriod" className="w-[150px]">
                <SelectValue placeholder="اختر الفترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">يومي</SelectItem>
                <SelectItem value="weekly">أسبوعي</SelectItem>
                <SelectItem value="monthly">شهري</SelectItem>
                <SelectItem value="yearly">سنوي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileDown className="ml-2 h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} ريال</div>
            <p className="text-xs text-muted-foreground">للفترة المحددة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">صافي الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{netProfit.toFixed(2)} ريال</div>
             <p className="text-xs text-muted-foreground">للفترة المحددة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">إجمالي المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses.toFixed(2)} ريال</div>
             <p className="text-xs text-muted-foreground">للفترة المحددة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">عدد الفواتير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoiceCount}</div>
             <p className="text-xs text-muted-foreground">للفترة المحددة</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أداء المبيعات الشهري</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}

    