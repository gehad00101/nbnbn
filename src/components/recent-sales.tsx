
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDown, ArrowUp } from "lucide-react";
import { getBankTransactions } from "@/firebase/services/bankService";
import { Badge } from "./ui/badge";

export async function RecentSales() {
  const transactions = (await getBankTransactions()).slice(0, 5);

  return (
    <div className="space-y-4">
      {transactions.length > 0 ? transactions.map((transaction, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className={transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'}>
                {transaction.type === 'deposit' ? <ArrowUp className="text-green-500"/> : <ArrowDown className="text-red-500" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-right">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString('ar-EG')}</p>
          </div>
          <div className={`font-medium text-left`}>
             <Badge variant={transaction.type === 'deposit' ? 'default' : 'destructive'}>
                {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toFixed(2)} ريال
             </Badge>
          </div>
        </div>
      )) : (
        <p className="text-sm text-muted-foreground text-center">لا توجد معاملات حديثة.</p>
      )}
    </div>
  );
}

    