
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Expense } from "@/firebase/services/expensesService";

type ExpensesTableProps = {
  expenses: Expense[];
};

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  const getCategoryDisplayName = (category: string) => {
    const categories: { [key: string]: string } = {
      rent: 'إيجار',
      salaries: 'رواتب',
      purchases: 'مشتريات',
      bills: 'فواتير',
      maintenance: 'صيانة',
      marketing: 'تسويق',
      other: 'أخرى',
    };
    return categories[category] || category;
  };

  return (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{getCategoryDisplayName(expense.category)}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.amount.toFixed(2)} ريال</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  لا توجد مصروفات لهذا الفرع بعد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
