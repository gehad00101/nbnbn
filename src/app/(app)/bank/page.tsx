import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function BankPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="البنك" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>سجل المعاملات البنكية</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الوصف</TableHead>
                    <TableHead className="text-right">نوع المعاملة</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-07-15</TableCell>
                    <TableCell>إيداع أرباح الأسبوع</TableCell>
                    <TableCell className="text-green-600 font-medium">إيداع</TableCell>
                    <TableCell>+5,000.00 ريال</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-07-12</TableCell>
                    <TableCell>دفع للمورد (حبوب البن)</TableCell>
                    <TableCell className="text-red-600 font-medium">سحب</TableCell>
                    <TableCell>-800.00 ريال</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-07-10</TableCell>
                    <TableCell>دفع فاتورة الكهرباء</TableCell>
                    <TableCell className="text-red-600 font-medium">سحب</TableCell>
                    <TableCell>-350.00 ريال</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
           <Card className="mb-6">
            <CardHeader>
              <CardTitle>الرصيد الحالي</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-center">35,450.75 ريال</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>معاملة جديدة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transactionAmount">المبلغ</Label>
                <Input id="transactionAmount" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionDate">التاريخ</Label>
                <Input id="transactionDate" type="date" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="transactionDesc">الوصف</Label>
                <Input id="transactionDesc" placeholder="مثال: إيداع نقدي" />
              </div>
              <div className="flex gap-2">
                <Button className="w-full" variant="outline">
                    <ArrowUpCircle className="ml-2 h-4 w-4 text-green-500" />
                    إيداع
                </Button>
                <Button className="w-full" variant="outline">
                    <ArrowDownCircle className="ml-2 h-4 w-4 text-red-500" />
                    سحب
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
