
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <h1 className="text-xl font-bold">المحاسب الذكي</h1>
          </Link>
          <nav className="flex gap-4 items-center">
            <Button variant="ghost" asChild>
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
            <Button asChild>
              <Link href="/register">إنشاء حساب</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto text-center py-20">
          <h2 className="text-5xl font-bold mb-4">
            نظام المحاسبة الذكي لمقهاك
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            إدارة المبيعات، المصروفات، والمخزون بكل سهولة.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">إبدأ الآن مجاناً</Link>
          </Button>
        </section>
      </main>

      <footer className="p-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} المحاسب الذكي. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
