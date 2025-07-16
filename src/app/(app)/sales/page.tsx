import { PageHeader } from "@/components/page-header";
import { SalesForm } from "./_components/sales-form";
import { SalesTable } from "./_components/sales-table";
import { getSalesForBranch } from "@/firebase/services/salesService";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/table-skeleton";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: { branchId: string };
}) {
  const { branchId } = searchParams;

  if (!branchId) {
    return (
       <div className="flex flex-col gap-6 p-4 md:p-6">
        <PageHeader title="المبيعات" />
        <div className="text-center text-muted-foreground">
          الرجاء تحديد فرع أولاً لعرض بيانات المبيعات.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="المبيعات" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<TableSkeleton headers={['رقم الفاتورة', 'العميل', 'التاريخ', 'المبلغ', 'الحالة']} />}>
            <SalesTableContent branchId={branchId} />
          </Suspense>
        </div>
        <div>
          <SalesForm branchId={branchId} />
        </div>
      </div>
    </div>
  );
}

async function SalesTableContent({ branchId }: { branchId: string }) {
  const sales = await getSalesForBranch(branchId);
  return <SalesTable sales={sales} />;
}
