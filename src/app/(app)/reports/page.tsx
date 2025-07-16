import { PageHeader } from "@/components/page-header";
import { CostAnalysis } from "@/components/cost-analysis";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="تحليل التكاليف" />
      <CostAnalysis />
    </div>
  );
}
