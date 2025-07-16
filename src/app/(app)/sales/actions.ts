
'use server';

import { z } from 'zod';
import { addSale } from '@/firebase/services/salesService';
import { revalidatePath } from 'next/cache';

const saleSchema = z.object({
  customerName: z.string().min(1, 'اسم العميل مطلوب'),
  amount: z.coerce.number().min(0.01, 'المبلغ يجب أن يكون أكبر من صفر'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  status: z.enum(['paid', 'due']),
  branchId: z.string().min(1, 'معرف الفرع مطلوب'),
});

export type FormState = {
  message: string;
  errors?: z.ZodIssue[];
  success: boolean;
};

export async function addSaleAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = saleSchema.safeParse({
    customerName: formData.get('customerName'),
    amount: formData.get('amount'),
    date: formData.get('date'),
    status: formData.get('status'),
    branchId: formData.get('branchId'),
  });

  if (!validatedFields.success) {
    return {
      message: 'فشل التحقق من البيانات.',
      errors: validatedFields.error.issues,
      success: false,
    };
  }

  try {
    await addSale(validatedFields.data);
    revalidatePath('/sales');
    return { message: 'تمت إضافة الفاتورة بنجاح!', success: true };
  } catch (e: any) {
    return { message: `خطأ في إضافة الفاتورة: ${e.message}`, success: false };
  }
}
