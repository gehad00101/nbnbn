import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, FileDown } from "lucide-react";

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="المبيعات">
        <div className="flex gap-2">
          <Button>
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة فاتورة جديدة
          </Button>
          <Button variant="outline">
            <FileDown className="ml-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>سجل الفواتير</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الفاتورة</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>INV-001</TableCell>
                <TableCell>علي محمد</TableCell>
                <TableCell>2024-07-15</TableCell>
                <TableCell>150.00 ريال</TableCell>
                <TableCell>مدفوعة</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm">عرض</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INV-002</TableCell>
                <TableCell>فاطمة خالد</TableCell>
                <TableCell>2024-07-14</TableCell>
                <TableCell>275.50 ريال</TableCell>
                <TableCell>مستحقة</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm">عرض</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
