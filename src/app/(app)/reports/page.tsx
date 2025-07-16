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

export default function ReportsPage() {

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add Amiri font for Arabic support
    doc.addFileToVFS('Amiri-Regular.ttf', AmiriFont);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');

    // --- REPORT HEADER ---
    doc.setFontSize(22);
    doc.text("تقرير الأداء المالي", 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, 105, 30, { align: 'center' });

    // --- SUMMARY CARDS ---
    const summaryData = [
        { title: 'إجمالي الإيرادات', value: '125,430.50 ريال', color: [22, 163, 74] },
        { title: 'إجمالي المصروفات', value: '80,198.61 ريال', color: [220, 38, 38] },
        { title: 'صافي الربح', value: '45,231.89 ريال', color: [34, 197, 94] },
        { title: 'عدد الفواتير', value: '1,254', color: [59, 130, 246] }
    ];

    let startY = 50;
    summaryData.forEach((item, index) => {
        const x = 20 + (index * 45);
        doc.setFontSize(10);
        doc.text(item.title, x + 22.5, startY, { align: 'center', lang: 'ar', direction: 'rtl' });
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(item.value, x + 22.5, startY + 10, { align: 'center' });
        doc.setFont('Amiri', 'normal');
    });

    startY += 30;

    // --- TRANSACTIONS TABLE ---
    doc.setFontSize(16);
    doc.text("سجل المعاملات", 200, startY, { align: 'right', lang: 'ar', direction: 'rtl' });
    startY += 10;
    
    const head = [['المبلغ', 'الحالة', 'الوصف', 'التاريخ']];
    const body = [
        ['150.00 ريال', 'مدفوعة', 'فاتورة INV-001', '2024-07-15'],
        ['275.50 ريال', 'مستحقة', 'فاتورة INV-002', '2024-07-14'],
        ['2500.00 ريال', 'مصروف', 'إيجار المحل', '2024-07-01'],
        ['350.00 ريال', 'مصروف', 'فاتورة الكهرباء', '2024-07-10'],
    ];

    (doc as any).autoTable({
      startY,
      head: head,
      body: body,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        font: 'Amiri',
        halign: 'center'
      },
      bodyStyles: {
        font: 'Amiri',
        halign: 'center'
      },
      columnStyles: {
        2: { halign: 'right' }, // Align description to the right
        3: { halign: 'right' }, // Align date to the right
      },
      didParseCell: function (data: any) {
        // Correct alignment for RTL text in description and date
         if (data.section === 'body' && (data.column.index === 2 || data.column.index === 3)) {
            data.cell.styles.halign = 'right';
        }
      }
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
            <div className="text-2xl font-bold">125,430.50 ريال</div>
            <p className="text-xs text-muted-foreground">+12.5% من الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">صافي الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231.89 ريال</div>
            <p className="text-xs text-muted-foreground">+8.2% من الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">إجمالي المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80,198.61 ريال</div>
            <p className="text-xs text-muted-foreground">+15.3% من الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">عدد الفواتير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+54 من الشهر الماضي</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أداء المبيعات الشهري</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart />
        </CardContent>
      </Card>
    </div>
  );
}
