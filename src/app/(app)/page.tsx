import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { SalesChart } from "@/components/sales-chart"
import { RecentSales } from "@/components/recent-sales"
import { SmartAssistant } from "@/components/smart-assistant"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="لوحة التحكم">
        <SmartAssistant />
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="إجمالي المبيعات"
          value="158,340 ريال"
          change="+20.1% من الشهر الماضي"
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard 
          title="صافي الربح"
          value="45,230 ريال"
          change="+18.3% من الشهر الماضي"
          icon={<ShoppingBag className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard 
          title="تكاليف التشغيل"
          value="22,500 ريال"
          change="-5.2% من الشهر الماضي"
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard 
          title="المبيعات اليومية"
          value="3,120 ريال"
          change="+12% من أمس"
          icon={<Activity className="h-5 w-5 text-muted-foreground" />}
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
            <CardTitle>المبيعات الأخيرة</CardTitle>
            <CardDescription>
              أنت أتممت 25 مبيعة هذا اليوم.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
