import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="إدارة المستخدمين">
        <Button>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة مستخدم جديد
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
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
                    <div>
                        <div className="font-medium">صالح الأحمد</div>
                        <div className="text-sm text-muted-foreground">saleh@buna.co</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge>المالك</Badge></TableCell>
                <TableCell>2023-01-15</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                      <DropdownMenuItem>تعديل</DropdownMenuItem>
                      <DropdownMenuItem>حذف</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
               <TableRow>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/100x100.png" alt="نورة عبدالله" data-ai-hint="person portrait" />
                      <AvatarFallback>NA</AvatarFallback>
                    </Avatar>
                     <div>
                        <div className="font-medium">نورة عبدالله</div>
                        <div className="text-sm text-muted-foreground">noura@buna.co</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary">مدير فرع</Badge></TableCell>
                <TableCell>2023-05-20</TableCell>
                <TableCell className="text-center">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                      <DropdownMenuItem>تعديل</DropdownMenuItem>
                      <DropdownMenuItem>حذف</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
