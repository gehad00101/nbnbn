import { PageHeader } from "@/components/page-header";
import { ExpensesForm } from "./_components/expenses-form";
import { ExpensesTable } from "./_components/expenses-table";
import { getExpensesForBranch } from "@/firebase/services/expensesService";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/table-skeleton";


export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: { branchId: string };
}) {
  const { branchId } = searchParams;

  if (!branchId) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <PageHeader title="المصروفات" />
        <div className="text-center text-muted-foreground">
          الرجاء تحديد فرع أولاً لعرض بيانات المصروفات.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="المصروفات" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <Suspense fallback={<TableSkeleton headers={['الوصف', 'الفئة', 'التاريخ', 'المبلغ']} />}>
            <ExpensesTableContent branchId={branchId} />
          </Suspense>
        </div>
        <div>
          <ExpensesForm branchId={branchId} />
        </div>
      </div>
    </div>
  );
}


async function ExpensesTableContent({ branchId }: { branchId: string }) {
  const expenses = await getExpensesForBranch(branchId);
  return <ExpensesTable expenses={expenses} />;
}
