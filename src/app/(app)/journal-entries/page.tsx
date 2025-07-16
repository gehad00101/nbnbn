
'use client';

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { professionalChartOfAccounts } from '../chart-of-accounts/page';


interface JournalEntryRow {
  id: number;
  account: string;
  debit: string;
  credit: string;
}

const flattenAccounts = (accounts: any[], level = 0) => {
    let flatList: any[] = [];
    accounts.forEach(account => {
        flatList.push({ ...account, level });
        if (account.children && account.children.length > 0) {
            flatList = flatList.concat(flattenAccounts(account.children, level + 1));
        }
    });
    return flatList;
};

function NewJournalEntryForm() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [rows, setRows] = useState<JournalEntryRow[]>([
        { id: 1, account: '', debit: '', credit: '' },
        { id: 2, account: '', debit: '', credit: '' },
    ]);
    const { toast } = useToast();

    const flatAccounts = useMemo(() => flattenAccounts(professionalChartOfAccounts), []);

    const handleAddRow = () => {
        setRows([...rows, { id: Date.now(), account: '', debit: '', credit: '' }]);
    };

    const handleRemoveRow = (id: number) => {
        if (rows.length <= 2) {
            toast({ title: "لا يمكن أن يحتوي القيد على أقل من سطرين", variant: "destructive" });
            return;
        }
        setRows(rows.filter(row => row.id !== id));
    };

    const handleRowChange = (id: number, field: keyof Omit<JournalEntryRow, 'id'>, value: string) => {
        setRows(rows.map(row => {
            if (row.id === id) {
                 if (field === 'debit' && value) {
                    return { ...row, [field]: value, credit: '' };
                }
                if (field === 'credit' && value) {
                    return { ...row, [field]: value, debit: '' };
                }
                return { ...row, [field]: value };
            }
            return row;
        }));
    };

    const { totalDebit, totalCredit, isBalanced } = useMemo(() => {
        const totalDebit = rows.reduce((acc, row) => acc + (parseFloat(row.debit) || 0), 0);
        const totalCredit = rows.reduce((acc, row) => acc + (parseFloat(row.credit) || 0), 0);
        const isBalanced = totalDebit === totalCredit && totalDebit > 0;
        return { totalDebit, totalCredit, isBalanced };
    }, [rows]);

    const handleSave = (asDraft: boolean) => {
        if (!description) {
            toast({ title: "الرجاء إدخال وصف القيد", variant: "destructive" });
            return;
        }
        if (!isBalanced) {
            toast({ title: "القيد غير متزن", description: "يجب أن يتساوى إجمالي المدين مع إجمالي الدائن.", variant: "destructive" });
            return;
        }
        
        console.log("Saving Entry:", { date, description, rows, totalDebit, totalCredit });
        toast({ title: "نجاح", description: `تم حفظ القيد ${asDraft ? 'كمسودة' : ''} بنجاح!` });
        
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
        setRows([
            { id: 1, account: '', debit: '', credit: '' },
            { id: 2, account: '', debit: '', credit: '' },
        ]);
    };

    return (
        <Card>
            <CardHeader>
              <CardTitle>إنشاء قيد يومية جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                 <label htmlFor="entryDate" className="block text-sm font-medium text-muted-foreground mb-1">تاريخ القيد</label>
                 <Input id="entryDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                 <label htmlFor="entryDesc" className="block text-sm font-medium text-muted-foreground mb-1">وصف القيد</label>
                 <Input id="entryDesc" placeholder="مثال: تسجيل فاتورة مشتريات" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-lg font-semibold mb-2">تفاصيل القيد</h4>
                <div className="space-y-2">
                    {rows.map(row => (
                        <div key={row.id} className="flex flex-col sm:flex-row gap-2 sm:items-end">
                           <div className="flex-1">
                                <Select 
                                    dir="rtl"
                                    value={row.account}
                                    onValueChange={(value) => handleRowChange(row.id, 'account', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر الحساب" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {flatAccounts.map(account => (
                                            <SelectItem 
                                                key={account.id} 
                                                value={account.id}
                                                disabled={account.type === 'header'}
                                                style={{ paddingRight: `${account.level * 1.5}rem` }}
                                            >
                                                <span className={cn(account.type === 'header' ? 'font-bold' : '')}>{account.name}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                           </div>
                           <div className="flex gap-2 w-full sm:w-auto">
                             <Input 
                                type="number" 
                                className="flex-1" 
                                placeholder="مدين" 
                                value={row.debit}
                                onChange={(e) => handleRowChange(row.id, 'debit', e.target.value)}
                             />
                             <Input 
                                type="number" 
                                className="flex-1" 
                                placeholder="دائن" 
                                value={row.credit}
                                onChange={(e) => handleRowChange(row.id, 'credit', e.target.value)}
                            />
                             <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive shrink-0" onClick={() => handleRemoveRow(row.id)}>
                                <Trash2 className="h-4 w-4" />
                             </Button>
                           </div>
                        </div>
                    ))}
                </div>
                 <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleAddRow}>
                    <PlusCircle className="ml-2 h-4 w-4" />
                    إضافة سطر
                 </Button>
              </div>

              <div className="flex justify-between items-center font-bold text-lg border-t pt-4 mt-4">
                  <span>الإجمالي</span>
                  <div className="flex gap-4 font-mono">
                    <span>{totalDebit.toFixed(2)}</span>
                    <span>{totalCredit.toFixed(2)}</span>
                  </div>
              </div>
               <Badge className={cn("text-center w-full", isBalanced ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600')} >
                  {isBalanced ? 'متزن' : 'غير متزن'}
                </Badge>

            </CardContent>
            <CardFooter className="flex gap-2 flex-col sm:flex-row">
                 <Button className="w-full" onClick={() => handleSave(false)} disabled={!isBalanced}>
                    <PlusCircle className="ml-2 h-4 w-4" />
                    حفظ القيد
                </Button>
                 <Button className="w-full" variant="outline" onClick={() => handleSave(true)} disabled={!isBalanced}>
                    حفظ كمسودة
                </Button>
            </CardFooter>
          </Card>
    );
}

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
              <div className="overflow-x-auto">
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
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <NewJournalEntryForm />
        </div>
      </div>
    </div>
  );
}
