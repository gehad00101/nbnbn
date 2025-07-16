import { PageHeader } from "@/components/page-header";
import { SalesForm } from "./_components/sales-form";
import { SalesTable } from "./_components/sales-table";
import { getSales } from "@/firebase/services/salesService";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/table-skeleton";

export default async function SalesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="المبيعات" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<TableSkeleton headers={['رقم الفاتورة', 'العميل', 'التاريخ', 'المبلغ', 'الحالة']} />}>
            <SalesTableContent />
          </Suspense>
        </div>
        <div>
          <SalesForm />
        </div>
      </div>
    </div>
  );
}

async function SalesTableContent() {
  const sales = await getSales();
  return <SalesTable sales={sales} />;
}
