
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function JournalEntriesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="القيود اليومية" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>دفتر اليومية</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم القيد</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الوصف</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-right">الإجمالي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">JE-001</TableCell>
                    <TableCell>2024-07-20</TableCell>
                    <TableCell>إثبات مصروف الكهرباء للشهر</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">مرحل</Badge>
                    </TableCell>
                    <TableCell>350.00 ريال</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">JE-002</TableCell>
                    <TableCell>2024-07-19</TableCell>
                    <TableCell>تسجيل مبيعات نقدية</TableCell>
                    <TableCell className="text-center">
                       <Badge variant="secondary">مرحل</Badge>
                    </TableCell>
                    <TableCell>1,250.50 ريال</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">JE-003</TableCell>
                    <TableCell>2024-07-18</TableCell>
                    <TableCell>شراء بضاعة على الحساب</TableCell>
                     <TableCell className="text-center">
                      <Badge>مسودة</Badge>
                    </TableCell>
                    <TableCell>5,000.00 ريال</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>إنشاء قيد يومية جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                 <label htmlFor="entryDate" className="block text-sm font-medium text-muted-foreground mb-1">تاريخ القيد</label>
                 <Input id="entryDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                 <label htmlFor="entryDesc" className="block text-sm font-medium text-muted-foreground mb-1">وصف القيد</label>
                 <Input id="entryDesc" placeholder="مثال: تسجيل فاتورة مشتريات" />
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-lg font-semibold mb-2">تفاصيل القيد</h4>
                <div className="space-y-2">
                    {/* Entry Row 1 */}
                    <div className="flex gap-2 items-end">
                       <Input className="flex-1" placeholder="الحساب" />
                       <Input type="number" className="w-28" placeholder="مدين" />
                       <Input type="number" className="w-28" placeholder="دائن" />
                       <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                     {/* Entry Row 2 */}
                    <div className="flex gap-2 items-end">
                       <Input className="flex-1" placeholder="الحساب" />
                       <Input type="number" className="w-28" placeholder="مدين" />
                       <Input type="number" className="w-28" placeholder="دائن" />
                       <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </div>
                 <Button variant="outline" size="sm" className="mt-2 w-full">
                    <PlusCircle className="ml-2 h-4 w-4" />
                    إضافة سطر
                 </Button>
              </div>

              <div className="flex justify-between items-center font-bold text-lg border-t pt-4 mt-4">
                  <span>الإجمالي</span>
                  <div className="flex gap-4">
                    <span>0.00</span>
                    <span>0.00</span>
                  </div>
              </div>
               <Badge variant="destructive" className="text-center w-full">
                  غير متزن
                </Badge>

            </CardContent>
            <CardFooter className="flex gap-2">
                 <Button className="w-full">
                    <PlusCircle className="ml-2 h-4 w-4" />
                    حفظ القيد
                </Button>
                 <Button className="w-full" variant="outline">
                    حفظ كمسودة
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
