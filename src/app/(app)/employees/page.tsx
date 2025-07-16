import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EmployeesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="الموظفين">
        <div className="flex gap-2">
          <Button>
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة موظف جديد
          </Button>
          <Button variant="outline">
            <FileDown className="ml-2 h-4 w-4" />
            تصدير القائمة
          </Button>
        </div>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة الموظفين</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الموظف</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">الفرع</TableHead>
                <TableHead className="text-right">تاريخ الانضمام</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/100x100.png" alt="صالح الأحمد" data-ai-hint="person portrait" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">صالح الأحمد</div>
                  </div>
                </TableCell>
                <TableCell>المالك</TableCell>
                <TableCell>الفرع الرئيسي</TableCell>
                <TableCell>2023-01-15</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm">عرض</Button>
                </TableCell>
              </TableRow>
               <TableRow>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/100x100.png" alt="نورة عبدالله" data-ai-hint="person portrait" />
                      <AvatarFallback>NA</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">نورة عبدالله</div>
                  </div>
                </TableCell>
                <TableCell>مدير فرع</TableCell>
                <TableCell>فرع المطار</TableCell>
                <TableCell>2023-05-20</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm">عرض</Button>
                </TableCell>
              </TableRow>
               <TableRow>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/100x100.png" alt="خالد الفيصل" data-ai-hint="person portrait" />
                      <AvatarFallback>KF</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">خالد الفيصل</div>
                  </div>
                </TableCell>
                <TableCell>باريستا</TableCell>
                <TableCell>الفرع الرئيسي</TableCell>
                <TableCell>2024-02-10</TableCell>
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
