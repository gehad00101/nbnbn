"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { inventoryForecasting, type InventoryForecastingOutput } from "@/ai/flows/inventory-forecasting";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";

const FormSchema = z.object({
  salesData: z.string().min(1, "بيانات المبيعات مطلوبة"),
  peakSeasons: z.string().min(1, "مواسم الذروة مطلوبة"),
  leadTimeDays: z.coerce.number().min(0, "يجب أن يكون وقت التسليم رقمًا موجبًا"),
  currentStockLevels: z.string().min(1, "مستويات المخزون الحالية مطلوبة"),
});

type FormValues = z.infer<typeof FormSchema>;

export function InventoryForecasting() {
  const [result, setResult] = useState<InventoryForecastingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      salesData: "الأسبوع الماضي: 100 لاتيه, 80 كابتشينو, 50 قهوة سوداء.",
      peakSeasons: "عطلة نهاية الأسبوع, الصباح الباكر (8-10 صباحًا).",
      leadTimeDays: 2,
      currentStockLevels: "حبوب بن: 10 كجم, حليب: 20 لتر, سكر: 5 كجم.",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const forecastResult = await inventoryForecasting(data);
      setResult(forecastResult);
    } catch (error) {
      console.error("Inventory forecasting failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>تنبؤ المخزون</CardTitle>
          <CardDescription>
            أدخل البيانات الحالية ليقوم الذكاء الاصطناعي بتوقع احتياجاتك المستقبلية.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="salesData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>بيانات المبيعات التاريخية</FormLabel>
                    <FormControl>
                      <Textarea placeholder="مثال: الأسبوع الماضي..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="peakSeasons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مواسم الذروة والأعياد</FormLabel>
                    <FormControl>
                      <Textarea placeholder="مثال: عطلات نهاية الأسبوع..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentStockLevels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مستويات المخزون الحالية</FormLabel>
                    <FormControl>
                      <Textarea placeholder="مثال: حبوب البن: 10 كجم..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadTimeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وقت وصول الطلب (بالأيام)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                <span>تنبأ الآن</span>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نتائج التنبؤ</CardTitle>
          <CardDescription>
            توصيات الذكاء الاصطناعي بشأن موعد وكمية إعادة الطلب.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">رسالة التنبيه:</h3>
                <p className="p-4 bg-secondary rounded-md text-secondary-foreground">{result.notificationMessage}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">الاحتياجات المتوقعة للمخزون:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{result.predictedInventoryNeeds}</p>
              </div>
            </div>
          )}
           {!isLoading && !result && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>ستظهر نتائج التنبؤ هنا.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
