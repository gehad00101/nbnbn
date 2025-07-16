
'use client';

import { Suspense, useEffect, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { addInventoryItem, getInventoryItems, InventoryItem } from '@/firebase/services/inventoryService';
import { TableSkeleton } from '@/components/table-skeleton';
import { Spinner } from '@/components/spinner';

function InventoryPageContent() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const fetchedItems = await getInventoryItems();
      setItems(fetchedItems);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في جلب أصناف المخزون.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!itemName || !quantity || !unitCost) {
      toast({ title: 'الرجاء ملء الحقول المطلوبة (اسم الصنف، الكمية، تكلفة الوحدة)', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addInventoryItem({
        name: itemName,
        quantity: parseFloat(quantity),
        unitCost: parseFloat(unitCost),
        unitPrice: unitPrice ? parseFloat(unitPrice) : null,
      });
      toast({ title: 'نجاح', description: 'تمت إضافة الصنف إلى المخزون بنجاح!' });
      // Reset form
      setItemName('');
      setQuantity('');
      setUnitCost('');
      setUnitPrice('');
      // Refresh items
      fetchItems();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="المخزون" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>قائمة المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <TableSkeleton headers={['اسم الصنف', 'الكمية', 'تكلفة الوحدة', 'سعر البيع', 'الإجراءات']} />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">اسم الصنف</TableHead>
                        <TableHead className="text-right">الكمية المتاحة</TableHead>
                        <TableHead className="text-right">تكلفة الوحدة</TableHead>
                        <TableHead className="text-right">سعر البيع</TableHead>
                        <TableHead className="text-center">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.length > 0 ? (
                        items.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unitCost.toFixed(2)} ريال</TableCell>
                            <TableCell>{item.unitPrice ? `${item.unitPrice.toFixed(2)} ريال` : 'N/A'}</TableCell>
                            <TableCell className="text-center"><Button variant="ghost" size="sm">تعديل</Button></TableCell>
                          </TableRow>
                        ))
                      ) : (
                         <TableRow>
                            <TableCell colSpan={5} className="text-center">لا توجد أصناف في المخزون بعد.</TableCell>
                         </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>إضافة صنف جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">اسم الصنف</Label>
                <Input id="itemName" placeholder="مثال: حبوب بن" value={itemName} onChange={e => setItemName(e.target.value)} disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">الكمية</Label>
                <Input id="quantity" type="number" placeholder="0" value={quantity} onChange={e => setQuantity(e.target.value)} disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitCost">تكلفة الوحدة</Label>
                <Input id="unitCost" type="number" placeholder="0.00" value={unitCost} onChange={e => setUnitCost(e.target.value)} disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">سعر بيع الوحدة (إن وجد)</Label>
                <Input id="unitPrice" type="number" placeholder="0.00" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} disabled={isSubmitting} />
              </div>
              <Button className="w-full" onClick={handleAddItem} disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : <PlusCircle className="ml-2 h-4 w-4" />}
                {isSubmitting ? 'جار الإضافة...' : 'إضافة للمخزون'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
    return (
        <Suspense fallback={<div>جار التحميل...</div>}>
            <InventoryPageContent />
        </Suspense>
    )
}
