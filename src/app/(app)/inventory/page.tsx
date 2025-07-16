import { PageHeader } from "@/components/page-header";
import { InventoryForecasting } from "@/components/inventory-forecasting";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="تنبؤات المخزون" />
      <InventoryForecasting />
    </div>
  );
}
