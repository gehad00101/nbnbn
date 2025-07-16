import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="المخزون" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>قائمة المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم الصنف</TableHead>
                    <TableHead className="text-right">الكمية المتاحة</TableHead>
                    <TableHead className="text-right">تكلفة الوحدة</TableHead>
                    <TableHead className="text-right">سعر البيع</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>حبوب بن كولومبية</TableCell>
                    <TableCell>15 كجم</TableCell>
                    <TableCell>80.00 ريال</TableCell>
                    <TableCell>150.00 ريال</TableCell>
                    <TableCell className="text-center"><Button variant="ghost" size="sm">تعديل</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>أكواب ورقية</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>0.50 ريال</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell className="text-center"><Button variant="ghost" size="sm">تعديل</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>حليب</TableCell>
                    <TableCell>20 لتر</TableCell>
                    <TableCell>4.00 ريال</TableCell>
                    <TableCell>N/A</TableCell>
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
              <CardTitle>إضافة صنف جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">اسم الصنف</Label>
                <Input id="itemName" placeholder="مثال: حبوب بن" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">الكمية</Label>
                <Input id="quantity" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitCost">تكلفة الوحدة</Label>
                <Input id="unitCost" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">سعر بيع الوحدة (إن وجد)</Label>
                <Input id="unitPrice" type="number" placeholder="0.00" />
              </div>
              <Button className="w-full">
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة للمخزون
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
