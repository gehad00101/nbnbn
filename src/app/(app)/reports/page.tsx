import { getSales } from "@/firebase/services/salesService";
import { getExpenses } from "@/firebase/services/expensesService";
import { ReportsClientPage } from "./_components/reports-client";

export default async function ReportsPage() {
  const sales = await getSales();
  const expenses = await getExpenses();

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


  return (
    <ReportsClientPage
      totalRevenue={totalRevenue}
      totalExpenses={totalExpenses}
      netProfit={netProfit}
      invoiceCount={invoiceCount}
      sales={sales}
      expenses={expenses}
      chartData={chartData}
    />
  );
}

    