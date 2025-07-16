"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { getSmartAssistantTip, type SmartAssistantTipOutput } from "@/ai/flows/smart-assistant-tips";

const mockData = {
  dailySalesData: "المشروبات الباردة كانت الأكثر مبيعًا اليوم, خاصة بين الساعة 2-5 مساءً.",
  currentInventoryLevels: "مستوى حبوب البن الإثيوبية منخفض.",
  customerTraffic: "ذروة حركة العملاء كانت في الصباح الباكر وبعد الظهر.",
};

export function SmartAssistant() {
  const [tip, setTip] = useState<SmartAssistantTipOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchTip = async () => {
    if (tip) return; // Don't re-fetch if we already have a tip
    setIsLoading(true);
    try {
      const result = await getSmartAssistantTip(mockData);
      setTip(result);
    } catch (error) {
      console.error("Failed to get smart assistant tip:", error);
      setTip({ tip: "عذرًا, حدث خطأ أثناء جلب النصيحة. الرجاء المحاولة مرة أخرى." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchTip();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full shadow-lg">
          <Wand2 className="h-5 w-5 ml-2" />
          المساعد الذكي
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>نصيحة اليوم</SheetTitle>
          <SheetDescription>
            اقتراح سريع مدعوم بالذكاء الاصطناعي لمساعدتك على زيادة الأرباح.
          </SheetDescription>
        </SheetHeader>
        <div className="py-8">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="p-4 bg-secondary rounded-lg text-lg text-center font-medium">
              <p>{tip?.tip}</p>
            </div>
          )}
        </div>
        <SheetFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                يتم إنشاء هذه النصيحة بناءً على بيانات المبيعات والمخزون وحركة العملاء.
            </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
