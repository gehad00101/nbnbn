
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { addExpenseAction, type FormState } from '../actions';

const expenseSchema = z.object({
  description: z.string().min(1, 'الوصف مطلوب'),
  amount: z.coerce.number().min(0.01, 'المبلغ يجب أن يكون أكبر من صفر'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  category: z.string().min(1, 'الفئة مطلوبة'),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export function ExpensesForm({ branchId }: { branchId: string }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: FormState = { message: '', errors: undefined, success: false };
  const [state, dispatch] = useFormState(addExpenseAction, initialState);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
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
        <CardTitle>إضافة مصروف جديد</CardTitle>
      </CardHeader>
       <Form {...form}>
        <form
          ref={formRef}
          action={dispatch}
          className="space-y-4"
        >
          <CardContent className="space-y-4">
            <input type="hidden" name="branchId" value={branchId} />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: فاتورة الكهرباء" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الفئة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          <SelectItem value="rent">إيجار</SelectItem>
                          <SelectItem value="salaries">رواتب</SelectItem>
                          <SelectItem value="purchases">مشتريات</SelectItem>
                          <SelectItem value="bills">فواتير</SelectItem>
                          <SelectItem value="maintenance">صيانة</SelectItem>
                          <SelectItem value="marketing">تسويق</SelectItem>
                          <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
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
          </CardContent>
          <CardFooter>
            <SubmitButton>
              <PlusCircle className="ml-2 h-4 w-4" />
              حفظ المصروف
            </SubmitButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
