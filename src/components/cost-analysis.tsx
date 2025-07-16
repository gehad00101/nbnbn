"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeCosts, type CostAnalysisOutput } from "@/ai/flows/cost-analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";

const expensesExample = JSON.stringify(
  {
    rent: 5000,
    supplies: { coffee_beans: 1200, milk: 800, sugar: 200, cups: 400 },
    labor: 6000,
    utilities: 500,
  },
  null,
  2
);

const salesExample = JSON.stringify(
  {
    coffee: 15000,
    pastries: 4500,
    merchandise: 1200,
  },
  null,
  2
);

const FormSchema = z.object({
  expensesData: z.string().min(1, "بيانات المصروفات مطلوبة"),
  salesData: z.string().min(1, "بيانات المبيعات مطلوبة"),
});

type FormValues = z.infer<typeof FormSchema>;

export function CostAnalysis() {
  const [result, setResult] = useState<CostAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      expensesData: expensesExample,
      salesData: salesExample,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeCosts(data);
      setResult(analysisResult);
    } catch (error) {
      console.error("Cost analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>تحليل التكاليف</CardTitle>
          <CardDescription>
            أدخل بيانات المصروفات والمبيعات بصيغة JSON للحصول على تحليل فوري.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="expensesData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>بيانات المصروفات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل بيانات المصروفات هنا..."
                        className="h-48 font-mono text-left"
                        dir="ltr"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>بيانات المبيعات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل بيانات المبيعات هنا..."
                        className="h-48 font-mono text-left"
                        dir="ltr"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wand2 />
                )}
                <span>تحليل الآن</span>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نتائج التحليل</CardTitle>
          <CardDescription>
            توصيات وملاحظات الذكاء الاصطناعي لتحسين الأرباح.
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
                <h3 className="font-bold mb-2">ملخص التحليل:</h3>
                <p className="text-muted-foreground">{result.summary}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">أهم محركات التكلفة:</h3>
                <ul className="list-disc pr-5 space-y-1 text-muted-foreground">
                  {result.keyCostDrivers.map((driver, i) => <li key={i}>{driver}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">توصيات:</h3>
                <ul className="list-disc pr-5 space-y-1 text-muted-foreground">
                  {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>ستظهر نتائج التحليل هنا.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
