
'use server';

import { z } from 'zod';
import { addExpense } from '@/firebase/services/expensesService';
import { revalidatePath } from 'next/cache';

const expenseSchema = z.object({
  description: z.string().min(1, 'الوصف مطلوب'),
  amount: z.coerce.number().min(0.01, 'المبلغ يجب أن يكون أكبر من صفر'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  category: z.string().min(1, 'الفئة مطلوبة'),
});

export type FormState = {
  message: string;
  errors?: z.ZodIssue[];
  success: boolean;
};

export async function addExpenseAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = expenseSchema.safeParse({
    description: formData.get('description'),
    amount: formData.get('amount'),
    date: formData.get('date'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      message: 'فشل التحقق من البيانات.',
      errors: validatedFields.error.issues,
      success: false,
    };
  }

  try {
    await addExpense(validatedFields.data);
    revalidatePath('/expenses');
    return { message: 'تمت إضافة المصروف بنجاح!', success: true };
  } catch (e: any) {
    return { message: `خطأ في إضافة المصروف: ${e.message}`, success: false };
  }
}
