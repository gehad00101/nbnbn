"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { invoiceOcr, type InvoiceOcrOutput } from "@/ai/flows/invoice-ocr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Wand2 } from "lucide-react";
import Image from 'next/image';

const FormSchema = z.object({
  invoicePhoto: z.instanceof(File).refine(file => file.size > 0, "الرجاء تحميل صورة فاتورة"),
});

type FormValues = z.infer<typeof FormSchema>;

export function InvoiceScanner() {
  const [result, setResult] = useState<InvoiceOcrOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(data.invoicePhoto);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const ocrResult = await invoiceOcr({ photoDataUri });
        setResult(ocrResult);
      } catch (error) {
        console.error("Invoice OCR failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error("File reading error:", error);
      setIsLoading(false);
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("invoicePhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>مسح فاتورة جديدة</CardTitle>
          <CardDescription>
            استخدم كاميرا هاتفك أو حمّل صورة فاتورة لاستخلاص البيانات تلقائيًا.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="invoicePhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>صورة الفاتورة</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted">
                          {preview ? (
                             <Image src={preview} alt="Invoice preview" width={256} height={256} className="object-contain h-full w-full" />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">انقر للتحميل</span> أو اسحب وأفلت</p>
                              <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                            </div>
                          )}
                          <Input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                <span>امسح الفاتورة</span>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>البيانات المستخلصة</CardTitle>
          <CardDescription>
            هذه هي البيانات التي تم استخلاصها من الفاتورة بواسطة الذكاء الاصطناعي.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">اسم المورد:</span>
                <span className="font-medium">{result.supplierName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">المبلغ الإجمالي:</span>
                <span className="font-medium">{result.amount} ريال</span>
              </div>
              <div>
                <h3 className="text-muted-foreground mb-2">الأصناف:</h3>
                <ul className="list-disc pr-5 space-y-1">
                  {result.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          )}
          {!isLoading && !result && (
             <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>ستظهر البيانات المستخلصة هنا.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
