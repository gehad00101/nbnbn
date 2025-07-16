
'use client';

import { Suspense, useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { addBankTransaction, getBankTransactions, BankTransaction } from '@/firebase/services/bankService';
import { TableSkeleton } from '@/components/table-skeleton';
import { Spinner } from '@/components/spinner';
import { BranchGuard } from '@/components/branch-guard';
import { useRouter } from 'next/navigation';


function BankTable({ transactions }: { transactions: BankTransaction[] }) {
  const balance = transactions.reduce((acc, t) => {
    return t.type === 'deposit' ? acc + t.amount : acc - t.amount;
  }, 0);

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>الرصيد الحالي</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-center">
            {`${balance.toFixed(2)} ريال`}
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>سجل المعاملات البنكية</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
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
                  {transactions.length > 0 ? (
                    transactions.map(t => (
                      <TableRow key={t.id}>
                        <TableCell>{t.date}</TableCell>
                        <TableCell>{t.description}</TableCell>
                        <TableCell className={t.type === 'deposit' ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {t.type === 'deposit' ? 'إيداع' : 'سحب'}
                        </TableCell>
                        <TableCell>{t.type === 'deposit' ? '+' : '-'}{t.amount.toFixed(2)} ريال</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">لا توجد معاملات بعد.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </>
  );
}


function NewTransactionForm({ branchId, onTransactionAdded }: { branchId: string, onTransactionAdded: () => void }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleTransaction = async (type: 'deposit' | 'withdrawal') => {
    if (!amount || !date || !description) {
      toast({ title: 'الرجاء ملء جميع الحقول', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addBankTransaction({
        amount: parseFloat(amount),
        date,
        description,
        type,
        branchId
      });
      toast({ title: 'نجاح', description: `تمت عملية ال${type === 'deposit' ? 'إيداع' : 'سحب'} بنجاح!` });
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      onTransactionAdded();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>معاملة جديدة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="transactionAmount">المبلغ</Label>
          <Input id="transactionAmount" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} disabled={isSubmitting} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transactionDate">التاريخ</Label>
          <Input id="transactionDate" type="date" value={date} onChange={e => setDate(e.target.value)} disabled={isSubmitting} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transactionDesc">الوصف</Label>
          <Input id="transactionDesc" placeholder="مثال: إيداع نقدي" value={description} onChange={e => setDescription(e.target.value)} disabled={isSubmitting} />
        </div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <Button className="w-full" variant="outline" onClick={() => handleTransaction('deposit')} disabled={isSubmitting}>
              {isSubmitting ? <Spinner/> : <ArrowUpCircle className="ml-2 h-4 w-4 text-green-500" />}
              إيداع
          </Button>
          <Button className="w-full" variant="outline" onClick={() => handleTransaction('withdrawal')} disabled={isSubmitting}>
              {isSubmitting ? <Spinner/> : <ArrowDownCircle className="ml-2 h-4 w-4 text-red-500" />}
              سحب
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


function BankPageContent({ branchId }: { branchId: string }) {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTransactions = async () => {
    setLoading(true);
    const data = await getBankTransactions(branchId);
    setTransactions(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchTransactions();
  }, [branchId]);

  const handleTransactionAdded = () => {
    fetchTransactions();
    // Also refresh other pages that might use this data like dashboard
    router.refresh();
  };


  if (loading) {
     return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <PageHeader title="البنك والكاش" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TableSkeleton headers={['التاريخ', 'الوصف', 'نوع المعاملة', 'المبلغ']} />
                </div>
                <div>
                    <Card>
                      <CardHeader><CardTitle>معاملة جديدة</CardTitle></CardHeader>
                      <CardContent><Spinner /></CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="البنك والكاش" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BankTable transactions={transactions} />
        </div>
        <div>
          <NewTransactionForm branchId={branchId} onTransactionAdded={handleTransactionAdded} />
        </div>
      </div>
    </div>
  );
}


export default function BankPage() {
  return (
    <BranchGuard>
      {(branchId) => <BankPageContent branchId={branchId} />}
    </BranchGuard>
  )
}
