import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sales = [
  { name: "علي محمد", email: "ali@example.com", amount: "+35.00 ريال", avatar: "https://placehold.co/100x100/1.png" },
  { name: "فاطمة خالد", email: "fatima@example.com", amount: "+22.50 ريال", avatar: "https://placehold.co/100x100/2.png" },
  { name: "يوسف عبدالله", email: "yousef@example.com", amount: "+48.00 ريال", avatar: "https://placehold.co/100x100/3.png" },
  { name: "نورة سعد", email: "noura@example.com", amount: "+15.75 ريال", avatar: "https://placehold.co/100x100/4.png" },
  { name: "محمد فهد", email: "mohammed@example.com", amount: "+55.20 ريال", avatar: "https://placehold.co/100x100/5.png" },
];

export function RecentSales() {
  return (
    <div className="space-y-6">
      {sales.map((sale, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.avatar} alt="Avatar" data-ai-hint="person portrait" />
            <AvatarFallback>{sale.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-right">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="font-medium text-left">{sale.amount}</div>
        </div>
      ))}
    </div>
  );
}
