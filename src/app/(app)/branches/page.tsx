import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

export default function BranchesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="الفروع">
        <Button>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة فرع جديد
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة الفروع</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم الفرع</TableHead>
                <TableHead className="text-right">المدينة</TableHead>
                <TableHead className="text-right">مدير الفرع</TableHead>
                <TableHead className="text-right">تاريخ الافتتاح</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">الفرع الرئيسي</TableCell>
                <TableCell>الرياض</TableCell>
                <TableCell>صالح الأحمد</TableCell>
                <TableCell>2023-01-15</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm">تعديل</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">فرع المطار</TableCell>
                <TableCell>الرياض</TableCell>
                <TableCell>نورة عبدالله</TableCell>
                <TableCell>2023-05-20</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm">تعديل</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">فرع المول</TableCell>
                <TableCell>جدة</TableCell>
                <TableCell>سارة محمد</TableCell>
                <TableCell>2024-03-01</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm">تعديل</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
