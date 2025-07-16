
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ArrowDown, Scale } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { SalesChart } from "@/components/sales-chart"
import { RecentSales } from "@/components/recent-sales"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="لوحة التحكم" />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="إجمالي المبيعات"
          value="12,345.67 ريال"
          icon={<DollarSign className="h-6 w-6 text-blue-500" />}
          className="border-t-4 border-blue-500"
          change="+12.5% من الشهر الماضي"
        />
        <StatCard 
          title="إجمالي المصروفات"
          value="4,567.89 ريال"
          icon={<ArrowDown className="h-6 w-6 text-red-500" />}
          className="border-t-4 border-red-500"
          change="+8.2% من الشهر الماضي"
        />
        <StatCard 
          title="صافي الربح"
          value="7,777.78 ريال"
          icon={<Scale className="h-6 w-6 text-green-500" />}
           className="border-t-4 border-green-500"
           change="+15.3% من الشهر الماضي"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>نظرة عامة على المبيعات</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>أحدث المعاملات</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

