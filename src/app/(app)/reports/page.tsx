
'use client';

import { getSales } from "@/firebase/services/salesService";
import { getExpenses } from "@/firebase/services/expensesService";
import { ReportsClientPage } from "./_components/reports-client";
import { BranchGuard } from "@/components/branch-guard";
import { useEffect, useState } from "react";
import type { Sale } from "@/firebase/services/salesService";
import type { Expense } from "@/firebase/services/expensesService";
import { Spinner } from "@/components/spinner";

type ReportData = {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  invoiceCount: number;
  sales: Sale[];
  expenses: Expense[];
  chartData: { month: string; sales: number }[];
};

function ReportsContent({ branchId }: { branchId: string }) {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const sales = await getSales(branchId);
      const expenses = await getExpenses(branchId);

      const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0);
      const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
      const netProfit = totalRevenue - totalExpenses;
      const invoiceCount = sales.length;
      
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

      setData({
        totalRevenue,
        totalExpenses,
        netProfit,
        invoiceCount,
        sales,
        expenses,
        chartData
      });
      setLoading(false);
    };

    fetchData();
  }, [branchId]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <ReportsClientPage
      totalRevenue={data.totalRevenue}
      totalExpenses={data.totalExpenses}
      netProfit={data.netProfit}
      invoiceCount={data.invoiceCount}
      sales={data.sales}
      expenses={data.expenses}
      chartData={data.chartData}
    />
  );
}

export default function ReportsPage() {
  return (
    <BranchGuard>
      {(branchId) => <ReportsContent branchId={branchId} />}
    </BranchGuard>
  );
}
