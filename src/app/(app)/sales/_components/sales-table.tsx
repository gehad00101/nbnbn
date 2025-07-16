
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Sale } from "@/firebase/services/salesService";

type SalesTableProps = {
  sales: Sale[];
};

export function SalesTable({ sales }: SalesTableProps) {
  return (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono">INV-{sale.id.slice(0,6).toUpperCase()}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.amount.toFixed(2)} ريال</TableCell>
                  <TableCell>
                     <Badge variant={sale.status === 'paid' ? 'default' : 'secondary'}>
                      {sale.status === 'paid' ? 'مدفوعة' : 'مستحقة'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  لا توجد فواتير لهذا الفرع بعد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
