
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">إنشاء حساب</CardTitle>
          <CardDescription>
            أدخل معلوماتك لإنشاء حساب جديد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">الاسم الأول</Label>
                <Input id="first-name" placeholder="صالح" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">الاسم الأخير</Label>
                <Input id="last-name" placeholder="الأحمد" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                dir="ltr"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" dir="ltr" />
            </div>
            <Button type="submit" className="w-full">
              إنشاء حساب
            </Button>
             <Button variant="outline" className="w-full">
              التسجيل باستخدام Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="underline">
              تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
