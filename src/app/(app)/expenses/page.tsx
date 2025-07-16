import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileDown } from "lucide-react";

export default function ExpensesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="المصروفات">
        <div className="flex gap-2">
            <Button>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة مصروف جديد
            </Button>
            <Button variant="outline">
              <FileDown className="ml-2 h-4 w-4" />
              تصدير
            </Button>
        </div>
      </PageHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>سجل المصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الوصف</TableHead>
                    <TableHead className="text-right">الفئة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>إيجار المحل</TableCell>
                    <TableCell>إيجار</TableCell>
                    <TableCell>2024-07-01</TableCell>
                    <TableCell>2500.00 ريال</TableCell>
                    <TableCell className="text-center"><Button variant="ghost" size="sm">تعديل</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>فاتورة الكهرباء</TableCell>
                    <TableCell>فواتير</TableCell>
                    <TableCell>2024-07-10</TableCell>
                    <TableCell>350.00 ريال</TableCell>
                    <TableCell className="text-center"><Button variant="ghost" size="sm">تعديل</Button></TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>شراء حبوب بن</TableCell>
                    <TableCell>مشتريات</TableCell>
                    <TableCell>2024-07-12</TableCell>
                    <TableCell>800.00 ريال</TableCell>
                    <TableCell className="text-center"><Button variant="ghost" size="sm">تعديل</Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>إضافة مصروف جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Input id="description" placeholder="مثال: فاتورة الكهرباء" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">الفئة</Label>
                 <Select dir="rtl">
                    <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rent">إيجار</SelectItem>
                        <SelectItem value="salaries">رواتب</SelectItem>
                        <SelectItem value="purchases">مشتريات</SelectItem>
                        <SelectItem value="bills">فواتير</SelectItem>
                        <SelectItem value="maintenance">صيانة</SelectItem>
                        <SelectItem value="marketing">تسويق</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">التاريخ</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
              <Button className="w-full">
                <PlusCircle className="ml-2 h-4 w-4" />
                حفظ المصروف
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
