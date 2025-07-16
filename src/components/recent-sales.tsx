import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDown, ArrowUp } from "lucide-react";

const transactions = [
  { type: "sale", name: "علي محمد", description: "قهوة اليوم", amount: "+35.00 ريال", avatar: "https://placehold.co/100x100/1.png" },
  { type: "expense", name: "إيجار المحل", description: "مصروفات شهرية", amount: "-2500.00 ريال", avatar: "" },
  { type: "sale", name: "فاطمة خالد", description: "مشروبات باردة", amount: "+22.50 ريال", avatar: "https://placehold.co/100x100/2.png" },
  { type: "expense", name: "فاتورة الكهرباء", description: "مصروفات شهرية", amount: "-350.00 ريال", avatar: "" },
  { type: "sale", name: "يوسف عبدالله", description: "حلويات", amount: "+48.00 ريال", avatar: "https://placehold.co/100x100/3.png" },
];

export function RecentSales() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            {transaction.type === 'sale' ? (
                <AvatarImage src={transaction.avatar} alt="Avatar" data-ai-hint="person portrait" />
            ) : null}
            <AvatarFallback className={transaction.type === 'sale' ? 'bg-green-100' : 'bg-red-100'}>
                {transaction.type === 'sale' ? <ArrowUp className="text-green-500"/> : <ArrowDown className="text-red-500" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-right">
            <p className="text-sm font-medium leading-none">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
          </div>
          <div className={`font-medium text-left ${transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.amount}
          </div>
        </div>
      ))}
    </div>
  );
}
