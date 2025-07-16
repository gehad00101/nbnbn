import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  icon: ReactNode;
  className?: string;
};

export function StatCard({ title, value, change, icon, className }: StatCardProps) {
  return (
    <Card className={cn("bg-white p-6 rounded-xl shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
        <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {change && <p className="text-xs text-muted-foreground">{change}</p>}
      </CardContent>
    </Card>
  );
}
