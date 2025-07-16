
'use client';

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useBranch } from "@/context/BranchContext";
import { Spinner } from "@/components/spinner";

export default function BranchesPage() {
  const { branches, addBranch, deleteBranch, selectBranch, selectedBranch, loading } = useBranch();
  const [newBranchName, setNewBranchName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddBranch = async () => {
    if (!newBranchName.trim()) {
      toast({ title: "الرجاء إدخال اسم فرع صالح.", variant: "destructive" });
      return;
    }
    setIsAdding(true);
    try {
      await addBranch(newBranchName);
      setNewBranchName('');
      toast({ title: "تمت إضافة الفرع بنجاح!" });
    } catch (error: any) {
      toast({ title: "خطأ في إضافة الفرع", description: error.message, variant: "destructive" });
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleDeleteBranch = async (branchId: string, branchName: string) => {
     if (branches.length <= 1) {
      toast({ title: "لا يمكن حذف الفرع الوحيد.", description: "يجب أن يكون هناك فرع واحد على الأقل.", variant: "destructive" });
      return;
    }
    if (confirm(`هل أنت متأكد من حذف فرع "${branchName}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      try {
        await deleteBranch(branchId);
        toast({ title: `تم حذف فرع "${branchName}" بنجاح.` });
      } catch (error: any) {
        toast({ title: "خطأ في حذف الفرع", description: error.message, variant: "destructive" });
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title="الفروع" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>قائمة الفروع</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم الفرع</TableHead>
                    <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                     <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          <div className="flex justify-center items-center p-4">
                            <Spinner />
                          </div>
                        </TableCell>
                      </TableRow>
                  ) : branches.length > 0 ? (
                    branches.map((branch) => (
                      <TableRow key={branch.id} className={branch.id === selectedBranch?.id ? 'bg-secondary' : ''}>
                        <TableCell className="font-medium">{branch.name}</TableCell>
                        <TableCell>{branch.createdAt ? new Date(branch.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'غير متوفر'}</TableCell>
                        <TableCell className="text-center space-x-2">
                           <Button variant="outline" size="sm" onClick={() => selectBranch(branch.id)} disabled={branch.id === selectedBranch?.id}>
                            {branch.id === selectedBranch?.id ? 'محدد حالياً' : 'تحديد'}
                           </Button>
                           <Button variant="destructive" size="icon" onClick={() => handleDeleteBranch(branch.id, branch.name)} disabled={branches.length <= 1}>
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        لم يتم العثور على فروع. قم بإضافة فرع جديد.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>إضافة فرع جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="اسم الفرع الجديد" 
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                disabled={isAdding}
              />
              <Button onClick={handleAddBranch} className="w-full" disabled={isAdding}>
                {isAdding ? <Spinner /> : <PlusCircle className="ml-2 h-4 w-4" />}
                {isAdding ? 'جار الإضافة...' : 'إضافة فرع'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
