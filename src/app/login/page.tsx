
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

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input id="password" type="password" required dir="ltr" />
            </div>
            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
            <Button variant="outline" className="w-full">
              تسجيل الدخول باستخدام Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="underline">
              سجل الآن
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
