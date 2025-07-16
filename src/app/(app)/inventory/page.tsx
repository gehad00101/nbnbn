
'use client';

import { Suspense, useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { addInventoryItem, getInventoryItems, updateInventoryItem, deleteInventoryItem, type InventoryItem, type NewInventoryItem } from '@/firebase/services/inventoryService';
import { TableSkeleton } from '@/components/table-skeleton';
import { Spinner } from '@/components/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BranchGuard } from '@/components/branch-guard';


function NewItemForm({ onFormSubmit, branchId }: { onFormSubmit: () => void, branchId: string }) {
  const { toast } = useToast();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        branchId: branchId,
      });
      toast({ title: 'نجاح', description: 'تمت إضافة الصنف إلى المخزون بنجاح!' });
      setItemName('');
      setQuantity('');
      setUnitCost('');
      setUnitPrice('');
      onFormSubmit();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  )
}

function EditItemForm({ item, onFormSubmit }: { item: InventoryItem, onFormSubmit: () => void }) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: item.name,
        quantity: item.quantity,
        unitCost: item.unitCost,
        unitPrice: item.unitPrice,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleUpdateItem = async () => {
        if (!formData.name || !formData.quantity || !formData.unitCost) {
            toast({ title: 'الرجاء ملء الحقول المطلوبة (اسم الصنف، الكمية، تكلفة الوحدة)', variant: 'destructive' });
            return;
        }
        setIsSubmitting(true);
        try {
            await updateInventoryItem(item.id, {
              ...formData,
              unitPrice: formData.unitPrice ? formData.unitPrice : null
            });
            toast({ title: 'نجاح', description: 'تم تحديث الصنف بنجاح!' });
            onFormSubmit();
        } catch (error: any) {
            toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">اسم الصنف</Label>
                <Input id="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="quantity">الكمية</Label>
                <Input id="quantity" type="number" value={formData.quantity} onChange={handleChange} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="unitCost">تكلفة الوحدة</Label>
                <Input id="unitCost" type="number" value={formData.unitCost} onChange={handleChange} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="unitPrice">سعر بيع الوحدة (إن وجد)</Label>
                <Input id="unitPrice" type="number" value={formData.unitPrice ?? ''} onChange={handleChange} disabled={isSubmitting} />
            </div>
            <Button className="w-full" onClick={handleUpdateItem} disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'حفظ التعديلات'}
            </Button>
        </div>
    );
}

function InventoryTable({ items, onDataChange }: { items: InventoryItem[], onDataChange: () => void }) {
  const { toast } = useToast();
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const handleDelete = async (itemId: string) => {
    try {
      await deleteInventoryItem(itemId);
      toast({ title: 'نجاح', description: 'تم حذف الصنف بنجاح.' });
      onDataChange();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleFormSubmit = (itemId: string) => {
    setOpenDialogs(prev => ({...prev, [itemId]: false}));
    onDataChange();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>قائمة المخزون</CardTitle>
      </CardHeader>
      <CardContent>
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
                      <TableCell className="text-center space-x-2">
                          <Dialog open={openDialogs[item.id] || false} onOpenChange={(isOpen) => setOpenDialogs(prev => ({...prev, [item.id]: isOpen}))}>
                              <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                              </DialogTrigger>
                              <DialogContent>
                                  <DialogHeader>
                                      <DialogTitle>تعديل الصنف: {item.name}</DialogTitle>
                                  </DialogHeader>
                                  <EditItemForm item={item} onFormSubmit={() => handleFormSubmit(item.id)} />
                              </DialogContent>
                          </Dialog>
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          هذا الإجراء سيقوم بحذف الصنف "{item.name}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(item.id)}>حذف</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                      </TableCell>
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
      </CardContent>
    </Card>
  )
}

function InventoryPageContent({ branchId }: { branchId: string }) {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const fetchedItems = await getInventoryItems(branchId);
        setItems(fetchedItems);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [branchId]);

    if (loading) {
        return (
             <div className="flex flex-col gap-6 p-4 md:p-6">
                <PageHeader title="المخزون" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                         <TableSkeleton headers={['اسم الصنف', 'الكمية', 'تكلفة الوحدة', 'سعر البيع', 'الإجراءات']} />
                    </div>
                     <div>
                        <Card>
                          <CardHeader><CardTitle>إضافة صنف جديد</CardTitle></CardHeader>
                          <CardContent><Spinner /></CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <PageHeader title="المخزون" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
             <InventoryTable items={items} onDataChange={fetchData} />
          </div>
          <div>
            <NewItemForm onFormSubmit={fetchData} branchId={branchId} />
          </div>
        </div>
      </div>
    );
}

export default function InventoryPage() {
    return (
        <BranchGuard>
            {(branchId) => <InventoryPageContent branchId={branchId} />}
        </BranchGuard>
    )
}
