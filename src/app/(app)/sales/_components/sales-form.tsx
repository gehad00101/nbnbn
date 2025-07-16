
'use client';

import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { addSaleAction, type FormState } from '../actions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const saleSchema = z.object({
  customerName: z.string().min(1, 'اسم العميل مطلوب'),
  amount: z.coerce.number().min(0.01, 'المبلغ يجب أن يكون أكبر من صفر'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  status: z.enum(['paid', 'due']),
});

type SaleFormValues = z.infer<typeof saleSchema>;

export function SalesForm({ branchId }: { branchId: string }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: FormState = { message: '', errors: undefined, success: false };
  const [state, dispatch] = useFormState(addSaleAction, initialState);

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerName: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
    },
  });

   useEffect(() => {
    if (state.success) {
      toast({ title: "نجاح", description: state.message });
      form.reset();
      formRef.current?.reset();
    } else if (state.message && state.errors) {
      toast({ title: "خطأ", description: state.message, variant: 'destructive' });
    }
  }, [state, toast, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>إضافة فاتورة جديدة</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form
          ref={formRef}
          action={dispatch}
          className="space-y-4"
        >
          <CardContent className='space-y-4'>
            <input type="hidden" name="branchId" value={branchId} />
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم العميل</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: علي محمد" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المبلغ</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>التاريخ</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>حالة الفاتورة</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4 space-x-reverse"
                    >
                      <FormItem className="flex items-center space-x-2 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="paid" id="paid" />
                        </FormControl>
                        <FormLabel htmlFor="paid" className="font-normal">
                          مدفوعة
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="due" id="due" />
                        </FormControl>
                        <FormLabel htmlFor="due" className="font-normal">
                          مستحقة
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <SubmitButton>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة فاتورة
            </SubmitButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
