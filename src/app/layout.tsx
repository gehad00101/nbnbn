
import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { BranchProvider } from "@/context/BranchContext";

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Buna | نظام محاسبي للمقهى",
  description: "نظام محاسبي مدعوم بالذكاء الإسناعي لمقهاك.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${notoKufiArabic.variable} font-body antialiased bg-background`}>
        <AuthProvider>
          <BranchProvider>
            {children}
          </BranchProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
