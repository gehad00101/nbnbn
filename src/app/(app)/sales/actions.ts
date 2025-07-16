
'use server';

import { z } from 'zod';
import { addSale } from '@/firebase/services/salesService';
import { addBankTransaction } from '@/firebase/services/bankService';
import { revalidatePath } from 'next/cache';

const saleSchema = z.object({
  customerName: z.string().min(1, 'اسم العميل مطلوب'),
  amount: z.coerce.number().min(0.01, 'المبلغ يجب أن يكون أكبر من صفر'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  status: z.enum(['paid', 'due']),
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
  });

  if (!validatedFields.success) {
    return {
      message: 'فشل التحقق من البيانات.',
      errors: validatedFields.error.issues,
      success: false,
    };
  }

  try {
    const newSale = await addSale(validatedFields.data);

    // Automatically create a bank deposit for the sale
    await addBankTransaction({
      amount: validatedFields.data.amount,
      date: validatedFields.data.date,
      description: `إيداع مبيعات - فاتورة ${newSale.id.slice(0,6).toUpperCase()}`,
      type: 'deposit',
    });
    
    revalidatePath('/sales');
    revalidatePath('/bank'); // Revalidate bank page as well
    return { message: 'تمت إضافة الفاتورة والإيداع البنكي بنجاح!', success: true };
  } catch (e: any) {
    return { message: `خطأ في إضافة الفاتورة: ${e.message}`, success: false };
  }
}
