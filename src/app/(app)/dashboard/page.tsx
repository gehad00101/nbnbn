
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ArrowDown, Scale } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { SalesChart } from "@/components/sales-chart"
import { RecentSales } from "@/components/recent-sales"
import { getSales } from "@/firebase/services/salesService";
import { getExpenses } from "@/firebase/services/expensesService";
import { BranchGuard } from "@/components/branch-guard";
import { Suspense, useEffect, useState } from "react";
import { Spinner } from "@/components/spinner";

type DashboardData = {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  chartData: { month: string; sales: number }[];
}

async function getDashboardData(branchId: string): Promise<DashboardData> {
  const sales = await getSales(branchId);
  const expenses = await getExpenses(branchId);

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const salesByMonth = sales.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleString('ar-EG', { month: 'long' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += sale.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesByMonth).map(([month, sales]) => ({
    month,
    sales,
  }));

  return { totalRevenue, totalExpenses, netProfit, chartData };
}

function DashboardContent({ branchId }: { branchId: string }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const dashboardData = await getDashboardData(branchId);
      setData(dashboardData);
      setLoading(false);
    }
    fetchData();
  }, [branchId]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const { totalRevenue, totalExpenses, netProfit, chartData } = data;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="لوحة التحكم" />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="إجمالي المبيعات"
          value={`${totalRevenue.toFixed(2)} ريال`}
          icon={<DollarSign className="h-6 w-6 text-blue-500" />}
          className="border-t-4 border-blue-500"
        />
        <StatCard 
          title="إجمالي المصروفات"
          value={`${totalExpenses.toFixed(2)} ريال`}
          icon={<ArrowDown className="h-6 w-6 text-red-500" />}
          className="border-t-4 border-red-500"
        />
        <StatCard 
          title="صافي الربح"
          value={`${netProfit.toFixed(2)} ريال`}
          icon={<Scale className="h-6 w-6 text-green-500" />}
           className="border-t-4 border-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>نظرة عامة على المبيعات</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>أحدث المعاملات</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Spinner />}>
              <RecentSales branchId={branchId} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <BranchGuard>
      {(branchId) => <DashboardContent branchId={branchId} />}
    </BranchGuard>
  )
}
