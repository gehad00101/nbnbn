import { PageHeader } from "@/components/page-header";
import { InvoiceScanner } from "@/components/invoice-scanner";

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="مسح وإدارة الفواتير" />
      <InvoiceScanner />
    </div>
  );
}
